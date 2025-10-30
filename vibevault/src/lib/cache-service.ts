import { prisma } from './db';

export class CacheService {
  // Check if cache is valid (less than 24 hours old)
  static isCacheValid(updatedAt: Date): boolean {
    const now = new Date();
    const cacheAge = now.getTime() - updatedAt.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    return cacheAge < twentyFourHours;
  }

  // Get cached featured movies
  static async getFeaturedMoviesCache(): Promise<string[] | null> {
    try {
      const cache = await prisma.featuredMoviesCache.findUnique({
        where: { type: 'featured' }
      });

      if (!cache) {
        console.log('📦 No featured movies cache found');
        return null;
      }

      if (!this.isCacheValid(cache.updatedAt)) {
        console.log('⏰ Featured movies cache expired');
        return null;
      }

      console.log('✅ Using cached featured movies');
      return JSON.parse(cache.movieIds);
    } catch (error) {
      console.error('❌ Error getting featured movies cache:', error);
      return null;
    }
  }

  // Set cached featured movies
  static async setFeaturedMoviesCache(movieIds: string[]): Promise<void> {
    try {
      await prisma.featuredMoviesCache.upsert({
        where: { type: 'featured' },
        update: {
          movieIds: JSON.stringify(movieIds),
          updatedAt: new Date()
        },
        create: {
          type: 'featured',
          movieIds: JSON.stringify(movieIds)
        }
      });

      console.log(`💾 Cached ${movieIds.length} featured movies`);
    } catch (error) {
      console.error('❌ Error setting featured movies cache:', error);
    }
  }

  // Get cached popular movies
  static async getPopularMoviesCache(): Promise<string[] | null> {
    try {
      const cache = await prisma.featuredMoviesCache.findUnique({
        where: { type: 'popular' }
      });

      if (!cache) {
        console.log('📦 No spotlight movies cache found');
        return null;
      }

      if (!this.isCacheValid(cache.updatedAt)) {
        console.log('⏰ Spotlight movies cache expired');
        return null;
      }

      console.log('✅ Using cached spotlight movies');
      return JSON.parse(cache.movieIds);
    } catch (error) {
      console.error('❌ Error getting popular movies cache:', error);
      return null;
    }
  }

  // Set cached popular movies
  static async setPopularMoviesCache(movieIds: string[]): Promise<void> {
    try {
      await prisma.featuredMoviesCache.upsert({
        where: { type: 'popular' },
        update: {
          movieIds: JSON.stringify(movieIds),
          updatedAt: new Date()
        },
        create: {
          type: 'popular',
          movieIds: JSON.stringify(movieIds)
        }
      });

      console.log(`💾 Cached ${movieIds.length} spotlight movies`);
    } catch (error) {
      console.error('❌ Error setting popular movies cache:', error);
    }
  }

  // Clear all cache
  static async clearAllCache(): Promise<void> {
    try {
      await prisma.featuredMoviesCache.deleteMany();
      console.log('🗑️ Cleared all movie cache');
    } catch (error) {
      console.error('❌ Error clearing cache:', error);
    }
  }

  // Get cache info
  static async getCacheInfo(): Promise<{ featured: Date | null, popular: Date | null }> {
    try {
      const featuredCache = await prisma.featuredMoviesCache.findUnique({
        where: { type: 'featured' }
      });

      const popularCache = await prisma.featuredMoviesCache.findUnique({
        where: { type: 'popular' }
      });

      return {
        featured: featuredCache?.updatedAt || null,
        popular: popularCache?.updatedAt || null
      };
    } catch (error) {
      console.error('❌ Error getting cache info:', error);
      return { featured: null, popular: null };
    }
  }
}
