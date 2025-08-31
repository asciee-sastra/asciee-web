import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/asciee.jpg";
import { Separator } from "../ui/separator";
import { Instagram, Linkedin, MessagesSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer
      className="z-50
       bg-[#1a0020]
      backdrop-blur-xl text-white py-10"
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
            <button className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-[#720E9E] to-[#9D4EDD] hover:shadow-[0_0_20px_#9D4EDD] transition rounded-full font-medium">
              <MessagesSquare size={20} aria-hidden="true" /> Feedback
            </button>
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
      <div className="border-t border-white/10 mt-8 pt-6 text-center text-md text-gray-400">
        <p>
          Design and Dev by{" "}
          <Link
            className="underline text-lg font-extrabold leading-relaxed hover:text-purple-400"
            href="https://saifbuilds.vercel.app/"
            target="_blank"
          >
            Saif
          </Link>
        </p>
        <p>&copy; {new Date().getFullYear()} ASCIEE. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
