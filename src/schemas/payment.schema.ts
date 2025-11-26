import { z } from 'zod';

export const processPaymentSchema = z.object({
  params: z.object({
    rentalRequestId: z.string().uuid(),
  }),
  body: z.object({
    method: z.enum(['card', 'upi', 'cash', 'mock']),
    amount: z.number().positive(),
  }),
});

export const getPaymentSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
});

export const downloadReceiptSchema = z.object({
  params: z.object({
    id: z.string().uuid(),
  }),
  query: z.object({
    format: z.enum(['pdf', 'json']).optional(),
  }),
});

export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>['body'];


