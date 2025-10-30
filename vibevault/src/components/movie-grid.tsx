'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Star, Clock, Calendar, Search, Eye } from 'lucide-react';
import { MovieSearchResult } from '@/lib/omdb-api';
import { AddToWatchlistButton } from '@/components/add-to-watchlist-button';
import { MoviePopup } from '@/components/movie-popup';

interface MovieGridProps {
  title?: string;
  limit?: number;
}

// Debounce hook
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function MovieGrid({ title = "🎬 All Movies", limit = 20 }: MovieGridProps) {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MovieSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  // Debounce search query to avoid too many API calls
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      performSearch();
    } else {
      fetchMovies();
    }
  }, [selectedCategory, debouncedSearchQuery]);

  const fetchMovies = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/movies/random?limit=${limit}&category=${selectedCategory}`);
      const data = await response.json();
      
      if (data.success) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const performSearch = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    try {
      setIsSearching(true);
      console.log(`🔍 Searching for: "${debouncedSearchQuery}"`);
      
      const response = await fetch(`/api/movies?q=${encodeURIComponent(debouncedSearchQuery)}&limit=${limit}`);
      const data = await response.json();
      
      if (data.movies && data.movies.length > 0) {
        let filteredResults = data.movies;
        
        // Filter by category if not 'all'
        if (selectedCategory !== 'all') {
          filteredResults = data.movies.filter((movie: any) => 
            movie.genre?.toLowerCase().includes(selectedCategory.toLowerCase())
          );
        }
        
        console.log(`✅ Found ${filteredResults.length} movies`);
        setSearchResults(filteredResults.slice(0, limit));
      } else {
        console.log('❌ No movies found');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [debouncedSearchQuery, selectedCategory, limit]);

  const openMoviePopup = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    setIsPopupOpen(true);
  };

  const closeMoviePopup = () => {
    setIsPopupOpen(false);
    setSelectedMovie(null);
  };

  const categories = [
    { id: 'all', label: 'All', emoji: '🎬' },
    { id: 'action', label: 'Action', emoji: '💥' },
    { id: 'comedy', label: 'Comedy', emoji: '😂' },
    { id: 'drama', label: 'Drama', emoji: '🎭' },
    { id: 'sci-fi', label: 'Sci-Fi', emoji: '🚀' },
    { id: 'horror', label: 'Horror', emoji: '👻' },
    { id: 'romance', label: 'Romance', emoji: '💕' },
    { id: 'thriller', label: 'Thriller', emoji: '🔪' }
  ];

  if (loading) {
    return (
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">{title}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, index) => (
            <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="animate-pulse">
                  <div className="w-full h-64 bg-gray-300/20"></div>
                  <div className="p-4 space-y-2">
                    <div className="h-4 bg-gray-300/20 rounded"></div>
                    <div className="h-3 bg-gray-300/20 rounded w-2/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold text-white drop-shadow-md mb-4 md:mb-0">
          {title}
        </h2>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id ? "bg-purple-600 hover:bg-purple-700" : "border-white/30 text-white hover:bg-white/10"}
            >
              <span className="mr-1">{category.emoji}</span>
              {category.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10 bg-white/20 border-white/30 text-white placeholder-gray-300 focus:bg-white/30 focus:border-white/50"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            </div>
          )}
        </div>
        {searchQuery.trim() && (
          <div className="mt-2 text-sm text-gray-300">
            {isSearching ? 'Searching...' : `Found ${searchResults.length} movies for "${searchQuery}"`}
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
        {(searchQuery.trim() ? searchResults : movies).map((movie) => (
          <Card key={movie.id || movie.imdbID} className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden hover:bg-white/15 transition-all duration-300 group">
            <CardContent className="p-0">
              {/* Movie Poster */}
              <div className="relative">
                <img
                  src={(movie.poster || movie.Poster) !== 'N/A' ? (movie.poster || movie.Poster) : '/placeholder-movie.jpg'}
                  alt={movie.title || movie.Title}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-movie.jpg';
                  }}
                />
                
                {/* Overlay with Action Buttons */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-2">
                  <Button
                    onClick={() => openMoviePopup(movie)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 text-white w-24"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    İncele
                  </Button>
                  <AddToWatchlistButton 
                    movieId={movie.id || movie.imdbID}
                    movieTitle={movie.title || movie.Title}
                    movieYear={movie.year || movie.Year}
                    moviePoster={movie.poster || movie.Poster}
                    movieGenre={movie.genre}
                    movieDirector={movie.director}
                    moviePlot={movie.plot || movie.Plot}
                    movieImdbRating={movie.imdbRating}
                    movieRuntime={movie.runtime}
                    movieLanguage={movie.language}
                    movieCountry={movie.country}
                  />
                </div>
                
                {/* Rating Badge */}
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-200 border-yellow-400/30 text-xs">
                    <Star className="h-3 w-3 mr-1 fill-current" />
                    {movie.imdbRating || 'N/A'}
                  </Badge>
                </div>
              </div>
              
              {/* Movie Info */}
              <div className="p-3">
                <h3 className="text-sm font-bold text-white drop-shadow-md line-clamp-2 mb-1">
                  {movie.title || movie.Title}
                </h3>
                
                <div className="flex items-center gap-2 text-xs text-gray-300 mb-2">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {movie.year || movie.Year}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {movie.runtime || movie.Runtime || 'N/A'}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1 mb-2">
                  {(movie.genre || movie.Genre)?.split(', ').slice(0, 2).map((genre, index) => (
                    <Badge key={index} variant="outline" className="text-xs border-white/30 text-white/80 px-1 py-0">
                      {genre.trim()}
                    </Badge>
                  ))}
                </div>
                
                <p className="text-xs text-gray-300 line-clamp-2 leading-relaxed">
                  {movie.plot || movie.Plot || 'No plot available'}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {(searchQuery.trim() ? searchResults : movies).length === 0 && (
        <div className="text-center py-12">
          <div className="text-white text-lg">
            {searchQuery.trim() ? 'No movies found for your search' : 'No movies found in this category'}
          </div>
          <div className="text-gray-300 text-sm mt-2">
            {searchQuery.trim() ? 'Try a different search term' : 'Try selecting a different category'}
          </div>
        </div>
      )}
      
      {/* Movie Popup */}
      {selectedMovie && (
        <MoviePopup
          movie={selectedMovie}
          isOpen={isPopupOpen}
          onClose={closeMoviePopup}
        />
      )}
    </div>
  );
}
