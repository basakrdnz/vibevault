import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { WatchlistService } from '@/lib/watchlist-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Checking watchlist status for movie: ${movieId}`);

    const isInWatchlist = await WatchlistService.isInWatchlist(session.user.id, movieId);
    const watchlistItem = await WatchlistService.getWatchlistItem(session.user.id, movieId);
    
    console.log(`✅ Watchlist status checked: ${isInWatchlist}`);

    return NextResponse.json({
      isInWatchlist,
      watchlistItem: watchlistItem || null
    });
  } catch (error) {
    console.error('❌ Check watchlist status error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
