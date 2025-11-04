import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/navbar';
import SendFriendRequest from '@/components/social/send-friend-request';
import { listFriends } from '@/lib/social-service';

export default async function FriendsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const friends = await listFriends(session.user.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <Navbar user={session.user} />
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg">Friends</h1>
          <a href="/social/requests" className="text-sm text-white/80 hover:text-white">Requests</a>
        </div>
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white drop-shadow-md">Add a friend</h2>
          <SendFriendRequest />
        </div>
        <div className="bg-white/15 backdrop-blur-md border-white/30 rounded-lg shadow-2xl p-6">
          <h2 className="text-xl font-semibold mb-4 text-white drop-shadow-md">Your friends</h2>
          <div className="grid gap-3">
            {friends.length === 0 && <div className="text-white/80">No friends yet</div>}
            {friends.map(f => (
              <div key={f.id} className="bg-white/10 rounded p-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-white">{f.name ?? f.email}</div>
                  <div className="text-sm text-white/70">{f.email}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


