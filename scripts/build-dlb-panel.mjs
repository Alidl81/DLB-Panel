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
  const required = ["brandName", "ownerName", "telegramUsername", "workerPrefix", "dbPrefix", "websocketPath", "githubOwner", "githubRepo"];
  for (const key of required) {
    if (!config[key] || typeof config[key] !== "string") {
      throw new Error(`Missing required config key: ${key}`);
    }
  }
  if (config.telegramUsername.startsWith("@")) {
    config.telegramUsername = config.telegramUsername.slice(1);
  }
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/i.test(config.workerPrefix)) {
    throw new Error("workerPrefix must be a valid Cloudflare Worker name prefix");
  }
  if (!/^[a-z0-9][a-z0-9-]{1,62}$/i.test(config.dbPrefix)) {
    throw new Error("dbPrefix must be a valid D1 database name prefix");
  }
  if (!/^[A-Za-z0-9_/-]+$/.test(config.websocketPath)) {
    throw new Error("websocketPath should only contain letters, numbers, underscore, dash, or slash");
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

function githubRawUrl(file, refStyle = "refs") {
  const branchPart = refStyle === "refs" ? "refs/heads/main" : "main";
  return `https://raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/${branchPart}/dist/${file}`;
}

function basicBranding(code) {
  let out = code;

  const rawGithubPanel = githubRawUrl("zeus.js", "refs");
  const rawGithubPanelAlt = githubRawUrl("zeus.js", "main");
  const rawGithubIps = githubRawUrl("ips.txt", "refs");
  const rawGithubIpsAlt = githubRawUrl("ips.txt", "main");

  // Keep full raw URLs before the generic owner/repo replacement. Otherwise
  // the deployer tries to fetch /zeus.js from repository root and fails on Cloudflare.
  const replacements = [
    ["https://raw.githubusercontent.com/IR-NETLIFY/zeus/refs/heads/main/zeus.js", rawGithubPanel],
    ["https://raw.githubusercontent.com/IR-NETLIFY/zeus/main/zeus.js", rawGithubPanelAlt],
    ["https://raw.githubusercontent.com/IR-NETLIFY/zeus/refs/heads/main/ips.txt", rawGithubIps],
    ["https://raw.githubusercontent.com/IR-NETLIFY/zeus/main/ips.txt", rawGithubIpsAlt],
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
    ["این توکن متعلق به صاحب پنل نیست (ای کــثـــکـــش)", "این توکن متعلق به صاحب پنل نیست."]
  ];

  for (const [from, to] of replacements) {
    out = replaceAllLiteral(out, from, to);
  }

  return out;
}

function patchPanelSpecific(code, ipsText = "") {
  let out = basicBranding(code);
  const purchaseRemark = JSON.stringify(config.purchaseConfigRemark || `برای خرید به تلگرام @${config.telegramUsername} مراجعه کنید`);

  const panelRuntimeHelper = `const DLB_BUNDLED_IPS_TEXT = ${JSON.stringify(ipsText || "")};
async function fetchCurrentWorkerSourceFromCloudflare(accountId, token, scriptName) {
	const res = await fetch(\`https://api.cloudflare.com/client/v4/accounts/\${accountId}/workers/scripts/\${scriptName}/content\`, {
		headers: { Authorization: "Bearer " + token },
	});
	if (!res.ok) {
		throw new Error("خطا در دریافت سورس فعلی از Cloudflare");
	}
	return await res.text();
}
`;
  out = out.replace(
    'import { connect } from "cloudflare:sockets";',
    'import { connect } from "cloudflare:sockets";\n' + panelRuntimeHelper
  );

  out = out.replace(
    'const url = new URL(request.url);\r\n\t\tif (Router.isWebSocketUpgrade(request)',
    'const url = new URL(request.url);\r\n\t\tif (url.pathname === "/dlb/ips.txt" || url.pathname === "/ips.txt") {\r\n\t\t\treturn new Response(DLB_BUNDLED_IPS_TEXT, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });\r\n\t\t}\r\n\t\tif (Router.isWebSocketUpgrade(request)'
  );

  // Remove runtime GitHub dependency from the generated panel. Update/restart
  // now redeploy the currently running worker source from Cloudflare itself.
  out = out.replace(
    /\s*const githubRes = await fetch\([\s\S]*?githubRes\.text\(\);\s*\r?\n\s*const scriptName = env\.WORKER_NAME \|\| url\.hostname\.split\("\."\)\[0\];/gm,
    '\n\t\t\t\tconst scriptName = env.WORKER_NAME || url.hostname.split(".")[0];\n\t\t\t\tconst newCode = await fetchCurrentWorkerSourceFromCloudflare(currentAccountId, currentToken, scriptName);'
  );

  out = out.replace(
    /const res = await fetch\('https:\/\/raw\.githubusercontent\.com\/[\s\S]*?const latestVersion = match \? match\[1\] : null;/m,
    'const latestVersion = CURRENT_VERSION;'
  );
  out = out.replace(/https:\/\/raw\.githubusercontent\.com\/[^'\"]+\/ips\.txt/g, '/dlb/ips.txt');
  out = out.replace(/خطا در بررسی آپدیت از گیت هاب/g, 'بررسی آپدیت خارجی در این نسخه غیرفعال است');
  out = out.replace(/خطا در دریافت سورس جدید از گیت‌هاب/g, 'خطا در دریافت سورس فعلی از Cloudflare');
  out = out.replace(/خطا در دریافت سورس از گیت‌هاب/g, 'خطا در دریافت سورس فعلی از Cloudflare');

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

function patchDeployerSpecific(code, panelOut) {
  let out = basicBranding(code);

  out = out.replace(/const workerName = `[^`]*\$\{uniqueSuffix\}`;/, `const workerName = \`${config.workerPrefix}-\${uniqueSuffix}\`;`);
  out = out.replace(/const dbName = `[^`]*\$\{uniqueSuffix\}`;/, `const dbName = \`${config.dbPrefix}-\${uniqueSuffix}\`;`);
  out = out.replace(/const newSub = `[^`]*\$\{Math\.random\(\)\.toString\(36\)\.substring\(2, 8\)\}`;/, `const newSub = \`dlb-\${Math.random().toString(36).substring(2, 8)}\`;`);
  out = out.replace(/script\.id\.startsWith\("zeus-panel"\)/g, `script.id.startsWith("${config.workerPrefix}")`);
  out = out.replace(/\s*\|\|\s*script\.id\.startsWith\("ez-"\)/g, "");

  // Runtime GitHub fetches were the cause of the Cloudflare error when dist/zeus.js
  // was not present at repository root. Bundle the generated panel source directly
  // into the deployer so install and update work even if GitHub raw is unavailable.
  const helper = `const BUNDLED_DLB_PANEL_SOURCE = ${JSON.stringify(panelOut)};\nfunction getBundledPanelSource(request) {\n\tlet source = BUNDLED_DLB_PANEL_SOURCE;\n\tif (request) {\n\t\tconst origin = new URL(request.url).origin;\n\t\tsource = source.split("https://YOUR_DEPLOYER_WORKER.workers.dev").join(origin);\n\t}\n\treturn source;\n}\nfunction getBundledPanelVersion() {\n\tconst match = BUNDLED_DLB_PANEL_SOURCE.match(/CURRENT_VERSION\\s*=\\s*['\"]([^'\"]+)['\"]/i);\n\treturn match && match[1] ? "v" + match[1] : "Unknown";\n}\n\n`;
  out = out.replace(/^export default\s*\{/, helper + "export default {");

  out = out.replace(
    /const githubRes = await fetch\([^;]+;\s*if \(!githubRes\.ok\) throw new Error\("خطا در دریافت سورس از گیت‌هاب\."\);\s*const zeusCode = await githubRes\.text\(\);/m,
    "const zeusCode = getBundledPanelSource(request);"
  );

  out = out.replace(
    /let latestVersion = "Unknown";\s*try \{\s*const ghRes = await fetch\([\s\S]*?\}\s*catch \(e\) \{\}/m,
    "let latestVersion = getBundledPanelVersion();"
  );

  out = out.replace(
    /const githubRes = await fetch\([^;]+;\s*if \(!githubRes\.ok\) throw new Error\("Failed to fetch source from GitHub"\);\s*const newCode = await githubRes\.text\(\);/m,
    "const newCode = getBundledPanelSource(request);"
  );

  return out;
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

function assertRawUrls(text, filename) {
  const wrongRuntimeItems = [
    "raw.githubusercontent.com",
    "خطا در دریافت سورس از گیت‌هاب",
    "خطا در دریافت سورس جدید از گیت‌هاب",
    "Failed to fetch source from GitHub",
    `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/refs/heads/main/zeus.js`,
    `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/zeus.js`,
    `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/refs/heads/main/ips.txt`,
    `raw.githubusercontent.com/${config.githubOwner}/${config.githubRepo}/main/ips.txt`
  ];
  const found = wrongRuntimeItems.filter((item) => text.includes(item));
  if (found.length) {
    throw new Error(`${filename} still has GitHub-runtime dependency or GitHub source error text: ${found.join(", ")}`);
  }
}

assertConfig();

const panelSource = await fetchOrRead("zeus.js", config.upstream.panel);
const deployerSource = await fetchOrRead("zeus deployer.js", config.upstream.deployer);
let ips = "";
try {
  ips = await fetchOrRead("ips.txt", config.upstream.ips);
} catch (e) {
  console.warn("ips.txt was not fetched. You can add it later if needed.");
}

const panelOut = patchPanelSpecific(panelSource, ips);
const deployerOut = patchDeployerSpecific(deployerSource, panelOut);

assertNoPanelForbidden(panelOut, "zeus.js");
assertNoPanelForbidden(deployerOut, "dlb-deployer.js");
assertRawUrls(panelOut, "zeus.js");
assertRawUrls(deployerOut, "dlb-deployer.js");

await writeFile(path.join(OUT_DIR, "zeus.js"), panelOut, "utf8");
await writeFile(path.join(OUT_DIR, "dlb-deployer.js"), deployerOut, "utf8");
if (ips) {
  await writeFile(path.join(OUT_DIR, "ips.txt"), ips, "utf8");
}

await copyFile(path.join(root, "wrangler.toml.example"), path.join(OUT_DIR, "wrangler.toml.example"));

console.log("DLB Panel build completed:");
console.log("- dist/zeus.js");
console.log("- dist/dlb-deployer.js");
console.log("- dist/ips.txt");
console.log("- dist/wrangler.toml.example");
console.log(`Brand: ${config.brandName}`);
console.log(`Telegram in generated config remarks: @${config.telegramUsername}`);
