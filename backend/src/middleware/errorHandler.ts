import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { env } from '../config/env';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  let statusCode = 500;
  let code = 'INTERNAL_SERVER_ERROR';
  let message = 'An unexpected internal server error occurred';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
  } else if (err.name === 'SyntaxError') {
    statusCode = 400;
    code = 'BAD_REQUEST';
    message = 'Malformed JSON request body';
  } else if (err.code === 'P2025') {
    statusCode = 404;
    code = 'NOT_FOUND';
    message = 'Requested database record was not found';
  } else if (err.code === 'P2002') {
    statusCode = 400;
    code = 'BAD_REQUEST';
    message = 'Unique constraint violation on database field';
  } else {
    if (process.env.NODE_ENV !== 'test') {
      console.error(
        JSON.stringify({
          timestamp: new Date().toISOString(),
          requestId: (req as any).requestId,
          error: err.message || 'Unhandled Server Error',
          stack: err.stack,
        })
      );
    }
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
    },
    message,
    ...(env.NODE_ENV === 'development' && !(err instanceof AppError) ? { stack: err.stack } : {}),
  });
};

