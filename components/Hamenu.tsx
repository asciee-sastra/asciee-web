"use client"

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import Link from "next/link"

const NAV_ITEMS = [
  { name: "Coordinators", href: "/coordinators" },
  { name: "Inventory", href: "/inventory" },
  { name: "Projects", href: "/projects" },
  { name: "Events", href: "/events" },
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
        className="backdrop-blur-xl bg-white/10 border-r border-white/20 text-white p-6"
      >
        

        <nav className="flex justify-center mt-24 items-start flex-col space-y-6">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="text-white/80 text-2xl hover:text-white transition-colors"
            >
              {item.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
