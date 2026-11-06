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
import type { FairyTone } from "./Fairy";

type GateContextValue = {
  /** Sections whose content is allowed to load (fairies have flown). */
  ready: ReadonlySet<string>;
};

const SwarmGateContext = createContext<GateContextValue | null>(null);

const SWARM_DURATION = 2300;

/*
 * The swarm flock, one tone per fairy, drawn from the site palette.
 * Each tone keeps a light translucent wing over a saturated core so the
 * fairies read on both the dark sections and the cream ones — where the
 * old gold-only fairies vanished.
 */
const FAIRY_TONES: FairyTone[] = [
  { wing: "#C6A66B", wingStroke: "#A98A50", body: "#A98A50", halo: "#C6A66B" }, // gold
  { wing: "#E3A8B2", wingStroke: "#C77A85", body: "#C77A85", halo: "#C77A85" }, // rose
  { wing: "#6FA68B", wingStroke: "#2E6B4F", body: "#174C3B", halo: "#2E6B4F" }, // emerald
  { wing: "#A9BC93", wingStroke: "#647653", body: "#647653", halo: "#647653" }, // moss
  { wing: "#84AFA8", wingStroke: "#2F5D5A", body: "#2F5D5A", halo: "#2F5D5A" }, // deep teal
  { wing: "#9AA3A0", wingStroke: "#4A5250", body: "#202724", halo: "#4A5250" }, // charcoal
  { wing: "#E6C87A", wingStroke: "#B08D4F", body: "#B08D4F", halo: "#C6A66B" }, // amber
];

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
  tone: FairyTone;
  sparkles: Array<{ x: number; y: number; size: number; duration: string; delay: string }>;
};

function makeFlights(seed: number): FairyFlight[] {
  const random = mulberry32(seed);
  return Array.from({ length: FAIRY_TONES.length }, (_, i) => {
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
      tone: FAIRY_TONES[i % FAIRY_TONES.length],
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
        <FairyFigure size={flight.size} gradientId="swarm-fairy-halo" tone={flight.tone} />
      </div>
      {flight.sparkles.map((sparkle, i) => (
        <span
          key={i}
          className="twinkle absolute block rounded-full"
          style={
            {
              left: sparkle.x,
              top: sparkle.y,
              width: sparkle.size,
              height: sparkle.size,
              backgroundColor: flight.tone.body,
              boxShadow: `0 0 7px 1px ${flight.tone.body}`,
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
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    const t = window.setTimeout(() => onDoneRef.current(), SWARM_DURATION);
    return () => window.clearTimeout(t);
  }, [seed]);

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
 * - their swarm finishes (scrolling into them, either direction), or
 * - an anchor jump skips over them (then the target section swarms).
 *
 * Leaving a section seals it again, so scrolling back to it replays the
 * swarm — with a short cooldown so bouncing on a boundary doesn't keep
 * the content hidden. Disabled entirely under reduced motion.
 */
export function SwarmGateProvider({ children }: { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  const [ready, setReady] = useState<ReadonlySet<string>>(() => new Set(["home"]));
  const [swarm, setSwarm] = useState<{ key: number; id: string } | null>(null);
  const readyRef = useRef(ready);
  const swarmIdRef = useRef<string | null>(null);
  const queueRef = useRef<string[]>([]);
  const lastSwarmAtRef = useRef<Record<string, number>>({});

  /* Keep the ref current synchronously: finishSwarm drains the queue in
     the same tick as markReady, before the re-render would propagate. */
  const markReady = useCallback((id: string) => {
    if (readyRef.current.has(id)) return;
    const next = new Set(readyRef.current);
    next.add(id);
    readyRef.current = next;
    setReady(next);
  }, []);

  const sealSection = useCallback((id: string) => {
    if (!readyRef.current.has(id)) return;
    const next = new Set(readyRef.current);
    next.delete(id);
    readyRef.current = next;
    setReady(next);
  }, []);

  const startSwarm = useCallback((id: string) => {
    if (readyRef.current.has(id) || swarmIdRef.current === id) return;
    lastSwarmAtRef.current[id] = performance.now();
    swarmIdRef.current = id;
    setSwarm({ key: Date.now(), id });
  }, []);

  const finishSwarm = useCallback(
    (id: string) => {
      markReady(id);
      swarmIdRef.current = null;
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

    const sections = Array.from(
      document.querySelectorAll("main section[id]"),
    ) as HTMLElement[];

    // Anything already scrolled past on load is ready right away.
    sections.forEach((el) => {
      if (el.getBoundingClientRect().bottom < 0) markReady(el.id);
    });

    /* Delay between swarms for the same section, so jiggling on a
       section boundary doesn't cycle the gate on and off. */
    const REPEAT_COOLDOWN = 4500;

    const io = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const id = (entry.target as HTMLElement).id;
        if (!entry.isIntersecting) {
          /* The section has fully left the viewport: seal it again (from
             read-only, off-screen state) so coming back replays the swarm. */
          sealSection(id);
          continue;
        }
        if (readyRef.current.has(id)) continue;
        /* Already flying for this section, or waiting its turn — leave it
           alone so the swarm is never short-circuited mid-flight. */
        if (swarmIdRef.current === id || queueRef.current.includes(id)) continue;
        const lastSwarmAt = lastSwarmAtRef.current[id] ?? 0;
        if (performance.now() - lastSwarmAt < REPEAT_COOLDOWN) {
          /* Recently opened — bounce back in instantly, no fairies. */
          markReady(id);
          continue;
        }
        if (swarmIdRef.current) {
          queueRef.current.push(id);
          continue;
        }
        startSwarm(id);
      }
    });
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, [reduceMotion, markReady, sealSection, startSwarm]);

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
      if (swarmIdRef.current === id) return;
      if (swarmIdRef.current) queueRef.current.push(id);
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
