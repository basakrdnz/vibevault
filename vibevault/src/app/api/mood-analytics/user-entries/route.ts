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

    console.log(`📊 Getting user mood entries for user ${session.user.id}`);

    const entries = await MoodAnalyticsService.getUserMoodEntries(session.user.id);
    
    return NextResponse.json({
      success: true,
      entries
    });
  } catch (error) {
    console.error('❌ Error getting user mood entries:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
