# Tanvi Mayat Salon & Makeup Studio — Website

A full-stack, production-ready website built with Next.js, TypeScript, Tailwind CSS,
and Framer Motion. It includes a real backend (SQLite/Turso database), a working
contact form, an online booking system, email notifications, and a password-protected
admin dashboard to view leads and bookings.

- **Frontend:** Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, self-hosted fonts
- **Backend:** API routes + SQLite (local file for dev, Turso for production hosting)
- **Auth:** Signed-cookie session for `/admin`, protected by `src/proxy.ts`
- **Email:** SMTP via Nodemailer (Gmail App Password or any SMTP provider)
- **Floating contact buttons:** WhatsApp, Instagram, Facebook, Call Now (bottom-right, all pages)

---

## 1. Run it locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. No setup is required for local development — the
database is a local SQLite file created automatically at `data/salon.db`, and
the contact/booking forms will work immediately (email sending will just be
skipped with a console note until you add SMTP credentials).

## 2. Deploy it for real (Netlify)

This project is pre-configured for Netlify (`netlify.toml` + `@netlify/plugin-nextjs`).

1. Push this project to a GitHub repository.
2. In Netlify: **Add new site → Import an existing project** → pick the repo.
   Netlify will auto-detect the build command (`npm run build`) from `netlify.toml`.
3. **Set up a hosted database (required — Netlify's filesystem resets on every
   deploy, so a local SQLite file won't persist):**
   - Go to https://turso.tech and create a free account.
   - Create a database, then copy its **Database URL** and generate an **Auth Token**.
4. In Netlify → **Site configuration → Environment variables**, add:

   | Variable | Value |
   |---|---|
   | `DATABASE_URL` | your Turso URL, e.g. `libsql://your-db-name.turso.io` |
   | `DATABASE_AUTH_TOKEN` | your Turso auth token |
   | `SMTP_HOST` | e.g. `smtp.gmail.com` |
   | `SMTP_PORT` | `465` |
   | `SMTP_USER` | your sending email address |
   | `SMTP_PASS` | a Gmail **App Password** (not your normal password — create one under Google Account → Security → 2-Step Verification → App Passwords) |
   | `CONTACT_TO_EMAIL` | the email address that should receive leads/bookings |
   | `ADMIN_PASSWORD` | the password you'll use to log into `/admin` |
   | `ADMIN_SECRET` | a long random string — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |

5. Deploy. Once live, visit `https://yoursite.netlify.app/admin/login` to check
   that the admin dashboard works, and submit a test entry through the contact
   form on the homepage to confirm email delivery.
6. **Connect your real domain:** Netlify → Domain management → Add a domain.
   Point your domain's DNS to Netlify as instructed there (usually a few
   CNAME/A records set with your domain registrar, e.g. GoDaddy or Namecheap).

Any other Node.js host (Render, Railway, a VPS) works too — just set the same
environment variables. On a host with a persistent filesystem you can skip
`DATABASE_URL`/`DATABASE_AUTH_TOKEN` entirely and the site will keep using a
local SQLite file.

## 3. Get the site found on Google

- After deploying, submit your site to **Google Search Console**
  (https://search.google.com/search-console).
- Claim/verify your **Google Business Profile** for the salon — this is what
  actually shows up in Google Maps and local search results, and matters more
  for a local business than SEO alone.
- The site already includes structured data (`BeautySalon` schema in
  `src/app/layout.tsx`) and per-page metadata to help Google understand the
  business.

## 4. Editing site content (no code changes needed)

Almost everything — phone number, address, business hours, services and
prices, WhatsApp message, social links, testimonials, and SEO text — lives in
one file:

```
src/lib/config.ts
```

Common edits:
- **WhatsApp number/message:** `contact.phoneRaw` and the message text inside `social.whatsapp.url`.
- **Instagram/Facebook links:** `social.instagram.url` / `social.facebook.url`
  (Instagram is currently set to `https://www.instagram.com/tanvi_mayat_salon/` —
  double check this is the correct handle; Facebook is a placeholder URL and
  should be replaced with the real page link).
- **Services & prices:** the `services` array.
- **Testimonials:** the `testimonials` array.
- **Business hours:** the `hours` array.

## 5. Admin dashboard

Visit `/admin/login`, sign in with the `ADMIN_PASSWORD` you set, and you'll see
every contact-form lead and booking request submitted through the site, with
booking status (pending/confirmed) you can update.

## 6. Adding real photos

Drop image files into `public/images/`, then in `src/components/Gallery.tsx`
change the relevant entry's `type: "placeholder"` to `type: "photo"` and point
it at the new file.

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
    db.ts                 — SQLite/Turso database layer
    mailer.ts             — SMTP email sending
    auth.ts                — admin session signing/verification
  proxy.ts                — protects /admin routes (Next.js 16 proxy layer)
public/
  images/                 — logo, monogram, and salon photos
```

## Notes

- Fonts are self-hosted (via `@fontsource`) rather than pulled from Google
  Fonts at build time, so builds never depend on external network access.
- The contact form and booking form both write to the database immediately;
  email delivery is a best-effort notification on top and never blocks the
  save, so no lead is ever lost even if SMTP isn't configured yet.
