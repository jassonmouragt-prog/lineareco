import Hero from "@/components/Hero";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import SectionTransition from "@/components/SectionTransition";
import Differentials from "@/components/Differentials";
import Process from "@/components/Process";
import Testimonials from "@/components/Testimonials";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Portfolio />
        <SectionTransition tone="light" />
        <Differentials />
        <Process />
        <SectionTransition tone="dark" />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}