import Hero from "@/components/Hero";
import About from "@/components/About";
import Gallery from "@/components/Gallery";
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
        <Gallery />
        <Differentials />
        <Process />
        <Testimonials />
      </main>
      <Footer />
    </>
  );
}