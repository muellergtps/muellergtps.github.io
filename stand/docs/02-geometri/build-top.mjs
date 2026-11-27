import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const q = (v) => Number(v).toFixed(1);
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const S = 115;
const X = (x) => 435 + x * S;
const Y = (y) => 470 + y * S;

const CSS = `
.t-obj{fill:none;stroke:#241f1a;stroke-width:1.6;stroke-linejoin:round}
.t-obj2{fill:none;stroke:#241f1a;stroke-width:1}
.t-tent{fill:none;stroke:#9aa4b2;stroke-width:1.2;stroke-dasharray:7 5}
.t-tentthin{fill:none;stroke:#b8c0cc;stroke-width:.8;stroke-dasharray:3 4}
.t-over{fill:none;stroke:#7c7163;stroke-width:.9;stroke-dasharray:5 4}
.t-overthin{fill:none;stroke:#7c7163;stroke-width:.7;stroke-dasharray:3 3}
.t-overbird{fill:#f7efe6;fill-opacity:.55;stroke:#b06a3b;stroke-width:.9;stroke-dasharray:4 3}
.t-archband{fill:#f7efe6;stroke:none;opacity:.6}
.t-timber{fill:#e8d9c6;stroke:#8a5a3b;stroke-width:1.2}
.t-hatch{fill:url(#t-hatch);stroke:#8a5a3b;stroke-width:1.2}
.t-topline{fill:none;stroke:#8a5a3b;stroke-width:.8;stroke-dasharray:3 3}
.t-ballast{fill:#d9d4cc;stroke:#5f5a52;stroke-width:1.2}
.t-banner{fill:#f7efe6;stroke:#b06a3b;stroke-width:1.2}
.t-zone{fill:#f1f5fb;stroke:#9db4d6;stroke-width:.9;stroke-dasharray:5 4}
.t-zonetx{fill:#5b7292;font:9px Consolas,monospace;letter-spacing:1.2px}
.t-dim{fill:none;stroke:#1f6feb;stroke-width:.9}
.t-dimthin{fill:none;stroke:#1f6feb;stroke-width:.55;stroke-dasharray:2 3}
.t-dimtx{fill:#1f6feb;font:9.5px Consolas,monospace}
.t-tx{fill:#241f1a;font:11px Consolas,monospace}
.t-note{fill:#6b7280;font:9.5px Consolas,monospace}
.t-h2{fill:#241f1a;font:700 15px Consolas,monospace;letter-spacing:1px}
.t-sub{fill:#6b7280;font:10px Consolas,monospace}
.t-num{fill:#fff;stroke:#241f1a;stroke-width:1}
.t-numtx{fill:#241f1a;font:8.5px Consolas,monospace;text-anchor:middle}
.t-legend{fill:#241f1a;font:10px Consolas,monospace}
.t-labelbg{fill:#fff;stroke:none}
.t-arrow{fill:#241f1a;stroke:none}
`;

const svg = (w, h, body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}"><style>${CSS}</style><rect width="${w}" height="${h}" fill="#fff"/>${body}</svg>`;

function view(w, h) {
  const a = [];
  const line = (x1, y1, x2, y2, cls = "t-obj") =>
    a.push(`<line x1="${q(x1)}" y1="${q(y1)}" x2="${q(x2)}" y2="${q(y2)}" class="${cls}"/>`);
  const rect = (x, y, ww, hh, cls = "t-obj") =>
    a.push(`<rect x="${q(x)}" y="${q(y)}" width="${q(ww)}" height="${q(hh)}" class="${cls}"/>`);
  const circle = (x, y, r, cls = "t-obj") =>
    a.push(`<circle cx="${q(x)}" cy="${q(y)}" r="${q(r)}" class="${cls}"/>`);
  const poly = (pts, cls = "t-obj") =>
    a.push(`<polygon points="${pts.map(([x, y]) => `${q(x)},${q(y)}`).join(" ")}" class="${cls}"/>`);
  const text = (x, y, s, cls = "t-tx", anchor = "start", rot = 0) => {
    const tr = rot ? ` transform="rotate(${rot} ${q(x)} ${q(y)})"` : "";
    a.push(`<text x="${q(x)}" y="${q(y)}" class="${cls}" text-anchor="${anchor}"${tr}>${esc(s)}</text>`);
  };
  const dimH = (x1, x2, y, label, ey1 = null, ey2 = null) => {
    if (ey1 !== null) line(x1, ey1, x1, y, "t-dimthin");
    if (ey2 !== null) line(x2, ey2, x2, y, "t-dimthin");
    line(x1, y, x2, y, "t-dim");
    line(x1, y - 4, x1, y + 4, "t-dim");
    line(x2, y - 4, x2, y + 4, "t-dim");
    text((x1 + x2) / 2, y - 6, label, "t-dimtx", "middle");
  };
  return { a, line, rect, circle, poly, text, dimH, out: () => svg(w, h, a.join("")) };
}

