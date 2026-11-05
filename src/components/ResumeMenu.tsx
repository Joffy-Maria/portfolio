import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Download, Eye } from "lucide-react";
import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import { profile } from "../data/profile";

type ResumeMenuProps = {
  /** Visible text or element shown inside the trigger button. */
  label: ReactNode;
  /** Classes applied to the trigger button (button-specific styling). */
  className?: string;
  /** Optional leading icon rendered before the label. Defaults to a Download icon. */
  leadingIcon?: ReactNode;
  align?: "left" | "right";
};

export default function ResumeMenu({
  label,
  className = "",
  leadingIcon,
  align = "left",
}: ResumeMenuProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLSpanElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = () => setOpen(false);

  /* Close on outside click and on Escape (refocus the trigger). */
  useEffect(() => {
    if (!open) return;
    const onMouseDown = (event: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  /* Move focus to the first option when the menu opens. */
  useEffect(() => {
    if (!open) return;
    const first = menuRef.current?.querySelector<HTMLAnchorElement>("a");
    first?.focus();
  }, [open]);

  return (
    <span ref={rootRef} className="relative inline-flex">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className={`${className} items-center gap-2.5`}
      >
        {leadingIcon ?? <Download className="h-3.5 w-3.5" aria-hidden="true" />}
        <span>{label}</span>
        <ChevronDown
          aria-hidden="true"
          className={`h-3.5 w-3.5 shrink-0 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            ref={menuRef}
            role="menu"
            aria-label="Resume options"
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={`absolute top-full z-30 mt-2 w-60 overflow-hidden rounded-xl border border-gold/25 bg-[#0A211F] shadow-[0_28px_60px_-25px_rgba(0,0,0,0.85)] ${
              align === "right" ? "right-0" : "left-0"
            }`}
          >
            <a
              role="menuitem"
              href={profile.resume}
              target="_blank"
              rel="noopener"
              onClick={close}
              className="flex items-start gap-3 px-4 py-3 text-ivory/80 transition-colors hover:bg-ivory/[0.05] hover:text-ivory focus-visible:bg-ivory/[0.05] focus-visible:text-ivory focus-visible:outline-none"
            >
              <Eye className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium">View resume</span>
                <span className="mt-1 text-[8.5px] uppercase tracking-[0.16em] text-ivory/40">
                  Opens in a new tab
                </span>
              </span>
            </a>

            <a
              role="menuitem"
              href={profile.resume}
              download={profile.resumeFileName}
              onClick={close}
              className="flex items-start gap-3 border-t border-ivory/10 px-4 py-3 text-ivory/80 transition-colors hover:bg-ivory/[0.05] hover:text-ivory focus-visible:bg-ivory/[0.05] focus-visible:text-ivory focus-visible:outline-none"
            >
              <Download className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden="true" />
              <span className="flex flex-col leading-tight">
                <span className="text-[13px] font-medium">Download PDF</span>
                <span className="mt-1 text-[8.5px] uppercase tracking-[0.16em] text-ivory/40">
                  Save the resume file
                </span>
              </span>
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </span>
  );
}
