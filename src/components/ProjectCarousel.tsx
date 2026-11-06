import { AnimatePresence, animate, motion, useMotionValue, useReducedMotion } from "framer-motion";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Github,
  MoveHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from "react";
import type { Project } from "../data/projects";
import ProjectPreview from "./ProjectPreview";

const EASE = [0.22, 1, 0.36, 1] as const;
/** Swipe distance (px) or flick speed that advances the carousel. */
const SWIPE_DISTANCE = 36;
const FLICK_VELOCITY = 0.25; // px per ms

type CarouselProps = {
  projects: Project[];
  onOpen: (project: Project) => void;
};

/** Shortest signed distance from the active card, in [-2, 2] for 5 cards. */
function signedOffset(index: number, active: number, count: number) {
  const d = ((index - active) % count + count) % count;
  return d > count / 2 ? d - count : d;
}

function CarouselCard({
  project,
  index,
  offset,
  spacing,
  cardWidth,
  cardHeight,
  isActive,
  transition,
}: {
  project: Project;
  index: number;
  offset: number;
  spacing: number;
  cardWidth: number;
  cardHeight: number;
  isActive: boolean;
  transition: { type: "spring"; stiffness: number; damping: number; mass: number } | { duration: number };
}) {
  const distance = Math.abs(offset);
  return (
    <motion.article
      data-index={index}
      aria-hidden="true"
      className="group absolute left-1/2 top-1/2 cursor-pointer select-none [backface-visibility:hidden]"
      initial={false}
      animate={{
        x: offset * spacing,
        rotateY: offset * 26,
        z: -distance * 95,
        scale: (isActive ? 1.04 : 1) - distance * 0.09,
        opacity: distance === 0 ? 1 : distance === 1 ? 0.72 : 0.38,
      }}
      transition={transition}
      style={{
        width: cardWidth,
        height: cardHeight,
        marginLeft: -cardWidth / 2,
        marginTop: -cardHeight / 2,
      }}
    >
      <div
        className={`overflow-hidden rounded-2xl border bg-[#0d1c1e] ${
          isActive
            ? "border-gold/60 shadow-[0_44px_90px_-28px_rgba(198,166,107,0.45)]"
            : "border-gold/20 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85)]"
        }`}
      >
        <ProjectPreview project={project} eager />
        <div className="flex items-center gap-3 px-4 py-3">
          <span className="font-serif text-[13px] italic text-gold/60">{project.index}</span>
          <h3 className="min-w-0 flex-1 truncate font-serif text-lg leading-none text-ivory">
            {project.title}
          </h3>
          <ArrowUpRight className="h-4 w-4 shrink-0 text-gold/50" aria-hidden="true" />
        </div>
      </div>
    </motion.article>
  );
}

