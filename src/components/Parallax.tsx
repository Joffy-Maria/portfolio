import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import type { ReactNode } from "react";
import { useRef } from "react";

type ParallaxProps = {
  children: ReactNode;
  /** Pixels of vertical drift between entering and leaving the viewport. */
  y?: number;
  className?: string;
};

/**
 * Wraps decorative background art so it drifts vertically as the section
 * scrolls through the viewport. Disabled under reduced motion.
 */
export default function Parallax({ children, y = 60, className = "" }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [y, -y]);

  if (reduceMotion) {
    return (
      <div ref={ref} aria-hidden="true" className={className}>
        {children}
      </div>
    );
  }

  return (
    <div ref={ref} aria-hidden="true" className={className}>
      <motion.div style={{ y: translateY }}>{children}</motion.div>
    </div>
  );
}
