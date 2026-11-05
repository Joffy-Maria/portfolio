export type ExperienceEntry = {
  id: string;
  role: string;
  organisation: string;
  period: string;
  type: string;
  summary: string;
  tags: string[];
};

export const experienceEntries: ExperienceEntry[] = [
  {
    id: "infosys-springboard",
    role: "Intern",
    organisation: "Infosys Springboard",
    period: "2 months",
    type: "Internship",
    summary:
      "Completed a 2-month internship at Infosys Springboard, during which I built ImpactSense — an earthquake prediction and visualization platform combining dataset preprocessing, ML model training (Random Forest, Gradient Boosting) and interactive data visualization.",
    tags: ["Internship", "Machine Learning", "Data Visualization", "Python"],
  },
  {
    id: "iic-convenor",
    role: "Student Convenor — Institution's Innovation Council",
    organisation: "Institution's Innovation Council",
    period: "Current",
    type: "Leadership",
    summary:
      "Serving as student convenor of the Institution's Innovation Council, supporting student innovation initiatives, events and activities on campus.",
    tags: ["Leadership", "Innovation", "Campus Initiatives"],
  },
  {
    id: "class-representative",
    role: "Class Representative",
    organisation: "B.Tech Computer Science & Engineering, Viswajyothi College",
    period: "2026 — 2027",
    type: "Leadership",
    summary:
      "Class representative for academic year 2026–2027, acting as the liaison between students and faculty on academic matters.",
    tags: ["Student Leadership", "Academic Year 2026–2027"],
  },
  {
    id: "tedxvcjet-curator",
    role: "Curator — TEDxVJCET",
    organisation: "TEDxVJCET",
    period: "January 2026",
    type: "Event",
    summary:
      "One of the curators for TEDxVJCET in January 2026, helping organise and run the independently organised TED event at college.",
    tags: ["TEDx", "Event Curation", "Community"],
  },
  {
    id: "independent-projects",
    role: "Student Developer — Independent Projects",
    organisation: "B.Tech Computer Science & Engineering",
    period: "Ongoing",
    type: "Academic",
    summary:
      "Designing and building end-to-end projects across web development, machine learning and interface design — from LifeLink QR, ImpactSense, ClearSpeak and Promate to SkillDev — with a focus on usability, accuracy and maintainable frontend architecture.",
    tags: ["Web Development", "Machine Learning", "UI/UX", "Project Work"],
  },
];

export const opportunityAreas = [
  {
    title: "Internships",
    description: "Software development, frontend engineering or machine learning.",
    icon: "briefcase",
  },
  {
    title: "Hackathons & Collaborations",
    description: "Teams building thoughtful products under real constraints.",
    icon: "users",
  },
  {
    title: "Certifications & Learning",
    description: "Structured learning that adds depth to the work.",
    icon: "award",
  },
];
