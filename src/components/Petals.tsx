import { useMemo } from "react";
import type { CSSProperties } from "react";

type PetalsProps = {
  count?: number;
  seed?: number;
  className?: string;
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

export default function Petals({ count = 9, seed = 21, className = "absolute inset-0" }: PetalsProps) {
  const petals = useMemo(() => {
    const random = mulberry32(seed);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: 4 + random() * 92,
      size: 5 + random() * 7,
      drift: (random() - 0.5) * 160,
      duration: 17 + random() * 15,
      delay: -(random() * 26),
      opacity: 0.3 + random() * 0.4,
      rotate: random() * 360,
    }));
  }, [count, seed]);

  return (
    <div aria-hidden="true" className={`pointer-events-none overflow-hidden ${className}`}>
      {petals.map((petal) => {
        const style: CSSVars = {
          left: `${petal.left}%`,
          width: `${petal.size}px`,
          height: `${petal.size * 0.72}px`,
          "--petal-x": `${petal.drift}px`,
          "--petal-duration": `${petal.duration}s`,
          "--petal-delay": `${petal.delay}s`,
          opacity: petal.opacity,
          transform: `rotate(${petal.rotate}deg)`,
        };
        return <span key={petal.id} className="petal" style={style} />;
      })}
    </div>
  );
}
