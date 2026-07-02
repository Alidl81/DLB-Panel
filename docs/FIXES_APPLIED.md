# Fixes applied

This package fixes the Cloudflare deployer error:

`خطا در دریافت سورس از گیت‌هاب`

## What changed

- The deployer no longer fetches `zeus.js` from GitHub when creating a panel.
- The generated panel source is bundled inside `dist/dlb-deployer.js`.
- The deployer update route uses the bundled panel source too.
- The panel no longer contains runtime `raw.githubusercontent.com` calls.
- `ips.txt` is served locally from `/dlb/ips.txt` and `/ips.txt`.
- The build verifier fails if any generated output still contains:
  - `raw.githubusercontent.com`
  - `خطا در دریافت سورس از گیت‌هاب`
  - `خطا در دریافت سورس جدید از گیت‌هاب`
  - `Failed to fetch source from GitHub`
- `npm run deploy` now runs the build before `wrangler deploy`.

## Verified commands

```bash
npm run prepare:github
node --check dist/zeus.js
node --check dist/dlb-deployer.js
```

## Cloudflare settings

Use these settings for Git-based deployment:

```txt
Build command: npm run build
Deploy command: npm run deploy
Root directory: /
```

If an older deployer is already live, delete/redeploy that Worker or redeploy with cleared build cache. The old Worker can still show the GitHub error even after the repository is fixed.
