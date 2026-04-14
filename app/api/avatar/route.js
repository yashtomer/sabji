import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const formData = await request.formData();
    const file = formData.get('file');
    if (!file) return NextResponse.json({ error: 'File required' }, { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = createServerClient();
    const ext = file.name?.split('.').pop() || 'jpg';
    const fileName = `avatar-${user.id}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, { contentType: file.type || 'image/jpeg', upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);

    const { error: dbError } = await supabase
      .from('users')
      .update({ avatar: urlData.publicUrl })
      .eq('id', user.id);

    if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
