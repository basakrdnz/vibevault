import { prisma } from './db';

export class MovieDiscoveryService {
  // Record a movie discovery
  static async recordDiscovery(userId: string, movieId: string): Promise<boolean> {
    try {
      // Check if already discovered
      const existingDiscovery = await prisma.movieDiscovery.findUnique({
        where: {
          userId_movieId: {
            userId,
            movieId
          }
        }
      });

      if (existingDiscovery) {
        console.log('📽️ Movie already discovered by user');
        return false; // Already discovered
      }

      // Record new discovery
      await prisma.movieDiscovery.create({
        data: {
          userId,
          movieId,
          discoveredAt: new Date()
        }
      });

      console.log(`🎬 New movie discovery recorded for user ${userId}, movie ${movieId}`);
      return true; // New discovery
    } catch (error) {
      console.error('❌ Error recording movie discovery:', error);
      return false;
    }
  }

  // Get user's discovery count
  static async getDiscoveryCount(userId: string): Promise<number> {
    try {
      const count = await prisma.movieDiscovery.count({
        where: { userId }
      });

      return count;
    } catch (error) {
      console.error('❌ Error getting discovery count:', error);
      return 0;
    }
  }

  // Get user's discovery history
  static async getDiscoveryHistory(userId: string, limit: number = 20): Promise<any[]> {
    try {
      const discoveries = await prisma.movieDiscovery.findMany({
        where: { userId },
        include: {
          movie: true
        },
        orderBy: { discoveredAt: 'desc' },
        take: limit
      });

      return discoveries;
    } catch (error) {
      console.error('❌ Error getting discovery history:', error);
      return [];
    }
  }

  // Check if user has discovered a specific movie
  static async hasDiscovered(userId: string, movieId: string): Promise<boolean> {
    try {
      const discovery = await prisma.movieDiscovery.findUnique({
        where: {
          userId_movieId: {
            userId,
            movieId
          }
        }
      });

      return !!discovery;
    } catch (error) {
      console.error('❌ Error checking discovery status:', error);
      return false;
    }
  }

  // Get discovery stats for dashboard
  static async getDiscoveryStats(userId: string): Promise<{
    total: number;
    thisWeek: number;
    thisMonth: number;
  }> {
    try {
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [total, thisWeek, thisMonth] = await Promise.all([
        prisma.movieDiscovery.count({
          where: { userId }
        }),
        prisma.movieDiscovery.count({
          where: {
            userId,
            discoveredAt: { gte: weekAgo }
          }
        }),
        prisma.movieDiscovery.count({
          where: {
            userId,
            discoveredAt: { gte: monthAgo }
          }
        })
      ]);

      return { total, thisWeek, thisMonth };
    } catch (error) {
      console.error('❌ Error getting discovery stats:', error);
      return { total: 0, thisWeek: 0, thisMonth: 0 };
    }
  }
}
