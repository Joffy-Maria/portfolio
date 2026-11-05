import { useMemo } from "react";
import type { CSSProperties } from "react";

type FirefliesProps = {
  count?: number;
  seed?: number;
  className?: string;
  /** Overall brightness multiplier, 0–1. */
  intensity?: number;
};

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Fireflies({
  count = 18,
  seed = 7,
  className = "absolute inset-0",
  intensity = 1,
}: FirefliesProps) {
  const flies = useMemo(() => {
    const random = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => {
      const size = 2 + random() * 4.5;
      return {
        id: i,
        left: 2 + random() * 96,
        top: 4 + random() * 92,
        size,
        dx: (random() - 0.5) * 70,
        dy: -20 - random() * 70,
        duration: 9 + random() * 13,
        delay: -(random() * 20),
        opacity: (0.45 + random() * 0.5) * intensity,
      };
    });
  }, [count, seed, intensity]);

  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      {flies.map((fly) => {
        const style: CSSVars = {
          left: `${fly.left}%`,
          top: `${fly.top}%`,
          width: `${fly.size}px`,
          height: `${fly.size}px`,
          "--ff-x": `${fly.dx}px`,
          "--ff-y": `${fly.dy}px`,
          "--ff-duration": `${fly.duration}s`,
          "--ff-delay": `${fly.delay}s`,
          "--ff-opacity": fly.opacity,
        };
        return <span key={fly.id} className="firefly" style={style} />;
      })}
    </div>
  );
}
