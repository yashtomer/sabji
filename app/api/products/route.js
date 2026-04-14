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

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { name, hindi, unit, price, image } = await request.json();
    if (!name || !price) {
      return NextResponse.json({ error: 'Name and price required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const { data, error } = await supabase.from('products').insert({
      name, hindi: hindi || '', unit: unit || '', price, available: true,
      image: image || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
