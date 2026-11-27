import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.opencode/skills/anatomy/kit/iso-kit.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const W = 870, H = 944;
const AZ = 60, EL = 30;

const P = k.fitProjection([
  [-2.9, -3.2, 0], [2.9, -3.2, 0], [2.9, 2.1, 0], [-2.9, 2.1, 0],
  [0, -1.5, 3.2], [-2.2, 0.45, 3.4], [2.2, 0.45, 3.4], [-2.4, 0.45, 3.4],
], W, H, { pad: 46, headroom: 92, azimuth: AZ, elevation: EL });

const at = (p) => k.iso(p, P);
const S = (paths, style) => k.solidSvg(paths, style);
const L = (d, style) => k.lineSvg(d, style);
const D = (points, style) => k.dotsSvg(points, style);

function oriented(points) {
  let area = 0;
  for (let i = 0; i < points.length; i++) {
    const [ax, ay] = points[i], [bx, by] = points[(i + 1) % points.length];
    area += ax * by - bx * ay;
  }
  return area < 0 ? [...points].reverse() : points;
}

function taperedSvg(base, top, z0, z1, proj, opts = {}) {
  const n = base.length;
  const B = base.map(([x, y]) => k.iso([x, y, z0], proj));
  const T = top.map(([x, y]) => k.iso([x, y, z1], proj));
  const [vx, vy] = k.towardViewer(proj);
  const { sinA, cosA } = k.cameraOf(proj);
  let area = 0;
  for (let i = 0; i < n; i++) {
    const [ax, ay] = base[i], [bx, by] = base[(i + 1) % n];
    area += ax * by - bx * ay;
  }
  const counter = area > 0;
  const normals = base.map(([ax, ay], i) => {
    const [bx, by] = base[(i + 1) % n];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1;
    return counter ? [dy / len, -dx / len] : [-dy / len, dx / len];
  });
  const facing = normals.map(([nx, ny]) => nx * vx + ny * vy > 1e-9);
  const fills = [k.pathOf(oriented(T), true), k.pathOf(oriented(B), true)];
  const buckets = [[], [], [], []];
  for (let i = 0; i < n; i++) {
    if (!facing[i]) continue;
    const next = (i + 1) % n;
    const face = oriented([T[i], T[next], B[next], B[i]]);
    fills.push(k.pathOf(face, true));
    const lit = (normals[i][0] * -sinA + normals[i][1] * cosA + 1) / 2;
    const shade = Math.min(3, Math.max(0, Math.floor(lit * 4)));
    buckets[shade].push(k.pathOf(face, true));
  }
  const crease = [], outline = [];
  const runs = (value) => {
    const out = []; let run = [];
    for (let i = 0; i < n; i++) {
      if (facing[i] === value) run.push(i);
      else if (run.length) { out.push(run); run = []; }
    }
    if (run.length) out.push(run);
    if (out.length > 1 && facing[0] === value && facing[n - 1] === value) {
      const last = out.pop(), first = out.shift();
      out.push([...last, ...first]);
    }
    return out;
  };
  for (const run of runs(false)) outline.push(k.pathOf(run.map((i) => T[i])));
  for (const run of runs(true)) {
    crease.push(k.pathOf(run.map((i) => T[i])));
    outline.push(k.pathOf(run.map((i) => B[i])));
  }
  for (let i = 0; i < n; i++) {
    if (facing[i] !== facing[(i + n - 1) % n]) outline.push(k.pathOf([T[i], B[i]]));
  }
  return k.solidSvg({
    fill: fills.join(""), shades: buckets, top: k.pathOf(oriented(T), true),
    outline: outline.join(""), crease: crease.join(""),
  }, opts);
}

