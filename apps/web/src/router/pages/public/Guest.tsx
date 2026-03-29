import { zodResolver } from '@hookform/resolvers/zod';
import {
  NavLink,
} from 'react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import guestSchema from '@/schemas/guest';
import useAuth from '@/hooks/useAuth';
import {
  Button,
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
  Input,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@budmin/ui';

export default function Guest() {
  const { loginGuest } = useAuth();

  const form = useForm<z.infer<typeof guestSchema>>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      username: '',
    },
  });

  const onSubmit = async (value: z.infer<typeof guestSchema>) => {
    loginGuest({ username: value.username });
    return 0;
  };

  return (
    <main>
      <Card className="w-96">
        <CardHeader>
          <CardTitle className="text-2xl">Ingreso de invitado</CardTitle>
          <CardDescription>Inicia sesión como invitado</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="guestLogin">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de usuario</FormLabel>
                    <FormControl>
                      <Input placeholder="Fulanito de tal" {...field} />
                    </FormControl>
                    <FormDescription>
                      Este será tu nombre en la aplicación.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </CardContent>
        <CardFooter className="grid gap-2">
          <Button className="w-full" type="submit" form="guestLogin">
            Ingresar
          </Button>
          <NavLink to=".." className="text-center text-sm">Volver</NavLink>
        </CardFooter>
      </Card>
    </main>
  );
}
