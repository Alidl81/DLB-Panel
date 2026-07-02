# DLB Panel

DLB Panel یک نسخه اختصاصی‌شده از پنل مدیریت Cloudflare Workers برای ساخت و مدیریت کانفیگ‌های VLESS روی بستر Cloudflare Worker و دیتابیس D1 است.

این بسته برای انتشار روی گیت شخصی علی دولابی آماده شده و برند پیش‌فرض آن به شکل زیر تنظیم شده است:

- نام پنل: `DLB Panel`
- مالک: `Ali Doulabi`
- تلگرام: `@Ali_dlb404`
- مسیر WebSocket اختصاصی: `/DLB_Panel_Ali_dlb404`
- پیشوند Worker: `dlb-panel`
- پیشوند دیتابیس D1: `dlb-db`

## امکانات اصلی

- مدیریت کاربران و اشتراک‌ها
- تعیین حجم، زمان، سقف درخواست و محدودیت اتصال همزمان
- تولید لینک ساب‌اسکریپشن متنی
- تولید کانفیگ VLESS با مسیر اختصاصی DLB Panel
- پنل مدیریتی تحت Cloudflare Workers
- اتصال به Cloudflare D1 برای ذخیره اطلاعات
- قابلیت آماده‌سازی خروجی برای انتشار در GitHub شخصی
- درج `@Ali_dlb404` داخل کانفیگ‌های تولیدشده

## ساخت نسخه اختصاصی

ابتدا فایل تنظیمات را باز کن:

```json
./dlb-panel.config.json
```

اگر می‌خواهی آپدیت داخلی پنل از گیت خودت انجام شود، این دو مقدار را عوض کن:

```json
"githubOwner": "YOUR_GITHUB_USERNAME",
"githubRepo": "dlb-panel"
```

سپس دستور زیر را اجرا کن:

```bash
npm run prepare:github
```

بعد از اجرا، خروجی‌ها در پوشه `dist` ساخته می‌شوند:

```txt
dist/
├─ zeus.js
├─ dlb-deployer.js
├─ ips.txt
└─ wrangler.toml.example
```

فایل اصلی Worker همان `dist/zeus.js` است.

## نصب دستی با Wrangler

Cloudflare Wrangler را نصب کن:

```bash
npm install -g wrangler
wrangler login
```

دیتابیس D1 بساز:

```bash
wrangler d1 create dlb-db
```

فایل نمونه را کپی کن:

```bash
cp dist/wrangler.toml.example dist/wrangler.toml
```

داخل `dist/wrangler.toml` مقدار `database_id` را با خروجی Cloudflare جایگزین کن.

سپس Secretها را ثبت کن:

```bash
cd dist
wrangler secret put CF_API_TOKEN
wrangler secret put CF_ACCOUNT_ID
```

و در نهایت Worker را دیپلوی کن:

```bash
wrangler deploy
```

بعد از دیپلوی، برای ورود به پنل به مسیر زیر برو:

```txt
https://YOUR_WORKER.YOUR_SUBDOMAIN.workers.dev/panel
```

## استفاده از Deployer

اگر می‌خواهی نصب‌کننده اختصاصی داشته باشی، فایل زیر را به‌عنوان Worker جداگانه دیپلوی کن:

```txt
dist/dlb-deployer.js
```

این نصب‌کننده Worker و D1 را در اکانت Cloudflare می‌سازد و خروجی نهایی پنل را تحویل می‌دهد.

## شخصی‌سازی بیشتر

برای تغییر برند، مسیر اتصال، نام مالک، آیدی تلگرام، نام ریپو یا پیشوند Worker فقط کافی است فایل زیر را تغییر دهی و دوباره build بگیری:

```txt
dlb-panel.config.json
```

## انتشار در GitHub

برای انتشار روی گیت خودت:

1. مقدارهای `githubOwner` و `githubRepo` را در `dlb-panel.config.json` تنظیم کن.
2. دستور `npm run prepare:github` را اجرا کن.
3. محتوای پروژه را داخل ریپوی خودت push کن.
4. مطمئن شو فایل `dist/zeus.js` هم در ریپو وجود دارد، چون آپدیت داخلی پنل از همین فایل استفاده می‌کند.

## امنیت

- توکن Cloudflare را داخل فایل‌ها ذخیره نکن.
- برای Worker اصلی از `wrangler secret put` استفاده کن.
- بعد از ساخت پنل، رمز مدیریت را قوی انتخاب کن.
- اگر Deployer عمومی می‌سازی، بهتر است دسترسی آن را محدود کنی.

## مجوز

این نسخه با عنوان DLB Panel برای Ali Doulabi آماده شده است. جزئیات مجوز در فایل `LICENSE` آمده است.
