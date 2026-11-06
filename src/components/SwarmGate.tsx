import { motion, useReducedMotion } from "framer-motion";
import type { CSSProperties, ReactNode, RefCallback } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FairyFigure } from "./Fairy";

type GateContextValue = {
  /** Sections whose content is allowed to load (fairies have flown). */
  ready: ReadonlySet<string>;
};

const SwarmGateContext = createContext<GateContextValue | null>(null);

const SWARM_DURATION = 2300;
const FAST_SCROLL_VELOCITY = 2600; // px per second — flinging the wheel skips fairies

/**
 * Lets Reveal / SectionHeading ask whether the section they live in has
 * been "opened" by its fairy swarm yet. Attach the returned `ref` to the
 * gated element; the section is resolved from the DOM.
 */
export function useGatedSection(): {
  ref: RefCallback<HTMLElement>;
  gated: boolean;
} {
  const gate = useContext(SwarmGateContext);
  const [sectionId, setSectionId] = useState<string | null | undefined>(undefined);
  const ref = useCallback((node: HTMLElement | null) => {
    if (node) setSectionId(node.closest("section[id]")?.id ?? null);
  }, []);
  const gated =
    gate !== null &&
    (sectionId === undefined || (sectionId !== null && !gate.ready.has(sectionId)));
  return { ref, gated };
}

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type FairyFlight = {
  x: string[];
  y: string[];
  times: number[];
  duration: number;
  delay: number;
  size: number;
  flip: boolean;
  sparkles: Array<{ x: number; y: number; size: number; duration: string; delay: string }>;
};

function makeFlights(seed: number): FairyFlight[] {
  const random = mulberry32(seed);
  return Array.from({ length: 7 }, () => {
    const fromLeft = random() > 0.35;
    const startY = 14 + random() * 52;
    const mid1Y = 10 + random() * 56;
    const mid2Y = 10 + random() * 56;
    const exitY = 14 + random() * 52;
    const mid1X = 22 + random() * 26;
    const mid2X = 52 + random() * 26;
    const x = fromLeft
      ? ["-12vw", `${mid1X}vw`, `${mid2X}vw`, "112vw"]
      : ["112vw", `${100 - mid1X}vw`, `${100 - mid2X}vw`, "-12vw"];
    const dir = fromLeft ? -1 : 1;
    const sparkles = Array.from({ length: 5 }, (_, i) => ({
      x: dir * (16 + i * 11 + random() * 8),
      y: (random() - 0.5) * 34,
      size: 2.2 + random() * 3,
      duration: `${0.9 + random() * 0.7}s`,
      delay: `${i * 0.09}s`,
    }));
    return {
      x,
      y: [`${startY}vh`, `${mid1Y}vh`, `${mid2Y}vh`, `${exitY}vh`],
      times: [0, 0.34, 0.67, 1],
      duration: 1.7 + random() * 0.3,
      delay: random() * 0.25,
      size: 28 + random() * 14,
      flip: !fromLeft,
      sparkles,
    };
  });
}

function SwarmFairy({ flight }: { flight: FairyFlight }) {
  return (
    <motion.div
      className="absolute left-0 top-0 will-change-transform"
      initial={{ x: flight.x[0], y: flight.y[0], opacity: 0, rotate: 0 }}
      animate={{
        x: flight.x,
        y: flight.y,
        opacity: [0, 1, 1, 0],
        rotate: [0, -6, 5, 0],
      }}
      transition={{
        duration: flight.duration,
        delay: flight.delay,
        times: flight.times,
        ease: "easeInOut",
      }}
    >
      <div style={{ transform: flight.flip ? "scaleX(-1)" : undefined }}>
        <FairyFigure size={flight.size} gradientId="swarm-fairy-halo" />
      </div>
      {flight.sparkles.map((sparkle, i) => (
        <span
          key={i}
          className="twinkle absolute block rounded-full bg-gold-light"
          style={
            {
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              boxShadow: "0 0 7px 1px rgba(228,205,156,0.7)",
              "--tw-duration": sparkle.duration,
              "--tw-delay": sparkle.delay,
            } as CSSProperties
          }
        />
      ))}
    </motion.div>
  );
}

