'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useAuth, initiateEmailSignIn, initiateAnonymousSignIn, initiateEmailSignUp } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, LogIn, UserPlus, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FirebaseError } from 'firebase/app';

const loginSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
});

const signupSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um e-mail válido.' }),
  password: z.string().min(6, { message: 'A senha deve ter pelo menos 6 caracteres.' }),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'As senhas não correspondem.',
  path: ['confirmPassword'],
});


export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '' },
  });

  const handleAuthError = (error: FirebaseError) => {
    let title = 'Erro de Autenticação';
    let description = 'Ocorreu um erro. Por favor, tente novamente.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        title = 'Credenciais Inválidas';
        description = 'O e-mail ou a senha estão incorretos. Por favor, verifique e tente novamente.';
        break;
      case 'auth/email-already-in-use':
        title = 'E-mail já Cadastrado';
        description = 'Este endereço de e-mail já está em uso. Por favor, faça login ou use um e-mail diferente.';
        break;
      case 'auth/weak-password':
        title = 'Senha Fraca';
        description = 'Sua senha é muito fraca. Por favor, escolha uma senha com pelo menos 6 caracteres.';
        break;
      case 'auth/invalid-email':
        title = 'E-mail Inválido';
        description = 'O formato do e-mail fornecido não é válido.';
        break;
      default:
        // Generic error for other cases
        break;
    }
    
    toast({ variant: 'destructive', title, description });
  };


  const onLoginSubmit = async (values: z.infer<typeof loginSchema>) => {
    setIsSubmitting(true);
    try {
      await initiateEmailSignIn(auth, values.email, values.password);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleAuthError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSignupSubmit = async (values: z.infer<typeof signupSchema>) => {
    setIsSubmitting(true);
    try {
      await initiateEmailSignUp(auth, values.email, values.password);
      router.push('/');
    } catch (error) {
       if (error instanceof FirebaseError) {
        handleAuthError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleQuickLogin = async () => {
    setIsSubmitting(true);
    try {
      await initiateAnonymousSignIn(auth);
      router.push('/');
    } catch (error) {
      if (error instanceof FirebaseError) {
        handleAuthError(error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center justify-center text-center mb-6">
            <div className="rounded-lg bg-primary p-3 text-primary-foreground mb-4">
              <ListTodo className="h-8 w-8" />
            </div>
            <h1 className="font-headline text-3xl font-bold text-foreground">
              Bem-vindo ao DiaAgil
            </h1>
            <p className="text-muted-foreground mt-2">Seu planejador diário inteligente.</p>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Subscrever</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Acesse sua conta para continuar.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField control={loginForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="seu@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={loginForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <LogIn className="mr-2" /> {isSubmitting ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="signup">
            <Card>
              <CardHeader>
                <CardTitle>Subscrever</CardTitle>
                <CardDescription>Crie uma nova conta para começar a planejar.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...signupForm}>
                  <form onSubmit={signupForm.handleSubmit(onSignupSubmit)} className="space-y-4">
                    <FormField control={signupForm.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl><Input placeholder="seu@email.com" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="password" render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={signupForm.control} name="confirmPassword" render={({ field }) => (
                       <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <FormControl><Input type="password" placeholder="********" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      <UserPlus className="mr-2" /> {isSubmitting ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou continue com</span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleQuickLogin} disabled={isSubmitting}>
          <Zap className="mr-2 text-yellow-500" /> Login Rápido para Demonstração
        </Button>
      </div>
    </div>
  );
}
