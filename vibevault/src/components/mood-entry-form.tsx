'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, X } from 'lucide-react';
import { MoodAnalyticsService } from '@/lib/mood-analytics-service';

interface Movie {
  id: string;
  title: string;
  year: string;
  poster?: string;
}

interface MoodEntryFormProps {
  movie: Movie;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function MoodEntryForm({ movie, isOpen, onClose, onSuccess }: MoodEntryFormProps) {
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [intensity, setIntensity] = useState(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const availableEmotions = MoodAnalyticsService.getAvailableEmotions();

  const handleMoodToggle = (mood: string) => {
    setSelectedMoods(prev => {
      if (prev.includes(mood)) {
        return prev.filter(m => m !== mood);
      } else if (prev.length < 3) {
        return [...prev, mood];
      }
      return prev;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedMoods.length === 0) {
      alert('Please select at least one mood');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit each mood as a separate entry
      const promises = selectedMoods.map(mood => 
        fetch('/api/mood-analytics', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            movieId: movie.id,
            mood,
            intensity,
            notes: notes.trim() || undefined
          })
        })
      );

      const responses = await Promise.all(promises);
      const results = await Promise.all(responses.map(r => r.json()));

      const allSuccess = results.every(r => r.success);

      if (allSuccess) {
        console.log('✅ Mood entries added successfully');
        onSuccess?.();
        onClose();
        // Reset form
        setSelectedMoods([]);
        setIntensity(5);
        setNotes('');
      } else {
        console.error('❌ Failed to add some mood entries');
        alert('Failed to add some mood entries. Please try again.');
      }
    } catch (error) {
      console.error('❌ Error adding mood entries:', error);
      alert('Failed to add mood entries. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <Card className="bg-white/95 backdrop-blur-md border-white/30 shadow-2xl max-w-md w-full">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Heart className="h-5 w-5 text-pink-500" />
              How did you feel?
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {movie.poster ? (
              <img
                src={movie.poster}
                alt={movie.title}
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
            <div>
              <h3 className="font-semibold text-gray-900">{movie.title}</h3>
              <p className="text-sm text-gray-600">({movie.year})</p>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Mood Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                What emotions did you feel? (Select up to 3)
              </label>
              <div className="text-xs text-gray-500 mb-2">
                Selected: {selectedMoods.length}/3
              </div>
              <div className="grid grid-cols-3 gap-2">
                {availableEmotions.map((emotion) => (
                  <button
                    key={emotion}
                    type="button"
                    onClick={() => handleMoodToggle(emotion)}
                    disabled={!selectedMoods.includes(emotion) && selectedMoods.length >= 3}
                    className={`p-2 text-xs rounded-md border transition-colors ${
                      selectedMoods.includes(emotion)
                        ? 'bg-pink-100 border-pink-300 text-pink-800'
                        : selectedMoods.length >= 3
                        ? 'bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {emotion}
                  </button>
                ))}
              </div>
              {selectedMoods.length > 0 && (
                <div className="mt-2">
                  <div className="text-xs text-gray-600 mb-1">Selected moods:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedMoods.map((mood) => (
                      <span
                        key={mood}
                        className="px-2 py-1 bg-pink-100 text-pink-800 text-xs rounded-full"
                      >
                        {mood}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Intensity */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity: {intensity}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={intensity}
                onChange={(e) => setIntensity(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Mild</span>
                <span>Intense</span>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Additional thoughts (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="What made you feel this way? Any memorable scenes?"
                className="w-full p-3 border border-gray-300 rounded-md resize-none h-20 text-sm"
                maxLength={200}
              />
              <p className="text-xs text-gray-500 mt-1">{notes.length}/200</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-pink-500 hover:bg-pink-600"
                disabled={isSubmitting || selectedMoods.length === 0}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Mood'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
