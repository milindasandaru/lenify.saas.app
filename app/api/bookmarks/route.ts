import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createSupabaseServerClient } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
  const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const companionId = searchParams.get('companionId');
    if (!companionId) return NextResponse.json({ error: 'Missing companionId' }, { status: 400 });

    const supabase = createSupabaseServerClient();
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('companion_id', companionId)
      .maybeSingle();

    if (error) {
      const msg = String(error.message || '');
      const code = (error as any)?.code ? String((error as any).code) : '';
      // If table not found yet, report false to avoid UX break
      if (code === '42P01' || /relation .*bookmarks.* does not exist/i.test(msg) || /schema cache/i.test(msg)) {
        return NextResponse.json({ bookmarked: false });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ bookmarked: !!data });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
  const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { companionId, action } = body as { companionId?: string; action?: 'add' | 'remove' };
    if (!companionId || !action) return NextResponse.json({ error: 'Missing companionId or action' }, { status: 400 });

    const supabase = createSupabaseServerClient();

    if (action === 'add') {
      const { error } = await supabase
        .from('bookmarks')
        .insert({ user_id: userId, companion_id: companionId });
      // If conflict on unique constraint, ignore as success
      if (error) {
        const msg = String(error.message || '');
        const code = (error as any)?.code ? String((error as any).code) : '';
        if (msg.toLowerCase().includes('duplicate')) {
          return NextResponse.json({ ok: true });
        }
        if (code === '42P01' || /relation .*bookmarks.* does not exist/i.test(msg) || /schema cache/i.test(msg)) {
          return NextResponse.json({ error: 'Bookmarks table not configured' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'remove') {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('user_id', userId)
        .eq('companion_id', companionId);
      if (error) {
        const msg = String(error.message || '');
        const code = (error as any)?.code ? String((error as any).code) : '';
        if (code === '42P01' || /relation .*bookmarks.* does not exist/i.test(msg) || /schema cache/i.test(msg)) {
          return NextResponse.json({ error: 'Bookmarks table not configured' }, { status: 400 });
        }
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Internal error' }, { status: 500 });
  }
}
