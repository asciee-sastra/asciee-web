import Image from "next/image";
import React from "react";
import Link from "next/link";
import logo from "@/public/asciee.jpg";
import { Tilt } from "../motion-primitives/tilt";
import { Button } from "../ui/button";
import { Boxes, Calendar } from "lucide-react";

const Hero = () => {
  return (
    <section className="w-full bg-[url('/comp-mob.png')] md:bg-[url('/comp-bg.png')] bg-no-repeat bg-contain bg-center  min-h-screen flex flex-col justify-center items-center text-center px-6 relative">
      {/* Logo with tilt effect */}
      <Tilt rotationFactor={24} isRevese>
        <Image
          src={logo}
          width={220}
          height={220}
          alt="ASCIEE Logo"
          className="rounded-full md:mt-6 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] transition-all duration-500"
        />
      </Tilt>

      {/* Title + tagline */}
      <div className="mt-6 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white tracking-wide drop-shadow-lg">
          ASCIEE
        </h1>
        <p className="mt-3 text-md md:text-xl md:max-w-lg text-white/90 leading-relaxed">
          Association for the Students of Communication, Instrumentation,
          Electrical & Electronics
        </p>
      </div>

      {/* CTA Buttons */}
      <div className="mt-4 flex flex-col sm:flex-row gap-3">
        <Link href="/events">
          <button className="flex items-center gap-2 glass-card text-md text-white rounded-3xl px-8 py-2 border border-white/20 backdrop-blur-sm hover:scale-105 hover:bg-white/20 hover:text-white transition-all">
            <Calendar className="h-5 w-5" /> Upcoming Events
          </button>
        </Link>

        <Link href="/inventory">
          <button className="flex items-center gap-2 mx-auto glass-card text-md text-white rounded-3xl px-8 py-2 border  hover:scale-105 hover:bg-white/20 hover:text-white transition-all">
            <Boxes className="h-6 w-6" /> Inventory
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;
