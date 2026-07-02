# اصلاحات اعمال‌شده برای رفع خطای Cloudflare

این نسخه برای رفع خطای «خطا در دریافت سورس از گیت‌هاب» و پایدارتر شدن Git Deploy آماده شده است.

## علت اصلی خطا

در نسخه قبلی، اسکریپت build ابتدا عبارت عمومی `IR-NETLIFY/zeus` را جایگزین می‌کرد و بعد می‌خواست لینک کامل raw را به مسیر درست `dist/zeus.js` تبدیل کند. به همین دلیل خروجی نهایی به‌جای این مسیر:

```txt
https://raw.githubusercontent.com/Alidl81/DLB-Panel/refs/heads/main/dist/zeus.js
```

به اشتباه این مسیر را صدا می‌زد:

```txt
https://raw.githubusercontent.com/Alidl81/DLB-Panel/refs/heads/main/zeus.js
```

چون فایل `zeus.js` در ریشه ریپو وجود نداشت، Deployer روی Cloudflare خطای دریافت سورس از گیت‌هاب می‌داد.

## اصلاحات مهم

- لینک‌های raw مربوط به `zeus.js` و `ips.txt` به مسیر درست داخل `dist/` منتقل شدند.
- فایل `dist/dlb-deployer.js` دیگر برای ساخت پنل به GitHub وابسته نیست؛ سورس آماده‌شده پنل داخل خود Deployer bundle شده است.
- فایل‌های `upstream/zeus.js`، `upstream/zeus deployer.js` و `upstream/ips.txt` داخل پروژه قرار داده شدند تا build در Cloudflare به دریافت upstream وابسته نباشد.
- اسکریپت `deploy` به شکل امن‌تر تنظیم شد و قبل از deploy دوباره build می‌گیرد.
- verify جدید علاوه بر عبارت‌های ممنوع، لینک raw اشتباه به ریشه ریپو را هم تشخیص می‌دهد.
- خروجی‌های `dist/zeus.js`، `dist/dlb-deployer.js` و `dist/ips.txt` از قبل ساخته شده‌اند.

## تنظیمات پیشنهادی Cloudflare Git Deploy

```txt
Build command: npm run build
Deploy command: npm run deploy
Root directory: /
```

اگر Cloudflare فقط Deploy command را اجرا کند هم مشکلی نیست، چون `npm run deploy` خودش build را هم اجرا می‌کند.
