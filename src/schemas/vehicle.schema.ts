import { z } from 'zod';

export const createVehicleSchema = z.object({
  body: z.object({
    storeId: z.string().uuid(),
    title: z.string().min(2).max(200),
    description: z.string().max(2000).optional(),
    rentPerDay: z.number().positive(),
    rentPerMonth: z.number().positive(),
    isAvailable: z.boolean().optional(),
  }),
});

export const updateVehicleSchema = z.object({
  body: z.object({
    title: z.string().min(2).max(200).optional(),
    description: z.string().max(2000).optional(),
    rentPerDay: z.number().positive().optional(),
    rentPerMonth: z.number().positive().optional(),
    isAvailable: z.boolean().optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getVehiclesSchema = z.object({
  params: z.object({
    storeId: z.string().min(1),
  }),
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
  }),
});

export const getVehicleSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>['body'];
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>['body'];
export type GetVehiclesQuery = z.infer<typeof getVehiclesSchema>['query'];