function SwarmOverlay({ seed, onDone }: { seed: number; onDone: () => void }) {
  const flights = useMemo(() => makeFlights(seed), [seed]);

  useEffect(() => {
    const t = window.setTimeout(onDone, SWARM_DURATION);
    return () => window.clearTimeout(t);
  }, [onDone]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
    >
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.5, 0.3, 0] }}
        transition={{
          duration: SWARM_DURATION / 1000,
          times: [0, 0.25, 0.65, 1],
          ease: "easeInOut",
        }}
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, rgba(228,205,156,0.13), transparent 62%)",
        }}
      />
      {flights.map((flight, i) => (
        <SwarmFairy key={i} flight={flight} />
      ))}
    </div>
  );
}

/**
 * Holds the sections sealed until their fairy swarm has flown.
 * Sections load when:
 * - their swarm finishes (normal scrolling down into them), or
 * - the user scrolls back up into them, or flings past them fast, or
 * - an anchor jump skips over them (then the target section swarms).
 * Disabled entirely under reduced motion.
 */
export function SwarmGateProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState<ReadonlySet<string>>(() => new Set(["home"]));
  const [swarm, setSwarm] = useState<{ key: number; id: string } | null>(null);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const swarmingRef = useRef(false);
  const queueRef = useRef<string[]>([]);
  const lastYRef = useRef(0);
  const lastTRef = useRef(0);

  const markReady = useCallback((id: string) => {
    setReady((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const startSwarm = useCallback((id: string) => {
    if (readyRef.current.has(id)) return;
    swarmingRef.current = true;
    setSwarm({ key: Date.now(), id });
  }, []);

  const finishSwarm = useCallback(
    (id: string) => {
      markReady(id);
      swarmingRef.current = false;
      setSwarm(null);
      while (queueRef.current.length > 0) {
        const next = queueRef.current.shift() as string;
        if (readyRef.current.has(next)) continue;
        const el = document.getElementById(next);
        const inView = !!el && el.getBoundingClientRect().top < window.innerHeight * 0.92;
        if (inView) {
          startSwarm(next);
          break;
        }
        markReady(next);
      }
    },
    [markReady, startSwarm],
  );

  useEffect(() => {
    if (reduceMotion) return;
    lastTRef.current = performance.now();
    const sections = Array.from(
      document.querySelectorAll("main section[id]"),
    ) as HTMLElement[];

    // Anything already scrolled past on load is ready right away.
    sections.forEach((el) => {
      if (el.getBoundingClientRect().bottom < 0) markReady(el.id);
    });

    const io = new IntersectionObserver((entries) => {
      const now = performance.now();
      const y = window.scrollY;
      const dt = Math.max(now - lastTRef.current, 1);
      const velocity = (Math.abs(y - lastYRef.current) / dt) * 1000;
      const scrollingDown = y >= lastYRef.current;
      lastYRef.current = y;
      lastTRef.current = now;

      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const id = (entry.target as HTMLElement).id;
        if (readyRef.current.has(id)) continue;
        if (!scrollingDown || velocity > FAST_SCROLL_VELOCITY) {
          markReady(id);
          continue;
        }
        if (swarmingRef.current) {
          if (!queueRef.current.includes(id)) queueRef.current.push(id);
          continue;
        }
        startSwarm(id);
      }
    });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [reduceMotion, markReady, startSwarm]);

  useEffect(() => {
    if (reduceMotion) return;
    const onHashChange = () => {
      const id = window.location.hash.replace("#", "");
      if (!id || !document.getElementById(id)) return;
      const sections = Array.from(document.querySelectorAll("main section[id]"));
      const idx = sections.findIndex((s) => s.id === id);
      if (idx < 0) return;
      sections.slice(0, idx).forEach((s) => markReady(s.id));
      if (readyRef.current.has(id)) return;
      queueRef.current = [];
      if (swarmingRef.current) queueRef.current.push(id);
      else startSwarm(id);
    };
    window.addEventListener("hashchange", onHashChange);
    onHashChange();
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [reduceMotion, markReady, startSwarm]);

  // Safety net for content that does not go through Reveal/SectionHeading.
  useLayoutEffect(() => {
    if (reduceMotion) return;
    document.querySelectorAll("main section[id]").forEach((el) => {
      el.classList.toggle("is-gated", !ready.has(el.id));
    });
  }, [ready, reduceMotion]);

  if (reduceMotion) {
    return <>{children}</>;
  }

  return (
    <SwarmGateContext.Provider value={{ ready }}>
      {children}
      {swarm ? <SwarmOverlay seed={swarm.key} onDone={() => finishSwarm(swarm.id)} /> : null}
    </SwarmGateContext.Provider>
  );
}
