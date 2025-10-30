import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getOrCreateSocialSettings, updateSocialSettings } from '@/lib/social-service';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const settings = await getOrCreateSocialSettings(session.user.id);
  return NextResponse.json(settings);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const allowed = ['isProfilePrivate', 'shareViewingHistory', 'shareEmotionalResponses'] as const;
  const payload: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) payload[key] = !!body[key];
  }
  const updated = await updateSocialSettings(session.user.id, payload as any);
  return NextResponse.json(updated);
}


