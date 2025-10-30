import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MovieDiscoveryService } from '@/lib/movie-discovery-service';

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { movieId } = await request.json();

    if (!movieId) {
      return NextResponse.json(
        { success: false, error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    console.log(`🔍 Recording discovery for user ${session.user.id}, movie ${movieId}`);

    const isNewDiscovery = await MovieDiscoveryService.recordDiscovery(session.user.id, movieId);
    
    if (isNewDiscovery) {
      const newCount = await MovieDiscoveryService.getDiscoveryCount(session.user.id);
      
      return NextResponse.json({
        success: true,
        isNewDiscovery: true,
        discoveryCount: newCount,
        message: 'Movie discovered successfully!'
      });
    } else {
      return NextResponse.json({
        success: true,
        isNewDiscovery: false,
        message: 'Movie already discovered'
      });
    }
  } catch (error) {
    console.error('❌ Error recording discovery:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '20');

    const [discoveryCount, discoveryHistory] = await Promise.all([
      MovieDiscoveryService.getDiscoveryCount(session.user.id),
      MovieDiscoveryService.getDiscoveryHistory(session.user.id, limit)
    ]);

    return NextResponse.json({
      success: true,
      discoveryCount,
      discoveryHistory
    });
  } catch (error) {
    console.error('❌ Error getting discovery data:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
