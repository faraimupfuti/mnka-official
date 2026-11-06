export async function POST(req) {
  const b = await req.json();
  if (!b?.company || !b?.name || !b?.phone || !b?.needs)
    return Response.json({ error: 'Please add company, contact person, phone and what you need cleaned.' }, { status: 400 });
  const ref = 'Q-' + Date.now().toString(36).toUpperCase();
  console.log('Corporate quote', ref, JSON.stringify(b)); // TODO: email this to your team
  return Response.json({ ref });
}
