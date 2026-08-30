# Plan: Rebuild the BeCaree insurance website inside Lovable

## Goal
Move the entire Arabic RTL insurance funnel (currently on `tmin-becaer.bolt.host`, source in `becarev3.zip`) into this Lovable app so the **website and the operations dashboard share one Lovable Cloud database**. Accept/Reject in the dashboard becomes real two-way control: when an admin clicks Accept, the customer's current step is approved server-side and the next step unlocks on the live site — no bolt site, no snippet, no polling glue.

## What we're porting (from the uploaded project)
- **Workflow model**: `applications`, `application_steps`, `submission_versions`, `review_actions`, `admin_comments`, `application_history`, `notifications` + 4 SECURITY DEFINER functions (`approve_step`, `reject_step`, `request_changes_step`, `unlock_step`).
- **5-step funnel**: `insurance_quote` → `customer_info` → `phone_verification` → `payment` → `confirmation`.
- **Post-payment pages**: `STC` (carrier select) → `STCOtp` → `Confirm` → `Verify` → `Activate` → `Success`. This is the "page after payment" requested.
- **Design system**: Cairo/Tajawal fonts, `dir="rtl" lang="ar"`, the blue/teal/orange/dark token palette, the `btn-primary`/`card`/`input-field` component classes.
- **Data**: KSA insurers list, car brands, cities, car insurance offers (from `src/data/insurance.ts`).
- **Field names stay exactly as the bolt site collects them** — National ID, phone, car make/model/year, declared value, city, insurer, offer. No invented fields.

## Steps

### 1. Backend — workflow schema in Lovable Cloud
- New migration with the 7 tables + 4 SECURITY DEFINER functions, ported from the bolt migration. Add `GRANT` on every public table (anon + authenticated select/insert/update; review_actions insert open since the frontend never writes them). Enable RLS on all.
- Keep the existing `tracked_sessions` table + `/api/public/track` for lightweight visit/submit notifications (used by the dashboard's real-time toasts), but the authoritative state lives in the new workflow tables.
- Seed a couple of demo `applications` with steps in various statuses so the dashboard has data on first load.

### 2. Design system + RTL root
- `src/styles.css`: port the Cairo/Tajawal font stack, `direction: rtl`, the full color palette (primary/secondary/accent/success/warning/error/dark), and the `container-x`/`btn-primary`/`btn-secondary`/`card`/`input-field`/`gradient-text` component classes into Tailwind v4 `@theme`.
- `src/routes/__root.tsx`: set `<html lang="ar" dir="rtl">`, add the Google Fonts `<link>`, keep the Toaster. Marketing pages get a shared Header/Footer; funnel/admin pages render chromeless.

### 3. Public funnel routes (RTL Arabic, TanStack Start)
Port each bolt page into its own route file. Funnel pages call the workflow API (create application on step 1, `submitStep` on each form, read notifications to reveal admin decisions, honor step locking — a locked step redirects back to the current step).

| Route file | URL | Bolt page | Workflow step |
|---|---|---|---|
| `index.tsx` | `/` | Home (hero, insurers, features) | — (entry) |
| `insurance.$type.tsx` | `/insurance/$type` | InsurancePage (quote form → Compare offers) | `insurance_quote` |
| `register.tsx` | `/reg` | Register (customer + vehicle data) | `customer_info` |
| `phone.tsx` | `/phone` | PhoneVerification | `phone_verification` |
| `phone-otp.tsx` | `/phoneOtp` | OtpVerification | (sub-step) |
| `payment.tsx` | `/payment` | Payment | `payment` |
| `stc.tsx` | `/stc` | STC (carrier select) | (post-payment) |
| `stc-otp.tsx` | `/stcOtp` | STCOtp | (post-payment) |
| `confirm.tsx` | `/confirm` | Confirm | `confirmation` |
| `verify.tsx` | `/verify` | Verify | (post-payment) |
| `activate.tsx` | `/activate` | Activate | (post-payment) |
| `success.tsx` | `/success` | Success | — (final) |
| `about.tsx` / `contact.tsx` / `faq.tsx` | `/about` etc. | marketing pages | — |

- A client-safe `src/lib/workflow.ts` mirrors the bolt `api.ts` (createApplication, submitStep, getStepStatus, notifications) using the generated Supabase browser client — the website IS the customer; anon-key RLS covers it.

### 4. Admin dashboard → real two-way control
- Replace the demo data in `src/routes/admin.tsx` with live reads from `applications` + `application_steps` (+ last submission version data) via a server function.
- Sidebar nav switches views: Overview / Live sessions / Active users / Card submissions / Blocked / Connect.
- Session modal shows real customer/vehicle/insurance data from the submitted step `data` JSONB (masked NID/phone by default).
- **Accept** → server function calls `approve_step(application_id, step_key)` with `supabaseAdmin` → step approved, next step unlocks, notification created → customer sees it on the site and advances. **Reject** → `reject_step` → step reopens for the customer with the admin's comment. This is the round-trip control you asked about.
- Keep the visit/submit toast notifications from `/api/public/track`.

### 5. Verify
- Build passes; each funnel route renders RTL; creating an application on `/insurance/car`, submitting the quote step, then Accept in `/admin` unlocks `/reg` on the site.

## Out of scope
- Customer login/auth (the bolt site is no-auth for customers; the admin dashboard stays the simple gated UI it is now).
- The marketing Blog/Products/Login pages beyond basic porting if not needed for the funnel.
- Real STC/Mada/Nafath integrations — the OTP pages stay UI-only flows that record the step data, same as the bolt site.

## Note
The "page after payment" you mentioned is already the bolt site's `STC → STCOtp → Confirm → Verify → Activate` sequence; I'll port that exact flow rather than invent a new page. If you have a specific new screen in mind, share the screenshot and I'll slot it in.
