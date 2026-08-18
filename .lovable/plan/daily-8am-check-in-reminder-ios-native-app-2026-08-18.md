# Daily 8AM check-in reminder (iOS native app)

Since Dunami is heading to the App Store as a native iOS app (wrapped with Capacitor), the reminder should be a **local notification scheduled on the device**, not a web push. The phone fires it at 8:00 AM local time even with no internet and no backend involved — this is exactly how habit/check-in apps do it, and it needs no server, no VAPID keys, and no Apple Push certificates.

A server-side push (APNs) is only needed if reminders must be changed or triggered remotely. That is out of scope here and noted at the end.

## What the user experiences

1. After sign-up (or from Profile), Dunami asks: "Want a morning nudge at 8:00?"
2. iOS shows the system permission prompt.
3. Every morning at 8:00 the phone shows: **"Morning check-in"** — "15 seconds to shape your day."
4. Tapping it opens Dunami directly on the check-in screen.
5. If they already checked in that morning, the app cancels that day's reminder so they aren't nudged twice.

No streaks, no guilt copy, and the reminder can be turned off or retimed at any moment.

## What changes in the app

**New: Capacitor iOS shell**
- Add Capacitor with an iOS platform and the Local Notifications plugin.
- App id/name configured for Dunami; the native project is exported to GitHub and built in Xcode when it's App Store time.

**New: reminder service (`src/lib/reminders.ts`)**
- Request notification permission.
- Schedule a repeating daily notification at the chosen hour/minute.
- Cancel/reschedule when the user changes the time or toggles it off.
- Cancel today's pending one after a successful check-in submit.
- No-ops safely in the browser preview (web has no local-notification support), so the app keeps working in the editor.

**Profile screen — new "Daily reminder" card**
- Same glass card treatment as the Name/Email/Password cards.
- Toggle: Morning reminder on/off.
- Time picker, defaulting to 08:00.
- A small line explaining reminders only work in the installed iOS app.

**Deep link into check-in**
- Notification carries `{ route: "/check-in" }`; a listener in the root route navigates there when the app is opened from the notification.

**Preference storage**
- Store `reminder_enabled` and `reminder_time` on the existing `profiles` table (new nullable columns, covered by existing owner-scoped RLS) so the setting survives reinstall and follows the account.
- The device also keeps a local copy so the schedule can be restored on app launch without waiting on the network.

## Technical details

- `@capacitor/core`, `@capacitor/cli`, `@capacitor/ios`, `@capacitor/local-notifications`; `capacitor.config.ts` at the project root pointing at the built web assets, with the preview server URL for hot-reload during development.
- Schedule uses `LocalNotifications.schedule` with `schedule: { on: { hour, minute }, allowWhileIdle: true }` for a daily repeat, fixed notification id so rescheduling replaces rather than stacks.
- Permission state checked via `checkPermissions()` before scheduling; if denied, the Profile card shows a "Enable notifications in iOS Settings" hint instead of silently failing.
- On app resume, re-assert the schedule and clear it for the day if a `daily_entries` row already exists for today.
- Migration: `ALTER TABLE public.profiles ADD COLUMN reminder_enabled boolean NOT NULL DEFAULT true, ADD COLUMN reminder_time time NOT NULL DEFAULT '08:00'`.

## Going to the App Store (later, not in this change)

Export the project to GitHub, `git pull`, `npm install`, `npx cap add ios`, `npx cap sync`, then open in Xcode on a Mac to run on a device and submit. An Apple Developer account is required. Notification permission strings are configured in the iOS project at that point.

## Out of scope
- Remote/server-triggered push (APNs + push certificates) — only needed for messages the backend initiates.
- Android build.
