import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { sendFriendRequest } from '@/lib/social-service';
import { allow } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!allow(`social:req:${session.user.id}`, 10, 60_000)) {
    return NextResponse.json({ error: 'RateLimited' }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const receiverEmail = String(body?.email || '').trim().toLowerCase();
  if (!receiverEmail) {
    return NextResponse.json({ error: 'EmailRequired' }, { status: 400 });
  }
  try {
    const fr = await sendFriendRequest(session.user.id, receiverEmail);
    return NextResponse.json({ id: fr.id, status: fr.status }, { status: 201 });
  } catch (e) {
    const msg = (e as Error).message;
    const status =
      msg === 'UserNotFound' ? 404 :
      msg === 'CannotFriendSelf' ? 400 :
      msg === 'RequestAlreadyExists' || msg === 'AlreadyFriends' ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}


