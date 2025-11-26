import { z } from 'zod';

export const createRentalRequestSchema = z.object({
  body: z.object({
    vehicleId: z.string().uuid(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
  }),
});

export const approveRentalSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const rejectRentalSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getRentalsSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getRentalSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const renewRentalSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  body: z.object({
    newEndDate: z.string().datetime(),
  }),
});

export type CreateRentalRequestInput = z.infer<typeof createRentalRequestSchema>['body'];
export type RenewRentalInput = z.infer<typeof renewRentalSchema>['body'];