const T = view(870, 944);
T.a.push(`<defs><pattern id="t-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="9" stroke="#c9a97f" stroke-width="1"/></pattern></defs>`);

T.text(30, 36, "C. TAMPAK ATAS (RENCANA)", "t-h2");
T.text(30, 52, "skala 115 px/m · bidang X-Y · tampak dari atas", "t-sub");

/* clearance zones */
for (const [x0, lx] of [[-2.9, -2.55], [2.2, 2.55]]) {
  T.rect(X(x0), Y(-0.3), 0.7 * S, 2.5 * S, "t-zone");
  T.text(X(lx), Y(-0.12), "≥0.700", "t-zonetx", "middle");
  T.text(X(lx), Y(1.35), "ZONA BEBAS", "t-zonetx", "middle", -90);
}

/* tent */
T.rect(X(-1.5), Y(-3), 3 * S, 3 * S, "t-tent");
T.line(X(-1.5), Y(-3), X(0), Y(-1.5), "t-tentthin");
T.line(X(1.5), Y(-3), X(0), Y(-1.5), "t-tentthin");
T.line(X(-1.5), Y(0), X(0), Y(-1.5), "t-tentthin");
T.line(X(1.5), Y(0), X(0), Y(-1.5), "t-tentthin");
T.circle(X(0), Y(-1.5), 2.5, "t-tent");
T.rect(X(-0.92), Y(-2.63), 1.84 * S, 0.23 * S, "t-labelbg");
T.text(X(0), Y(-2.49), "TENDA 3×3 — TIDAK DIBEBANI", "t-tx", "middle");
T.text(X(0), Y(-2.73), "puncak 3.200 [ASUMSI]", "t-note", "middle");

/* overhead: beam, arch, birds */
T.rect(X(-1.8), Y(0.15), 3.6 * S, 0.5 * S, "t-over");
T.rect(X(-1.8), Y(0.35), 3.6 * S, 0.1 * S, "t-archband");
T.line(X(-1.8), Y(0.35), X(1.8), Y(0.35), "t-overthin");
T.line(X(-1.8), Y(0.45), X(1.8), Y(0.45), "t-overthin");
T.rect(X(-2.2), Y(0.35), 0.8 * S, 0.1 * S, "t-overbird");
T.rect(X(1.4), Y(0.35), 0.8 * S, 0.1 * S, "t-overbird");

/* runners first, then pillars */
T.rect(X(-1.3), Y(0.15), 0.1 * S, 1.6 * S, "t-timber");
T.rect(X(1.2), Y(0.15), 0.1 * S, 1.6 * S, "t-timber");
T.rect(X(-1.5), Y(0.15), 0.5 * S, 0.5 * S, "t-hatch");
T.rect(X(1.0), Y(0.15), 0.5 * S, 0.5 * S, "t-hatch");
T.rect(X(-1.5), Y(0.25), 0.4 * S, 0.4 * S, "t-topline");
T.rect(X(1.1), Y(0.25), 0.4 * S, 0.4 * S, "t-topline");

/* banners */
T.rect(X(-2.1), Y(0.78), 0.6 * S, 0.08 * S, "t-banner");
T.rect(X(1.5), Y(0.78), 0.6 * S, 0.08 * S, "t-banner");

