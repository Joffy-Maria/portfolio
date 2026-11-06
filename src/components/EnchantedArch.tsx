import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
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

/* The arch is deliberately flower-free — only ivy, moss, cracks and sparkles dress the stone ring. */

const ivyLeft = buildLeaves(Math.PI * 0.72, Math.PI * 1.68, OUTER + 8, 22, 5);
const ivyRight = buildLeaves(Math.PI * 1.78, Math.PI * 2.24, OUTER + 9, 11, 9);
const ivyBottom = buildLeaves(Math.PI * 0.18, Math.PI * 0.52, OUTER + 10, 8, 14);

const GATE_EASE = [0.22, 1, 0.36, 1] as const;

/* Leaves that make up the two halves of the garden gate (700-space coords). */
const gateLeftLeaves = buildLeaves(Math.PI * 0.5, Math.PI * 1.5, 196, 18, 11);
const gateRightLeaves = buildLeaves(Math.PI * 1.5, Math.PI * 2.5, 196, 18, 13);

export default function EnchantedArch({ entering = false }: { entering?: boolean }) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState<boolean>(reduceMotion === true);

  /* Reduced motion: show the portrait immediately, no garden gate. */
  useEffect(() => {
    if (reduceMotion) setRevealed(true);
  }, [reduceMotion]);

  /* The portal entry also reveals the portrait. */
  useEffect(() => {
    if (entering) setRevealed(true);
  }, [entering]);

  const portrait = (
    <img
      src="/images/portrait.webp"
      alt={revealed ? "Portrait of Joffy Maria Pius" : ""}
      aria-hidden={!revealed}
      width={941}
      height={1672}
      fetchPriority="high"
      decoding="async"
      className="h-full w-full object-cover object-[50%_0%]"
    />
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

      {/* Portrait inside the opening — hidden behind the garden gate until revealed */}
      <div className="absolute inset-[13.6%] overflow-hidden rounded-full bg-forest shadow-[inset_0_0_60px_rgba(7,29,32,0.85)]">
        {reduceMotion ? (
          portrait
        ) : (
          <motion.div
            className="absolute inset-0"
            initial={{ scale: 0.94, filter: "blur(10px)" }}
            animate={
              revealed
                ? { scale: 1, filter: "blur(0px)" }
                : { scale: 0.94, filter: "blur(10px)" }
            }
            transition={{ duration: 1.1, ease: GATE_EASE }}
          >
            {portrait}
          </motion.div>
        )}
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

        {/* Garden gate — click to part the ivy and reveal the portrait */}
        <AnimatePresence>
          {!revealed && (
            <motion.button
              type="button"
              key="garden-gate"
              onClick={() => setRevealed(true)}
              aria-label="Reveal portrait of Joffy Maria Pius"
              className="absolute inset-0 z-10 cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-gold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.45, delay: 0.35 } }}
            >
              {/* Left half of the gate */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 left-0 w-1/2 overflow-hidden rounded-l-full bg-[radial-gradient(circle_at_100%_50%,#14352a,#071512_80%)]"
                style={{ transformOrigin: "0% 50%" }}
                exit={{
                  x: "-118%",
                  rotate: -7,
                  opacity: 0,
                  transition: { duration: 0.9, ease: GATE_EASE },
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  className="absolute inset-y-0 left-0 h-full w-[200%]"
                  aria-hidden="true"
                >
                  <g transform="translate(-250 -250) scale(0.5714)">
                    <g fill="none" stroke="#3C5A43" strokeWidth="7" strokeLinecap="round" opacity="0.9">
                      <path d={arcPath(190, Math.PI * 0.52, Math.PI * 1.48)} />
                      <path d={arcPath(138, Math.PI * 0.55, Math.PI * 1.45)} />
                      <path d="M100 96C170 150 250 260 344 342" />
                    </g>
                    {gateLeftLeaves.map((leaf, i) => (
                      <path
                        key={i}
                        d={leafPath}
                        transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rotation.toFixed(
                          1,
                        )}) scale(${leaf.scale.toFixed(2)})`}
                        fill={leaf.fill}
                        fillOpacity="0.95"
                        stroke="#1B3227"
                        strokeWidth="1.2"
                      />
                    ))}
                  </g>
                </svg>
              </motion.span>

              {/* Right half of the gate */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-y-0 right-0 w-1/2 overflow-hidden rounded-r-full bg-[radial-gradient(circle_at_0%_50%,#14352a,#071512_80%)]"
                style={{ transformOrigin: "100% 50%" }}
                exit={{
                  x: "118%",
                  rotate: 7,
                  opacity: 0,
                  transition: { duration: 0.9, ease: GATE_EASE },
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  className="absolute inset-y-0 right-0 h-full w-[200%]"
                  aria-hidden="true"
                >
                  <g transform="translate(-250 -250) scale(0.5714)">
                    <g fill="none" stroke="#3C5A43" strokeWidth="7" strokeLinecap="round" opacity="0.9">
                      <path d={arcPath(190, Math.PI * 1.52, Math.PI * 2.48)} />
                      <path d={arcPath(138, Math.PI * 1.55, Math.PI * 2.45)} />
                      <path d="M600 104C530 150 450 262 356 342" />
                    </g>
                    {gateRightLeaves.map((leaf, i) => (
                      <path
                        key={i}
                        d={leafPath}
                        transform={`translate(${leaf.x.toFixed(1)} ${leaf.y.toFixed(1)}) rotate(${leaf.rotation.toFixed(
                          1,
                        )}) scale(${leaf.scale.toFixed(2)})`}
                        fill={leaf.fill}
                        fillOpacity="0.95"
                        stroke="#1B3227"
                        strokeWidth="1.2"
                      />
                    ))}
                  </g>
                </svg>
              </motion.span>

              {/* Center bud at the seam */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center"
                exit={{
                  opacity: 0,
                  scale: 1.7,
                  transition: { duration: 0.55, ease: GATE_EASE },
                }}
              >
                <span className="relative block h-16 w-16">
                  <span className="absolute inset-0 rounded-full bg-gold/20 blur-xl" />
                  <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full">
                    {[0, 72, 144, 216, 288].map((angle) => (
                      <path
                        key={angle}
                        d={leafPath}
                        transform={`translate(24 24) rotate(${angle}) scale(1.2)`}
                        fill="#4C6A4A"
                        fillOpacity="0.95"
                      />
                    ))}
                    <circle cx="24" cy="24" r="3.4" fill="#C6A66B" />
                  </svg>
                </span>
              </motion.span>

              {/* Sparkles drifting on the gate */}
              <motion.svg
                aria-hidden="true"
                viewBox="0 0 200 200"
                className="pointer-events-none absolute inset-0 h-full w-full"
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                <g fill="#F6E7BE">
                  {[
                    { x: 58, y: 66, s: 0.8, d: 0.2 },
                    { x: 144, y: 104, s: 0.6, d: 0.9 },
                    { x: 100, y: 152, s: 0.5, d: 1.5 },
                  ].map((spark, i) => (
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
              </motion.svg>

              {/* Reveal hint */}
              <motion.span
                aria-hidden="true"
                className="absolute bottom-[11%] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-midnight/80 px-3.5 py-2 text-[9px] uppercase tracking-[0.24em] text-gold-light"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
              >
                Click to reveal
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
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
