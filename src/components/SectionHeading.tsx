import { motion, useReducedMotion } from "framer-motion";
import { Sprig } from "./Botanical";

const EASE = [0.22, 1, 0.36, 1] as const;

type SectionHeadingProps = {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  tone?: "dark" | "light";
  align?: "left" | "center";
  className?: string;
};

function TitleWords({ title, className }: { title: string; className: string }) {
  const words = title.split(" ");

  return (
    <>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          className="inline-block overflow-hidden pb-[0.16em] -mb-[0.16em] align-baseline"
        >
          <motion.span
            className={`inline-block will-change-transform ${className}`}
            initial={{ y: "118%", rotate: 3 }}
            whileInView={{ y: "0%", rotate: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.85, delay: 0.08 * i, ease: EASE }}
          >
            {word}
            {i < words.length - 1 ? "\u00A0" : ""}
          </motion.span>
        </span>
      ))}
    </>
  );
}

export default function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  tone = "dark",
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const isLight = tone === "light";
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return (
      <div
        className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
      >
        <div
          className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
        >
          <span className={`eyebrow ${isLight ? "text-gold-deep" : "text-gold"}`}>{index}</span>
          <span
            className={`h-px w-8 ${isLight ? "bg-gold-deep/50" : "bg-gold/45"}`}
            aria-hidden="true"
          />
          <span className={`eyebrow ${isLight ? "text-ink/55" : "text-ivory/55"}`}>
            {eyebrow}
          </span>
          <Sprig
            className={`hidden h-5 w-16 sm:block ${isLight ? "text-gold-deep/50" : "text-gold/45"}`}
          />
        </div>

        <h2
          className={`mt-5 font-serif text-[clamp(2.5rem,5.2vw,4.4rem)] font-light leading-[0.94] tracking-[-0.015em] ${
            isLight ? "text-ink" : "text-ivory"
          }`}
        >
          {title}
        </h2>

        {description ? (
          <p
            className={`mt-5 max-w-2xl text-[15px] leading-relaxed sm:text-base ${
              align === "center" ? "mx-auto" : ""
            } ${isLight ? "text-ink/65" : "text-ivory/60"}`}
          >
            {description}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"} ${className}`}
    >
      <div
        className={`flex items-center gap-4 ${align === "center" ? "justify-center" : ""}`}
      >
        <motion.span
          initial={{ opacity: 0, x: -14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.05, ease: EASE }}
          className={`eyebrow ${isLight ? "text-gold-deep" : "text-gold"}`}
        >
          {index}
        </motion.span>
        <motion.span
          className={`h-px w-8 origin-left ${isLight ? "bg-gold-deep/50" : "bg-gold/45"}`}
          aria-hidden="true"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.12, ease: EASE }}
        />
        <motion.span
          initial={{ opacity: 0, x: 14 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, delay: 0.18, ease: EASE }}
          className={`eyebrow ${isLight ? "text-ink/55" : "text-ivory/55"}`}
        >
          {eyebrow}
        </motion.span>
        <motion.span
          className="hidden sm:block"
          initial={{ opacity: 0, scale: 0.6, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, delay: 0.25, ease: EASE }}
          aria-hidden="true"
        >
          <Sprig
            className={`h-5 w-16 ${isLight ? "text-gold-deep/50" : "text-gold/45"}`}
          />
        </motion.span>
      </div>

      <h2
        className={`mt-5 font-serif text-[clamp(2.5rem,5.2vw,4.4rem)] font-light leading-[0.94] tracking-[-0.015em] ${
          isLight ? "text-ink" : "text-ivory"
        }`}
      >
        <TitleWords title={title} className="" />
      </h2>

      {description ? (
        <p
          className={`mt-5 max-w-2xl text-[15px] leading-relaxed sm:text-base ${
            align === "center" ? "mx-auto" : ""
          } ${isLight ? "text-ink/65" : "text-ivory/60"}`}
        >
          <motion.span
            className="block"
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: 0.3, ease: EASE }}
          >
            {description}
          </motion.span>
        </p>
      ) : null}
    </div>
  );
}
