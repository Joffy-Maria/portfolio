export type ProjectLink = {
  label: string;
  href: string;
};

export type ProjectScreenshot = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  id: string;
  index: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  problem?: string;
  solution?: string;
  features: string[];
  stack: string[];
  links: ProjectLink[];
  privacyNote?: string;
  status?: string;
  note?: string;
  screenshot: ProjectScreenshot;
  featured: "primary" | "secondary" | "supporting";
};

export const projects: Project[] = [
  {
    id: "lifelink-qr",
    index: "01",
    title: "LifeLink QR",
    tagline: "Smart Medical ID That Lives in a QR Code.",
    category: "Web Application · Health Technology",
    description:
      "A privacy-conscious emergency medical information system that generates scannable QR codes containing critical medical information without requiring a centralized database.",
    problem:
      "During medical emergencies, unconscious individuals may be unable to communicate important information such as allergies, medications and emergency contacts. Traditional medical identification systems often depend on centralized databases and internet connectivity.",
    solution:
      "LifeLink QR lets users enter their medical information and generate a QR code containing the encoded information. The code can be printed and attached to a helmet, wallet or phone case. When scanned, it opens an emergency dashboard displaying the relevant medical information and emergency contacts.",
    features: [
      "Client-side QR code generation",
      "No centralized medical information database",
      "QR-based emergency profile access",
      "Instant information decoding",
      "High-contrast emergency dashboard",
      "One-tap emergency calling",
      "Responsive, distraction-free interface",
      "Simple flow designed for emergency situations",
    ],
    stack: ["HTML5", "Vanilla JavaScript", "Tailwind CSS", "qrcode.js", "Firebase Hosting"],
    links: [
      { label: "Live Demo", href: "https://lifelink-qr-f98c6.web.app" },
      { label: "GitHub Repository", href: "https://github.com/Joffy-Maria/gdg" },
    ],
    privacyNote:
      "Technical note: LifeLink QR uses Base64 encoding, not encryption. Medical details travel inside the QR URL rather than a central database, which means anyone with access to the QR URL may be able to decode its contents.",
    note: "Built as part of a Google Developer Groups hackathon. The project is intentionally database-free: the information is carried by the QR code itself, and the dashboard decodes it locally in the browser.",
    screenshot: {
      src: "/images/projects/lifelink.webp",
      alt: "LifeLink QR screen showing a large scannable QR code on a yellow background.",
      width: 1440,
      height: 756,
    },
    featured: "primary",
  },
  {
    id: "impactsense",
    index: "02",
    title: "ImpactSense",
    tagline: "Earthquake Prediction & Visualization Platform.",
    category: "Machine Learning · Data Visualization",
    description:
      "An earthquake prediction and visualization platform combining machine learning models with an immersive user interface for earthquake-related data exploration. Built during a 2-month internship at Infosys Springboard.",
    features: [
      "Dataset preprocessing",
      "Feature engineering",
      "Machine learning model training",
      "Model comparison and evaluation",
      "Random Forest and Gradient Boosting",
      "Interactive data visualization",
      "Sample datasets and prediction history",
      "Session-based access with login",
    ],
    stack: ["Python", "Pandas", "NumPy", "Scikit-learn", "React", "Tailwind CSS"],
    links: [
      { label: "Live Demo", href: "https://impactsense.vercel.app" },
      { label: "GitHub Repository", href: "https://github.com/Joffy-Maria/ImpactSense" },
    ],
    note: "Built during a 2-month internship at Infosys Springboard. Model output is exploratory and is not a substitute for official seismic monitoring or public safety guidance.",
    screenshot: {
      src: "/images/projects/impactsense.webp",
      alt: "ImpactSense home screen with a neural orchestration status panel and a prediction-core call to action.",
      width: 1440,
      height: 756,
    },
    featured: "secondary",
  },
  {
    id: "clearspeak",
    index: "03",
    title: "ClearSpeak",
    tagline: "Assistive Communication Web Application.",
    category: "Assistive Technology · Web Application",
    description:
      "An assistive communication application designed to make communication more accessible through speech technologies and intelligent interfaces.",
    features: [
      "Live captions that show every word in real time",
      "Quick Reply for speaking instantly with confidence",
      "Saved transcripts for reviewing conversations",
    ],
    stack: [
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "TensorFlow.js",
      "Web Speech API",
      "IndexedDB",
      "jsPDF",
    ],
    links: [
      { label: "Live Demo", href: "https://clearspeak-three.vercel.app" },
      { label: "GitHub Repository", href: "https://github.com/Joffy-Maria/clearspeak" },
    ],
    note: "Feature descriptions reflect the Live Captions, Quick Reply and Transcripts options shown in the application.",
    screenshot: {
      src: "/images/projects/clearspeak.webp",
      alt: "ClearSpeak home screen showing Live Captions, Quick Reply and Transcripts options.",
      width: 1440,
      height: 756,
    },
    featured: "supporting",
  },
  {
    id: "promate",
    index: "04",
    title: "Promate",
    tagline: "Real-Time Collaborative Pomodoro Application.",
    category: "Productivity · Real-Time Collaboration",
    description:
      "A synchronized Pomodoro workspace where a team shares one timer, one task list and one calm environment, then lets the session disappear when the work is done.",
    features: [
      "One synchronized timer for everyone in the room",
      "Shared task list that ticks off for the whole room",
      "In-room chat without leaving focus",
      "Room-code joining with no signup or installs",
      "Fully ephemeral sessions that end with the room",
    ],
    stack: [],
    links: [
      { label: "Live Demo", href: "https://pomodoro-rouge-theta.vercel.app" },
      { label: "GitHub Repository", href: "https://github.com/Joffy-Maria/pomodoro" },
    ],
    screenshot: {
      src: "/images/projects/promate.webp",
      alt: "Promate landing page introducing real-time focus rooms with a shared timer, tasks and chat.",
      width: 1440,
      height: 756,
    },
    featured: "supporting",
  },
  {
    id: "skildev",
    index: "05",
    title: "SkillDev",
    tagline: "DSA Practice, Gamified Progress & Placement Prep.",
    category: "Learning Platform · Web Application",
    description:
      "A dark-themed placement preparation platform for coding clubs: daily coding challenges, verified platform submissions, an interactive leaderboard podium and campus interview preparation in one workspace.",
    features: [
      "Student and coding-club placement-leader roles",
      "Daily coding tasks and external platform challenges",
      "Verified platform submissions in one place",
      "Gamified XP with level and streak tracking",
      "Animated podium leaderboards",
      "Study materials and tech interview preparation",
    ],
    stack: ["Next.js", "TypeScript"],
    links: [
      { label: "Live Demo", href: "https://skill-dev-h5n8-brown.vercel.app/" },
      { label: "GitHub Repository", href: "https://github.com/Joffy-Maria/SkillDev" },
    ],
    note: "Screenshot shows the sign-in screen. The stack and product copy are verified against the public repository and live site.",
    screenshot: {
      src: "/images/projects/skildev.webp",
      alt: "SkillDev sign-in screen with student and coding-club placement leader roles.",
      width: 1440,
      height: 756,
    },
    featured: "supporting",
  },
];

export const featuredProject = projects.find((project) => project.featured === "primary")!;
