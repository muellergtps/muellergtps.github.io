import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as k from "../../.opencode/skills/anatomy/kit/iso-kit.mjs";
import { kitScript } from "../../.opencode/skills/anatomy/scripts/inline-kit.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const theme = process.argv.includes("--light") ? "light" : "dark";

const WIDTH = 680;
const HEIGHT = 480;
const AZ = 54;
const EL = 30;

const P = k.fitProjection(
  [
    [-2.6, -2.2, 0], [2.6, -2.2, 0], [2.6, 2.0, 0], [-2.6, 2.0, 0],
    [0, -1.0, 3.2], [-2.2, 0.45, 3.9], [2.2, 0.45, 3.9],
  ],
  WIDTH,
  HEIGHT,
  { pad: 28, headroom: 24, azimuth: AZ, elevation: EL },
);

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

function groundAndTent() {
  const out = [];
  const basePlan = { x: -2.4, y: -2.0, w: 4.8, d: 4.0, r: 0.08 };
  out.push(`<path class="iso-halo" d="${k.haloOf(basePlan, -0.06, 0.06, P)}"/>`);
  out.push(S(k.slabOf(basePlan, -0.04, 0.04, P, 4, 0.01), { tone: "lo", crease: "none" }));
  const inset = k.insetPlan(basePlan, 0.08);
  out.push(L(k.planOutline(inset, 0, P), { tone: "faint" }));
  const grid = [];
  for (let x = -2.0; x <= 2.0; x += 0.5) grid.push(k.lineOnTop([x, inset.y], [x, inset.y + inset.d], 0, P));
  for (let y = -1.5; y <= 1.5; y += 0.5) grid.push(k.lineOnTop([inset.x, y], [inset.x + inset.w, y], 0, P));
  out.push(L(grid.join(""), { tone: "faint" }));

  const corners = [[-1.5, -1.8], [1.5, -1.8], [1.5, 0], [-1.5, 0]];
  const peak = [0, -0.9, 3.1];
  const tent = [];
  for (let i = 0; i < 4; i++) {
    const [x1, y1] = corners[i], [x2, y2] = corners[(i + 1) % 4];
    tent.push(k.segment([x1, y1, 0], [x2, y2, 0], P));
    tent.push(k.segment([x1, y1, 0], [x1, y1, 2.5], P));
    tent.push(k.segment([x1, y1, 2.5], [x2, y2, 2.5], P));
    tent.push(k.segment([x1, y1, 2.5], peak, P));
  }
  out.push(L(tent.join(""), { tone: "faint", dashed: true }));
  return out.join("");
}

function runners() {
  const out = [];
  for (const cx of [-1.25, 1.25]) {
    out.push(S(k.slabOf({ x: cx - 0.05, y: 0.15, w: 0.1, d: 1.6, r: 0.01 }, 0, 0.1, P, 4, 0.008), { tone: "mid" }));
    out.push(D([at([cx, 0.25, 0.1]), at([cx, 0.55, 0.1])], { size: 0.55 }));
  }
  return out.join("");
}

function ballastBoxes() {
  const out = [];
  for (const cx of [-1.25, 1.25]) {
    const x0 = cx > 0 ? 0.98 : -1.48;
    for (const fx of [x0, x0 + 0.4]) {
      out.push(S(k.slabOf({ x: fx, y: 0.70, w: 0.1, d: 1.05, r: 0.008 }, 0, 0.1, P, 4, 0.006), { tone: "lo" }));
    }
    out.push(S(k.slabOf({ x: x0, y: 0.70, w: 0.5, d: 1.05, r: 0.01 }, 0.1, 0.4, P, 4, 0.008), { tone: "hi" }));
    out.push(`<g data-ballast-fill="${cx > 0 ? "r" : "l"}">`);
    out.push(S(k.slabOf({ x: x0 + 0.01, y: 0.71, w: 0.48, d: 1.03, r: 0.008 }, 0.5, 0.025, P, 4, 0.006), { tone: "lit" }));
    for (const sy of [0.92, 1.50]) {
      out.push(S(k.slabOf({ x: x0 - 0.005, y: sy, w: 0.51, d: 0.03, r: 0.004 }, 0.525, 0.015, P, 4, 0.004), { tone: "mid", crease: "none" }));
    }
    out.push(`</g>`);
  }
  return out.join("");
}

