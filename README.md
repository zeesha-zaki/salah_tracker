# Salah Tracker
Offline prayer tracker (React Native + Expo). No login, no internet; data stays on the device (AsyncStorage).

## Run locally
    npm install
    npx expo start        # scan QR with Expo Go (Android)

## Build APK
Push to `main`. GitHub Actions builds `salah-tracker.apk` and attaches it to
Actions -> run -> Artifacts, and to the repo's Releases page.

## Debugging tips
- Data logic: `src/stats.js` (pure functions). Storage: `src/storage.js`.
- Reset all data: clear the app's storage in Android settings.
- If Expo complains about versions: `npx expo install --fix`.
- Play Store: replace the debug keystore with your own in android/app/build.gradle (signingConfigs).
