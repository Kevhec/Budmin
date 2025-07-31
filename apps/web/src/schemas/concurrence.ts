import { DEFAULT_CONCURRENCES, CONCURRENCE_TYPE, WEEKDAYS } from '@/lib/constants';
import { z } from 'zod';

const concurrenceSchema = z.object({
  concurrenceDefaults: z
    .enum(DEFAULT_CONCURRENCES),
  concurrenceType: z
    .enum(CONCURRENCE_TYPE)
    .optional(),
  concurrenceSteps: z
    .coerce
    .number()
    .int()
    .positive()
    .optional(),
  concurrenceEndDate: z
    .date()
    .optional(),
  concurrenceWithEndDate: z
    .enum(['true', 'false'])
    .optional(),
  concurrenceWeekDay: z
    .enum(WEEKDAYS)
    .optional(),
  concurrenceTime: z
    .date()
    .optional(),
  concurrenceMonthSelect: z
    .enum(['exact', 'ordinal'])
    .optional(),
});

export default concurrenceSchema;
