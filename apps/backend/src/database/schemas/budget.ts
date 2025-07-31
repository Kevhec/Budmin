import { z } from 'zod';
import { concurrenceSchema } from './general';

const createBudgetSchema = z.object({
  name: z.string(),
  totalAmount: z.number().positive(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
  concurrence: concurrenceSchema.optional(),
});

const updateBudgetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  totalAmount: z.number().positive().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  concurrence: concurrenceSchema.optional(),
}).refine((data) => Object.entries(data).length > 1, {
  message: 'Se requiere mínimo un campo además',
});

export {
  createBudgetSchema,
  updateBudgetSchema,
};
