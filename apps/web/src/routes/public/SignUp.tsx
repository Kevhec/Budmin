import useAuth from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import signupSchema from '@/schemas/signup';
import { format } from '@formkit/tempo';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { NavLink, useNavigate } from 'react-router';
import { z } from 'zod';
import { es } from 'date-fns/locale';
import { useEffect } from 'react';
import {
  Popover, PopoverContent, PopoverTrigger, Input,
  Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage,
  Card, CardContent, CardDescription, CardHeader, CardTitle, Button,
} from '@budmin/ui';
import {
  Calendar,
} from '@budmin/ui/shadcn/calendar';
import {
  Typography,
} from '@budmin/ui/internal/Typography';

export default function SignUp() {
  const { signUp, state: { error, finishedAsyncAction } } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: '',
      email: '',
      birthday: new Date(),
      password: '',
      repeatPassword: '',
    },
  });

  const onSubmit = async (value: z.infer<typeof signupSchema>) => {
    const {
      username,
      email,
      birthday,
      password,
      repeatPassword,
    } = value;

    console.log({ birthday });

    signUp({
      username,
      email,
      birthday,
      password,
      repeatPassword,
    });
  };

  useEffect(() => {
    if (finishedAsyncAction && !error) {
      navigate('/register/success');
    }
  }, [finishedAsyncAction, error, navigate]);

  return (
    <main>
      <Card className="mx-auto max-w-96 w-full">
        <CardHeader>
          <CardTitle className="text-2xl">Registro</CardTitle>
          <CardDescription>
            ¡Crea una nueva cuenta de Budmin! Tu administrador financiero.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} id="userSignup">
              <div className="grid gap-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <FormItem>
                        <FormLabel>Nombre de usuario</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Fulanito de tal"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Este será tu nombre en la aplicación.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <div className="grid gap-2">
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="email@dominio.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Ingresa tu correo electrónico
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    </div>
                  )}
                />
                <FormField
                  control={form.control}
                  name="birthday"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-[240px] pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground',
                              )}
                            >
                              {field.value ? (
                                format(field.value, 'long')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date > new Date() || date < new Date('1900-01-01')}
                            captionLayout="dropdown"
                            locale={es}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Ingresa tu fecha de nacimiento.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Ingresa tu contraseña
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="repeatPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Repetir contraseña</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="••••••••"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Repite tu contraseña
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="space-y-4">
                  {
                    error && (
                      <Typography>
                        {error}
                      </Typography>
                    )
                  }
                  <Button type="submit" className="w-full">
                    Registrarse
                  </Button>
                  <Button asChild variant="outline" className="w-full">
                    <NavLink to="/">
                      Volver
                    </NavLink>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </main>
  );
}
