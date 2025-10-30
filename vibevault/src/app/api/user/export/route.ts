import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    // Get all user data
    const [watchlistItems, moodEntries, movieDiscoveries] = await Promise.all([
      prisma.watchlistItem.findMany({
        where: { userId: session.user.id },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              year: true,
              genre: true,
              director: true,
              plot: true,
              poster: true,
              imdbRating: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.moodEntry.findMany({
        where: { userId: session.user.id },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              year: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.movieDiscovery.findMany({
        where: { userId: session.user.id },
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              year: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    ]);

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    const exportData = {
      user: {
        name: user?.name,
        email: user?.email,
        memberSince: user?.createdAt,
        exportDate: new Date().toISOString()
      },
      watchlist: watchlistItems.map(item => ({
        movie: {
          title: item.movie.title,
          year: item.movie.year,
          genre: item.movie.genre,
          director: item.movie.director,
          plot: item.movie.plot,
          imdbRating: item.movie.imdbRating
        },
        status: item.status,
        rating: item.rating,
        notes: item.notes,
        addedAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      moodEntries: moodEntries.map(entry => ({
        movie: {
          title: entry.movie.title,
          year: entry.movie.year
        },
        mood: entry.mood,
        intensity: entry.intensity,
        notes: entry.notes,
        createdAt: entry.createdAt
      })),
      discoveries: movieDiscoveries.map(discovery => ({
        movie: {
          title: discovery.movie.title,
          year: discovery.movie.year
        },
        discoveredAt: discovery.createdAt
      })),
      summary: {
        totalMovies: watchlistItems.length,
        totalMoods: moodEntries.length,
        totalDiscoveries: movieDiscoveries.length,
        watchedMovies: watchlistItems.filter(item => item.status === 'watched').length,
        averageRating: watchlistItems
          .filter(item => item.rating !== null)
          .reduce((sum, item) => sum + (item.rating || 0), 0) / 
          watchlistItems.filter(item => item.rating !== null).length || 0
      }
    };

    // Return as downloadable JSON
    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="vibevault-data-${new Date().toISOString().split('T')[0]}.json"`
      }
    });
  } catch (error) {
    console.error('Error exporting user data:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
