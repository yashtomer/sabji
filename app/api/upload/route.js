import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const file = formData.get('file');
    const productId = formData.get('productId');

    if (!file || !productId) {
      return NextResponse.json({ error: 'File and productId required' }, { status: 400 });
    }

    // Convert File to ArrayBuffer for Supabase
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = createServerClient();

    const ext = file.name?.split('.').pop() || 'jpg';
    const fileName = `product-${productId}-${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, buffer, {
        contentType: file.type || 'image/jpeg',
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: 'Upload failed: ' + uploadError.message }, { status: 500 });
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('products').getPublicUrl(fileName);
    const imageUrl = urlData.publicUrl;

    // Update product image in DB
    const { error: dbError } = await supabase
      .from('products')
      .update({ image: imageUrl })
      .eq('id', productId);

    if (dbError) {
      return NextResponse.json({ error: 'DB update failed: ' + dbError.message }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
