"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Loader2 } from "lucide-react";
import Navbar from "@/components/Main/Navbar";
import { motion } from "framer-motion";
import { Event, EventCard } from "@/components/events/EventCard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Overlay button styles
const carouselButtonClasses =
  "absolute top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60 backdrop-blur-sm border border-white/10 transition-all hover:scale-110";

// Helper: Compute academic year (June–May cycle)
function getAcademicYear(dateStr: string): string {
  const d = new Date(dateStr);
  const year = d.getFullYear();
  const month = d.getMonth(); // 0 = Jan, 11 = Dec

  if (month >= 5) {
    // June or later -> currentYear - nextYear
    return `${year}-${String(year + 1).slice(-2)}`;
  } else {
    // Jan–May -> prevYear - currentYear
    return `${year - 1}-${String(year).slice(-2)}`;
  }
}

export default function EventsPage() {
  const [events, setEvents] = useState<Record<string, Event[]>>({});
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("events-1")
        .select("id, title, date, summary, images")
        .order("date", { ascending: true });

      if (error) {
        setErrorMsg(error.message);
      } else if (data) {
        const formatted: Event[] = data.map((event) => {
          const year = getAcademicYear(event.date);
          return {
            id: event.id,
            title: event.title,
            summary: event.summary,
            rawDate: event.date,
            year,
            date: new Date(event.date).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            images: Array.isArray(event.images) ? event.images : [],
          };
        });

        // Group by year
        const grouped = formatted.reduce((acc: any, ev) => {
          if (!acc[ev.year]) acc[ev.year] = [];
          acc[ev.year].push(ev);
          return acc;
        }, {});
        setEvents(grouped);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <>
        <Navbar />
        <div className="w-full mt-24 max-w-6xl text-white mx-auto px-4 py-10 flex flex-col items-center">
          <Loader2 className="w-10 h-10 animate-spin text-purple-300 mb-4" />
          <p className="text-xl font-light text-purple-200">Loading memories...</p>
        </div>
      </>
    );

  if (errorMsg)
    return (
      <div className="w-full h-screen flex items-center justify-center text-red-400">
        Error: {errorMsg}
      </div>
    );

  return (
    <>
      <Navbar />
      <div className="w-full mt-24 max-w-7xl text-white mx-auto px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-sm">
            Relive the Past Events
          </h1>
          <p className="text-lg md:text-xl text-purple-200/80 max-w-2xl mx-auto">
            A journey through our milestones, achievements, and memorable moments.
          </p>
        </motion.div>

        {Object.keys(events)
          .sort((a, b) => (a > b ? -1 : 1)) // newest academic year first
          .map((year, sectionIdx) => (
            <motion.div
              key={year}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: sectionIdx * 0.1 }}
              className="mb-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] bg-gradient-to-r from-transparent to-purple-400/50 flex-grow" />
                <h2 className="text-xl md:text-2xl font-bold text-white/90 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
                  Academic Year {year}
                </h2>
                <div className="h-[1px] bg-gradient-to-l from-transparent to-purple-400/50 flex-grow" />
              </div>

              {/* Carousel for this year */}
              <Carousel className="relative w-full">
                <CarouselContent className="-ml-4">
                  {events[year].map((event) => (
                    <CarouselItem
                      key={event.id}
                      className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3"
                    >
                      <EventCard event={event} />
                    </CarouselItem>
                  ))}
                </CarouselContent>

                {/* Outer carousel buttons */}
                <CarouselPrevious
                  className={`-left-5 hidden md:flex lg:-left-12 w-12 h-12 ${carouselButtonClasses}`}
                />
                <CarouselNext
                  className={`-right-5 hidden md:flex lg:-right-12 w-12 h-12 ${carouselButtonClasses}`}
                />
              </Carousel>
            </motion.div>
          ))}
      </div>
    </>
  );
}
