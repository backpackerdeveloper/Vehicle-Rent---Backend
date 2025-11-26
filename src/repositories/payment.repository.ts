import prisma from '../config/prismaClient';
import { Payment, Prisma } from '@prisma/client';
import { PaymentWithRental } from '../types';

export interface IPaymentRepository {
  create(data: Prisma.PaymentCreateInput): Promise<Payment>;
  findById(id: string): Promise<Payment | null>;
  findByRentalRequestId(rentalRequestId: string): Promise<Payment | null>;
  findWithRental(id: string): Promise<PaymentWithRental | null>;
  update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment>;
  updateByRentalRequestId(
    rentalRequestId: string,
    data: Prisma.PaymentUpdateInput
  ): Promise<Payment>;
}

export class PaymentRepository implements IPaymentRepository {
  async create(data: Prisma.PaymentCreateInput): Promise<Payment> {
    return prisma.payment.create({ data });
  }

  async findById(id: string): Promise<Payment | null> {
    return prisma.payment.findUnique({ where: { id } });
  }

  async findByRentalRequestId(rentalRequestId: string): Promise<Payment | null> {
    return prisma.payment.findUnique({
      where: { rentalRequestId },
    });
  }

  async findWithRental(id: string): Promise<PaymentWithRental | null> {
    return prisma.payment.findUnique({
      where: { id },
      include: {
        rentalRequest: {
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
          },
        },
      },
    });
  }

  async update(id: string, data: Prisma.PaymentUpdateInput): Promise<Payment> {
    return prisma.payment.update({ where: { id }, data });
  }

  async updateByRentalRequestId(
    rentalRequestId: string,
    data: Prisma.PaymentUpdateInput
  ): Promise<Payment> {
    return prisma.payment.update({
      where: { rentalRequestId },
      data,
    });
  }
}

