import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/asciee.jpg";
import { Separator } from "../ui/separator";
import { Instagram, Linkedin, MessagesSquare } from "lucide-react";

const Footer = () => {
  return (
    <div
      className="z-50
       bg-[#1a0020] text-white border-white border-t-1 py-10"
    >
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            className="rounded-full"
            src={logo}
            alt="ASCIEE Logo"
            width={160}
            height={160}
            unoptimized
          />
        </div>

        {/* Middle section */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Links + Feedback */}
          <div className="flex flex-col items-center gap-4 text-lg font-medium">
            <Link
              href="/coordinators"
              className="hover:text-purple-400 hover:drop-shadow-[0_0_10px_#9D4EDD] transition"
            >
              Coordinators
            </Link>
            <Link
              href="/inventory"
              className="hover:text-purple-400 hover:drop-shadow-[0_0_10px_#9D4EDD] transition"
            >
              Inventory
            </Link>
            <Link
              href="/projects"
              className="hover:text-purple-400 hover:drop-shadow-[0_0_10px_#9D4EDD] transition"
            >
              Projects
            </Link>
            <Link
              href="/events"
              className="hover:text-purple-400 hover:drop-shadow-[0_0_10px_#9D4EDD] transition"
            >
              Events
            </Link>
            <Link target="_blank" href="https://forms.gle/Q99Zs7uYMkRdBjGM6"><button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#720E9E] to-[#9D4EDD] hover:shadow-[0_0_20px_#9D4EDD] transition rounded-full font-medium">
              <MessagesSquare size={20} aria-hidden="true" /> Feedback
            </button></Link>
          </div>

          {/* Vertical separator */}
          <Separator
            orientation="vertical"
            className="hidden bg-white/20 md:block h-40"
          />

          {/* Socials */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-medium">Follow Us on</span>
            <div className="flex gap-4">
              <Link
                href="https://www.instagram.com/asciee_sastra/"
                target="_blank"
                aria-label="Instagram"
                className="p-3 rounded-full bg-white/10 hover:bg-purple-600 transition"
              >
                <Instagram className="w-5 h-5" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/asciee/"
                target="_blank"
                aria-label="LinkedIn"
                className="p-3 rounded-full bg-white/10 hover:bg-purple-600 transition"
              >
                <Linkedin className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="relative mt-12 pt-6 text-center">
  {/* Gradient top border */}
  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-[2px] bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-full"></div>

  <p className="text-gray-400 text-md">
    Designed and Developed by{" "}
    <Link
      href="https://saifbuilds.vercel.app/"
      target="_blank"
      className="relative font-bold underline text-lg text-white"
    >
      Saif
    </Link>
  </p>

  <p className="text-gray-500 text-sm mt-2">
    &copy; {new Date().getFullYear()} ASCIEE. All rights reserved.
  </p>
</div>

    </div>
  );
};

export default Footer;
