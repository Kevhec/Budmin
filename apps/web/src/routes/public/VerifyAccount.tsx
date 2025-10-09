import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router';
import { Button } from '@budmin/ui/shadcn/button';
import { Typography } from '@budmin/ui/internal/Typography';
import {
  Card, CardAction, CardContent, CardFooter, CardHeader, CardTitle,
} from '@budmin/ui/shadcn/card';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

const getMessages = (code: string, t: TFunction, afterBody?: string) => {
  const messages = {
    title: '',
    body: '',
  };

  switch (code) {
    case 'expired_token':
      messages.title = t('verifyAccount.errors.expiredToken.title');
      messages.body = t('verifyAccount.errors.expiredToken.body');
      break;
    case 'invalid_token':
      messages.title = t('verifyAccount.errors.invalidToken.title');
      messages.body = t('verifyAccount.errors.invalidToken.body');
      break;
    case 'success':
      messages.title = t('verifyAccount.success.title');
      messages.body = t('verifyAccount.success.body');
      break;
    default:
      messages.title = t('verifyAccount.errors.serverError.title');
      messages.body = t('verifyAccount.errors.serverError.body');
      break;
  }

  if (afterBody) {
    messages.body += ` ${afterBody}`;
  }

  return messages;
};

export default function VerifyAccount() {
  const { token } = useParams();
  const { t } = useTranslation();
  const {
    state: {
      finishedAsyncAction, loading, error, retryToken,
    },
    verifyToken,
    resendVerification,
  } = useAuth();

  const tokenToImplement = retryToken || token;

  useEffect(() => {
    if (!loading && !finishedAsyncAction) {
      verifyToken(token || '');
    }
  }, [token, loading, finishedAsyncAction, error, verifyToken]);

  const handleVerificationResend = () => {
    if (tokenToImplement && error && finishedAsyncAction) {
      resendVerification(tokenToImplement);
    }
  };

  const messages = getMessages(error ? error.code : 'success', t, error?.maskedEmail);

  return (
    <main>
      {loading ? (
        <p>loading...</p>
      ) : (
        finishedAsyncAction && (
          <Card className="text-center max-w-96">
            <CardHeader>
              <CardTitle>
                <Typography className={cn('text-3xl text-emerald-600', { 'text-red-700': error })}>
                  {
                    messages.title
                  }
                </Typography>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Typography className="text-sm text-gray-500">
                { messages.body }
                .
              </Typography>
            </CardContent>
            <CardFooter className="flex-col gap-4">
              <CardAction className="w-full">
                {
                  error ? (
                    <div className="space-y-1">
                      {
                        error.code === 'expired_token' && (
                        <Button
                          className="w-full"
                          disabled={
                            !finishedAsyncAction
                          }
                          onClick={handleVerificationResend}
                        >
                          {t('verifyAccount.actions.sendNewEmail')}
                        </Button>
                        )
                      }
                      <Button asChild>
                        <NavLink to="/" className="w-full">
                          {t('verifyAccount.actions.backToLogin')}
                        </NavLink>
                      </Button>
                    </div>
                  ) : (
                    <Button asChild>
                      <NavLink to="/" replace className="w-full">
                        Volver al Inicio
                      </NavLink>
                    </Button>
                  )
                }
              </CardAction>
            </CardFooter>
          </Card>
        )
      )}
    </main>
  );
}
