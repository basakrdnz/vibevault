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
    const status = searchParams.get('status');

    console.log(`📝 Getting watchlist for user: ${session.user.id}`);

    const watchlist = await WatchlistService.getUserWatchlist(
      session.user.id, 
      status || undefined
    );
    
    console.log(`✅ Found ${watchlist.length} items in watchlist`);

    return NextResponse.json({
      watchlist,
      total: watchlist.length
    });
  } catch (error) {
    console.error('❌ Get watchlist error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { movieId, status, rating, notes } = body;

    if (!movieId) {
      return NextResponse.json(
        { error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    console.log(`➕ Adding movie ${movieId} to watchlist for user: ${session.user.id}`);

    const watchlistItem = await WatchlistService.addToWatchlist({
      userId: session.user.id,
      movieId,
      status,
      rating,
      notes
    });
    
    console.log(`✅ Movie added to watchlist successfully`);

    return NextResponse.json(watchlistItem, { status: 201 });
  } catch (error) {
    console.error('❌ Add to watchlist error:', error);
    
    if (error instanceof Error) {
      if (error.message === 'Movie already in watchlist') {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
