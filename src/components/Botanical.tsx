type BotanicalProps = {
  className?: string;
};

/** A delicate gold sprig used beside section labels. */
export function Sprig({ className = "" }: BotanicalProps) {
  return (
    <svg
      viewBox="0 0 120 24"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M2 12h104" opacity=".5" />
      <path d="M96 12c6-6 12-7 20-6-2 7-9 10-20 6Z" />
      <path d="M84 12c5-5 10-6 16-5-2 6-8 8-16 5Z" opacity=".7" />
      <path d="M104 12c-2 5-1 9 3 12" opacity=".6" />
      <circle cx="116" cy="5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** Large fern silhouette for section corners. */
export function Fern({ className = "" }: BotanicalProps) {
  const fronds = Array.from({ length: 11 }, (_, i) => {
    const y = 26 + i * 26;
    const length = 88 - i * 4;
    const lean = 18 + i * 1.6;
    return { y, length, lean, i };
  });

  return (
    <svg
      viewBox="0 0 200 360"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
    >
      <path d="M118 356C106 286 98 210 104 132c3-38 14-72 34-104" opacity=".8" />
      {fronds.map(({ y, length, lean, i }) => (
        <g key={i} opacity={0.55 + (i % 3) * 0.12}>
          <path d={`M${106 - i * 0.4} ${y}c-${length * 0.34} -6 -${length * 0.6} 0 -${length} 16`} />
          <path d={`M${110 + i * 0.6} ${y + 10}c${length * 0.3} -8 ${length * 0.58} -4 ${length * 0.86} 10`} />
          <path d={`M${104 + lean * 0.1} ${y - 8}l${-lean * 0.5} -12`} opacity=".5" />
        </g>
      ))}
    </svg>
  );
}

/** Climbing vine used along the page edges. */
export function Vine({ className = "" }: BotanicalProps) {
  return (
    <svg
      viewBox="0 0 120 520"
      fill="none"
      aria-hidden="true"
      className={className}
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    >
      <path d="M58 0c-18 44 24 76 4 118s-34 66-10 108 32 66 8 108-22 58 6 92 14 60-6 94" />
      {Array.from({ length: 17 }, (_, i) => {
        const y = 24 + i * 29;
        const side = i % 2 === 0 ? 1 : -1;
        const x = 56 + Math.sin(i * 1.4) * 18;
        return (
          <g key={i} opacity={0.6 + (i % 4) * 0.08}>
            <path d={`M${x} ${y}c${side * 18} -10 ${side * 26} -2 ${side * 28} 12`} />
            <path
              d={`M${x + side * 28} ${y + 12}c${side * 10} -8 ${side * 18} -8 ${side * 22} 0c${-side * 8} 8 ${-side * 16} 6 ${-side * 22} 0Z`}
              fill="currentColor"
              fillOpacity=".12"
            />
          </g>
        );
      })}
    </svg>
  );
}

/** Ornamental divider — a thin line interrupted by a small botanical mark. */
export function Divider({ className = "", tone = "dark" }: BotanicalProps & { tone?: "dark" | "light" }) {
  const color = tone === "light" ? "text-gold-deep/55" : "text-gold/45";
  return (
    <div className={`flex items-center gap-4 ${className}`} aria-hidden="true">
      <span className={`h-px flex-1 bg-current ${color} opacity-40`} />
      <svg viewBox="0 0 48 20" className={`h-4 w-12 ${color}`} fill="none" stroke="currentColor">
        <path d="M2 10h16M30 10h16" strokeWidth="1" />
        <path d="M24 3c4 3 6 5 6 7s-2 4-6 7c-4-3-6-5-6-7s2-4 6-7Z" strokeWidth="1" />
        <circle cx="24" cy="10" r="1.4" fill="currentColor" />
      </svg>
      <span className={`h-px flex-1 bg-current ${color} opacity-40`} />
    </div>
  );
}
