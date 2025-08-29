"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, MessagesSquare, Calendar, ShoppingCart, User, Workflow } from "lucide-react"
import Link from "next/link"
import { Button } from "./ui/button"
import Image from "next/image"
import logo from "@/public/asciee.jpg"
import React from "react"

const NAV_ITEMS = [
  { name: "Coordinators", href: "/coordinators", icon: User },
  { name: "Inventory", href: "/inventory", icon: ShoppingCart },
  { name: "Projects", href: "/projects", icon: Workflow },
  { name: "Events", href: "/events", icon: Calendar },
]

export default function Hamenu() {
  return (
    <Sheet>
      {/* Hamburger Button */}
      <SheetTrigger className="p-2 rounded-md hover:bg-white/10 focus:outline-none">
        <Menu size={28} />
      </SheetTrigger>

      {/* Sidebar Content with Glass Effect */}
      <SheetContent
        side="left"
        className="backdrop-blur-xl bg-white/10 border-r border-white/20 text-white p-6 flex flex-col justify-between"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="text-white flex gap-3 text-2xl font-bold">
            <Image
              src={logo}
              width={36}
              height={36}
              className="rounded-full transition-shadow"
              alt="ASCIEE Logo"
            />
            <h1 className="text-3xl font-bold">ASCIEE</h1>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <div className="flex flex-1 flex-col mb-24 justify-center">
        <nav className="flex flex-col  space-y-6">
          {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center ml-8 gap-3 text-white/80 text-3xl hover:text-white transition-colors"
            >
              <Icon size={26} />
              {name}
            </Link>
          ))}

          <div className="flex justify-center w-3/4">
            <button className="flex items-center gap-2 px-4 text-xl py-2 bg-purple-600 hover:bg-purple-700 transition rounded-full font-medium">
              <MessagesSquare size={24} aria-hidden="true" /> Feedback
            </button>
          </div>
        </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}
