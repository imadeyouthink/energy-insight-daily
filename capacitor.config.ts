import type { CapacitorConfig } from "@capacitor/cli";

// Dunami runs its AI plan generation on the server, so the native iOS shell
// loads the deployed web app instead of a static bundle.
//
// - Preview (dev testing):  https://project--8e5461af-40cd-47b0-b4d9-01c945774c88-dev.lovable.app
// - Production (TestFlight): https://project--8e5461af-40cd-47b0-b4d9-01c945774c88.lovable.app
const APP_URL =
  process.env["CAP_SERVER_URL"] ??
  "https://project--8e5461af-40cd-47b0-b4d9-01c945774c88.lovable.app";

const config: CapacitorConfig = {
  appId: "app.dunami.mobile",
  appName: "Dunami",
  webDir: "dist/client",
  server: {
    url: `${APP_URL}?forceHideBadge=true`,
    cleartext: false,
  },
  ios: {
    contentInset: "always",
    backgroundColor: "#ffffff",
    limitsNavigationsToAppBoundDomains: false,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#111111",
    },
  },
};

export default config;
