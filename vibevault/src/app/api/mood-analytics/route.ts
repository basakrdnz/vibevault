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

    const { searchParams } = new URL(request.url);
    const movieId = searchParams.get('movieId');

    if (!movieId) {
      return NextResponse.json(
        { success: false, error: 'Movie ID is required' },
        { status: 400 }
      );
    }

    console.log(`📊 Getting mood analytics for movie ${movieId}`);

    const analytics = await MoodAnalyticsService.getMovieMoodAnalytics(movieId);
    
    if (!analytics) {
      return NextResponse.json(
        { success: false, error: 'Failed to get mood analytics' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      analytics
    });
  } catch (error) {
    console.error('❌ Error getting mood analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { movieId, mood, intensity, notes } = await request.json();

    if (!movieId || !mood || !intensity) {
      return NextResponse.json(
        { success: false, error: 'Movie ID, mood, and intensity are required' },
        { status: 400 }
      );
    }

    console.log(`💭 Adding mood entry: ${mood} (${intensity}/10) for movie ${movieId}`);

    const success = await MoodAnalyticsService.addMoodEntry(
      session.user.id,
      movieId,
      mood,
      intensity,
      notes
    );

    if (success) {
      return NextResponse.json({
        success: true,
        message: 'Mood entry added successfully'
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to add mood entry' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('❌ Error adding mood entry:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
