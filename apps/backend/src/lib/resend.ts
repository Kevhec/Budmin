import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (
  from: string,
  to: string,
  subject: string,
  html: string
) => {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      return error;
    }

    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error(error.message);
    }

    return 0;
  }
};

export default sendEmail;
