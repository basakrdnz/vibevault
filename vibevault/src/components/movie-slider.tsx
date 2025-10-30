'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Star, Pause, Play, Eye } from 'lucide-react';
import { MovieSearchResult } from '@/lib/omdb-api';
import { AddToWatchlistButton } from '@/components/add-to-watchlist-button';
import { MoviePopup } from '@/components/movie-popup';

export function MovieSlider() {
  const [movies, setMovies] = useState<MovieSearchResult[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [cacheInfo, setCacheInfo] = useState<{cached: boolean, cacheAge: string} | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieSearchResult | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    fetchPopularMovies();
  }, []);

  // Auto-slider effect
  useEffect(() => {
    if (movies.length > 1 && !isPaused) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === movies.length - 1 ? 0 : prevIndex + 1
        );
      }, 6000); // Change slide every 6 seconds for spotlight

      return () => clearInterval(interval);
    }
  }, [movies.length, isPaused]);

  const fetchPopularMovies = async () => {
    try {
      console.log('🎬 Fetching spotlight movies...');
      const response = await fetch('/api/movies/popular');
      const data = await response.json();
      
      console.log('📊 Spotlight API response:', data);
      
      if (data.success) {
        setMovies(data.movies);
        setCacheInfo({
          cached: data.cached || false,
          cacheAge: data.cacheAge || 'unknown'
        });
        console.log(`✅ Loaded ${data.movies.length} spotlight movies`);
      } else {
        console.error('❌ Failed to fetch spotlight movies:', data.error);
      }
    } catch (error) {
      console.error('❌ Error fetching movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const openMoviePopup = (movie: MovieSearchResult) => {
    setSelectedMovie(movie);
    setIsPopupOpen(true);
  };

  const closeMoviePopup = () => {
    setIsPopupOpen(false);
    setSelectedMovie(null);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  };

  if (loading) {
    return (
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">
          ✨ Today's Spotlight
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-white">Loading spotlight movies...</div>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">
          ✨ Today's Spotlight
        </h2>
        <div className="flex justify-center items-center h-64">
          <div className="text-white">No spotlight movies available</div>
        </div>
      </div>
    );
  }

  const currentMovie = movies[currentIndex];

  return (
    <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-white drop-shadow-md">
          ✨ Today's Spotlight
        </h2>
        {cacheInfo && (
          <div className="text-sm text-gray-300">
            {cacheInfo.cached ? (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                Fresh cache
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 bg-blue-400 rounded-full"></span>
                New selection
              </span>
            )}
          </div>
        )}
      </div>
      
      <div className="relative">
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 border-white/30 text-white hover:bg-white/30"
          onClick={prevSlide}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 bg-white/20 border-white/30 text-white hover:bg-white/30"
          onClick={nextSlide}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Auto-play Toggle */}
        <Button
          variant="outline"
          size="icon"
          className="absolute top-2 right-2 z-10 bg-white/20 border-white/30 text-white hover:bg-white/30"
          onClick={() => setIsPaused(!isPaused)}
        >
          {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
        </Button>

        {/* Movie Card */}
        <Card className="bg-white/10 backdrop-blur-sm border-white/20 overflow-hidden">
          <CardContent className="p-0">
            <div className="flex flex-col md:flex-row">
              {/* Movie Poster */}
              <div className="md:w-1/3">
                <img
                  src={(currentMovie.poster || currentMovie.Poster) !== 'N/A' ? (currentMovie.poster || currentMovie.Poster) : '/placeholder-movie.jpg'}
                  alt={currentMovie.title || currentMovie.Title}
                  className="w-full h-64 md:h-80 object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-movie.jpg';
                  }}
                />
              </div>
              
              {/* Movie Info */}
              <div className="md:w-2/3 p-6">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="text-2xl font-bold text-white drop-shadow-md">
                    {currentMovie.title || currentMovie.Title}
                  </h3>
                  <span className="text-gray-300 text-lg">({currentMovie.year || currentMovie.Year})</span>
                </div>
                
                <div className="flex items-center gap-2 mb-4">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="text-white font-semibold">Featured Movie</span>
                </div>
                
                <p className="text-gray-200 mb-4 leading-relaxed">
                  Discover this amazing movie and add it to your watchlist to track your emotional journey!
                </p>
                
                <div className="flex gap-3">
                  <AddToWatchlistButton 
                    movieId={currentMovie.id || currentMovie.imdbID}
                    movieTitle={currentMovie.title || currentMovie.Title}
                    movieYear={currentMovie.year || currentMovie.Year}
                    moviePoster={currentMovie.poster || currentMovie.Poster}
                    movieGenre={currentMovie.genre || currentMovie.Genre}
                    movieDirector={currentMovie.director || currentMovie.Director}
                    moviePlot={currentMovie.plot || currentMovie.Plot}
                    movieImdbRating={currentMovie.imdbRating || currentMovie.imdbRating}
                    movieRuntime={currentMovie.runtime || currentMovie.Runtime}
                    movieLanguage={currentMovie.language || currentMovie.Language}
                    movieCountry={currentMovie.country || currentMovie.Country}
                  />
                  <Button 
                    onClick={() => openMoviePopup(currentMovie)}
                    variant="outline" 
                    className="border-white/30 text-white hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    İncele
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dots Indicator */}
        <div className="flex justify-center mt-4 gap-2">
          {movies.map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </div>
      </div>
      
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
