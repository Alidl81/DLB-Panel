import { readFile, writeFile, mkdir, copyFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const cfgPath = path.join(root, "dlb-panel.config.json");
const config = JSON.parse(await readFile(cfgPath, "utf8"));

const OUT_DIR = path.join(root, "dist");
const UPSTREAM_DIR = path.join(root, "upstream");
await mkdir(OUT_DIR, { recursive: true });
await mkdir(UPSTREAM_DIR, { recursive: true });

const ORIGINAL_WS_PATH = "In_Panel_Rayeghan_Ast_Va_Gheyre_Ghabele_Foroosh";
const encodedOriginalPath = encodeURIComponent("/" + ORIGINAL_WS_PATH);
const encodedNewPath = encodeURIComponent("/" + config.websocketPath);

function assertConfig() {
  const required = ["brandName", "ownerName", "telegramUsername", "workerPrefix", "dbPrefix", "websocketPath"];
  for (const key of required) {
    if (!config[key] || typeof config[key] !== "string") {
      throw new Error(`Missing required config key: ${key}`);
    }
  }
  if (config.telegramUsername.startsWith("@")) {
    config.telegramUsername = config.telegramUsername.slice(1);
  }
}

async function fetchOrRead(name, url) {
  const local = path.join(UPSTREAM_DIR, name);
  if (existsSync(local)) {
    return await readFile(local, "utf8");
  }
  const res = await fetch(url, { headers: { "Cache-Control": "no-cache" } });
  if (!res.ok) {
    throw new Error(`Cannot fetch ${name} from upstream. Put it manually at upstream/${name}. HTTP ${res.status}`);
  }
  const text = await res.text();
  await writeFile(local, text, "utf8");
  return text;
}

function replaceAllLiteral(input, from, to) {
  return input.split(from).join(to);
}

function basicBranding(code) {
  let out = code;

const rawGithubPanel = `https://raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/refs/heads/main/dist/zeus.js`;
const rawGithubPanelAlt = `https://raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/dist/zeus.js`;

  const replacements = [
    ["ZEUS Panel", config.brandName],
    ["Zeus Panel", config.brandName],
    ["zeus panel", config.brandName.toLowerCase()],
    ["Zeus Auto Deployer", `${config.brandName} Auto Deployer`],
    ["پنل زئوس", `پنل ${config.brandName}`],
    ["زئوس", config.brandName],
    ["IR_NETLIFY@", `${config.telegramUsername}@`],
    ["@IR_NETLIFY", `@${config.telegramUsername}`],
    ["IR_NETLIFY", config.telegramUsername],
    ["IR-NETLIFY/zeus", `${config.githubOwner}/${config.githubRepo}`],
    ["https://t.me/IR_NETLIFY", `https://t.me/${config.telegramUsername}`],
    ["https://donatonion.ir-netlify.workers.dev", `https://t.me/${config.telegramUsername}`],
    ["https://zeus-panel.ir-netlify.workers.dev/", config.deployerUrl.endsWith("/") ? config.deployerUrl : `${config.deployerUrl}/`],
    ["zeus-panel.ir-netlify.workers.dev", config.deployerUrl.replace(/^https?:\/\//, "")],
    ["zeus-panel", config.workerPrefix],
    ["zeus-db", config.dbPrefix],
    ["zeus-", `${config.workerPrefix.replace(/-panel$/, "")}-`],
    [ORIGINAL_WS_PATH, config.websocketPath],
    [encodedOriginalPath, encodedNewPath],
    ["Rayeghan", "DLB"],
    ["رایگان", "اختصاصی"],
    ["ساخت اختصاصی پنل", config.brandName],
    ["ساخت رایگان پنل", config.brandName],
    ["روزانه 10 الی 100 گیگ کانفیگ اختصاصی", "نصب و مدیریت اختصاصی کانفیگ‌ها"],
    ["روزانه 10 الی 100 گیگ کانفیگ رایگان", "نصب و مدیریت اختصاصی کانفیگ‌ها"],
    ["این پنل کاملاً اختصاصی است. هرگونه فروش پنل یا کانفیگ‌های آن اوج بی شرفی و بی ناموسی است. لطفاً از این ابزار فقط به صورت شخصی و اختصاصی استفاده کنید.", "استفاده از این پنل تابع شرایط مالک پنل و قوانین سرویس‌دهنده است."],
    ["این پنل کاملاً رایگان است. هرگونه فروش پنل یا کانفیگ‌های آن اوج بی شرفی و بی ناموسی است. لطفاً از این ابزار فقط به صورت شخصی و رایگان استفاده کنید.", "استفاده از این پنل تابع شرایط مالک پنل و قوانین سرویس‌دهنده است."],
    ["این توکن متعلق به صاحب پنل نیست (ای کــثـــکـــش)", "این توکن متعلق به صاحب پنل نیست."],
    ["https://raw.githubusercontent.com/IR-NETLIFY/zeus/refs/heads/main/zeus.js", rawGithubPanel],
    ["https://raw.githubusercontent.com/IR-NETLIFY/zeus/main/zeus.js", rawGithubPanelAlt]
  ];

  for (const [from, to] of replacements) {
    out = replaceAllLiteral(out, from, to);
  }

  return out;
}

function patchPanelSpecific(code) {
  let out = basicBranding(code);
  const purchaseRemark = JSON.stringify(config.purchaseConfigRemark || `برای خرید به تلگرام @${config.telegramUsername} مراجعه کنید`);

  // The original subscription service inserts two promotional configs before user configs.
  // Replace them with one clean owner config containing the requested Telegram ID.
  out = out.replace(
    /const m1 = decodeURIComponent\([^;]+;\s*const m2 = decodeURIComponent\([^;]+;\s*links\.push\(atob\("dmxlc3M6Ly8="\)[\s\S]*?encodeURIComponent\(m1\)\);\s*links\.push\(atob\("dmxlc3M6Ly8="\)[\s\S]*?encodeURIComponent\(m2\)\);/m,
    `const m1 = ${purchaseRemark};\n  links.push(atob("dmxlc3M6Ly8=") + user.uuid + "@0.0.0.0:1?encryption=none&security=none&type=ws&host=" + host + "&path=${encodedNewPath}#" + encodeURIComponent(m1));`
  );

  // Add the Telegram ID to every normal config remark so at least one produced config contains it.
  out = out.replace(
    /const remark = user\.username \+ " \| " \+ ip \+ " \| " \+ portStr;/,
    `const remark = user.username + " | @${config.telegramUsername} | " + ip + " | " + portStr;`
  );

  // Keep the information config branded too.
  out = out.replace(
    /const infoRemark = " remaining \| \\u200E" \+ remVol \+ " \| \\u200E" \+ remTime \+ " \| \\u200E" \+ remReq;/,
    `const infoRemark = "${config.brandName} | remaining | \\u200E" + remVol + " | \\u200E" + remTime + " | \\u200E" + remReq;`
  );

  out = out.replace(
    /# Description: Secure Node Configurations/g,
    `# Description: ${config.brandName} Configurations`
  );

  return out;
}

function patchDeployerSpecific(code) {
  let out = basicBranding(code);

  out = out.replace(/const workerName = `[^`]*\$\{uniqueSuffix\}`;/, `const workerName = \`${config.workerPrefix}-\${uniqueSuffix}\`;`);
  out = out.replace(/const dbName = `[^`]*\$\{uniqueSuffix\}`;/, `const dbName = \`${config.dbPrefix}-\${uniqueSuffix}\`;`);
  out = out.replace(/const newSub = `[^`]*\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 8\)\}`;/, `const newSub = \`dlb-\${Math.random().toString(36).substring(2, 8)}\`;`);
  out = out.replace(/script\.id\.startsWith\("zeus-panel"\)/g, `script.id.startsWith("${config.workerPrefix}")`);
  out = out.replace(/script\.id\.startsWith\("ez-"\)/g, `script.id.startsWith("${config.workerPrefix}")`);

  return out;
}


