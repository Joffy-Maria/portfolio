import { motion, useReducedMotion } from "framer-motion";
import { Award, BookOpen, GraduationCap, Users } from "lucide-react";
import { education } from "../data/education";
import { Fern } from "./Botanical";
import Parallax from "./Parallax";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const placeholder = "To be added";

const meta = [
  { label: "Institution", value: education.institution || placeholder },
  { label: "University", value: education.university || placeholder },
  { label: "Academic period", value: education.period || placeholder },
  { label: "CGPA", value: education.cgpa || placeholder },
];

export default function Education() {
  const reduceMotion = useReducedMotion();
  return (
    <section
      id="education"
      className="relative overflow-hidden bg-ivory-deep py-24 text-ink sm:py-28 lg:py-32"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_100%_0%,#F6EFE1_0%,transparent_55%),radial-gradient(ellipse_at_0%_100%,#E2D6C0_0%,transparent_55%)]" />
        <Parallax y={-60} className="absolute -right-16 bottom-0 h-[520px] w-[300px]">
          <Fern className="h-full w-full text-emerald/12" />
        </Parallax>
        <Parallax y={55} className="absolute -left-40 top-10 h-[520px] w-[520px]">
          <svg
            viewBox="0 0 600 600"
            fill="none"
            stroke="currentColor"
            className="h-full w-full text-gold-deep/[0.16]"
          >
            <circle cx="300" cy="300" r="230" strokeWidth="0.8" />
            <circle cx="300" cy="300" r="180" strokeWidth="0.8" strokeDasharray="2 8" />
            <path d="M300 70v460M70 300h460" strokeWidth="0.4" strokeDasharray="1 12" />
          </svg>
        </Parallax>
      </div>

      <div className="shell relative">
        <SectionHeading
          tone="light"
          index="04"
          eyebrow="Academic background"
          title="Education"
          description="My current academic path, and the areas of computer science I am exploring alongside it."
        />

        <div className="relative mt-14">
          <div
            aria-hidden="true"
            className="absolute bottom-2 left-[19px] top-2 w-px overflow-hidden sm:left-[27px]"
          >
            {reduceMotion ? (
              <div className="h-full w-full bg-ink/15" />
            ) : (
              <motion.div
                className="h-full w-full origin-top bg-ink/15"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true, margin: "-15% 0px -35% 0px" }}
                transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </div>

          <div className="relative pl-14 sm:pl-24">
            <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-gold-deep/40 bg-ivory text-gold-deep shadow-[0_8px_24px_-16px_rgba(23,33,29,0.6)] sm:h-14 sm:w-14">
              <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" />
            </span>

            <Reveal>
              <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
                <div>
                  <p className="eyebrow text-gold-deep">{education.status}</p>
                  <h3 className="mt-3 font-serif text-[clamp(1.9rem,3.5vw,2.8rem)] font-light leading-[1.02] text-ink">
                    {education.degree}
                  </h3>
                  <p className="mt-1.5 font-serif text-xl italic text-emerald">{education.field}</p>

                  <p className="mt-5 max-w-xl text-[14px] leading-[1.8] text-ink/65">
                    Currently pursuing undergraduate studies in computer science, with a focus on
                    building practical projects across web development, machine learning and
                    interface design.
                  </p>

                  <ul className="mt-6 flex flex-wrap gap-2">
                    {education.focus.map((area) => (
                      <li
                        key={area}
                        className="rounded-full border border-ink/15 bg-ivory/50 px-3 py-1.5 text-[11px] text-ink/65"
                      >
                        {area}
                      </li>
                    ))}
                  </ul>

                  <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 border-t border-ink/10 pt-6 sm:grid-cols-4">
                    {meta.map((item) => (
                      <div key={item.label}>
                        <dt className="text-[8px] uppercase tracking-[0.18em] text-ink/40">
                          {item.label}
                        </dt>
                        <dd
                          className={`mt-1.5 text-[12.5px] ${
                            item.value === placeholder
                              ? "font-serif italic text-ink/35"
                              : "text-ink/75"
                          }`}
                        >
                          {item.value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  <div className="rounded-2xl border border-ink/10 bg-ivory/65 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                      <h4 className="text-[9px] uppercase tracking-[0.2em] text-ink/55">
                        Relevant coursework
                      </h4>
                    </div>
                    {education.coursework.length > 0 ? (
                      <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink/70">
                        {education.coursework.map((course) => (
                          <li key={course}>{course}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-[12.5px] leading-relaxed text-ink/45">
                        Coursework highlights will be listed here as the curriculum progresses.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-ink/10 bg-ivory/65 p-5 sm:p-6">
                    <div className="flex items-center gap-2.5">
                      <Award className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                      <h4 className="text-[9px] uppercase tracking-[0.2em] text-ink/55">
                        Academic achievements
                      </h4>
                    </div>
                    {education.achievements.length > 0 ? (
                      <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink/70">
                        {education.achievements.map((achievement) => (
                          <li key={achievement}>{achievement}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="mt-3 text-[12.5px] leading-relaxed text-ink/45">
                        Verified academic achievements will be added here when available.
                      </p>
                    )}
                  </div>

                  <div className="rounded-2xl border border-ink/10 bg-ivory/65 p-5 sm:col-span-2 sm:p-6 lg:col-span-1">
                    <div className="flex items-center gap-2.5">
                      <Users className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                      <h4 className="text-[9px] uppercase tracking-[0.2em] text-ink/55">
                        Memberships
                      </h4>
                    </div>
                    <ul className="mt-3 space-y-1.5 text-[12.5px] text-ink/70">
                      {education.memberships.map((membership) => (
                        <li key={membership}>{membership}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
