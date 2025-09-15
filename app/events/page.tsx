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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Calendar } from "lucide-react";
import Navbar from "@/components/Main/Navbar";

export interface Event {
  id: number;
  title: string;
  date: string;
  summary: string;
  images: string[];
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Reusable overlay button styles
const carouselButtonClasses =
  "absolute top-1/2 -translate-y-1/2 bg-black/40 text-white rounded-full p-2 hover:bg-black/60";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
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
        const formatted: Event[] = data.map((event) => ({
          id: event.id,
          title: event.title,
          summary: event.summary,
          date: new Date(event.date).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          images: Array.isArray(event.images) ? event.images : [],
        }));
        setEvents(formatted);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="mt-24 text-white mb-4 text-3xl text-center">Loading events...</div>
    );
  if (errorMsg) return <div className="text-red-500">{errorMsg}</div>;

  return (
    <>
    <Navbar />
    <div className="w-full mt-24 max-w-6xl text-white mx-auto px-4 py-10">
      <h1 className="text-4xl font-bold mb-6 text-center">Relive the Past Events</h1>

      {/* Outer Main Carousel */}
      <Carousel className="relative">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Academic Year 2024 - 25
        </h1>
        <CarouselContent>
          {events.map((event) => (
            <CarouselItem
              key={event.id}
              className="basis-full sm:basis-1/2 lg:basis-1/3"
            >
              <div className="p-4 glass-card rounded-2xl shadow-lg h-full flex flex-col">
                <h1 className="font-semibold text-3xl">{event.title}</h1>
                <p className="text-md flex items-center gap-1 mt-2">
                  <Calendar className="w-4 h-4" />
                  {event.date}
                </p>
                <p className="mt-4 flex-grow">{event.summary}</p>

                <Dialog>
                  <DialogTrigger asChild>
                    <button className="mt-3 w-2/3 mx-auto glass-button">
                      Revisit
                    </button>
                  </DialogTrigger>
                  <DialogContent className="max-w-sm text-white glass-card bg-white/15 p-6 rounded-2xl shadow-lg">
                    <DialogHeader>
                      <DialogTitle>{event.title}</DialogTitle>
                    </DialogHeader>

                    {/* Inner Carousel for Event Images */}
                    {event.images.length > 0 && (
                      <div className="w-full mt-4">
                        <Carousel className="w-full h-full">
                          <CarouselContent>
                            {event.images.map((img, idx) => (
                              <CarouselItem key={idx}>
                                <img
                                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${img}`}
                                  alt={`${event.title} image ${idx + 1}`}
                                  className="w-full h-64 object-cover rounded-xl"
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <div className="flex justify-center gap-8 mt-2">
                          <CarouselPrevious className={`-left-14 hidden md:flex w-10 h-10 ${carouselButtonClasses}`} />
                          <CarouselNext className={`-right-14 hidden md:flex w-10 h-10 ${carouselButtonClasses}`} />
                        </div>
                        </Carousel>

                        {/* Buttons below carousel, side by side */}
                        
                      </div>
                    )}

                    <div className="mt-4">
                      <p className="text-md flex gap-1 items-center text-white">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </p>
                      <p className="mt-2">{event.summary}</p>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Outer carousel overlay buttons */}
        <CarouselPrevious className={`-left-14 w-10 h-10 ${carouselButtonClasses}`} />
        <CarouselNext className={`-right-14 w-10 h-10 ${carouselButtonClasses}`} />
      </Carousel>

      <p className="text-center md:hidden text-lg text-muted-foreground">
        swipe to see more
      </p>
      </div>
      </>
  );
}