const STYLE = `<style>
.iso[data-theme="light"]{
  --anatomy-paper:#ffffff;--anatomy-card:#ffffff;--anatomy-top:#fdfaf4;
  --anatomy-shade-0:#d6cabb;--anatomy-shade-1:#e2d8ca;--anatomy-shade-2:#eee7db;--anatomy-shade-3:#f7f2e9;
  --anatomy-hi:#241f1a;--anatomy-mid:#7c7163;--anatomy-lo:#a89b8a;--anatomy-faint:#d9d1c5;
  --anatomy-halo:#8a7f70;--anatomy-halo-opacity:.18;
}
.i-ground .iso-fill{fill:#f3f1ed}
.i-ground .iso-shade[data-shade="0"]{fill:#e8e5df}
.i-ground .iso-shade[data-shade="1"]{fill:#eeebe6}
.i-ground .iso-shade[data-shade="2"]{fill:#f3f1ed}
.i-ground .iso-shade[data-shade="3"]{fill:#f7f5f2}
.i-ground .iso-top{fill:#faf9f6}
.i-ground .iso-edge{stroke:#c8c2b8}
.i-timber .iso-fill{fill:#e9dcc9}
.i-timber .iso-shade[data-shade="0"]{fill:#c8a97e}
.i-timber .iso-shade[data-shade="1"]{fill:#d8bd97}
.i-timber .iso-shade[data-shade="2"]{fill:#e5d2b6}
.i-timber .iso-shade[data-shade="3"]{fill:#f0e2cd}
.i-timber .iso-top{fill:#f6ead8}
.i-ballast .iso-fill{fill:#d9d4cc}
.i-ballast .iso-shade[data-shade="0"]{fill:#b9b3a9}
.i-ballast .iso-shade[data-shade="1"]{fill:#c8c2b8}
.i-ballast .iso-shade[data-shade="2"]{fill:#d9d4cc}
.i-ballast .iso-shade[data-shade="3"]{fill:#e5e0d8}
.i-ballast .iso-top{fill:#eeeae3}
.i-banner .iso-fill{fill:#f7efe6}
.i-banner .iso-shade[data-shade="0"]{fill:#d9b79a}
.i-banner .iso-shade[data-shade="1"]{fill:#e5c9ae}
.i-banner .iso-shade[data-shade="2"]{fill:#f0ddc9}
.i-banner .iso-shade[data-shade="3"]{fill:#f7e9db}
.i-banner .iso-top{fill:#fbf1e6}
.i-banner .iso-edge{stroke:#b06a3b}
.i-banner-inner .iso-fill{fill:#fffdf8}
.i-banner-inner .iso-shade[data-shade="0"]{fill:#f3e7d7}
.i-banner-inner .iso-shade[data-shade="1"]{fill:#f7efe4}
.i-banner-inner .iso-shade[data-shade="2"]{fill:#fbf5ec}
.i-banner-inner .iso-shade[data-shade="3"]{fill:#fffdf8}
.i-banner-inner .iso-top{fill:#ffffff}
.i-banner-inner .iso-edge{stroke:#d8b79a}
.i-arch-front{fill:#d8a97a;stroke:#2a2520;stroke-width:.8;stroke-linejoin:round}
.i-arch-outer{fill:#b97c47;stroke:#2a2520;stroke-width:.65;stroke-linejoin:round}
.i-arch-inner{fill:#8a5a3b;stroke:none}
.i-arch-cap{fill:#b97c47;stroke:#2a2520;stroke-width:.65;stroke-linejoin:round}
.i-arch-line{fill:none;stroke:#f7efe6;stroke-width:.7;stroke-dasharray:2 2.5}
.i-post .iso-fill{fill:#d8bd97}
.i-post .iso-shade[data-shade="0"]{fill:#a8875f}
.i-post .iso-shade[data-shade="1"]{fill:#b99a70}
.i-post .iso-shade[data-shade="2"]{fill:#c9ad86}
.i-post .iso-shade[data-shade="3"]{fill:#d8bd97}
.i-post .iso-top{fill:#e5d0b2}
.i-collar{fill:#3a332c;stroke:#241f1a;stroke-width:.4}
.i-collar-solid .iso-fill{fill:#3a332c}
.i-collar-solid .iso-shade[data-shade="0"]{fill:#2a2520}
.i-collar-solid .iso-shade[data-shade="1"]{fill:#302a24}
.i-collar-solid .iso-shade[data-shade="2"]{fill:#3a332c}
.i-collar-solid .iso-shade[data-shade="3"]{fill:#4a4238}
.i-collar-solid .iso-top{fill:#4a4238}
.i-collar-solid .iso-edge{stroke:#241f1a}
.i-hanger{fill:none;stroke:#5f5a52;stroke-width:1.2;stroke-linecap:round}
.i-banner-head{fill:#b06a3b;stroke:#8a4f2b;stroke-width:.4}
.i-banner-emblem{fill:#f7efe6;stroke:#8a4f2b;stroke-width:.5}
.i-banner-text{fill:none;stroke:#b06a3b;stroke-width:.5;stroke-linecap:round}
.i-bird-back{fill:#4a4238;stroke:none}
.i-bird{fill:#241f1a;stroke:none}
.i-bird-line{fill:none;stroke:#241f1a;stroke-width:1.6;stroke-linecap:round}
.i-bird-detail{fill:none;stroke:#f4ecdf;stroke-width:.9;stroke-linecap:round}
.i-bird-eye{fill:#f4ecdf;stroke:none}
.i-warn{fill:#3a332c;stroke:#3a332c;stroke-width:.3}
.i-warn-dash{fill:none;stroke:#f4ecdf;stroke-width:.6}
.i-callout{fill:#241f1a;font:11px Consolas,monospace;letter-spacing:.02em;paint-order:stroke;stroke:#fff;stroke-width:3px;stroke-linejoin:round}
.i-leader{fill:none;stroke:#8a7f70;stroke-width:.7;stroke-dasharray:2 2}
.i-dot{fill:#241f1a;stroke:none}
.i-dim{fill:none;stroke:#3e63dd;stroke-width:.9}
.i-dimtx{fill:#3e63dd;font:10px Consolas,monospace;paint-order:stroke;stroke:#fff;stroke-width:3px}
.i-title{fill:#241f1a;font:700 15px Consolas,monospace;letter-spacing:1px}
.i-sub{fill:#6b7280;font:10px Consolas,monospace}
.i-note{fill:#6b7280;font:9.5px Consolas,monospace}
</style>`;