function pillars() {
  const leftBase = [[-1.5, 0.15], [-1.0, 0.15], [-1.0, 0.65], [-1.5, 0.65]];
  const leftTop = [[-1.5, 0.25], [-1.1, 0.25], [-1.1, 0.65], [-1.5, 0.65]];
  const rightBase = [[1.0, 0.15], [1.5, 0.15], [1.5, 0.65], [1.0, 0.65]];
  const rightTop = [[1.1, 0.25], [1.5, 0.25], [1.5, 0.65], [1.1, 0.65]];
  return [
    taperedSvg(leftBase, leftTop, 0, 2.0, P, { tone: "mid" }),
    taperedSvg(rightBase, rightTop, 0, 2.0, P, { tone: "mid" }),
  ].join("");
}

function beam() {
  const out = [];
  out.push(S(k.slabOf({ x: -1.8, y: 0.15, w: 3.6, d: 0.5, r: 0.01 }, 2.0, 0.5, P, 4, 0.01), { tone: "hi" }));
  const ticks = k.topTicks(-1.6, 1.6, 0.12, 5, 0.64, 2.5, [0.04, 0.08], P);
  out.push(L(ticks.minor, { tone: "lo" }), L(ticks.major, { tone: "mid" }));
  out.push(D([at([-1.7, 0.4, 2.5]), at([1.7, 0.4, 2.5])], { size: 0.55 }));
  return out.join("");
}

function archAndBirds() {
  const out = [];
  const N = 36;
  const xs = Array.from({ length: N + 1 }, (_, i) => -1.8 + (3.6 * i) / N);
  const zO = (x) => 2.5 + 0.5 * (x / 1.8) ** 2;
  const zI = (x) => zO(x) - 0.25;
  const yF = 0.45, yB = 0.35;
  const fo = xs.map((x) => at([x, yF, zO(x)]));
  const fi = [...xs].reverse().map((x) => at([x, yF, zI(x)]));
  const bo = xs.map((x) => at([x, yB, zO(x)]));
  const bi = [...xs].reverse().map((x) => at([x, yB, zI(x)]));
  out.push(`<path class="iso-shade" data-shade="1" d="${k.pathOf([...fi, ...bi.slice().reverse()], true)}"/>`);
  out.push(`<path class="iso-shade" data-shade="2" d="${k.pathOf([...fo, ...bo.slice().reverse()], true)}"/>`);
  out.push(`<path class="iso-top" d="${k.pathOf([...fo, ...fi], true)}"/>`);
  out.push(L(k.pathOf([...fo, ...fi], true), { tone: "hi" }));

  for (const x of [-1.75, 1.75]) {
    out.push(S(k.slabOf({ x: x - 0.05, y: 0.35, w: 0.1, d: 0.1, r: 0.005 }, 2.5, 0.5, P, 4, 0.004), { tone: "mid" }));
    out.push(S(k.slabOf({ x: x - 0.075, y: 0.325, w: 0.15, d: 0.15, r: 0.005 }, 2.5, 0.015, P, 4, 0.003), { tone: "lo" }));
  }

  for (const s of [-1, 1]) {
    const pt = (u, v) => {
      const [sx, sy] = at([s * (1.8 + u), 0.45, 3 + v]);
      return `${sx.toFixed(1)} ${sy.toFixed(1)}`;
    };
    const bodyD = `M ${pt(0, 0.02)} C ${pt(-0.05, 0.10)} ${pt(-0.06, 0.22)} ${pt(0, 0.30)} C ${pt(0.05, 0.37)} ${pt(0.14, 0.37)} ${pt(0.19, 0.32)} C ${pt(0.23, 0.28)} ${pt(0.20, 0.18)} ${pt(0.15, 0.11)} C ${pt(0.10, 0.04)} ${pt(0.04, -0.01)} ${pt(0, 0.02)} Z`;
    const beakD = `M ${pt(0.14, 0.30)} C ${pt(0.16, 0.36)} ${pt(0.21, 0.39)} ${pt(0.25, 0.36)} L ${pt(0.40, 0.31)} L ${pt(0.26, 0.29)} C ${pt(0.22, 0.25)} ${pt(0.17, 0.25)} ${pt(0.14, 0.30)} Z`;
    const tailD = `M ${pt(0, 0.04)} C ${pt(-0.10, 0.00)} ${pt(-0.24, -0.12)} ${pt(-0.38, -0.36)} L ${pt(-0.32, -0.38)} C ${pt(-0.20, -0.16)} ${pt(-0.08, -0.04)} ${pt(0.03, 0.01)} Z`;
    out.push(`<path class="iso-fill" d="${bodyD}${beakD}${tailD}" style="fill:var(--anatomy-hi)"/>`);
  }
  return out.join("");
}