function replaceOnceOrThrow(input, pattern, replacement, label) {
  const next = input.replace(pattern, replacement);
  if (next === input) {
    throw new Error(`Could not embed panel source in deployer: ${label} pattern not found`);
  }
  return next;
}

function embedPanelSourceIntoDeployer(code, panelCode) {
  let out = code;

  out = replaceOnceOrThrow(
    out,
    /const githubRes = await fetch\("https:\/\/raw\.githubusercontent\.com\/[^"]+\/zeus\.js\?t=" \+ Date\.now\(\)\);\s*if \(!githubRes\.ok\) throw new Error\("خطا در دریافت سورس از گیت‌هاب\."\);\s*const zeusCode = await githubRes\.text\(\);/,
    "const zeusCode = DLB_PANEL_SOURCE;",
    "initial deploy source fetch"
  );

  out = replaceOnceOrThrow(
    out,
    /const githubRes = await fetch\("https:\/\/raw\.githubusercontent\.com\/[^"]+\/zeus\.js\?t=" \+ Date\.now\(\)\);\s*if \(!githubRes\.ok\) throw new Error\("Failed to fetch source from GitHub"\);\s*const newCode = await githubRes\.text\(\);/,
    "const newCode = DLB_PANEL_SOURCE;",
    "update source fetch"
  );

  const latestVersionPattern = /let latestVersion = "Unknown"; try \{ const ghRes = await fetch\("https:\/\/raw\.githubusercontent\.com\/[^"]+\/zeus\.js\?t=" \+ Date\.now\(\)\); if \(ghRes\.ok\) \{ const ghText = await ghRes\.text\(\); const match = ghText\.match\(\/CURRENT_VERSION\\s\*\=\\s\*\['"\]\(\[0-9\\\.\]\+\)\['"\]\/i\); if \(match && match\[1\]\) latestVersion = "v" \+ match\[1\]; \} \} catch \(e\) \{\}/;
  out = out.replace(
    latestVersionPattern,
    `let latestVersion = "Unknown"; try { const ghText = DLB_PANEL_SOURCE; const match = ghText.match(/CURRENT_VERSION\\s*=\\s*['"]([0-9\\.]+)['"]/i); if (match && match[1]) latestVersion = "v" + match[1]; } catch (e) {}`
  );

  return `const DLB_PANEL_SOURCE = ${JSON.stringify(panelCode)};\n${out}`;
}

function assertNoPanelForbidden(text, filename) {
  const forbidden = [
    "رایگان",
    "IR_NETLIFY",
    "@IR_NETLIFY",
    "ساخت رایگان",
    "In_Panel_Rayeghan_Ast_Va_Gheyre_Ghabele_Foroosh",
    "Gheyre_Ghabele_Foroosh"
  ];
  const found = forbidden.filter((item) => text.includes(item));
  if (found.length) {
    throw new Error(`${filename} still contains forbidden terms: ${found.join(", ")}`);
  }
}

assertConfig();

const panelSource = await fetchOrRead("zeus.js", config.upstream.panel);
const deployerSource = await fetchOrRead("zeus deployer.js", config.upstream.deployer);

const panelOut = patchPanelSpecific(panelSource);
let deployerOut = patchDeployerSpecific(deployerSource);
deployerOut = embedPanelSourceIntoDeployer(deployerOut, panelOut);

assertNoPanelForbidden(panelOut, "zeus.js");
assertNoPanelForbidden(deployerOut, "dlb-deployer.js");

await writeFile(path.join(OUT_DIR, "zeus.js"), panelOut, "utf8");
await writeFile(path.join(OUT_DIR, "dlb-deployer.js"), deployerOut, "utf8");

try {
  const ips = await fetchOrRead("ips.txt", config.upstream.ips);
  await writeFile(path.join(OUT_DIR, "ips.txt"), ips, "utf8");
} catch (e) {
  console.warn("ips.txt was not fetched. You can add it later if needed.");
}

await copyFile(path.join(root, "wrangler.toml.example"), path.join(OUT_DIR, "wrangler.toml.example"));

console.log("DLB Panel build completed:");
console.log("- dist/zeus.js");
console.log("- dist/dlb-deployer.js");
console.log("- dist/wrangler.toml.example");
console.log(`Brand: ${config.brandName}`);
console.log(`Telegram in generated config remarks: @${config.telegramUsername}`);
