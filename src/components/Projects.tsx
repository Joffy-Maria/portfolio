import { ArrowUpRight, Github } from "lucide-react";
import { useCallback, useState } from "react";
import type { Project } from "../data/projects";
import { projects } from "../data/projects";
import { profile } from "../data/profile";
import Fireflies from "./Fireflies";
import Parallax from "./Parallax";
import ProjectCarousel from "./ProjectCarousel";
import ProjectModal from "./ProjectModal";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function ArchWatermark() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 800"
      fill="none"
      stroke="currentColor"
      className="h-full w-full text-gold/[0.055]"
    >
      <circle cx="400" cy="400" r="330" strokeWidth="0.8" />
      <circle cx="400" cy="400" r="268" strokeWidth="1.1" />
      <circle cx="400" cy="400" r="356" strokeWidth="0.5" strokeDasharray="2 10" />
      <path d="M70 400V236a330 330 0 0 1 660 0v164" strokeWidth="0.8" />
      <path d="M400 44v712M44 400h712" strokeWidth="0.4" strokeDasharray="1 14" opacity=".6" />
    </svg>
  );
}

export default function Projects() {
  const [selected, setSelected] = useState<Project | null>(null);
  const close = useCallback(() => setSelected(null), []);

  return (
    <section
      id="projects"
      className="relative overflow-hidden bg-midnight py-24 text-ivory sm:py-28 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_15%_5%,#0D2C27_0%,transparent_52%),radial-gradient(ellipse_at_100%_70%,rgba(23,76,59,0.3)_0%,transparent_55%)]" />
        <Parallax y={110} className="absolute -right-52 top-16 h-[760px] w-[760px]">
          <ArchWatermark />
        </Parallax>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <Fireflies count={11} seed={66} className="absolute inset-0" intensity={0.5} />
      </div>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="03"
            eyebrow="Selected work"
            title="Featured Projects"
            description="Selected projects showcasing my technical skills, creativity and problem-solving approach."
          />
          <p className="hidden shrink-0 border-l border-gold/25 pl-5 text-[9.5px] uppercase leading-relaxed tracking-[0.22em] text-ivory/40 lg:block">
            Five projects
            <br />
            Built end to end
          </p>
        </div>

        <div className="mt-14">
          {/* Deliberately NOT wrapped in Reveal: its animated blur/opacity
              would flatten the carousel's 3D context. The swarm gate still
              hides the whole shell until the fairies have flown. */}
          <ProjectCarousel projects={projects} onOpen={setSelected} />
        </div>

        <Reveal delay={0.05}>
          <div className="mt-8 flex flex-col gap-5 rounded-2xl border border-gold/15 bg-ivory/[0.02] p-6 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold">
                <Github className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-serif text-xl text-ivory">More on GitHub</p>
                <p className="mt-1 text-[12.5px] text-ivory/45">
                  Experiments, coursework and works in progress.
                </p>
              </div>
            </div>
            <a
              href={profile.github.url}
              target="_blank"
              rel="noreferrer noopener"
              className="btn-ghost group shrink-0"
            >
              Visit GitHub
              <ArrowUpRight
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </Reveal>
      </div>

      <ProjectModal project={selected} onClose={close} />
    </section>
  );
}
