import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const q = (v) => Number(v).toFixed(1);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const W = 1800, H = 900;

const CSS = `
.panel{fill:#fff;stroke:#d9d1c5;stroke-width:1}
.h1{fill:#241f1a;font:700 16px Consolas,monospace;letter-spacing:1px}
.sub{fill:#6b7280;font:10px Consolas,monospace}
.ptitle{fill:#241f1a;font:700 12px Consolas,monospace;letter-spacing:.8px}
.psub{fill:#6b7280;font:8.5px Consolas,monospace}
.viewtitle{fill:#241f1a;font:700 9.5px Consolas,monospace;letter-spacing:1px}
.out{fill:none;stroke:#241f1a;stroke-width:1.6;stroke-linejoin:round}
.out2{fill:none;stroke:#241f1a;stroke-width:1.0;stroke-linejoin:round}
.thin{fill:none;stroke:#241f1a;stroke-width:.7;stroke-linejoin:round}
.dash{fill:none;stroke:#7c7163;stroke-width:.8;stroke-dasharray:4 3}
.wood{fill:#f3e7d6;stroke:#8a5a3b;stroke-width:1.2;stroke-linejoin:round}
.wood2{fill:#e8d9c6;stroke:#8a5a3b;stroke-width:1.0;stroke-linejoin:round}
.ply{fill:#faf6ef;stroke:#8a5a3b;stroke-width:1.0;stroke-linejoin:round}
.steel{fill:#d9dde3;stroke:#4a5568;stroke-width:1.0}
.rubber{fill:#3a332c;stroke:#241f1a;stroke-width:.8}
.sand{fill:#e5e0d8;stroke:#8a7f70;stroke-width:.8}
.sandfill{fill:url(#sand);stroke:#8a7f70;stroke-width:.8}
.banner{fill:#f7efe6;stroke:#b06a3b;stroke-width:1.2}
.bannerband{fill:#b06a3b;stroke:#8a4f2b;stroke-width:.8}
.banneremblem{fill:#f7efe6;stroke:#8a4f2b;stroke-width:.8}
.hatch{fill:url(#hatch);stroke:#8a5a3b;stroke-width:1.0}
.paving{fill:url(#paving);stroke:#5f5a52;stroke-width:1.0}
.dim{fill:none;stroke:#1f6feb;stroke-width:.8}
.dimthin{fill:none;stroke:#1f6feb;stroke-width:.55;stroke-dasharray:2 3}
.dimtx{fill:#1f6feb;font:9px Consolas,monospace}
.tx{fill:#241f1a;font:10px Consolas,monospace}
.lbl{fill:#241f1a;font:8px Consolas,monospace}
.note{fill:#4b5563;font:8.6px Consolas,monospace}
.red{fill:#b03a2e;font:8.6px Consolas,monospace}
`;

const DEFS = `<defs>
<pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
  <line x1="0" y1="0" x2="0" y2="6" stroke="#c9a97f" stroke-width="1"/>
</pattern>
<pattern id="paving" width="8" height="8" patternUnits="userSpaceOnUse">
  <path d="M0 0H8M0 4H8" stroke="#c8c2b8" stroke-width=".8"/>
</pattern>
<pattern id="sand" width="5" height="5" patternUnits="userSpaceOnUse">
  <circle cx="1" cy="1" r=".7" fill="#b9b3a9"/>
</pattern>
</defs>`;

