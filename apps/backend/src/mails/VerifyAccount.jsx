import {
  Tailwind, Html, Container, Heading, Text, Button,
} from '@react-email/components';
import * as React from 'react';

function VerifyAccountEmail(props) {
  const { url } = props;

  return (
    <Tailwind
      config={{
        theme: {
          fontFamily: {
            helvetica: ['Helvetica', 'Arial', 'sans-serif'],
          },
        },
      }}
    >
      <Html className='font-helvetica'>
        <Container>
          <div className="p-4 bg-slate-500">
            <Heading as='h1' className='text-white'>
              ¡Hola!
            </Heading>
          </div>
          <Text className='m-0 mt-4 mb-8'>
            Para completar el proceso de registro de
            <span className="font-semibold"> Budmin</span>
            . Verifica tu cuenta haciendo en el siguiente botón.
          </Text>
          <Button className="p-4 bg-slate-500 rounded-md text-white" href={url || '#'} target="_blank">
            Verificar Email
          </Button>
        </Container>
      </Html>
    </Tailwind>
  );
}

export default VerifyAccountEmail;
