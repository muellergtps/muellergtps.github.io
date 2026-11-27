import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const q = (v) => Number(v).toFixed(1);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const W = 1800, H = 1280;
const COLW = 870, ROWH = 285, X0 = 30, Y0 = 90, GAP = 20;
const S = 45;                 // px per metre

const CSS = `
.bg{fill:#fff}
.h1{fill:#241f1a;font:700 17px Consolas,monospace;letter-spacing:1.2px}
.sub{fill:#6b7280;font:10px Consolas,monospace}
.legend{fill:#4b5563;font:8.5px Consolas,monospace}
.ghost{fill:none;stroke:#d9d1c5;stroke-width:1;stroke-linejoin:round}
.ghostfill{fill:#f7f5f1;stroke:#d9d1c5;stroke-width:1;stroke-linejoin:round}
.solid{fill:#f3e7d6;stroke:#241f1a;stroke-width:1.15;stroke-linejoin:round}
.wood{fill:#e8d9c6;stroke:#241f1a;stroke-width:1.15;stroke-linejoin:round}
.beam{fill:#f0e2cd;stroke:#241f1a;stroke-width:1.15;stroke-linejoin:round}
.ballast{fill:#d9d4cc;stroke:#241f1a;stroke-width:1.15;stroke-linejoin:round}
.sand{fill:url(#sand);stroke:#8a7f70;stroke-width:1}
.banner{fill:#f7efe6;stroke:#b06a3b;stroke-width:1.1;stroke-linejoin:round}
.bannerband{fill:#b06a3b;stroke:#8a4f2b;stroke-width:.6}
.arch{fill:#d8a97a;stroke:#241f1a;stroke-width:1.05;stroke-linejoin:round}
.bird{fill:#241f1a;stroke:none}
.birdline{fill:none;stroke:#241f1a;stroke-width:1.2;stroke-linecap:round}
.warn{fill:#3a332c;stroke:none}
.hanger{fill:none;stroke:#5f5a52;stroke-width:1}
.ground{fill:none;stroke:#b8b0a4;stroke-width:1;stroke-dasharray:4 3}
.rowline{fill:none;stroke:#e5e0d8;stroke-width:1}
.cell{fill:#fcfbf9;stroke:#e5e0d8;stroke-width:1}
.stepnum{fill:#241f1a}
.steptx{fill:#fff;font:700 12px Consolas,monospace;text-anchor:middle}
.steptitle{fill:#241f1a;font:700 12px Consolas,monospace;letter-spacing:.4px}
.stepnote{fill:#4b5563;font:8.6px Consolas,monospace}
.tag{fill:#b06a3b;font:700 8px Consolas,monospace;letter-spacing:.5px}
.check{fill:none;stroke:#2f7d4f;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
`;

const DEFS = `<defs>
<pattern id="sand" width="5" height="5" patternUnits="userSpaceOnUse">
  <circle cx="1" cy="1" r=".7" fill="#b9b3a9"/>
</pattern>
</defs>`;

function makeG() {
  const a = [];
  const line = (x1, y1, x2, y2, cls = "solid") =>
    a.push(`<line x1="${q(x1)}" y1="${q(y1)}" x2="${q(x2)}" y2="${q(y2)}" class="${cls}"/>`);
  const rect = (x, y, w, h, cls = "solid") =>
    a.push(`<rect x="${q(x)}" y="${q(y)}" width="${q(w)}" height="${q(h)}" class="${cls}"/>`);
  const poly = (pts, cls = "solid") =>
    a.push(`<polygon points="${pts.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" class="${cls}"/>`);
  const path = (d, cls = "solid") => a.push(`<path d="${d}" class="${cls}"/>`);
  const circle = (x, y, r, cls = "solid") =>
    a.push(`<circle cx="${q(x)}" cy="${q(y)}" r="${q(r)}" class="${cls}"/>`);
  const text = (x, y, s, cls = "stepnote", anchor = "start") =>
    a.push(`<text x="${q(x)}" y="${q(y)}" class="${cls}" text-anchor="${anchor}">${esc(s)}</text>`);
  return { a, line, rect, poly, path, circle, text };
}

/* ---------- front-elevation components ---------- */
function runner(g, X, Z, side, cls) {
  const x = side * 1.25;
  g.rect(X(x - 0.05), Z(0.1), 0.1 * S, 0.1 * S, cls);
}

function ballastBox(g, X, Z, side, cls) {
  const x0 = side > 0 ? 0.98 : -1.48;
  g.rect(X(x0), Z(0.5), 0.5 * S, 0.4 * S, cls);
}

function pillar(g, X, Z, side, cls) {
  const p = side > 0
    ? [[1.5, 0], [1.0, 0], [1.1, 2.0], [1.5, 2.0]]
    : [[-1.5, 0], [-1.0, 0], [-1.1, 2.0], [-1.5, 2.0]];
  g.poly(p.map(([x, z]) => [X(x), Z(z)]), cls);
}

function beam(g, X, Z, cls) {
  g.rect(X(-1.8), Z(2.5), 3.6 * S, 0.5 * S, cls);
  g.rect(X(-1.7), Z(2.12), 3.4 * S, 0.08 * S, "warn");
}

