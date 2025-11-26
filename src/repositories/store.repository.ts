import prisma from '../config/prismaClient';
import { Store, Prisma } from '@prisma/client';
import { StoreWithOwner } from '../types';
import { getSkip } from '../utils/pagination.util';

export interface IStoreRepository {
  create(data: Prisma.StoreCreateInput): Promise<Store>;
  findById(id: string): Promise<Store | null>;
  findByOwnerId(ownerId: string): Promise<Store[]>;
  findWithOwner(id: string): Promise<StoreWithOwner | null>;
  findAll(page: number, limit: number, location?: string): Promise<Store[]>;
  count(location?: string): Promise<number>;
  update(id: string, data: Prisma.StoreUpdateInput): Promise<Store>;
  delete(id: string): Promise<void>;
}

export class StoreRepository implements IStoreRepository {
  async create(data: Prisma.StoreCreateInput): Promise<Store> {
    return prisma.store.create({ data });
  }

  async findById(id: string): Promise<Store | null> {
    return prisma.store.findUnique({ where: { id } });
  }

  async findByOwnerId(ownerId: string): Promise<Store[]> {
    return prisma.store.findMany({ where: { ownerId } });
  }

  async findWithOwner(id: string): Promise<StoreWithOwner | null> {
    return prisma.store.findUnique({
      where: { id },
      include: { owner: true },
    });
  }

  async findAll(
    page: number,
    limit: number,
    location?: string
  ): Promise<Store[]> {
    const skip = getSkip(page, limit);
    const where: Prisma.StoreWhereInput = location
      ? { location: { contains: location, mode: 'insensitive' } }
      : {};

    return prisma.store.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });
  }

  async count(location?: string): Promise<number> {
    const where: Prisma.StoreWhereInput = location
      ? { location: { contains: location, mode: 'insensitive' } }
      : {};

    return prisma.store.count({ where });
  }

  async update(id: string, data: Prisma.StoreUpdateInput): Promise<Store> {
    return prisma.store.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.store.delete({ where: { id } });
  }
}


