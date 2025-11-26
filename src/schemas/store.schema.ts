import { z } from 'zod';

export const createStoreSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200),
    location: z.string().min(2).max(500),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
});

export const updateStoreSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(200).optional(),
    location: z.string().min(2).max(500).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
  }),
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const getStoresSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    location: z.string().optional(),
  }),
});

export const getStoreSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export type CreateStoreInput = z.infer<typeof createStoreSchema>['body'];
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>['body'];
export type GetStoresQuery = z.infer<typeof getStoresSchema>['query'];


