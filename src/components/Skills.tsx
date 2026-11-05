import {
  ArrowDown,
  BrainCircuit,
  Code2,
  LayoutTemplate,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import { skillCategories } from "../data/skills";
import Fireflies from "./Fireflies";
import Parallax from "./Parallax";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  code: Code2,
  layout: LayoutTemplate,
  brain: BrainCircuit,
  tools: Wrench,
  sparkles: Sparkles,
};

function ContourLines() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 800"
      fill="none"
      stroke="currentColor"
      className="h-full w-full text-gold/10"
    >
      {Array.from({ length: 9 }, (_, i) => (
        <ellipse
          key={i}
          cx={400 + Math.sin(i * 1.1) * 18}
          cy={400 + Math.cos(i * 0.8) * 14}
          rx={120 + i * 42}
          ry={78 + i * 33}
          transform={`rotate(${i * 7 - 12} 400 400)`}
          strokeWidth="0.9"
          opacity={0.7 - i * 0.045}
        />
      ))}
      <path
        d="M0 620C140 560 240 610 360 540s210-30 440 40"
        strokeWidth="0.8"
        opacity=".35"
      />
      <path
        d="M0 680C160 620 250 670 380 600s230-20 420 30"
        strokeWidth="0.8"
        opacity=".25"
      />
    </svg>
  );
}

export default function Skills() {
  return (
    <section
      id="skills"
      className="relative overflow-hidden bg-forest py-24 text-ivory sm:py-28 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_0%,#174C3B_0%,transparent_58%),radial-gradient(ellipse_at_0%_100%,#0A2620_0%,transparent_62%)]" />
        <Parallax y={95} className="absolute -right-48 -top-24 h-[760px] w-[760px]">
          <ContourLines />
        </Parallax>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <Fireflies count={12} seed={44} className="absolute inset-0" intensity={0.55} />
      </div>

      <div className="shell relative">
        <div className="flex flex-wrap items-end justify-between gap-8">
          <SectionHeading
            index="02"
            eyebrow="Capabilities"
            title="Technical Skills"
            description="The languages, frameworks and tools I use to turn ideas into working products — organised by how I actually use them."
          />
          <p className="hidden shrink-0 border-l border-gold/25 pl-5 text-[9.5px] uppercase leading-relaxed tracking-[0.22em] text-ivory/40 lg:block">
            26 tools
            <br />
            5 disciplines
          </p>
        </div>

        <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
          {skillCategories.map((category, index) => {
            const Icon = ICONS[category.icon] ?? Code2;
            const wide = index >= 3;
            return (
              <Reveal
                as="article"
                key={category.id}
                delay={index * 0.05}
                className={`group relative overflow-hidden rounded-2xl border border-gold/15 bg-[linear-gradient(155deg,rgba(243,235,221,0.055),rgba(7,29,32,0.2))] p-6 transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_34px_70px_-46px_rgba(198,166,107,0.55)] sm:p-7 ${
                  wide ? "lg:col-span-3" : "lg:col-span-2"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-8 -top-10 h-32 w-32 rounded-full bg-gold/5 blur-2xl transition-colors duration-500 group-hover:bg-gold/12"
                />

                <div className="relative flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/25 bg-midnight/40 text-gold transition-colors duration-500 group-hover:border-gold/50 group-hover:text-gold-light">
                    <Icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="font-serif text-[13px] italic text-gold/40">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="relative mt-5 font-serif text-[1.55rem] leading-tight text-ivory">
                  {category.title}
                </h3>
                <p className="relative mt-2 max-w-md text-[12.5px] leading-relaxed text-ivory/50">
                  {category.description}
                </p>

                <ul className="relative mt-5 flex flex-wrap gap-2">
                  {category.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-3 py-1.5 text-[11.5px] text-ivory/75 transition-colors duration-300 hover:border-gold/40 hover:bg-gold/[0.06] hover:text-gold-light"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            );
          })}
        </div>

        <div className="mt-10 flex flex-col gap-5 border-t border-gold/15 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-[13px] leading-relaxed text-ivory/45">
            I choose tools for the problem at hand, not for the trend. The list above is a working
            toolkit — not a scorecard.
          </p>
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold/75 transition-colors hover:text-gold-light"
          >
            See how I apply them
            <ArrowDown
              aria-hidden="true"
              className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  );
}
