'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Star, Clock, Calendar, Eye, Plus, Heart } from 'lucide-react';
import { MovieSearchResult } from '@/lib/omdb-api';
import { AddToWatchlistButton } from '@/components/add-to-watchlist-button';

interface MoodAnalytics {
  movieId: string;
  totalEntries: number;
  topEmotions: {
    emotion: string;
    count: number;
    percentage: number;
  }[];
}

interface MoviePopupProps {
  movie: MovieSearchResult;
  isOpen: boolean;
  onClose: () => void;
}

export function MoviePopup({ movie, isOpen, onClose }: MoviePopupProps) {
  const [isDiscovering, setIsDiscovering] = useState(false);
  const [moodAnalytics, setMoodAnalytics] = useState<MoodAnalytics | null>(null);
  const [loadingMood, setLoadingMood] = useState(false);

  if (!isOpen) return null;

  const handleDiscovery = async () => {
    setIsDiscovering(true);
    try {
      const response = await fetch('/api/discovery', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ movieId: movie.id || movie.imdbID }),
      });

      const data = await response.json();
      
      if (data.success && data.isNewDiscovery) {
        console.log(`🎬 New movie discovered! Total: ${data.discoveryCount}`);
      }
    } catch (error) {
      console.error('Error recording discovery:', error);
    } finally {
      setIsDiscovering(false);
    }
  };

  const fetchMoodAnalytics = async () => {
    setLoadingMood(true);
    try {
      const response = await fetch(`/api/mood-analytics?movieId=${movie.id || movie.imdbID}`);
      const data = await response.json();
      
      if (data.success) {
        setMoodAnalytics(data.analytics);
        console.log('📊 Mood analytics loaded:', data.analytics);
      }
    } catch (error) {
      console.error('Error fetching mood analytics:', error);
    } finally {
      setLoadingMood(false);
    }
  };

  // Auto-discover when popup opens
  useEffect(() => {
    if (isOpen) {
      handleDiscovery();
      fetchMoodAnalytics();
    }
  }, [isOpen]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <CardContent className="p-0">
          {/* Close Button */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-4 right-4 z-10 bg-white/80 border-white/50 text-gray-700 hover:bg-white"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="flex flex-col lg:flex-row">
            {/* Movie Poster */}
            <div className="lg:w-1/3">
              <img
                src={(movie.poster || movie.Poster) !== 'N/A' ? (movie.poster || movie.Poster) : '/placeholder-movie.jpg'}
                alt={movie.title || movie.Title}
                className="w-full h-64 lg:h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder-movie.jpg';
                }}
              />
            </div>
            
            {/* Movie Info */}
            <div className="lg:w-2/3 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {movie.title || movie.Title}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {movie.year || movie.Year}
                    </div>
                    {movie.runtime && (
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {movie.runtime}
                      </div>
                    )}
                    {movie.imdbRating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        {movie.imdbRating}/10
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Genres */}
              {movie.genre && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {movie.genre.split(',').map((genre, index) => (
                      <Badge key={index} variant="secondary" className="bg-purple-100 text-purple-800">
                        {genre.trim()}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Plot */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Plot</h3>
                <p className="text-gray-700 leading-relaxed">
                  {movie.plot || movie.Plot || 'No plot available'}
                </p>
              </div>

              {/* Mood Analytics */}
              {moodAnalytics && moodAnalytics.totalEntries > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Heart className="h-5 w-5 text-pink-500" />
                    How People Felt
                  </h3>
                  <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-3">
                      Based on {moodAnalytics.totalEntries} emotional responses
                    </div>
                    <div className="space-y-2">
                      {moodAnalytics.topEmotions.map((emotion, index) => (
                        <div key={emotion.emotion} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${
                              index === 0 ? 'bg-pink-500' : 'bg-purple-500'
                            }`}></div>
                            <span className="font-medium text-gray-800">{emotion.emotion}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div 
                                className={`h-2 rounded-full ${
                                  index === 0 ? 'bg-pink-500' : 'bg-purple-500'
                                }`}
                                style={{ width: `${emotion.percentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-semibold text-gray-700 w-8">
                              {emotion.percentage}%
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {loadingMood && (
                <div className="mb-6">
                  <div className="flex items-center gap-2 text-gray-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-pink-500"></div>
                    Loading emotional insights...
                  </div>
                </div>
              )}

              {/* Additional Info */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {movie.director && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Director</h4>
                    <p className="text-gray-700">{movie.director}</p>
                  </div>
                )}
                {movie.language && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Language</h4>
                    <p className="text-gray-700">{movie.language}</p>
                  </div>
                )}
                {movie.country && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">Country</h4>
                    <p className="text-gray-700">{movie.country}</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
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
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
