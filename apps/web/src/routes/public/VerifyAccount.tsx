import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { NavLink, useParams } from 'react-router';
import { Button } from '@budmin/ui';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

export default function VerifyAccount() {
  const { token } = useParams();
  const {
    state: {
      finishedAsyncAction, loading, error, message,
    },
    verifyToken,
  } = useAuth();

  useEffect(() => {
    if (!loading && !finishedAsyncAction) {
      verifyToken(token || '');
    }
  }, [token, loading, finishedAsyncAction, verifyToken]);

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <main className="text-center">
      {
        loading ? (
          <p>loading...</p>
        ) : (
          finishedAsyncAction && (
            <>
              <div className="mb-2">
                {
                  error ? (
                    <>
                      <Typography className="capitalize text-danger font-semibold text-xl">Error</Typography>
                      <Typography className="capitalize text-danger font-semibold text-xl">{error}</Typography>
                    </>
                  ) : (
                    <Typography className="text-safe">{message}</Typography>
                  )
                }
              </div>
              <div className="mt-4 space-y-2">
                <Button asChild>
                  <NavLink to="/" replace>
                    Inicio
                  </NavLink>
                </Button>
              </div>
            </>
          ))
      }
    </main>
  );
}
