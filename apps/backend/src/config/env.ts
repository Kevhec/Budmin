import z from 'zod';

const timeString = z.string().regex(/^\d+(s|m|h)$/);

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.coerce.number().int(),
  FRONTEND_URL: z.string(),
  EMAIL_VERIFICATION_TOKEN_EXPIRATION: timeString,
  DB_SCHEMA: z.enum(['budmin']),
});

const env = envSchema.parse(process.env);

// App
const isProduction = env.NODE_ENV === 'production';
const appPort = env.PORT || 3000;

// Connection
const frontendUrl = env.FRONTEND_URL;

// Database
const dbSchema = env.DB_SCHEMA;

// Auth
const emailVerificationTokenExpiration = env.EMAIL_VERIFICATION_TOKEN_EXPIRATION;

export {
  isProduction,
  appPort,
  frontendUrl,
  dbSchema,
  emailVerificationTokenExpiration,
};
