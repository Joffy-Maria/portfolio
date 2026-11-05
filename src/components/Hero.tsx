import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Download, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, MouseEvent } from "react";
import { profile } from "../data/profile";
import EnchantedArch from "./EnchantedArch";
import Fairy from "./Fairy";
import Fireflies from "./Fireflies";
import Petals from "./Petals";
import PortalOverlay from "./PortalOverlay";
import ResumeMenu from "./ResumeMenu";
import Reveal from "./Reveal";

type CSSVars = CSSProperties & Record<`--${string}`, string | number>;

const EASE = [0.22, 1, 0.36, 1] as const;

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function ForestSilhouette() {
  const trees = useMemo(() => {
    const random = mulberry32(91);
    return Array.from({ length: 15 }, (_, i) => {
      const leftSide = i < 8;
      const x = leftSide ? random() * 500 : 940 + random() * 500;
      const width = 16 + random() * 52;
      const lean = (random() - 0.5) * 56;
      return {
        id: i,
        x,
        width,
        lean,
        opacity: 0.22 + random() * 0.32,
        height: 620 + random() * 340,
      };
    });
  }, []);

  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full opacity-80 blur-[1.5px]"
    >
      <defs>
        <linearGradient id="tree-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#03110f" stopOpacity="0.95" />
          <stop offset="70%" stopColor="#03110f" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#03110f" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {trees.map((tree) => (
        <g key={tree.id} opacity={tree.opacity}>
          <path
            d={`M${tree.x} 900 L${tree.x + tree.width * 0.22 + tree.lean} ${
              900 - tree.height
            } L${tree.x + tree.width * 0.78 + tree.lean} ${900 - tree.height} L${
              tree.x + tree.width
            } 900 Z`}
            fill="url(#tree-fade)"
          />
          <ellipse
            cx={tree.x + tree.width / 2 + tree.lean}
            cy={900 - tree.height}
            rx={tree.width * 1.9}
            ry={tree.width * 1.1}
            fill="#03110f"
            opacity=".75"
          />
        </g>
      ))}

      <g fill="#03110f" opacity=".55">
        <ellipse cx="150" cy="40" rx="340" ry="150" />
        <ellipse cx="1290" cy="20" rx="360" ry="170" />
      </g>
    </svg>
  );
}

