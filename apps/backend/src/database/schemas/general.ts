import { z } from 'zod';
import { CONCURRENCE_TYPE, DEFAULT_CONCURRENCES, WEEKDAYS } from '@/src/lib/constants';

const positiveInteger = z.number().positive();

const getObjectByUUID = z.object({
  id: z.string().uuid(),
});

const getTokenUUID = z.object({
  token: z.string(),
});

const concurrenceSchema = z.object({
  defaults: z
    .enum(DEFAULT_CONCURRENCES),
  type: z
    .enum(CONCURRENCE_TYPE),
  steps: z
    .coerce
    .number()
    .int()
    .positive(),
  withEndDate: z
    .enum(['true', 'false']),
  endDate: z
    .string()
    .datetime()
    .optional(),
  weekDay: z
    .enum(WEEKDAYS),
  time: z
    .string()
    .datetime(),
  monthSelect: z
    .enum(['exact', 'ordinal']),
});

export {
  positiveInteger,
  getTokenUUID,
  getObjectByUUID,
  concurrenceSchema,
};
