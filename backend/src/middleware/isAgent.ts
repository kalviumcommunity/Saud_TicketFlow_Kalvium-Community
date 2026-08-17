import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export const isAgent = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.user.role !== 'AGENT' && req.user.role !== 'ADMIN') {
      throw new ForbiddenError('Access forbidden: Agent or Admin role required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
