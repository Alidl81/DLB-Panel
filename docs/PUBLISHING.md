# راهنمای انتشار DLB Panel در GitHub

1. یک ریپوی جدید با نام `dlb-panel` بساز.
2. مقدارهای `githubOwner` و `githubRepo` را در `dlb-panel.config.json` تنظیم کن.
3. دستور زیر را اجرا کن:

```bash
npm run prepare:github
```

4. مطمئن شو خروجی‌های زیر ساخته شده‌اند:

```txt
dist/zeus.js
dist/dlb-deployer.js
```

5. فایل‌های پروژه را push کن:

```bash
git init
git add .
git commit -m "Initial DLB Panel release"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/dlb-panel.git
git push -u origin main
```

6. اگر از آپدیت داخلی پنل استفاده می‌کنی، فایل `dist/zeus.js` باید در ریپو باقی بماند.
