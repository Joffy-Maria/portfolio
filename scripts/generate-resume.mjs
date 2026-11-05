import fs from "node:fs";
import path from "node:path";
import PDFDocument from "pdfkit";

/*
 * Generates public/resume.pdf from the same information that powers the site.
 * Two pages, ATS-friendly: single column, standard section names, text-only.
 * Update the fields below (and src/data/profile.ts) when your details change,
 * then run: npm run resume
 */

const data = {
  name: "Joffy Maria Pius",
  role: "Computer Science & Engineering Student",
  subtitle: "Developer  ·  UI/UX Enthusiast  ·  Creative Problem Solver",
  email: "joffymariapius06@gmail.com",
  github: "github.com/Joffy-Maria",
  linkedin: "linkedin.com/in/joffy-maria-pius-0jo6",
  summary:
    "Computer Science and Engineering student at Viswajyothi College of Engineering and Technology, passionate about technology, creativity and building meaningful digital experiences. Interested in web development, machine learning, UI/UX design and problem-solving, with a focus on applications that are technically effective and intuitive to use.",
  experience: [
    {
      organisation: "Infosys Springboard",
      role: "Intern",
      period: "2 months",
      bullets: [
        "Completed a 2-month internship at Infosys Springboard, during which ImpactSense was built — an earthquake prediction and visualization platform.",
        "Preprocessed seismic datasets, engineered features and trained machine-learning models (Random Forest, Gradient Boosting) with Python, Pandas, NumPy and scikit-learn.",
        "Built an interactive visualization interface with React and Tailwind CSS presenting model performance analysis.",
      ],
    },
  ],
  skills: [
    {
      label: "Languages",
      value: "Python, C, Java, JavaScript, TypeScript, HTML5, CSS3",
    },
    {
      label: "Frontend",
      value: "React, Next.js, Tailwind CSS, Responsive Design",
    },
    {
      label: "ML & Data",
      value: "NumPy, Pandas, scikit-learn, Machine Learning, Data Visualization, Model Evaluation",
    },
    {
      label: "Tools",
      value: "Git, GitHub, Figma, Supabase, Firebase, VS Code",
    },
    {
      label: "Interests",
      value: "UI/UX Design, Data Structures & Algorithms, Problem Solving, Creative Development",
    },
  ],
  projects: [
    {
      name: "LifeLink QR — Smart Medical ID in a QR Code",
      link: "lifelink-qr-f98c6.web.app",
      bullets: [
        "Built a privacy-conscious emergency medical ID web app for a Google Developer Groups hackathon; client-side QR generation with no centralized database.",
        "Implemented Base64-encoded emergency payloads, a high-contrast emergency dashboard, instant decoding and one-tap emergency calling.",
        "Built with HTML5, Vanilla JavaScript, Tailwind CSS, qrcode.js and Firebase Hosting. Source: github.com/Joffy-Maria/gdg.",
      ],
    },
    {
      name: "ImpactSense — Earthquake Prediction & Visualization",
      link: "github.com/Joffy-Maria/ImpactSense",
      bullets: [
        "Built during a 2-month internship at Infosys Springboard; preprocessed seismic datasets and engineered features with Python, Pandas and NumPy.",
        "Trained and compared Random Forest and Gradient Boosting models with scikit-learn and evaluated model performance.",
        "Built an interactive visualization interface with React and Tailwind CSS.",
      ],
    },
    {
      name: "ClearSpeak — Assistive Communication Web Application",
      link: "clearspeak-three.vercel.app",
      bullets: [
        "Built an assistive communication web app with Next.js, TypeScript, Tailwind CSS and TensorFlow.js; live captions, quick replies and saved transcripts via the Web Speech API.",
        "Persisted transcripts with IndexedDB and automated PDF export with jsPDF. Source: github.com/Joffy-Maria/clearspeak.",
      ],
    },
    {
      name: "Promate — Real-Time Collaborative Pomodoro",
      link: "pomodoro-rouge-theta.vercel.app",
      bullets: [
        "Developed a real-time collaborative Pomodoro web app with a shared synchronized timer, shared task list and in-room chat.",
        "Rooms require no signup and disappear when the session ends. Source: github.com/Joffy-Maria/pomodoro.",
      ],
    },
    {
      name: "SkillDev — Placement Preparation Platform",
      link: "skill-dev-h5n8-brown.vercel.app",
      bullets: [
        "Built a dark-themed placement-preparation platform for coding clubs with Next.js and TypeScript; daily coding challenges, verified platform submissions, an interactive leaderboard podium, study materials and interview preparation.",
        "Implemented role-based sign-in for students and coding-club placement leaders. Source: github.com/Joffy-Maria/SkillDev.",
      ],
    },
  ],
  leadership: [
    "Student Convenor, Institution's Innovation Council (current)",
    "Class Representative, B.Tech Computer Science & Engineering, academic year 2026 — 2027",
    "Curator, TEDxVJCET — January 2026",
    "Prizes for group song at the Arts Fest",
    "Active member: Google Developer Groups  ·  TinkerHub  ·  TEDxVJCET",
  ],
  education: {
    degree: "Bachelor of Technology (B.Tech) — Computer Science and Engineering",
    status: "Viswajyothi College of Engineering and Technology",
    details:
      "A P J Abdul Kalam Technological University  ·  2024 — 2028  ·  CGPA 9.38 / 10",
    coursework:
      "Data Structures & Algorithms, Object-Oriented Programming, Database Management Systems, Operating Systems, Computer Networks, Artificial Intelligence, Machine Learning, Theory of Computation",
  },
};

const out = path.join(process.cwd(), "public", "resume.pdf");
fs.mkdirSync(path.dirname(out), { recursive: true });

