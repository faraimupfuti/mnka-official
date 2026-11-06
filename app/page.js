'use client';
import { useState, useMemo } from 'react';
import { SITE } from './site';
import { Included, AreaCheck, HowItWorks, QuoteForm, Faq, Policies, Contact, StickyBar } from './sections';
const FREQ = { 'One-off': 0, 'Weekly (10% off)': 0.1, 'Fortnightly (5% off)': 0.05, 'Monthly (3% off)': 0.03 };

const CATS = {
  home: { label: 'Home owners', note: 'Houses, flats and apartments', items: [
    { id: 'h1', name: 'Standard home clean', desc: 'Dusting, floors, kitchen, bathrooms', price: 35, unit: 'visit' },
    { id: 'h2', name: 'Deep clean', desc: 'Inside appliances, tiles, skirting, hard stains', price: 70, unit: 'visit' },
    { id: 'h3', name: 'Move in / move out clean', desc: 'Empty-property clean for handover', price: 90, unit: 'property' },
    { id: 'h4', name: 'Post-construction clean', desc: 'Dust, paint and cement residue removal', price: 120, unit: 'property' },
    { id: 'h5', name: 'Carpet & upholstery', desc: 'Shampoo and extraction for rugs and sofas', price: 45, unit: 'room' },
    { id: 'h6', name: 'Window cleaning', desc: 'Inside and outside glass and frames', price: 25, unit: 'visit' },
  ]},
  corp: { label: 'Corporate', note: 'Offices, retail, clinics, schools', items: [
    { id: 'c1', name: 'Daily office cleaning', desc: 'Desks, floors, bins, kitchenette', price: 60, unit: 'day' },
    { id: 'c2', name: 'Office deep clean', desc: 'Full sanitising of workstations and meeting rooms', price: 110, unit: 'visit' },
    { id: 'c3', name: 'Washroom hygiene', desc: 'Disinfection and restocking of consumables', price: 40, unit: 'visit' },
    { id: 'c4', name: 'Floor & carpet care', desc: 'Scrubbing, polishing and carpet extraction', price: 80, unit: 'visit' },
    { id: 'c5', name: 'Commercial windows', desc: 'Storefront and office glazing', price: 70, unit: 'visit' },
    { id: 'c6', name: 'Post-event clean-up', desc: 'Same-day clean after conferences and functions', price: 130, unit: 'event' },
  ]},
  laundry: { label: 'Laundry', note: 'Picked up and delivered', items: [
    { id: 'l1', name: 'Wash & fold', desc: 'Washed, dried and folded', price: 2, unit: 'kg' },
    { id: 'l2', name: 'Wash & iron', desc: 'Washed, dried and pressed on hangers', price: 3.5, unit: 'kg' },
    { id: 'l3', name: 'Dry cleaning', desc: 'Suits, dresses and delicate garments', price: 6, unit: 'item' },
    { id: 'l4', name: 'Bedding & duvets', desc: 'Blankets, duvets and curtains', price: 12, unit: 'item' },
    { id: 'l5', name: 'Pickup & delivery', desc: 'Door-to-door collection and return', price: 5, unit: 'trip' },
  ]},
};
const money = n => '$' + n.toFixed(2).replace(/\.00$/, '');
const ALL = Object.values(CATS).flatMap(c => c.items);

