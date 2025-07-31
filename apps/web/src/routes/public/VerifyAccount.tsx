import useAuth from '@/hooks/useAuth';
import { useEffect } from 'react';
import { Navigate, NavLink, useParams } from 'react-router';
import Countdown from 'react-countdown';
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

  const countdownRenderer: (...args: any[]) => any = ({ seconds, completed }) => {
    if (completed) {
      return <Navigate to="/" replace />;
    }

    return (
      <Typography variant="span" className="w-32 aspect-square border-2 border-slate-600 rounded-full grid place-content-center text-3xl font-bold mx-auto mt-4 text-slate-600 text-center tabular-nums">
        {seconds}
        {' '}
        <Typography variant="span" className="text-xl font-medium text-center">
          Segundo
          {Number(seconds) === 1 ? '' : 's'}
        </Typography>
      </Typography>
    );
  };

  useEffect(() => {
    verifyToken(token || '');
  }, [token, verifyToken]);

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
              <div>
                <Typography>Serás redirigido a la página de inicio en:</Typography>
                <Countdown
                  date={Date.now() + 5000}
                  renderer={countdownRenderer}
                />
                <div className="mt-4 space-y-2">
                  <Typography>
                    Si no eres redirigido automáticamente
                    puedes dar click en el siguiente botón
                  </Typography>
                  <Button asChild>
                    <NavLink to="/" replace>
                      Inicio
                    </NavLink>
                  </Button>
                </div>
              </div>
            </>
          ))
      }
    </main>
  );
}