function banners() {
  const out = [];
  for (const x0 of [-2.1, 1.5]) {
    out.push(`<g data-banner="${x0 < 0 ? "l" : "r"}">`);
    out.push(S(k.slabOf({ x: x0, y: 0.76, w: 0.6, d: 0.08, r: 0.005 }, 1.48, 0.06, P, 4, 0.004), { tone: "mid" }));
    for (const f of [0.0, 0.3]) {
      const hx = x0 + f;
      out.push(L(k.segment([hx, 0.82, 1.54], [hx, 0.65, 2.0], P), { tone: "mid" }));
      out.push(D([at([hx, 0.82, 1.54]), at([hx, 0.65, 2.0])], { size: 0.55 }));
    }
    out.push(S(k.slabOf({ x: x0, y: 0.78, w: 0.6, d: 0.04, r: 0.005 }, 0, 1.5, P, 4, 0.004), { tone: "hi" }));
    out.push(L(k.segment([x0 + 0.1, 0.821, 1.32], [x0 + 0.5, 0.821, 1.32], P), { tone: "mid", free: "both" }));
    out.push(L(k.segment([x0 + 0.14, 0.821, 0.56], [x0 + 0.46, 0.821, 0.56], P), { tone: "lo", free: "both" }));
    out.push(L(k.segment([x0 + 0.14, 0.821, 0.46], [x0 + 0.46, 0.821, 0.46], P), { tone: "lo", free: "both" }));
    out.push(`</g>`);
  }
  return out.join("");
}

const originPivot = at([0, 0.15, 0]);
const unitZ = (() => {
  const a = at([0, 0, 0]), b = at([0, 0, 1]);
  return [b[0] - a[0], b[1] - a[1]];
})();
const unitY = (() => {
  const a = at([0, 0, 0]), b = at([0, 1, 0]);
  return [b[0] - a[0], b[1] - a[1]];
})();

const svg = k.figureSvg({
  width: WIDTH,
  height: HEIGHT,
  body: [
    groundAndTent(),
    [
      `<g data-part="superstructure">`,
      `<g data-part="runners">${runners()}</g>`,
      `<g data-part="ballast">${ballastBoxes()}</g>`,
      `<g data-part="pillars">${pillars()}</g>`,
      `<g data-part="beam">${beam()}</g>`,
      `<g data-part="arch">${archAndBirds()}</g>`,
      `<g data-part="banners">${banners()}</g>`,
      `</g>`,
    ].join(""),
  ],
});

