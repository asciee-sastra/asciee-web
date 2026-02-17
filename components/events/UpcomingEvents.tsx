"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, Loader2 } from "lucide-react";

export interface UpcomingEvent {
    id: number;
    name: string;
    description: string;
    path: string;
    date: string;
    time: string;
    link: string;
}

export default function UpcomingEvents() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from("upcomingevents")
                    .select("*")
                    .order('date', { ascending: true }); // sort by upcoming date

                if (error) {
                    throw error;
                }

                if (data) {
                    setEvents(data as UpcomingEvent[]);
                }
            } catch (err: any) {
                console.error("Error fetching upcoming events:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return (
            <div className="w-full h-40 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-400" />
            </div>
        );
    }

    if (error) {
        // Silently fail or minimal error? User didn't specify. Minimal error is good for debugging.
        return (
            <div className="text-red-400 text-center py-10">
                Error loading upcoming events.
            </div>
        )
    }



    return (
        <section className="w-full max-w-7xl mx-auto px-4 py-6 relative z-10">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-8 text-center"
            >
                <h1 className="text-4xl md:text-5xl pb-2 font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-purple-400 drop-shadow-sm">
                    Upcoming Events
                </h1>
                <p className="text-purple-200/60 max-w-2xl mx-auto text-lg mb-6 font-light">
                    Mark your calendars for our next big adventures.
                </p>
                <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent mx-auto" />
            </motion.div>

            {events.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event, index) => (
                        <EventCard
                            key={event.id || index}
                            {...event}
                            index={index}
                        />
                    ))}
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full py-20 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
                >
                    <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 ring-1 ring-purple-500/20">
                        <Calendar className="w-10 h-10 text-purple-400 opacity-80" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">No Events Scheduled</h3>
                    <p className="text-purple-200/60 max-w-md">
                        We don't have any upcoming events right now. Stay tuned for future updates!
                    </p>
                </motion.div>
            )}
        </section>
    );
}

function EventCard({ name, description, path, date, time, link, index }: UpcomingEvent & { index: number }) {
    // Helper to determine image source
    const getImageUrl = (path: string) => {
        if (!path) return "/placeholder-event.webp"; // Use a webp placeholder if available or just empty
        if (path.startsWith("http")) return path;
        // Construct Supabase public URL
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
        >
            {/* Image Container */}
            <div className="relative h-64 w-full overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-10 transition-opacity duration-300 opacity-80 group-hover:opacity-60" />

                {path ? (
                    <img
                        src={getImageUrl(path)}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full bg-purple-900/20 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-purple-500/30" />
                    </div>
                )}

                {/* Floating Date Badge */}
                <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col items-center justify-center text-white/90 shadow-lg">
                    <span className="text-xs font-medium uppercase text-purple-300">
                        {/* If date is YYYY-MM-DD, try to format month. Else just show it. */}
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', })}
                    </span>
                    <span className="text-xl font-bold font-mono">
                        {new Date(date).getDate()}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow p-6 pt-2 z-20 -mt-12 relative">
                <div className="mb-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-md font-medium text-purple-200 backdrop-blur-md">
                        <Clock className="w-3 h-3" />
                        {time.slice(0, 5)}
                    </div>
                </div>

                <h3 className="text-2xl font-bold text-white my-3 group-hover:text-purple-300 transition-colors line-clamp-2 leading-tight">
                    {name}
                </h3>

                <p className="text-gray-300/80 text-sm leading-relaxed line-clamp-3 mb-6 flex-grow">
                    {description}
                </p>

                {link && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-full group/btn relative overflow-hidden rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3.5 text-center text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                    >
                        <span>Register Now</span>
                        <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 text-purple-300" />

                        {/* Button Glow */}
                        <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover/btn:ring-purple-400/50 transition-all duration-300" />
                    </a>
                )}
            </div>

            {/* Hover Glow Effect */}
        </motion.div>
    );
}
