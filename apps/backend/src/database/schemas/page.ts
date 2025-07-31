import { z } from 'zod';
import { positiveInteger } from './general';

const createPageSchema = z.object({
  name: z.string().min(3).max(30),
});

const updatePageSchema = z.object({
  id: positiveInteger,
  name: z.string().min(3).max(30),
});

export {
  createPageSchema,
  updatePageSchema,
};
