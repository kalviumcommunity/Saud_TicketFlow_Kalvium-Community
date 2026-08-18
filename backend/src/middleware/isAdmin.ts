import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './authenticate';
import { ForbiddenError, UnauthorizedError } from '../utils/errors';

export const isAdmin = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  try {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (req.user.role !== 'ADMIN') {
      throw new ForbiddenError('Access forbidden: Admin role required');
    }

    next();
  } catch (error) {
    next(error);
  }
};
