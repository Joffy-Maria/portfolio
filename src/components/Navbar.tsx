import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ArrowUpRight, Download, Menu, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { navItems } from "../data/navigation";
import { profile } from "../data/profile";
import LogoMark from "./LogoMark";
import ResumeMenu from "./ResumeMenu";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");
  const menuTriggerRef = useRef<HTMLButtonElement>(null);
  const { scrollY, scrollYProgress } = useScroll();

  const closeMenu = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => menuTriggerRef.current?.focus({ preventScroll: true }), 0);
  }, []);

  useMotionValueEvent(scrollY, "change", (value) => {
    setScrolled(value > 28);
  });

  useEffect(() => {
    const sections = navItems
      .map((item) => document.querySelector<HTMLElement>(item.href))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-42% 0px -52% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      // Only hijack Escape when the mobile menu is actually open,
      // so other Escape handlers (dropdowns, dialogs) behave normally.
      if (event.key === "Escape" && open) closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeMenu, open]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-gold/12 bg-midnight/90 backdrop-blur-xl"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-gold/0 via-gold to-gold/0"
      />

      <div className="shell flex h-[72px] items-center justify-between gap-4 lg:h-[80px] xl:gap-6">
        <a
          href="#home"
          className="group flex shrink-0 items-center gap-3"
        >
          <LogoMark className="h-9 w-9 text-gold transition-transform duration-500 group-hover:rotate-[8deg]" />
          <span className="sr-only flex-col leading-none sm:not-sr-only sm:flex">
            <span className="font-serif text-[17px] tracking-wide text-ivory">
              Joffy Maria Pius
            </span>
            <span className="mt-1 text-[8px] uppercase tracking-[0.32em] text-gold/70">
              Developer Portfolio
            </span>
          </span>
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "location" : undefined}
                className={`relative rounded-full px-2.5 py-2 text-[10.5px] uppercase tracking-[0.16em] transition-colors duration-300 xl:px-3.5 ${
                  isActive ? "text-gold-light" : "text-ivory/60 hover:text-ivory"
                }`}
              >
                {item.label}
                {isActive ? (
                  <motion.span
                    layoutId="nav-active-indicator"
                    className="absolute inset-x-2.5 -bottom-0.5 h-px bg-gold/70 xl:inset-x-3.5"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
              </a>
            );
          })}
        </nav>

        <div className="flex items-center gap-2.5">
          <ResumeMenu
            label="Resume"
            align="right"
            className="hidden rounded-full border border-gold/35 px-4 py-2 text-[9.5px] uppercase tracking-[0.18em] text-gold-light transition duration-300 hover:border-gold hover:bg-gold/10 sm:inline-flex"
          />

          <button
            ref={menuTriggerRef}
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Open navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-ivory/80 transition duration-300 hover:border-gold/60 hover:text-gold-light lg:hidden"
          >
            <Menu className="h-[18px] w-[18px]" aria-hidden="true" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open ? <MobileMenu active={active} onClose={closeMenu} /> : null}
      </AnimatePresence>
    </header>
  );
}

function MobileMenu({ active, onClose }: { active: string; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const focusables = Array.from(
      node.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !first || !last) return;
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    node.addEventListener("keydown", handleKeyDown);
    return () => node.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <motion.div
      ref={ref}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-0 z-[60] flex flex-col bg-midnight/97 backdrop-blur-2xl lg:hidden"
    >
      <div className="shell flex h-[72px] shrink-0 items-center justify-between border-b border-gold/10">
        <span className="flex items-center gap-3">
          <LogoMark className="h-8 w-8 text-gold" />
          <span className="font-serif text-base text-ivory">Joffy Maria Pius</span>
        </span>
        <button
          type="button"
          autoFocus
          onClick={onClose}
          aria-label="Close navigation menu"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/25 text-ivory/80 transition hover:border-gold/60 hover:text-gold-light"
        >
          <X className="h-[18px] w-[18px]" aria-hidden="true" />
        </button>
      </div>

      <div className="shell flex flex-1 flex-col justify-between overflow-y-auto pb-10 pt-6">
        <nav aria-label="Mobile primary">
          {navItems.map((item, index) => {
            const isActive = active === item.href.slice(1);
            return (
              <motion.a
                key={item.href}
                href={item.href}
                onClick={onClose}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 + index * 0.035, duration: 0.4, ease: EASE }}
                className="group flex items-baseline gap-4 border-b border-gold/10 py-4"
              >
                <span className="text-[9px] tracking-[0.3em] text-gold/50">{item.index}</span>
                <span
                  className={`font-serif text-[1.9rem] leading-none transition-colors ${
                    isActive ? "text-gold-light" : "text-ivory group-hover:text-gold-light"
                  }`}
                >
                  {item.label}
                </span>
                <ArrowUpRight
                  aria-hidden="true"
                  className="ml-auto h-4 w-4 self-center text-gold/30 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-gold"
                />
              </motion.a>
            );
          })}
        </nav>

        <div className="mt-9 space-y-5">
          <ResumeMenu
            label="Download Resume"
            className="btn-gold w-full justify-center"
            leadingIcon={<Download className="h-4 w-4" aria-hidden="true" />}
          />
          <div className="flex items-center justify-between gap-4 border-t border-gold/10 pt-5">
            <a
              href={profile.github.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ivory/60 transition hover:text-gold-light"
            >
              GitHub <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={profile.linkedin.url}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ivory/60 transition hover:text-gold-light"
            >
              LinkedIn <ArrowUpRight className="h-3 w-3" aria-hidden="true" />
            </a>
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ivory/60 transition hover:text-gold-light"
            >
              Email
            </a>
          </div>
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-moss">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
            {profile.availability}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
