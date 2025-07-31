import { render } from '@react-email/render';
import VerifyAccountEmail from '@/src/mails/VerifyAccount';
import sendEmail from '../resend';

const frontendUrl = process.env.FRONTEND_URL;

const verificationEmail = async (to: string, token: string) => {
  try {
    const url = `${frontendUrl}/verify/${token}`;
    const html = await render(VerifyAccountEmail({ url }), {
      pretty: true,
    });

    const response = await sendEmail(
      'Budmin <budmin@kevhec.dev>',
      to,
      'Verificación de cuenta',
      html,
    );

    return response;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    }

    return 0;
  }
};

export default verificationEmail;