const body = [];

/* ground */
body.push(S(k.slabOf({ x: -2.9, y: -3.2, w: 5.8, d: 5.3, r: 0.02 }, -0.05, 0.05, P, 4, 0.01),
  { tone: "lo", crease: "none", className: "i-ground" }));
const grid = [];
for (let x = -2.5; x <= 2.5; x += 0.5) grid.push(k.lineOnTop([x, -3.1], [x, 2.0], 0.001, P));
for (let y = -3; y <= 2; y += 0.5) grid.push(k.lineOnTop([-2.8, y], [2.8, y], 0.001, P));
body.push(L(grid.join(""), { tone: "faint" }));

/* tent ghost */
const corners = [[-1.5, -3], [1.5, -3], [1.5, 0], [-1.5, 0]];
const peak = [0, -1.5, 3.2];
const tent = [];
for (let i = 0; i < 4; i++) {
  const [x1, y1] = corners[i], [x2, y2] = corners[(i + 1) % 4];
  tent.push(k.segment([x1, y1, 0], [x2, y2, 0], P));
  tent.push(k.segment([x1, y1, 0], [x1, y1, 2.5], P));
  tent.push(k.segment([x1, y1, 2.5], [x2, y2, 2.5], P));
  tent.push(k.segment([x1, y1, 2.5], peak, P));
}
body.push(L(tent.join(""), { tone: "lo", dashed: true }));
body.push(D([at(peak)], { size: 0.6, tone: "lo" }));

/* runners */
for (const cx of [-1.25, 1.25]) {
  body.push(S(k.slabOf({ x: cx - 0.05, y: 0.15, w: 0.1, d: 1.6, r: 0.01 }, 0, 0.1, P, 4, 0.008),
    { tone: "hi", crease: "lo", className: "i-timber" }));
}

