import { prisma } from '../lib/prisma';
import { UserJwtPayload } from '../utils/jwt';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';

export type TicketStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface TicketDTO {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: Priority;
  agentId: string | null;
  agent?: { id: string; name: string; email: string } | null;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  replies?: Array<{
    id: string;
    ticketId: string;
    userId: string;
    content: string;
    createdAt: Date;
    user?: { id: string; name: string; email: string };
  }>;
}

export interface UpdateTicketInput {
  status?: TicketStatus;
  priority?: Priority;
  tags?: string[];
  agentId?: string;
}

export class TicketService {
  private static parseTags(tagsStr: string): string[] {
    try {
      const parsed = JSON.parse(tagsStr);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  static async getTickets(
    user: UserJwtPayload,
    page: number = 1,
    limit: number = 10
  ): Promise<{ tickets: TicketDTO[]; pagination: PaginationMeta }> {
    const skip = (page - 1) * limit;

    // Security Rule: AGENT gets only assigned tickets; ADMIN gets system-wide
    const whereCondition = user.role === 'ADMIN' ? {} : { agentId: user.id };

    const [total, rawTickets] = await Promise.all([
      prisma.ticket.count({ where: whereCondition }),
      prisma.ticket.findMany({
        where: whereCondition,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          agent: {
            select: { id: true, name: true, email: true },
          },
        },
      }),
    ]);

    const tickets: TicketDTO[] = rawTickets.map((t) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status as TicketStatus,
      priority: t.priority as Priority,
      agentId: t.agentId,
      agent: t.agent,
      tags: this.parseTags(t.tags),
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    }));

    return {
      tickets,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  static async getTicketById(ticketId: string, user: UserJwtPayload): Promise<TicketDTO> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
      include: {
        agent: {
          select: { id: true, name: true, email: true },
        },
        replies: {
          orderBy: { createdAt: 'asc' },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
          },
        },
      },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Security Rule: AGENT can only access ticket assigned to them
    if (user.role !== 'ADMIN' && ticket.agentId !== user.id) {
      // Return 404 to avoid leaking existence of unauthorized tickets
      throw new NotFoundError('Ticket not found');
    }

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status as TicketStatus,
      priority: ticket.priority as Priority,
      agentId: ticket.agentId,
      agent: ticket.agent,
      tags: this.parseTags(ticket.tags),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      replies: ticket.replies.map((r) => ({
        id: r.id,
        ticketId: r.ticketId,
        userId: r.userId,
        content: r.content,
        createdAt: r.createdAt,
        user: r.user,
      })),
    };
  }

  static async updateTicket(
    ticketId: string,
    input: UpdateTicketInput,
    user: UserJwtPayload
  ): Promise<TicketDTO> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Security Rule: AGENT can only update assigned ticket
    if (user.role !== 'ADMIN' && ticket.agentId !== user.id) {
      throw new ForbiddenError('You are not authorized to update this ticket');
    }

    const updateData: {
      status?: string;
      priority?: string;
      tags?: string;
      agentId?: string;
    } = {};

    if (input.status) updateData.status = input.status;
    if (input.priority) updateData.priority = input.priority;
    if (input.tags) updateData.tags = JSON.stringify(input.tags);

    // Only Admin can reassign tickets
    if (input.agentId !== undefined) {
      if (user.role !== 'ADMIN') {
        throw new ForbiddenError('Only administrators can reassign tickets');
      }
      updateData.agentId = input.agentId;
    }

    const updated = await prisma.ticket.update({
      where: { id: ticketId },
      data: updateData,
      include: {
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      id: updated.id,
      title: updated.title,
      description: updated.description,
      status: updated.status as TicketStatus,
      priority: updated.priority as Priority,
      agentId: updated.agentId,
      agent: updated.agent,
      tags: this.parseTags(updated.tags),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  static async getReplies(ticketId: string, user: UserJwtPayload) {
    // Check ticket exists & authorization
    await this.getTicketById(ticketId, user);

    const replies = await prisma.reply.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return replies.map((r) => ({
      id: r.id,
      ticketId: r.ticketId,
      userId: r.userId,
      content: r.content,
      createdAt: r.createdAt,
      user: r.user,
    }));
  }

  static async createReply(ticketId: string, content: string, user: UserJwtPayload) {
    // Check ticket exists & authorization
    await this.getTicketById(ticketId, user);

    if (!content || !content.trim()) {
      throw new BadRequestError('Reply content cannot be empty');
    }

    const reply = await prisma.reply.create({
      data: {
        ticketId,
        userId: user.id,
        content: content.trim(),
      },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      id: reply.id,
      ticketId: reply.ticketId,
      userId: reply.userId,
      content: reply.content,
      createdAt: reply.createdAt,
      user: reply.user,
    };
  }
}
