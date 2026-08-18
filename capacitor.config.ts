import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.lovable.8e5461af40cd47b0b4d901c945774c88",
  appName: "Dunami",
  webDir: "dist",
  server: {
    url: "https://8e5461af-40cd-47b0-b4d9-01c945774c88.lovableproject.com?forceHideBadge=true",
    cleartext: true,
  },
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_stat_icon_config_sample",
      iconColor: "#111111",
    },
  },
};

export default config;
