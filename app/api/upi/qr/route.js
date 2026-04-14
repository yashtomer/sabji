import { NextResponse } from 'next/server';
import QRCode from 'qrcode';

const UPI_ID = process.env.UPI_ID || 'BHARATPE.9MOLOJOG6Y902434@unitype';
const MERCHANT = process.env.UPI_MERCHANT_NAME || 'Sanjay Fruits';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const amount = url.searchParams.get('amount');
    const orderId = url.searchParams.get('orderId') || '';

    if (!amount) return NextResponse.json({ error: 'Amount required' }, { status: 400 });

    const upiUrl = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(MERCHANT)}&am=${parseFloat(amount).toFixed(2)}&cu=INR&tn=${encodeURIComponent('Order ' + orderId)}`;
    const qrCode = await QRCode.toDataURL(upiUrl, { width: 280, margin: 2 });

    return NextResponse.json({ qrCode, upiUrl, amount: parseFloat(amount).toFixed(2), upiId: UPI_ID, merchantName: MERCHANT });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