export default function Home() {
  const [cat, setCat] = useState('home');
  const [qty, setQty] = useState({});
  const [f, setF] = useState({ name: '', phone: '', email: '', address: '', date: '', time: 'Morning', freq: 'One-off', notes: '' });
  const [state, setState] = useState({ busy: false, err: '', ref: '' });

  const lines = useMemo(() => ALL.filter(i => qty[i.id] > 0).map(i => ({ ...i, qty: qty[i.id] })), [qty]);
  const sub = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const disc = sub * FREQ[f.freq];
  const total = sub - disc;
  const step = (id, d) => setQty(q => ({ ...q, [id]: Math.max(0, (q[id] || 0) + d) }));
  const set = k => e => setF({ ...f, [k]: e.target.value });

  async function pay() {
    setState({ busy: true, err: '', ref: '' });
    try {
      const r = await fetch('/api/checkout', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...f, items: lines.map(l => ({ id: l.id, name: l.name, qty: l.qty, price: l.price })), total }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error);
      if (d.payUrl) window.location.href = d.payUrl; else setState({ busy: false, err: '', ref: d.ref });
    } catch (e) { setState({ busy: false, err: e.message || 'Something went wrong. Please try again.', ref: '' }); }
  }

  return (<>
    <header className="nav"><div className="wrap row">
      <img src="/logo.png" alt="Mnka Cleaning Services" className="navlogo" />
      <nav><a href="#book">Services</a><a href="#quote">Corporate</a><a href="#faq">FAQ</a><a href="#book" className="btn sm">Book now</a></nav>
    </div></header>

    <section className="hero"><div className="wrap herogrid">
      <div>
        <h1>Clean spaces.<br />Happy places.</h1>
        <p className="lead">Book trusted cleaners for your home, office or laundry in a few taps, and pay online. No calls, no quotes, no waiting.</p>
        <div className="row gap"><a href="#book" className="btn">Choose a service</a><span className="muted">Prices shown upfront</span></div>
      </div>
      <div className="heroart" aria-hidden="true"><img src="/logo.png" alt="" /></div>
    </div></section>

    <section className="trust"><div className="wrap trustrow">
      <div><b>Vetted teams</b><span>Background-checked, trained cleaners</span></div>
      <div><b>Eco-friendly products</b><span>Safe for kids, pets and fabrics</span></div>
      <div><b>Pay securely online</b><span>Confirmation as soon as you book</span></div>
    </div></section>

    <HowItWorks />

    <section id="book" className="wrap booking">
      <h2>Book a service</h2>
      <div className="tabs" role="tablist">
        {Object.entries(CATS).map(([k, c]) => (
          <button key={k} role="tab" aria-selected={cat === k} className={cat === k ? 'tab on' : 'tab'} onClick={() => setCat(k)}>
            {c.label}<small>{c.note}</small></button>))}
      </div>
      <AreaCheck />
      <div className="bookgrid">
        <div>
          <div className="list">
            {CATS[cat].items.map(i => (
              <div key={i.id} className={'svc' + (qty[i.id] ? ' picked' : '')}>
                <div><h3>{i.name}</h3><p>{i.desc}</p><Included id={i.id} /></div>
                <div className="svcr"><span className="price">{money(i.price)}<small> / {i.unit}</small></span>
                  <div className="stepper">
                    <button aria-label={`Remove one ${i.name}`} onClick={() => step(i.id, -1)}>−</button>
                    <output>{qty[i.id] || 0}</output>
                    <button aria-label={`Add one ${i.name}`} onClick={() => step(i.id, 1)}>+</button>
                  </div></div>
              </div>))}
          </div>

          <h3 className="sub">Your details</h3>
          <div className="form">
            <label>Full name<input value={f.name} onChange={set('name')} autoComplete="name" /></label>
            <label>Phone / WhatsApp<input value={f.phone} onChange={set('phone')} type="tel" autoComplete="tel" /></label>
            <label>Email<input value={f.email} onChange={set('email')} type="email" autoComplete="email" /></label>
            <label>Preferred date<input value={f.date} onChange={set('date')} type="date" /></label>
            <label>Time of day<select value={f.time} onChange={set('time')}><option>Morning</option><option>Afternoon</option><option>Evening</option></select></label>
            <label>How often?<select value={f.freq} onChange={set('freq')}>{Object.keys(FREQ).map(k => <option key={k}>{k}</option>)}</select></label>
            <label className="full">Address<input value={f.address} onChange={set('address')} autoComplete="street-address" /></label>
            <label className="full">Notes (pets, access, special requests)<textarea rows="3" value={f.notes} onChange={set('notes')} /></label>
          </div>
        </div>

        <aside className="summary">
          <h3>Booking summary</h3>
          {lines.length === 0 ? <p className="muted">Add a service to see your total. You can combine home, corporate and laundry services.</p> :
            <ul>{lines.map(l => <li key={l.id}><span>{l.qty} × {l.name}</span><b>{money(l.price * l.qty)}</b></li>)}</ul>}
          {disc > 0 && <p className="muted" style={{margin:'12px 0 0'}}>{f.freq.split(' (')[0]} discount: −{money(disc)}</p>}
          <div className="total"><span>Total</span><b>{money(total)}</b></div>
          {state.err && <p className="err" role="alert">{state.err}</p>}
          {state.ref ? <p className="ok" role="status">Booking received. Your reference is <b>{state.ref}</b>. We will confirm by phone or email shortly.</p> :
            <button className="btn full" disabled={!lines.length || state.busy} onClick={pay}>{state.busy ? 'Processing…' : 'Pay and confirm booking'}</button>}
          <p className="tiny">Free rescheduling up to 24 hours before your booking.</p>
        </aside>
      </div>
    </section>

    <section id="why" className="why"><div className="wrap">
      <h2>Cleaning you can set and forget</h2>
      <div className="whygrid">
        <div><h3>Book in minutes</h3><p>Pick services, choose a time, pay. Your confirmation arrives straight away.</p></div>
        <div><h3>Built for homes and businesses</h3><p>One-off deep cleans, weekly visits or daily office service, all from one booking page.</p></div>
        <div><h3>Laundry without the trip</h3><p>We collect, wash, press and deliver back, folded and fresh.</p></div>
      </div>
    </div></section>

    <QuoteForm />
    <Faq />
    <Policies />

    <footer><div className="wrap row foot"><img src="/logo.png" alt="Mnka" className="flogo" /><Contact /><span>© {new Date().getFullYear()} Mnka Cleaning Services. Clean spaces. Happy places.</span></div></footer>
    <StickyBar />
  </>);
}