export default function Hero() {
  const [entering, setEntering] = useState(false);
  const [portal, setPortal] = useState<{ origin: { x: number; y: number }; scale: number } | null>(
    null,
  );
  const archRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const pending = timers.current;
    return () => {
      pending.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  const handleExplore = (event: MouseEvent<HTMLAnchorElement>) => {
    if (reduceMotion) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    if (entering) return;

    const rect = archRef.current?.getBoundingClientRect();
    const origin = rect
      ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const scale = Math.ceil(Math.hypot(window.innerWidth, window.innerHeight) / 120) + 2;

    setPortal({ origin, scale });
    setEntering(true);

    timers.current.push(
      window.setTimeout(() => {
        document.getElementById("about")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 700),
      window.setTimeout(() => setEntering(false), 1650),
      window.setTimeout(() => setPortal(null), 1900),
    );
  };

  return (
    <section
      id="home"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden bg-midnight"
    >
      {/* Atmosphere */}
      <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_38%,#123b31_0%,#071d20_52%,#041114_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_32%,rgba(198,166,107,0.18),transparent_44%)]" />
        <ForestSilhouette />

        <div className="absolute -top-1/4 right-[4%] h-[130%] w-[46%] rotate-[16deg] bg-[linear-gradient(180deg,rgba(228,205,156,0.09),rgba(228,205,156,0.02)_45%,transparent_72%)] blur-2xl mix-blend-screen" />

        <div
          className="fog absolute -left-[15%] top-[26%] h-[46%] w-[75%] rounded-full bg-[radial-gradient(ellipse,rgba(198,166,107,0.1),transparent_66%)] blur-3xl"
          style={{ "--fog-duration": "32s" } as CSSVars}
        />
        <div
          className="fog absolute -right-[10%] bottom-[4%] h-[48%] w-[62%] rounded-full bg-[radial-gradient(ellipse,rgba(100,118,83,0.16),transparent_68%)] blur-3xl"
          style={{ "--fog-duration": "38s", "--fog-delay": "-12s" } as CSSVars}
        />

        <div className="absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(7,29,32,0.95)_0%,rgba(7,29,32,0.76)_38%,rgba(7,29,32,0.12)_68%,rgba(7,29,32,0.4)_100%)] lg:block" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(7,29,32,0.9)_0%,rgba(7,29,32,0.32)_30%,rgba(7,29,32,0.72)_78%,#071d20_100%)] lg:hidden" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_top,#071d20,transparent)]" />

        <Fireflies count={26} seed={3} className="absolute inset-0" intensity={0.85} />
        <Petals count={10} seed={12} className="absolute inset-0" />
        <Fairy className="left-[4%] top-[26%] opacity-80" delay={10} duration={30} scale={0.9} />
      </div>

      <div className="shell relative z-10 flex w-full flex-1 flex-col justify-center pb-10 pt-28 sm:pt-32 lg:pb-14">
        <div className="grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.04fr_0.96fr] lg:gap-4">
          {/* Copy */}
          <div className="order-2 max-w-[640px] lg:order-1">
            <Reveal y={14}>
              <div className="flex items-center gap-3">
                <span className="h-px w-9 bg-gold/60" aria-hidden="true" />
                <p className="eyebrow text-gold/85">Portfolio — 2026</p>
              </div>
            </Reveal>

            <Reveal delay={0.08} y={22}>
              <h1 className="mt-5 font-serif text-[clamp(3.2rem,10.5vw,6.4rem)] font-light leading-[0.85] tracking-[-0.02em] text-ivory">
                <span className="block">Joffy Maria</span>
                <span className="text-gold-gradient mt-1 block italic">Pius</span>
              </h1>
            </Reveal>

            <Reveal delay={0.16}>
              <div className="mt-7 space-y-2.5">
                <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-ivory/85 sm:text-[13px]">
                  {profile.role}
                </p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-gold/70 sm:text-[11px]">
                  {profile.roles.map((role, index) => (
                    <span key={role}>
                      {index > 0 ? (
                        <span className="mx-2 text-gold/30" aria-hidden="true">
                          |
                        </span>
                      ) : null}
                      {role}
                    </span>
                  ))}
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.24}>
              <p className="mt-6 max-w-md font-serif text-[clamp(1.15rem,2vw,1.45rem)] italic leading-[1.55] text-ivory/70">
                “{profile.intro}”
              </p>
            </Reveal>

            <Reveal delay={0.32}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <a href="#about" onClick={handleExplore} className="btn-gold group">
                  Explore My Portfolio
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  />
                </a>
                <ResumeMenu
                  label="Download Resume"
                  className="btn-ghost group"
                  leadingIcon={
                    <Download
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5"
                    />
                  }
                />
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
                <span className="text-[9px] uppercase tracking-[0.28em] text-ivory/30">
                  Find me
                </span>
                <a
                  href={profile.github.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ivory/65 transition-colors hover:text-gold-light"
                >
                  <Github className="h-3.5 w-3.5" aria-hidden="true" /> GitHub
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href={profile.linkedin.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ivory/65 transition-colors hover:text-gold-light"
                >
                  <Linkedin className="h-3.5 w-3.5" aria-hidden="true" /> LinkedIn
                  <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${profile.email}`}
                  className="link-underline inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.16em] text-ivory/65 transition-colors hover:text-gold-light"
                >
                  <Mail className="h-3.5 w-3.5" aria-hidden="true" /> Email
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.48}>
              <p className="mt-7 flex items-center gap-2.5 text-[10px] uppercase tracking-[0.2em] text-moss lg:hidden">
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                {profile.availability}
              </p>
            </Reveal>
          </div>

          {/* Arch */}
          <div
            ref={archRef}
            className="relative order-1 mx-auto w-full max-w-[262px] sm:max-w-[360px] lg:order-2 lg:max-w-[590px] lg:pl-4"
          >
            <EnchantedArch entering={entering} />

            <div className="pointer-events-none absolute -right-2 bottom-[10%] hidden xl:block">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8, ease: EASE }}
                className="flex items-center gap-2.5 rounded-full border border-gold/20 bg-midnight/75 px-4 py-2.5 backdrop-blur-sm"
              >
                <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
                </span>
                <span className="text-[8.5px] uppercase tracking-[0.22em] text-ivory/75">
                  Open to internships
                </span>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="mt-10 hidden items-center justify-between border-t border-ivory/10 pt-5 lg:flex">
          <a
            href="#about"
            className="group flex items-center gap-3 text-[9px] uppercase tracking-[0.3em] text-ivory/40 transition-colors hover:text-gold/80"
          >
            Scroll to explore
            <span className="relative block h-7 w-px overflow-hidden bg-ivory/15" aria-hidden="true">
              <span className="scroll-cue-line absolute inset-0 bg-gold/80" />
            </span>
          </a>

          <p className="flex items-center gap-2.5 text-[9px] uppercase tracking-[0.24em] text-ivory/45">
            <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-50" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-gold" />
            </span>
            {profile.availability}
          </p>
        </div>
      </div>

      <AnimatePresence>
        {portal ? <PortalOverlay origin={portal.origin} scale={portal.scale} /> : null}
      </AnimatePresence>
    </section>
  );
}
