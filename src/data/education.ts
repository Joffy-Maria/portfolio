export const education = {
  degree: "Bachelor of Technology (B.Tech)",
  field: "Computer Science and Engineering",
  status: "Currently pursuing",
  institution: "Viswajyothi College of Engineering and Technology",
  university: "A P J Abdul Kalam Technological University",
  period: "2024 — 2028",
  cgpa: "9.38 / 10",
  coursework: [
    "Data Structures & Algorithms",
    "Object-Oriented Programming",
    "Database Management Systems",
    "Operating Systems",
    "Computer Networks",
    "Artificial Intelligence",
    "Machine Learning",
    "Theory of Computation",
  ],
  achievements: [
    "Prizes for group song at the Arts Fest",
    "Curator, TEDxVJCET — January 2026",
    "Student Convenor, Institution's Innovation Council (current)",
    "Class Representative, academic year 2026 — 2027",
  ],
  memberships: [
    "Google Developer Groups — Active Member",
    "TinkerHub — Active Member",
    "TEDxVJCET — Active Member",
  ],
  focus: [
    "Web Development",
    "Machine Learning",
    "Data Structures & Algorithms",
    "UI/UX Design",
  ],
};

export const hasAcademicDetails = Boolean(
  education.institution || education.university || education.period || education.cgpa,
);
