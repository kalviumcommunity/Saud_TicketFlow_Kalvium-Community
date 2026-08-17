import bcrypt from 'bcryptjs';
import { prisma } from '../lib/prisma';
import { signToken } from '../utils/jwt';
import { UnauthorizedError, NotFoundError } from '../utils/errors';

export interface UserProfileResponse {
  id: string;
  email: string;
  name: string;
  role: 'AGENT' | 'ADMIN';
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: UserProfileResponse;
  token: string;
}

export class AuthService {
  static async login(emailInput: string, passwordInput: string): Promise<LoginResponse> {
    const user = await prisma.user.findUnique({
      where: { email: emailInput.toLowerCase().trim() },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(passwordInput, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = signToken({
      id: user.id,
      email: user.email,
      role: user.role as 'AGENT' | 'ADMIN',
    });

    const userProfile: UserProfileResponse = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'AGENT' | 'ADMIN',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      user: userProfile,
      token,
    };
  }

  static async getCurrentUser(userId: string): Promise<UserProfileResponse> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundError('User account not found');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as 'AGENT' | 'ADMIN',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}
