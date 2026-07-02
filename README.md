<p align="center">
  <img src="photos/dlbpanel-dark.png" width="100%" alt="DLB Panel" style="border-radius: 12px; margin-bottom: 15px;">
</p>

<table width="100%">
  <tr>
    <td width="50%" valign="middle" align="center"><img src="photos/dlbpanel-updater.png" width="100%" alt="DLB Panel Updater" style="border-radius: 12px;"></td>
    <td width="50%" valign="middle" align="center"><img src="photos/dlbpanel-deployer.png" width="100%" alt="DLB Panel Deployer" style="border-radius: 12px;"></td>
  </tr>
  <tr>
    <td width="50%" valign="middle" align="center"><img src="photos/dlbpanel-add.png" width="100%" alt="DLB Panel Add User" style="border-radius: 12px;"></td>
    <td width="50%" valign="middle" align="center"><img src="photos/dlbpanel-status.png" width="100%" alt="DLB Panel Status" style="border-radius: 12px;"></td>
  </tr>
</table>

<div align="center">
  <h1>⚡ DLB Panel for Cloudflare Workers</h1>
  <p>
    <img src="https://img.shields.io/badge/Project-DLBPanel-0052CC?style=for-the-badge" alt="DLBPanel">
    <img src="https://img.shields.io/badge/Platform-Cloudflare_Workers-F38020?style=for-the-badge&logo=cloudflare&logoColor=white" alt="Cloudflare Workers">
    <img src="https://img.shields.io/badge/Main-dlbpanel.js-222222?style=for-the-badge" alt="dlbpanel.js">
  </p>
</div>

---

## معرفی

این ریپو برای دیپلوی خودکار **DLB Panel** روی Cloudflare Workers آماده شده است. فایل‌های اصلی پروژه با نام `dlbpanel` ساخته شده‌اند و فایل فعلی Worker در `dlbpanel.js` قرار دارد.

منبع آپدیت Clean IP دقیقاً طبق درخواست، فقط از این مسیر خوانده می‌شود:

```txt
https://github.com/IR-NETLIFY/zeus/blob/main/ips.txt
```

## فایل‌های مهم

| فایل | کاربرد |
|---|---|
| `dlbpanel.js` | Worker اصلی پنل |
| `dlbpanel-deployer.js` | Deployer اختیاری برای ساخت Worker و D1 از طریق توکن Cloudflare |
| `wrangler.toml` | تنظیمات Cloudflare Worker برای دیپلوی Git/CLI |
| `package.json` | اسکریپت‌های ساده برای deploy/dev/check |
| `photos/dlbpanel-*.png` | تصاویر مستندات با نام DLB Panel |

## تنظیمات Cloudflare

برای اجرای پنل، Worker باید یک D1 binding با نام دقیق `DB` داشته باشد. اگر دیپلوی از قبل روی Cloudflare تنظیم شده، فقط مطمئن شوید Binding با همین نام وجود دارد.

اگر با Wrangler دیپلوی می‌کنید، در `wrangler.toml` بخش D1 را بعد از ساخت دیتابیس فعال کنید و مقدار `database_id` را قرار دهید.

## دیپلوی

```bash
npm install
npm run deploy
```

یا اگر Cloudflare به GitHub وصل است، کافی است محتوای این پروژه را در شاخه `main` ریپوی زیر قرار دهید و Push کنید:

```txt
https://github.com/Alidl81/DLB-Panel
```


## اصلاح رفتار IP و مسیر پنل

در این نسخه اگر آدرس اصلی Worker را بدون مسیر باز کنید، مستقیم به `/panel` منتقل می‌شوید. همچنین دریافت Clean IP از داخل خود Worker و مسیر `/api/clean-ips` انجام می‌شود. منبع پنل فقط لینک `https://github.com/IR-NETLIFY/zeus/blob/main/ips.txt` است؛ Worker همین لینک blob را به raw تبدیل می‌کند تا به‌جای HTML صفحه GitHub، فقط متن واقعی `ips.txt` خوانده شود.

## مسیرهای اصلی

- پنل: `/panel`
- لاگین: `/login`
- وضعیت کاربر: `/status/<username>`
- Subscription: `/sub/<username>` و `/feed/<username>`

## نکته مهم درباره آپدیت

آپدیت سورس پنل از ریپوی خودتان انجام می‌شود:

```txt
https://raw.githubusercontent.com/Alidl81/DLB-Panel/refs/heads/main/dlbpanel.js
```

اما آپدیت IPها فقط از لینک blob مشخص‌شده‌ی IR-NETLIFY انجام می‌شود و هیچ فایل/مسیر دیگری برای IPها استفاده نمی‌شود.
