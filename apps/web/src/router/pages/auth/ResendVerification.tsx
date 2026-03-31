import useAuth from '@/hooks/useAuth';
import { Button, Typography } from '@budmin/ui';
import { useTranslation } from 'react-i18next';

export default function ResendVerification() {
  const { resendVerificationEmail, state } = useAuth();
  const { t } = useTranslation();

  const handleResendEmail = () => {
    if (!state.user.email) return;

    resendVerificationEmail(state.user.email);
  };

  return (
    <div className="min-h-screen grid place-content-center">
      <Typography className="max-w-80 mb-2 text-sm">{t('auth.unconfirmed.message')}</Typography>
      <Button onClick={handleResendEmail}>{t('auth.unconfirmed.button')}</Button>
    </div>
  );
}
