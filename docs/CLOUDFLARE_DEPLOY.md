# دیپلوی DLB Panel روی Cloudflare Workers و D1

این راهنما برای خروجی ساخته‌شده داخل پوشه `dist` است.

## 1) ساخت خروجی نهایی

```bash
npm install
npm run prepare:github
```

بعد از این مرحله باید فایل‌های زیر ساخته شوند:

```txt
dist/zeus.js
dist/dlb-deployer.js
dist/ips.txt
dist/wrangler.toml.example
```

## 2) ورود به Cloudflare با Wrangler

```bash
npm install -g wrangler
wrangler login
```

یا بدون نصب global:

```bash
npx wrangler login
```

## 3) ساخت دیتابیس D1

```bash
npx wrangler d1 create dlb-db
```

Cloudflare یک `database_id` می‌دهد. آن را کپی کن.

## 4) آماده‌سازی فایل wrangler.toml

```bash
cd dist
cp wrangler.toml.example wrangler.toml
```

داخل `wrangler.toml` مقدار زیر را عوض کن:

```toml
database_id = "PUT_YOUR_D1_DATABASE_ID_HERE"
```

با `database_id` واقعی که Cloudflare داده.

## 5) دیپلوی Worker اصلی پنل

داخل پوشه `dist` بزن:

```bash
npx wrangler deploy
```

بعد از deploy، آدرس Worker به شکل زیر نمایش داده می‌شود:

```txt
https://dlb-panel.<your-subdomain>.workers.dev
```

## 6) تنظیمات بعد از نصب

آدرس پنل معمولاً با مسیرهای داخل Worker کار می‌کند. ابتدا صفحه اصلی Worker را باز کن و اگر مسیر پنل در README پروژه یا خروجی نمایش داده شد، همان را استفاده کن.

برای استفاده از دامنه اختصاصی، از Cloudflare Dashboard وارد Workers & Pages شو، Worker را باز کن و از بخش Settings/Triggers یک Custom Domain اضافه کن.
