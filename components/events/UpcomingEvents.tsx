"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, ExternalLink, Loader2, X, ClipboardEdit } from "lucide-react";

export interface UpcomingEvent {
    id: string;
    name: string;
    description: string;
    path: string;
    date: string;
    time: string;
    link: string;
}

type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "phone";
type FormField = {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
    options?: string[];
};

export default function UpcomingEvents() {
    const [events, setEvents] = useState<UpcomingEvent[]>([]);
    const [formEventIds, setFormEventIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [registerEvent, setRegisterEvent] = useState<UpcomingEvent | null>(null);
    const supabase = createClient();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const { data, error } = await supabase
                    .from("upcomingevents")
                    .select("*")
                    .order('date', { ascending: true });

                if (error) throw error;
                if (data) setEvents(data as UpcomingEvent[]);

                const { data: forms } = await supabase
                    .from("event_forms")
                    .select("event_id, fields");
                if (forms) {
                    const ids = new Set(
                        forms.filter((f: any) => Array.isArray(f.fields) && f.fields.length > 0)
                             .map((f: any) => f.event_id)
                    );
                    setFormEventIds(ids);
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
                            event={event}
                            index={index}
                            hasCustomForm={formEventIds.has(event.id)}
                            onRegisterClick={() => setRegisterEvent(event)}
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

            <AnimatePresence>
                {registerEvent && (
                    <RegistrationModal
                        event={registerEvent}
                        onClose={() => setRegisterEvent(null)}
                    />
                )}
            </AnimatePresence>
        </section>
    );
}

function EventCard({
    event,
    index,
    hasCustomForm,
    onRegisterClick,
}: {
    event: UpcomingEvent;
    index: number;
    hasCustomForm: boolean;
    onRegisterClick: () => void;
}) {
    const { name, description, path, date, time, link } = event;

    const getImageUrl = (path: string) => {
        if (!path) return "/placeholder-event.webp";
        if (path.startsWith("http")) return path;
        return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${path}`;
    };

    const showCustomFormButton = hasCustomForm;
    const showExternalLinkButton = !hasCustomForm && !!link;

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative flex flex-col h-full bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden hover:border-purple-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/10"
        >
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

                <div className="absolute top-4 right-4 z-20 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl flex flex-col items-center justify-center text-white/90 shadow-lg">
                    <span className="text-xs font-medium uppercase text-purple-300">
                        {new Date(date).toLocaleDateString('en-US', { month: 'short', })}
                    </span>
                    <span className="text-xl font-bold font-mono">
                        {new Date(date).getDate()}
                    </span>
                </div>
            </div>

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

                {showCustomFormButton && (
                    <button
                        onClick={onRegisterClick}
                        className="mt-auto w-full group/btn relative overflow-hidden rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3.5 text-center text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                    >
                        <span>Register Now</span>
                        <ClipboardEdit className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 text-purple-300" />
                        <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover/btn:ring-purple-400/50 transition-all duration-300" />
                    </button>
                )}

                {showExternalLinkButton && (
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto w-full group/btn relative overflow-hidden rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 px-4 py-3.5 text-center text-sm font-semibold text-white transition-all flex items-center justify-center gap-2"
                    >
                        <span>Register Now</span>
                        <ExternalLink className="w-4 h-4 transition-transform group-hover/btn:translate-x-1 text-purple-300" />
                        <div className="absolute inset-0 rounded-xl ring-2 ring-white/10 group-hover/btn:ring-purple-400/50 transition-all duration-300" />
                    </a>
                )}
            </div>
        </motion.div>
    );
}

function RegistrationModal({ event, onClose }: { event: UpcomingEvent; onClose: () => void }) {
    const supabase = createClient();
    const [fields, setFields] = useState<FormField[]>([]);
    const [values, setValues] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        supabase
            .from("event_forms")
            .select("fields")
            .eq("event_id", event.id)
            .maybeSingle()
            .then(({ data }) => {
                setFields(data?.fields || []);
                setLoading(false);
            });
    }, [event.id]);

    const handleChange = (id: string, value: any) => {
        setValues((prev) => ({ ...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        for (const f of fields) {
            if (f.required && !values[f.id]) {
                setError(`"${f.label}" is required`);
                return;
            }
        }

        const { error: insertError } = await supabase
            .from("event_registrations")
            .insert([{ event_id: event.id, form_data: values }]);

        if (insertError) {
            setError(insertError.message);
            return;
        }
        setSubmitted(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-lg rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl max-h-[85vh] overflow-y-auto"
            >
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-white">Register — {event.name}</h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {loading ? (
                    <div className="py-10 flex justify-center">
                        <Loader2 className="w-6 h-6 animate-spin text-purple-400" />
                    </div>
                ) : submitted ? (
                    <p className="text-center text-green-400 text-lg py-10">✅ Registered successfully!</p>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {fields.map((field) => (
                            <div key={field.id}>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    {field.label} {field.required && <span className="text-red-400">*</span>}
                                </label>

                                {field.type === "textarea" ? (
                                    <textarea
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    />
                                ) : field.type === "select" ? (
                                    <select
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                        defaultValue=""
                                    >
                                        <option value="" disabled>Select...</option>
                                        {field.options?.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                ) : field.type === "checkbox" ? (
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleChange(field.id, e.target.checked)}
                                    />
                                ) : (
                                    <input
                                        type={field.type === "phone" ? "tel" : field.type}
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
                                        onChange={(e) => handleChange(field.id, e.target.value)}
                                    />
                                )}
                            </div>
                        ))}

                        {error && <p className="text-red-400 text-sm">{error}</p>}

                        <button
                            type="submit"
                            className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500"
                        >
                            Submit Registration
                        </button>
                    </form>
                )}
            </motion.div>
        </motion.div>
    );
}
