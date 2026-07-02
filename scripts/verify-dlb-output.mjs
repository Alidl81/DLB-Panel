import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
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

let failed = false;
for (const file of files) {
  const text = await readFile(file, "utf8");
  const found = forbidden.filter((item) => text.includes(item));
  if (found.length) {
    failed = true;
    console.error(`${path.basename(file)} contains forbidden terms: ${found.join(", ")}`);
  } else {
    console.log(`${path.basename(file)}: OK`);
  }
}

if (failed) process.exit(1);
