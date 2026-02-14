"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Calendar, ArrowRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export interface Event {
    id: number;
    title: string;
    date: string; // formatted
    rawDate: string; // original
    summary: string;
    images: string[];
    year: string; // computed academic year
}

interface EventCardProps {
    event: Event;
}

export function EventCard({ event }: EventCardProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    return (
        <>
            <motion.div
                whileHover={{ y: -5 }}
                className="glass-card p-0 rounded-3xl shadow-xl h-full flex flex-col overflow-hidden group hover:shadow-purple-500/20 transition-all duration-300 border-white/10"
            >
                {/* Card Image Preview */}


                <div className="p-6 flex flex-col flex-grow relative">
                    <h3 className="font-bold text-2xl line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
                        {event.title}
                    </h3>
                    <p className="text-sm font-medium flex items-center gap-2 text-purple-200/70 mb-4">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                    </p>
                    <p className="text-white/70 line-clamp-3 text-sm flex-grow">
                        {event.summary}
                    </p>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="mt-6 w-full glass-button group/btn flex items-center justify-center gap-2"
                    >
                        Revisit Event
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </motion.div>

            {/* Custom Modal Portal */}
            {mounted &&
                createPortal(
                    <AnimatePresence>
                        {isOpen && (
                            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
                                {/* Backdrop */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    onClick={() => setIsOpen(false)}
                                    className="absolute inset-0 bg-black/60 backdrop-blur-md"
                                />

                                {/* Modal Content */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                                    className="relative w-full max-w-5xl h-[85vh] md:h-[650px] bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row"
                                >
                                    {/* Close Button */}
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="absolute top-4 right-4 z-50 p-2 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors border border-white/10"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Left Side: Images */}
                                    {/* Left Side: Images */}
                                    {event.images.length > 0 && (
                                        <div className="w-full md:w-[60%] h-64 md:h-full relative bg-black/50 group/carousel border-r border-white/10">
                                            <Carousel className="w-full h-full [&>div]:h-full">
                                                <CarouselContent className="h-full ml-0">
                                                    {event.images.map((img, imgIdx) => (
                                                        <CarouselItem
                                                            key={imgIdx}
                                                            className="pl-0 h-full w-full"
                                                        >
                                                            <div className="relative w-full h-full">
                                                                <img
                                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${img}`}
                                                                    alt={`${event.title} - ${imgIdx + 1}`}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40" />
                                                            </div>
                                                        </CarouselItem>
                                                    ))}
                                                </CarouselContent>
                                                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 z-10" />
                                                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 z-10" />
                                            </Carousel>
                                        </div>
                                    )}

                                    {/* Right Side: Details */}
                                    <div
                                        className={`flex flex-col ${event.images.length > 0 ? "md:w-[40%]" : "w-full"
                                            } p-8 md:p-10 bg-gradient-to-b from-white/5 to-transparent relative`}
                                    >
                                        <div className="mb-6 z-10 pt-4 md:pt-0">
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-200 border border-purple-500/30 flex items-center gap-1.5">
                                                    <Calendar className="w-3 h-3" />
                                                    {event.date}
                                                </span>
                                            </div>
                                            <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200 leading-tight">
                                                {event.title}
                                            </h2>
                                        </div>

                                        <div className="flex-1 overflow-y-auto pr-4 z-10 custom-scrollbar [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-white/20">
                                            <div className="prose prose-invert prose-lg max-w-none">
                                                <p className="text-gray-300 leading-relaxed whitespace-pre-line text-base md:text-lg">
                                                    {event.summary}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Decor */}
                                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
                                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 blur-[80px] pointer-events-none" />
                                    </div>
                                </motion.div>
                            </div>
                        )}
                    </AnimatePresence>,
                    document.body
                )}
        </>
    );
}
