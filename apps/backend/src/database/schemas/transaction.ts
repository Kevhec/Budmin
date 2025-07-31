import { z } from 'zod';
import { TransactionType } from '../models/transaction';
import { concurrenceSchema } from './general';

const dateRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

const createTransactionSchema = z.object({
  description: z.string().min(3).max(30),
  amount: z.number().positive(),
  startDate: z.string().datetime(),
  type: z.nativeEnum(TransactionType),
  budgetId: z.string().uuid().optional(),
  categoryId: z.string().uuid(),
  concurrence: concurrenceSchema.optional(),
});

const updateTransactionSchema = z.object({
  id: z.string().uuid(),
  description: z.string().min(3).max(30).optional(),
  amount: z.number().positive().optional(),
  type: z.nativeEnum(TransactionType).optional(),
  startDate: z.string().datetime().optional(),
  budgetId: z.string().uuid().optional(),
  categoryId: z.string().uuid().optional(),
  concurrence: concurrenceSchema.optional(),
}).refine((data) => Object.entries(data).length > 0, {
  message: 'Se requiere mínimo un campo',
});

const getBalanceSchema = z.object({
  from: z.string().regex(dateRegex).optional(),
  to: z.string().regex(dateRegex).optional(),
});

export {
  createTransactionSchema,
  updateTransactionSchema,
  getBalanceSchema,
};
