import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const read = (rel) => readFileSync(join(HERE, rel), "utf8");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function inlineMd(text) {
  let out = esc(text);
  out = out.replace(/`([^`]+)`/g, "<code>$1</code>");
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return out;
}

function mdToHtml(md) {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (/^```/.test(line)) {
      const code = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) {
        code.push(esc(lines[i]));
        i++;
      }
      i++;
      out.push(`<pre><code>${code.join("\n")}</code></pre>`);
      continue;
    }

    if (/^---+$/.test(line.trim())) {
      out.push("<hr>");
      i++;
      continue;
    }

    const h = line.match(/^(#{1,4})\s+(.+)$/);
    if (h) {
      const lvl = h[1].length;
      out.push(`<h${lvl}>${inlineMd(h[2])}</h${lvl}>`);
      i++;
      continue;
    }

    if (line.trim().startsWith("|") && i + 1 < lines.length && /^\|[\s:|-]+\|?$/.test(lines[i + 1].trim())) {
      const parseRow = (row) => row.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((c) => c.trim());
      const headers = parseRow(line);
      const aligns = parseRow(lines[i + 1]).map((c) => (c.endsWith(":") && c.startsWith(":") ? "center" : c.endsWith(":") ? "right" : "left"));
      i += 2;
      const rows = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        rows.push(parseRow(lines[i]));
        i++;
      }
      out.push(`<div class="table-wrap"><table><thead><tr>${headers.map((c, idx) => `<th style="text-align:${aligns[idx] || "left"}">${inlineMd(c)}</th>`).join("")}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, idx) => `<td style="text-align:${aligns[idx] || "left"}">${inlineMd(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`);
      continue;
    }

    if (/^\s*-\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        const raw = lines[i].replace(/^\s*-\s+/, "");
        const chk = raw.match(/^\[( |x|X)\]\s+(.+)$/);
        if (chk) {
          const checked = chk[1].toLowerCase() === "x" ? " checked" : "";
          items.push(`<li class="chk-item"><label><input type="checkbox"${checked}> <span>${inlineMd(chk[2])}</span></label></li>`);
        } else {
          items.push(`<li>${inlineMd(raw)}</li>`);
        }
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }

    if (/^\s*\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${inlineMd(lines[i].replace(/^\s*\d+\.\s+/, ""))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }

    if (!line.trim()) {
      i++;
      continue;
    }

    const para = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^```/.test(lines[i]) &&
      !/^#{1,4}\s+/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim()) &&
      !lines[i].trim().startsWith("|") &&
      !/^\s*-\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i].trim());
      i++;
    }
    out.push(`<p>${inlineMd(para.join(" "))}</p>`);
  }

  return out.join("\n");
}

function parseCsv(text) {
  const lines = text.replace(/\r\n/g, "\n").trim().split("\n");
  return lines.map((l) => l.split(",").map((c) => c.trim()));
}

const coordsRows = parseCsv(read("docs/02-geometri/coordinates.csv"));
const strukturHtml = mdToHtml(read("docs/03-struktur/laporan-struktur.md"));
const rakitHtml = mdToHtml(read("docs/04-rakit/urutan-rakit.md"));

const coordHeaders = coordsRows[0];
const coordBody = coordsRows.slice(1);

const DRAWINGS = [
  {
    group: "geometri",
    title: "C + D · Rencana & Perspektif Isometrik (Revisi 3)",
    desc: "Gabungan Tampak Atas dan Perspektif Isometrik lengkap dengan box pemberat 2×300 kg dan banner x = ±1.500…±2.100.",
    img: "docs/02-geometri/top-iso-rev3-final.png",
    html: "docs/02-geometri/top-iso.html",
    tag: "Revisi 3",
  },
  {
    group: "geometri",
    title: "D · Perspektif Isometrik (Azimut 60°)",
    desc: "Pandangan isometrik 3D skematik untuk posisi balok, pilar, lengkung, burung, banner, runner, dan celah 0,15 m ke tenda.",
    img: "docs/02-geometri/iso.png",
    html: "docs/02-geometri/iso.html",
    svg: "docs/02-geometri/iso.svg",
    tag: "Revisi 3",
  },
  {
    group: "geometri",
    title: "A + B · Tampak Depan & Tampak Samping",
    desc: "Elevasi depan (bentang 3,6 m, tinggi 3,4 m, bukaan 2,0 m) dan potongan samping Y-Z di depan tenda 3×3 m.",
    img: "docs/02-geometri/front-side.png",
    html: "docs/02-geometri/front-side.html",
    svg: "docs/02-geometri/front.svg",
    tag: "Tahap 2",
  },
  {
    group: "geometri",
    title: "C · Tampak Atas (Rencana X-Y)",
    desc: "Tata letak denah gapura, zona bebas tetangga ≥ 0,70 m, runner, box pemberat, dan jarak aman 0,15 m ke tenda.",
    img: "docs/02-geometri/top.png",
    html: "docs/02-geometri/top.html",
    svg: "docs/02-geometri/top.svg",
    tag: "Revisi 3",
  },
];

