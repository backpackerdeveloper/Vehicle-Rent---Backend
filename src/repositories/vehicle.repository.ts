import prisma from '../config/prismaClient';
import { Vehicle, Prisma } from '@prisma/client';
import { VehicleWithStore } from '../types';
import { getSkip } from '../utils/pagination.util';

export interface IVehicleRepository {
  create(data: Prisma.VehicleCreateInput): Promise<Vehicle>;
  findById(id: string): Promise<Vehicle | null>;
  findWithStore(id: string): Promise<VehicleWithStore | null>;
  findByStoreId(storeId: string, page: number, limit: number): Promise<Vehicle[]>;
  countByStoreId(storeId: string): Promise<number>;
  findAvailableByStoreId(storeId: string, page: number, limit: number): Promise<Vehicle[]>;
  countAvailableByStoreId(storeId: string): Promise<number>;
  update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle>;
  delete(id: string): Promise<void>;
}

export class VehicleRepository implements IVehicleRepository {
  async create(data: Prisma.VehicleCreateInput): Promise<Vehicle> {
    return prisma.vehicle.create({ data });
  }

  async findById(id: string): Promise<Vehicle | null> {
    return prisma.vehicle.findUnique({ where: { id } });
  }

  async findWithStore(id: string): Promise<VehicleWithStore | null> {
    return prisma.vehicle.findUnique({
      where: { id },
      include: {
        store: true,
        images: {
          select: { id: true, imageUrl: true },
        },
      },
    });
  }

  async findByStoreId(
    storeId: string,
    page: number,
    limit: number
  ): Promise<Vehicle[]> {
    const skip = getSkip(page, limit);
    return prisma.vehicle.findMany({
      where: { storeId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          select: { id: true, imageUrl: true },
        },
      },
    });
  }

  async countByStoreId(storeId: string): Promise<number> {
    return prisma.vehicle.count({ where: { storeId } });
  }

  async findAvailableByStoreId(
    storeId: string,
    page: number,
    limit: number
  ): Promise<Vehicle[]> {
    const skip = getSkip(page, limit);
    return prisma.vehicle.findMany({
      where: {
        storeId,
        isAvailable: true,
        rentalRequests: {
          none: {
            status: 'APPROVED',
            OR: [
              {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
              },
            ],
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        images: {
          select: { id: true, imageUrl: true },
        },
      },
    });
  }

  async countAvailableByStoreId(storeId: string): Promise<number> {
    return prisma.vehicle.count({
      where: {
        storeId,
        isAvailable: true,
        rentalRequests: {
          none: {
            status: 'APPROVED',
            OR: [
              {
                startDate: { lte: new Date() },
                endDate: { gte: new Date() },
              },
            ],
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.VehicleUpdateInput): Promise<Vehicle> {
    return prisma.vehicle.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    await prisma.vehicle.delete({ where: { id } });
  }
}


