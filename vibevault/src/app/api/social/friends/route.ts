import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listFriends } from '@/lib/social-service';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const friends = await listFriends(session.user.id);
  return NextResponse.json({ friends });
}


