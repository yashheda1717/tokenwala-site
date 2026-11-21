# App-link files (CONTRACT_SPRINT4 §F) — templates

Served from `https://tokenwala.co/.well-known/` once the domain is live (the
Flutter web build copies `web/` as is). Both files are placeholders:

- `assetlinks.json` (Android App Links, `autoVerify` intent filter for
  `/e/*` and `/s/*`): replace `sha256_cert_fingerprints` with the release
  signing certificate (`keytool -list -v -keystore <release.jks>`, or Play
  Console → App integrity → App signing key). Serve as `application/json`.
- `apple-app-site-association` (iOS Universal Links): filled in for team
  `7Q94P6B729`, bundle `in.tokenwala.tokenwala`. Serve as `application/json`,
  no redirects, no extension. The app's `ios/Runner/Runner.entitlements` has
  the matching Associated Domains entry (`applinks:tokenwala.co`).

The website (`site/`, deployed to tokenwala.co) serves copies of both files
from `site/.well-known/`; keep the two copies the same.
