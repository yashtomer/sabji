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

    const supabase = createServerClient();

    // Upload to Supabase Storage
    const ext = file.name.split('.').pop() || 'jpg';
    const fileName = `product-${productId}-${Date.now()}.${ext}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('products')
      .upload(fileName, file, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
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
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ url: imageUrl });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
