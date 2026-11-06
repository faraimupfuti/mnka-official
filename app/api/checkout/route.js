// Receives a booking, returns a reference. Connect your payment provider here
// (e.g. Paynow, Stripe, Flutterwave) and return its hosted checkout URL as `payUrl`.
export async function POST(req) {
  const b = await req.json();
  if (!b?.name || !b?.phone || !b?.address || !b?.date || !b?.items?.length)
    return Response.json({ error: 'Please complete name, phone, address and date.' }, { status: 400 });
  const ref = 'MNKA-' + Date.now().toString(36).toUpperCase();
  console.log('New booking', ref, JSON.stringify(b));
  return Response.json({ ref, payUrl: null });
}