function makeG() {
  const a = [];
  const line = (x1, y1, x2, y2, cls = "out") =>
    a.push(`<line x1="${q(x1)}" y1="${q(y1)}" x2="${q(x2)}" y2="${q(y2)}" class="${cls}"/>`);
  const rect = (x, y, w, h, cls = "out", rx = 0) =>
    a.push(`<rect x="${q(x)}" y="${q(y)}" width="${q(w)}" height="${q(h)}" rx="${q(rx)}" class="${cls}"/>`);
  const poly = (pts, cls = "out") =>
    a.push(`<polygon points="${pts.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" class="${cls}"/>`);
  const circle = (x, y, r, cls = "out") =>
    a.push(`<circle cx="${q(x)}" cy="${q(y)}" r="${q(r)}" class="${cls}"/>`);
  const path = (d, cls = "out") => a.push(`<path d="${d}" class="${cls}"/>`);
  const text = (x, y, s, cls = "tx", anchor = "start", rot = 0) => {
    const tr = rot ? ` transform="rotate(${rot} ${q(x)} ${q(y)})"` : "";
    a.push(`<text x="${q(x)}" y="${q(y)}" class="${cls}" text-anchor="${anchor}"${tr}>${esc(s)}</text>`);
  };
  const dimH = (x1, x2, y, label, e1 = null, e2 = null) => {
    if (e1 !== null) line(x1, e1, x1, y, "dimthin");
    if (e2 !== null) line(x2, e2, x2, y, "dimthin");
    line(x1, y, x2, y, "dim");
    line(x1, y - 4, x1, y + 4, "dim");
    line(x2, y - 4, x2, y + 4, "dim");
    text((x1 + x2) / 2, y - 6, label, "dimtx", "middle");
  };
  const dimV = (x, y1, y2, label, e1 = null, e2 = null) => {
    if (e1 !== null) line(e1, y1, x, y1, "dimthin");
    if (e2 !== null) line(e2, y2, x, y2, "dimthin");
    const my = (y1 + y2) / 2;
    line(x, y1, x, y2, "dim");
    line(x - 4, y1, x + 4, y1, "dim");
    line(x - 4, y2, x + 4, y2, "dim");
    text(x - 6, my, label, "dimtx", "middle", -90);
  };
  const bolt = (x, y, r = 3.4) => {
    circle(x, y, r, "steel");
    line(x - r, y, x + r, y, "thin");
    line(x, y - r, x, y + r, "thin");
  };
  const boltV = (x, y1, y2, head = 5) => {
    line(x, y1, x, y2, "out2");
    rect(x - head / 2, y1 - 2, head, 3, "steel");
    rect(x - head / 2, y2 - 1, head, 3, "steel");
  };
  const leader = (x1, y1, x2, y2, s, anchor = "start") => {
    line(x1, y1, x2, y2, "dash");
    circle(x1, y1, 1.8, "out2");
    text(x2 + (anchor === "end" ? -3 : 3), y2 + 3, s, "lbl", anchor);
  };
  const notes = (x, y, lines, step = 12) => {
    lines.forEach((s, i) => text(x, y + i * step, s, "note"));
  };
  const out = () => a.join("");
  return { a, line, rect, poly, circle, path, text, dimH, dimV, bolt, boltV, leader, notes, out };
}

