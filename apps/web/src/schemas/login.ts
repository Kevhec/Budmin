import { z } from 'zod';

const loginSchema = z.object({
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .trim(),
  password: z
    .string({ required_error: 'Campo obligatorio' })
    .trim(),
});

export default loginSchema;
