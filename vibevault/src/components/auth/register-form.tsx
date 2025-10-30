'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function RegisterForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  });

  const onSubmit = async (data: { email: string; password: string; name?: string }) => {
    console.log('🎯 Register form submitted:', data);
    setIsLoading(true);
    setError('');

    try {
      console.log('📤 Sending request to /api/auth/register');
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      console.log('📥 Response status:', response.status);
      console.log('📥 Response headers:', response.headers);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('❌ Registration failed:', errorData);
        throw new Error(errorData.error || 'Registration failed');
      }

      const successData = await response.json();
      console.log('✅ Registration successful:', successData);

      // Show success message and redirect
      alert('Registration successful! Please login with your credentials.');
      router.push('/login?message=Registration successful');
    } catch (err) {
      console.error('💥 Registration error:', err);
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
      <CardHeader>
        <CardTitle className="text-white text-2xl font-bold text-center drop-shadow-md">Create Account</CardTitle>
        <CardDescription className="text-gray-200 text-center drop-shadow-sm">
          Join VibeVault to start logging your emotional viewing experiences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white font-medium drop-shadow-sm">Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Your name" 
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
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center text-sm">
          <span className="text-gray-200 drop-shadow-sm">Already have an account? </span>
          <Link href="/login" className="text-white font-medium hover:text-gray-200 underline drop-shadow-sm transition-colors">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
