import Image from "next/image";
import Link from "next/link";
import React from "react";
import logo from "@/public/asciee.jpg";
import { Separator } from "../ui/separator";
import { Instagram, Linkedin, MessagesSquare } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-white py-10">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            className="rounded-full"
            src={logo}
            alt="ASCIEE Logo"
            width={220}
            height={220}
          />
        </div>

        {/* Middle section */}
        <div className="flex flex-col md:flex-row items-center gap-12">
          {/* Links + Feedback */}
          <div className="flex flex-col items-center gap-4 text-lg font-medium">
            <Link href="/coordinators" className="hover:text-purple-400">
              Coordinators
            </Link>
            <Link href="/inventory" className="hover:text-purple-400">
              Inventory
            </Link>
            <Link href="/projects" className="hover:text-purple-400">
              Projects
            </Link>
            <Link href="/events" className="hover:text-purple-400">
              Events
            </Link>
            <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 transition rounded-full font-medium">
              <MessagesSquare size={24} aria-hidden="true" /> Feedback
            </button>
          </div>

          {/* Vertical separator */}
          <Separator
            orientation="vertical"
            className="hidden bg-white md:block h-40"
          />

          {/* Socials */}
          <div className="flex flex-col items-center gap-3">
            <span className="font-medium">Follow Us on</span>
            <div className="flex gap-4 text-2xl">
              <Link
                href="https://www.instagram.com/asciee_sastra/"
                target="_blank"
                aria-label="Instagram"
              >
                <Instagram className="hover:text-purple-400 transition" />
              </Link>
              <Link
                href="https://www.linkedin.com/company/asciee/"
                target="_blank"
                aria-label="LinkedIn"
              >
                <Linkedin className="hover:text-purple-400 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="container mx-auto text-center mt-8 text-sm">
        <p>
          Design and Dev by{" "}
          <Link
            className="underline"
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