const live = `
const BALLAST_PRESETS = [0, 300, 600, 700];
let ballastIdx = 2;
let targetWind = 20;
let wind = 20;
let explode = 0;
let explodeTarget = 0;
let tilt = 0;
let tiltVel = 0;
let touring = true;
let clock = 0;
let last = 0;
let frame = 0;
let visible = true;
let idleTimer = 0;

const stage = document.querySelector(".iso-stage");
const svg = stage.querySelector("svg");
const readout = document.querySelector("[data-readout]");
const superEl = svg.querySelector('[data-part="superstructure"]');
const ballastEl = svg.querySelector('[data-part="ballast"]');
const beamEl = svg.querySelector('[data-part="beam"]');
const archEl = svg.querySelector('[data-part="arch"]');
const bannersEl = svg.querySelector('[data-part="banners"]');
const fillEls = svg.querySelectorAll('[data-ballast-fill]');
const still = window.matchMedia("(prefers-reduced-motion: reduce)");

const UZ = [${unitZ[0].toFixed(2)}, ${unitZ[1].toFixed(2)}];
const UY = [${unitY[0].toFixed(2)}, ${unitY[1].toFixed(2)}];
const PIVOT = [${originPivot[0].toFixed(2)}, ${originPivot[1].toFixed(2)}];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function computeStability(v, mBallast) {
  const q = 0.5 * 1.225 * v * v;
  const p = 1.3 * q;
  const Fw = (p * 6.44) / 1000;
  const Mw = Fw * 1.65;
  const Wb = (mBallast * 9.81) / 1000;
  const MA = 1.77 * (0.42 - 0.15) + Wb * (1.225 - 0.15);
  const MB = 1.77 * (1.75 - 0.42) + Wb * (1.75 - 1.225);
  const fosA = Mw > 1e-4 ? MA / Mw : 99;
  const fosB = Mw > 1e-4 ? MB / Mw : 99;
  const fosG = Fw > 1e-4 ? (0.50 * (1.77 + Wb)) / Fw : 99;
  const fosMin = Math.min(fosA, fosB);
  return { Fw, Mw, fosA, fosB, fosG, fosMin };
}

function draw() {
  const m = BALLAST_PRESETS[ballastIdx];
  const st = computeStability(wind, m);
  const ex = explode;

  for (const el of fillEls) {
    el.style.opacity = m === 0 ? "0.12" : m === 300 ? "0.55" : "1";
  }

  ballastEl.setAttribute("transform", \`translate(\${(UY[0] * 0.45 * ex).toFixed(2)},\${(UY[1] * 0.45 * ex).toFixed(2)})\`);
  beamEl.setAttribute("transform", \`translate(\${(UZ[0] * 0.55 * ex).toFixed(2)},\${(UZ[1] * 0.55 * ex).toFixed(2)})\`);
  archEl.setAttribute("transform", \`translate(\${(UZ[0] * 1.05 * ex).toFixed(2)},\${(UZ[1] * 1.05 * ex).toFixed(2)})\`);

  bannersEl.setAttribute("transform", \`translate(\${(UY[0] * 0.35 * ex).toFixed(2)},\${(UY[1] * 0.35 * ex).toFixed(2)})\`);

  superEl.setAttribute("transform", \`rotate(\${tilt.toFixed(2)} \${PIVOT[0]} \${PIVOT[1]})\`);

  const status = st.fosMin >= 1.5 ? "aman" : st.fosMin >= 1.0 ? "waspada" : "guling!";
  const fosTxt = st.fosMin > 20 ? ">20" : st.fosMin.toFixed(2);
  readout.textContent = \`angin \${wind.toFixed(0)} m/s · \${m} kg · FOS \${fosTxt} · \${status}\`;
  stage.setAttribute("aria-valuenow", String(Math.round(wind)));
}

function tick(now) {
  const dt = last ? Math.min((now - last) / 1000, 1 / 30) : 1 / 60;
  last = now;
  const calm = still.matches;

  if (touring) {
    clock += dt;
    targetWind = 12.5 + 9.5 * Math.sin(clock * 0.65);
  }

  wind = calm ? targetWind : wind + (targetWind - wind) * (1 - Math.exp(-dt / 0.25));
  if (Math.abs(targetWind - wind) < 0.02) wind = targetWind;

  explode = calm ? explodeTarget : explode + (explodeTarget - explode) * (1 - Math.exp(-dt / 0.35));
  if (Math.abs(explodeTarget - explode) < 0.002) explode = explodeTarget;

  const st = computeStability(wind, BALLAST_PRESETS[ballastIdx]);
  const wantTilt = st.fosMin < 1.0 ? Math.min(14, (1.0 - st.fosMin) * 18) : (wind / 25) * (0.8 / Math.max(0.8, st.fosMin));
  const stiff = 180, drag = calm ? 2 * Math.sqrt(180) : 18;
  for (let i = 0; i < 4; i++) {
    tiltVel += ((wantTilt - tilt) * stiff - tiltVel * drag) * dt / 4;
    tilt += tiltVel * dt / 4;
  }
  if (Math.abs(wantTilt - tilt) < 0.01 && Math.abs(tiltVel) < 0.01) { tilt = wantTilt; tiltVel = 0; }

  draw();
  const settled = !touring && wind === targetWind && explode === explodeTarget && tiltVel === 0 && tilt === wantTilt;
  frame = visible && !settled ? requestAnimationFrame(tick) : 0;
}

const run = () => { if (!frame && visible) { last = 0; frame = requestAnimationFrame(tick); } };
const wake = () => {
  touring = false;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => { touring = !still.matches; clock = 0; run(); }, 4500);
  run();
};

new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1].isIntersecting;
  if (visible) run();
}, { rootMargin: "120px 0px" }).observe(stage);

if (still.matches) touring = false;

stage.addEventListener("pointermove", (e) => {
  const box = svg.getBoundingClientRect();
  const share = clamp((e.clientX - box.left) / box.width, 0, 1);
  targetWind = share * 25;
  wake();
});

stage.addEventListener("click", () => {
  ballastIdx = (ballastIdx + 1) % BALLAST_PRESETS.length;
  wake();
});

stage.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight" || e.key === "ArrowUp") { targetWind = clamp(targetWind + 2, 0, 25); e.preventDefault(); wake(); }
  else if (e.key === "ArrowLeft" || e.key === "ArrowDown") { targetWind = clamp(targetWind - 2, 0, 25); e.preventDefault(); wake(); }
  else if (e.key === "b" || e.key === "B") { ballastIdx = (ballastIdx + 1) % BALLAST_PRESETS.length; e.preventDefault(); wake(); }
  else if (e.key === " " || e.key === "e" || e.key === "E") { explodeTarget = explodeTarget ? 0 : 1; e.preventDefault(); wake(); }
});

draw();
run();
`;

