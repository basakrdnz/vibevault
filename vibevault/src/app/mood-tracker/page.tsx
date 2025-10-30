'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, Calendar, TrendingUp, BarChart3, PieChart, Activity } from 'lucide-react';
import { MoodDistributionChart, MoodPieChart, IntensityTrendChart } from '@/components/mood-charts';

interface MoodEntry {
  id: string;
  mood: string;
  intensity: number;
  notes?: string;
  createdAt: Date;
  movie: {
    id: string;
    title: string;
    year: string;
    poster?: string;
  };
}

interface MoodStats {
  totalEntries: number;
  mostFrequentMood: string | null;
  averageIntensity: number;
}

export default function MoodTrackerPage() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [moodStats, setMoodStats] = useState<MoodStats | null>(null);
  const [moodDistribution, setMoodDistribution] = useState<{
    labels: string[];
    data: number[];
    colors: string[];
  } | null>(null);
  const [intensityTrends, setIntensityTrends] = useState<{
    labels: string[];
    data: number[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMoodData();
  }, []);

  const fetchMoodData = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching mood data...');
      
      // Fetch user's mood entries
      const entriesResponse = await fetch('/api/mood-analytics/user-entries');
      console.log('📊 Entries response:', entriesResponse.status);
      
      if (entriesResponse.ok) {
        const entriesData = await entriesResponse.json();
        console.log('📊 Entries data:', entriesData);
        setMoodEntries(entriesData.entries || []);
      } else {
        console.error('❌ Failed to fetch entries:', entriesResponse.status);
      }

      // Fetch user's mood stats
      const statsResponse = await fetch('/api/mood-analytics/user-stats');
      console.log('📈 Stats response:', statsResponse.status);
      
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        console.log('📈 Stats data:', statsData);
        setMoodStats(statsData.stats);
        setMoodDistribution(statsData.distribution);
        setIntensityTrends(statsData.trends);
      } else {
        console.error('❌ Failed to fetch stats:', statsResponse.status);
      }
    } catch (err) {
      console.error('❌ Error fetching mood data:', err);
      setError('Failed to fetch mood data');
    } finally {
      setLoading(false);
    }
  };

  const getMoodColor = (mood: string) => {
    const colors: { [key: string]: string } = {
      'Happy': 'bg-yellow-100 text-yellow-800',
      'Sad': 'bg-blue-100 text-blue-800',
      'Excited': 'bg-red-100 text-red-800',
      'Scared': 'bg-purple-100 text-purple-800',
      'Romantic': 'bg-pink-100 text-pink-800',
      'Nostalgic': 'bg-orange-100 text-orange-800',
      'Inspired': 'bg-green-100 text-green-800',
      'Angry': 'bg-red-100 text-red-800',
      'Peaceful': 'bg-teal-100 text-teal-800',
      'Curious': 'bg-indigo-100 text-indigo-800',
      'Amused': 'bg-yellow-100 text-yellow-800',
      'Melancholic': 'bg-gray-100 text-gray-800',
      'Hopeful': 'bg-emerald-100 text-emerald-800',
      'Anxious': 'bg-amber-100 text-amber-800',
      'Grateful': 'bg-rose-100 text-rose-800'
    };
    return colors[mood] || 'bg-gray-100 text-gray-800';
  };

  const getIntensityColor = (intensity: number) => {
    if (intensity >= 8) return 'text-red-500';
    if (intensity >= 6) return 'text-orange-500';
    if (intensity >= 4) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
            <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md flex items-center gap-2">
              <Heart className="h-6 w-6 text-pink-500" />
              Mood Tracker
            </h1>
            <div className="flex justify-center items-center h-32">
              <div className="text-white">Loading mood data...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-500" />
            Mood Tracker
          </h1>
          <p className="text-gray-300">
            Track your emotional journey through movies and discover patterns in your viewing experiences.
          </p>
        </div>
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-300">{error}</p>
          <button 
            onClick={fetchMoodData}
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md flex items-center gap-2">
          <Heart className="h-6 w-6 text-pink-500" />
          Mood Tracker
        </h1>
        <p className="text-gray-300">
          Track your emotional journey through movies and discover patterns in your viewing experiences.
        </p>
      </div>

        {/* Stats Overview */}
        {moodStats && (
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-blue-400" />
                  Total Entries
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{moodStats.totalEntries}</div>
                <p className="text-xs text-gray-400">Mood recordings</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-400" />
                  Most Frequent Mood
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-white">
                  {moodStats.mostFrequentMood || 'N/A'}
                </div>
                <p className="text-xs text-gray-400">Your go-to emotion</p>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <Star className="h-4 w-4 text-yellow-400" />
                  Average Intensity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{moodStats.averageIntensity}/10</div>
                <p className="text-xs text-gray-400">Emotional depth</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts Section */}
        {moodStats && moodStats.totalEntries > 0 && (
          <div className="space-y-6">
            <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
              <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md flex items-center gap-2">
                <BarChart3 className="h-6 w-6 text-blue-400" />
                Your Mood Analytics
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Mood Distribution Bar Chart */}
                {moodDistribution && moodDistribution.labels.length > 0 && (
                  <MoodDistributionChart
                    labels={moodDistribution.labels}
                    data={moodDistribution.data}
                    colors={moodDistribution.colors}
                  />
                )}
                
                {/* Mood Pie Chart */}
                {moodDistribution && moodDistribution.labels.length > 0 && (
                  <MoodPieChart
                    labels={moodDistribution.labels}
                    data={moodDistribution.data}
                    colors={moodDistribution.colors}
                  />
                )}
              </div>
              
              {/* Intensity Trends */}
              {intensityTrends && intensityTrends.labels.length > 0 && (
                <div className="mt-6">
                  <IntensityTrendChart
                    labels={intensityTrends.labels}
                    data={intensityTrends.data}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mood Entries */}
        <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Calendar className="h-5 w-5 text-pink-500" />
              Recent Mood Entries
            </CardTitle>
            <CardDescription className="text-gray-300">
              Your emotional responses to movies you've watched
            </CardDescription>
          </CardHeader>
          <CardContent>
            {moodEntries.length === 0 ? (
              <div className="text-center py-8">
                <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-300">No mood entries yet</p>
                <p className="text-sm text-gray-400 mt-2">
                  Start watching movies and recording your emotions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {moodEntries.map((entry) => (
                  <div key={entry.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                    <div className="flex items-start gap-4">
                      {entry.movie.poster ? (
                        <img
                          src={entry.movie.poster}
                          alt={entry.movie.title}
                          className="w-12 h-16 object-cover rounded"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-12 h-16 bg-gray-200 rounded flex items-center justify-center">
                          <Star className="h-6 w-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-white truncate">
                            {entry.movie.title}
                          </h3>
                          <span className="text-sm text-gray-400">({entry.movie.year})</span>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getMoodColor(entry.mood)}>
                            {entry.mood}
                          </Badge>
                          <span className={`text-sm font-semibold ${getIntensityColor(entry.intensity)}`}>
                            {entry.intensity}/10
                          </span>
                        </div>
                        
                        {entry.notes && (
                          <p className="text-sm text-gray-300 italic">
                            "{entry.notes}"
                          </p>
                        )}
                        
                        <p className="text-xs text-gray-400 mt-2">
                          {new Date(entry.createdAt).toLocaleDateString()} at{' '}
                          {new Date(entry.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
    </div>
  );
}
