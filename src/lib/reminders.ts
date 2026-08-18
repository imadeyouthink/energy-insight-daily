import { Capacitor } from "@capacitor/core";
import { LocalNotifications } from "@capacitor/local-notifications";

export const REMINDER_ID = 1001;
export const DEFAULT_REMINDER_TIME = "08:00";

const LOCAL_KEY = "dunami.reminder";

export type ReminderPrefs = { enabled: boolean; time: string };

/** Local notifications only exist inside the native iOS app. */
export function remindersSupported(): boolean {
  return Capacitor.isNativePlatform();
}

export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(":");
  const hour = Number(h);
  const minute = Number(m);
  return {
    hour: Number.isFinite(hour) ? hour : 8,
    minute: Number.isFinite(minute) ? minute : 0,
  };
}

export function readLocalPrefs(): ReminderPrefs {
  if (typeof window === "undefined") return { enabled: true, time: DEFAULT_REMINDER_TIME };
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    if (!raw) return { enabled: true, time: DEFAULT_REMINDER_TIME };
    const parsed = JSON.parse(raw) as Partial<ReminderPrefs>;
    return {
      enabled: parsed.enabled ?? true,
      time: typeof parsed.time === "string" ? parsed.time : DEFAULT_REMINDER_TIME,
    };
  } catch {
    return { enabled: true, time: DEFAULT_REMINDER_TIME };
  }
}

export function writeLocalPrefs(prefs: ReminderPrefs) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(prefs));
  } catch {
    /* storage unavailable — schedule still lives on the device */
  }
}

/** "granted" | "denied" | "unsupported" */
export type PermissionState = "granted" | "denied" | "unsupported";

export async function ensurePermission(): Promise<PermissionState> {
  if (!remindersSupported()) return "unsupported";
  const current = await LocalNotifications.checkPermissions();
  if (current.display === "granted") return "granted";
  if (current.display === "denied") return "denied";
  const asked = await LocalNotifications.requestPermissions();
  return asked.display === "granted" ? "granted" : "denied";
}

export async function cancelReminder(): Promise<void> {
  if (!remindersSupported()) return;
  try {
    await LocalNotifications.cancel({ notifications: [{ id: REMINDER_ID }] });
  } catch {
    /* nothing scheduled */
  }
}

/**
 * Schedules (or replaces) the daily morning nudge.
 * Returns the permission state so callers can surface a hint when denied.
 */
export async function scheduleReminder(time: string): Promise<PermissionState> {
  if (!remindersSupported()) return "unsupported";
  const permission = await ensurePermission();
  if (permission !== "granted") return permission;

  const { hour, minute } = parseTime(time);
  await cancelReminder();
  await LocalNotifications.schedule({
    notifications: [
      {
        id: REMINDER_ID,
        title: "Morning check-in",
        body: "15 seconds to shape your day.",
        schedule: { on: { hour, minute }, allowWhileIdle: true },
        extra: { route: "/check-in" },
      },
    ],
  });
  return "granted";
}

/** Applies the stored preference: schedule when on, clear when off. */
export async function syncReminder(prefs: ReminderPrefs): Promise<PermissionState> {
  writeLocalPrefs(prefs);
  if (!remindersSupported()) return "unsupported";
  if (!prefs.enabled) {
    await cancelReminder();
    return "granted";
  }
  return scheduleReminder(prefs.time);
}

/**
 * Called after a check-in is saved: removes today's pending nudge so nobody is
 * reminded twice. The repeating schedule is re-armed for tomorrow.
 */
export async function skipTodaysReminder(prefs: ReminderPrefs): Promise<void> {
  if (!remindersSupported() || !prefs.enabled) return;
  const { hour, minute } = parseTime(prefs.time);
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next.getTime() <= Date.now()) return; // today's already fired
  await cancelReminder();
  const tomorrow = new Date(next.getTime() + 24 * 60 * 60 * 1000);
  try {
    await LocalNotifications.schedule({
      notifications: [
        {
          id: REMINDER_ID,
          title: "Morning check-in",
          body: "15 seconds to shape your day.",
          schedule: { at: tomorrow, repeats: true, every: "day", allowWhileIdle: true },
          extra: { route: "/check-in" },
        },
      ],
    });
  } catch {
    /* fall back to the standard daily schedule */
    await scheduleReminder(prefs.time);
  }
}
