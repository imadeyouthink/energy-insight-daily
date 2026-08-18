# Dunami on TestFlight (iOS)

## 0. Prerequisites

- A Mac with Xcode 15+ installed
- An Apple Developer Program membership ($99/year)
- Node 20+ and `npm`/`bun`
- Publish the app first (Lovable → Publish). The native shell loads the published URL.

## 1. Get the code on your Mac

Export the project to GitHub from Lovable, then:

```bash
git clone <your-repo-url>
cd <repo>
npm install
```

## 2. Add the iOS platform

`@capacitor/ios` and `@capacitor/cli` are already dependencies.

```bash
npm run build
npx cap add ios
npx cap sync ios
```

This creates the `ios/` folder (an Xcode project). Re-run `npx cap sync ios`
after every dependency change.

## 3. App icon and splash (optional but recommended)

```bash
npm i -D @capacitor/assets
mkdir -p assets && cp public/app-icon.png assets/icon.png
npx @capacitor/assets generate --ios
```

## 4. Open in Xcode

```bash
npx cap open ios
```

In Xcode → target **App** → *Signing & Capabilities*:

- Team: your Apple Developer team
- Bundle Identifier: `app.dunami.mobile` (must match `appId` in `capacitor.config.ts`)
- Enable **Push Notifications** is NOT needed — Dunami uses *local* notifications only.
- *Info* tab: confirm `Display Name` is `Dunami`.

Set the version/build under *General → Identity* (e.g. Version `1.0`, Build `1`).
Every TestFlight upload needs a new build number.

## 5. Test on your device

Plug in your iPhone, pick it as the run destination, press ▶︎. Trust the
developer profile on the phone if prompted (Settings → General → VPN & Device
Management).

## 6. Upload to TestFlight

1. In Xcode: destination → **Any iOS Device (arm64)**
2. *Product → Archive*
3. In the Organizer window: **Distribute App → App Store Connect → Upload**
4. In [App Store Connect](https://appstoreconnect.apple.com): create the app
   record with bundle ID `app.dunami.mobile`, name `Dunami`.
5. After processing (~10 min), open the **TestFlight** tab, add yourself under
   *Internal Testing*, and install via the TestFlight app on your phone.

## 7. Pointing the app at preview instead of production

The shell URL is configurable:

```bash
CAP_SERVER_URL=https://project--8e5461af-40cd-47b0-b4d9-01c945774c88-dev.lovable.app npx cap sync ios
```

## Notes

- Because the shell loads the deployed site, publishing new web changes updates
  the app instantly — no new TestFlight build needed unless native code changes.
- Morning reminders use `@capacitor/local-notifications`; iOS will ask for
  notification permission the first time you enable the reminder in Profile.
- Apple requires a privacy policy URL and an account-deletion path for apps with
  accounts before *public* release; internal TestFlight testing does not.