const FILES_INDEX = [
  { cat: "05 · Interaktif (Anatomy)", name: "Simulasi Stabilitas & Rakit (Terang)", path: "docs/05-interaktif/stand-light.html", type: "HTML" },
  { cat: "05 · Interaktif (Anatomy)", name: "Simulasi Stabilitas & Rakit (Gelap)", path: "docs/05-interaktif/stand.html", type: "HTML" },
  { cat: "05 · Interaktif (Anatomy)", name: "Script Builder Anatomy", path: "docs/05-interaktif/build-stand.mjs", type: "MJS" },
  { cat: "02 · Geometri", name: "Lembar Gabungan Tampak Atas + Isometrik", path: "docs/02-geometri/top-iso.html", type: "HTML" },
  { cat: "02 · Geometri", name: "Perspektif Isometrik", path: "docs/02-geometri/iso.html", type: "HTML" },
  { cat: "02 · Geometri", name: "Tampak Depan & Samping", path: "docs/02-geometri/front-side.html", type: "HTML" },
  { cat: "02 · Geometri", name: "Tampak Atas (Rencana)", path: "docs/02-geometri/top.html", type: "HTML" },
  { cat: "02 · Geometri", name: "Tabel Koordinat Geometri", path: "docs/02-geometri/coordinates.csv", type: "CSV" },
  { cat: "03 · Struktur", name: "Detail Sambungan 1 (Pilar, Balok, Tiang Burung)", path: "docs/03-struktur/detail-1.html", type: "HTML" },
  { cat: "03 · Struktur", name: "Detail Sambungan 2 (Banner, Pemberat, Lengkung)", path: "docs/03-struktur/detail-2.html", type: "HTML" },
  { cat: "03 · Struktur", name: "Laporan Perhitungan Struktur", path: "docs/03-struktur/laporan-struktur.md", type: "MD" },
  { cat: "04 · Rakit", name: "Diagram Urutan Rakit 8 Langkah", path: "docs/04-rakit/urutan-rakit.html", type: "HTML" },
  { cat: "04 · Rakit", name: "Panduan Rakit & Cutting List", path: "docs/04-rakit/urutan-rakit.md", type: "MD" },
];

