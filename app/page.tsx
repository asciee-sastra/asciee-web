import About from "@/components/Main/About";
import Clusters from "@/components/Main/Clusters";
import FAQsThree from "@/components/Main/Faqs";
import Hero from "@/components/Main/Hero";
import MarqueeImg from "@/components/Main/Marquee-img";
import Navbar from "@/components/Main/Navbar";
import Footer from "@/components/Main/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <MarqueeImg />
      <About />
      <Clusters />
      <FAQsThree />
      <Footer />
    </>
  );
}
