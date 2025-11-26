import prisma from '../config/prismaClient';
import { RefreshToken, Prisma } from '@prisma/client';

export interface IRefreshTokenRepository {
  create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken>;
  findByToken(token: string): Promise<RefreshToken | null>;
  findByUserId(userId: string): Promise<RefreshToken[]>;
  delete(id: string): Promise<void>;
  deleteByToken(token: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteExpired(): Promise<number>;
}

export class RefreshTokenRepository implements IRefreshTokenRepository {
  async create(data: Prisma.RefreshTokenCreateInput): Promise<RefreshToken> {
    return prisma.refreshToken.create({ data });
  }

  async findByToken(token: string): Promise<RefreshToken | null> {
    return prisma.refreshToken.findUnique({ where: { token } });
  }

  async findByUserId(userId: string): Promise<RefreshToken[]> {
    return prisma.refreshToken.findMany({ where: { userId } });
  }

  async delete(id: string): Promise<void> {
    await prisma.refreshToken.delete({ where: { id } });
  }

  async deleteByToken(token: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { token } });
  }

  async deleteByUserId(userId: string): Promise<void> {
    await prisma.refreshToken.deleteMany({ where: { userId } });
  }

  async deleteExpired(): Promise<number> {
    const result = await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  }
}


