"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Calendar,
    Clock,
    Edit,
    Link as LinkIcon,
    Plus,
    Trash,
    Upload,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type UpcomingEvent = {
    id: number;
    name: string;
    description: string;
    path: string; // single image path
    date: string;
    time: string;
    link: string;
};

export default function UpcomingEventsClient({ initialEvents }: { initialEvents: UpcomingEvent[] }) {
    const [events, setEvents] = useState<UpcomingEvent[]>(initialEvents);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<UpcomingEvent>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Reset form
    const resetForm = () => {
        setCurrentEvent({});
        setImageFile(null);
        setLoading(false);
        setDialogOpen(false);
    };

    // Open Dialog for Create
    const handleOpenCreate = () => {
        resetForm();
        setDialogOpen(true);
    };

    // Open Dialog for Edit
    const handleOpenEdit = (event: UpcomingEvent) => {
        setCurrentEvent(event);
        setImageFile(null); // New file to replace existing
        setDialogOpen(true);
    };

    // Delete Event
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        setLoading(true);
        const { error } = await supabase.from("upcomingevents").delete().eq("id", id);
        if (error) {
            alert("Error deleting event: " + error.message);
        } else {
            setEvents(events.filter((e) => e.id !== id));
            router.refresh();
        }
        setLoading(false);
    };

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imagePath = currentEvent.path || "";

            // Upload new image if selected
            if (imageFile) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from("events") // Using same 'events' bucket
                    .upload(`upcoming/${fileName}`, imageFile); // Organize in 'upcoming' folder

                if (error) throw error;
                imagePath = `events/upcoming/${fileName}`;
            }

            const eventData = {
                name: currentEvent.name,
                description: currentEvent.description,
                path: imagePath,
                date: currentEvent.date,
                time: currentEvent.time,
                link: currentEvent.link,
            };

            if (currentEvent.id) {
                // Update
                const { error } = await supabase
                    .from("upcomingevents")
                    .update(eventData)
                    .eq("id", currentEvent.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from("upcomingevents").insert([eventData]);
                if (error) throw error;
            }

            setDialogOpen(false);
            router.refresh();

            // Fetch updated list
            const { data } = await supabase.from("upcomingevents").select("*").order("date", { ascending: true });
            if (data) setEvents(data as UpcomingEvent[]);

        } catch (error: any) {
            alert("Error saving event: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Upcoming Events Management</h2>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Event
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-white/10 text-xs uppercase text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Name</th>
                            <th className="px-6 py-3">Date & Time</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Image</th>
                            <th className="px-6 py-3">Link</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate" title={event.name}>
                                    {event.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="w-3 h-3 text-purple-400" />
                                            {event.date}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="w-3 h-3 text-blue-400" />
                                            {event.time}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 max-w-[300px] truncate" title={event.description}>
                                    {event.description}
                                </td>
                                <td className="px-6 py-4">
                                    {event.path ? (
                                        <div className="w-10 h-10 rounded overflow-hidden border border-white/10">
                                            {/* Try both full URL and Supabase storage path just in case */}
                                            <img
                                                src={event.path.startsWith('http') ? event.path : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${event.path}`}
                                                alt={event.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ) : (
                                        <span className="text-gray-500 text-xs">No image</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 max-w-[150px] truncate">
                                    <a href={event.link} target="_blank" rel="noreferrer" className="text-blue-400 hover:underline flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" /> Link
                                    </a>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(event)}
                                            className="rounded p-2 text-blue-400 hover:bg-blue-400/10 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(event.id)}
                                            className="rounded p-2 text-red-400 hover:bg-red-400/10 transition-colors"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {events.length === 0 && (
                            <tr>
                                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                                    No upcoming events found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {currentEvent.id ? "Edit Upcoming Event" : "Create Upcoming Event"}
                            </h3>
                            <button
                                onClick={() => setDialogOpen(false)}
                                className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Event Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentEvent.name || ""}
                                    onChange={(e) =>
                                        setCurrentEvent({ ...currentEvent, name: e.target.value })
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Date
                                    </label>
                                    <input
                                        type="date"
                                        required
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none [color-scheme:dark]"
                                        value={currentEvent.date || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({ ...currentEvent, date: e.target.value })
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">
                                        Time
                                    </label>
                                    <input
                                        type="time"
                                        required
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none [color-scheme:dark]"
                                        value={currentEvent.time || ""}
                                        onChange={(e) =>
                                            setCurrentEvent({ ...currentEvent, time: e.target.value })
                                        }
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentEvent.description || ""}
                                    onChange={(e) =>
                                        setCurrentEvent({ ...currentEvent, description: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Registration Link
                                </label>
                                <input
                                    type="url"
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentEvent.link || ""}
                                    onChange={(e) =>
                                        setCurrentEvent({ ...currentEvent, link: e.target.value })
                                    }
                                    placeholder="https://..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Cover Image
                                </label>
                                {(currentEvent.path || imageFile) ? (
                                    <div className="relative w-full h-40 mb-3 rounded-lg overflow-hidden border border-white/10 bg-black/20">
                                        <img
                                            src={imageFile ? URL.createObjectURL(imageFile) : (currentEvent.path?.startsWith('http') ? currentEvent.path : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${currentEvent.path}`)}
                                            alt="preview"
                                            className="w-full h-full object-cover"
                                        />
                                        {imageFile && (
                                            <button
                                                type="button"
                                                onClick={() => setImageFile(null)}
                                                className="absolute top-2 right-2 bg-red-600/80 text-white p-1 rounded-full text-xs"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        )}
                                    </div>
                                ) : null}

                                <div className="flex items-center justify-center w-full">
                                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-white/10 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-colors">
                                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                            <Upload className="w-8 h-8 mb-3 text-gray-400" />
                                            <p className="mb-2 text-sm text-gray-400">
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                PNG, JPG, GIF up to 5MB
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files && e.target.files[0]) {
                                                    setImageFile(e.target.files[0]);
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button
                                    type="button"
                                    onClick={() => setDialogOpen(false)}
                                    className="rounded-lg px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={uploading}
                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {uploading ? "Saving..." : "Save Event"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
