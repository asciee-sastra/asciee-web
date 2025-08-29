import React from "react";
import { ShineBorder } from "@/components/magicui/shine-border"

const aboutSections = [
  {
    title: "Who are we?",
    content: `ASCIEE is a vibrant community driven by curiosity, innovation, and a passion for learning.
it’s a place where knowledge meets creativity and ideas come alive where like minded engineers can connect, collaborate, and grow together.
We empower students to experiment, and excel in the world of technology.`,
  },
  {
    title: "What we Do?",
    content: `We ASCIEE create an environment that encourages students to think beyond their horizons 
    and strengthen their fundamentals through hands-on experiences which unleash their true potential.
    We also organise events and workshops to foster innovation.`,
  },
];

const About = () => {
  return (
    <section className="py-16  ">
      <h1 className="text-4xl text-white font-extrabold text-center mb-8 tracking-wide">
        About Us
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-8 max-w-5xl mx-auto px-6">
        {aboutSections.map((section, idx) => (
          <div
            key={idx}
            className="p-8 rounded-2xl backdrop-blur-xl bg-foreground/70 border-r border-white/20 text-white shadow-lg hover:shadow-2xl hover:scale-105 transition-transform duration-300"
          >
            <ShineBorder duration={15} borderWidth={1.2} shineColor="white" />
            <h2 className="text-2xl font-semibold mb-4 text-center">
              {section.title}
            </h2>
            <p className="leading-relaxed text-lg text-center text-gray-200">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
