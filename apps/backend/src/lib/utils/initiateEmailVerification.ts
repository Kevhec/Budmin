import { User } from '@/src/database/models';
import generateJWT from './generateJWT';
import sendVerificationEmail from './verificationEmail';
import { emailVerification } from '@/src/config/auth.config';
import { isProduction } from '@/src/config/env';

/**
 * Generates a user web token with the options defined in auth config module
 * then it updates user's token in db and lastly it sends the verification email
 */
async function initiateEmailVerification(user: User) {
  const confirmationToken = generateJWT(
    { userId: user.get('id') },
    emailVerification,
  );

  await user.update({ token: confirmationToken });

  // Email address delivered@resend.dev is meant for resend testing only
  await sendVerificationEmail(isProduction ? user.email : 'delivered@resend.dev', confirmationToken || '');
}

export default initiateEmailVerification;
