# Cloudflare Git Deploy برای DLB Panel

این پروژه باید ابتدا Deployer Worker را deploy کند. Deployer بعداً داخل پنل خودش D1 و Worker اصلی را می‌سازد؛ پس برای Git Deploy اولیه نیازی به ساخت D1 نیست.

## تنظیمات Cloudflare

- Repository: `Alidl81/DLB-Panel`
- Branch: `main`
- Root directory: `/`
- Build command: `npm run build`
- Deploy command: `npm run deploy`

فایل `wrangler.toml` ریشه پروژه برای Deployer است:

```toml
name = "dlbpanel"
main = "dist/dlb-deployer.js"
compatibility_date = "2024-02-08"
workers_dev = true
```

اگر نام پروژه/Worker در Cloudflare چیز دیگری است، فقط مقدار `name` را با همان نام یکی کن.

## بعد از Deploy

لینک Worker ساخته‌شده را باز کن. این لینک پنل نهایی نیست؛ صفحه Deployer است. داخل آن Cloudflare API Token را وارد می‌کنی و Deployer خودش D1 و Worker اصلی پنل را می‌سازد.
