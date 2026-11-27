import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const top = readFileSync(join(here, "top.svg"), "utf8");
const iso = readFileSync(join(here, "iso.svg"), "utf8");

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Gapura Papua — Tahap 2C</title>
<style>body{margin:0;background:#fff;font-family:Consolas,monospace;color:#111}.iso-plate{display:flex;gap:20px;padding:20px;align-items:flex-start;background:#fff}.iso-plate>div{flex:0 0 auto}</style></head>
<body><div class="iso-plate"><div>${top}</div><div>${iso}</div></div></body></html>`;
writeFileSync(join(here, "top-iso.html"), html);
console.log("wrote top-iso.html");
