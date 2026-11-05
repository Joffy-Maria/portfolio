import { ArrowUp, ArrowUpRight, Github, Linkedin, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { navItems } from "../data/navigation";
import { profile } from "../data/profile";
import Fairy from "./Fairy";
import LogoMark from "./LogoMark";
import ResumeMenu from "./ResumeMenu";

export default function Footer() {
  const [easterEgg, setEasterEgg] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const revealFairy = () => {
    setEasterEgg(true);
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setEasterEgg(false), 6500);
  };

  return (
    <footer className="relative overflow-hidden border-t border-gold/15 bg-[#041114] text-ivory">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_120%,rgba(23,76,59,0.35),transparent_60%)]" />
        <p className="absolute inset-x-0 -bottom-4 select-none text-center font-serif text-[17vw] leading-none text-ivory/[0.025]">
          Joffy Maria Pius
        </p>
      </div>

      {easterEgg ? (
        <Fairy className="bottom-24 left-[12%] z-10 opacity-90" delay={0} duration={9} scale={1} />
      ) : null}

      <div className="shell relative py-14 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr_1fr] lg:gap-12">
          <div>
            <a href="#home" className="group inline-flex items-center gap-3">
              <LogoMark className="h-10 w-10 text-gold transition-transform duration-500 group-hover:rotate-[8deg]" />
              <span className="sr-only">Back to top</span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-lg tracking-wide text-ivory">
                  {profile.name}
                </span>
                <span className="mt-1 text-[8px] uppercase tracking-[0.3em] text-gold/70">
                  Developer Portfolio
                </span>
              </span>
            </a>

            <p className="mt-5 max-w-sm font-serif text-[1.05rem] italic leading-relaxed text-ivory/50">
              “{profile.intro}”
            </p>

            <div className="mt-6 flex items-center gap-2.5">
              <a
                href={profile.github.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="GitHub profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 transition hover:border-gold/50 hover:text-gold-light"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={profile.linkedin.url}
                target="_blank"
                rel="noreferrer noopener"
                aria-label="LinkedIn profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 transition hover:border-gold/50 hover:text-gold-light"
              >
                <Linkedin className="h-4 w-4" aria-hidden="true" />
              </a>
              <a
                href={`mailto:${profile.email}`}
                aria-label="Send an email"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-ivory/15 text-ivory/60 transition hover:border-gold/50 hover:text-gold-light"
              >
                <Mail className="h-4 w-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          <nav aria-label="Footer navigation">
            <p className="text-[8.5px] uppercase tracking-[0.24em] text-gold/55">Sections</p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="text-[12px] text-ivory/50 transition-colors hover:text-gold-light"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="text-[8.5px] uppercase tracking-[0.24em] text-gold/55">Elsewhere</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href={profile.github.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1.5 text-[12px] text-ivory/50 transition-colors hover:text-gold-light"
                >
                  GitHub
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <a
                  href={profile.linkedin.url}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="group inline-flex items-center gap-1.5 text-[12px] text-ivory/50 transition-colors hover:text-gold-light"
                >
                  LinkedIn
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
              <li>
                <ResumeMenu
                  label="Resume"
                  align="left"
                  className="group inline-flex items-center gap-1.5 text-[12px] text-ivory/50 transition-colors hover:text-gold-light"
                />
              </li>
              <li>
                <a
                  href="#contact"
                  className="group inline-flex items-center gap-1.5 text-[12px] text-ivory/50 transition-colors hover:text-gold-light"
                >
                  Get in touch
                  <ArrowUpRight
                    className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-ivory/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[10px] tracking-[0.08em] text-ivory/30">
            © 2026 {profile.name}. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            <button
              type="button"
              onClick={revealFairy}
              aria-label="A hidden light — find the hidden firefly"
              title="There is something here..."
              className="group inline-flex items-center gap-2 text-[9px] uppercase tracking-[0.18em] text-ivory/25 transition-colors hover:text-gold/70"
            >
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-gold/40 transition-all duration-300 group-hover:bg-gold group-hover:shadow-[0_0_10px_2px_rgba(228,205,156,0.5)]"
              />
              A hidden light
            </button>

            <p className="text-[9px] uppercase tracking-[0.18em] text-ivory/25">
              Designed &amp; built with care
            </p>

            <a
              href="#home"
              className="group inline-flex items-center gap-1.5 text-[9px] uppercase tracking-[0.18em] text-ivory/35 transition-colors hover:text-gold-light"
            >
              Back to top
              <ArrowUp
                className="h-3 w-3 transition-transform duration-300 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
            </a>
          </div>
        </div>

        <div role="status" aria-live="polite" className="min-h-[18px]">
          {easterEgg ? (
            <p className="mt-3 text-[10px] tracking-[0.12em] text-gold/60">
              You found a firefly. It&apos;s the small details that make a place feel alive.
            </p>
          ) : null}
        </div>
      </div>
    </footer>
  );
}
