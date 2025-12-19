'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import { loginSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string }) => {
    console.log('🎯 Login form submitted:', data);
    setIsLoading(true);
    setError('');

    try {
      console.log('🔐 Attempting to sign in with NextAuth...');
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: '/dashboard',
      });
      
      console.log('📊 SignIn result:', result);
      
      if (result?.error) {
        console.error('❌ SignIn error:', result.error);
        setError('Invalid credentials. Please try again.');
        return;
      }
      
      if (result?.ok) {
        console.log('✅ Login successful');
        router.push('/dashboard');
        router.refresh();
      } else if (result?.url) {
        // Handle redirect
        router.push(result.url);
      }
    } catch (err) {
      console.error('❌ Login failed:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl font-bold text-center drop-shadow-md">Sign In</CardTitle>
        <CardDescription className="text-gray-200 text-center drop-shadow-sm">
          Enter your credentials to access your VibeVault account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium drop-shadow-sm">Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder="your@email.com" 
                      className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:bg-white/30 focus:border-white/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium drop-shadow-sm">Password</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder="••••••••" 
                      className="bg-white/20 border-white/30 text-white placeholder-gray-300 focus:bg-white/30 focus:border-white/50"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage className="text-red-200" />
                </FormItem>
              )}
            />
            {error && (
              <div className="text-red-200 text-sm bg-red-500/20 p-3 rounded-md border border-red-400/30">
                {error}
              </div>
            )}
            <Button 
              type="submit" 
              className="w-full bg-white text-purple-900 hover:bg-gray-100 font-semibold shadow-lg transition-all duration-200" 
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-200 drop-shadow-sm">Don&apos;t have an account? </span>
          <Link href="/register" className="text-white font-medium hover:text-gray-200 underline drop-shadow-sm transition-colors">
            Create one
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
