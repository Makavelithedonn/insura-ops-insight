# Roadmap

- [x] Admin operations dashboard v1: sidebar, top bar, overview cards, live sessions, session modal, accept/reject
- [x] Sidebar page tabs with active-user counts + active-users card with accept/reject
- [ ] Rebuild dashboard to match the Tameeni-style reference template (dark theme, Pages · live traffic sidebar, submissions modal with per-step accept/reject, Redirect customer, Block session), keeping only fields actually collected by tmin-becaer.bolt.host (SAR currency, KSA insurers, Motsl/Nafath/STC OTP steps)
- Add navigation pages list (Overview / Sessions / Active users / Blocked / Connect) at top of left sidebar
- [x] Enable Lovable Cloud + sessions table + /api/public/track endpoint; wire dashboard to live data
- [x] Capture visitor IP address in /api/public/track, add ip_address column to tracked_sessions; dashboard shows real sessions + applications only (no mock/demo data)
- [x] Remove all mock/seed dashboard sessions; show only live tracked_sessions
- [x] Funnel order: Home → Quote → Compare → Register → Payment → OTP → Phone → Phone-OTP → STC → STC-OTP → Confirm → Verify → Activate → Success (phone pages moved after payment; new /otp page after payment)
- [x] Restore public Home page at `/` (was redirecting to /admin); dashboard stays at /admin
- [x] Make the admin dashboard left-to-right (dir="ltr") while the public site stays RTL Arabic
- [ ] Split the public insurance website into a separate Lovable project sharing the same backend DB; document the connection steps
- [x] Admin gate: every public page load waits for admin approve/reject/redirect via /api/public/gate + /api/public/control; IP + awaiting badge shown in dashboard
