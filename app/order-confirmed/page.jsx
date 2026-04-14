'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

export default function OrderConfirmed() {
  const [order, setOrder] = useState(null);
  const [upi, setUpi] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try sessionStorage first
    try {
      const data = JSON.parse(sessionStorage.getItem('orderData') || '{}');
      if (data.order) setOrder(data.order);
      if (data.upi) setUpi(data.upi);
      if (data.order) { setLoading(false); return; }
    } catch {}

    // Fallback: check URL params
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    const amount = params.get('amount');
    if (orderId && amount) {
      setOrder({ order_id: orderId, total: parseFloat(amount) });
      // Fetch QR from API
      fetch(`/api/upi/qr?amount=${amount}&orderId=${orderId}`)
        .then(r => r.json())
        .then(data => { if (data.upiUrl) setUpi(data); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const orderId = order?.order_id || '#SBJ-00000';
  const total = order?.total || 0;

  return (
    <div className="flex flex-col min-h-screen bg-parchment grain">
      {/* Header */}
      <div className="flex items-center justify-between bg-parchment/95 backdrop-blur-md" style={{ padding: '12px 20px', borderBottom: '1px solid var(--color-khaki)' }}>
        <Link href="/" className="text-soil/50" style={{ padding: 4 }}>
          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>close</span>
        </Link>
        <h1 className="font-display font-800 text-soil" style={{ fontSize: 17 }}>Order Status</h1>
        <div style={{ width: 32 }} />
      </div>

      <div className="flex-1 flex flex-col items-center" style={{ padding: '32px 20px 0' }}>
        {/* Success */}
        <div className="btn-forest flex items-center justify-center anim-bounce-in" style={{ width: 64, height: 64, borderRadius: 20, marginBottom: 16, boxShadow: '0 8px 32px rgba(26,58,42,0.25)' }}>
          <svg style={{ width: 32, height: 32 }} fill="none" stroke="white" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h2 className="font-display font-800 text-soil text-center anim-fade-up" style={{ fontSize: 22, animationDelay: '200ms' }}>Order Placed!</h2>
        <p className="font-body text-muted text-center anim-fade-up" style={{ fontSize: 12, marginTop: 4, animationDelay: '300ms' }}>
          {upi ? 'Scan the QR code below to pay via UPI' : loading ? 'Loading payment...' : 'Your order has been placed successfully'}
        </p>

        {/* UPI QR Code */}
        {upi && (
          <div className="w-full card-flat text-center anim-fade-up" style={{ marginTop: 20, padding: 20, animationDelay: '400ms' }}>
            <p className="font-body font-600 text-muted uppercase" style={{ fontSize: 9, letterSpacing: '0.12em', marginBottom: 12 }}>Scan to Pay</p>

            <div className="flex justify-center" style={{ marginBottom: 12 }}>
              <div style={{ padding: 12, background: 'white', borderRadius: 16, border: '2px solid var(--color-khaki)' }}>
                <QRCodeSVG
                  value={upi.upiUrl}
                  size={200}
                  level="H"
                  fgColor="#1a3a2a"
                  style={{ display: 'block' }}
                />
              </div>
            </div>

            <p className="font-display font-800 text-forest" style={{ fontSize: 28, marginBottom: 4 }}>
              <span style={{ fontSize: 16, opacity: 0.5 }}>{'\u20B9'}</span>{parseFloat(upi.amount).toFixed(2)}
            </p>
            <p className="font-body text-muted" style={{ fontSize: 10, marginBottom: 8 }}>
              UPI ID: <span className="font-600 text-soil">{upi.upiId}</span>
            </p>
            <div className="bg-saffron/10 inline-flex items-center" style={{ gap: 4, padding: '4px 12px', borderRadius: 8 }}>
              <span className="material-symbols-outlined text-saffron" style={{ fontSize: 12, fontVariationSettings: "'FILL' 1" }}>info</span>
              <span className="font-body font-500 text-saffron" style={{ fontSize: 9 }}>Pay using any UPI app</span>
            </div>
          </div>
        )}

        {/* Loading QR */}
        {loading && !upi && (
          <div className="w-full card-flat text-center" style={{ marginTop: 20, padding: 32 }}>
            <span className="material-symbols-outlined text-muted animate-spin" style={{ fontSize: 28 }}>progress_activity</span>
            <p className="font-body text-muted" style={{ fontSize: 12, marginTop: 8 }}>Generating QR code...</p>
          </div>
        )}

        {/* Order info */}
        {order && (
          <div className="flex w-full anim-fade-up" style={{ gap: 10, marginTop: 16, animationDelay: '500ms' }}>
            <div className="flex-1 card-flat text-center" style={{ padding: 12 }}>
              <p className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.12em' }}>Order ID</p>
              <p className="font-display font-800 text-soil" style={{ fontSize: 13, marginTop: 4 }}>{orderId}</p>
            </div>
            <div className="flex-1 card-flat text-center" style={{ padding: 12 }}>
              <p className="font-body font-600 text-muted uppercase" style={{ fontSize: 8, letterSpacing: '0.12em' }}>Estimated</p>
              <p className="font-display font-800 text-soil" style={{ fontSize: 13, marginTop: 4 }}>35{'\u2013'}45 mins</p>
            </div>
          </div>
        )}

        {/* Back to home */}
        <div className="w-full anim-fade-up" style={{ marginTop: 20, marginBottom: 32, animationDelay: '600ms' }}>
          <Link href="/" className="block w-full btn-forest font-body font-700 text-white text-center" style={{ padding: '14px 0', fontSize: 13 }}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
