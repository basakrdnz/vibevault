'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck, Star, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AddToWatchlistButtonProps {
  movieId: string;
  movieTitle: string;
  onStatusChange?: (isInWatchlist: boolean) => void;
}

interface WatchlistStatus {
  isInWatchlist: boolean;
  watchlistItem: {
    id: string;
    status: string;
    rating?: number;
    notes?: string;
  } | null;
}

export function AddToWatchlistButton({ 
  movieId, 
  movieTitle, 
  onStatusChange 
}: AddToWatchlistButtonProps) {
  const [status, setStatus] = useState<WatchlistStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  // Check initial status
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/watchlist/check?movieId=${movieId}`);
        const data = await response.json();
        
        if (response.ok) {
          setStatus(data);
          onStatusChange?.(data.isInWatchlist);
        }
      } catch (error) {
        console.error('Error checking watchlist status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkStatus();
  }, [movieId, onStatusChange]);

  const handleAddToWatchlist = async () => {
    if (!status) return;

    setLoading(true);
    try {
      if (status.isInWatchlist) {
        // Remove from watchlist
        const response = await fetch(`/api/watchlist/${status.watchlistItem?.id}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setStatus({
            isInWatchlist: false,
            watchlistItem: null
          });
          onStatusChange?.(false);
        }
      } else {
        // Add to watchlist
        const response = await fetch('/api/watchlist', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            movieId,
            status: 'want_to_watch'
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setStatus({
            isInWatchlist: true,
            watchlistItem: {
              id: data.id,
              status: data.status,
              rating: data.rating,
              notes: data.notes
            }
          });
          onStatusChange?.(true);
        }
      }
    } catch (error) {
      console.error('Error updating watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <Button variant="outline" size="sm" disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-2"></div>
        Checking...
      </Button>
    );
  }

  return (
    <Button
      variant={status?.isInWatchlist ? "default" : "outline"}
      size="sm"
      onClick={handleAddToWatchlist}
      disabled={loading}
      className={status?.isInWatchlist ? "bg-green-600 hover:bg-green-700" : ""}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
      ) : status?.isInWatchlist ? (
        <BookmarkCheck className="h-4 w-4 mr-2" />
      ) : (
        <Bookmark className="h-4 w-4 mr-2" />
      )}
      {status?.isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
    </Button>
  );
}
