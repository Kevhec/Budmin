import { type SignOptions } from 'jsonwebtoken';
import { emailVerificationTokenExpiration } from './env';

const emailVerification: SignOptions = {
  // Type casting was needed, zod regex in env.ts file ensures proper format
  expiresIn: emailVerificationTokenExpiration as SignOptions['expiresIn'],
  issuer: 'budmin',
  audience: 'account-verification',
};

export {
  emailVerification,
};