function arch(g, X, Z, cls) {
  const pts = [];
  for (let i = 0; i <= 36; i++) {
    const x = -1.8 + (3.6 * i) / 36;
    pts.push([X(x), Z(2.5 + 0.5 * (x / 1.8) ** 2)]);
  }
  for (let i = 36; i >= 0; i--) {
    const x = -1.8 + (3.6 * i) / 36;
    pts.push([X(x), Z(2.5 + 0.5 * (x / 1.8) ** 2 - 0.25)]);
  }
  g.poly(pts, cls);
}

function post(g, X, Z, side, cls) {
  g.rect(X(side * 1.75 - 0.05), Z(3.0), 0.1 * S, 0.5 * S, cls);
}

function bird(g, X, Z, side, cls) {
  const bx = X(side * 1.8), bz = Z(3.2);
  const d = `M ${q(bx - 7)} ${q(bz)} C ${q(bx - 8)} ${q(bz - 8)} ${q(bx + 2)} ${q(bz - 10)} ${q(bx + 5)} ${q(bz - 4)} L ${q(bx + 14)} ${q(bz - 5)} L ${q(bx + 5)} ${q(bz + 1)} C ${q(bx + 4)} ${q(bz + 7)} ${q(bx - 4)} ${q(bz + 7)} ${q(bx - 7)} ${q(bz)} Z`;
  g.path(d, cls);
  g.line(bx - 5, bz + 2, bx - 13, bz + 8, "birdline");
  g.line(bx + 1, bz - 8, bx - 1, bz - 13, "birdline");
}

function banner(g, X, Z, side, cls) {
  const x0 = side > 0 ? 1.5 : -2.1;
  g.rect(X(x0), Z(1.5), 0.6 * S, 1.5 * S, cls);
  g.rect(X(x0 + 0.03), Z(1.46), 0.54 * S, 0.2 * S, "bannerband");
  g.circle(X(x0 + 0.3), Z(0.86), 2.4, "bannerband");
  g.rect(X(x0), Z(1.54), 0.6 * S, 0.06 * S, "wood");
  for (const hx of [x0, x0 + 0.3]) g.line(X(hx), Z(2.0), X(hx), Z(1.54), "hanger");
}

function scene(g, baseY, cx, step) {
  const X = (m) => cx + m * S;
  const Z = (m) => baseY - m * S;

  /* ground */
  g.line(X(-2.35), Z(0), X(2.35), Z(0), "ground");

  /* ghost of the complete gapura */
  runner(g, X, Z, -1, "ghost");
  runner(g, X, Z, 1, "ghost");
  ballastBox(g, X, Z, -1, "ghostfill");
  ballastBox(g, X, Z, 1, "ghostfill");
  pillar(g, X, Z, -1, "ghost");
  pillar(g, X, Z, 1, "ghost");
  beam(g, X, Z, "ghost");
  arch(g, X, Z, "ghost");
  post(g, X, Z, -1, "ghost");
  post(g, X, Z, 1, "ghost");
  bird(g, X, Z, -1, "ghostfill");
  bird(g, X, Z, 1, "ghostfill");
  banner(g, X, Z, -1, "ghost");
  banner(g, X, Z, 1, "ghost");

  /* installed work up to this step */
  if (step >= 1) {
    runner(g, X, Z, -1, "wood");
    runner(g, X, Z, 1, "wood");
  }
  if (step >= 2) pillar(g, X, Z, -1, "solid");
  if (step >= 3) pillar(g, X, Z, 1, "solid");
  if (step >= 4) beam(g, X, Z, "beam");
  if (step >= 5) {
    arch(g, X, Z, "arch");
    post(g, X, Z, -1, "wood");
    post(g, X, Z, 1, "wood");
  }
  if (step >= 6) {
    bird(g, X, Z, -1, "bird");
    bird(g, X, Z, 1, "bird");
  }
  /* boxes are in front of the pillars (y = 0.70–1.75) */
  if (step >= 1) {
    ballastBox(g, X, Z, -1, "ballast");
    ballastBox(g, X, Z, 1, "ballast");
  }
  if (step >= 7) {
    banner(g, X, Z, -1, "banner");
    banner(g, X, Z, 1, "banner");
  }
  if (step >= 8) {
    ballastBox(g, X, Z, -1, "sand");
    ballastBox(g, X, Z, 1, "sand");
    g.path(`M ${q(X(1.95))} ${q(Z(0.45))} L ${q(X(2.05))} ${q(Z(0.35))} L ${q(X(2.22))} ${q(Z(0.58))}`, "check");
  }

  /* small step caption */
  g.text(cx, baseY - 3.4 * S - 10, `LANGKAH ${step}`, "tag", "middle");
}