/* pillars */
const leftBase = [[-1.5, 0.15], [-1.0, 0.15], [-1.0, 0.65], [-1.5, 0.65]];
const leftTop = [[-1.5, 0.25], [-1.1, 0.25], [-1.1, 0.65], [-1.5, 0.65]];
const rightBase = [[1.0, 0.15], [1.5, 0.15], [1.5, 0.65], [1.0, 0.65]];
const rightTop = [[1.1, 0.25], [1.5, 0.25], [1.5, 0.65], [1.1, 0.65]];
body.push(taperedSvg(leftBase, leftTop, 0, 2.0, P, { tone: "hi", crease: "lo", className: "i-pillar" }));
body.push(taperedSvg(rightBase, rightTop, 0, 2.0, P, { tone: "hi", crease: "lo", className: "i-pillar" }));

/* arch swag */
const N = 36;
const xs = Array.from({ length: N + 1 }, (_, i) => -1.8 + (3.6 * i) / N);
const zO = (x) => 2.5 + 0.5 * (x / 1.8) ** 2;
const zI = (x) => zO(x) - 0.25;
const yF = 0.45, yB = 0.35;
const fo = xs.map((x) => at([x, yF, zO(x)]));
const fi = [...xs].reverse().map((x) => at([x, yF, zI(x)]));
const bo = xs.map((x) => at([x, yB, zO(x)]));
const bi = [...xs].reverse().map((x) => at([x, yB, zI(x)]));
const archFront = k.pathOf([...fo, ...fi], true);
const archOuter = k.pathOf([...fo, ...bo.slice().reverse()], true);
const archInner = k.pathOf([...fi, ...bi.slice().reverse()], true);
const archCap = k.pathOf([fo[N], fi[0], bi[0], bo[N]], true);
const archLine = k.pathOf(xs.map((x) => at([x, 0.451, zO(x) - 0.125])), false);
body.push(`<path class="i-arch-inner" d="${archInner}"/><path class="i-arch-outer" d="${archOuter}"/><path class="i-arch-cap" d="${archCap}"/><path class="i-arch-front" d="${archFront}"/><path class="i-arch-line" d="${archLine}"/>`);

/* beam */
body.push(S(k.slabOf({ x: -1.8, y: 0.15, w: 3.6, d: 0.5, r: 0.01 }, 2.0, 0.5, P, 4, 0.01),
  { tone: "hi", crease: "lo", className: "i-beam" }));
const warn = [[-1.7, 0.652, 2.04], [1.7, 0.652, 2.04], [1.7, 0.652, 2.12], [-1.7, 0.652, 2.12]].map((p) => at(p));
body.push(`<path class="i-warn" d="${k.pathOf(warn, true)}"/>`);
const dashes = [];
for (let x = -1.64; x <= 1.64; x += 0.12) {
  dashes.push(k.segment([x, 0.653, 2.04], [x + 0.05, 0.653, 2.12], P));
}
body.push(`<path class="i-warn-dash" d="${dashes.join("")}"/>`);

/* posts */
for (const x of [-1.75, 1.75]) {
  body.push(S(k.slabOf({ x: x - 0.05, y: 0.35, w: 0.1, d: 0.1, r: 0.005 }, 2.5, 0.5, P, 4, 0.004),
    { tone: "hi", crease: "lo", className: "i-post" }));
  body.push(S(k.slabOf({ x: x - 0.065, y: 0.285, w: 0.13, d: 0.13, r: 0.005 }, 2.94, 0.06, P, 4, 0.003),
    { tone: "hi", crease: "lo", className: "i-collar-solid" }));
}

