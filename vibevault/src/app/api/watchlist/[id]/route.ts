import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { WatchlistService } from '@/lib/watchlist-service';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    const body = await request.json();
    const { status, rating, notes } = body;

    console.log(`✏️ Updating watchlist item: ${id}`);

    const watchlistItem = await WatchlistService.updateWatchlistItem(id, {
      status,
      rating,
      notes
    });
    
    console.log(`✅ Watchlist item updated successfully`);

    return NextResponse.json(watchlistItem);
  } catch (error) {
    console.error('❌ Update watchlist item error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`🗑️ Removing watchlist item: ${id}`);

    await WatchlistService.removeFromWatchlist(id);
    
    console.log(`✅ Watchlist item removed successfully`);

    return NextResponse.json({ message: 'Item removed from watchlist' });
  } catch (error) {
    console.error('❌ Remove watchlist item error:', error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
