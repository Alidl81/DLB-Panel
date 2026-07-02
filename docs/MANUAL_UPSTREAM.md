# اگر دریافت خودکار سورس انجام نشد

اگر به هر دلیل اینترنت یا GitHub روی سیستم شما در زمان build در دسترس نبود، فایل‌های مبنا را به صورت دستی داخل پوشه `upstream` قرار بده:

```txt
upstream/zeus.js
upstream/zeus deployer.js
upstream/ips.txt
```

بعد دوباره اجرا کن:

```bash
npm run prepare:github
```
