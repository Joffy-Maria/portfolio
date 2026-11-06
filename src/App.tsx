import About from "./components/About";
import Contact from "./components/Contact";
import CursorGlow from "./components/CursorGlow";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import ScrollFairy from "./components/ScrollFairy";
import Skills from "./components/Skills";

export default function App() {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>

      <Navbar />

      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Education />
        <Experience />
        <Contact />
      </main>

      <Footer />
      <CursorGlow />
      <ScrollFairy />
      <div className="grain-overlay" aria-hidden="true" />
    </>
  );
}
