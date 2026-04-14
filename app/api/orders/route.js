import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';
import QRCode from 'qrcode';

const UPI_ID = process.env.UPI_ID || 'BHARATPE.9MOLOJOG6Y902434@unitype';
const MERCHANT = process.env.UPI_MERCHANT_NAME || 'Sanjay Fruits';

export async function POST(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const { items, address, phone, delivery_slot, discount } = await request.json();
    if (!items?.length) return NextResponse.json({ error: 'No items' }, { status: 400 });

    let total = items.reduce((sum, i) => sum + i.price * i.quantity, 0) - (discount || 0);
    const orderId = `SBJ-${Math.floor(10000 + Math.random() * 90000)}`;

    const supabase = createServerClient();
    const { data: order, error } = await supabase.from('orders').insert({
      order_id: orderId, user_id: user.id, total, discount: discount || 0,
      address: address || '', phone: phone || '', delivery_slot: delivery_slot || '',
    }).select().single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    for (const item of items) {
      await supabase.from('order_items').insert({
        order_id: order.id, product_id: item.id, quantity: item.quantity, price: item.price,
      });
    }

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT)}&am=${total.toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;
    const qrCode = await QRCode.toDataURL(upiUrl, { width: 280, margin: 2 });

    return NextResponse.json({
      order: { id: order.id, order_id: orderId, total, discount: discount || 0, delivery_status: 'Pending', payment_status: 'Unpaid' },
      upi: { qrCode, upiUrl, amount: total.toFixed(2), upiId: UPI_ID },
    });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });

    const supabase = createServerClient();

    let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (user.role !== 'admin') query = query.eq('user_id', user.id);

    const { data: orders } = await query;

    for (const order of orders || []) {
      if (user.role === 'admin') {
        const { data: u } = await supabase.from('users').select('name').eq('id', order.user_id).single();
        order.customer_name = u?.name || 'Customer';
      }
      const { data: items } = await supabase
        .from('order_items')
        .select('*, products(name, image)')
        .eq('order_id', order.id);
      order.items = items?.map(i => ({ ...i, name: i.products?.name, image: i.products?.image })) || [];
    }

    return NextResponse.json(orders || []);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
