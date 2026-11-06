import type { Project } from "../data/projects";

export default function ProjectPreview({ project, eager = false }: { project: Project; eager?: boolean }) {
  const { screenshot } = project;

  return (
    <div className="relative aspect-[16/10] w-full select-none overflow-hidden rounded-2xl border border-gold/20 bg-forest shadow-[0_24px_60px_-40px_rgba(0,0,0,0.9)]">
      <img
        src={screenshot.src}
        alt={screenshot.alt}
        width={screenshot.width}
        height={screenshot.height}
        loading={eager ? "eager" : "lazy"}
        decoding="async"
        className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.02]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(7,29,32,0.28),transparent_38%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-ivory/10"
      />
    </div>
  );
}
