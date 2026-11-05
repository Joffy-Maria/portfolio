import { useMemo } from "react";
import Fireflies from "./Fireflies";

const CX = 350;
const CY = 350;
const INNER = 252;
const OUTER = 313;
const STONE_COUNT = 34;

const STONE_FILLS = [
  "#35473d",
  "#2f4138",
  "#3b4c42",
  "#293b33",
  "#405247",
  "#33453c",
  "#2b3d35",
  "#38493f",
];

const LEAF_FILLS = ["#3f5c42", "#4c6a4a", "#2f4a38", "#5a7550"];

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function polar(r: number, angle: number) {
  return [CX + Math.cos(angle) * r, CY + Math.sin(angle) * r] as const;
}

function stonePath(rInner: number, rOuter: number, a0: number, a1: number) {
  const [x1, y1] = polar(rOuter, a0);
  const [x2, y2] = polar(rOuter, a1);
  const [x3, y3] = polar(rInner, a1);
  const [x4, y4] = polar(rInner, a0);
  return `M ${x1.toFixed(2)} ${y1.toFixed(2)} A ${rOuter} ${rOuter} 0 0 1 ${x2.toFixed(
    2,
  )} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)} A ${rInner} ${rInner} 0 0 0 ${x4.toFixed(
    2,
  )} ${y4.toFixed(2)} Z`;
}

function arcPath(r: number, a0: number, a1: number) {
  const [x0, y0] = polar(r, a0);
  const [x1, y1] = polar(r, a1);
  const large = Math.abs(a1 - a0) > Math.PI ? 1 : 0;
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
}

const stones = (() => {
  const random = mulberry32(2026);
  return Array.from({ length: STONE_COUNT }, (_, i) => {
    const step = (Math.PI * 2) / STONE_COUNT;
    const gap = 0.012;
    const a0 = i * step + gap / 2;
    const a1 = (i + 1) * step - gap / 2;
    const rOut = OUTER + (random() - 0.5) * 8;
    const rIn = INNER + (random() - 0.5) * 4;
    return {
      id: i,
      d: stonePath(rIn, rOut, a0, a1),
      fill: STONE_FILLS[Math.floor(random() * STONE_FILLS.length)],
    };
  });
})();

type Leaf = {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  fill: string;
};

function buildLeaves(start: number, end: number, radius: number, count: number, seed: number): Leaf[] {
  const random = mulberry32(seed);
  return Array.from({ length: count }, (_, i) => {
    const t = i / Math.max(count - 1, 1);
    const angle = start + (end - start) * t;
    const r = radius + Math.sin(t * Math.PI * 4) * 7 + (random() - 0.5) * 6;
    const [x, y] = polar(r, angle);
    const side = i % 2 === 0 ? 1 : -1;
    return {
      x,
      y,
      rotation: (angle * 180) / Math.PI + 90 + side * 34 + (random() - 0.5) * 20,
      scale: 0.55 + random() * 0.6,
      fill: LEAF_FILLS[Math.floor(random() * LEAF_FILLS.length)],
    };
  });
}

const leafPath = "M0 0C5.5 -5 13.5 -3.5 16 4.5C10 10.5 2 8 0 0Z";

const mossPatches = (() => {
  const random = mulberry32(88);
  return Array.from({ length: 16 }, (_, i) => {
    const angle = random() * Math.PI * 2;
    const r = INNER + 6 + random() * (OUTER - INNER - 12);
    const [x, y] = polar(r, angle);
    return {
      id: i,
      x,
      y,
      rx: 8 + random() * 18,
      ry: 4 + random() * 9,
      rotation: random() * 180,
      opacity: 0.16 + random() * 0.3,
    };
  });
})();

const sparks = [
  { x: 300, y: 92, s: 0.9, d: 0 },
  { x: 424, y: 74, s: 0.6, d: 1.4 },
  { x: 96, y: 246, s: 0.7, d: 2.2 },
  { x: 604, y: 214, s: 0.8, d: 0.8 },
  { x: 132, y: 430, s: 0.55, d: 3 },
  { x: 566, y: 470, s: 0.65, d: 1.9 },
  { x: 262, y: 596, s: 0.5, d: 2.6 },
];

