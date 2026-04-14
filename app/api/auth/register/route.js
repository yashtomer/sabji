import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServerClient } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password, name, phone } = await request.json();
    if (!username || !password || !name) {
      return NextResponse.json({ error: 'Username, password, and name required' }, { status: 400 });
    }

    const supabase = createServerClient();
    const hashed = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from('users')
      .insert({ username: username.toLowerCase(), password: hashed, name, role: 'customer', phone: phone || '' })
      .select('id, username, name, role, phone')
      .single();

    if (error) {
      if (error.code === '23505') return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const token = signToken({ id: data.id, username: data.username, name: data.name, role: data.role });
    return NextResponse.json({ token, user: data });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
