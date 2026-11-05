import { motion, useReducedMotion } from "framer-motion";
import { Award, ArrowUpRight, Briefcase, Users } from "lucide-react";
import type { ComponentType } from "react";
import {
  experienceEntries,
  opportunityAreas,
} from "../data/experience";
import Fireflies from "./Fireflies";
import Parallax from "./Parallax";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  briefcase: Briefcase,
  users: Users,
  award: Award,
};

export default function Experience() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="experience"
      className="relative overflow-hidden bg-forest py-24 text-ivory sm:py-28 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,#174C3B_0%,transparent_52%),radial-gradient(ellipse_at_100%_100%,#0A2620_0%,transparent_58%)]" />
        <Parallax y={70} className="absolute -left-56 top-1/4 h-[620px] w-[620px]">
          <svg
            viewBox="0 0 700 700"
            fill="none"
            stroke="currentColor"
            className="h-full w-full text-gold/[0.07]"
          >
            {Array.from({ length: 7 }, (_, i) => (
              <ellipse
                key={i}
                cx="350"
                cy="350"
                rx={90 + i * 38}
                ry={60 + i * 30}
                transform={`rotate(${i * 11} 350 350)`}
                strokeWidth="0.8"
              />
            ))}
          </svg>
        </Parallax>
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/25 to-transparent" />
        <Fireflies count={10} seed={77} className="absolute inset-0" intensity={0.45} />
      </div>

      <div className="shell relative">
        <SectionHeading
          index="05"
          eyebrow="Beyond the classroom"
          title="Experience & Achievements"
          description="Projects, internships and leadership roles — and the opportunities I am currently open to."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[1.12fr_0.88fr] lg:gap-14">
          <div>
            <div className="relative">
              <div
                aria-hidden="true"
                className="absolute bottom-2 left-[5px] top-2 w-px bg-gold/20"
              />

              <div className="space-y-8">
                {experienceEntries.map((entry, index) => (
                  <Reveal key={entry.id} delay={index * 0.06}>
                    <div className="relative pl-8 sm:pl-10">
                      <span
                        aria-hidden="true"
                        className="absolute left-0 top-2 flex h-[11px] w-[11px] items-center justify-center rounded-full border border-gold/60 bg-forest"
                      >
                        {reduceMotion ? (
                          <span className="h-[3px] w-[3px] rounded-full bg-gold" />
                        ) : (
                          <motion.span
                            className="h-[3px] w-[3px] rounded-full bg-gold"
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true, margin: "-20% 0px -35% 0px" }}
                            transition={{
                              type: "spring",
                              stiffness: 380,
                              damping: 18,
                              delay: 0.15 + index * 0.06,
                            }}
                          />
                        )}
                      </span>

                      <div className="rounded-2xl border border-gold/15 bg-ivory/[0.025] p-5 transition-colors duration-500 hover:border-gold/30 sm:p-6">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="rounded-full border border-gold/25 bg-gold/10 px-2.5 py-1 text-[7.5px] uppercase tracking-[0.18em] text-gold-light">
                            {entry.type}
                          </span>
                          <span className="text-[8px] uppercase tracking-[0.2em] text-ivory/35">
                            {entry.period}
                          </span>
                        </div>

                        <h3 className="mt-3.5 font-serif text-[1.55rem] leading-tight text-ivory sm:text-[1.7rem]">
                          {entry.role}
                        </h3>
                        <p className="mt-1.5 text-[10.5px] uppercase tracking-[0.16em] text-gold/60">
                          {entry.organisation}
                        </p>
                        <p className="mt-4 text-[13.5px] leading-[1.8] text-ivory/60">
                          {entry.summary}
                        </p>

                        <ul className="mt-5 flex flex-wrap gap-1.5">
                          {entry.tags.map((tag) => (
                            <li
                              key={tag}
                              className="rounded-full border border-ivory/10 bg-ivory/[0.03] px-2.5 py-1 text-[10px] text-ivory/50"
                            >
                              {tag}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[9px] uppercase tracking-[0.24em] text-gold/60">Currently open to</p>
            <div className="mt-4 space-y-3">
              {opportunityAreas.map((area) => {
                const Icon = ICONS[area.icon] ?? Briefcase;
                return (
                  <div
                    key={area.title}
                    className="group flex items-start gap-3.5 rounded-xl border border-ivory/10 bg-ivory/[0.02] p-4 transition-colors duration-300 hover:border-gold/30 hover:bg-gold/[0.04]"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/20 text-gold/70 transition-colors group-hover:text-gold-light">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <h3 className="font-serif text-[1.15rem] leading-tight text-ivory">
                        {area.title}
                      </h3>
                      <p className="mt-1 text-[11.5px] leading-relaxed text-ivory/45">
                        {area.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 rounded-2xl border border-gold/20 bg-[linear-gradient(150deg,rgba(198,166,107,0.09),rgba(7,29,32,0.2))] p-5">
              <p className="font-serif text-lg leading-snug text-ivory">
                Have an opportunity that fits?
              </p>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-ivory/50">
                I&apos;d be glad to hear about internships, collaborations or interesting problems.
              </p>
              <a
                href="#contact"
                className="group mt-4 inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-gold-light transition-colors hover:text-ivory"
              >
                Start a conversation
                <ArrowUpRight
                  aria-hidden="true"
                  className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
