import { z } from 'zod';

const signupSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: 'El nombre de usuario debe tener al menos dos caracteres.',
    })
    .max(50, {
      message: 'El nombre de usuario no puede exceder 50 caracteres.',
    }),
  email: z
    .string()
    .email({ message: 'Email inválido' })
    .trim(),
  birthday: z
    .date(),
  password: z
    .string({ required_error: 'Campo obligatorio' })
    .min(8, { message: 'Password must be at least 8 characters long' })
    .refine((val) => /[A-Z]/.test(val), { message: 'Password must contain at least one uppercase letter' })
    .refine((val) => /[a-z]/.test(val), { message: 'Password must contain at least one lowercase letter' })
    .refine((val) => /\d/.test(val), { message: 'Password must contain at least one digit' })
    .refine((val) => /[a-zA-Z]/.test(val), { message: 'Password must contain at least one letter' }),
  repeatPassword: z
    .string(),
}).refine((data) => data.password === data.repeatPassword, {
  message: 'Las contraseñas no coincide',
  path: ['repeatPassword'],
});

export default signupSchema;
