"use client"

import { useId } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AppToggle() {
  const id = useId()
  const pathname = usePathname()

  // Map routes to states
  const routeMap: Record<string, "coordinators" | "inventory" | "projects" | "events"> = {
    "/coordinators": "coordinators",
    "/inventory": "inventory",
    "/projects": "projects",
    "/events": "events",
  }

  const selectedValue = routeMap[pathname] ?? "coordinators"

  return (
    <div className="bg-input/50 inline-flex text-white h-10 rounded-2xl p-0.5">
      <RadioGroup
        value={selectedValue}
        className="group after:bg-background has-focus-visible:after:border-ring has-focus-visible:after:ring-ring/50 
        relative inline-grid grid-cols-4 items-center gap-0 text-sm font-medium 
        after:absolute after:inset-y-0 after:w-1/4 after:rounded-2xl after:shadow-xs 
        after:transition-[translate,box-shadow] after:duration-300 after:ease-[cubic-bezier(0.16,1,0.3,1)] 
        has-focus-visible:after:ring-[3px]
        data-[state=coordinators]:after:translate-x-0
        data-[state=inventory]:after:translate-x-full
        data-[state=projects]:after:translate-x-[200%]
        data-[state=events]:after:translate-x-[300%]"
        data-state={selectedValue}
      >
        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none group-data-[state=coordinators]:text-white">
          <Link href="/coordinators">Coordinators</Link>
          <RadioGroupItem id={`${id}-coordinators`} value="coordinators" className="sr-only" />
        </label>

        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none group-data-[state=inventory]:text-white">
          <Link href="/inventory">Inventory</Link>
          <RadioGroupItem id={`${id}-inventory`} value="inventory" className="sr-only" />
        </label>

        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none group-data-[state=projects]:text-white">
          <Link href="/projects">Projects</Link>
          <RadioGroupItem id={`${id}-projects`} value="projects" className="sr-only" />
        </label>

        <label className="relative z-10 inline-flex h-full min-w-8 cursor-pointer items-center justify-center px-3 whitespace-nowrap transition-colors select-none group-data-[state=events]:text-white">
          <Link href="/events">Events</Link>
          <RadioGroupItem id={`${id}-events`} value="events" className="sr-only" />
        </label>
      </RadioGroup>
    </div>
  )
}
