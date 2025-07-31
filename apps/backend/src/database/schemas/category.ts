import { z } from 'zod';

const createCategorySchema = z.object({
  name: z.string(),
  color: z.string(),
});

const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  color: z.string(),
}).refine((data) => Object.entries(data).length > 1, {
  message: 'Se requiere mínimo un campo además',
});

export {
  createCategorySchema,
  updateCategorySchema,
};
