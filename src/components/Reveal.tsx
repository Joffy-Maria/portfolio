import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useGatedSection } from "./SwarmGate";

const EASE = [0.22, 1, 0.36, 1] as const;

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: "div" | "li" | "article";
};

export default function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const { ref, gated } = useGatedSection();
  const MotionTag = as === "li" ? motion.li : as === "article" ? motion.article : motion.div;

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  /* Sealed by the fairy swarm: content stays hidden until its section is
     ready, then this remounts as a motion element and animates in. */
  if (gated) {
    const Tag = as;
    return (
      <Tag ref={ref} className={`${className ?? ""} invisible`} aria-hidden="true">
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      ref={ref}
      className={className}
      initial={{ opacity: 0, y, filter: "blur(8px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-70px" }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  );
}
