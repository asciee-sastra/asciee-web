"use client"

import { MessagesSquare } from "lucide-react"
import AppToggle from "@/components/app-toggle"
import { Button } from "@/components/ui/button"
import Hamenu from "@/components/Hamenu"
import Image from "next/image"
import logo from "@/public/asciee.jpg"
import Link from "next/link"

export default function Header() {
  return (
    <header className="mx-6 mt-3 rounded-4xl shadow-md shadow-black border  bg-foreground/90  text-white px-4 md:px-5">
      <div className="flex h-16 items-center justify-between gap-4 relative">
        {/* Left side: Logo */}
        <div className="flex flex-1 items-center gap-2">
          <Link href="/">
            <Image
              src={logo}
              width={36}
              height={36}
              className="rounded-full transition-shadow"
              alt="ASCIEE Logo"
            />
          </Link>
          <h1 className="text-xl mt-1 font-semibold">ASCIEE</h1>
        </div>

        {/* Center: Navbar (desktop only) */}
        <div className="absolute left-1/2 hidden md:block -translate-x-1/2">
          <AppToggle />
        </div>

        {/* Right side */}
        <div className="flex flex-1 items-center justify-end gap-2">
          {/* Hamburger menu (mobile only) */}
          <div className="md:hidden">
            <Hamenu />
          </div>

          {/* Feedback button (desktop only) */}
          <Button size="lg" className="hidden rounded-4xl p-4 md:flex text-md">
            <MessagesSquare size={24} aria-hidden="true" />
            <span>Feedback</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