function plate(title, subtitle, panels) {
  const body = [];
  body.push(`<text x="30" y="34" class="h1">${esc(title)}</text>`);
  body.push(`<text x="30" y="50" class="sub">${esc(subtitle)}</text>`);
  for (const p of panels) {
    body.push(`<g transform="translate(${p.x},${p.y})">`);
    body.push(`<rect x="0" y="0" width="${p.w}" height="${p.h}" class="panel"/>`);
    body.push(`<text x="14" y="24" class="ptitle">${esc(p.id)} · ${esc(p.title)}</text>`);
    body.push(`<text x="14" y="40" class="psub">${esc(p.sub)}</text>`);
    const g = makeG();
    p.draw(g);
    body.push(g.out());
    body.push(`</g>`);
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${DEFS}<style>${CSS}</style><rect width="${W}" height="${H}" fill="#fff"/>${body.join("")}</svg>`;
}

/* ============================= D1 — PILAR–RUNNER ============================= */
function d1(g) {
  const s = 0.35;
  const ox = 55, oy = 105;
  const px = (mm) => ox + mm * s;
  const py = (mm) => oy + mm * s;

  g.text(ox, oy - 46, "RENCANA", "viewtitle");
  g.rect(px(0), py(0), 500 * s, 500 * s, "wood2");
  g.rect(px(50), py(50), 400 * s, 400 * s, "dash");
  g.rect(px(200), py(0), 100 * s, 700 * s, "wood");
  g.rect(px(100), py(50), 100 * s, 300 * s, "ply");
  g.rect(px(300), py(50), 100 * s, 300 * s, "ply");
  g.bolt(px(250), py(100));
  g.bolt(px(250), py(300));
  g.line(px(200), py(500), px(200), py(700), "dash");
  g.line(px(300), py(500), px(300), py(700), "dash");
  g.text(px(250), py(360), "runner", "lbl", "middle", -90);
  g.text(px(150), py(210), "saddle", "lbl", "middle", -90);
  g.text(px(250), py(82), "M10", "lbl", "middle");
  g.text(px(200), py(620), "gusset", "lbl", "middle", -90);

  g.dimH(px(0), px(500), oy - 28, "500");
  g.dimH(px(200), px(300), py(700) + 20, "100");
  g.dimV(px(0) - 18, py(0), py(500), "500");
  g.dimV(px(0) - 38, py(50), py(350), "300");
  g.dimV(px(500) + 20, py(500), py(700), "200");
  g.dimV(px(500) + 40, py(0), py(700), "700");

  const s2 = 0.28;
  const sx = 320, sy = 355;
  const sxmm = (mm) => sx + mm * s2;
  const szmm = (mm) => sy - mm * s2;
  g.text(sx, 95, "POTONGAN A-A", "viewtitle");
  g.rect(sx - 10, sy, 700 * s2 + 20, 16, "paving");
  g.rect(sxmm(0), szmm(100), 700 * s2, 100 * s2, "wood");
  g.rect(sxmm(0), szmm(500), 70 * s2, 500 * s2, "wood2");
  g.rect(sxmm(430), szmm(500), 70 * s2, 400 * s2, "wood2");
  g.rect(sxmm(0), szmm(70), 70 * s2, 70 * s2, "hatch");
  g.rect(sxmm(430), szmm(70), 70 * s2, 70 * s2, "hatch");
  g.rect(sxmm(50), szmm(100), 300 * s2, 100 * s2, "dash");
  g.bolt(sxmm(100), szmm(50));
  g.bolt(sxmm(300), szmm(50));
  g.text(sxmm(350), szmm(50) - 8, "saddle (2×)", "lbl", "middle");
  g.leader(sxmm(470), szmm(50), sxmm(560), szmm(130), "notch 100×100", "start");

  g.dimH(sxmm(0), sxmm(500), sy + 24, "500");
  g.dimH(sxmm(500), sxmm(700), sy + 24, "200");
  g.dimV(sxmm(0) - 18, szmm(100), sy, "100");
  g.dimV(sxmm(700) + 18, szmm(100), sy, "100");
  g.dimV(sxmm(700) + 38, szmm(500), sy, "500");

  g.notes(14, 610, [
    "1. Potong notch 100×100 pada bottom frame + kulit depan/belakang.",
    "2. Saddle 100×100×300 di kiri-kanan runner; lem PU + sekrup 4×40.",
    "3. 2×M10 tembus saddle–runner–saddle; ring Ø30 kedua sisi.",
    "4. Gusset 200×200×9 di luar; seal semua potongan dengan cat.",
  ], 13);
  g.text(14, 755, "D1 · skala 1:4 · dimensi mm", "psub");
}

/* ============================= D2 — BALOK–PILAR ============================= */
function d2(g) {
  const s = 0.35;
  const ox = 250, oy = 560;
  const X = (mm) => ox + mm * s;
  const Z = (mm) => oy - mm * s;

  g.text(40, 78, "TAMPAK DEPAN SAMBUNGAN", "viewtitle");
  g.rect(X(-250), Z(600), 500 * s, 500 * s, "ply");
  g.rect(X(-200), Z(100), 400 * s, 100 * s, "ply");
  g.rect(X(-250), Z(170), 500 * s, 70 * s, "wood2");
  g.rect(X(-200), Z(100), 400 * s, 70 * s, "wood2");
  g.rect(X(50), Z(300), 200 * s, 200 * s, "ply");
  g.line(X(50), Z(300), X(250), Z(100), "thin");
  g.text(X(150), Z(190), "gusset", "lbl", "middle");
  g.boltV(X(-100), Z(170), Z(30));
  g.boltV(X(100), Z(170), Z(30));
  g.text(X(0), Z(620), "balok 500×500", "lbl", "middle");
  g.text(X(0), Z(5), "pilar atas 400×400", "lbl", "middle");

  g.dimH(X(-250), X(250), Z(650), "500");
  g.dimH(X(-200), X(200), Z(-35), "400");
  g.dimV(X(280), Z(600), Z(100), "500");
  g.dimV(X(305), Z(300), Z(100), "200");
  g.dimV(X(-280), Z(170), Z(30), "140");

  const s2 = 0.28;
  const sx = 390, sy = 540;
  const Y = (mm) => sx + mm * s2;
  const ZZ = (mm) => sy - mm * s2;
  g.text(sx, 78, "POTONGAN B-B (Baut)", "viewtitle");
  g.rect(Y(0), ZZ(100), 500 * s2, 12 * s2, "ply");
  g.rect(Y(0), ZZ(170), 500 * s2, 70 * s2, "wood2");
  g.rect(Y(0), ZZ(100), 500 * s2, 70 * s2, "wood2");
  g.rect(Y(215), ZZ(300), 9 * s2, 200 * s2, "steel");
  g.boltV(Y(250), ZZ(170), ZZ(30));
  g.circle(Y(250), ZZ(100), 4, "steel");
  g.text(Y(250) + 12, ZZ(100) + 3, "ring Ø30", "lbl");
  g.text(Y(70), ZZ(200), "gusset 9", "lbl", "middle", -90);
  g.dimH(Y(0), Y(500), sy + 24, "500");
  g.dimV(Y(0) - 18, ZZ(170), ZZ(100), "70");
  g.dimV(Y(0) - 36, ZZ(100), ZZ(30), "70");
  g.dimV(Y(500) + 18, ZZ(300), ZZ(100), "200");

  g.notes(14, 610, [
    "1. Balok diletakkan di atas pilar; soffit balok z = 2.000.",
    "2. 4×M10×160 vertikal, ring Ø30 di kedua sisi; kencangkan silang.",
    "3. Gusset 200×200×9 di dua sisi, lem PU + sekrup 4×40 @75.",
    "4. Cek plumb pilar; shim 2–3 mm bila perlu; tutup baut dengan dempul.",
  ], 13);
  g.text(14, 755, "D2 · skala 1:4 · dimensi mm", "psub");
}

/* ============================= D3 — TIANG BURUNG–BALOK ============================= */
function d3(g) {
  const s = 0.32;
  const ox = 165, oy = 570;
  const X = (mm) => ox + mm * s;
  const Z = (mm) => oy - mm * s;

  g.text(40, 78, "POTONGAN TIANG–BALOK", "viewtitle");
  g.rect(X(-250), Z(500), 500 * s, 500 * s, "ply");
  g.rect(X(-50), Z(1000), 100 * s, 500 * s, "wood");
  g.rect(X(-75), Z(509), 150 * s, 9 * s, "steel");
  g.rect(X(-50), Z(500), 100 * s, 100 * s, "dash");
  g.boltV(X(-35), Z(509), Z(400));
  g.boltV(X(35), Z(509), Z(400));
  g.rect(X(-50), Z(1100), 100 * s, 100 * s, "ply");
  g.text(X(0), Z(1135), "tab burung", "lbl", "middle");
  g.text(X(0), Z(940), "tiang 100×100×500", "lbl", "middle", -90);
  g.text(X(0), Z(355), "blocking 100×100×100", "lbl", "middle");

  g.dimH(X(-250), X(250), Z(1170), "500");
  g.dimH(X(-50), X(50), Z(1225), "100");
  g.dimV(X(295), Z(1000), Z(500), "500");
  g.dimV(X(320), Z(509), Z(400), "110");
  g.dimV(X(-290), Z(500), Z(0), "500");

  const px0 = 365, py0 = 200;
  const PX = (mm) => px0 + mm * s;
  const PY = (mm) => py0 + mm * s;
  g.text(px0, py0 - 46, "RENCANA BASE PLATE (transparan)", "viewtitle");
  g.rect(PX(0), PY(0), 500 * s, 500 * s, "ply");
  g.rect(PX(175), PY(175), 150 * s, 150 * s, "steel");
  g.rect(PX(200), PY(200), 100 * s, 100 * s, "wood");
  g.rect(PX(200), PY(200), 100 * s, 100 * s, "dash");
  g.bolt(PX(215), PY(215));
  g.bolt(PX(285), PY(285));
  g.dimH(PX(0), PX(500), py0 - 28, "500");
  g.dimH(PX(175), PX(325), py0 + 500 * s + 20, "150");
  g.dimV(PX(0) - 18, PY(0), PY(500), "500");
  g.text(PX(0), PY(500) + 42, "— post 100×100 (di atas base plate)", "lbl");
  g.text(PX(0), PY(500) + 54, "— base plate 150×150×9", "lbl");
  g.text(PX(0), PY(500) + 66, "— blocking 100×100 di dalam balok", "lbl");

  g.notes(14, 610, [
    "1. Blocking 100×100×100 di dalam balok, lem + sekrup ke rangka.",
    "2. Base plate 150×150×9 di atas kulit balok, di atas blocking.",
    "3. 2×M8×160 tembus base plate + kulit + blocking; ring Ø25.",
    "4. Tiang 100×100×500; burung diikat 2×M8 melalui tab 100×100×12.",
  ], 13);
  g.text(14, 755, "D3 · skala 1:4 · dimensi mm", "psub");
}

const p1 = [
  { x: 30, y: 80, w: 560, h: 790, id: "D1", title: "PILAR–RUNNER", sub: "notch 100×100 · saddle 2×100×100×300 · 2×M10", draw: d1 },
  { x: 620, y: 80, w: 560, h: 790, id: "D2", title: "BALOK–PILAR", sub: "4×M10×160 · gusset 200×200×9 · soffit z=2.000", draw: d2 },
  { x: 1210, y: 80, w: 560, h: 790, id: "D3", title: "TIANG BURUNG–BALOK", sub: "2×M8×160 · blocking 100×100×100 · base plate 150×150×9", draw: d3 },
];

writeFileSync(join(here, "detail-1.svg"), plate(
  "DETAIL SAMBUNGAN 1 — PILAR, BALOK, TIANG BURUNG",
  "Tahap 3 · skala 1:4 · dimensi mm · potongan skematik, bukan gambar kerja tersertifikasi",
  p1
));
console.log("wrote detail-1.svg");

/* ============================= D4 — BANNER, REL, HANGER ============================= */
function d4(g) {
  const s = 0.22;
  const ox = 190, oy = 545;
  const X = (mm) => ox + mm * s;
  const Z = (mm) => oy - mm * s;

  g.text(40, 62, "TAMPAK DEPAN BANNER", "viewtitle");
  g.rect(X(-500), Z(2100), 1000 * s, 100 * s, "hatch");
  g.text(X(0), 78, "balok, soffit z=2.000", "lbl", "middle");

  g.rect(X(-300), Z(1500), 600 * s, 1500 * s, "banner");
  g.rect(X(-270), Z(1460), 540 * s, 200 * s, "bannerband");
  g.circle(X(0), Z(860), 8, "banneremblem");
  for (const z of [580, 500, 420, 340]) g.line(X(-240), Z(z), X(240), Z(z), "thin");

  g.rect(X(-300), Z(1540), 600 * s, 60 * s, "wood2");
  for (const hx of [-300, 0]) {
    g.line(X(hx), Z(2000), X(hx), Z(1540), "out2");
    g.circle(X(hx), Z(2000), 3, "steel");
    g.circle(X(hx), Z(1540), 3, "steel");
    g.line(X(hx) + 5, Z(2000), X(hx) + 5, Z(1540), "dash");
  }

  g.text(X(0), Z(760), "banner 600×1500", "lbl", "middle", -90);
  g.leader(X(-300), Z(2000), X(-300) - 54, Z(2000) - 16, "eye screw (2×)", "end");
  g.leader(X(0), Z(1770), X(0) + 34, Z(1770) - 10, "rod Ø6 (2×)");
  g.leader(X(0) + 5, Z(1700), X(0) + 34, Z(1700) + 18, "safety wire 1,5");

  g.line(X(0), Z(1600), X(300), Z(1600), "dim");
  g.line(X(0), Z(1540), X(0), Z(1606), "dimthin");
  g.line(X(300), Z(1540), X(300), Z(1606), "dimthin");
  g.line(X(0), Z(1594), X(0), Z(1606), "dim");
  g.line(X(300), Z(1594), X(300), Z(1606), "dim");
  g.text(X(150), Z(1618), "300", "dimtx", "middle");

  g.dimH(X(-300), X(300), Z(-70), "600");
  g.dimV(X(-380), Z(1500), Z(0), "1500", X(-300), X(-300));
  g.dimH(X(-300), X(0), Z(1880), "300");
  g.dimV(X(420), Z(2000), Z(1540), "460", X(300), X(300));

  const s2 = 0.42, sx = 400, sy = 545;
  const Y = (mm) => sx + (mm - 600) * s2;
  const ZZ = (mm) => sy - (mm - 1400) * s2;
  g.text(sx - 30, 62, "POTONGAN SAMPING", "viewtitle");
  g.rect(Y(650), ZZ(2100), 100 * s2, 700 * s2, "hatch");
  g.text(Y(700), 246, "balok", "lbl", "middle");
  g.circle(Y(650), ZZ(2000), 3, "steel");
  g.line(Y(650), ZZ(2000), Y(820), ZZ(1540), "out2");
  g.circle(Y(820), ZZ(1540), 3, "steel");
  g.rect(Y(760), ZZ(1540), 80 * s2, 60 * s2, "wood2");
  g.rect(Y(780), ZZ(1480), 3, 116, "banner");
  g.line(Y(780) - 6, ZZ(1480) + 116, Y(780) + 9, ZZ(1480) + 104, "thin");
  g.leader(Y(650), ZZ(2000), Y(650) - 26, ZZ(2000) - 12, "eye screw", "end");
  g.leader(Y(820), ZZ(1540), Y(820) + 30, ZZ(1540) - 14, "hook");
  g.leader(Y(800), ZZ(1510), Y(800) + 36, ZZ(1510) + 4, "rel 80×60");
  g.leader(Y(780) + 2, ZZ(1420), Y(780) + 40, ZZ(1420) + 10, "banner");
  g.text(Y(690), ZZ(1750), "rod Ø6, L≈490", "lbl", "middle", -70);

  g.dimH(Y(650), Y(820), ZZ(2150), "170", Y(650), Y(820));
  g.dimV(Y(880), ZZ(2000), ZZ(1540), "460", Y(840), Y(840));

  g.notes(14, 660, [
    "1. 2 hanger per banner di x = ±1.500 dan ±1.800; rel 600×80×60.",
    "2. Eye screw ke blocking di soffit balok; rod galvanis 6 mm + hook.",
    "3. Rel masuk sleeve banner; 3 sekrup kecil di tiap ujung; safety wire 1,5 mm.",
    "4. Rel menumpu di 2 titik; kantilever 300 mm ke luar; cek goyangan.",
  ], 13);
  g.text(14, 755, "D4 · skala skematik 1:4,5 (depan) / 1:2,4 (samping) · dimensi mm", "psub");
}

/* ============================= D5 — BOX PEMBERAT–RUNNER ============================= */
function d5(g) {
  const s = 0.30;
  const ox = 75, oy = 285;
  const X = (mm) => ox + mm * s;
  const Y = (mm) => oy + mm * s;

  g.text(40, 62, "RENCANA BOX PEMBERAT", "viewtitle");
  g.rect(X(220), Y(-550), 100 * s, 1600 * s, "wood");
  g.rect(X(0), Y(0), 500 * s, 1050 * s, "sand");
  g.rect(X(0), Y(0), 100 * s, 1050 * s, "dash");
  g.rect(X(400), Y(0), 100 * s, 1050 * s, "dash");
  g.rect(X(220), Y(0), 100 * s, 1050 * s, "dash");
  g.rect(X(0), Y(200), 500 * s, 25 * s, "steel");
  g.rect(X(0), Y(800), 500 * s, 25 * s, "steel");
  g.bolt(X(270), Y(250));
  g.bolt(X(270), Y(800));
  g.line(X(520), Y(0), X(520), Y(1050), "banner");
  g.text(X(250), Y(525), "box 500×1050×400", "lbl", "middle", -90);
  g.leader(X(270), Y(-500), X(270) + 44, Y(-500) - 8, "runner 100×100 (di bawah box)");
  g.leader(X(50), Y(980), X(50) - 34, Y(980) + 34, "kaki 100×100 (2×)", "end");
  g.leader(X(0), Y(210), X(0) - 30, Y(210) - 18, "strap 25 (2×)", "end");
  g.leader(X(270), Y(250), X(270) + 30, Y(250) - 12, "M8 (2×)");
  g.leader(X(520), Y(1000), X(520) + 26, Y(1000) + 8, "banner, celah 20");

  g.dimH(X(0), X(500), Y(1050) + 25, "500");
  g.dimV(X(0) - 20, Y(0), Y(1050), "1050", X(0), X(0));
  g.dimV(X(500) + 34, Y(-550), Y(0), "550", X(320), X(320));
  g.dimH(X(220), X(320), Y(-550) - 14, "100");

  const s2 = 0.45, sx = 310, sy = 555;
  const SX = (mm) => sx + mm * s2;
  const SZ = (mm) => sy - mm * s2;
  g.text(sx - 10, 62, "POTONGAN BOX", "viewtitle");
  g.rect(sx - 15, sy, 500 * s2 + 30, 14, "paving");
  g.rect(SX(0), SZ(6), 100 * s2, 6 * s2, "rubber");
  g.rect(SX(400), SZ(6), 100 * s2, 6 * s2, "rubber");
  g.rect(SX(0), SZ(100), 100 * s2, 100 * s2, "wood2");
  g.rect(SX(400), SZ(100), 100 * s2, 100 * s2, "wood2");
  g.rect(SX(220), SZ(100), 100 * s2, 100 * s2, "wood");
  g.rect(SX(0), SZ(500), 500 * s2, 400 * s2, "ply");
  g.rect(SX(9), SZ(491), 482 * s2, 382 * s2, "sandfill");
  g.rect(SX(0), SZ(520), 500 * s2, 20 * s2, "wood2");
  g.rect(SX(0), SZ(535), 500 * s2, 15 * s2, "steel");
  g.boltV(SX(270), SZ(520), SZ(100));

  g.text(SX(250), SZ(300), "pasir/kerikil 300 kg", "lbl", "middle", -90);
  g.leader(SX(250), SZ(530), SX(250) + 48, SZ(530) - 14, "lid 9 + strap");
  g.text(SX(50), SZ(48), "kaki", "lbl", "middle");
  g.text(SX(270), SZ(48), "runner", "lbl", "middle");
  g.leader(SX(270), SZ(160), SX(270) + 40, SZ(160) + 20, "M8");
  g.text(SX(520), SZ(420), "banner", "lbl", "middle", -90);

  g.dimH(SX(0), SX(500), sy + 28, "500");
  g.dimV(SX(0) - 22, SZ(500), SZ(100), "400", SX(0), SX(0));
  g.dimV(SX(0) - 44, SZ(100), SZ(0), "100", SX(0), SX(0));
  g.dimH(SX(220), SX(320), sy + 54, "100");

  g.notes(14, 660, [
    "1. Box 500×1050×400; 2 kaki 100×100×1050 di kiri-kanan runner.",
    "2. Isi 12 kantong ×25 kg per box (300 kg); 24 kantong total.",
    "3. 2 strap 25 mm + 2×M8 ke runner; pad karet 6 mm di bawah kaki.",
    "4. Celah 20 mm ke banner; jangan duduk/berdiri di box saat angin.",
  ], 13);
  g.text(14, 755, "D5 · skala skematik 1:3,3 (rencana) / 1:2,2 (potongan) · dimensi mm", "psub");
}

/* ============================= D6 — LENGKUNG, BURUNG, SKIN ============================= */
function d6(g) {
  const s = 0.85;
  const ox = 80, oy = 250;
  const X = (mm) => ox + mm * s;
  const Z = (mm) => oy - mm * s;

  g.text(40, 62, "POTONGAN LENGKUNG", "viewtitle");
  g.rect(X(0), Z(100), 250 * s, 100 * s, "ply");
  g.rect(X(0), Z(100), 250 * s, 45 * s, "wood2");
  g.rect(X(0), Z(45), 250 * s, 45 * s, "wood2");
  g.rect(X(0), Z(100), 9 * s, 100 * s, "steel");
  for (let x = 30; x < 250; x += 60) g.circle(X(x), Z(50), 2.5, "steel");
  g.text(X(125), Z(118), "band 250", "lbl", "middle");
  g.leader(X(84), Z(50), X(0) - 26, Z(100) + 20, "skin 9", "end");
  g.leader(X(150), Z(72), X(150) + 56, Z(72) - 32, "spine 45×70 (2×)");
  g.text(X(125), Z(-24), "screw 4×40 @150", "lbl", "middle");
  g.dimH(X(0), X(250), Z(145), "250", X(0), X(250));
  g.dimV(X(0) - 22, Z(100), Z(0), "100", X(0), X(0));
  g.dimV(X(250) + 22, Z(100), Z(55), "45", X(250), X(250));
  g.dimV(X(250) + 44, Z(45), Z(0), "45", X(250), X(250));
  g.text(40, 296, "lengkung naik 500 mm; band 250 mm; ujung duduk di balok z=2.500", "note");

  const s2 = 0.25, bx = 330, by = 575;
  const BX = (mm) => bx + mm * s2;
  const BZ = (mm) => by - mm * s2;
  g.text(bx - 55, 62, "DETAIL BURUNG–TIANG", "viewtitle");
  g.rect(BX(-400), BZ(800), 800 * s2, 800 * s2, "dash");
  g.rect(BX(-125), BZ(12), 250 * s2, 12 * s2, "steel");
  g.rect(BX(-50), BZ(0), 100 * s2, 300 * s2, "wood");
  g.rect(BX(-50), BZ(150), 100 * s2, 138 * s2, "steel");
  g.path(`M ${BX(-50)} ${BZ(150)} L ${BX(-50)} ${BZ(300)} C ${BX(-160)} ${BZ(320)} ${BX(-230)} ${BZ(380)} ${BX(-230)} ${BZ(460)} C ${BX(-230)} ${BZ(560)} ${BX(-140)} ${BZ(620)} ${BX(-40)} ${BZ(620)} C ${BX(40)} ${BZ(620)} ${BX(95)} ${BZ(585)} ${BX(120)} ${BZ(540)} C ${BX(135)} ${BZ(585)} ${BX(160)} ${BZ(610)} ${BX(185)} ${BZ(600)} L ${BX(300)} ${BZ(560)} L ${BX(300)} ${BZ(530)} L ${BX(185)} ${BZ(500)} C ${BX(150)} ${BZ(430)} ${BX(110)} ${BZ(350)} ${BX(50)} ${BZ(300)} L ${BX(50)} ${BZ(150)} Z`, "banner");
  g.path(`M ${BX(-180)} ${BZ(460)} C ${BX(-120)} ${BZ(520)} ${BX(-40)} ${BZ(540)} ${BX(20)} ${BZ(500)} C ${BX(50)} ${BZ(460)} ${BX(20)} ${BZ(390)} ${BX(-50)} ${BZ(360)}`, "out2");
  for (const [x1, z1, x2, z2] of [[-230, 460, -390, 300], [-220, 430, -370, 250], [-205, 400, -340, 210], [-120, 600, -150, 720], [-90, 610, -105, 735]]) {
    g.line(BX(x1), BZ(z1), BX(x2), BZ(z2), "out2");
  }
  g.circle(BX(140), BZ(565), 2.5, "out2");
  g.bolt(BX(-30), BZ(160));
  g.bolt(BX(30), BZ(160));
  g.text(BX(0), 336, "burung 800×800×9 (tampak samping)", "lbl", "middle");
  g.leader(BX(50), BZ(180), BX(50) + 44, BZ(180) + 18, "tab 100×100×12");
  g.leader(BX(30), BZ(160), BX(30) + 50, BZ(160) + 48, "2×M8");
  g.text(BX(0), 642, "tiang 100×100×500", "lbl", "middle");
  g.text(BX(-400), BZ(-40), "burung di ujung lengkung, x=±1.750", "lbl");
  g.dimH(BX(-400), BX(400), 360, "800");
  g.dimV(BX(430), BZ(800), BZ(0), "800", BX(400), BX(400));

  g.notes(14, 660, [
    "1. Spine kayu 2×45×70, laminasi/kerf; skin 9 mm atau kain tebal.",
    "2. Sekrup 4×40 @150 mm + lem PU; semua tepi dicat waterproof.",
    "3. Burung 9 mm, tab 100×100×12; 2×M8 ke tiang/ujung lengkung.",
    "4. Cek kelurusan lengkung dengan tali; deviasi maks 5 mm.",
  ], 13);
  g.text(14, 755, "D6 · skala skematik 1:1,1 (potongan) / 1:3,6 (burung) · dimensi mm", "psub");
}

const p2 = [
  { x: 30, y: 80, w: 560, h: 790, id: "D4", title: "BANNER–REL–HANGER", sub: "2 hanger 6 mm · rel 600×80×60 · kantilever 300 · banner 600×1500", draw: d4 },
  { x: 620, y: 80, w: 560, h: 790, id: "D5", title: "BOX PEMBERAT–RUNNER", sub: "2×300 kg · box 500×1050×400 · 2×M8 + 2 strap", draw: d5 },
  { x: 1210, y: 80, w: 560, h: 790, id: "D6", title: "LENGKUNG, BURUNG & SKIN", sub: "spine 2×45×70 · band 250 · skin 9 mm/kain", draw: d6 },
];

writeFileSync(join(here, "detail-2.svg"), plate(
  "DETAIL SAMBUNGAN 2 — BANNER, PEMBERAT, LENGKUNG",
  "Tahap 3 · skala bervariasi · dimensi mm · potongan skematik, bukan gambar kerja tersertifikasi",
  p2
));
console.log("wrote detail-2.svg");
