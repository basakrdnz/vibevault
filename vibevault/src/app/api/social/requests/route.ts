import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { listFriendRequests } from '@/lib/social-service';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const data = await listFriendRequests(session.user.id);
  return NextResponse.json(data);
}


