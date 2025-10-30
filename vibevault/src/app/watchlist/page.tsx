import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { WatchlistComponent } from '@/components/watchlist-component';
import { Navbar } from '@/components/navbar';

export default async function WatchlistPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={session.user} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">My Watchlist</h1>
        </div>
        
        <WatchlistComponent />
      </div>
    </div>
  );
}
