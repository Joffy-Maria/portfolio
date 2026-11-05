import { motion } from "framer-motion";
import { useMemo } from "react";

type PortalOverlayProps = {
  origin: { x: number; y: number };
  scale: number;
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function PortalOverlay({ origin, scale }: PortalOverlayProps) {
  const particles = useMemo(() => {
    return Array.from({ length: 22 }, (_, i) => {
      const angle = (i / 22) * Math.PI * 2 + (i % 3) * 0.14;
      const distance = 120 + (i % 5) * 34;
      return {
        id: i,
        x: Math.cos(angle) * distance,
        y: Math.sin(angle) * distance,
        size: 2 + (i % 3),
        delay: (i % 6) * 0.035,
      };
    });
  }, []);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[95] overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.65, ease: "easeOut" }}
    >
      <motion.div
        className="absolute rounded-full"
        style={{
          left: origin.x,
          top: origin.y,
          width: 120,
          height: 120,
          x: "-50%",
          y: "-50%",
          background:
            "radial-gradient(circle, rgba(250,244,229,0.98) 0%, rgba(228,205,156,0.9) 24%, rgba(198,166,107,0.55) 46%, rgba(23,76,59,0.3) 68%, rgba(7,29,32,0) 78%)",
        }}
        initial={{ scale: 0, opacity: 0.95 }}
        animate={{ scale, opacity: [0.95, 0.92, 0.55, 0] }}
        transition={{ duration: 1.35, times: [0, 0.32, 0.72, 1], ease: EASE }}
      />

      <motion.div
        className="absolute rounded-full border border-gold-light/60"
        style={{ left: origin.x, top: origin.y, width: 240, height: 240, x: "-50%", y: "-50%" }}
        initial={{ scale: 0.3, opacity: 0.8 }}
        animate={{ scale: 6, opacity: 0 }}
        transition={{ duration: 1.1, ease: "easeOut" }}
      />

      {particles.map((particle) => (
        <motion.span
          key={particle.id}
          className="absolute rounded-full bg-gold-light"
          style={{
            left: origin.x,
            top: origin.y,
            width: particle.size,
            height: particle.size,
            boxShadow: "0 0 10px 2px rgba(228,205,156,0.55)",
          }}
          initial={{ x: particle.x, y: particle.y, opacity: 0, scale: 0.4 }}
          animate={{
            x: [particle.x, 0, -particle.x * 0.35],
            y: [particle.y, 0, -particle.y * 0.35],
            opacity: [0, 1, 0],
            scale: [0.4, 1.2, 0.2],
          }}
          transition={{ duration: 1.05, delay: particle.delay, ease: "easeInOut" }}
        />
      ))}
    </motion.div>
  );
}
