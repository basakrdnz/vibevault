import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get user profile with statistics
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    // Get user statistics
    const [totalMovies, totalMoods, watchlistItems, moodEntries] = await Promise.all([
      prisma.watchlistItem.count({
        where: { userId: session.user.id }
      }),
      prisma.moodEntry.count({
        where: { userId: session.user.id }
      }),
      prisma.watchlistItem.findMany({
        where: { userId: session.user.id },
        select: { rating: true }
      }),
      prisma.moodEntry.findMany({
        where: { userId: session.user.id },
        select: { mood: true }
      })
    ]);

    // Calculate average rating
    const ratings = watchlistItems.filter(item => item.rating !== null).map(item => item.rating!);
    const averageRating = ratings.length > 0 ? ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

    // Find favorite genre (most common mood)
    const moodCounts = moodEntries.reduce((acc, entry) => {
      acc[entry.mood] = (acc[entry.mood] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const favoriteGenre = Object.keys(moodCounts).length > 0 
      ? Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b)
      : 'N/A';

    const profile = {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
      stats: {
        totalMovies,
        totalMoods,
        averageRating,
        favoriteGenre
      }
    };

    return NextResponse.json({ success: true, profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await request.json();

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Name is required' }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { name: name.trim() },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
