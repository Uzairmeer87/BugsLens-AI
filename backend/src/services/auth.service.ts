import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User.js';
import { env } from '../config/env.js';
import { AppError } from '../utils/response.js';
import type { RegisterInput, LoginInput } from '../validators/auth.js';

export class AuthService {
  async register(input: RegisterInput): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError('EMAIL_EXISTS', 'Email already registered', 409);
    }

    const passwordHash = await argon2.hash(input.password);
    const user = await User.create({
      name: input.name,
      email: input.email,
      passwordHash,
    });

    const tokens = this.generateTokens(user);
    user.lastLogin = new Date();
    await user.save();

    return { user, ...tokens };
  }

  async login(input: LoginInput): Promise<{ user: IUser; accessToken: string; refreshToken: string }> {
    const user = await User.findOne({ email: input.email });
    if (!user) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    if (!user.isActive) {
      throw new AppError('ACCOUNT_DISABLED', 'Account is disabled', 403);
    }

    const isValid = await argon2.verify(user.passwordHash, input.password);
    if (!isValid) {
      throw new AppError('INVALID_CREDENTIALS', 'Invalid email or password', 401);
    }

    const tokens = this.generateTokens(user);
    user.lastLogin = new Date();
    await user.save();

    return { user, ...tokens };
  }

  async refreshToken(token: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string; role: string };
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new AppError('UNAUTHORIZED', 'Invalid refresh token', 401);
      }
      return this.generateTokens(user);
    } catch {
      throw new AppError('UNAUTHORIZED', 'Invalid or expired refresh token', 401);
    }
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }
    return user;
  }

  async updateProfile(userId: string, data: { name?: string; avatar?: string }): Promise<IUser> {
    const user = await User.findByIdAndUpdate(userId, data, { new: true });
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('NOT_FOUND', 'User not found', 404);
    }

    const isValid = await argon2.verify(user.passwordHash, currentPassword);
    if (!isValid) {
      throw new AppError('INVALID_CREDENTIALS', 'Current password is incorrect', 400);
    }

    user.passwordHash = await argon2.hash(newPassword);
    await user.save();
  }

  private generateTokens(user: IUser) {
    const payload = { userId: user._id!.toString(), role: user.role };

    const accessToken = jwt.sign(payload, env.JWT_SECRET, {
      expiresIn: env.JWT_EXPIRES_IN as string,
    });

    const refreshToken = jwt.sign(payload, env.JWT_REFRESH_SECRET, {
      expiresIn: env.JWT_REFRESH_EXPIRES_IN as string,
    });

    return { accessToken, refreshToken };
  }
}

export const authService = new AuthService();