const body = k.plateHtml({
  fig: "Fig 1",
  title: "Gapura Papua STMKG",
  hint: "←→ angin · klik pemberat · spasi rakit",
  readout: "angin 20 m/s · 600 kg · FOS 1.60 · aman",
  keys: [
    { mark: "lit", label: "Box pemberat 2×300 kg (klik untuk ubah: 0 / 300 / 600 / 700 kg)" },
    { mark: "raised", label: "Struktur utama: runner, pilar, balok, lengkung, burung, banner" },
  ],
  caption:
    "Simulasi stabilitas guling dan rakitan Gapura Papua STMKG (tinggi 3,4 m, bentang 3,6 m, celah tenda 0,15 m). Pada angin rencana 20 m/s, pemberat minimum 600 kg menghasilkan FOS guling 1,60 (aman ≥ 1,50).",
  body: `<div class="iso-stage" tabindex="0" role="slider" aria-label="Simulasi angin dan pemberat Gapura Papua STMKG" aria-valuemin="0" aria-valuemax="25" aria-valuenow="20">${svg}</div>`,
});

const outName = theme === "light" ? "stand-light.html" : "stand.html";
writeFileSync(join(HERE, outName), k.pageHtml({ title: "Gapura Papua STMKG", theme, body, script: kitScript() + live }));
console.log("wrote", outName);
