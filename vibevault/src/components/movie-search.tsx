'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, Film, Star, Calendar, Clock, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddMovieForm } from './add-movie-form';
import { AddToWatchlistButton } from './add-to-watchlist-button';

interface MovieSearchResult {
  id: string;
  title: string;
  year: string;
  genre?: string;
  director?: string;
  plot?: string;
  poster?: string;
  imdbRating?: string;
  runtime?: string;
  language?: string;
  country?: string;
  createdAt: Date;
}

interface MovieSearchProps {
  onMovieSelect?: (movie: MovieSearchResult) => void;
}

export function MovieSearch({ onMovieSelect }: MovieSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      setError('');

      try {
        const response = await fetch(`/api/movies?q=${encodeURIComponent(searchQuery)}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Search failed');
        }

        setResults(data.movies || []);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Effect to trigger search when query changes
  useEffect(() => {
    debouncedSearch(query);
  }, [query, debouncedSearch]);

  const handleMovieClick = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    onMovieSelect?.(movie);
  };

  const handleMovieAdded = (movie: MovieSearchResult) => {
    setShowAddForm(false);
    // Optionally refresh search results
    if (query.trim()) {
      debouncedSearch(query);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Form */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search for movies... (type to search)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10"
          />
          {loading && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Movie
        </Button>
      </div>

      {/* Add Movie Form */}
      {showAddForm && (
        <div className="mb-6">
          <AddMovieForm onMovieAdded={handleMovieAdded} />
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Search Results ({results.length})</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {results.map((movie) => (
              <Card 
                key={movie.id} 
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleMovieClick(movie)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    {movie.poster ? (
                      <img
                        src={movie.poster}
                        alt={movie.title}
                        className="w-16 h-20 object-cover rounded"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="w-16 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <Film className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-sm line-clamp-2">{movie.title}</CardTitle>
                      <CardDescription className="text-xs">
                        {movie.year} • {movie.genre}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-2">
                    <AddToWatchlistButton 
                      movieId={movie.id} 
                      movieTitle={movie.title}
                    />
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Movie Details */}
      {selectedMovie && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-start gap-4">
              {selectedMovie.poster ? (
                <img
                  src={selectedMovie.poster}
                  alt={selectedMovie.title}
                  className="w-32 h-48 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-32 h-48 bg-gray-200 rounded flex items-center justify-center">
                  <Film className="h-16 w-16 text-gray-400" />
                </div>
              )}
              <div className="flex-1">
                <CardTitle className="text-2xl mb-2">{selectedMovie.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">
                    <Calendar className="h-3 w-3 mr-1" />
                    {selectedMovie.year}
                  </Badge>
                  {selectedMovie.runtime && (
                    <Badge variant="secondary">
                      <Clock className="h-3 w-3 mr-1" />
                      {selectedMovie.runtime}
                    </Badge>
                  )}
                  {selectedMovie.imdbRating && (
                    <Badge variant="secondary">
                      <Star className="h-3 w-3 mr-1" />
                      {selectedMovie.imdbRating}/10
                    </Badge>
                  )}
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {selectedMovie.genre && <p><strong>Genre:</strong> {selectedMovie.genre}</p>}
                  {selectedMovie.director && <p><strong>Director:</strong> {selectedMovie.director}</p>}
                  {selectedMovie.language && <p><strong>Language:</strong> {selectedMovie.language}</p>}
                  {selectedMovie.country && <p><strong>Country:</strong> {selectedMovie.country}</p>}
                  {selectedMovie.plot && <p><strong>Plot:</strong> {selectedMovie.plot}</p>}
                </div>
                <div className="mt-4">
                  <AddToWatchlistButton 
                    movieId={selectedMovie.id} 
                    movieTitle={selectedMovie.title}
                  />
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* No Results */}
      {results.length === 0 && query && !loading && (
        <div className="text-center py-8">
          <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No movies found for "{query}"</p>
          <p className="text-sm text-gray-500 mt-2">
            Try adding a new movie or search with different keywords
          </p>
        </div>
      )}

      {/* Empty State */}
      {!query && (
        <div className="text-center py-8">
          <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Start typing to search movies</p>
          <p className="text-sm text-gray-500 mt-2">
            Try searching for "batman", "nolan", "action", or any movie title
          </p>
        </div>
      )}
    </div>
  );
}

// Debounce utility function
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}