const STEPS = [
  {
    t: "SET OUT & RUNNER",
    n: [
      "Tandai garis tengah dan x=±1.25; runner y=0.15–1.75. Cek diagonal.",
      "Letakkan 2 runner 100×100; ratakan. Box pemberat kosong di atas runner.",
      "Jangan bor paving; semua beban lewat alas kayu/karet.",
    ],
  },
  {
    t: "PILAR KIRI",
    n: [
      "Berdirikan rangka pilar kiri di atas runner; masuk ke notch 100×100.",
      "Pasang 2 saddle 100×100×300 + 2×M10 tembus; ring Ø30 dua sisi.",
      "Cek plumb dengan unting; pasang gusset sementara ke runner.",
    ],
  },
  {
    t: "PILAR KANAN",
    n: [
      "Ulangi langkah 2 untuk pilar kanan.",
      "Cek jarak atas 2.200 mm, jarak bawah 2.000 mm, dan diagonal bukaan.",
      "Kedua pilar harus berdiri tanpa goyang sebelum balok diangkat.",
    ],
  },
  {
    t: "BALOK",
    n: [
      "Angkat balok 3.600×500×500 dengan 4 orang; jangan angkat satu sisi.",
      "Letakkan di atas pilar; 4×M10×160 per sisi + gusset 200×200×9.",
      "Cek level balok dan plumb pilar; kencangkan baut silang.",
    ],
  },
  {
    t: "LENGKUNG & TIANG BURUNG",
    n: [
      "Pasang lengkung band 250 di atas balok; lem PU + sekrup @150 mm.",
      "Pasang 2 tiang burung 100×100×500 di x=±1.750, y=0.40.",
      "Cek simetri lengkung dengan tali; deviasi maks 5 mm.",
    ],
  },
  {
    t: "BURUNG",
    n: [
      "Pasang burung 800×800×9 di ujung lengkung/tiang burung.",
      "Tab 100×100×12 + 2×M8 per burung; ring Ø25; cek vertikal.",
      "Cek kiri-kanan simetris; burung tidak boleh menyentuh tenda.",
    ],
  },
  {
    t: "BANNER & REL",
    n: [
      "Pasang rel 600×80×60 dan 2 hanger Ø6 per banner.",
      "Masukkan banner 600×1500; 3 sekrup kecil tiap ujung; safety wire.",
      "Cek celah 20 mm ke box pemberat; banner tidak menempel tenda.",
    ],
  },
  {
    t: "PEMBERAT & SERAH TERIMA",
    n: [
      "Isi 12 kantong ×25 kg per box (300 kg/sisi); padatkan; tutup + strap.",
      "Pasang 2×M8 box–runner; cek semua baut, ring, dan plumb.",
      "Isi checklist, foto, dan serah terima. Jangan dipakai tanpa 600 kg.",
    ],
  },
];

const body = [];
body.push(`<text x="30" y="36" class="h1">URUTAN RAKIT — GAPURA PAPUA STMKG</text>`);
body.push(`<text x="30" y="54" class="sub">Tahap 4 · 8 langkah · skematik, bukan gambar kerja tersertifikasi · dimensi mm · tenda tidak digambar dan tidak dibebani</text>`);
body.push(`<text x="30" y="72" class="legend">garis abu = belum terpasang · garis hitam = langkah ini · tenda tidak digambar dan tidak dibebani</text>`);
body.push(`<text x="1770" y="72" class="legend" text-anchor="end">skala gambar ± 1:22 · tinggi total 3.400</text>`);

for (let i = 0; i < STEPS.length; i++) {
  const col = i % 2, row = Math.floor(i / 2);
  const cx0 = X0 + col * (COLW + GAP);
  const cy0 = Y0 + row * ROWH;
  const s = STEPS[i];
  body.push(`<rect x="${cx0}" y="${cy0}" width="${COLW}" height="${ROWH - 10}" class="cell"/>`);
  body.push(`<circle cx="${cx0 + 32}" cy="${cy0 + 40}" r="17" class="stepnum"/>`);
  body.push(`<text x="${cx0 + 32}" y="${cy0 + 44}" class="steptx">${i + 1}</text>`);
  body.push(`<text x="${cx0 + 62}" y="${cy0 + 35}" class="steptitle">${esc(s.t)}</text>`);
  s.n.forEach((line, j) => body.push(`<text x="${cx0 + 62}" y="${cy0 + 58 + j * 14}" class="stepnote">${esc(line)}</text>`));
  const g = makeG();
  scene(g, cy0 + 250, cx0 + 700, i + 1);
  body.push(g.a.join(""));
}

body.push(`<text x="30" y="1248" class="sub">Prasyarat: paving rata/kering · G ≥ 0.700 m · puncak tenda terukur · 24 kantong pasir 25 kg siap · 4 orang untuk angkat balok.</text>`);
body.push(`<text x="30" y="1264" class="sub">Alat: kunci 10/13/17, bor, impact driver, waterpass, unting, tali, tangga 2, APD. Semua baut tembus + ring lebar; jangan mengandalkan sekrup untuk momen.</text>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${DEFS}<style>${CSS}</style><rect width="${W}" height="${H}" fill="#fff"/>${body.join("")}</svg>`;
writeFileSync(join(here, "urutan-rakit.svg"), svg);
console.log("wrote urutan-rakit.svg");
