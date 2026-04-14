import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { createServerClient } from '@/lib/supabase';
import { signToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Phone number and password required' }, { status: 400 });
    }

    const supabase = createServerClient();
    // Try matching by phone first, then by username
    let { data: users, error } = await supabase
      .from('users')
      .select('*')
      .eq('phone', username)
      .limit(1);

    if (!users?.length) {
      ({ data: users, error } = await supabase
        .from('users')
        .select('*')
        .eq('username', username.toLowerCase())
        .limit(1));
    }

    if (error || !users?.length) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const user = users[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const token = signToken({ id: user.id, username: user.username, name: user.name, role: user.role });

    return NextResponse.json({
      token,
      user: { id: user.id, username: user.username, name: user.name, role: user.role, phone: user.phone || '' },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
