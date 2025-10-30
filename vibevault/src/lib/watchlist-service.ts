import { prisma } from '@/lib/db';

export interface WatchlistItemData {
  userId: string;
  movieId: string;
  status?: 'want_to_watch' | 'watching' | 'watched';
  rating?: number;
  notes?: string;
}

export interface WatchlistItemResult {
  id: string;
  userId: string;
  movieId: string;
  status: string;
  rating?: number | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  movie: {
    id: string;
    title: string;
    year: string;
    genre?: string | null;
    director?: string | null;
    plot?: string | null;
    poster?: string | null;
    imdbRating?: string | null;
    runtime?: string | null;
    language?: string | null;
    country?: string | null;
  };
}

export class WatchlistService {
  // Add movie to watchlist
  static async addToWatchlist(data: WatchlistItemData) {
    // Check if already in watchlist
    const existing = await prisma.watchlistItem.findFirst({
      where: {
        userId: data.userId,
        movieId: data.movieId
      }
    });

    if (existing) {
      throw new Error('Movie already in watchlist');
    }

    return await prisma.watchlistItem.create({
      data: {
        userId: data.userId,
        movieId: data.movieId,
        status: data.status || 'want_to_watch',
        rating: data.rating,
        notes: data.notes
      },
      include: {
        movie: true
      }
    });
  }

  // Get user's watchlist
  static async getUserWatchlist(userId: string, status?: string): Promise<WatchlistItemResult[]> {
    const where: any = { userId };
    
    if (status) {
      where.status = status;
    }

    const items = await prisma.watchlistItem.findMany({
      where,
      include: {
        movie: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return items;
  }

  // Update watchlist item
  static async updateWatchlistItem(id: string, data: Partial<WatchlistItemData>) {
    return await prisma.watchlistItem.update({
      where: { id },
      data: {
        status: data.status,
        rating: data.rating,
        notes: data.notes
      },
      include: {
        movie: true
      }
    });
  }

  // Remove from watchlist
  static async removeFromWatchlist(id: string) {
    return await prisma.watchlistItem.delete({
      where: { id }
    });
  }

  // Check if movie is in user's watchlist
  static async isInWatchlist(userId: string, movieId: string): Promise<boolean> {
    const item = await prisma.watchlistItem.findFirst({
      where: {
        userId,
        movieId
      }
    });
    return !!item;
  }

  // Get specific watchlist item
  static async getWatchlistItem(userId: string, movieId: string) {
    return await prisma.watchlistItem.findFirst({
      where: {
        userId,
        movieId
      },
      include: {
        movie: true
      }
    });
  }

  // Get watchlist statistics
  static async getWatchlistStats(userId: string) {
    const stats = await prisma.watchlistItem.groupBy({
      by: ['status'],
      where: { userId },
      _count: {
        status: true
      }
    });

    const total = await prisma.watchlistItem.count({
      where: { userId }
    });

    return {
      total,
      want_to_watch: stats.find((s: any) => s.status === 'want_to_watch')?._count.status || 0,
      watching: stats.find((s: any) => s.status === 'watching')?._count.status || 0,
      watched: stats.find((s: any) => s.status === 'watched')?._count.status || 0
    };
  }
}
