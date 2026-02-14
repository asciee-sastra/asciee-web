"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Calendar,
    Edit,
    Loader2,
    Plus,
    Trash,
    Upload,
    X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Types
type Event = {
    id: number;
    title: string;
    date: string;
    summary: string;
    images: string[];
};

export default function EventsClient({ initialEvents }: { initialEvents: Event[] }) {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentEvent, setCurrentEvent] = useState<Partial<Event>>({});
    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    // Reset form
    const resetForm = () => {
        setCurrentEvent({});
        setImageFiles([]);
        setLoading(false);
        setDialogOpen(false);
    };

    // Open Dialog for Create
    const handleOpenCreate = () => {
        resetForm();
        setDialogOpen(true);
    };

    // Open Dialog for Edit
    const handleOpenEdit = (event: Event) => {
        setCurrentEvent(event);
        setImageFiles([]); // New files to add
        setDialogOpen(true);
    };

    // Delete Event
    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this event?")) return;

        setLoading(true);
        const { error } = await supabase.from("events-1").delete().eq("id", id);
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
            let imagePaths = currentEvent.images || [];

            // Upload new images
            if (imageFiles.length > 0) {
                const uploadedPaths = await Promise.all(
                    imageFiles.map(async (file) => {
                        const fileName = `${Date.now()}-${file.name}`;
                        const { data, error } = await supabase.storage
                            .from("events") // Assuming 'events' bucket
                            .upload(fileName, file);

                        if (error) throw error;
                        // Return 'events/filename' as expected by the frontend
                        return `events/${fileName}`;
                    })
                );
                imagePaths = [...imagePaths, ...uploadedPaths];
            }

            const eventData = {
                title: currentEvent.title,
                date: currentEvent.date,
                summary: currentEvent.summary,
                images: imagePaths,
            };

            if (currentEvent.id) {
                // Update
                const { error } = await supabase
                    .from("events-1")
                    .update(eventData)
                    .eq("id", currentEvent.id);
                if (error) throw error;
            } else {
                // Insert
                const { error } = await supabase.from("events-1").insert([eventData]);
                if (error) throw error;
            }

            setDialogOpen(false);
            router.refresh();
            // Reload local data to reflect changes immediately or wait for router refresh
            // For simplicity, we just reload page or fetch again. 
            // Router refresh is good but might not return updated data instantly if we use state.
            // So fetch updated list
            const { data } = await supabase.from("events-1").select("*").order("date", { ascending: true });
            if (data) setEvents(data);

        } catch (error: any) {
            alert("Error saving event: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    // Handle Image Remove from Array (Edit Mode)
    const handleRemoveImage = (indexToRemove: number) => {
        const updatedImages = (currentEvent.images || []).filter((_, i) => i !== indexToRemove);
        setCurrentEvent({ ...currentEvent, images: updatedImages });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Events Management</h2>
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
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Date</th>
                            <th className="px-6 py-3">Summary</th>
                            <th className="px-6 py-3">Images</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {events.map((event) => (
                            <tr key={event.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate" title={event.title}>
                                    {event.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{event.date}</td>
                                <td className="px-6 py-4 max-w-[300px] truncate" title={event.summary}>
                                    {event.summary}
                                </td>
                                <td className="px-6 py-4">{event.images?.length || 0}</td>
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
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    No events found.
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
                                {currentEvent.id ? "Edit Event" : "Create Event"}
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
                                    Title
                                </label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentEvent.title || ""}
                                    onChange={(e) =>
                                        setCurrentEvent({ ...currentEvent, title: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none [color-scheme:dark]"
                                    value={currentEvent.date ? new Date(currentEvent.date).toISOString().split('T')[0] : ""}
                                    onChange={(e) =>
                                        setCurrentEvent({ ...currentEvent, date: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Summary
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentEvent.summary || ""}
                                    onChange={(e) =>
                                        setCurrentEvent({ ...currentEvent, summary: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Current Images
                                </label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {currentEvent.images?.map((img, idx) => (
                                        <div key={idx} className="relative group w-20 h-20 rounded-md overflow-hidden border border-white/10">
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${img}`}
                                                alt="preview"
                                                className="w-full h-full object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(idx)}
                                                className="absolute top-0 right-0 bg-red-600/80 text-white p-1 rounded-bl-md opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                    {(!currentEvent.images || currentEvent.images.length === 0) && (
                                        <p className="text-sm text-gray-500 italic">No images uploaded.</p>
                                    )}
                                </div>

                                <label className="block text-sm font-medium text-gray-300 mt-4 mb-2">
                                    Upload New Images
                                </label>
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
                                            multiple
                                            className="hidden"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files) {
                                                    setImageFiles(Array.from(e.target.files));
                                                }
                                            }}
                                        />
                                    </label>
                                </div>
                                {imageFiles.length > 0 && (
                                    <div className="mt-2 text-sm text-green-400">
                                        {imageFiles.length} file(s) selected
                                    </div>
                                )}
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