function Blossom({
  x,
  y,
  scale = 1,
  rotate = 0,
  tone = "ivory",
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
  tone?: "ivory" | "rose";
}) {
  const petalFill = tone === "ivory" ? "#F3EBDD" : "#E9C9C9";
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      {[0, 72, 144, 216, 288].map((angle, i) => (
        <ellipse
          key={angle}
          cx="0"
          cy="-8.6"
          rx={4.9}
          ry={9}
          transform={`rotate(${angle})`}
          fill={i % 2 === 0 ? petalFill : tone === "ivory" ? "#EFE2CE" : "#DDB0B6"}
          fillOpacity={0.96}
          stroke="#C6A66B"
          strokeOpacity={0.35}
          strokeWidth={0.55}
        />
      ))}
      <circle r="3.9" fill="#C6A66B" />
      <circle r="1.7" fill="#F6E7BE" />
      {[0, 72, 144, 216, 288].map((angle) => {
        const rad = (angle * Math.PI) / 180;
        return (
          <circle
            key={`dot-${angle}`}
            cx={Math.cos(rad) * 6}
            cy={Math.sin(rad) * 6}
            r="0.85"
            fill="#F3EBDD"
            fillOpacity=".8"
          />
        );
      })}
    </g>
  );
}

function FlowerCluster({
  x,
  y,
  scale = 1,
  rotate = 0,
}: {
  x: number;
  y: number;
  scale?: number;
  rotate?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rotate}) scale(${scale})`}>
      <path
        d="M0 0c-6 14-20 20-32 18M0 0c10 12 24 15 34 10M0 0c-2 16-10 26-18 32"
        stroke="#4C6A4A"
        strokeWidth="1.4"
        fill="none"
        strokeLinecap="round"
        opacity=".9"
      />
      <Blossom x={-34} y={18} scale={0.72} rotate={-18} tone="rose" />
      <Blossom x={34} y={10} scale={0.62} rotate={22} />
      <Blossom x={-18} y={33} scale={0.5} rotate={40} tone="rose" />
      <Blossom x={0} y={0} scale={1.05} rotate={8} />
      {[
        [-46, 4],
        [-26, 6],
        [18, -8],
        [46, 22],
      ].map(([bx, by], i) => (
        <g key={`bud-${i}`} transform={`translate(${bx} ${by})`}>
          <circle r="3.4" fill="#C77A85" fillOpacity=".85" />
          <path d="M0 -3.4c2 -3 4 -3 5 -1-1 2-3 3-5 1Z" fill="#4C6A4A" />
        </g>
      ))}
      {[
        [-54, 30, -30],
        [52, -6, 24],
        [-12, -16, 12],
      ].map(([lx, ly, lr], i) => (
        <path
          key={`leaf-${i}`}
          d={leafPath}
          transform={`translate(${lx} ${ly}) rotate(${lr}) scale(${0.5 + i * 0.08})`}
          fill="#4C6A4A"
          fillOpacity=".85"
        />
      ))}
    </g>
  );
}

const ivyLeft = buildLeaves(Math.PI * 0.72, Math.PI * 1.68, OUTER + 8, 22, 5);
const ivyRight = buildLeaves(Math.PI * 1.78, Math.PI * 2.24, OUTER + 9, 11, 9);
const ivyBottom = buildLeaves(Math.PI * 0.18, Math.PI * 0.52, OUTER + 10, 8, 14);

const clusterAngles = [
  { angle: Math.PI * 1.16, r: OUTER + 26, scale: 1.15, rotate: -8 },
  { angle: Math.PI * 0.86, r: OUTER + 30, scale: 0.9, rotate: 18 },
  { angle: Math.PI * 1.86, r: OUTER + 26, scale: 1.02, rotate: 6 },
  { angle: Math.PI * 0.36, r: OUTER + 30, scale: 0.88, rotate: -14 },
];

export default function EnchantedArch({ entering = false }: { entering?: boolean }) {
  const clusters = useMemo(
    () =>
      clusterAngles.map((cluster) => {
        const [x, y] = polar(cluster.r, cluster.angle);
        return { ...cluster, x, y };
      }),
    [],
  );

  return (
    <div
      className={`relative mx-auto aspect-square w-full select-none ${entering ? "arch-entering" : ""}`}
    >
      {/* Warm light behind the arch */}
      <div
        aria-hidden="true"
        className="gentle-pulse absolute inset-[6%] rounded-full bg-[radial-gradient(circle,rgba(228,205,156,0.34),rgba(198,166,107,0.12)_46%,transparent_68%)] blur-2xl"
      />

      {/* Portrait inside the opening */}
      <div className="absolute inset-[13.6%] overflow-hidden rounded-full bg-forest shadow-[inset_0_0_60px_rgba(7,29,32,0.85)]">
        <img
          src="/images/portrait.webp"
          alt="Portrait of Joffy Maria Pius"
          width={941}
          height={1672}
          fetchPriority="high"
          decoding="async"
          className="h-full w-full object-cover object-[50%_0%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_38%_18%,rgba(243,235,221,0.22),transparent_48%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent_48%,rgba(7,29,32,0.55)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-2/5 bg-[linear-gradient(to_top,rgba(7,29,32,0.72),transparent)]"
        />
        <div
          aria-hidden="true"
          className={`absolute inset-0 rounded-full ring-1 ring-inset ring-gold/30 transition-shadow duration-700 ${
            entering ? "shadow-[inset_0_0_80px_rgba(228,205,156,0.45)]" : ""
          }`}
        />
      </div>

      {/* The stone arch and its overgrowth */}
      <svg
        viewBox="0 0 700 700"
        className="absolute inset-0 h-full w-full overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <radialGradient id="ring-light" cx="36%" cy="24%" r="78%">
            <stop offset="0%" stopColor="#F6E7BE" stopOpacity="0.16" />
            <stop offset="48%" stopColor="#F6E7BE" stopOpacity="0.02" />
            <stop offset="82%" stopColor="#071D20" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#071D20" stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="ring-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#E4CD9C" stopOpacity="0.55" />
            <stop offset="55%" stopColor="#C6A66B" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#C6A66B" stopOpacity="0.4" />
          </linearGradient>
        </defs>

        {/* Outer shadow */}
        <circle cx={CX} cy={CY} r={OUTER + 10} fill="none" stroke="#03110f" strokeWidth="22" strokeOpacity="0.35" />

        {/* Stones */}
        <g>
          {stones.map((stone) => (
            <path
              key={stone.id}
              d={stone.d}
              fill={stone.fill}
              stroke="#0A1A16"
              strokeWidth="1.1"
              strokeOpacity="0.65"
            />
          ))}
        </g>

        {/* Moss and weathering */}
        <g>
          {mossPatches.map((patch) => (
            <ellipse
              key={patch.id}
              cx={patch.x}
              cy={patch.y}
              rx={patch.rx}
              ry={patch.ry}
              transform={`rotate(${patch.rotation} ${patch.x} ${patch.y})`}
              fill="#4E6B45"
              opacity={patch.opacity}
            />
          ))}
        </g>

        {/* Cracks */}
        <g stroke="#0A1A16" strokeOpacity="0.5" strokeWidth="1" fill="none">
          <path d="M206 300l14 10-4 18 12 12" />
          <path d="M470 196l10 14 16 2 6 14" />
          <path d="M404 486l16-8 6-14" />
          <path d="M262 508l-8-16 10-10" />
        </g>

        {/* Lighting pass */}
        <circle cx={CX} cy={CY} r={(OUTER + INNER) / 2} fill="none" stroke="url(#ring-light)" strokeWidth={OUTER - INNER} />
        <circle cx={CX} cy={CY} r={INNER + 3} fill="none" stroke="url(#ring-gold)" strokeWidth="2.4" />
        <circle cx={CX} cy={CY} r={OUTER - 2} fill="none" stroke="#C6A66B" strokeOpacity="0.16" strokeWidth="1" />

        {/* Keystone ornament */}
        <g transform={`translate(${CX} ${CY - OUTER + 2})`} fill="#C6A66B" fillOpacity="0.75">
          <path d="M0 -7 1.7 -1.7 7 0 1.7 1.7 0 7 -1.7 1.7 -7 0 -1.7 -1.7Z" />
          <circle cy="11" r="1.1" fillOpacity="0.5" />
        </g>

        {/* Ivy stems */}
        <g fill="none" stroke="#3C5A43" strokeWidth="2" strokeLinecap="round" opacity="0.85">
          <path d={arcPath(OUTER + 8, Math.PI * 0.72, Math.PI * 1.68)} />
          <path d={arcPath(OUTER + 9, Math.PI * 1.78, Math.PI * 2.24)} />
          <path d={arcPath(OUTER + 10, Math.PI * 0.18, Math.PI * 0.52)} />
        </g>

        {/* Ivy leaves */}
        <g>
          {[...ivyLeft, ...ivyRight, ...ivyBottom].map((leaf, i) => (
            <path
              key={`leaf-${i}`}
              d={leafPath}
              transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rotation.toFixed(
                1,
              )}) scale(${leaf.scale.toFixed(2)})`}
              fill={leaf.fill}
              fillOpacity="0.92"
              stroke="#1B3227"
              strokeOpacity="0.35"
              strokeWidth="0.6"
            />
          ))}
        </g>

        {/* Hanging strands */}
        <g fill="none" strokeLinecap="round">
          <path d="M252 96c-8 34 8 58 0 92" stroke="#3C5A43" strokeWidth="1.8" />
          <path d="M236 118c-6 22 4 38-2 58" stroke="#3C5A43" strokeWidth="1.2" opacity=".75" />
          <path d="M452 108c8 26-4 44 2 70" stroke="#3C5A43" strokeWidth="1.5" opacity=".8" />
        </g>
        <g fill="#3F5C42">
          {[
            [250, 124, -30, 0.7],
            [256, 150, 32, 0.6],
            [244, 172, -24, 0.55],
            [232, 140, -50, 0.45],
            [454, 132, 26, 0.55],
            [448, 156, -28, 0.45],
          ].map(([x, y, r, s], i) => (
            <path
              key={`hang-${i}`}
              d={leafPath}
              transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}
              fillOpacity="0.85"
            />
          ))}
        </g>

        {/* Flower clusters */}
        {clusters.map((cluster, i) => (
          <FlowerCluster
            key={i}
            x={cluster.x}
            y={cluster.y}
            scale={cluster.scale}
            rotate={cluster.rotate}
          />
        ))}

        {/* Falling petals caught on the ring */}
        <g fill="#C77A85" fillOpacity="0.65">
          <ellipse cx="196" cy="414" rx="4" ry="2.4" transform="rotate(-28 196 414)" />
          <ellipse cx="504" cy="268" rx="3.6" ry="2.1" transform="rotate(34 504 268)" />
          <ellipse cx="382" cy="612" rx="3" ry="1.8" transform="rotate(-12 382 612)" />
        </g>

        {/* Sparkles */}
        <g fill="#F6E7BE">
          {sparks.map((spark, i) => (
            <g key={i} transform={`translate(${spark.x} ${spark.y}) scale(${spark.s})`}>
              <path
                className="twinkle"
                style={{
                  animationDelay: `${spark.d}s`,
                  transformBox: "fill-box",
                  transformOrigin: "center",
                }}
                d="M0 -5 1.3 -1.3 5 0 1.3 1.3 0 5 -1.3 1.3 -5 0 -1.3 -1.3Z"
              />
            </g>
          ))}
        </g>
      </svg>

      {/* Fireflies drifting around the entrance */}
      <Fireflies count={15} seed={31} className="absolute -inset-[10%] rounded-full" intensity={0.9} />

      {/* Soft edge vignette to seat the arch in the forest */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-[18%] -z-10 rounded-full bg-[radial-gradient(circle,rgba(7,29,32,0)_42%,rgba(7,29,32,0.55)_72%,rgba(7,29,32,0.9)_100%)]"
      />
    </div>
  );
}
