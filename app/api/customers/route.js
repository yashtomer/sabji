import { NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { getUserFromRequest } from '@/lib/auth';

export async function GET(request) {
  try {
    const user = getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const supabase = createServerClient();

    // Get all customers
    const { data: customers } = await supabase
      .from('users')
      .select('id, username, name, phone, role, address, created_at')
      .eq('role', 'customer')
      .order('name');

    // Get all orders with payment info
    const { data: orders } = await supabase
      .from('orders')
      .select('user_id, total, payment_status');

    // Calculate balance per customer
    const result = (customers || []).map(c => {
      const customerOrders = (orders || []).filter(o => o.user_id === c.id);
      const totalOrders = customerOrders.length;
      const totalSpent = customerOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
      const unpaidOrders = customerOrders.filter(o => o.payment_status === 'Unpaid');
      const pendingBalance = unpaidOrders.reduce((sum, o) => sum + parseFloat(o.total), 0);
      const paidAmount = totalSpent - pendingBalance;

      return {
        ...c,
        totalOrders,
        totalSpent,
        paidAmount,
        pendingBalance,
        unpaidCount: unpaidOrders.length,
      };
    });

    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
