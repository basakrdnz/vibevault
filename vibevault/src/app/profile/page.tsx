'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Calendar, 
  Settings, 
  LogOut, 
  Edit3, 
  Save, 
  X,
  Heart,
  Star,
  Film,
  BarChart3
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  stats: {
    totalMovies: number;
    totalMoods: number;
    averageRating: number;
    favoriteGenre: string;
  };
}

export default function UserProfilePage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/profile');
      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.profile);
        setEditedName(data.profile.name);
      } else {
        setError(data.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editedName })
      });

      const data = await response.json();

      if (data.success) {
        setUserProfile(prev => prev ? { ...prev, name: editedName } : null);
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
    }
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/login');
    router.refresh();
  };

  const handleExportData = async () => {
    try {
      const response = await fetch('/api/user/export');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vibevault-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        setError('Failed to export data');
      }
    } catch (err) {
      console.error('Error exporting data:', err);
      setError('Failed to export data');
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone and will permanently delete all your data.')) {
      return;
    }

    if (!confirm('This will delete ALL your data including watchlist, mood entries, and movie discoveries. Are you absolutely sure?')) {
      return;
    }

    try {
      const response = await fetch('/api/user/delete', {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        await signOut({ redirect: false });
        router.push('/');
        router.refresh();
      } else {
        setError(data.error || 'Failed to delete account');
      }
    } catch (err) {
      console.error('Error deleting account:', err);
      setError('Failed to delete account');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md flex items-center gap-2">
            <User className="h-6 w-6 text-blue-500" />
            Profile
          </h1>
          <div className="flex justify-center items-center h-32">
            <div className="text-white">Loading profile...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
          <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md flex items-center gap-2">
            <User className="h-6 w-6 text-blue-500" />
            Profile
          </h1>
          <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
            <p className="text-red-300">{error}</p>
            <button 
              onClick={fetchUserProfile}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
        <h1 className="text-2xl font-bold mb-6 text-white drop-shadow-md flex items-center gap-2">
          <User className="h-6 w-6 text-blue-500" />
          Profile
        </h1>
        <p className="text-gray-300">
          Manage your account settings and view your VibeVault statistics.
        </p>
      </div>

      {/* Profile Information */}
      <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <User className="h-5 w-5 text-blue-500" />
            Personal Information
          </CardTitle>
          <CardDescription className="text-gray-300">
            Your account details and preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-white mb-2">
                Display Name
              </label>
              {isEditing ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    className="flex-1 p-3 border border-gray-300 rounded-md bg-white text-gray-900"
                    placeholder="Enter your name"
                  />
                  <Button
                    onClick={handleSaveProfile}
                    className="bg-green-500 hover:bg-green-600"
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => {
                      setIsEditing(false);
                      setEditedName(userProfile?.name || '');
                    }}
                    variant="outline"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-white text-lg">{userProfile?.name}</span>
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <Edit3 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-2 text-gray-300">
              <Mail className="h-4 w-4" />
              <span>{userProfile?.email}</span>
            </div>
          </div>

          {/* Member Since */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Member Since
            </label>
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="h-4 w-4" />
              <span>{new Date(userProfile?.createdAt || '').toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-500" />
                Your Statistics
              </CardTitle>
              <CardDescription className="text-gray-300">
                Your VibeVault activity and preferences
              </CardDescription>
            </div>
            <Button
              onClick={fetchUserProfile}
              variant="outline"
              size="sm"
              className="text-green-400 border-green-400 hover:bg-green-400 hover:text-white"
            >
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Film className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white font-medium">Movies Tracked</span>
              </div>
              <div className="text-2xl font-bold text-white">{userProfile?.stats.totalMovies || 0}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-4 w-4 text-pink-400" />
                <span className="text-sm text-white font-medium">Mood Entries</span>
              </div>
              <div className="text-2xl font-bold text-white">{userProfile?.stats.totalMoods || 0}</div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-white font-medium">Avg Rating</span>
              </div>
              <div className="text-2xl font-bold text-white">
                {userProfile?.stats.averageRating ? `${userProfile.stats.averageRating.toFixed(1)}/5` : 'N/A'}
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Film className="h-4 w-4 text-purple-400" />
                <span className="text-sm text-white font-medium">Favorite Genre</span>
              </div>
              <div className="text-lg font-bold text-white">
                {userProfile?.stats.favoriteGenre || 'N/A'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Actions */}
      <Card className="bg-white/15 backdrop-blur-md border-white/30 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Settings className="h-5 w-5 text-orange-500" />
            Account Actions
          </CardTitle>
          <CardDescription className="text-gray-300">
            Manage your account and privacy settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Export Data</h3>
                <p className="text-gray-400 text-sm">Download your watchlist and mood data</p>
              </div>
              <Button 
                onClick={handleExportData}
                variant="outline" 
                className="text-blue-400 border-blue-400 hover:bg-blue-400 hover:text-white"
              >
                Export
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Delete Account</h3>
                <p className="text-gray-400 text-sm">Permanently delete your account and all data</p>
              </div>
              <Button 
                onClick={handleDeleteAccount}
                variant="outline" 
                className="text-red-400 border-red-400 hover:bg-red-400 hover:text-white"
              >
                Delete
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
              <div>
                <h3 className="text-white font-medium">Sign Out</h3>
                <p className="text-gray-400 text-sm">Sign out of your account</p>
              </div>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="text-gray-400 border-gray-400 hover:bg-gray-400 hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
