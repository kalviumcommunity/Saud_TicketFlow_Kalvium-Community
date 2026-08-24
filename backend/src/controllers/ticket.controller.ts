import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { TicketService, TicketStatus, Priority } from '../services/ticket.service';
import { UnauthorizedError } from '../utils/errors';

export class TicketController {
  static async createTicket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { title, description, status, priority, tags, agentId } = req.body;

      const createdTicket = await TicketService.createTicket(
        { title, description, status, priority, tags, agentId },
        req.user
      );

      res.status(201).json({
        success: true,
        data: createdTicket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTickets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;
      const status = req.query.status as TicketStatus | undefined;
      const priority = req.query.priority as Priority | undefined;
      const search = req.query.search as string | undefined;
      const tag = req.query.tag as string | undefined;

      const result = await TicketService.getTickets(req.user, page, limit, {
        status,
        priority,
        search,
        tag,
      });

      res.status(200).json({
        success: true,
        data: result.tickets,
        pagination: result.pagination,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getTicketById(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { id } = req.params;
      const ticket = await TicketService.getTicketById(id, req.user);

      res.status(200).json({
        success: true,
        data: ticket,
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateTicket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { id } = req.params;
      const { title, description, status, priority, tags, agentId } = req.body;

      const updated = await TicketService.updateTicket(
        id,
        { title, description, status, priority, tags, agentId },
        req.user
      );

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteTicket(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { id } = req.params;
      const result = await TicketService.deleteTicket(id, req.user);

      res.status(200).json({
        success: true,
        message: result.message,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReplies(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { id } = req.params;
      const replies = await TicketService.getReplies(id, req.user);

      res.status(200).json({
        success: true,
        data: replies,
      });
    } catch (error) {
      next(error);
    }
  }

  static async createReply(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { id } = req.params;
      const content = req.body.content || req.body.message;

      const createdReply = await TicketService.createReply(id, content, req.user);

      res.status(201).json({
        success: true,
        data: createdReply,
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadAttachment(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const { id } = req.params;
      const { fileName, fileType, fileSize, contentBase64 } = req.body;

      const attachment = await TicketService.addAttachment(
        id,
        { fileName, fileType, fileSize, contentBase64 },
        req.user
      );

      res.status(201).json({
        success: true,
        data: attachment,
      });
    } catch (error) {
      next(error);
    }
  }
}
