import { useEffect, useRef } from "react";

/**
 * A very soft gold light that follows a fine pointer. Purely decorative,
 * disabled for touch devices and reduced-motion users.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!finePointer || reduceMotion) return;

    let frame = 0;
    const handleMove = (event: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const node = ref.current;
        if (!node) return;
        node.style.setProperty("--mx", `${event.clientX}px`);
        node.style.setProperty("--my", `${event.clientY}px`);
        node.style.opacity = "1";
      });
    };

    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", handleMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[60] hidden opacity-0 transition-opacity duration-700 lg:block"
      style={{
        background:
          "radial-gradient(520px circle at var(--mx, 50%) var(--my, 30%), rgba(198,166,107,0.065), transparent 66%)",
      }}
    />
  );
}