export default function ProjectCarousel({ projects, onOpen }: CarouselProps) {
  const count = projects.length;
  const reduceMotion = useReducedMotion();
  const [active, setActive] = useState(0);
  const [hasDragged, setHasDragged] = useState(false);
  const [cardWidth, setCardWidth] = useState(340);
  const dragX = useMotionValue(0);
  const viewportRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const dragRef = useRef<{
    id: number;
    startX: number;
    moved: boolean;
    samples: Array<{ x: number; t: number }>;
  } | null>(null);

  /* Card width from the stage so the fan scales at any size. */
  useEffect(() => {
    const el = viewportRef.current;
    if (!el || count === 0) return;
    const update = () => setCardWidth(Math.min(el.clientWidth * 0.76, 430));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [count]);

  const settleDrag = () => {
    controlsRef.current?.stop();
    controlsRef.current = animate(dragX, 0, { type: "spring", stiffness: 260, damping: 28 });
  };

  const goTo = (index: number) => {
    setActive(((index % count) + count) % count);
    setHasDragged(true);
  };

  const onPointerDown = (e: ReactPointerEvent<HTMLDivElement>) => {
    controlsRef.current?.stop();
    dragRef.current = {
      id: e.pointerId,
      startX: e.clientX,
      moved: false,
      samples: [{ x: e.clientX, t: performance.now() }],
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    const dx = e.clientX - d.startX;
    if (Math.abs(dx) > 6) {
      d.moved = true;
      setHasDragged(true);
    }
    dragX.set(dx);
    d.samples.push({ x: e.clientX, t: performance.now() });
    if (d.samples.length > 5) d.samples.shift();
  };

  const onPointerUp = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d || e.pointerId !== d.id) return;
    dragRef.current = null;
    const dx = e.clientX - d.startX;
    if (!d.moved) {
      const cell = (e.target as HTMLElement).closest<HTMLElement>("[data-index]");
      if (cell) goTo(Number(cell.dataset.index));
      settleDrag();
      return;
    }
    const samples = d.samples;
    const last = samples[samples.length - 1];
    const prev = samples[Math.max(0, samples.length - 3)];
    const velocity = (last.x - prev.x) / Math.max(last.t - prev.t, 1);
    if (dx <= -SWIPE_DISTANCE || velocity <= -FLICK_VELOCITY) {
      goTo(active + 1);
    } else if (dx >= SWIPE_DISTANCE || velocity >= FLICK_VELOCITY) {
      goTo(active - 1);
    }
    settleDrag();
  };

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      goTo(active - 1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      goTo(active + 1);
    }
  };

  const project = projects[active];
  const spacing = cardWidth * 0.66;
  const cardHeight = cardWidth * 0.625 + 66;
  const cardTransition = reduceMotion
    ? { duration: 0.01 }
    : { type: "spring" as const, stiffness: 120, damping: 22, mass: 0.9 };

  return (
    <div>
      {/* Coverflow stage */}
      <div
        ref={viewportRef}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects. Drag, swipe, or use the arrow keys to browse."
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          dragRef.current = null;
          settleDrag();
        }}
        className="relative h-[400px] touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-gold/60 focus-visible:ring-offset-4 focus-visible:ring-offset-midnight sm:h-[440px] lg:h-[490px]"
      >
        {/* Glow behind the fan */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/2 h-[74%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(198,166,107,0.16),transparent_62%)] blur-2xl"
        />

        {/* Drag wrapper shifts the whole fan; cards keep their own 3D */}
        <motion.div
          className="absolute inset-0"
          style={{ x: dragX, transformStyle: "preserve-3d", transformPerspective: 1200 }}
        >
          {projects.map((item, i) => (
            <CarouselCard
              key={item.id}
              project={item}
              index={i}
              offset={signedOffset(i, active, count)}
              spacing={spacing}
              cardWidth={cardWidth}
              cardHeight={cardHeight}
              isActive={i === active}
              transition={cardTransition}
            />
          ))}
        </motion.div>

        {/* Drag hint */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute inset-x-0 bottom-1 flex justify-center transition-opacity duration-500 ${
            hasDragged ? "opacity-0" : "opacity-100"
          }`}
        >
          <span className="flex items-center gap-2 rounded-full border border-ivory/10 bg-midnight/60 px-3.5 py-1.5 text-[9px] uppercase tracking-[0.22em] text-ivory/45 backdrop-blur-sm">
            <MoveHorizontal className="h-3.5 w-3.5 text-gold/60" aria-hidden="true" />
            Swipe / drag to explore
          </span>
        </div>
      </div>

      {/* Active project details */}
      {project ? (
        <div className="mx-auto mt-2 max-w-2xl text-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: EASE }}
              aria-live="polite"
            >
              <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
                <span className="font-serif text-[13px] italic text-gold/60">{project.index}</span>
                <span className="h-px w-6 bg-gold/30" aria-hidden="true" />
                <span className="text-[8.5px] uppercase tracking-[0.22em] text-ivory/45">
                  {project.category}
                </span>
                {project.featured === "primary" ? (
                  <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[7.5px] uppercase tracking-[0.16em] text-gold-light">
                    Featured
                  </span>
                ) : null}
              </div>

              <h3 className="mt-3 font-serif text-[clamp(1.9rem,4vw,2.8rem)] font-light leading-none text-ivory">
                {project.title}
              </h3>
              <p className="mt-2 font-serif text-[15px] italic text-gold/80 sm:text-base">
                {project.tagline}
              </p>
              <p className="mx-auto mt-3 max-w-xl text-[13px] leading-relaxed text-ivory/60 sm:text-[13.5px]">
                {project.description}
              </p>

              {project.stack.length > 0 ? (
                <ul className="mt-4 flex flex-wrap justify-center gap-1.5">
                  {project.stack.slice(0, 5).map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-2.5 py-1 text-[10px] text-ivory/55"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              ) : null}

              <div className="mt-5 flex flex-wrap items-center justify-center gap-2.5">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className={
                      link.label.toLowerCase().includes("github") ? "btn-ghost" : "btn-gold"
                    }
                  >
                    {link.label.toLowerCase().includes("github") ? (
                      <Github className="h-3.5 w-3.5" aria-hidden="true" />
                    ) : (
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    )}
                    {link.label}
                  </a>
                ))}
                <button type="button" onClick={() => onOpen(project)} className="btn-ghost group/btn">
                  View Case Study
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
                  />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      ) : null}

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => goTo(active - 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-ivory/70 transition duration-300 hover:border-gold/60 hover:text-gold-light"
        >
          <ChevronLeft className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        <div className="flex items-center gap-2.5" role="tablist" aria-label="Choose a project">
          {projects.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-label={`Show ${item.title}`}
              onClick={() => goTo(i)}
              className="flex h-10 w-10 items-center justify-center"
            >
              <span
                aria-hidden="true"
                className={`block rounded-full transition-all duration-300 ${
                  i === active ? "h-2 w-8 bg-gold" : "h-2 w-2 bg-ivory/25 hover:bg-ivory/50"
                }`}
              />
            </button>
          ))}
        </div>

        <button
          type="button"
          aria-label="Next project"
          onClick={() => goTo(active + 1)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 text-ivory/70 transition duration-300 hover:border-gold/60 hover:text-gold-light"
        >
          <ChevronRight className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>

        <span className="hidden text-[10px] tracking-[0.2em] text-ivory/40 sm:block">
          {String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}
