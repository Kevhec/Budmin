import useAuth from '@/hooks/useAuth';
import { Button, Spinner, Typography } from '@budmin/ui';
import { useTranslation } from 'react-i18next';

export default function ResendVerification() {
  const { resendVerificationEmail, state } = useAuth();
  const { t } = useTranslation();

  const handleResendEmail = () => {
    if (!state.user.email) return;

    resendVerificationEmail(state.user.email);
  };

  const { verificationResendEmailSuccess, verificationResendEmailError } = state.messages;

  return (
    <div className="min-h-screen grid place-content-center">
      {state.loading && <Spinner className="size-8" />}
      <Typography className="max-w-80 mb-2 text-sm">
        {!verificationResendEmailSuccess
          ? t('auth.unconfirmed.message')
          : verificationResendEmailSuccess.text}
      </Typography>

      {verificationResendEmailError && (
        <Typography className="max-w-80 mb-2 text-sm">
          {verificationResendEmailError.text}
        </Typography>
      )}

      {
        !verificationResendEmailSuccess && (
          <Button onClick={handleResendEmail}>
            {t('auth.unconfirmed.button')}
          </Button>
        )
      }

    </div>
  );
}
