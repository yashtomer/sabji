import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const supabase = createServerClient();
    const url = new URL(request.url);
    const all = url.searchParams.get('all');

    if (all === 'true') {
      const user = getUserFromRequest(request);
      if (!user || user.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
      const { data } = await supabase.from('products').select('*').order('id');
      return NextResponse.json(data);
    }

    const { data } = await supabase.from('products').select('*').eq('available', true).order('id');
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