/* ballast: 500 x 1050 box per side, 2 x 300 kg */
T.rect(X(-1.48), Y(0.70), 0.5 * S, 1.05 * S, "t-ballast");
T.rect(X(0.98), Y(0.70), 0.5 * S, 1.05 * S, "t-ballast");
T.line(X(-1.43), Y(0.90), X(-1.03), Y(0.90), "t-obj2");
T.line(X(-1.43), Y(1.50), X(-1.03), Y(1.50), "t-obj2");
T.line(X(1.03), Y(0.90), X(1.43), Y(0.90), "t-obj2");
T.line(X(1.03), Y(1.50), X(1.43), Y(1.50), "t-obj2");
/* runner tersembunyi di bawah box */
T.rect(X(-1.3), Y(0.70), 0.1 * S, 1.05 * S, "t-overthin");
T.rect(X(1.2), Y(0.70), 0.1 * S, 1.05 * S, "t-overthin");

/* dimensions */
T.dimH(X(-1.5), X(1.5), Y(-3.22), "3.000 (tenda)", Y(-3), Y(-3));
T.dimH(X(-1.0), X(1.0), Y(1.02), "2.000 (bukaan)", Y(0.65), Y(0.65));
T.dimH(X(-2.2), X(2.2), Y(2.05), "4.400 (ujung ekor)", Y(0.45), Y(0.45));

/* gap 0.150 */
T.line(X(0.35), Y(0), X(0.35), Y(0.15), "t-dim");
T.line(X(0.35) - 4, Y(0), X(0.35) + 4, Y(0), "t-dim");
T.line(X(0.35) - 4, Y(0.15), X(0.35) + 4, Y(0.15), "t-dim");
T.line(X(0.35), Y(0.075), X(0.7), Y(0.075), "t-dimthin");
T.text(X(0.74), Y(0.075) + 3, "0.150", "t-dimtx");

/* scale bar */
T.line(690, 86, 805, 86, "t-obj2");
T.line(690, 82, 690, 90, "t-obj2");
T.line(805, 82, 805, 90, "t-obj2");
T.text(747, 70, "SKALA GRAFIS", "t-note", "middle");
T.text(747, 80, "1 m", "t-note", "middle");

/* callouts */
const num = (x, y, n) => {
  T.circle(X(x), Y(y), 8.5, "t-num");
  T.text(X(x), Y(y) + 3, n, "t-numtx", "middle");
};
num(-1.2, -2.0, "01");
num(-0.6, 0.4, "02");
num(1.8, 0.4, "03");
num(1.80, 0.82, "04");
num(-1.55, 1.35, "05");
num(-1.23, 1.20, "06");
num(1.23, 1.20, "06");
num(1.42, 0.58, "07");
num(-1.75, 0.25, "08");

/* legend */
T.text(30, 742, "KETERANGAN", "t-h2");
const items = [
  ["01", "Tenda 3×3 — tidak dibebani; garis putus-putus"],
  ["02", "Balok 500×500, z=2.000–2.500; di atas"],
  ["03", "Lengkung 250 + burung 800×800; di atas"],
  ["04", "Banner 600×1500, x=±1.500…±2.100, y=0.80"],
  ["05", "Runner 1600×100 di bawah box, y=0.150–1.750"],
  ["06", "Pemberat 2×300 kg; box 500×1050×400, y=0.700–1.750"],
  ["07", "Pilar 500×500, atas 400×400; luar vertikal"],
  ["08", "Tiang burung 100×100×500 (2 pcs), di atas balok"],
];
items.forEach(([n, s], i) => {
  const col = i < 4 ? 0 : 1;
  const row = i % 4;
  const x = col === 0 ? 38 : 458;
  const y = 768 + row * 21;
  T.circle(x, y - 3, 8.5, "t-num");
  T.text(x, y, n, "t-numtx", "middle");
  T.text(x + 16, y, s, "t-legend");
});

T.text(30, 905, "D1–D12 [KONFIRMASI] · K1–K8 [KEPUTUSAN] · puncak tenda 3.200 [ASUMSI] · pemberat 2×300 kg [KEPUTUSAN-3]", "t-note");
T.text(30, 922, "Varian tetangga: balok 3.300, burung di ±1.65, G ≥ 0.550 · semua elemen gapura di y ≥ 0.150", "t-note");

writeFileSync(join(here, "top.svg"), T.out());
console.log("wrote top.svg");
