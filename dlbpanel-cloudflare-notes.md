# DLB Panel Cloudflare Notes

- Main Worker file: `dlbpanel.js`
- Optional deployer Worker file: `dlbpanel-deployer.js`
- Required runtime binding: `DB` as Cloudflare D1
- Optional secrets for in-panel updater: `CF_API_TOKEN`, `CF_ACCOUNT_ID`
- Clean IP update source: `https://github.com/IR-NETLIFY/zeus/blob/main/ips.txt`

For a GitHub-connected Cloudflare Worker, set the deploy command to:

```bash
npm install && npm run deploy
```

If Cloudflare already handles install automatically, the deploy command can be:

```bash
npm run deploy
```


## Fix notes

- Root path `/` now redirects to `/panel` so opening the Worker base URL does not expose the landing-page HTML.
- Clean IP loading now goes through `/api/clean-ips`. The pinned source is only `https://github.com/IR-NETLIFY/zeus/blob/main/ips.txt`; the Worker converts that blob URL to the raw file URL internally and rejects HTML responses.


## نسخه 1.5.12

- مخزن IP فقط از لینک GitHub خواسته‌شده خوانده می‌شود و در مرورگر به raw تبدیل می‌شود.
- cache روزانه اضافه شده است تا اگر GitHub تغییر نکرده بود، همان IPهای سالم قبلی استفاده شوند.
- پاپ‌آپ پیام همگانی حذف شده است.
