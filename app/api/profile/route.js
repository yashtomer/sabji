import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const supabase = createServerClient();
    const { data } = await supabase.from('users').select('id, username, name, role, phone, address, avatar').eq('id', user.id).single();
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { name, phone, address, avatar } = await request.json();
    const updates = {};
    if (name !== undefined) updates.name = name;
    if (phone !== undefined) updates.phone = phone;
    if (address !== undefined) updates.address = address;
    if (avatar !== undefined) updates.avatar = avatar;

    const supabase = createServerClient();
    const { data, error } = await supabase.from('users').update(updates).eq('id', user.id).select('id, username, name, role, phone, address, avatar').single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
