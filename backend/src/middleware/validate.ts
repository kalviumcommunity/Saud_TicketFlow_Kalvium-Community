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

export const validateCreateTicket = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, priority, status, tags } = req.body || {};

  if (!title || typeof title !== 'string' || !title.trim()) {
    return next(new BadRequestError('Ticket title is required'));
  }

  if (!description || typeof description !== 'string' || !description.trim()) {
    return next(new BadRequestError('Ticket description is required'));
  }

  const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return next(
      new BadRequestError(
        `Invalid priority value. Must be one of: ${allowedPriorities.join(', ')}`
      )
    );
  }

  const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return next(
      new BadRequestError(
        `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}`
      )
    );
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new BadRequestError('Tags must be an array of strings'));
  }

  next();
};

export const validateTicketQuery = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { page, limit, status, priority } = req.query;

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

  const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (status !== undefined && typeof status === 'string' && !allowedStatuses.includes(status)) {
    return next(
      new BadRequestError(
        `Invalid status filter. Must be one of: ${allowedStatuses.join(', ')}`
      )
    );
  }

  const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  if (
    priority !== undefined &&
    typeof priority === 'string' &&
    !allowedPriorities.includes(priority)
  ) {
    return next(
      new BadRequestError(
        `Invalid priority filter. Must be one of: ${allowedPriorities.join(', ')}`
      )
    );
  }

  next();
};

export const validateTicketPatch = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, description, status, priority, tags, agentId } = req.body || {};

  const allowedStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
  if (status !== undefined && !allowedStatuses.includes(status)) {
    return next(
      new BadRequestError(
        `Invalid status value. Must be one of: ${allowedStatuses.join(', ')}`
      )
    );
  }

  const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];
  if (priority !== undefined && !allowedPriorities.includes(priority)) {
    return next(
      new BadRequestError(
        `Invalid priority value. Must be one of: ${allowedPriorities.join(', ')}`
      )
    );
  }

  if (tags !== undefined && !Array.isArray(tags)) {
    return next(new BadRequestError('Tags must be an array of strings'));
  }

  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return next(new BadRequestError('Title cannot be empty'));
  }

  if (description !== undefined && (typeof description !== 'string' || !description.trim())) {
    return next(new BadRequestError('Description cannot be empty'));
  }

  if (
    title === undefined &&
    description === undefined &&
    status === undefined &&
    priority === undefined &&
    tags === undefined &&
    agentId === undefined
  ) {
    return next(
      new BadRequestError('At least one field must be provided for ticket update')
    );
  }

  next();
};

export const validateReplyInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const content = req.body?.content || req.body?.message;

  if (!content || typeof content !== 'string' || !content.trim()) {
    return next(new BadRequestError('Reply message content is required'));
  }

  next();
};

export const validateAttachmentInput = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { fileName, fileType, fileSize } = req.body || {};

  if (!fileName || typeof fileName !== 'string' || !fileName.trim()) {
    return next(new BadRequestError('fileName is required for attachment upload'));
  }

  if (!fileType || typeof fileType !== 'string' || !fileType.trim()) {
    return next(new BadRequestError('fileType (MIME type) is required for attachment upload'));
  }

  if (fileSize === undefined || typeof fileSize !== 'number' || fileSize <= 0) {
    return next(new BadRequestError('Valid fileSize in bytes is required'));
  }

  const allowedMimeTypes = [
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
    'application/pdf',
    'text/plain',
    'application/json',
  ];

  if (!allowedMimeTypes.includes(fileType.toLowerCase().trim())) {
    return next(
      new BadRequestError(
        `Unsupported file type: ${fileType}. Allowed types: ${allowedMimeTypes.join(', ')}`
      )
    );
  }

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  if (fileSize > MAX_FILE_SIZE) {
    return next(new BadRequestError('File size exceeds maximum allowed limit of 5MB'));
  }

  next();
};
