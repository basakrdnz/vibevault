import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Film, Bookmark, Heart } from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { WatchlistService } from '@/lib/watchlist-service';
import { MovieService } from '@/lib/movie-service';
import { MovieDiscoveryService } from '@/lib/movie-discovery-service';

export default async function DashboardPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  // Get real statistics
  const [watchlistStats, totalMovies, discoveryCount] = await Promise.all([
    WatchlistService.getWatchlistStats(session.user.id),
    MovieService.getAllMovies(1).then(movies => movies.length),
    MovieDiscoveryService.getDiscoveryCount(session.user.id)
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={session.user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Dashboard</h1>
        </div>
        
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white drop-shadow-md">
            Welcome, {session.user?.name || session.user?.email}!
          </h2>
          <p className="text-gray-200 drop-shadow-sm">
            You are successfully logged in to VibeVault. This is where your emotional viewing journey begins.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-2">
              🎬 Movies Discovered
            </h3>
            <p className="text-3xl font-bold text-purple-300">{discoveryCount}</p>
            <p className="text-sm text-gray-300">Films you've explored</p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-2">
              📋 Watchlist Items
            </h3>
            <p className="text-3xl font-bold text-blue-300">{watchlistStats.total}</p>
            <p className="text-sm text-gray-300">
              {watchlistStats.want_to_watch} want to watch, {watchlistStats.watching} watching, {watchlistStats.watched} watched
            </p>
          </div>
          
          <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
            <h3 className="text-lg font-semibold text-white drop-shadow-md mb-2">
              💝 Emotional Logs
            </h3>
            <p className="text-3xl font-bold text-pink-300">0</p>
            <p className="text-sm text-gray-300">Coming soon!</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
          <h2 className="text-xl font-semibold mb-6 text-white drop-shadow-md">
            🚀 Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <a 
              href="/movies" 
              className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
            >
              <Film className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">Discover Movies</h3>
                <p className="text-sm opacity-90">Search and explore new content</p>
              </div>
            </a>
            
            <a 
              href="/watchlist" 
              className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-lg transition-colors flex items-center gap-3"
            >
              <Bookmark className="h-6 w-6" />
              <div>
                <h3 className="font-semibold">View Watchlist</h3>
                <p className="text-sm opacity-90">Manage your saved movies</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}