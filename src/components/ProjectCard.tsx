import { ArrowUpRight, Check, ExternalLink, Github } from "lucide-react";
import type { Project } from "../data/projects";
import ProjectPreview from "./ProjectPreview";

type ProjectCardProps = {
  project: Project;
  variant: "primary" | "secondary" | "supporting";
  onOpen: (project: Project) => void;
};

export default function ProjectCard({ project, variant, onOpen }: ProjectCardProps) {
  const isSupporting = variant === "supporting";
  const reverse = variant === "secondary";

  const caption = project.links.some((link) => link.label.toLowerCase().includes("live"))
    ? "Screenshot · live application"
    : "Screenshot · project interface";

  return (
    <article
      className={`group relative h-full overflow-hidden rounded-2xl border border-gold/20 bg-[linear-gradient(150deg,rgba(243,235,221,0.045),rgba(7,29,32,0.5))] transition-all duration-500 hover:border-gold/45 hover:shadow-[0_44px_90px_-60px_rgba(198,166,107,0.5)] ${
        isSupporting ? "p-4 sm:p-5" : "p-5 sm:p-7 lg:p-9"
      }`}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -right-3 top-4 select-none font-serif text-[5rem] font-light leading-none text-ivory/[0.05] sm:text-[6.5rem]"
      >
        {project.index}
      </span>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/[0.04] blur-3xl transition-colors duration-700 group-hover:bg-gold/[0.08]"
      />

      <div
        className={`relative grid items-center ${
          isSupporting
            ? "gap-5"
            : reverse
              ? "gap-8 lg:grid-cols-[0.92fr_1fr] lg:gap-10"
              : "gap-8 lg:grid-cols-[1fr_0.92fr] lg:gap-10"
        }`}
      >
        <div
          className={`${isSupporting ? "order-2" : ""} ${
            reverse ? "lg:order-2" : ""
          } min-w-0`}
        >
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="font-serif text-[13px] italic text-gold/60">{project.index}</span>
            <span className="h-px w-6 bg-gold/30" aria-hidden="true" />
            <span className="text-[8.5px] uppercase tracking-[0.22em] text-ivory/45">
              {project.category}
            </span>
            {project.status ? (
              <span className="rounded-full border border-rose/30 bg-rose/10 px-2.5 py-1 text-[7.5px] uppercase tracking-[0.16em] text-rose">
                {project.status}
              </span>
            ) : null}
            {variant === "primary" ? (
              <span className="rounded-full border border-gold/30 bg-gold/10 px-2.5 py-1 text-[7.5px] uppercase tracking-[0.16em] text-gold-light">
                Featured
              </span>
            ) : null}
          </div>

          <h3
            className={`mt-4 font-serif font-light leading-[0.95] text-ivory ${
              isSupporting
                ? "text-[2rem]"
                : "text-[clamp(2.1rem,4vw,3.5rem)]"
            }`}
          >
            {project.title}
          </h3>

          <p
            className={`mt-2 font-serif italic text-gold/80 ${
              isSupporting ? "text-[15px]" : "text-[17px] sm:text-[19px]"
            }`}
          >
            {project.tagline}
          </p>

          <p
            className={`mt-4 leading-relaxed text-ivory/60 ${
              isSupporting ? "text-[12.5px]" : "text-[13.5px] sm:text-[14.5px]"
            }`}
          >
            {project.description}
          </p>

          {project.features.length > 0 ? (
            <ul
              className={`mt-5 grid gap-x-6 gap-y-2 ${
                isSupporting ? "grid-cols-1" : "sm:grid-cols-2"
              }`}
            >
              {project.features.slice(0, isSupporting ? 3 : 4).map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-[11.5px] text-ivory/55">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-gold/60" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          ) : null}

          {project.stack.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {project.stack.slice(0, isSupporting ? 4 : 6).map((tech) => (
                <li
                  key={tech}
                  className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-2.5 py-1 text-[10px] text-ivory/55"
                >
                  {tech}
                </li>
              ))}
              {project.stack.length > (isSupporting ? 4 : 6) ? (
                <li className="rounded-full border border-gold/20 px-2.5 py-1 text-[10px] text-gold/60">
                  +{project.stack.length - (isSupporting ? 4 : 6)} more
                </li>
              ) : null}
            </ul>
          ) : null}

          <div className={`flex flex-wrap items-center gap-2.5 ${isSupporting ? "mt-5" : "mt-7"}`}>
            {project.links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                className={`${
                  link.label.toLowerCase().includes("github") ? "btn-ghost" : "btn-gold"
                } ${isSupporting ? "px-4 py-2.5 text-[9px]" : ""}`}
              >
                {link.label.toLowerCase().includes("github") ? (
                  <Github className="h-3.5 w-3.5" aria-hidden="true" />
                ) : (
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                )}
                {link.label}
              </a>
            ))}

            <button
              type="button"
              onClick={() => onOpen(project)}
              className={`${
                project.links.length === 0 ? "btn-gold" : "btn-ghost"
              } group/btn ${isSupporting ? "px-4 py-2.5 text-[9px]" : ""}`}
            >
              View Case Study
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover/btn:-translate-y-0.5 group-hover/btn:translate-x-0.5"
              />
            </button>
          </div>
        </div>

        <div className={`${isSupporting ? "order-1" : ""} ${reverse ? "lg:order-1" : ""} min-w-0`}>
          <ProjectPreview project={project} />
          <p className="mt-2.5 text-right text-[7.5px] uppercase tracking-[0.18em] text-ivory/30">
            {caption}
          </p>
        </div>
      </div>
    </article>
  );
}
