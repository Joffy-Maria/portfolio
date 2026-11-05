type LogoMarkProps = {
  className?: string;
  animated?: boolean;
};

export default function LogoMark({ className = "", animated = false }: LogoMarkProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className={`${className} ${animated ? "slow-spin" : ""}`}
    >
      <circle cx="24" cy="24" r="22.5" stroke="currentColor" strokeOpacity=".28" strokeWidth=".8" />
      <circle cx="24" cy="24" r="18.5" stroke="currentColor" strokeOpacity=".14" strokeWidth=".6" />
      <path
        d="M13 37V24a11 11 0 0 1 22 0v13"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M18 37V25a6 6 0 0 1 12 0v12"
        stroke="currentColor"
        strokeOpacity=".45"
        strokeWidth=".8"
        strokeLinecap="round"
      />
      <circle cx="24" cy="28" r="1.7" fill="currentColor" />
      <path d="M24 14v3" stroke="currentColor" strokeOpacity=".5" strokeWidth=".8" />
      <circle cx="35" cy="12" r="1" fill="currentColor" fillOpacity=".8" />
    </svg>
  );
}
