import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LocalNotifications } from "@capacitor/local-notifications";

import { remindersSupported } from "@/lib/reminders";

/**
 * Opens the check-in screen when the app is launched from the morning reminder.
 * No-op outside the native iOS app.
 */
export function NotificationRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!remindersSupported()) return;
    let cancelled = false;
    const handle = LocalNotifications.addListener("localNotificationActionPerformed", (event) => {
      const route = (event.notification.extra as { route?: string } | undefined)?.route;
      if (route === "/check-in") navigate({ to: "/check-in" });
    });
    return () => {
      cancelled = true;
      void handle.then((h) => {
        if (cancelled) void h.remove();
      });
    };
  }, [navigate]);

  return null;
}
