import React from "react";
import { ShineBorder } from "@/components/magicui/shine-border";

const aboutSections = [
  {
    title: "Who are we?",
    content: `ASCIEE is a vibrant community driven by curiosity, innovation, and a passion for learning.
It’s a place where knowledge meets creativity and ideas come alive — where like-minded engineers can connect, collaborate, and grow together.
We empower students to experiment, and excel in the world of technology.`,
  },
  {
    title: "What we Do?",
    content: `We at ASCIEE create an environment that encourages students to think beyond their horizons 
and strengthen their fundamentals through hands-on experiences that unleash their true potential.
We also organize events and workshops to foster innovation.`,
  },
];

const About = () => {
  return (
    <section className="pb-16">
      {/* Heading */}
      <h1 className="text-4xl md:text-5xl text-white font-extrabold text-center mb-12 tracking-wide">
        About Us
      </h1>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto px-6">
        {aboutSections.map((section, idx) => (
          <div
            key={idx}
            className="relative flex flex-col items-center p-8 rounded-3xl 
                       bg-foreground backdrop-blur-xl border border-white/10 shadow-lg 
                       transition-transform duration-500 hover:scale-105 hover:shadow-2xl"
          >
            {/* Shine border effect */}
           

            {/* Card Content */}
            <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-white text-center">
              {section.title}
            </h2>
            <p className="leading-relaxed text-lg text-gray-200 text-center">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default About;
