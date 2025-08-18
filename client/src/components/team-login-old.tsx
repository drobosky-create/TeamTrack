import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';





import { Users, Mail, Lock } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { loginSchema, type LoginCredentials } from '@shared/schema';

import appleBitesLogo from "@assets/apple-bites-logo.png";

interface TeamLoginProps {
  onLoginSuccess: (user: any) => void;
}

export default function TeamLogin({ onLoginSuccess }: TeamLoginProps) {
  const [error, setError] = useState('');

  const form = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const loginMutation = useMutation({
    mutationFn: async (data: LoginCredentials) => {
      const response = await fetch('/api/team/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Invalid credentials');
      }
      
      return response.json();
    },
    onSuccess: (data) => {
      setError('');
      onLoginSuccess(data.user);
    },
    onError: (error: Error) => {
      setError(error.message);
    },
  });

  const onSubmit = (data: LoginCredentials) => {
    setError('');
    loginMutation.mutate(data);
  };

  return (
    <div >
      <Card >
        <div >
          <img 
            src={appleBitesLogo} 
            alt="Meritage Partners" 
            
          />
          <h1 >Team Dashboard Access</h1>
          <p >Sign in to manage your platform</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div >
                      <Mail  />
                      <Input
                        {...field}
                        type="email"
                        placeholder="Enter your email"
                        
                        disabled={loginMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div >
                      <Lock  />
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        
                        disabled={loginMutation.isPending}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              type="submit"
              
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </Card>
    </div>
  );
}