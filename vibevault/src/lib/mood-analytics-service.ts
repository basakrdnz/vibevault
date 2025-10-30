import { prisma } from './db';

export interface MoodAnalytics {
  movieId: string;
  totalEntries: number;
  topEmotions: {
    emotion: string;
    count: number;
    percentage: number;
  }[];
}

export class MoodAnalyticsService {
  // Get mood analytics for a specific movie
  static async getMovieMoodAnalytics(movieId: string): Promise<MoodAnalytics | null> {
    try {
      // Get all mood entries for this movie
      const moodEntries = await prisma.moodEntry.findMany({
        where: { movieId },
        select: { mood: true }
      });

      if (moodEntries.length === 0) {
        return {
          movieId,
          totalEntries: 0,
          topEmotions: []
        };
      }

      // Count emotions
      const emotionCounts: { [key: string]: number } = {};
      moodEntries.forEach(entry => {
        emotionCounts[entry.mood] = (emotionCounts[entry.mood] || 0) + 1;
      });

      // Calculate percentages and sort
      const totalEntries = moodEntries.length;
      const emotionsWithPercentages = Object.entries(emotionCounts)
        .map(([emotion, count]) => ({
          emotion,
          count,
          percentage: Math.round((count / totalEntries) * 100)
        }))
        .sort((a, b) => b.percentage - a.percentage);

      // Get top 2 emotions
      const topEmotions = emotionsWithPercentages.slice(0, 2);

      console.log(`📊 Mood analytics for movie ${movieId}:`, {
        totalEntries,
        topEmotions
      });

      return {
        movieId,
        totalEntries,
        topEmotions
      };
    } catch (error) {
      console.error('❌ Error getting mood analytics:', error);
      return null;
    }
  }

  // Add a mood entry for a movie
  static async addMoodEntry(
    userId: string, 
    movieId: string, 
    mood: string, 
    intensity: number,
    notes?: string
  ): Promise<boolean> {
    try {
      await prisma.moodEntry.create({
        data: {
          userId,
          movieId,
          mood,
          intensity,
          notes
        }
      });

      console.log(`💭 Mood entry added: ${mood} (${intensity}/10) for movie ${movieId}`);
      return true;
    } catch (error) {
      console.error('❌ Error adding mood entry:', error);
      return false;
    }
  }

  // Get user's mood entries for a movie
  static async getUserMoodEntries(userId: string, movieId?: string) {
    try {
      const where: any = { userId };
      if (movieId) {
        where.movieId = movieId;
      }

      const entries = await prisma.moodEntry.findMany({
        where,
        include: {
          movie: {
            select: {
              id: true,
              title: true,
              year: true,
              poster: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });

      return entries;
    } catch (error) {
      console.error('❌ Error getting user mood entries:', error);
      return [];
    }
  }

  // Get all available emotions
  static getAvailableEmotions(): string[] {
    return [
      'Happy',
      'Sad',
      'Excited',
      'Scared',
      'Romantic',
      'Nostalgic',
      'Inspired',
      'Angry',
      'Peaceful',
      'Curious',
      'Amused',
      'Melancholic',
      'Hopeful',
      'Anxious',
      'Grateful'
    ];
  }

  // Get mood statistics for dashboard
  static async getUserMoodStats(userId: string): Promise<{
    totalEntries: number;
    mostFrequentMood: string | null;
    averageIntensity: number;
  }> {
    try {
      const entries = await prisma.moodEntry.findMany({
        where: { userId }
      });

      if (entries.length === 0) {
        return {
          totalEntries: 0,
          mostFrequentMood: null,
          averageIntensity: 0
        };
      }

      // Count moods
      const moodCounts: { [key: string]: number } = {};
      let totalIntensity = 0;

      entries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
        totalIntensity += entry.intensity;
      });

      // Find most frequent mood
      const mostFrequentMood = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)[0]?.[0] || null;

      const averageIntensity = Math.round(totalIntensity / entries.length);

      return {
        totalEntries: entries.length,
        mostFrequentMood,
        averageIntensity
      };
    } catch (error) {
      console.error('❌ Error getting user mood stats:', error);
      return {
        totalEntries: 0,
        mostFrequentMood: null,
        averageIntensity: 0
      };
    }
  }

  // Get mood distribution data for charts
  static async getUserMoodDistribution(userId: string): Promise<{
    labels: string[];
    data: number[];
    colors: string[];
  }> {
    try {
      const entries = await prisma.moodEntry.findMany({
        where: { userId }
      });

      if (entries.length === 0) {
        return {
          labels: [],
          data: [],
          colors: []
        };
      }

      // Count moods
      const moodCounts: { [key: string]: number } = {};
      entries.forEach(entry => {
        moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
      });

      // Sort by count and get top 8
      const sortedMoods = Object.entries(moodCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 8);

      const labels = sortedMoods.map(([mood]) => mood);
      const data = sortedMoods.map(([, count]) => count);

      // Define colors for moods
      const moodColors: { [key: string]: string } = {
        'Happy': '#FDE047',      // Yellow
        'Sad': '#60A5FA',        // Blue
        'Excited': '#F87171',    // Red
        'Scared': '#A78BFA',     // Purple
        'Romantic': '#FB7185',   // Pink
        'Nostalgic': '#FB923C',  // Orange
        'Inspired': '#4ADE80',   // Green
        'Angry': '#EF4444',      // Red
        'Peaceful': '#14B8A6',   // Teal
        'Curious': '#6366F1',    // Indigo
        'Amused': '#FACC15',     // Yellow
        'Melancholic': '#6B7280', // Gray
        'Hopeful': '#10B981',    // Emerald
        'Anxious': '#F59E0B',    // Amber
        'Grateful': '#F43F5E'    // Rose
      };

      const colors = labels.map(mood => moodColors[mood] || '#6B7280');

      return {
        labels,
        data,
        colors
      };
    } catch (error) {
      console.error('❌ Error getting mood distribution:', error);
      return {
        labels: [],
        data: [],
        colors: []
      };
    }
  }

  // Get intensity trends over time
  static async getUserIntensityTrends(userId: string): Promise<{
    labels: string[];
    data: number[];
  }> {
    try {
      const entries = await prisma.moodEntry.findMany({
        where: { userId },
        orderBy: { createdAt: 'asc' }
      });

      if (entries.length === 0) {
        return {
          labels: [],
          data: []
        };
      }

      // Group by week
      const weeklyData: { [key: string]: number[] } = {};
      
      entries.forEach(entry => {
        const date = new Date(entry.createdAt);
        const weekKey = `${date.getFullYear()}-W${Math.ceil(date.getDate() / 7)}`;
        
        if (!weeklyData[weekKey]) {
          weeklyData[weekKey] = [];
        }
        weeklyData[weekKey].push(entry.intensity);
      });

      // Calculate average intensity per week
      const labels = Object.keys(weeklyData).sort();
      const data = labels.map(week => {
        const intensities = weeklyData[week];
        return Math.round(intensities.reduce((sum, intensity) => sum + intensity, 0) / intensities.length);
      });

      return {
        labels,
        data
      };
    } catch (error) {
      console.error('❌ Error getting intensity trends:', error);
      return {
        labels: [],
        data: []
      };
    }
  }
}
