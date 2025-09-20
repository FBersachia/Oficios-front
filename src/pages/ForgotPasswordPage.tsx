import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { Mail, Send, ArrowLeft, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/LoadingSpinner';

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'El email es requerido')
    .email('Ingresa un email válido')
    .max(255, 'El email es demasiado largo'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement password recovery API call when backend supports it
      // await api.post('/auth/forgot-password', { email: data.email });

      // Simulate API call for now
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmittedEmail(data.email);
      setIsSubmitted(true);
    } catch (error: any) {
      setError('Ocurrió un error al enviar el email. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setError(null);
    setIsLoading(true);

    try {
      // TODO: Implement resend functionality when backend supports it
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Reset the form to allow user to try again or use a different email
      setIsSubmitted(false);
      setSubmittedEmail('');
    } catch (error: any) {
      setError('Error al reenviar el email. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <>
        <Helmet>
          <title>Email Enviado - Oficios</title>
          <meta name="description" content="Revisa tu email para recuperar tu contraseña en Oficios." />
        </Helmet>

        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8">
            <div className="text-center">
              <Link to="/" className="inline-block">
                <h1 className="text-3xl font-bold text-primary">Oficios</h1>
              </Link>
            </div>

            <Card>
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold">
                  Email Enviado
                </CardTitle>
                <CardDescription>
                  Hemos enviado las instrucciones de recuperación a tu email
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-4">
                  <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-md text-sm">
                    <p className="font-medium">Email enviado a:</p>
                    <p className="break-all">{submittedEmail}</p>
                  </div>

                  <div className="text-sm text-gray-600 space-y-2">
                    <p>
                      Revisa tu bandeja de entrada y la carpeta de spam.
                      El enlace de recuperación expirará en 24 horas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      onClick={handleResendEmail}
                      disabled={isLoading}
                      className="w-full"
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" className="mr-2" />
                          Reenviando...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Reenviar Email
                        </>
                      )}
                    </Button>

                    <div className="text-center">
                      <Link
                        to="/login"
                        className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                      >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Volver al inicio de sesión
                      </Link>
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Recuperar Contraseña - Oficios</title>
        <meta name="description" content="Recupera tu contraseña de Oficios. Te enviaremos un enlace para restablecer tu contraseña." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <h1 className="text-3xl font-bold text-primary">Oficios</h1>
            </Link>
            <p className="mt-2 text-sm text-gray-600">
              La plataforma de confianza para profesionales en La Plata
            </p>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Recuperar Contraseña
              </CardTitle>
              <CardDescription className="text-center">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="tu@email.com"
                      className="pl-10"
                      {...register('email')}
                      aria-invalid={errors.email ? 'true' : 'false'}
                      disabled={isLoading || isSubmitting}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-600" role="alert">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isLoading || isSubmitting}
                >
                  {isLoading || isSubmitting ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Enviar Enlace de Recuperación
                    </>
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to="/login"
                    className="inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    <ArrowLeft className="mr-1 h-4 w-4" />
                    Volver al inicio de sesión
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{' '}
              <Link
                to="/register"
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                Regístrate aquí
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}