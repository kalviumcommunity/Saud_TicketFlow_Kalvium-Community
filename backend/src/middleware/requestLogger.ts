import { Request, Response, NextFunction } from 'express';

export interface RequestWithId extends Request {
  requestId?: string;
}

export const requestLogger = (
  req: RequestWithId,
  res: Response,
  next: NextFunction
): void => {
  const start = Date.now();
  const incomingId = req.headers['x-request-id'];
  const requestId =
    typeof incomingId === 'string' && incomingId.trim()
      ? incomingId.trim()
      : `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

  req.requestId = requestId;
  res.setHeader('X-Request-ID', requestId);

  res.on('finish', () => {
    const durationMs = Date.now() - start;

    const logPayload = {
      timestamp: new Date().toISOString(),
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      durationMs,
      ip: req.ip || req.socket?.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'] || 'unknown',
    };

    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify(logPayload));
    }
  });

  next();
};
