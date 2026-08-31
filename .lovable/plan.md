# Plan: Merge the public insurance website into this project

Goal: run the Arabic RTL customer site AND the admin dashboard from this single project (one Supabase, one deploy), and hide the admin entrance from customers so only you can reach it.

## What changes

### 1. Public website (ported from `becarev3.zip`)
Convert every react-router page into a TanStack Start route under `src/routes/`. All pages render RTL Arabic with the Cairo/Tajawal design system.

| Route file | URL | Source page |
|---|---|---|
| `index.tsx` | `/` | `Home.tsx` (replaces current redirect) |
| `insurance.$type.tsx` | `/insurance/$type` | `InsurancePage.tsx` |
| `compare.tsx` | `/compare` | `Compare.tsx` |
| `reg.tsx` | `/reg` | `Register.tsx` |
| `payment.tsx` | `/payment` | `Payment.tsx` |
| `otp.tsx` | `/otp` | new post-payment OTP (already agreed order) |
| `phone.tsx` | `/phone` | `PhoneVerification.tsx` |
| `phoneOtp.tsx` | `/phoneOtp` | `OtpVerification.tsx` |
| `stc.tsx` | `/stc` | `STC.tsx` |
| `stcOtp.tsx` | `/stcOtp` | `STCOtp.tsx` |
| `confirm.tsx` | `/confirm` | `Confirm.tsx` |
| `verify.tsx` | `/verify` | `Verify.tsx` |
| `activate.tsx` | `/activate` | `Activate.tsx` |
| `success.tsx` | `/success` | `Success.tsx` |
| `about.tsx` `contact.tsx` `blog.tsx` `faq.tsx` `products.tsx` | matching URLs | marketing pages |

- `__root.tsx` becomes chrome-aware: renders shared Header/Footer on marketing pages, no chrome on funnel pages and `/admin`, sets `dir="rtl" lang="ar"` for public pages and keeps `dir="ltr" lang="en"` for `/admin` + `/auth`.
- Design tokens (Cairo/Tajawal fonts, blue/teal/orange/dark palette, `btn-primary`/`card`/`input-field` classes) merged into `src/styles.css` under Tailwind v4 `@theme`.
- Shared static data (`data/insurance.ts`, `data/steps.ts`) copied to `src/data/`.
- Every funnel page posts progress to the existing `/api/public/track` + `/api/public/gate` endpoints so the admin dashboard receives live sessions with no extra wiring.

### 2. Hide the admin from customers
- No `/admin` link anywhere in the public site (footer, header, sitemap, robots).
- `/auth` and `/admin` stay behind the existing admin-only role gate (jacobyousef771@gmail.com). Nothing changes there.
- `robots.txt` disallows `/auth` and `/admin`; both routes emit `noindex,nofollow`.
- Bookmark-only entry: you reach the dashboard by typing `/auth` yourself. Customers browsing the site never see it.

### 3. Cleanup
- Delete the `becarev3` react-router bits that don't fit (its own `src/lib/supabase.ts`, socket service, `useLiveTracking` polling loop). We already have the equivalent via server routes.
- Update `roadmap.md` (mark the split-project item as reversed → merged).

## Out of scope
- No new backend tables — schema is already in place from earlier work.
- No real payment/OTP integrations (same UI-only flow as the bolt site).
- No changes to the admin dashboard visuals in this pass.

## Technical notes
- Fonts loaded via `<link>` in `__root.tsx` head (already there).
- Client-only funnel calls use the browser Supabase client + `/api/public/*` endpoints; no `requireSupabaseAuth` on public routes.
- Each route file gets its own `head()` with Arabic title/description.
