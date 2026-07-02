# DLB Panel Cloudflare Notes

- Main Worker file: `dlbpanel.js`
- Optional deployer Worker file: `dlbpanel-deployer.js`
- Required runtime binding: `DB` as Cloudflare D1
- Optional secrets for in-panel updater: `CF_API_TOKEN`, `CF_ACCOUNT_ID`
- Clean IP update source: `https://raw.githubusercontent.com/IR-NETLIFY/zeus/refs/heads/main/ips.txt`

For a GitHub-connected Cloudflare Worker, set the deploy command to:

```bash
npm install && npm run deploy
```

If Cloudflare already handles install automatically, the deploy command can be:

```bash
npm run deploy
```
