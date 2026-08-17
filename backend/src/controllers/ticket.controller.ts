import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../middleware/authenticate';
import { TicketService } from '../services/ticket.service';
import { UnauthorizedError } from '../utils/errors';

export class TicketController {
  static async getTickets(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new UnauthorizedError('User identity required');
      }

      const page = parseInt(req.query.page as string, 10) || 1;
      const limit = parseInt(req.query.limit as string, 10) || 10;

      const result = await TicketService.getTickets(req.user, page, limit);

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
      const { status, priority, tags, agentId } = req.body;

      const updated = await TicketService.updateTicket(
        id,
        { status, priority, tags, agentId },
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
}
