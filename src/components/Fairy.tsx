import type { CSSProperties } from "react";

type FairyProps = {
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
};

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * A fairy "tone" — the colours its wings, body and glow are drawn in.
 * The ambient fairies use the default gold tone; the scroll swarm gives
 * each fairy its own tone from the site palette so the flock reads on
 * both the dark and the cream sections.
 */
export type FairyTone = {
  /** Translucent wing fill (keep it light — wings are ghostly). */
  wing: string;
  /** Wing outline. */
  wingStroke: string;
  /** Solid core: body, face glow and sparkles. */
  body: string;
  /** Soft halo behind the fairy. */
  halo: string;
};

const DEFAULT_TONE: FairyTone = {
  wing: "#F3EBDD",
  wingStroke: "#E4CD9C",
  body: "#E4CD9C",
  halo: "#E4CD9C",
};

/**
 * The bare fairy artwork, shared by the ambient fairy and the scroll
 * swarm so the two look identical. Decorative only.
 */
export function FairyFigure({
  size = 44,
  gradientId = "fairy-halo",
  tone = DEFAULT_TONE,
}: {
  size?: number;
  gradientId?: string;
  tone?: FairyTone;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      style={{ filter: `drop-shadow(0 0 10px ${tone.halo}8c)` }}
    >
      <circle cx="32" cy="34" r="20" fill={`url(#${gradientId})`} />
      <g className="fairy-wing">
        <path
          d="M31 32C22 17 10 14 9 23c-1 8 10 13 22 12Z"
          fill={tone.wing}
          fillOpacity=".5"
          stroke={tone.wingStroke}
          strokeOpacity=".45"
          strokeWidth=".7"
        />
        <path
          d="M33 32c9-15 21-18 22-9 1 8-10 13-22 12Z"
          fill={tone.wing}
          fillOpacity=".42"
          stroke={tone.wingStroke}
          strokeOpacity=".4"
          strokeWidth=".7"
        />
        <path
          d="M31 36C23 45 14 47 14 40c0-5 8-8 17-6Z"
          fill={tone.wing}
          fillOpacity=".24"
          stroke={tone.wingStroke}
          strokeOpacity=".25"
          strokeWidth=".6"
        />
        <path
          d="M33 36c8 9 17 11 17 4 0-5-8-8-17-6Z"
          fill={tone.wing}
          fillOpacity=".2"
          stroke={tone.wingStroke}
          strokeOpacity=".22"
          strokeWidth=".6"
        />
      </g>
      <path d="M32 27c2.6 4 2.6 12 0 18-2.6-6-2.6-14 0-18Z" fill={tone.body} />
      <circle cx="32" cy="25" r="2.6" fill="#FFF8DF" />
      <circle cx="32" cy="25" r="4.6" fill={tone.body} fillOpacity=".18" />
      <defs>
        <radialGradient id={gradientId} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor={tone.halo} stopOpacity=".38" />
          <stop offset="1" stopColor={tone.halo} stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/**
 * A small, deliberately rare fairy. Decorative only — hidden from assistive
 * technology and from users who prefer reduced motion.
 */
export default function Fairy({ className = "", delay = 8, duration = 28, scale = 1 }: FairyProps) {
  const style: CSSVars = {
    "--fairy-delay": `${delay}s`,
    "--fairy-duration": `${duration}s`,
  };

  return (
    <div aria-hidden="true" className={`fairy pointer-events-none absolute ${className}`} style={style}>
      <FairyFigure size={44 * scale} />
    </div>
  );
}
