import About from "./components/About";
import Contact from "./components/Contact";
import CursorGlow from "./components/CursorGlow";
import Education from "./components/Education";
import Experience from "./components/Experience";
import Footer from "./components/Footer";
import Hero from "./components/Hero";
import Navbar from "./components/Navbar";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import { SwarmGateProvider } from "./components/SwarmGate";

export default function App() {
  return (
    <SwarmGateProvider>
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
      <div className="grain-overlay" aria-hidden="true" />
    </SwarmGateProvider>
  );
}
