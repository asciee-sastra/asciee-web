"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Menu,
  MessagesSquare,
  Calendar,
  ShoppingCart,
  Users,
  Workflow,
  Boxes,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import logo from "@/public/asciee.jpg"
import React from "react"

const NAV_ITEMS = [
  { name: "Coordinators", href: "/coordinators", icon: Users },
  { name: "Inventory", href: "/inventory", icon: Boxes },
  { name: "Projects", href: "/projects", icon: Workflow },
  { name: "Events", href: "/events", icon: Calendar },
]

export default function Hamenu() {
  return (
    <Sheet>
      {/* Hamburger Button */}
      <SheetTrigger className="p-2 rounded-xl hover:bg-white/10 transition focus:outline-none">
        <Menu size={28} />
      </SheetTrigger>

      {/* Sidebar Content with Glass Effect */}
      <SheetContent
        side="left"
        className="backdrop-blur-2xl bg-white/10 border-r border-white/20 
                   text-white p-6 flex flex-col justify-between 
                   shadow-2xl rounded-r-3xl"
      >
        {/* Header */}
        <SheetHeader>
          <SheetTitle className="flex items-center gap-3 text-2xl font-bold text-white">
            <Image
              src={logo}
              width={40}
              height={40}
              className="rounded-full border border-white/20 shadow-md"
              alt="ASCIEE Logo"
            />
            <span className="text-3xl font-bold tracking-wide">ASCIEE</span>
          </SheetTitle>
        </SheetHeader>

        {/* Navigation */}
        <div className="flex flex-1 flex-col justify-center space-y-8">
          {NAV_ITEMS.map(({ name, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 text-lg font-medium text-white/80 
                         hover:text-white hover:scale-105 transition-transform"
            >
              <Icon size={28} />
              {name}
            </Link>
          ))}
        </div>

        {/* Feedback Button */}
        <div className="flex justify-center mb-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-800 
                              hover:from-purple-700 hover:to-purple-900 
                              transition-all rounded-full text-lg font-medium shadow-lg">
            <MessagesSquare size={22} aria-hidden="true" /> Feedback
          </button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
