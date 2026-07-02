import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const config = JSON.parse(await readFile(path.join(root, "dlb-panel.config.json"), "utf8"));
const files = [
  path.join(root, "dist", "zeus.js"),
  path.join(root, "dist", "dlb-deployer.js")
];

const forbidden = [
  "رایگان",
  "IR_NETLIFY",
  "@IR_NETLIFY",
  "ساخت رایگان",
  "In_Panel_Rayeghan_Ast_Va_Gheyre_Ghabele_Foroosh",
  "Gheyre_Ghabele_Foroosh"
];

const wrongRootRawUrls = [
  "raw.githubusercontent.com",
  "خطا در دریافت سورس از گیت‌هاب",
  "خطا در دریافت سورس جدید از گیت‌هاب",
  "Failed to fetch source from GitHub",
  `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/refs/heads/main/zeus.js`,
  `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/zeus.js`,
  `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/refs/heads/main/ips.txt`,
  `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/ips.txt`
];

let failed = false;
for (const file of files) {
  const text = await readFile(file, "utf8");
  const foundForbidden = forbidden.filter((item) => text.includes(item));
  const foundWrongUrls = wrongRootRawUrls.filter((item) => text.includes(item));
  if (foundForbidden.length || foundWrongUrls.length) {
    failed = true;
    if (foundForbidden.length) console.error(`${path.basename(file)} contains forbidden terms: ${foundForbidden.join(", ")}`);
    if (foundWrongUrls.length) console.error(`${path.basename(file)} contains GitHub-runtime dependency or GitHub source error text: ${foundWrongUrls.join(", ")}`);
  } else {
    console.log(`${path.basename(file)}: OK`);
  }
}

if (failed) process.exit(1);
