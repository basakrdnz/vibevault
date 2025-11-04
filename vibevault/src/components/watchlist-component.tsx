'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Trash2, Star, Calendar, Clock, Film, Edit3, Heart, Search, Filter, SortAsc, SortDesc, Eye } from 'lucide-react';
import { WatchlistItemResult } from '@/lib/watchlist-service';
import { MoodEntryForm } from '@/components/mood-entry-form';

export function WatchlistComponent() {
  const [watchlist, setWatchlist] = useState<WatchlistItemResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [moodFormOpen, setMoodFormOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<WatchlistItemResult | null>(null);
  
  // History features for watched movies
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'rating' | 'title'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/watchlist');
      const data = await response.json();

      if (response.ok) {
        setWatchlist(data.watchlist || []);
      } else {
        setError(data.error || 'Failed to fetch watchlist');
      }
    } catch (err) {
      console.error('Error fetching watchlist:', err);
      setError('Failed to fetch watchlist');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (itemId: string) => {
    try {
      const response = await fetch(`/api/watchlist/${itemId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setWatchlist(prev => prev.filter(item => item.id !== itemId));
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to remove item');
      }
    } catch (err) {
      console.error('Error removing from watchlist:', err);
      setError('Failed to remove item');
    }
  };

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/watchlist/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setWatchlist(prev => 
          prev.map(item => 
            item.id === itemId 
              ? { ...item, status: newStatus }
              : item
          )
        );
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update status');
      }
    } catch (err) {
      console.error('Error updating status:', err);
      setError('Failed to update status');
    }
  };

  const openMoodForm = (item: WatchlistItemResult) => {
    setSelectedMovie(item);
    setMoodFormOpen(true);
  };

  const closeMoodForm = () => {
    setMoodFormOpen(false);
    setSelectedMovie(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'want_to_watch':
        return 'bg-blue-100 text-blue-800';
      case 'watching':
        return 'bg-yellow-100 text-yellow-800';
      case 'watched':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'want_to_watch':
        return 'Want to Watch';
      case 'watching':
        return 'Watching';
      case 'watched':
        return 'Watched';
      default:
        return status;
    }
  };

  // Filter and sort watched movies
  const getFilteredAndSortedWatchedMovies = () => {
    let filtered = watchlist.filter(item => item.status === 'watched');
    
    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(item => 
        item.movie.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.movie.genre?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.movie.director?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Favorites filter
    if (showFavoritesOnly) {
      filtered = filtered.filter(item => item.rating && item.rating >= 4);
    }
    
    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
          break;
        case 'rating':
          comparison = (a.rating || 0) - (b.rating || 0);
          break;
        case 'title':
          comparison = a.movie.title.localeCompare(b.movie.title);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return filtered;
  };

  if (loading) {
    return (
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">
          📋 My Watchlist
        </h2>
        <div className="flex justify-center items-center h-32">
          <div className="text-white">Loading watchlist...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">
          📋 My Watchlist
        </h2>
        <div className="text-red-300">{error}</div>
        <Button onClick={fetchWatchlist} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  // Group watchlist by status
  const groupedWatchlist = {
    want_to_watch: watchlist.filter(item => item.status === 'want_to_watch'),
    watching: watchlist.filter(item => item.status === 'watching'),
    watched: watchlist.filter(item => item.status === 'watched')
  };

  const renderMovieCard = (item: WatchlistItemResult) => (
    <Card key={item.id} className="bg-white/10 backdrop-blur-sm border-white/20">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-3">
          {item.movie.poster ? (
            <img
              src={item.movie.poster}
              alt={item.movie.title}
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
            <CardTitle className="text-sm line-clamp-2 text-white">
              {item.movie.title}
            </CardTitle>
            <CardDescription className="text-xs text-gray-300">
              {item.movie.year} • {item.movie.genre}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(item.status)}>
              {getStatusText(item.status)}
            </Badge>
            {item.rating && (
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="h-3 w-3 fill-current" />
                <span className="text-xs">{item.rating}/5</span>
              </div>
            )}
          </div>
          
          {item.notes && (
            <p className="text-xs text-gray-300 line-clamp-2">
              "{item.notes}"
            </p>
          )}
          
          {/* Status Change Buttons */}
          <div className="flex gap-1 flex-wrap">
            {item.status === 'watched' ? (
              // Watched films only show mood button and delete
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMoodForm(item)}
                  className="text-xs px-2 py-1 h-6 text-pink-400 border-pink-400 hover:bg-pink-400 hover:text-white"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Add Mood
                </Button>
              </>
            ) : (
              // Non-watched films show status change options
              <>
                {item.status !== 'want_to_watch' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(item.id, 'want_to_watch')}
                    className="text-xs px-2 py-1 h-6 text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
                  >
                    Want to Watch
                  </Button>
                )}
                {item.status !== 'watching' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(item.id, 'watching')}
                    className="text-xs px-2 py-1 h-6 text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"
                  >
                    Watching
                  </Button>
                )}
                {item.status !== 'watched' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(item.id, 'watched')}
                    className="text-xs px-2 py-1 h-6 text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                  >
                    Watched
                  </Button>
                )}
              </>
            )}
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-400">
              {item.status === 'watched' ? (
                <span>Watched {new Date(item.updatedAt).toLocaleDateString()}</span>
              ) : (
                <span>Added {new Date(item.createdAt).toLocaleDateString()}</span>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRemoveFromWatchlist(item.id)}
              className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
      <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">
        📋 My Watchlist ({watchlist.length})
      </h2>

      {watchlist.length === 0 ? (
        <div className="text-center py-8">
          <Film className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-300">Your watchlist is empty</p>
          <p className="text-sm text-gray-400 mt-2">
            Add movies from the search or featured sections above
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Want to Watch */}
          {groupedWatchlist.want_to_watch.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-400" />
                Want to Watch ({groupedWatchlist.want_to_watch.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedWatchlist.want_to_watch.map(renderMovieCard)}
              </div>
            </div>
          )}

          {/* Currently Watching */}
          {groupedWatchlist.watching.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-400" />
                Currently Watching ({groupedWatchlist.watching.length})
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {groupedWatchlist.watching.map(renderMovieCard)}
              </div>
            </div>
          )}

          {/* Watched - Enhanced with History Features */}
          {groupedWatchlist.watched.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Eye className="h-5 w-5 text-green-400" />
                  Watched History ({getFilteredAndSortedWatchedMovies().length})
                </h3>
                
                {/* History Controls */}
                <div className="flex items-center gap-2">
                  {/* Search */}
                  <div className="relative">
                    <Search className="h-4 w-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search watched movies..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1 text-sm bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
                    />
                  </div>
                  
                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'date' | 'rating' | 'title')}
                    className="px-2 py-1 text-sm bg-white/10 border border-white/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="date">Date</option>
                    <option value="rating">Rating</option>
                    <option value="title">Title</option>
                  </select>
                  
                  {/* Sort Order */}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
                  >
                    {sortOrder === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
                  </Button>
                  
                  {/* Favorites Filter */}
                  <Button
                    variant={showFavoritesOnly ? "default" : "outline"}
                    size="sm"
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={showFavoritesOnly ? "bg-yellow-500 hover:bg-yellow-600" : "text-yellow-400 border-yellow-400 hover:bg-yellow-400 hover:text-white"}
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {getFilteredAndSortedWatchedMovies().map(renderMovieCard)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Mood Entry Form */}
      {selectedMovie && (
        <MoodEntryForm
          movie={{
            id: selectedMovie.movie.id,
            title: selectedMovie.movie.title,
            year: selectedMovie.movie.year,
            poster: selectedMovie.movie.poster || undefined
          }}
          isOpen={moodFormOpen}
          onClose={closeMoodForm}
          onSuccess={() => {
            console.log('✅ Mood entry added successfully');
            // Optionally refresh data or show success message
          }}
        />
      )}
    </div>
  );
}
