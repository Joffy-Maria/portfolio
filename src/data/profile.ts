export const profile = {
  name: "Joffy Maria Pius",
  firstName: "Joffy Maria",
  lastName: "Pius",
  role: "Computer Science & Engineering Student",
  roles: ["Developer", "UI/UX Enthusiast", "Creative Problem Solver"],
  tagline: "Developer | UI/UX Enthusiast | Creative Problem Solver",
  intro:
    "Building thoughtful digital experiences through technology, creativity and curiosity.",

  /* ------------------------------------------------------------------
   *  CONTACT DETAILS
   *  Everything on the site (nav, contact, footer, JSON-LD) reads from
   *  this file, so a single edit updates every link.
   * ------------------------------------------------------------------ */
  email: "joffymariapius06@gmail.com",
  emailIsPlaceholder: false,
  linkedin: {
    label: "LinkedIn",
    url: "https://www.linkedin.com/in/joffy-maria-pius-0jo6/",
    handle: "Joffy Maria Pius",
  },
  github: {
    label: "GitHub",
    url: "https://github.com/Joffy-Maria",
    handle: "@Joffy-Maria",
  },

  resume: "/resume.pdf",
  resumeFileName: "Joffy-Maria-Pius-Resume.pdf",
  availability: "Open to internships & collaborations",
  portrait: {
    src: "/images/portrait.webp",
    small: "/images/portrait-sm.webp",
    alt: "Portrait of Joffy Maria Pius",
  },

  about: [
    "Hello! I'm Joffy Maria Pius, a Computer Science and Engineering student at Viswajyothi College of Engineering and Technology, passionate about technology, creativity and building meaningful digital experiences.",
    "I enjoy exploring different areas of computer science, from web development and machine learning to UI/UX design and problem-solving.",
    "I love turning ideas into functional products, experimenting with new technologies and continuously learning through projects and collaborations.",
    "I'm particularly interested in creating applications that are not only technically effective but also intuitive and enjoyable to use.",
  ],

  highlights: [
    {
      title: "Web Development",
      description:
        "Building responsive, accessible interfaces with modern frontend tools and a strong eye for detail.",
      icon: "code",
    },
    {
      title: "Machine Learning",
      description:
        "Exploring data-driven models, careful evaluation and visualization that makes results readable.",
      icon: "brain",
    },
    {
      title: "UI/UX Design",
      description:
        "Designing intuitive flows and calm interfaces where usability comes before decoration.",
      icon: "pen",
    },
    {
      title: "Problem Solving",
      description:
        "Approaching challenges with structure, curiosity and steady iteration rather than guesswork.",
      icon: "puzzle",
    },
  ],
} as const;

export const socialLinks = [
  { label: "GitHub", href: profile.github.url, handle: profile.github.handle },
  { label: "LinkedIn", href: profile.linkedin.url, handle: profile.linkedin.handle },
] as const;
