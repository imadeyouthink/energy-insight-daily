# Daily 8AM check-in reminder (push notifications)

## How it works, in plain terms

Dunami is a web app, so reminders use **Web Push** — the same mechanism native apps use, delivered by the browser. Three pieces are needed:

1. The app asks permission and registers a small background worker in the browser.
2. That subscription is saved in the backend, tied to the user.
3. A scheduled job runs every 15 minutes, finds users whose local time just hit 8:00 AM and who haven't checked in yet today, and sends them a notification. Tapping it opens the check-in screen.

**Important iOS caveat:** on iPhone, web push only works if the user adds Dunami to the Home Screen (Share > Add to Home Screen) and then allows notifications. Safari in a normal tab cannot receive push. The app will detect this and show a short "Add to Home Screen to enable reminders" hint instead of a broken toggle.

## What changes in the app

- **Service worker** (`public/sw.js`): receives push events, shows the notification, opens `/check-in` on tap. Registered on app start.
- **Profile screen**: a new "Daily reminder" glass card matching the existing card style — a toggle for reminders, a time picker defaulting to 08:00, and the iOS Home Screen hint when applicable.
- **Notification copy**: title "Morning check-in", body "15 seconds to shape your day." No streaks or guilt language.
- **Skip if already done**: users who already checked in that morning get no notification.

## Technical details

**Database (new migration)**
- `push_subscriptions`: `id`, `user_id`, `endpoint` (unique), `p256dh`, `auth`, `created_at`. RLS: owner-only select/insert/delete; GRANTs for `authenticated` and `service_role`.
- `reminder_settings`: `user_id` (PK), `enabled` (default true), `send_hour_local` (default 8), `send_minute_local` (default 0), `timezone` (IANA string, captured from the browser), `last_sent_on` (date, prevents duplicates). Same RLS/GRANT pattern.

**Secrets**
- VAPID key pair (`VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT`) generated and stored as backend secrets. The public key is fetched by the client through a small server function.
- `CRON_SECRET` to authenticate the scheduler.

**Client**
- `src/lib/push.ts`: register the service worker, request permission, `pushManager.subscribe` with the VAPID public key, persist via a server function, and detect standalone/iOS support.
- `src/lib/push.functions.ts`: `savePushSubscription`, `removePushSubscription`, `getReminderSettings`, `updateReminderSettings` — all behind `requireSupabaseAuth`.

**Scheduled sending**
- Public server route `src/routes/api/public/send-reminders.ts`, guarded by a `CRON_SECRET` header check. For each enabled subscriber it computes local time from their stored timezone, sends when it is within the current window, skips anyone with a `daily_entries` row for today, updates `last_sent_on`, and deletes subscriptions the push service reports as expired (404/410).
- Encryption/signing done with a Worker-compatible pure-JS web-push library (Web Crypto based, no Node-only deps).
- `pg_cron` + `pg_net` job every 15 minutes calling that route on the stable project URL with the secret header.

## Not included
- Native iOS app / APNs (would require a real app build).
- Email or SMS fallback.
