import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { MotionValue } from "framer-motion";
import { useMemo } from "react";

type TrailSparkleProps = {
  progress: MotionValue<number>;
  /** How far behind the fairy (in scroll progress) this sparkle sits. */
  behind: number;
  dx: number;
  dy: number;
  size: number;
};

/**
 * One sparkle in the fairy's wake. It fades in as the fairy passes and
 * then drifts away as the scroll moves on — scrolling back up reverses it.
 */
function TrailSparkle({ progress, behind, dx, dy, size }: TrailSparkleProps) {
  const opacity = useTransform(
    progress,
    [behind, behind + 0.012, behind + 0.07],
    [0, 0.85, 0],
  );
  const scale = useTransform(progress, [behind, behind + 0.07], [0.4, 1.1]);

  return (
    <motion.span
      className="absolute block rounded-full bg-gold-light"
      style={{
        left: dx,
        top: dy,
        width: size,
        height: size,
        opacity,
        scale,
        boxShadow: "0 0 8px 1px rgba(228,205,156,0.65)",
      }}
    />
  );
}

/**
 * A fairy that flies across the screen as you scroll down the page,
 * leaving a trail of sparkles behind it. Scrolling back up sends it
 * flying back the other way. Decorative only — hidden from assistive
 * technology and from users who prefer reduced motion.
 */
export default function ScrollFairy() {
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  /* Diagonal flight path: top-left to bottom-right across the page. */
  const x = useTransform(scrollYProgress, [0, 1], ["-8vw", "104vw"]);
  const y = useTransform(scrollYProgress, [0, 1], ["10vh", "82vh"]);

  /* Gentle sine wobble so the path loops instead of tracking a straight line. */
  const wobble = useTransform(scrollYProgress, (p) => {
    return Math.sin(p * Math.PI * 5) * (16 + 9 * Math.sin(p * Math.PI * 2));
  });
  const tilt = useTransform(scrollYProgress, (p) => {
    return Math.cos(p * Math.PI * 5) * 9;
  });

  const sparkles = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => {
        const t = i / 11;
        return {
          behind: t * 0.11,
          dx: -18 - t * 150 - Math.sin(i * 2.3) * 14,
          dy: 8 - t * 46 + Math.cos(i * 1.7) * 12,
          size: 2.4 + (i % 4) * 0.9,
        };
      }),
    [],
  );

  if (reduceMotion) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70]">
      <motion.div className="absolute left-0 top-0 will-change-transform" style={{ x, y }}>
        {/* Sparkle wake */}
        <div className="absolute left-0 top-0">
          {sparkles.map((sparkle, i) => (
            <TrailSparkle key={i} progress={scrollYProgress} {...sparkle} />
          ))}
        </div>

        <motion.div className="will-change-transform" style={{ y: wobble, rotate: tilt }}>
          <svg
            viewBox="0 0 64 64"
            width={36}
            height={36}
            fill="none"
            className="-translate-x-1/2"
            style={{ filter: "drop-shadow(0 0 10px rgba(228,205,156,0.6))" }}
          >
            <circle cx="32" cy="34" r="20" fill="url(#scroll-fairy-halo)" />
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
              <radialGradient id="scroll-fairy-halo" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#E4CD9C" stopOpacity=".38" />
                <stop offset="1" stopColor="#E4CD9C" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
}
