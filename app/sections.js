'use client';
import { useState } from 'react';
import { SITE } from './site';

export const INCLUDES = {
  h1: 'Dusting, vacuuming and mopping, kitchen surfaces, bathrooms and toilets, bins emptied. Not included: inside oven or fridge.',
  h2: 'Everything in a standard clean plus inside oven, fridge and cupboards, tile grout, skirting boards, doors and light fittings.',
  h3: 'Top-to-bottom clean of an empty property, including inside cupboards, appliances, windows and floors.',
  h4: 'Removal of dust, paint splatter and cement residue from floors, glass, fittings and surfaces. Heavy rubble removal is not included.',
  h5: 'Hot-water extraction or shampoo for carpets, rugs and fabric sofas. Drying takes a few hours.',
  h6: 'Glass, frames and sills inside and out for ground and first-floor windows. Higher access is quoted separately.',
  c1: 'Desks wiped, floors vacuumed and mopped, bins emptied, kitchenette and washrooms cleaned. Consumables supplied on request.',
  c2: 'Disinfection of workstations, phones, keyboards, meeting rooms, handles and shared surfaces, plus floors and kitchen.',
  c3: 'Toilets, basins, floors and mirrors disinfected; soap and tissue restocked.',
  c4: 'Machine scrubbing and polishing of hard floors, and extraction cleaning of office carpets.',
  c5: 'Storefront and office glass, frames and sills, inside and out.',
  c6: 'Waste removal, floors, surfaces, washrooms and kitchen after an event, same day or next morning.',
  l1: 'Washed, tumble or line dried and folded. Priced by weight.',
  l2: 'Washed, dried, pressed and returned on hangers or folded.',
  l3: 'Professional dry cleaning for suits, dresses and delicates. Priced per item.',
  l4: 'Duvets, blankets and curtains washed and dried. Priced per item.',
  l5: 'We collect and return your laundry. Add it to any laundry order.',
};

export function Included({ id }) {
  return INCLUDES[id] ? <details className="inc"><summary>What&apos;s included</summary><p>{INCLUDES[id]}</p></details> : null;
}

export function AreaCheck() {
  const [v, setV] = useState('');
  const q = v.trim().toLowerCase();
  const hit = q && SITE.areas.some(a => a.toLowerCase().includes(q) || q.includes(a.toLowerCase()));
  return (<div className="area">
    <label>Do we serve your area?<input value={v} onChange={e => setV(e.target.value)} placeholder="Type your suburb" /></label>
    {q && (hit ? <p className="ok" role="status">Yes, we cover {v.trim()}.</p>
      : <p className="muted" role="status">We don&apos;t list {v.trim()} yet. <a className="lnk" href={`https://wa.me/${SITE.whatsapp}`}>Message us on WhatsApp</a> and we will check.</p>)}
    <p className="tiny">Areas: {SITE.areas.join(', ')}. Hours: {SITE.hours}.</p>
  </div>);
}

export function HowItWorks() {
  const s = [['Choose', 'Pick your services and how often you need them.'], ['Book and pay', 'Select a date, then pay online to confirm.'], ['We clean', 'A vetted team arrives on time with all supplies.']];
  return (<section className="wrap how"><h2>How it works</h2><ol>{s.map(([t, d], i) => <li key={t}><b>{i + 1}</b><div><h3>{t}</h3><p>{d}</p></div></li>)}</ol></section>);
}

