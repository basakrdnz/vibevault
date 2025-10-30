import { NextRequest, NextResponse } from 'next/server';
import { CacheService } from '@/lib/cache-service';

export async function GET(request: NextRequest) {
  try {
    console.log('📊 Getting cache info...');

    const cacheInfo = await CacheService.getCacheInfo();
    
    // Calculate cache age
    const now = new Date();
    const featuredAge = cacheInfo.featured 
      ? Math.floor((now.getTime() - cacheInfo.featured.getTime()) / (1000 * 60 * 60)) // hours
      : null;
    
    const popularAge = cacheInfo.popular 
      ? Math.floor((now.getTime() - cacheInfo.popular.getTime()) / (1000 * 60 * 60)) // hours
      : null;

    return NextResponse.json({
      success: true,
      cache: {
        featured: {
          lastUpdated: cacheInfo.featured,
          ageHours: featuredAge,
          isValid: featuredAge !== null && featuredAge < 24
        },
        popular: {
          lastUpdated: cacheInfo.popular,
          ageHours: popularAge,
          isValid: popularAge !== null && popularAge < 24
        }
      }
    });
  } catch (error) {
    console.error('❌ Error getting cache info:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get cache info' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    console.log('🗑️ Clearing all cache...');

    await CacheService.clearAllCache();

    return NextResponse.json({
      success: true,
      message: 'All cache cleared successfully'
    });
  } catch (error) {
    console.error('❌ Error clearing cache:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to clear cache' },
      { status: 500 }
    );
  }
}