/* birds */
function bird(s) {
  const pt = (u, v) => {
    const [sx, sy] = at([s * (1.8 + u), 0.45, 3 + v]);
    return `${sx.toFixed(1)} ${sy.toFixed(1)}`;
  };
  const bodyD = `M ${pt(0, 0.02)} C ${pt(-0.05, 0.10)} ${pt(-0.06, 0.22)} ${pt(0, 0.30)} C ${pt(0.05, 0.37)} ${pt(0.14, 0.37)} ${pt(0.19, 0.32)} C ${pt(0.23, 0.28)} ${pt(0.20, 0.18)} ${pt(0.15, 0.11)} C ${pt(0.10, 0.04)} ${pt(0.04, -0.01)} ${pt(0, 0.02)} Z`;
  const beakD = `M ${pt(0.14, 0.30)} C ${pt(0.16, 0.36)} ${pt(0.21, 0.39)} ${pt(0.25, 0.36)} L ${pt(0.40, 0.31)} L ${pt(0.26, 0.29)} C ${pt(0.22, 0.25)} ${pt(0.17, 0.25)} ${pt(0.14, 0.30)} Z`;
  const wingD = `M ${pt(0.02, 0.26)} C ${pt(0.08, 0.29)} ${pt(0.16, 0.25)} ${pt(0.18, 0.19)} C ${pt(0.14, 0.15)} ${pt(0.06, 0.15)} ${pt(0.02, 0.19)} Z`;
  const crest = [
    `M ${pt(0.22, 0.37)} C ${pt(0.18, 0.40)} ${pt(0.10, 0.40)} ${pt(0.04, 0.38)}`,
    `M ${pt(0.22, 0.37)} C ${pt(0.16, 0.39)} ${pt(0.08, 0.39)} ${pt(0.02, 0.34)}`,
    `M ${pt(0.22, 0.37)} C ${pt(0.20, 0.40)} ${pt(0.16, 0.40)} ${pt(0.11, 0.39)}`,
  ];
  const tail = [
    `M ${pt(0, 0.04)} C ${pt(-0.10, 0.00)} ${pt(-0.24, -0.12)} ${pt(-0.38, -0.36)}`,
    `M ${pt(0.02, 0.04)} C ${pt(-0.06, -0.04)} ${pt(-0.18, -0.20)} ${pt(-0.30, -0.40)}`,
    `M ${pt(0, 0.04)} C ${pt(-0.12, 0.04)} ${pt(-0.26, -0.02)} ${pt(-0.36, -0.12)}`,
  ];
  const feet = [
    `M ${pt(0.01, 0.02)} L ${pt(0.01, -0.03)}`,
    `M ${pt(0.05, 0.02)} L ${pt(0.05, -0.03)}`,
    `M ${pt(-0.02, -0.03)} Q ${pt(0.01, -0.06)} ${pt(0.04, -0.03)}`,
    `M ${pt(0.03, -0.03)} Q ${pt(0.06, -0.06)} ${pt(0.08, -0.02)}`,
  ];
  const wingDetail = `M ${pt(0.04, 0.23)} C ${pt(0.09, 0.24)} ${pt(0.14, 0.22)} ${pt(0.16, 0.19)}`;
  const eye = at([s * 1.97, 0.45, 3.33]);
  return `<path class="i-bird-back" d="${bodyD}${beakD}${wingD}" transform="translate(4,-2)"/>`
    + `<path class="i-bird" d="${bodyD}${beakD}${wingD}"/>`
    + `<path class="i-bird-line" d="${crest.concat(tail, feet).join("")}"/>`
    + `<path class="i-bird-detail" d="${wingDetail}"/>`
    + `<circle class="i-bird-eye" cx="${eye[0].toFixed(1)}" cy="${eye[1].toFixed(1)}" r="1.1"/>`;
}
body.push(bird(-1));
body.push(bird(1));

