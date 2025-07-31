import { z } from 'zod';

const userSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  birthday: z.coerce.date(),
  password: z
    .string({ required_error: 'Campo obligatorio' })
    .min(8, { message: 'Debe contener mínimo 8 caracteres' })
    .refine((val) => /[A-Z]/.test(val), { message: 'Debe contener al menos una mayúscula' })
    .refine((val) => /[a-z]/.test(val), { message: 'Debe contener al menos una minúscula' })
    .refine((val) => /\d/.test(val), { message: 'Debe contener al menos un número' })
    .refine((val) => /[a-zA-Z]/.test(val), { message: 'Debe contener al menos una letra' }),
  repeatPassword: z
    .string(),
}).refine((data) => data.password === data.repeatPassword, {
  message: 'Las contraseñas no coincide',
  path: ['repeatPassword'],
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const guestSchema = z.object({
  username: z.string().min(3).max(30),
});

export {
  userSchema,
  guestSchema,
  loginSchema,
};
