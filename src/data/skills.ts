export type SkillCategory = {
  id: string;
  title: string;
  description: string;
  icon: "code" | "layout" | "brain" | "tools" | "sparkles";
  items: string[];
};

export const skillCategories: SkillCategory[] = [
  {
    id: "languages",
    title: "Programming Languages",
    description: "Core languages I use to build, experiment and reason about systems.",
    icon: "code",
    items: ["Python", "C", "Java", "JavaScript"],
  },
  {
    id: "frontend",
    title: "Frontend Development",
    description: "Interfaces, components and design systems built for real people.",
    icon: "layout",
    items: ["HTML5", "CSS3", "React", "Tailwind CSS", "Next.js", "TypeScript"],
  },
  {
    id: "ml",
    title: "Machine Learning & Data Science",
    description: "Turning raw data into models, evaluation and clear visual insight.",
    icon: "brain",
    items: [
      "NumPy",
      "Pandas",
      "Scikit-learn",
      "Machine Learning",
      "Data Visualization",
      "Model Evaluation",
    ],
  },
  {
    id: "tools",
    title: "Tools & Platforms",
    description: "The everyday toolkit behind the work — from version control to deployment.",
    icon: "tools",
    items: ["Git", "GitHub", "Figma", "Supabase", "Firebase", "VS Code"],
  },
  {
    id: "interests",
    title: "Additional Interests",
    description: "Where curiosity keeps pulling the work next.",
    icon: "sparkles",
    items: ["UI/UX Design", "Data Structures & Algorithms", "Problem Solving", "Creative Development"],
  },
];
