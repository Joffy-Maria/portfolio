import type { CSSProperties } from "react";

type FairyProps = {
  className?: string;
  delay?: number;
  duration?: number;
  scale?: number;
};

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

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
      <svg
        viewBox="0 0 64 64"
        width={44 * scale}
        height={44 * scale}
        fill="none"
        style={{ filter: "drop-shadow(0 0 10px rgba(228,205,156,0.55))" }}
      >
        <circle cx="32" cy="34" r="20" fill="url(#fairy-halo)" />
        <g className="fairy-wing">
          <path
            d="M31 32C22 17 10 14 9 23c-1 8 10 13 22 12Z"
            fill="#F3EBDD"
            fillOpacity=".5"
            stroke="#E4CD9C"
            strokeOpacity=".45"
            strokeWidth=".7"
          />
          <path
            d="M33 32c9-15 21-18 22-9 1 8-10 13-22 12Z"
            fill="#F3EBDD"
            fillOpacity=".42"
            stroke="#E4CD9C"
            strokeOpacity=".4"
            strokeWidth=".7"
          />
          <path
            d="M31 36C23 45 14 47 14 40c0-5 8-8 17-6Z"
            fill="#F3EBDD"
            fillOpacity=".24"
            stroke="#E4CD9C"
            strokeOpacity=".25"
            strokeWidth=".6"
          />
          <path
            d="M33 36c8 9 17 11 17 4 0-5-8-8-17-6Z"
            fill="#F3EBDD"
            fillOpacity=".2"
            stroke="#E4CD9C"
            strokeOpacity=".22"
            strokeWidth=".6"
          />
        </g>
        <path d="M32 27c2.6 4 2.6 12 0 18-2.6-6-2.6-14 0-18Z" fill="#E4CD9C" />
        <circle cx="32" cy="25" r="2.6" fill="#FFF8DF" />
        <circle cx="32" cy="25" r="4.6" fill="#E4CD9C" fillOpacity=".18" />
        <defs>
          <radialGradient id="fairy-halo" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0" stopColor="#E4CD9C" stopOpacity=".38" />
            <stop offset="1" stopColor="#E4CD9C" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
