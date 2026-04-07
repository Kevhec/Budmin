import { Typography } from '@/components/Typography';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router';

export default function VerifyAccount() {
  const { token } = useParams();
  const {
    state: { loading, messages },
    verifyToken,
  } = useAuth();

  const { verificationVerifyTokenSuccess, verificationVerifyTokenError } = messages;

  useEffect(() => {
    if (!token) return;

    verifyToken(token);
  }, [token, verifyToken]);

  return (
    <main className="min-h-dvh flex flex-col gap-4 items-center justify-center">
      {loading && <Spinner className="size-8" />}
      {verificationVerifyTokenSuccess && (
        <Typography className="text-green-700">
          {verificationVerifyTokenSuccess.text}
        </Typography>
      )}

      {verificationVerifyTokenError && (
        <Typography className="text-red-700">
          {verificationVerifyTokenError.text}
        </Typography>
      )}

      {!loading && (
        <Button asChild>
          <NavLink
            to={verificationVerifyTokenSuccess ? '/app/dashboard' : '/'}
            replace
          >
            {verificationVerifyTokenSuccess ? 'Dashboard' : 'Inicio'}
          </NavLink>
        </Button>
      )}
    </main>
  );
}
