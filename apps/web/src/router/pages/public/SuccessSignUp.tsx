import Countdown from 'react-countdown';
import { Navigate } from 'react-router';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

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

export default function SuccessSignUp() {
  return (
    <main className="max-w-xl space-y-4">
      <div>
        <Typography variant="h1" className="mb-4">
          Registro satisfactorio
        </Typography>
        <Typography>
          Enviaremos a tu correo electrónico un mensaje de verificación.
          Ten en cuenta que las cuentas sin verificar serán
          eliminadas luego de 7 días de su creación.
        </Typography>
      </div>

      <div>
        <Typography>Serás redirigido a la página de inicio en:</Typography>
        <Countdown
          date={Date.now() + 15000}
          renderer={countdownRenderer}
        />
      </div>
    </main>
  );
}
