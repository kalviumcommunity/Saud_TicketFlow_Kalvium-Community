import { Request, Response, NextFunction } from 'express';
import { BadRequestError } from '../utils/errors';

export const validateLoginInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { email, password } = req.body || {};

  if (!email || typeof email !== 'string' || !email.trim()) {
    return next(new BadRequestError('Email is required'));
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return next(new BadRequestError('Invalid email format'));
  }

  if (!password || typeof password !== 'string' || !password.trim()) {
    return next(new BadRequestError('Password is required'));
  }

  next();
};

export const validateTicketQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { page, limit } = req.query;

  if (page !== undefined) {
    const pageNum = Number(page);
    if (isNaN(pageNum) || pageNum < 1 || !Number.isInteger(pageNum)) {
      return next(new BadRequestError('Page parameter must be a positive integer'));
    }
  }

  if (limit !== undefined) {
    const limitNum = Number(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100 || !Number.isInteger(limitNum)) {
      return next(new BadRequestError('Limit parameter must be an integer between 1 and 100'));
    }
  }

  next();
};

export const validateTicketPatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { status, priority, tags } = req.body || {};

  const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return next(new BadRequestError(`Invalid status value. Must be one of: ${allowedStatuses.join(', ')}`));
  }

  const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return next(new BadRequestError(`Invalid priority value. Must be one of: ${allowedPriorities.join(', ')}`));
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new BadRequestError('Tags must be an array of strings'));
  }

  if (status === undefined && priority === undefined && tags === undefined && req.body.agentId === undefined) {
    return next(new BadRequestError('At least one field (status, priority, tags) must be provided for update'));
  }

  next();
};

export const validateReplyInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Support both content and message keys for full frontend contract compatibility
  const content = req.body?.content || req.body?.message;

  if (!content || typeof content !== 'string' || !content.trim()) {
    return next(new BadRequestError('Reply message content is required'));
  }

  next();
};