export function QuoteForm() {
  const [f, setF] = useState({ company: '', name: '', phone: '', email: '', size: '', needs: '' });
  const [st, setSt] = useState({ busy: false, msg: '', err: '' });
  const set = k => e => setF({ ...f, [k]: e.target.value });
  async function send() {
    setSt({ busy: true, msg: '', err: '' });
    try {
      const r = await fetch('/api/quote', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) });
      const d = await r.json(); if (!r.ok) throw new Error(d.error);
      setSt({ busy: false, msg: `Quote request sent. Reference ${d.ref}. We will reply within one business day.`, err: '' });
    } catch (e) { setSt({ busy: false, msg: '', err: e.message || 'Could not send. Please try again.' }); }
  }
  return (<section id="quote" className="wrap quote"><div>
    <h2>Corporate quote</h2>
    <p className="lead sm">Regular cleaning for offices, retail, clinics and schools. We offer contracts, monthly invoicing and a dedicated team.</p>
    <ul className="ticks"><li>Daily, weekly or monthly schedules</li><li>Invoice payment for registered companies</li><li>Written service scope and cleaning checklist</li></ul>
  </div>
  <div className="form">
    <label>Company<input value={f.company} onChange={set('company')} /></label>
    <label>Contact person<input value={f.name} onChange={set('name')} /></label>
    <label>Phone<input value={f.phone} onChange={set('phone')} type="tel" /></label>
    <label>Email<input value={f.email} onChange={set('email')} type="email" /></label>
    <label className="full">Approximate floor area or number of staff<input value={f.size} onChange={set('size')} /></label>
    <label className="full">What do you need cleaned, and how often?<textarea rows="3" value={f.needs} onChange={set('needs')} /></label>
    {st.err && <p className="err full" role="alert">{st.err}</p>}
    {st.msg ? <p className="ok full" role="status">{st.msg}</p> : <button className="btn full" disabled={st.busy} onClick={send}>{st.busy ? 'Sending…' : 'Request a quote'}</button>}
  </div></section>);
}

const FAQ = [
  ['Do you bring your own supplies and equipment?', 'Yes. Our teams bring professional equipment and eco-friendly products. Tell us in the notes if you prefer we use yours.'],
  ['Do I need to be home?', 'No. You can leave access instructions in the booking notes, or let us in when we arrive.'],
  ['Can I book a repeating clean?', 'Yes. Choose weekly or fortnightly when you book and get a discount on every visit.'],
  ['How is the price worked out?', 'Each service shows its unit (per visit, room, kg or item). Very large properties or sites may need a quote, so message us first.'],
  ['How long does laundry take?', `Usually ${SITE.turnaround} from pickup. Tell us if you need it sooner.`],
  ['What if I am not happy with the clean?', 'Tell us within 24 hours and we will send a team back to fix it at no charge.'],
  ['How do I pay?', 'You pay online when you confirm your booking. Registered companies can ask for invoicing through the corporate quote form.'],
];
export function Faq() {
  return (<section id="faq" className="wrap faq"><h2>Questions</h2>{FAQ.map(([q, a]) => <details key={q}><summary>{q}</summary><p>{a}</p></details>)}</section>);
}

export function Policies() {
  const p = [['Cancel or reschedule', 'Free up to 24 hours before your booking. Later changes may be charged up to 50%.'],
    ['Satisfaction guarantee', 'Report a problem within 24 hours and we will re-clean the affected areas free of charge.'],
    ['Refunds', 'If we cannot fulfil a booking, you receive a full refund to your original payment method.'],
    ['Damage and loss', 'Report any damage within 24 hours with photos. We review every claim promptly and fairly.'],
    ['Privacy', 'We use your details only to deliver your booking and never sell them.']];
  return (<section id="policies" className="wrap pol"><h2>Our policies</h2><div className="polgrid">{p.map(([t, d]) => <div key={t}><h3>{t}</h3><p>{d}</p></div>)}</div></section>);
}

export function Contact() {
  return (<div className="contact"><b>Contact</b>
    <a href={`https://wa.me/${SITE.whatsapp}`}>WhatsApp {SITE.phone}</a><a href={`mailto:${SITE.email}`}>{SITE.email}</a>
    <span>{SITE.address}</span><span>{SITE.hours}</span></div>);
}

export function StickyBar() {
  return (<div className="sticky"><a href="#book" className="btn sm">Book now</a><a href={`https://wa.me/${SITE.whatsapp}`} className="btn sm alt">WhatsApp</a></div>);
}
