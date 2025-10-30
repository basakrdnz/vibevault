'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Film, Star, Calendar, Clock, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const movieSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  year: z.string().min(4, 'Year must be at least 4 characters'),
  genre: z.string().optional(),
  director: z.string().optional(),
  plot: z.string().optional(),
  poster: z.string().url().optional().or(z.literal('')),
  imdbRating: z.string().optional(),
  runtime: z.string().optional(),
  language: z.string().optional(),
  country: z.string().optional(),
});

type MovieFormData = z.infer<typeof movieSchema>;

interface AddMovieFormProps {
  onMovieAdded?: (movie: any) => void;
}

export function AddMovieForm({ onMovieAdded }: AddMovieFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const form = useForm<MovieFormData>({
    resolver: zodResolver(movieSchema),
    defaultValues: {
      title: '',
      year: '',
      genre: '',
      director: '',
      plot: '',
      poster: '',
      imdbRating: '',
      runtime: '',
      language: '',
      country: '',
    },
  });

  const onSubmit = async (data: MovieFormData) => {
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🎬 Adding new movie:', data);

      const response = await fetch('/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to add movie');
      }

      console.log('✅ Movie added successfully:', result);
      setSuccess('Movie added successfully!');
      form.reset();
      onMovieAdded?.(result);
    } catch (err) {
      console.error('❌ Add movie error:', err);
      setError(err instanceof Error ? err.message : 'Failed to add movie');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Add New Movie
        </CardTitle>
        <CardDescription>
          Add a new movie to the VibeVault database
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Title and Year */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Movie title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="year"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year *</FormLabel>
                    <FormControl>
                      <Input placeholder="2024" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Genre and Director */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="genre"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Genre</FormLabel>
                    <FormControl>
                      <Input placeholder="Action, Drama, Comedy" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="director"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Director</FormLabel>
                    <FormControl>
                      <Input placeholder="Director name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Plot */}
            <FormField
              control={form.control}
              name="plot"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Plot</FormLabel>
                  <FormControl>
                    <textarea
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Movie plot summary"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Poster URL */}
            <FormField
              control={form.control}
              name="poster"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Poster URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://example.com/poster.jpg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="imdbRating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IMDb Rating</FormLabel>
                    <FormControl>
                      <Input placeholder="8.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="runtime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Runtime</FormLabel>
                    <FormControl>
                      <Input placeholder="120 min" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <Input placeholder="English" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Country */}
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Success/Error Messages */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
                {success}
              </div>
            )}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? 'Adding Movie...' : 'Add Movie'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
