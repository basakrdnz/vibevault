import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { respondToFriendRequest } from '@/lib/social-service';
import { allow } from '@/lib/rate-limit';

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  if (!allow(`social:resp:${session.user.id}`, 20, 60_000)) {
    return NextResponse.json({ error: 'RateLimited' }, { status: 429 });
  }
  const body = await req.json().catch(() => ({}));
  const requestId = String(body?.requestId || '').trim();
  const action = String(body?.action || '').trim();
  if (!requestId || !['accept', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'InvalidPayload' }, { status: 400 });
  }
  try {
    const result = await respondToFriendRequest(session.user.id, requestId, action as 'accept' | 'decline');
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    const msg = (e as Error).message;
    const status = msg === 'RequestNotFound' ? 404 : msg === 'RequestAlreadyHandled' ? 409 : 500;
    return NextResponse.json({ error: msg }, { status });
  }
}