const html = `<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Gapura Papua STMKG — Pusat Akses Visualisasi &amp; Dokumen</title>
<style>
:root {
  --bg: #f2f2ef;
  --card: #fbfbfa;
  --surface: #ffffff;
  --border: #d8d8d4;
  --border-strong: #b4b4b0;
  --ink: #18181a;
  --text: #3f3f44;
  --muted: #71717a;
  --accent: #b06a3b;
  --accent-soft: #f7efe6;
  --blue: #2563eb;
  --green: #15803d;
  --mono: ui-monospace, "SF Mono", Menlo, Consolas, monospace;
  --sans: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  --shadow: 0 1px 2px rgba(0,0,0,.04), 0 8px 24px rgba(0,0,0,.04);
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--bg); color: var(--text); font: 14px/1.6 var(--sans); -webkit-font-smoothing: antialiased; }
a { color: var(--blue); text-decoration: none; }
a:hover { text-decoration: underline; }
code { font-family: var(--mono); font-size: .88em; background: #ecece8; padding: 1px 5px; border-radius: 3px; color: var(--ink); }
pre { background: #18181a; color: #f4f4f1; padding: 14px 16px; border-radius: 4px; overflow-x: auto; font: 12.5px/1.55 var(--mono); }
pre code { background: none; padding: 0; color: inherit; }

.topbar {
  background: var(--card);
  border-bottom: 1px solid var(--border);
}
.topbar-inner {
  max-width: 1240px;
  margin: 0 auto;
  padding: 14px 20px 0;
}
.head-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
  padding-bottom: 12px;
}
.brand-kicker {
  font: 11px/1 var(--mono);
  letter-spacing: .08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 5px;
}
h1.site-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: var(--ink);
  letter-spacing: -.01em;
}
.spec-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.pill {
  font: 11.5px/1.2 var(--mono);
  padding: 5px 9px;
  background: var(--surface);
  border: 1px solid var(--border);
  color: var(--text);
}
.pill strong { color: var(--ink); }
.pill.ok { border-color: #bbf7d0; background: #f0fdf4; color: var(--green); }

.tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 6px;
}
.tab-btn {
  appearance: none;
  border: 1px solid transparent;
  border-bottom: none;
  background: transparent;
  color: var(--muted);
  font: 600 13px/1 var(--sans);
  padding: 10px 14px;
  cursor: pointer;
  white-space: nowrap;
  border-radius: 4px 4px 0 0;
  transition: color .15s, background .15s;
}
.tab-btn:hover { color: var(--ink); background: rgba(0,0,0,.03); }
.tab-btn[aria-selected="true"] {
  background: var(--bg);
  color: var(--ink);
  border-color: var(--border);
  box-shadow: inset 0 2px 0 var(--accent);
}

.main {
  max-width: 1240px;
  margin: 0 auto;
  padding: 22px 20px 64px;
}
.panel { display: none; }
.panel.active { display: block; }

.section-bar {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  margin-bottom: 14px;
}
.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 700;
  color: var(--ink);
}
.btn-row { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; }
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 12px;
  font: 600 12px/1 var(--mono);
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--border-strong);
  cursor: pointer;
  text-decoration: none;
}
.btn:hover { background: #f4f4f0; text-decoration: none; }
.btn.active { background: var(--ink); color: #fff; border-color: var(--ink); }

.frame-card {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 10px;
}
.sim-frame {
  width: 100%;
  height: 740px;
  border: 0;
  display: block;
  background: #f2f2ef;
}
@media (max-width: 720px) {
  .sim-frame { height: 660px; }
}

.hint-strip {
  margin-top: 12px;
  padding: 11px 14px;
  background: var(--card);
  border: 1px solid var(--border);
  font: 12.5px/1.5 var(--mono);
  color: var(--text);
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
}

.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(460px, 1fr));
  gap: 18px;
}
@media (max-width: 560px) {
  .grid-2 { grid-template-columns: 1fr; }
}
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  display: flex;
  flex-direction: column;
}
.card-head {
  padding: 14px 16px 10px;
  border-bottom: 1px solid #ecece8;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 10px;
}
.card-title { margin: 0; font-size: 14.5px; font-weight: 700; color: var(--ink); }
.card-desc { margin: 4px 0 0; font-size: 12.5px; color: var(--muted); }
.badge {
  flex: none;
  font: 11px/1 var(--mono);
  padding: 4px 7px;
  background: var(--accent-soft);
  color: var(--accent);
  border: 1px solid #e6cdb7;
}
.card-media {
  background: #fff;
  padding: 10px;
  cursor: zoom-in;
  border-bottom: 1px solid #ecece8;
}
.card-media img {
  display: block;
  width: 100%;
  height: auto;
  max-height: 460px;
  object-fit: contain;
}
.card-foot {
  padding: 10px 16px;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: space-between;
  align-items: center;
  background: var(--card);
}
.link-group { display: flex; flex-wrap: wrap; gap: 12px; font: 12px/1 var(--mono); }

.doc-box {
  margin-top: 22px;
  background: var(--surface);
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
  padding: 24px 28px;
}
@media (max-width: 640px) {
  .doc-box { padding: 16px; }
}
.doc-box h1 { font-size: 20px; margin: 0 0 8px; color: var(--ink); }
.doc-box h2 { font-size: 16px; margin: 24px 0 10px; padding-top: 14px; border-top: 1px solid #ecece8; color: var(--ink); }
.doc-box h3 { font-size: 14px; margin: 18px 0 8px; color: var(--ink); }
.doc-box hr { border: 0; border-top: 1px solid #ecece8; margin: 18px 0; }
.doc-box ul, .doc-box ol { padding-left: 22px; }
.doc-box li { margin: 4px 0; }
.doc-box li.chk-item { list-style: none; margin-left: -18px; }
.doc-box li.chk-item label { cursor: pointer; display: inline-flex; align-items: flex-start; gap: 8px; }
.doc-box li.chk-item input { margin-top: 4px; }

.table-wrap { overflow-x: auto; margin: 12px 0; }
table { width: 100%; border-collapse: collapse; font-size: 13px; }
th, td { border: 1px solid #e4e4e0; padding: 7px 10px; }
th { background: #f6f6f3; color: var(--ink); font-weight: 600; }
tr:nth-child(even) td { background: #fcfcfa; }

.search-input {
  padding: 7px 11px;
  font: 12.5px/1.2 var(--mono);
  border: 1px solid var(--border-strong);
  background: var(--surface);
  color: var(--ink);
  min-width: 240px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(18, 18, 20, .86);
  display: none;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 100;
}
.modal.open { display: flex; }
.modal-inner {
  background: #fff;
  max-width: 96vw;
  max-height: 94vh;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border);
}
.modal-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 14px;
  background: var(--card);
  border-bottom: 1px solid var(--border);
  font: 12.5px/1 var(--mono);
  color: var(--ink);
}
.modal-body {
  overflow: auto;
  padding: 12px;
  background: #fff;
}
.modal-body img {
  display: block;
  max-width: 100%;
  height: auto;
}
</style>
</head>
<body>
<header class="topbar">
  <div class="topbar-inner">
    <div class="head-row">
      <div>
        <div class="brand-kicker">Gapura Papua STMKG · Revisi 3 · Freestanding di Depan Tenda 3×3 m</div>
        <h1 class="site-title">Pusat Akses Visualisasi &amp; Dokumen Teknik STAND</h1>
      </div>
      <div class="spec-pills">
        <span class="pill"><strong>4.400 × 3.400</strong> mm</span>
        <span class="pill">Bukaan <strong>2.000 / 2.200</strong> mm</span>
        <span class="pill">Pemberat <strong>2×300 kg</strong></span>
        <span class="pill ok">FOS min <strong>1.60</strong> @ 20 m/s</span>
      </div>
    </div>
    <nav class="tabs" role="tablist" aria-label="Navigasi dokumen Gapura Papua STMKG">
      <button class="tab-btn" role="tab" aria-selected="true" data-tab="interaktif">1. Simulasi Interaktif</button>
      <button class="tab-btn" role="tab" aria-selected="false" data-tab="geometri">2. Geometri &amp; Koordinat</button>
      <button class="tab-btn" role="tab" aria-selected="false" data-tab="struktur">3. Struktur &amp; Sambungan</button>
      <button class="tab-btn" role="tab" aria-selected="false" data-tab="rakit">4. Urutan Rakit &amp; Cutting List</button>
      <button class="tab-btn" role="tab" aria-selected="false" data-tab="berkas">5. Semua Berkas</button>
    </nav>
  </div>
</header>

<main class="main">
  <!-- TAB 1: INTERAKTIF -->
  <section id="tab-interaktif" class="panel active">
    <div class="section-bar">
      <h2 class="section-title">Simulasi Stabilitas &amp; Rakitan Interaktif (Anatomy Kit)</h2>
      <div class="btn-row">
        <button class="btn active" id="btn-theme-light" type="button">Tema Terang</button>
        <button class="btn" id="btn-theme-dark" type="button">Tema Gelap</button>
        <a class="btn" id="btn-open-sim" href="docs/05-interaktif/stand-light.html" target="_blank" rel="noopener">Buka Penuh ↗</a>
      </div>
    </div>
    <div class="frame-card">
      <iframe id="sim-iframe" class="sim-frame" src="docs/05-interaktif/stand-light.html" title="Simulasi interaktif Gapura Papua STMKG"></iframe>
    </div>
    <div class="hint-strip">
      <span><strong>Pointer / ← →</strong> : ubah kecepatan angin (0–25 m/s)</span>
      <span><strong>Klik / B</strong> : ganti pemberat (0 / 300 / 600 / 700 kg)</span>
      <span><strong>Spasi / E</strong> : buka/tutup mode rakit (exploded view)</span>
    </div>
  </section>

  <!-- TAB 2: GEOMETRI -->
  <section id="tab-geometri" class="panel">
    <div class="section-bar">
      <h2 class="section-title">Gambar Geometri &amp; Tampak (Tahap 2 + Revisi 3)</h2>
      <div class="btn-row">
        <a class="btn" href="docs/02-geometri/top-iso.html" target="_blank" rel="noopener">Buka Lembar Gabungan ↗</a>
        <a class="btn" href="docs/02-geometri/coordinates.csv" target="_blank" rel="noopener">Unduh coordinates.csv</a>
      </div>
    </div>
    <div class="grid-2">
      ${DRAWINGS.map((d) => `
      <article class="card">
        <div class="card-head">
          <div>
            <h3 class="card-title">${esc(d.title)}</h3>
            <p class="card-desc">${esc(d.desc)}</p>
          </div>
          <span class="badge">${esc(d.tag)}</span>
        </div>
        <div class="card-media" data-zoom="${esc(d.img)}" data-title="${esc(d.title)}" data-link="${esc(d.html)}">
          <img src="${esc(d.img)}" alt="${esc(d.title)}" loading="lazy">
        </div>
        <div class="card-foot">
          <div class="link-group">
            <a href="${esc(d.html)}" target="_blank" rel="noopener">Buka HTML ↗</a>
            ${d.svg ? `<a href="${esc(d.svg)}" target="_blank" rel="noopener">SVG ↗</a>` : ""}
            <a href="${esc(d.img)}" target="_blank" rel="noopener">PNG ↗</a>
          </div>
          <button class="btn" type="button" data-zoom="${esc(d.img)}" data-title="${esc(d.title)}" data-link="${esc(d.html)}">Perbesar</button>
        </div>
      </article>`).join("")}
    </div>

    <div class="doc-box">
      <div class="section-bar">
        <h2 style="margin:0;padding:0;border:0">Tabel Koordinat 3D (<code>docs/02-geometri/coordinates.csv</code>)</h2>
        <input id="coord-filter" class="search-input" type="search" placeholder="Filter elemen / deskripsi / label...">
      </div>
      <div class="table-wrap">
        <table id="coord-table">
          <thead><tr>${coordHeaders.map((h) => `<th>${esc(h)}</th>`).join("")}</tr></thead>
          <tbody>
            ${coordBody.map((r) => `<tr>${r.map((c, idx) => `<td${idx >= 3 && idx <= 5 ? ' style="text-align:right;font-family:var(--mono)"' : idx === 0 ? ' style="font-family:var(--mono);font-weight:600"' : ""}>${esc(c)}</td>`).join("")}</tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- TAB 3: STRUKTUR -->
  <section id="tab-struktur" class="panel">
    <div class="section-bar">
      <h2 class="section-title">Detail Sambungan &amp; Laporan Struktur (Tahap 3)</h2>
      <div class="btn-row">
        <a class="btn" href="docs/03-struktur/detail-1.html" target="_blank" rel="noopener">Detail 1 ↗</a>
        <a class="btn" href="docs/03-struktur/detail-2.html" target="_blank" rel="noopener">Detail 2 ↗</a>
        <a class="btn" href="docs/03-struktur/laporan-struktur.md" target="_blank" rel="noopener">File .md ↗</a>
      </div>
    </div>
    <div class="grid-2">
      <article class="card">
        <div class="card-head">
          <div>
            <h3 class="card-title">Detail Sambungan 1 — Pilar, Balok, Tiang Burung</h3>
            <p class="card-desc">D1 Pilar–Runner (notch + saddle + 2×M10), D2 Balok–Pilar (4×M10 + gusset), D3 Tiang Burung–Balok.</p>
          </div>
          <span class="badge">Skala 1:4</span>
        </div>
        <div class="card-media" data-zoom="docs/03-struktur/detail-1.png" data-title="Detail Sambungan 1" data-link="docs/03-struktur/detail-1.html">
          <img src="docs/03-struktur/detail-1.png" alt="Detail Sambungan 1" loading="lazy">
        </div>
        <div class="card-foot">
          <div class="link-group">
            <a href="docs/03-struktur/detail-1.html" target="_blank" rel="noopener">Buka HTML ↗</a>
            <a href="docs/03-struktur/detail-1.svg" target="_blank" rel="noopener">SVG ↗</a>
            <a href="docs/03-struktur/detail-1.png" target="_blank" rel="noopener">PNG ↗</a>
          </div>
          <button class="btn" type="button" data-zoom="docs/03-struktur/detail-1.png" data-title="Detail Sambungan 1" data-link="docs/03-struktur/detail-1.html">Perbesar</button>
        </div>
      </article>
      <article class="card">
        <div class="card-head">
          <div>
            <h3 class="card-title">Detail Sambungan 2 — Banner, Pemberat, Lengkung</h3>
            <p class="card-desc">D4 Banner–Rel–Hanger (2 rod Ø6 + safety wire), D5 Box Pemberat 2×300 kg, D6 Potongan Lengkung &amp; Burung.</p>
          </div>
          <span class="badge">Rev 3</span>
        </div>
        <div class="card-media" data-zoom="docs/03-struktur/detail-2.png" data-title="Detail Sambungan 2" data-link="docs/03-struktur/detail-2.html">
          <img src="docs/03-struktur/detail-2.png" alt="Detail Sambungan 2" loading="lazy">
        </div>
        <div class="card-foot">
          <div class="link-group">
            <a href="docs/03-struktur/detail-2.html" target="_blank" rel="noopener">Buka HTML ↗</a>
            <a href="docs/03-struktur/detail-2.svg" target="_blank" rel="noopener">SVG ↗</a>
            <a href="docs/03-struktur/detail-2.png" target="_blank" rel="noopener">PNG ↗</a>
          </div>
          <button class="btn" type="button" data-zoom="docs/03-struktur/detail-2.png" data-title="Detail Sambungan 2" data-link="docs/03-struktur/detail-2.html">Perbesar</button>
        </div>
      </article>
    </div>
    <article class="doc-box">
      ${strukturHtml}
    </article>
  </section>

  <!-- TAB 4: RAKIT -->
  <section id="tab-rakit" class="panel">
    <div class="section-bar">
      <h2 class="section-title">Urutan Rakit 8 Langkah &amp; Cutting List (Tahap 4)</h2>
      <div class="btn-row">
        <a class="btn" href="docs/04-rakit/urutan-rakit.html" target="_blank" rel="noopener">Buka Diagram ↗</a>
        <a class="btn" href="docs/04-rakit/urutan-rakit.md" target="_blank" rel="noopener">File .md ↗</a>
      </div>
    </div>
    <article class="card">
      <div class="card-head">
        <div>
          <h3 class="card-title">Diagram Urutan Rakit 8 Langkah</h3>
          <p class="card-desc">Tahap pemasangan dari setting out &amp; runner hingga pengisian 24 kantong pasir (600 kg) dan serah terima.</p>
        </div>
        <span class="badge">8 Langkah</span>
      </div>
      <div class="card-media" data-zoom="docs/04-rakit/urutan-rakit.png" data-title="Urutan Rakit 8 Langkah" data-link="docs/04-rakit/urutan-rakit.html">
        <img src="docs/04-rakit/urutan-rakit.png" alt="Diagram Urutan Rakit" loading="lazy">
      </div>
      <div class="card-foot">
        <div class="link-group">
          <a href="docs/04-rakit/urutan-rakit.html" target="_blank" rel="noopener">Buka HTML ↗</a>
          <a href="docs/04-rakit/urutan-rakit.svg" target="_blank" rel="noopener">SVG ↗</a>
          <a href="docs/04-rakit/urutan-rakit.png" target="_blank" rel="noopener">PNG ↗</a>
        </div>
        <button class="btn" type="button" data-zoom="docs/04-rakit/urutan-rakit.png" data-title="Urutan Rakit 8 Langkah" data-link="docs/04-rakit/urutan-rakit.html">Perbesar</button>
      </div>
    </article>
    <article class="doc-box">
      ${rakitHtml}
    </article>
  </section>

  <!-- TAB 5: BERKAS -->
  <section id="tab-berkas" class="panel">
    <div class="section-bar">
      <h2 class="section-title">Peta Lengkap Berkas Proyek</h2>
    </div>
    <div class="doc-box" style="margin-top:0">
      <div class="table-wrap">
        <table>
          <thead><tr><th>Kategori</th><th>Nama Dokumen / Visualisasi</th><th>Tipe</th><th>Jalur Akses</th></tr></thead>
          <tbody>
            ${FILES_INDEX.map((f) => `<tr><td>${esc(f.cat)}</td><td><strong>${esc(f.name)}</strong></td><td><code>${esc(f.type)}</code></td><td><a href="${esc(f.path)}" target="_blank" rel="noopener"><code>${esc(f.path)}</code> ↗</a></td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    </div>
  </section>
</main>

<div id="zoom-modal" class="modal" role="dialog" aria-modal="true" aria-label="Pratinjau gambar">
  <div class="modal-inner">
    <div class="modal-bar">
      <span id="modal-title"></span>
      <div class="btn-row">
        <a id="modal-open" class="btn" href="#" target="_blank" rel="noopener">Buka Halaman Asli ↗</a>
        <button id="modal-close" class="btn" type="button">Tutup (Esc)</button>
      </div>
    </div>
    <div class="modal-body">
      <img id="modal-img" src="" alt="">
    </div>
  </div>
</div>

<script>
const tabBtns = document.querySelectorAll(".tab-btn");
const panels = document.querySelectorAll(".panel");
function setTab(id) {
  for (const b of tabBtns) b.setAttribute("aria-selected", String(b.dataset.tab === id));
  for (const p of panels) p.classList.toggle("active", p.id === "tab-" + id);
  if (history.replaceState) history.replaceState(null, "", "#" + id);
}
for (const b of tabBtns) b.addEventListener("click", () => setTab(b.dataset.tab));
const hashTab = location.hash.replace("#", "");
if (["interaktif", "geometri", "struktur", "rakit", "berkas"].includes(hashTab)) setTab(hashTab);

const simFrame = document.getElementById("sim-iframe");
const openSim = document.getElementById("btn-open-sim");
const btnLight = document.getElementById("btn-theme-light");
const btnDark = document.getElementById("btn-theme-dark");
function setSimTheme(mode) {
  const href = mode === "dark" ? "docs/05-interaktif/stand.html" : "docs/05-interaktif/stand-light.html";
  simFrame.src = href;
  openSim.href = href;
  btnLight.classList.toggle("active", mode === "light");
  btnDark.classList.toggle("active", mode === "dark");
}
btnLight.addEventListener("click", () => setSimTheme("light"));
btnDark.addEventListener("click", () => setSimTheme("dark"));

const coordFilter = document.getElementById("coord-filter");
const coordRows = document.querySelectorAll("#coord-table tbody tr");
coordFilter.addEventListener("input", () => {
  const q = coordFilter.value.trim().toLowerCase();
  for (const tr of coordRows) {
    tr.style.display = !q || tr.textContent.toLowerCase().includes(q) ? "" : "none";
  }
});

const modal = document.getElementById("zoom-modal");
const modalImg = document.getElementById("modal-img");
const modalTitle = document.getElementById("modal-title");
const modalOpen = document.getElementById("modal-open");
function closeModal() { modal.classList.remove("open"); }
for (const el of document.querySelectorAll("[data-zoom]")) {
  el.addEventListener("click", () => {
    modalImg.src = el.dataset.zoom;
    modalImg.alt = el.dataset.title || "";
    modalTitle.textContent = el.dataset.title || "";
    modalOpen.href = el.dataset.link || el.dataset.zoom;
    modal.classList.add("open");
  });
}
document.getElementById("modal-close").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
</script>
</body>
</html>
`;

writeFileSync(join(HERE, "index.html"), html);
console.log("wrote index.html");
