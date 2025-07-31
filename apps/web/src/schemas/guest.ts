import { z } from 'zod';

const guestSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'El nombre de usuario debe tener al menos dos caracteres.',
    })
    .max(50, {
      message: 'El nombre de usuario no puede exceder 50 caracteres.',
    }),
  role: z.literal('guest').optional(),
});

export default guestSchema;
