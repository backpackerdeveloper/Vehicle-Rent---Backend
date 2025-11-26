import prisma from '../config/prismaClient';
import { RentalRequest, Prisma } from '@prisma/client';
import { RentalRequestWithRelations } from '../types';
import { getSkip } from '../utils/pagination.util';

export interface IRentalRepository {
  create(data: Prisma.RentalRequestCreateInput): Promise<RentalRequest>;
  findById(id: string): Promise<RentalRequest | null>;
  findWithRelations(id: string): Promise<RentalRequestWithRelations | null>;
  findByCustomerId(customerId: string, page: number, limit: number): Promise<RentalRequest[]>;
  countByCustomerId(customerId: string): Promise<number>;
  findByStoreOwnerId(ownerId: string, page: number, limit: number): Promise<RentalRequest[]>;
  countByStoreOwnerId(ownerId: string): Promise<number>;
  update(id: string, data: Prisma.RentalRequestUpdateInput): Promise<RentalRequest>;
  findActiveRentalsByVehicleId(vehicleId: string): Promise<RentalRequest[]>;
}

export class RentalRepository implements IRentalRepository {
  async create(data: Prisma.RentalRequestCreateInput): Promise<RentalRequest> {
    return prisma.rentalRequest.create({ data });
  }

  async findById(id: string): Promise<RentalRequest | null> {
    return prisma.rentalRequest.findUnique({ where: { id } });
  }

  async findWithRelations(id: string): Promise<RentalRequestWithRelations | null> {
    return prisma.rentalRequest.findUnique({
      where: { id },
      include: {
        vehicle: {
          include: {
            store: true,
            images: {
              select: { id: true, imageUrl: true },
            },
          },
        },
        customer: true,
        payment: true,
      },
    });
  }

  async findByCustomerId(
    customerId: string,
    page: number,
    limit: number
  ): Promise<RentalRequest[]> {
    const skip = getSkip(page, limit);
    return prisma.rentalRequest.findMany({
      where: { customerId },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          include: {
            store: true,
            images: {
              select: { id: true, imageUrl: true },
            },
          },
        },
        payment: true,
      },
    });
  }

  async countByCustomerId(customerId: string): Promise<number> {
    return prisma.rentalRequest.count({ where: { customerId } });
  }

  async findByStoreOwnerId(
    ownerId: string,
    page: number,
    limit: number
  ): Promise<RentalRequest[]> {
    const skip = getSkip(page, limit);
    return prisma.rentalRequest.findMany({
      where: {
        vehicle: {
          store: {
            ownerId,
          },
        },
      },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        vehicle: {
          include: {
            store: true,
            images: {
              select: { id: true, imageUrl: true },
            },
          },
        },
        customer: true,
        payment: true,
      },
    });
  }

  async countByStoreOwnerId(ownerId: string): Promise<number> {
    return prisma.rentalRequest.count({
      where: {
        vehicle: {
          store: {
            ownerId,
          },
        },
      },
    });
  }

  async update(
    id: string,
    data: Prisma.RentalRequestUpdateInput
  ): Promise<RentalRequest> {
    return prisma.rentalRequest.update({ where: { id }, data });
  }

  async findActiveRentalsByVehicleId(vehicleId: string): Promise<RentalRequest[]> {
    return prisma.rentalRequest.findMany({
      where: {
        vehicleId,
        status: 'APPROVED',
        startDate: { lte: new Date() },
        endDate: { gte: new Date() },
      },
    });
  }
}

