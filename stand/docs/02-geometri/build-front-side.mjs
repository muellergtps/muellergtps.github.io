import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const q = (v) => Number(v).toFixed(1);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const CSS = `
.obj{fill:none;stroke:#111;stroke-width:2.2;stroke-linejoin:round}
.obj2{fill:none;stroke:#111;stroke-width:1.3}
.white{fill:#fff;stroke:#111;stroke-width:2.2;stroke-linejoin:round}
.white2{fill:#fff;stroke:#111;stroke-width:1.3;stroke-linejoin:round}
.sign{fill:#faf7f2;stroke:#111;stroke-width:.8}
.thin{fill:none;stroke:#111;stroke-width:.8}
.tent{fill:none;stroke:#9aa4b2;stroke-width:1.2;stroke-dasharray:7 5}
.add{fill:none;stroke:#b06a3b;stroke-width:1.3;stroke-dasharray:5 4}
.addf{fill:#f7efe6;stroke:#b06a3b;stroke-width:1.2}
.timber{fill:#e8d9c6;stroke:#8a5a3b;stroke-width:1.1}
.small{fill:#6b7280;font:8px Consolas,monospace;letter-spacing:3px}
.birdfill{fill:#111;stroke:none}
.birdline{fill:none;stroke:#111;stroke-width:1.7;stroke-linecap:round}
.birddetail{fill:none;stroke:#fff;stroke-width:1;stroke-linecap:round}
.dim{fill:none;stroke:#1f6feb;stroke-width:1}
.dimthin{fill:none;stroke:#1f6feb;stroke-width:.6;stroke-dasharray:2 3}
.dimtx{fill:#1f6feb;font:10px Consolas,monospace}
.tx{fill:#111;font:12px Consolas,monospace}
.note{fill:#6b7280;font:10px Consolas,monospace}
.big{fill:#111;font:700 26px Consolas,monospace;letter-spacing:5px}
.h2{fill:#111;font:700 15px Consolas,monospace;letter-spacing:1px}
.sub{fill:#6b7280;font:10px Consolas,monospace}
`;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>${CSS}</style><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`;

function view(w, h) {
  const a = [];
  const line = (x1, y1, x2, y2, cls = "obj") => a.push(`<line x1="${q(x1)}" y1="${q(y1)}" x2="${q(x2)}" y2="${q(y2)}" class="${cls}"/>`);
  const rect = (x, y, ww, hh, cls = "obj") => a.push(`<rect x="${q(x)}" y="${q(y)}" width="${q(ww)}" height="${q(hh)}" class="${cls}"/>`);
  const poly = (pts, cls = "obj") => a.push(`<polygon points="${pts.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" class="${cls}"/>`);
  const path = (d, cls = "obj") => a.push(`<path d="${d}" class="${cls}"/>`);
  const text = (x, y, s, cls = "tx", anchor = "start", rot = 0) => {
    const tr = rot ? ` transform="rotate(${rot} ${q(x)} ${q(y)})"` : "";
    a.push(`<text x="${q(x)}" y="${q(y)}" class="${cls}" text-anchor="${anchor}"${tr}>${esc(s)}</text>`);
  };
  const dimH = (x1, x2, y, label, ey1 = null, ey2 = null) => {
    if (ey1 !== null) line(x1, ey1, x1, y, "dimthin");
    if (ey2 !== null) line(x2, ey2, x2, y, "dimthin");
    a.push(`<line x1="${q(x1)}" y1="${q(y)}" x2="${q(x2)}" y2="${q(y)}" class="dim"/>`);
    a.push(`<line x1="${q(x1)}" y1="${q(y - 4)}" x2="${q(x1)}" y2="${q(y + 4)}" class="dim"/>`);
    a.push(`<line x1="${q(x2)}" y1="${q(y - 4)}" x2="${q(x2)}" y2="${q(y + 4)}" class="dim"/>`);
    a.push(`<text x="${q((x1 + x2) / 2)}" y="${q(y - 6)}" class="dimtx" text-anchor="middle">${esc(label)}</text>`);
  };
  const dimV = (x, y1, y2, label, ex1 = null, ex2 = null) => {
    if (ex1 !== null) line(ex1, y1, x, y1, "dimthin");
    if (ex2 !== null) line(ex2, y2, x, y2, "dimthin");
    const my = (y1 + y2) / 2;
    a.push(`<line x1="${q(x)}" y1="${q(y1)}" x2="${q(x)}" y2="${q(y2)}" class="dim"/>`);
    a.push(`<line x1="${q(x - 4)}" y1="${q(y1)}" x2="${q(x + 4)}" y2="${q(y1)}" class="dim"/>`);
    a.push(`<line x1="${q(x - 4)}" y1="${q(y2)}" x2="${q(x + 4)}" y2="${q(y2)}" class="dim"/>`);
    a.push(`<text x="${q(x - 6)}" y="${q(my)}" class="dimtx" text-anchor="middle" transform="rotate(-90 ${q(x - 6)} ${q(my)})">${esc(label)}</text>`);
  };
  return { a, line, rect, poly, path, text, dimH, dimV, out: () => svg(w, h, a.join("")) };
}

/* ---------- A. TAMPAK DEPAN ---------- */
const F = view(820, 900);
const fx = (x) => 410 + x * 130;
const fz = (z) => 700 - z * 130;

F.text(30, 36, "A. TAMPAK DEPAN", "h2");
F.text(30, 52, "skala 130 px/m · dimensi meter", "sub");

F.line(fx(-1.5), fz(0), fx(-1.5), fz(2.5), "tent");
F.line(fx(1.5), fz(0), fx(1.5), fz(2.5), "tent");
F.line(fx(-1.5), fz(2.5), fx(1.5), fz(2.5), "tent");
F.line(fx(-1.5), fz(2.5), fx(0), fz(3.2), "tent");
F.line(fx(1.5), fz(2.5), fx(0), fz(3.2), "tent");
F.text(fx(0), fz(3.2) - 8, "puncak 3.200 [ASUMSI]", "note", "middle");

F.line(fx(-2.05), fz(0), fx(2.05), fz(0), "obj2");

F.path(`M ${fx(-1.1)} ${fz(2.5)} C ${fx(-1.1)} ${fz(2.5) - 0.6665 * 130} ${fx(1.1)} ${fz(2.5) - 0.6665 * 130} ${fx(1.1)} ${fz(2.5)}`, "add");
F.text(fx(0), fz(2.72), "kubah jerami (Tambahan)", "note", "middle");

F.path(`M ${fx(-1.8)} ${fz(3)} Q ${fx(0)} ${fz(2)} ${fx(1.8)} ${fz(3)} L ${fx(1.8)} ${fz(2.75)} Q ${fx(0)} ${fz(1.75)} ${fx(-1.8)} ${fz(2.75)} Z`, "white");
F.rect(fx(-1.8), fz(2.5), 3.6 * 130, 0.5 * 130, "white");
F.poly([[fx(-1.5), fz(0)], [fx(-1), fz(0)], [fx(-1.1), fz(2)], [fx(-1.5), fz(2)]], "white");
F.poly([[fx(1.5), fz(0)], [fx(1), fz(0)], [fx(1.1), fz(2)], [fx(1.5), fz(2)]], "white");
F.rect(fx(-1.04), fz(2.515), 2.08 * 130, 0.53 * 130, "white2");
F.rect(fx(-1), fz(2.475), 2 * 130, 0.45 * 130, "sign");
F.text(fx(0), fz(2.25) + 8, "PAPUA", "big", "middle");
F.text(fx(0), fz(2.10), "STMKG", "small", "middle");

function bird(s) {
  const X = fx(s * 1.8), Z = fz(3);
  const p = (u, v) => `${(X + s * u * 130).toFixed(1)} ${(Z - v * 130).toFixed(1)}`;
  F.path(`M ${p(0, 0.02)} C ${p(-0.05, 0.10)} ${p(-0.06, 0.22)} ${p(0, 0.30)} C ${p(0.05, 0.37)} ${p(0.14, 0.37)} ${p(0.19, 0.32)} C ${p(0.23, 0.28)} ${p(0.20, 0.18)} ${p(0.15, 0.11)} C ${p(0.10, 0.04)} ${p(0.04, -0.01)} ${p(0, 0.02)} Z`, "birdfill");
  F.path(`M ${p(0.14, 0.30)} C ${p(0.16, 0.36)} ${p(0.21, 0.39)} ${p(0.25, 0.36)} L ${p(0.40, 0.31)} L ${p(0.26, 0.29)} C ${p(0.22, 0.25)} ${p(0.17, 0.25)} ${p(0.14, 0.30)} Z`, "birdfill");
  for (const d of [
    `M ${p(0.22, 0.37)} C ${p(0.18, 0.40)} ${p(0.10, 0.40)} ${p(0.04, 0.38)}`,
    `M ${p(0.22, 0.37)} C ${p(0.16, 0.39)} ${p(0.08, 0.39)} ${p(0.02, 0.34)}`,
    `M ${p(0.22, 0.37)} C ${p(0.20, 0.40)} ${p(0.16, 0.40)} ${p(0.11, 0.39)}`,
    `M ${p(0, 0.04)} C ${p(-0.10, 0.00)} ${p(-0.24, -0.12)} ${p(-0.38, -0.36)}`,
    `M ${p(0.02, 0.04)} C ${p(-0.06, -0.04)} ${p(-0.18, -0.20)} ${p(-0.30, -0.40)}`,
    `M ${p(0, 0.04)} C ${p(-0.12, 0.04)} ${p(-0.26, -0.02)} ${p(-0.36, -0.12)}`,
    `M ${p(0.01, 0.02)} L ${p(0.01, -0.03)}`,
    `M ${p(0.05, 0.02)} L ${p(0.05, -0.03)}`,
    `M ${p(-0.02, -0.03)} Q ${p(0.01, -0.06)} ${p(0.04, -0.03)}`,
    `M ${p(0.03, -0.03)} Q ${p(0.06, -0.06)} ${p(0.08, -0.02)}`
  ]) F.path(d, "birdline");
  F.path(`M ${p(0.02, 0.26)} C ${p(0.08, 0.29)} ${p(0.16, 0.25)} ${p(0.18, 0.19)} C ${p(0.14, 0.15)} ${p(0.06, 0.15)} ${p(0.02, 0.19)} Z`, "birdfill");
  F.path(`M ${p(0.04, 0.23)} C ${p(0.09, 0.24)} ${p(0.14, 0.22)} ${p(0.16, 0.19)}`, "birddetail");
  for (const [u, v] of [[-0.38, -0.36], [-0.30, -0.40], [-0.36, -0.12]]) {
    F.a.push(`<circle cx="${(X + s * u * 130).toFixed(1)}" cy="${(Z - v * 130).toFixed(1)}" r="1.6" class="birdfill"/>`);
  }
}
bird(1);
bird(-1);

F.rect(fx(-1.95), fz(1.5), 0.6 * 130, 1.5 * 130, "addf");
F.rect(fx(1.35), fz(1.5), 0.6 * 130, 1.5 * 130, "addf");
F.text(fx(-1.65), fz(0.75), "banner 1500×600", "note", "middle", -90);
F.text(fx(1.65), fz(0.75), "banner 1500×600", "note", "middle", -90);

F.dimH(fx(-1.8), fx(1.8), fz(3.62), "3.600", fz(3.4), fz(3.4));
F.dimH(fx(-1.5), fx(1.5), fz(-0.22), "3.000 (tenda)", fz(0), fz(0));
F.dimH(fx(-1), fx(1), fz(-0.48), "2.000 (bukaan)", fz(0), fz(0));
F.dimH(fx(1), fx(1.5), fz(-0.48), "0.500", fz(0), fz(0));
F.dimV(fx(-0.92), fz(0), fz(2), "2.000", fx(-1.0), fx(-1.0));
F.dimV(fx(-2.05), fz(2), fz(2.5), "0.500", fx(-1.8), fx(-1.8));
F.dimV(fx(-2.3), fz(3), fz(3.4), "0.400", fx(-2.2), fx(-2.2));
F.dimV(fx(-2.55), fz(0), fz(3.4), "3.400", fx(-2.2), fx(-2.2));

F.text(fx(0), fz(-0.95), "gapura freestanding · celah 0.15 m ke tenda", "note", "middle");
F.text(410, 840, "total lebar 4.400 (ujung ekor) · perlu celah ≥ 0.700 m ke tetangga", "note", "middle");
F.text(410, 858, "D1–D12 [KONFIRMASI] · K1–K8 [KEPUTUSAN] · puncak tenda 3.200 [ASUMSI]", "note", "middle");
const frontSvg = F.out();

/* ---------- B. TAMPAK SAMPING ---------- */
const S = view(900, 860);
const sy = (y) => 550 + y * 110;
const sz = (z) => 700 - z * 110;

S.text(30, 36, "B. TAMPAK SAMPING", "h2");
S.text(30, 52, "skala 110 px/m · bidang Y-Z", "sub");

S.line(sy(0), sz(0), sy(0), sz(2.5), "tent");
S.line(sy(-3), sz(0), sy(-3), sz(2.5), "tent");
S.line(sy(-3), sz(2.5), sy(0), sz(2.5), "tent");
S.line(sy(0), sz(2.5), sy(-1.5), sz(3.2), "tent");
S.line(sy(-3), sz(2.5), sy(-1.5), sz(3.2), "tent");
S.text(sy(-1.5), sz(3.2) - 8, "puncak 3.200 [ASUMSI]", "note", "middle");

S.line(sy(-3.1), sz(0), sy(2.1), sz(0), "obj2");

S.path(`M ${sy(0.1)} ${sz(2.5)} C ${sy(0.1)} ${sz(3.1667)} ${sy(0.7)} ${sz(3.1667)} ${sy(0.7)} ${sz(2.5)}`, "add");
S.rect(sy(0.15), sz(0.1), 1.6 * 110, 0.1 * 110, "timber");
S.poly([[sy(0.15), sz(0)], [sy(0.65), sz(0)], [sy(0.65), sz(2)], [sy(0.25), sz(2)]], "white");
S.line(sy(0.175), sz(1), sy(0.65), sz(1), "thin");
S.rect(sy(0.15), sz(2.5), 0.5 * 110, 0.5 * 110, "white");
S.rect(sy(0.35), sz(3), 0.1 * 110, 0.5 * 110, "white2");
S.rect(sy(0.35), sz(3.4), 0.1 * 110, 0.8 * 110, "add");
S.rect(sy(0.78), sz(1.5), 0.04 * 110, 1.5 * 110, "addf");
S.rect(sy(1.55), sz(0.3), 0.2 * 110, 0.2 * 110, "add");

S.text(sy(-2.9), sz(2.62), "tenda (tidak dibebani)", "note");
S.line(sy(0.82), sz(1.2), sy(0.9), sz(1.2), "thin");
S.text(sy(0.92), sz(1.23), "banner", "note");
S.text(sy(0.55), sz(2.7), "lengkung 100", "note");
S.text(sy(0.55), sz(3.2), "burung", "note");
S.line(sy(1.65), sz(0.3), sy(1.5), sz(0.42), "thin");
S.text(sy(1.45), sz(0.45), "pemberat", "note", "middle");

S.dimH(sy(-3), sy(0), sz(-0.28), "3.000 (tenda)", sz(0), sz(0));
S.dimH(sy(0.15), sy(1.75), sz(-0.56), "1.600", sz(0.1), sz(0.1));
S.dimH(sy(0.15), sy(0.65), sz(-0.84), "0.500", sz(0), sz(0));
S.dimV(sy(1.85), sz(0), sz(2), "2.000", sy(0.65), sy(0.65));
S.dimV(sy(2.05), sz(2), sz(2.5), "0.500", sy(0.65), sy(0.65));
S.dimV(sy(2.25), sz(2.5), sz(3), "0.500", sy(0.45), sy(0.45));
S.dimV(sy(2.45), sz(3), sz(3.4), "0.400", sy(0.45), sy(0.45));
S.text(450, 840, "tenda tidak dibebani · runner di depan tenda · pemberat [TBD]", "note", "middle");
const sideSvg = S.out();

writeFileSync(join(here, "front.svg"), frontSvg);
writeFileSync(join(here, "side.svg"), sideSvg);

const html = `<!doctype html><html><head><meta charset="utf-8"><title>Gapura Papua — Tahap 2B</title>
<style>body{margin:0;background:#fff;font-family:Consolas,monospace;color:#111}.iso-plate{display:flex;gap:20px;padding:20px;align-items:flex-start;background:#fff}.cap{max-width:820px;padding:8px 20px 24px}h1{font-size:18px;letter-spacing:1px}p,li{font-size:12px;line-height:1.55;color:#333}.note{color:#6b7280}</style></head>
<body><div class="iso-plate"><div>${frontSvg}</div><div>${sideSvg}</div></div>
<div class="cap"><h1>GAPURA PAPUA STMKG — TAHAP 2B</h1>
<p>Tampak depan (A) dan samping (B). Gambar skematik berskala; dimensi dalam meter. Garis abu-abu putus-putus = tenda; cokelat = elemen Versi Tambahan; biru = dimensi.</p>
<p><b>Catatan:</b> pilar 500→400 mm; balok 500×500×3600 mm; lengkung +500 mm; burung 800×800 mm; banner 1500×600 mm; runner 1600 mm di depan tenda; puncak tenda 3200 mm [ASUMSI].</p>
</div></body></html>`;
writeFileSync(join(here, "front-side.html"), html);
console.log("wrote front.svg, side.svg, front-side.html");
