import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { MoodAnalyticsService } from '@/lib/mood-analytics-service';

export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    console.log(`📊 Getting user mood stats for user ${session.user.id}`);

    const stats = await MoodAnalyticsService.getUserMoodStats(session.user.id);
    const distribution = await MoodAnalyticsService.getUserMoodDistribution(session.user.id);
    const trends = await MoodAnalyticsService.getUserIntensityTrends(session.user.id);
    
    return NextResponse.json({
      success: true,
      stats,
      distribution,
      trends
    });
  } catch (error) {
    console.error('❌ Error getting user mood stats:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