const doc = new PDFDocument({
  size: "A4",
  margins: { top: 46, bottom: 30, left: 52, right: 52 },
  info: {
    Title: `${data.name} — Resume`,
    Author: data.name,
    Subject: "Resume",
  },
});

const stream = fs.createWriteStream(out);
doc.pipe(stream);

const MIDNIGHT = "#071D20";
const GOLD = "#A98A50";
const INK = "#202724";
const MUTED = "#5C655F";
const RULE = "#D8CDB8";

const left = doc.page.margins.left;
const width = doc.page.width - doc.page.margins.left - doc.page.margins.right;

let y;
const sectionTitle = (label) => {
  doc
    .fillColor(GOLD)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(label.toUpperCase(), left, y, { characterSpacing: 2 });
  y += 16;
};

const bullets = (items, size = 8.8, gap = 2.2) => {
  for (const item of items) {
    doc
      .fillColor(INK)
      .font("Helvetica")
      .fontSize(size)
      .text("•  " + item, left, y, { width, lineGap: gap });
    y = doc.y + 3.5;
  }
};

const rule = (yPos, opacity = 0.5) => {
  doc
    .moveTo(left, yPos)
    .lineTo(left + width, yPos)
    .lineWidth(0.5)
    .strokeColor(RULE)
    .strokeOpacity(opacity)
    .stroke();
};

const footer = (pageNo) => {
  const footerY = doc.page.height - doc.page.margins.bottom - 12;
  rule(footerY - 8, 0.9);
  doc
    .fillColor(MUTED)
    .font("Helvetica")
    .fontSize(7)
    .text(`${data.name}  ·  Resume  ·  ${pageNo} of 2`, left, footerY, {
      width,
      align: "center",
    });
};

/* ---------------- Page 1 — Header, Summary, Experience, Skills ---------------- */
doc.fillColor(MIDNIGHT).font("Times-Bold").fontSize(28).text(data.name, left, 46);
doc
  .fillColor(GOLD)
  .font("Helvetica")
  .fontSize(8)
  .text(data.role.toUpperCase(), left, 82, { characterSpacing: 1.5 });
doc
  .fillColor(MUTED)
  .font("Helvetica")
  .fontSize(8.5)
  .text(data.subtitle, left, 96);
doc
  .fillColor(MUTED)
  .fontSize(8.5)
  .text([data.email, data.github, data.linkedin].join("  ·  "), left, 108);

rule(124, 0.85);

y = 138;
sectionTitle("Summary");
doc
  .fillColor(INK)
  .font("Helvetica")
  .fontSize(9)
  .text(data.summary, left, y, { width, lineGap: 2.6 });
y = doc.y + 10;

sectionTitle("Experience");
for (const entry of data.experience) {
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(10).text(`${entry.role}  ·  ${entry.organisation}`, left, y, { width });
  y = doc.y + 1;
  doc
    .fillColor(GOLD)
    .font("Helvetica")
    .fontSize(7.5)
    .text(entry.period.toUpperCase(), left, y, { width, characterSpacing: 1.2 });
  y = doc.y + 3;
  bullets(entry.bullets);
  y += 6;
}

sectionTitle("Skills");
for (const group of data.skills) {
  const labelWidth = 92;
  doc
    .fillColor(MUTED)
    .font("Helvetica-Bold")
    .fontSize(8)
    .text(group.label.toUpperCase(), left, y + 0.5, { width: labelWidth });
  doc
    .fillColor(INK)
    .font("Helvetica")
    .fontSize(9)
    .text(group.value, left + labelWidth, y, { width: width - labelWidth, lineGap: 2 });
  y = Math.max(doc.y, y) + 5;
}

sectionTitle("Leadership & Activities");
bullets(data.leadership);
y += 2;

sectionTitle("Education");
doc.fillColor(INK).font("Helvetica-Bold").fontSize(10).text(data.education.degree, left, y, { width });
y = doc.y + 3;
doc.fillColor(MUTED).font("Helvetica").fontSize(9).text(data.education.status, left, y, { width });
y = doc.y + 2;
doc.fillColor(MUTED).font("Helvetica").fontSize(8.5).text(data.education.details, left, y, { width });
y = doc.y + 3;
doc
  .fillColor(MUTED)
  .font("Helvetica")
  .fontSize(8)
  .text("Relevant coursework:  " + data.education.coursework, left, y, { width, lineGap: 2.2 });

footer(1);

/* ---------------- Page 2 — Projects ---------------- */
doc.addPage();
doc.fillColor(MIDNIGHT).font("Times-Bold").fontSize(15).text(data.name, left, 46);
doc
  .fillColor(MUTED)
  .font("Helvetica")
  .fontSize(8)
  .text([data.email, data.github, data.linkedin].join("  ·  "), left, 68);
rule(86, 0.85);
y = 100;

sectionTitle("Projects");
for (const project of data.projects) {
  doc.fillColor(INK).font("Helvetica-Bold").fontSize(10).text(project.name, left, y, { width });
  y = doc.y + 1;
  if (project.link) {
    doc
      .fillColor(GOLD)
      .font("Helvetica")
      .fontSize(7.5)
      .text(project.link, left, y, { width, characterSpacing: 0.4 });
    y = doc.y + 3;
  }
  bullets(project.bullets, 9, 2.6);
  y += 10;
}

sectionTitle("References");
y += 2;
doc
  .fillColor(MUTED)
  .font("Helvetica-Oblique")
  .fontSize(8.5)
  .text("References and full project case studies are available on request.", left, y, {
    width,
    lineGap: 2.4,
  });

footer(2);

doc.end();

stream.on("finish", () => {
  console.log(`Resume written to ${out}`);
});