/* banners: top rail, hanger rods, printed sheet */
for (const x0 of [-2.1, 1.5]) {
  body.push(S(k.slabOf({ x: x0, y: 0.76, w: 0.6, d: 0.08, r: 0.005 }, 1.48, 0.06, P, 4, 0.004),
    { tone: "hi", crease: "lo", className: "i-timber" }));
  for (const f of [0.0, 0.3]) {
    const hx = x0 + f;
    const a = at([hx, 0.82, 1.54]), b = at([hx, 0.65, 2.0]);
    body.push(`<path class="i-hanger" d="M ${a[0].toFixed(1)} ${a[1].toFixed(1)} L ${b[0].toFixed(1)} ${b[1].toFixed(1)}"/>`);
    body.push(`<circle cx="${a[0].toFixed(1)}" cy="${a[1].toFixed(1)}" r="1.4" class="i-dot"/>`);
    body.push(`<circle cx="${b[0].toFixed(1)}" cy="${b[1].toFixed(1)}" r="1.4" class="i-dot"/>`);
  }
  body.push(S(k.slabOf({ x: x0, y: 0.78, w: 0.6, d: 0.04, r: 0.005 }, 0, 1.5, P, 4, 0.004),
    { tone: "mid", crease: "none", className: "i-banner" }));
  const face = 0.821;
  const band = [[x0 + 0.03, face, 1.26], [x0 + 0.57, face, 1.26], [x0 + 0.57, face, 1.46], [x0 + 0.03, face, 1.46]].map((p) => at(p));
  body.push(`<path class="i-banner-head" d="${k.pathOf(band, true)}"/>`);
  const bandLine = k.pathOf([at([x0 + 0.1, face + 0.001, 1.36]), at([x0 + 0.5, face + 0.001, 1.36])], false);
  body.push(`<path d="${bandLine}" fill="none" stroke="#f7efe6" stroke-width=".7"/>`);
  const emblem = [];
  for (let i = 0; i < 24; i++) {
    const ang = (Math.PI * 2 * i) / 24;
    emblem.push(at([x0 + 0.3 + 0.08 * Math.cos(ang), face + 0.001, 0.86 + 0.08 * Math.sin(ang)]));
  }
  body.push(`<path class="i-banner-emblem" d="${k.pathOf(emblem, true)}"/>`);
  const em = at([x0 + 0.3, face + 0.002, 0.86]);
  body.push(`<circle cx="${em[0].toFixed(1)}" cy="${em[1].toFixed(1)}" r="2.2" fill="#b06a3b"/>`);
  for (const z of [0.58, 0.50, 0.42, 0.34]) {
    const line = k.pathOf([at([x0 + 0.12, face + 0.001, z]), at([x0 + 0.48, face + 0.001, z])], false);
    body.push(`<path class="i-banner-text" d="${line}"/>`);
  }
}

/* ballast: 500 x 1050 x 400 box per side, 2 x 300 kg */
for (const cx of [-1.25, 1.25]) {
  const x0 = cx > 0 ? 0.98 : -1.48;
  for (const fx of [x0, x0 + 0.4]) {
    body.push(S(k.slabOf({ x: fx, y: 0.70, w: 0.1, d: 1.05, r: 0.008 }, 0, 0.1, P, 4, 0.006),
      { tone: "mid", crease: "lo", className: "i-timber" }));
  }
  body.push(S(k.slabOf({ x: x0, y: 0.70, w: 0.5, d: 1.05, r: 0.01 }, 0.1, 0.4, P, 4, 0.008),
    { tone: "hi", crease: "lo", className: "i-ballast" }));
  body.push(S(k.slabOf({ x: x0 + 0.01, y: 0.71, w: 0.48, d: 1.03, r: 0.008 }, 0.5, 0.02, P, 4, 0.006),
    { tone: "hi", crease: "lo", className: "i-ballast" }));
  for (const sy of [0.90, 1.50]) {
    body.push(S(k.slabOf({ x: x0 - 0.005, y: sy, w: 0.51, d: 0.03, r: 0.004 }, 0.505, 0.015, P, 4, 0.004),
      { tone: "hi", crease: "none", className: "i-collar-solid" }));
  }
}

