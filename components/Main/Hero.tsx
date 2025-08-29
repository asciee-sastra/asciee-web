import Image from "next/image";
import React from "react";
import logo from "@/public/asciee.jpg";
import { Tilt } from "../motion-primitives/tilt";
import { ShoppingCart, Calendar } from "lucide-react";
import { Button } from "../ui/button";
import { GlowEffectButton } from "../button-glow";

const Hero = () => {
  return (
    <>
      <div className="w-full z-50 mt-8 flex flex-col justify-center items-center relative">
        <div className="w-full z-50 mt-8 flex flex-col justify-center items-center relative">
          <Tilt rotationFactor={24} isRevese>
            <Image
              src={logo}
              width={280}
              height={280}
              alt="ASCIEE Logo"
              className="rounded-full"
            />
          </Tilt>
          <div className="flex justify-center mt-2 flex-col items-center">
            <div>
              <h1 className="text-5xl font-bold text-white">ASCIEE</h1>
            </div>
            <p className="text-xl text-center w-3/4 md:w-1/2 text-white">
              Association for the Students of Communication, Instrumentation,
              Electrical & Electronics
            </p>
            <div className="flex justify-center mt-4 items-center gap-4">
              <GlowEffectButton name="Upcoming Events" icon="calendar" />
              <GlowEffectButton name="Inventory" icon="shopping-cart" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
