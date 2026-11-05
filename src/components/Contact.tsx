import { ArrowUpRight, Check, Copy, Download, Github, Linkedin, Mail, Send } from "lucide-react";
import { useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { profile } from "../data/profile";
import Fairy from "./Fairy";
import Fireflies from "./Fireflies";
import Parallax from "./Parallax";
import ResumeMenu from "./ResumeMenu";
import Reveal from "./Reveal";
import SectionHeading from "./SectionHeading";

function mulberry32(seed: number) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function MoonlitGarden() {
  const stars = Array.from({ length: 22 }, (_, i) => {
    const random = mulberry32(140 + i);
    return {
      x: random() * 100,
      y: random() * 55,
      size: 0.8 + random() * 1.6,
      delay: random() * 6,
      duration: 4 + random() * 5,
    };
  });

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_78%_6%,#174C3B_0%,#071d20_46%,#041114_100%)]" />

      <Parallax y={70} className="absolute right-[4%] top-[2%] h-72 w-72 sm:h-96 sm:w-96">
        <div className="h-full w-full rounded-full bg-gold/10 blur-3xl" />
        <svg
          viewBox="0 0 200 200"
          className="absolute right-[9%] top-[14%] h-24 w-24 opacity-95 sm:h-36 sm:w-36"
          style={{ filter: "drop-shadow(0 0 60px rgba(228,205,156,0.28))" }}
        >
          <defs>
            <radialGradient id="moon-fill" cx="38%" cy="34%" r="72%">
              <stop offset="0%" stopColor="#FBF6E9" />
              <stop offset="55%" stopColor="#EFE0BE" />
              <stop offset="100%" stopColor="#C6A66B" />
            </radialGradient>
          </defs>
          <circle cx="100" cy="100" r="82" fill="url(#moon-fill)" />
          <circle cx="74" cy="76" r="13" fill="#A98A50" fillOpacity=".16" />
          <circle cx="118" cy="62" r="7" fill="#A98A50" fillOpacity=".14" />
          <circle cx="126" cy="118" r="17" fill="#A98A50" fillOpacity=".12" />
          <circle cx="82" cy="132" r="8" fill="#A98A50" fillOpacity=".13" />
          <circle cx="104" cy="94" r="5" fill="#A98A50" fillOpacity=".1" />
        </svg>
      </Parallax>

      <div className="absolute inset-0">
        {stars.map((star, index) => (
          <span
            key={index}
            className="twinkle absolute rounded-full bg-gold-light"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <svg
        viewBox="0 0 400 220"
        fill="none"
        stroke="currentColor"
        className="absolute left-[4%] top-[14%] hidden h-40 w-64 text-gold/20 sm:block"
      >
        <path d="M12 150 58 92l52 30 44-62 58 40 52-54 62 44" strokeWidth="0.7" />
        {[
          [12, 150],
          [58, 92],
          [110, 122],
          [154, 60],
          [212, 100],
          [264, 46],
          [326, 90],
        ].map(([cx, cy], index) => (
          <circle key={index} cx={cx} cy={cy} r="1.6" fill="currentColor" stroke="none" />
        ))}
      </svg>

      <div
        className="fog absolute -left-[10%] top-[28%] h-[40%] w-[70%] rounded-full bg-[radial-gradient(ellipse,rgba(198,166,107,0.09),transparent_66%)] blur-3xl"
        style={{ "--fog-duration": "36s" } as CSSProperties}
      />

      <Fireflies count={20} seed={99} className="absolute inset-0" intensity={0.75} />
      <Fairy className="bottom-[18%] left-[6%] opacity-70" delay={14} duration={32} scale={0.8} />

      <svg
        viewBox="0 0 1440 300"
        preserveAspectRatio="none"
        className="absolute inset-x-0 bottom-0 h-40 w-full text-[#03110f] sm:h-56"
        fill="currentColor"
      >
        <path d="M0 300V214c66-18 118 14 178 0s112-42 176-26 110 34 178 12 118-38 186-20 122 40 190 20 132-30 196-10 112 26 176 6 120-18 160-2v106Z" opacity=".85" />
        <path d="M0 300V244c80-12 126 16 196 4s124-32 196-14 128 26 200 8 128-30 200-12 130 30 202 12 130-20 210-4 156 18 236 2v60Z" opacity=".6" />
      </svg>

      <svg
        viewBox="0 0 300 400"
        fill="currentColor"
        className="absolute -left-10 bottom-0 h-64 w-48 text-[#03110f] sm:h-80 sm:w-60"
      >
        {Array.from({ length: 9 }, (_, i) => {
          const y = 380 - i * 36;
          const length = 40 + i * 6;
          return (
            <g key={i}>
              <path d={`M150 400c-10-80-16-150-4-230 4-26 12-50 24-72`} fill="none" stroke="currentColor" strokeWidth="3" />
              <path d={`M${146 + i * 0.4} ${y}c-${length} -8 -${length * 0.7} 10 -${length * 1.15} 26`} fill="none" stroke="currentColor" strokeWidth="2.4" />
              <path d={`M${152 + i * 0.3} ${y - 10}c${length} -10 ${length * 0.8} 6 ${length * 1.1} 22`} fill="none" stroke="currentColor" strokeWidth="2.2" />
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(7,29,32,0.72)_0%,rgba(7,29,32,0.3)_45%,transparent_70%)]" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-[linear-gradient(to_top,#071d20,transparent)]" />
    </div>
  );
}

type FormValues = { name: string; email: string; message: string };
type FormErrors = Partial<Record<keyof FormValues, string>>;

const EMPTY: FormValues = { name: "", email: "", message: "" };

export default function Contact() {
  const [values, setValues] = useState<FormValues>(EMPTY);
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "opened">("idle");
  const [copied, setCopied] = useState(false);

  const update = (field: keyof FormValues, value: string) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus("idle");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: FormErrors = {};
    if (values.name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(values.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }
    if (values.message.trim().length < 10) {
      nextErrors.message = "Please add a little more detail (at least 10 characters).";
    }

    setErrors(nextErrors);

    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      document.getElementById(`contact-${firstError}`)?.focus();
      return;
    }

    const subject = `Portfolio enquiry from ${values.name.trim()}`;
    const body = `Name: ${values.name.trim()}\nEmail: ${values.email.trim()}\n\n${values.message.trim()}`;
    window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setStatus("opened");
  };

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  };

  const inputClass = (field: keyof FormValues) =>
    `w-full rounded-lg border bg-midnight/40 px-4 py-3 text-[13.5px] text-ivory placeholder:text-ivory/25 transition-colors duration-300 focus:outline-none focus:ring-1 ${
      errors[field]
        ? "border-rose/60 focus:border-rose focus:ring-rose/25"
        : "border-ivory/15 focus:border-gold/60 focus:ring-gold/25"
    }`;

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-midnight py-24 text-ivory sm:py-28 lg:py-32"
    >
      <MoonlitGarden />

      <div className="shell relative">
        <SectionHeading
          index="06"
          eyebrow="Contact"
          title="Get in Touch"
          description="Have an interesting idea or opportunity? Let's connect."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <Reveal>
            <p className="max-w-md text-[14px] leading-[1.85] text-ivory/60">
              I&apos;m always glad to talk about projects, internships, interface design or a
              genuinely interesting technical problem. The quickest way to reach me is by email.
            </p>

            <div className="mt-8 space-y-2.5">
              <div className="group flex items-center gap-4 rounded-xl border border-ivory/10 bg-midnight/40 p-4 transition-colors hover:border-gold/30">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold">
                  <Mail className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-ivory/40">Email</p>
                  <a
                    href={`mailto:${profile.email}`}
                    className="mt-1 block truncate text-[13px] text-ivory/80 transition-colors hover:text-gold-light"
                  >
                    {profile.email}
                  </a>
                </div>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ivory/15 text-ivory/50 transition hover:border-gold/40 hover:text-gold-light"
                >
                  {copied ? (
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  )}
                </button>
              </div>

              <a
                href={profile.github.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-4 rounded-xl border border-ivory/10 bg-midnight/40 p-4 transition-colors hover:border-gold/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold">
                  <Github className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-ivory/40">GitHub</p>
                  <p className="mt-1 truncate text-[13px] text-ivory/80 transition-colors group-hover:text-gold-light">
                    {profile.github.handle}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-ivory/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  aria-hidden="true"
                />
              </a>

              <a
                href={profile.linkedin.url}
                target="_blank"
                rel="noreferrer noopener"
                className="group flex items-center gap-4 rounded-xl border border-ivory/10 bg-midnight/40 p-4 transition-colors hover:border-gold/30"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold">
                  <Linkedin className="h-4 w-4" aria-hidden="true" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[8px] uppercase tracking-[0.2em] text-ivory/40">LinkedIn</p>
                  <p className="mt-1 truncate text-[13px] text-ivory/80 transition-colors group-hover:text-gold-light">
                    {profile.linkedin.handle}
                  </p>
                </div>
                <ArrowUpRight
                  className="h-4 w-4 shrink-0 text-ivory/30 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-gold"
                  aria-hidden="true"
                />
              </a>

              <ResumeMenu
                label={(
                  <span className="flex min-w-0 flex-col leading-tight">
                    <span className="text-[8px] uppercase tracking-[0.2em] text-ivory/40">
                      Resume
                    </span>
                    <span className="mt-1 text-[13px] text-ivory/80 transition-colors group-hover:text-gold-light">
                      View or download PDF
                    </span>
                  </span>
                )}
                leadingIcon={
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/25 text-gold">
                    <Download className="h-4 w-4" aria-hidden="true" />
                  </span>
                }
                className="group flex w-full items-center gap-4 rounded-xl border border-ivory/10 bg-midnight/40 p-4 text-left transition-colors hover:border-gold/30"
              />
            </div>

            <p className="mt-7 flex items-center gap-2.5 text-[9.5px] uppercase tracking-[0.2em] text-moss">
              <span className="h-1.5 w-1.5 rounded-full bg-gold" aria-hidden="true" />
              {profile.availability}
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-[linear-gradient(155deg,rgba(16,45,37,0.92),rgba(7,29,32,0.96))] p-5 shadow-[0_50px_100px_-60px_rgba(0,0,0,0.9)] sm:p-8">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/[0.06] blur-3xl"
              />

              <div className="relative">
                <h3 className="font-serif text-2xl text-ivory sm:text-[1.8rem]">Send a message</h3>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-ivory/40">
                  This form opens your email app with the message ready to send. Nothing is stored
                  on a server.
                </p>

                <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="contact-name"
                        className="mb-1.5 block text-[8.5px] uppercase tracking-[0.18em] text-ivory/50"
                      >
                        Name
                      </label>
                      <input
                        id="contact-name"
                        name="name"
                        type="text"
                        autoComplete="name"
                        value={values.name}
                        onChange={(event) => update("name", event.target.value)}
                        aria-invalid={Boolean(errors.name)}
                        aria-describedby={errors.name ? "contact-name-error" : undefined}
                        placeholder="Your name"
                        className={inputClass("name")}
                      />
                      {errors.name ? (
                        <p id="contact-name-error" className="mt-1.5 text-[11px] text-rose">
                          {errors.name}
                        </p>
                      ) : null}
                    </div>

                    <div>
                      <label
                        htmlFor="contact-email"
                        className="mb-1.5 block text-[8.5px] uppercase tracking-[0.18em] text-ivory/50"
                      >
                        Email
                      </label>
                      <input
                        id="contact-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        value={values.email}
                        onChange={(event) => update("email", event.target.value)}
                        aria-invalid={Boolean(errors.email)}
                        aria-describedby={errors.email ? "contact-email-error" : undefined}
                        placeholder="you@example.com"
                        className={inputClass("email")}
                      />
                      {errors.email ? (
                        <p id="contact-email-error" className="mt-1.5 text-[11px] text-rose">
                          {errors.email}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      className="mb-1.5 block text-[8.5px] uppercase tracking-[0.18em] text-ivory/50"
                    >
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={5}
                      value={values.message}
                      onChange={(event) => update("message", event.target.value)}
                      aria-invalid={Boolean(errors.message)}
                      aria-describedby={errors.message ? "contact-message-error" : undefined}
                      placeholder="Tell me a little about the idea or opportunity..."
                      className={`${inputClass("message")} resize-none`}
                    />
                    {errors.message ? (
                      <p id="contact-message-error" className="mt-1.5 text-[11px] text-rose">
                        {errors.message}
                      </p>
                    ) : null}
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <button type="submit" className="btn-gold group w-full sm:w-auto">
                      Send Message
                      <Send
                        className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        aria-hidden="true"
                      />
                    </button>
                    <p className="text-[10px] leading-relaxed text-ivory/30">
                      Or email directly at{" "}
                      <a
                        href={`mailto:${profile.email}`}
                        className="text-gold/70 underline decoration-gold/30 underline-offset-2 transition hover:text-gold-light"
                      >
                        {profile.email}
                      </a>
                    </p>
                  </div>

                  <div role="status" aria-live="polite" className="min-h-[20px]">
                    {status === "opened" ? (
                      <p className="rounded-lg border border-gold/25 bg-gold/[0.06] px-3 py-2 text-[11.5px] leading-relaxed text-gold-light">
                        Your email app should now be open with the message ready to send. If it
                        didn&apos;t open, email me directly at{" "}
                        <a href={`mailto:${profile.email}`} className="underline underline-offset-2">
                          {profile.email}
                        </a>
                        .
                      </p>
                    ) : null}
                  </div>
                </form>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
