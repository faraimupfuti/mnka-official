# Mnka Cleaning Services
Run locally: `npm install && npm run dev`  
Deploy: push to GitHub, then Netlify > Add new site > Import project (build `npm run build`; the Next.js runtime is detected automatically).  
Payments: connect your provider in `app/api/checkout/route.js` and return its checkout link as `payUrl`.
