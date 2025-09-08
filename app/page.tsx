import About from "@/components/Main/About";
import Clusters from "@/components/Main/Clusters";
import FAQsThree from "@/components/Main/Faqs";
import Hero from "@/components/Main/Hero";
import Header from "@/components/Main/Navbar";
import MarqueeImg from "@/components/Main/Marquee-img";

export default function Home() {
  return (
    <>
      <Hero />
      <MarqueeImg />
      <About />
      <Clusters />
      <FAQsThree />
    </>
  );
}
