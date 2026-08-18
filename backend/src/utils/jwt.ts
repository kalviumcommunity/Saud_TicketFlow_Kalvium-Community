import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UnauthorizedError } from './errors';

export interface UserJwtPayload {
  id: string;
  email: string;
  role: 'AGENT' | 'ADMIN';
}

export const signToken = (payload: UserJwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): UserJwtPayload => {
  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as UserJwtPayload;
    if (!decoded || !decoded.id || !decoded.role) {
      throw new UnauthorizedError('Invalid authentication token payload');
    }
    return decoded;
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      throw error;
    }
    throw new UnauthorizedError('Invalid or expired authentication token');
  }
};