/* dimensions */
const xd = -2.35, yd = 0.45;
const p0 = at([xd, yd, 0]), p1 = at([xd, yd, 3.4]);
body.push(`<path class="i-dim" d="M ${p0[0].toFixed(1)} ${p0[1].toFixed(1)} L ${p1[0].toFixed(1)} ${p1[1].toFixed(1)}"/>`);
body.push(`<path class="i-dim" d="M ${(p0[0] - 5).toFixed(1)} ${p0[1].toFixed(1)} L ${(p0[0] + 5).toFixed(1)} ${p0[1].toFixed(1)}"/>`);
body.push(`<path class="i-dim" d="M ${(p1[0] - 5).toFixed(1)} ${p1[1].toFixed(1)} L ${(p1[0] + 5).toFixed(1)} ${p1[1].toFixed(1)}"/>`);
body.push(L(k.segment([-2.2, yd, 3.4], [xd, yd, 3.4], P), { tone: "blue" }));
body.push(L(k.segment([-2.2, yd, 0.02], [xd, yd, 0.02], P), { tone: "blue" }));
const ty = (p0[1] + p1[1]) / 2;
body.push(`<text x="${(p0[0] - 9).toFixed(1)}" y="${ty.toFixed(1)}" class="i-dimtx" text-anchor="middle" transform="rotate(-90 ${(p0[0] - 9).toFixed(1)} ${ty.toFixed(1)})">3.400</text>`);

/* gap dimension in the opening */
const g0 = at([0, 0, 0.4]), g1 = at([0, 0.15, 0.4]);
body.push(`<path class="i-dim" d="M ${g0[0].toFixed(1)} ${g0[1].toFixed(1)} L ${g1[0].toFixed(1)} ${g1[1].toFixed(1)}"/>`);
body.push(L(k.segment([-0.04, 0, 0.4], [0.04, 0, 0.4], P), { tone: "blue" }));
body.push(L(k.segment([-0.04, 0.15, 0.4], [0.04, 0.15, 0.4], P), { tone: "blue" }));

/* callouts */
function callout(text, p, dx, dy, anchor = "start") {
  const [sx, sy] = at(p);
  const tx = sx + dx, ty2 = sy + dy;
  body.push(`<path class="i-leader" d="M ${sx.toFixed(1)} ${sy.toFixed(1)} L ${tx.toFixed(1)} ${ty2.toFixed(1)}"/>`);
  body.push(`<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="2.2" class="i-dot"/>`);
  body.push(`<text x="${tx.toFixed(1)}" y="${ty2.toFixed(1)}" class="i-callout" text-anchor="${anchor}">${esc(text)}</text>`);
}
callout("TENDA 3×3 — TIDAK DIBEBANI", [0, -1.5, 3.2], 34, -24);
callout("BALOK 500×500", [1.2, 0.65, 2.25], 38, 8);
callout("LENGKUNG + BURUNG", [1.8, 0.45, 3.0], 42, -6);
callout("BANNER 600×1500 (TAMBAHAN)", [1.65, 0.82, 0.9], 44, -12);
callout("PEMBERAT 2×300 kg", [1.23, 1.75, 0.1], 26, 36);
callout("PILAR 500→400", [-1.35, 0.65, 1.2], -34, -6, "end");
callout("CELAH 0.150", [0, 0.075, 0.4], -28, 58, "end");

/* titles and notes */
body.push(`<text x="30" y="36" class="i-title">D. PERSPEKTIF ISOMETRIK</text>`);
body.push(`<text x="30" y="52" class="i-sub">azimut 60° · elevasi 30° · skematik, bukan skala konstruksi</text>`);
body.push(`<text x="30" y="890" class="i-note">4.400 total (ujung ekor) · 3.400 tinggi · 2.000 soffit · 1.600 runner · 0.150 celah ke tenda</text>`);
body.push(`<text x="30" y="908" class="i-note">tiang burung 100×100×500 (2 pcs) [KEPUTUSAN-2C] · pemberat 2×300 kg [KEPUTUSAN-3] · tenda tidak dibebani</text>`);
body.push(`<text x="30" y="926" class="i-note">banner digeser ke ±1.500…±2.100 [KEPUTUSAN-3A] · G ≥ 0.700 · semua elemen gapura di y ≥ 0.150</text>`);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" class="iso" data-theme="light"><style>${k.ISO_CSS}${STYLE}</style><rect width="${W}" height="${H}" fill="#ffffff"/>${body.join("")}</svg>`;
writeFileSync(join(here, "iso.svg"), svg);
console.log("wrote iso.svg");
