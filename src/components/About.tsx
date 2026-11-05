import { ArrowUpRight, BrainCircuit, Code2, Download, PenTool, Puzzle } from "lucide-react";
import type { ComponentType } from "react";
import { profile } from "../data/profile";
import { Divider, Fern, Vine } from "./Botanical";
import Parallax from "./Parallax";
import ResumeMenu from "./ResumeMenu";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

const ICONS: Record<string, ComponentType<{ className?: string }>> = {
  code: Code2,
  brain: BrainCircuit,
  pen: PenTool,
  puzzle: Puzzle,
};

export default function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-ivory py-24 text-ink sm:py-28 lg:py-32">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_8%_0%,#FBF6EC_0%,transparent_55%),radial-gradient(ellipse_at_92%_100%,#E4D8C2_0%,transparent_60%)]" />
        <Parallax y={45} className="absolute -left-24 top-10 h-[540px] w-[320px]">
          <Fern className="h-full w-full text-emerald/15" />
        </Parallax>
        <Parallax y={-45} className="absolute -right-4 top-0 h-[640px] w-[130px]">
          <Vine className="h-full w-full text-emerald/12" />
        </Parallax>
        <div className="absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold-deep/30 to-transparent" />
      </div>

      <div className="shell relative">
        <SectionHeading
          tone="light"
          index="01"
          eyebrow="Introduction"
          title="About Me"
          description="A little about who I am and what I do."
        />

        <div className="mt-14 grid gap-16 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20 xl:gap-24">
          <Reveal className="relative mx-auto w-full max-w-[390px] pb-8 lg:mx-0">
            <div className="relative">
              <div
                aria-hidden="true"
                className="arch-mask absolute -inset-3 border border-gold-deep/35"
              />
              <div
                aria-hidden="true"
                className="absolute -right-4 -top-4 h-20 w-20 rounded-full border border-gold-deep/25"
              />

              <div className="arch-mask relative overflow-hidden border border-ink/10 bg-ivory-deep shadow-[0_35px_70px_-45px_rgba(23,33,29,0.6)]">
                <img
                  src={profile.portrait.src}
                  srcSet={`${profile.portrait.small} 560w, ${profile.portrait.src} 941w`}
                  sizes="(min-width: 1024px) 390px, 90vw"
                  alt={profile.portrait.alt}
                  width={941}
                  height={1672}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover object-[50%_0%]"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(to_top,rgba(7,29,32,0.62),rgba(7,29,32,0.08)_42%,transparent_65%)]"
                />
                <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                  <p className="font-serif text-[1.35rem] leading-none text-ivory">
                    {profile.name}
                  </p>
                  <p className="mt-2 text-[8.5px] uppercase tracking-[0.24em] text-ivory/65">
                    Computer Science & Engineering
                  </p>
                </div>
              </div>

              <div className="absolute -bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-gold-deep/30 bg-ivory px-4 py-2 shadow-[0_10px_30px_-20px_rgba(23,33,29,0.5)]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald" aria-hidden="true" />
                <span className="text-[8px] uppercase tracking-[0.22em] text-ink/70">
                  B.Tech · Currently pursuing
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="space-y-5 text-[15px] leading-[1.85] text-ink/75">
              {profile.about.map((paragraph, index) => (
                <p key={index} className={index === 0 ? "text-[16px] text-ink/85 sm:text-[17px]" : ""}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-10 grid gap-x-8 gap-y-7 sm:grid-cols-2">
              {profile.highlights.map((highlight) => {
                const Icon = ICONS[highlight.icon] ?? Code2;
                return (
                  <div key={highlight.title} className="border-t border-ink/10 pt-4">
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4 text-gold-deep" aria-hidden="true" />
                      <h3 className="font-serif text-[1.25rem] leading-none text-ink">
                        {highlight.title}
                      </h3>
                    </div>
                    <p className="mt-2 text-[12.5px] leading-relaxed text-ink/60">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <Divider className="mt-11" tone="light" />

            <div className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-4">
              <ResumeMenu
                label="Download Resume"
                className="btn-ink"
                leadingIcon={<Download className="h-4 w-4" aria-hidden="true" />}
              />
              <a
                href={profile.github.url}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink"
              >
                GitHub <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
              <a
                href={profile.linkedin.url}
                target="_blank"
                rel="noreferrer noopener"
                className="link-underline inline-flex items-center gap-1.5 text-[10.5px] uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-ink"
              >
                LinkedIn <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
