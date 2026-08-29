import { prisma } from '../lib/prisma';
import { UserJwtPayload } from '../utils/jwt';
import { NotFoundError, ForbiddenError, BadRequestError } from '../utils/errors';
import { TicketStatus, Priority } from '@prisma/client';
export { TicketStatus, Priority };


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

export interface CreateTicketInput {
  title: string;
  description: string;
  status?: TicketStatus;
  priority?: Priority;
  tags?: string[];
  agentId?: string;
}

export interface UpdateTicketInput {
  title?: string;
  description?: string;
  status?: TicketStatus;
  priority?: Priority;
  tags?: string[];
  agentId?: string;
}

export interface TicketFilterOptions {
  status?: TicketStatus;
  priority?: Priority;
  search?: string;
  tag?: string;
}

export interface AttachmentInput {
  fileName: string;
  fileType: string;
  fileSize: number;
  contentBase64?: string;
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

  static async createTicket(input: CreateTicketInput, user: UserJwtPayload): Promise<TicketDTO> {
    const assignedAgentId =
      user.role === 'ADMIN' ? input.agentId || user.id : user.id;

    const created = await prisma.ticket.create({
      data: {
        title: input.title.trim(),
        description: input.description.trim(),
        status: input.status || 'OPEN',
        priority: input.priority || 'MEDIUM',
        agentId: assignedAgentId,
        tags: JSON.stringify(input.tags || []),
      },
      include: {
        agent: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    return {
      id: created.id,
      title: created.title,
      description: created.description,
      status: created.status as TicketStatus,
      priority: created.priority as Priority,
      agentId: created.agentId,
      agent: (created as any).agent || null,
      tags: this.parseTags(created.tags),
      createdAt: created.createdAt,
      updatedAt: created.updatedAt,
    };
  }

  static async getTickets(
    user: UserJwtPayload,
    page: number = 1,
    limit: number = 10,
    filters: TicketFilterOptions = {}
  ): Promise<{ tickets: TicketDTO[]; pagination: PaginationMeta }> {
    const skip = (page - 1) * limit;

    const whereCondition: any = {};

    // Security Rule: AGENT gets only assigned tickets; ADMIN gets system-wide
    if (user.role !== 'ADMIN') {
      whereCondition.agentId = user.id;
    }

    if (filters.status) {
      whereCondition.status = filters.status;
    }

    if (filters.priority) {
      whereCondition.priority = filters.priority;
    }

    if (filters.search && filters.search.trim()) {
      const searchTerm = filters.search.trim();
      whereCondition.OR = [
        { title: { contains: searchTerm, mode: 'insensitive' } },
        { description: { contains: searchTerm, mode: 'insensitive' } },
      ];
    }

    if (filters.tag && filters.tag.trim()) {
      whereCondition.tags = { contains: filters.tag.trim() };
    }

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

    const tickets: TicketDTO[] = rawTickets.map((t: any) => ({
      id: t.id,
      title: t.title,
      description: t.description,
      status: t.status as TicketStatus,
      priority: t.priority as Priority,
      agentId: t.agentId,
      agent: t.agent || null,
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
      throw new NotFoundError('Ticket not found');
    }

    return {
      id: ticket.id,
      title: ticket.title,
      description: ticket.description,
      status: ticket.status as TicketStatus,
      priority: ticket.priority as Priority,
      agentId: ticket.agentId,
      agent: (ticket as any).agent || null,
      tags: this.parseTags(ticket.tags),
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      replies: (ticket as any).replies?.map((r: any) => ({
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
      title?: string;
      description?: string;
      status?: TicketStatus;
      priority?: Priority;
      tags?: string;
      agentId?: string | null;
    } = {};

    if (input.title) updateData.title = input.title.trim();
    if (input.description) updateData.description = input.description.trim();
    if (input.status) updateData.status = input.status as TicketStatus;
    if (input.priority) updateData.priority = input.priority as Priority;
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
      agent: (updated as any).agent || null,
      tags: this.parseTags(updated.tags),
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
    };
  }

  static async deleteTicket(ticketId: string, user: UserJwtPayload): Promise<{ success: boolean; message: string }> {
    const ticket = await prisma.ticket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      throw new NotFoundError('Ticket not found');
    }

    // Security Rule: AGENT can only delete ticket assigned to them, ADMIN can delete any
    if (user.role !== 'ADMIN' && ticket.agentId !== user.id) {
      throw new ForbiddenError('You are not authorized to delete this ticket');
    }

    await prisma.ticket.delete({
      where: { id: ticketId },
    });

    return {
      success: true,
      message: 'Ticket deleted successfully',
    };
  }

  static async getReplies(ticketId: string, user: UserJwtPayload) {
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

    return replies.map((r: any) => ({
      id: r.id,
      ticketId: r.ticketId,
      userId: r.userId,
      content: r.content,
      createdAt: r.createdAt,
      user: r.user,
    }));
  }

  static async createReply(ticketId: string, content: string, user: UserJwtPayload) {
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
      user: (reply as any).user,
    };
  }

  static async addAttachment(
    ticketId: string,
    input: AttachmentInput,
    user: UserJwtPayload
  ) {
    await this.getTicketById(ticketId, user);

    const attachmentId = `att-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    return {
      id: attachmentId,
      ticketId,
      fileName: input.fileName.trim(),
      fileType: input.fileType.trim(),
      fileSize: input.fileSize,
      url: `/api/tickets/${ticketId}/attachments/${attachmentId}`,
      uploadedBy: user.id,
      uploadedAt: new Date(),
    };
  }
}
