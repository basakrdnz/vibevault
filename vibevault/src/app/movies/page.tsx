import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { MovieSearch } from '@/components/movie-search';
import { MovieSlider } from '@/components/movie-slider';
import { MovieGrid } from '@/components/movie-grid';
import { Navbar } from '@/components/navbar';

export default async function MoviesPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={session.user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Discover Movies</h1>
        </div>
        
        {/* Today's Spotlight Slider */}
        <div className="mb-8">
          <MovieSlider />
        </div>

        {/* All Movies Grid with Search */}
        <div className="mb-8">
          <MovieGrid title="🎬 All Movies" limit={20} />
        </div>
      </div>
    </div>
  );
}
