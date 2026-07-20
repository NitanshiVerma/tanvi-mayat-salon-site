# Tanvi Mayat Salon & Makeup Studio — Website

A full-stack, production-ready website: Next.js, TypeScript, Tailwind CSS,
Framer Motion, a real database (SQLite locally / Turso in production), a
working contact form, an online booking system, email notifications, and a
password-protected admin dashboard.

**Tested before delivery:** clean build with zero warnings (even with no
environment variables set at all — the exact scenario that breaks most
templates), and every page/API route was hit directly and confirmed working:
homepage, contact form, booking form, input validation, admin login (right
and wrong password), the protected admin dashboard, viewing leads/bookings,
updating a booking's status, admin logout, and the 404 page. Response times
for both forms are consistently under 100ms — email sending happens in the
background afterward, so a slow SMTP connection can never block or break the
page for a visitor.

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No setup needed — the database is a local file
at `data/salon.db`, created automatically. Email sending is skipped locally
until you add SMTP credentials (everything else still works).

## 2. Deploy for real — Vercel (recommended)

Vercel is built by the same team as Next.js, so this project needs zero
configuration there — no config file, no special settings.

**A. Push the code to GitHub** (skip if already done):
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
```

**B. Import into Vercel:**
1. Go to https://vercel.com/signup and sign up with GitHub
2. Click **Add New → Project**
3. Select your repo — Vercel auto-detects Next.js, no changes needed
4. Before clicking Deploy, expand **Environment Variables** and add all of these:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | your Turso database URL (`libsql://...`) |
   | `DATABASE_AUTH_TOKEN` | your Turso auth token |
   | `SMTP_HOST` | e.g. `smtp.gmail.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_USER` | your sending Gmail address |
   | `SMTP_PASS` | a Gmail **App Password** (Google Account → Security → 2-Step Verification → App Passwords) |
   | `CONTACT_TO_EMAIL` | where leads/bookings should be emailed |
   | `ADMIN_PASSWORD` | your choice — logs into `/admin` |
   | `ADMIN_SECRET` | random string: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

5. Click **Deploy**. Done in under a minute.

**C. Set up the database** (only needed once, if you haven't already):
   Go to https://turso.tech → sign up free → create a database → copy the
   **Database URL** and generate an **Auth Token** for the values above.

**D. Connect your domain:** Vercel → your project → **Settings → Domains** →
add your domain → follow the DNS instructions shown (a couple of records set
with your domain registrar, e.g. GoDaddy or Namecheap).

**E. Test the live site:** submit the contact form and the booking form, check
your `CONTACT_TO_EMAIL` inbox, then log into `yoursite.vercel.app/admin/login`.

> One thing worth knowing: Vercel's free ("Hobby") plan is intended for
> personal/non-commercial projects. Small client sites run on it all the
> time without issue in practice, but if that ever matters to you, the paid
> tier is $20/month. This is the honest tradeoff of using a free host for a
> client's business.

## 3. Alternative host: Render (allows commercial use, but slower)

If the Vercel commercial-use note above matters to you, Render's free tier
explicitly permits small business sites. The tradeoff: the server "sleeps"
after 15 minutes of no visitors and takes 30-50 seconds to wake up on the
next one. Same environment variables apply; import the GitHub repo at
https://render.com the same way.

## 4. Get found on Google

- Submit the site at **Google Search Console**: https://search.google.com/search-console
- Claim/verify a **Google Business Profile** for the salon — this drives far
  more local traffic than SEO alone for a business like this
- Structured data (`BeautySalon` schema) and page metadata are already built
  into `src/app/layout.tsx`

## 5. Editing site content (no code needed)

Nearly everything editable — phone number, address, hours, services and
prices, WhatsApp message, social links, testimonials, SEO text — lives in:

```
src/lib/config.ts
```

- **WhatsApp/socials:** `social.whatsapp.url`, `social.instagram.url`,
  `social.facebook.url` (Facebook is currently a placeholder — replace with
  the real page link before going live)
- **Services & prices:** the `services` array
- **Testimonials:** the `testimonials` array
- **Hours:** the `hours` array

## 6. Admin dashboard

`/admin/login` → sign in with `ADMIN_PASSWORD` → view every contact-form
lead and booking request, and update a booking's status (pending / confirmed
/ cancelled / completed).

## 7. Adding real photos

Drop files into `public/images/`, then in `src/components/Gallery.tsx` change
the relevant entry's `type: "placeholder"` to `type: "photo"` pointing at the
new file.

## Project structure

```
src/
  app/
    layout.tsx          — fonts, SEO metadata, schema markup
    page.tsx             — assembles all sections
    globals.css          — design tokens (colors, type) and utility classes
    api/                 — contact, bookings, and admin API routes
    admin/                — admin login + dashboard pages
  components/            — one file per section (Hero, About, Services, Gallery, etc.)
  lib/
    config.ts             — ALL editable business data lives here
    db.ts                 — SQLite/Turso database layer (lazy-loaded — the
                             connection is only created on the first real
                             request, never during a build)
    mailer.ts             — SMTP email sending (8s timeout, never blocks
                             the response — see api/contact and api/bookings)
    auth.ts                — admin session signing/verification
  proxy.ts                — protects /admin routes (Next.js's current
                             convention, replacing the older middleware.ts)
public/
  images/                 — logo, monogram, and salon photos
```

## Notes on decisions made while hardening this project

- **Fonts are self-hosted** (`@fontsource`) instead of pulled from Google
  Fonts at build time, so the build never depends on external network access.
- **Database connections are lazy** — created on first real request, never
  when a file is merely imported. This specifically avoids a build-time
  crash that happens on serverless hosts (Netlify, Vercel) when the database
  isn't reachable during the build step itself.
- **Email sending happens in the background** after the response is already
  sent to the visitor (via Next.js's `after()`), with an 8-second SMTP
  timeout as a safety net — so a slow or failed email can never make a form
  submission appear broken to a visitor. The record is always saved to the
  database first, regardless of email outcome.
