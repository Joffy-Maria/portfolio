import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  ExternalLink,
  Github,
  Info,
  ShieldAlert,
  X,
} from "lucide-react";
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { Project } from "../data/projects";
import ProjectPreview from "./ProjectPreview";

const EASE = [0.22, 1, 0.36, 1] as const;

type ProjectModalProps = {
  project: Project | null;
  onClose: () => void;
};

export default function ProjectModal({ project, onClose }: ProjectModalProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!project) return;

    const previousFocus = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 40);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab" || !panelRef.current) return;
      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      window.clearTimeout(focusTimer);
      previousFocus?.focus();
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <div
            aria-hidden="true"
            onClick={onClose}
            className="fixed inset-0 bg-midnight/90 backdrop-blur-md"
          />

          <div className="relative flex min-h-full items-start justify-center p-0 sm:p-6 lg:p-10">
            <motion.div
              ref={panelRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="case-study-title"
              initial={{ opacity: 0, y: 28, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.99 }}
              transition={{ duration: 0.45, ease: EASE }}
              className="relative w-full max-w-5xl border-y border-gold/20 bg-[#0A211F] shadow-[0_60px_120px_-40px_rgba(0,0,0,0.9)] sm:my-2 sm:rounded-2xl sm:border"
            >
              <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-gold/15 bg-[#0A211F]/95 px-5 py-3 backdrop-blur sm:rounded-t-2xl sm:px-8">
                <span className="text-[8px] uppercase tracking-[0.24em] text-gold/60">
                  Case study · {project.index}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={onClose}
                  className="inline-flex items-center gap-2 rounded-full border border-gold/25 px-3 py-1.5 text-[8.5px] uppercase tracking-[0.18em] text-ivory/70 transition hover:border-gold/60 hover:text-gold-light"
                >
                  Close <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </div>

              <div className="border-b border-gold/15 px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[8px] uppercase tracking-[0.22em] text-ivory/45">
                    {project.category}
                  </span>
                  {project.status ? (
                    <span className="rounded-full border border-rose/30 bg-rose/10 px-2.5 py-1 text-[7.5px] uppercase tracking-[0.16em] text-rose">
                      {project.status}
                    </span>
                  ) : null}
                </div>

                <h2
                  id="case-study-title"
                  className="mt-3 font-serif text-[clamp(2.4rem,6vw,4.2rem)] font-light leading-[0.92] text-ivory"
                >
                  {project.title}
                </h2>
                <p className="mt-3 font-serif text-lg italic text-gold/80 sm:text-xl">
                  {project.tagline}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-2.5">
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
                  <button type="button" onClick={onClose} className="btn-ghost">
                    Back to portfolio
                  </button>
                </div>
              </div>

              <div className="px-5 py-7 sm:px-8 sm:py-9 lg:px-10">
                <div className="mx-auto max-w-3xl">
                  <ProjectPreview project={project} />
                  <p className="mt-2.5 text-right text-[7.5px] uppercase tracking-[0.18em] text-ivory/30">
                    {project.links.some((link) => link.label.toLowerCase().includes("live"))
                      ? "Screenshot · live application"
                      : "Screenshot · project interface"}
                  </p>
                </div>

                <div className="mt-9 space-y-9">
                  <Block label="Overview">
                    <p>{project.description}</p>
                  </Block>

                  {project.problem || project.solution ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {project.problem ? (
                        <Block label="The problem">
                          <p>{project.problem}</p>
                        </Block>
                      ) : null}
                      {project.solution ? (
                        <Block label="The solution">
                          <p>{project.solution}</p>
                        </Block>
                      ) : null}
                    </div>
                  ) : null}

                  {project.features.length > 0 ? (
                    <Block label="Key features">
                      <ul className="grid gap-x-8 gap-y-2.5 sm:grid-cols-2">
                        {project.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-2.5">
                            <Check
                              className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/60"
                              aria-hidden="true"
                            />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </Block>
                  ) : null}

                  {project.stack.length > 0 ? (
                    <Block label="Technology stack">
                      <ul className="flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <li
                            key={tech}
                            className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-3 py-1.5 text-[11.5px] text-ivory/65"
                          >
                            {tech}
                          </li>
                        ))}
                      </ul>
                    </Block>
                  ) : null}

                  {project.privacyNote ? (
                    <div className="rounded-xl border border-gold/25 bg-gold/[0.05] p-4 sm:p-5">
                      <div className="flex items-center gap-2.5">
                        <ShieldAlert className="h-4 w-4 text-gold" aria-hidden="true" />
                        <h3 className="text-[9px] uppercase tracking-[0.2em] text-gold-light">
                          Privacy &amp; technical accuracy
                        </h3>
                      </div>
                      <p className="mt-2.5 text-[13px] leading-relaxed text-ivory/65">
                        {project.privacyNote}
                      </p>
                    </div>
                  ) : null}

                  {project.note ? (
                    <div className="flex items-start gap-3 rounded-xl border border-ivory/10 bg-ivory/[0.02] p-4">
                      <Info className="mt-0.5 h-4 w-4 shrink-0 text-moss" aria-hidden="true" />
                      <p className="text-[12.5px] leading-relaxed text-ivory/50">{project.note}</p>
                    </div>
                  ) : null}

                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-gold/15 pt-6">
                    <p className="max-w-md text-[11px] leading-relaxed text-ivory/35">
                      More context or a walkthrough can be shared on request.
                    </p>
                    <div className="flex flex-wrap gap-2.5">
                      {project.links.map((link) => (
                        <a
                          key={link.href}
                          href={link.href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1.5 text-[9.5px] uppercase tracking-[0.18em] text-gold-light transition hover:text-ivory"
                        >
                          {link.label} <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="text-[8.5px] uppercase tracking-[0.24em] text-gold/65">{label}</h3>
      <div className="mt-2.5 text-[13.5px] leading-[1.85] text-ivory/65">{children}</div>
    </div>
  );
}
