"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import logo from "@/public/asciee.jpg"
import { Users, Boxes, Calendar, MessageSquare, Workflow, Menu } from "lucide-react"
import Hamenu from "../Hamenu"

const Header = () => {
  const [visible, setVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > lastScrollY) {
        setVisible(false) // hide on scroll down
      } else {
        setVisible(true) // show on scroll up
      }
      setLastScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <header
      className={`fixed top-2 left-0 w-full h-17 flex justify-center z-50 transition-transform duration-500 ${
        visible ? "translate-y-0" : "-translate-y-24"
      }`}
    >
      <nav
        className="w-[95%] max-w-6xl flex items-center justify-between 
        bg-[rgba(20,0,40,0.6)] backdrop-blur-md 
        border border-white/10
        rounded-full px-6 py-4
        shadow-[0_8px_30px_rgba(0,0,0,0.25)]
        relative overflow-hidden
        before:absolute before:inset-0 before:rounded-full
        before:bg-[conic-gradient(at_top_left,_#720E9E,_#9D4EDD,_#720E9E)]
        before:blur-2xl before:opacity-20 before:animate-spin-slow"
      >
        {/* Logo */}
        <div className="flex items-center gap-2 z-10">
          <Image
            src={logo}
            alt="ASCIEE"
            width={36}
            height={36}
            className="rounded-full"
          />
          <span className="text-white font-semibold text-lg">ASCIEE</span>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2 bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm border border-white/10 z-10">
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white bg-gradient-to-r from-[#720E9E] to-[#9D4EDD] shadow-md transition hover:shadow-[0_0_15px_#720E9E]">
            <Users size={18} /> Coordinators
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white hover:bg-white/10 transition">
            <Boxes size={18} /> Inventory
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white hover:bg-white/10 transition">
            <Workflow size={18} /> Projects
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-full text-sm text-white hover:bg-white/10 transition">
            <Calendar size={18} /> Events
          </button>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3 z-10">
          {/* Feedback button desktop */}
          <button className="hidden md:flex px-5 py-2 rounded-full bg-white text-black font-medium items-center gap-2 shadow-md hover:shadow-[0_0_12px_#720E9E] transition">
            <MessageSquare size={18} /> Feedback
          </button>

          {/* Hamburger for mobile */}
          <div className="text-white md:hidden">
            <Hamenu />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
