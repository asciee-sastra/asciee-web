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
    ClipboardList, // ← NEW
    Users,         // ← NEW
} from "lucide-react";
import { useRouter } from "next/navigation";

// Types
type UpcomingEvent = {
    id: number;
    name: string;
    description: string;
    path: string;
    date: string;
    time: string;
    link: string;
};

// ← NEW: form field + registration types
type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "phone";
type FormField = {
    id: string;
    label: string;
    type: FieldType;
    required: boolean;
    options?: string[];
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

    // ← NEW: form builder modal state
    const [formEvent, setFormEvent] = useState<UpcomingEvent | null>(null);
    const [formFields, setFormFields] = useState<FormField[]>([]);
    const [formLoading, setFormLoading] = useState(false);

    // ← NEW: registrations viewer modal state
    const [regEvent, setRegEvent] = useState<UpcomingEvent | null>(null);
    const [regRows, setRegRows] = useState<any[]>([]);
    const [regColumns, setRegColumns] = useState<string[]>([]);

    // Reset form
    const resetForm = () => {
        setCurrentEvent({});
        setImageFile(null);
        setLoading(false);
        setDialogOpen(false);
    };

    const handleOpenCreate = () => {
        resetForm();
        setDialogOpen(true);
    };

    const handleOpenEdit = (event: UpcomingEvent) => {
        setCurrentEvent(event);
        setImageFile(null);
        setDialogOpen(true);
    };

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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);

        try {
            let imagePath = currentEvent.path || "";

            if (imageFile) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { data, error } = await supabase.storage
                    .from("events")
                    .upload(`upcoming/${fileName}`, imageFile);

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
                const { error } = await supabase
                    .from("upcomingevents")
                    .update(eventData)
                    .eq("id", currentEvent.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("upcomingevents").insert([eventData]);
                if (error) throw error;
            }

            setDialogOpen(false);
            router.refresh();

            const { data } = await supabase.from("upcomingevents").select("*").order("date", { ascending: true });
            if (data) setEvents(data as UpcomingEvent[]);

        } catch (error: any) {
            alert("Error saving event: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    // ← NEW: open form builder for a specific event, loading its existing fields (if any)
    const openFormBuilder = async (event: UpcomingEvent) => {
        setFormEvent(event);
        setFormLoading(true);
        const { data } = await supabase
            .from("event_forms")
            .select("*")
            .eq("event_id", event.id)
            .maybeSingle();
        setFormFields(data?.fields || []);
        setFormLoading(false);
    };

    // ← NEW: field editing helpers
    const addFormField = () => {
        setFormFields([
            ...formFields,
            { id: `field_${Date.now()}`, label: "", type: "text", required: false },
        ]);
    };
    const updateFormField = (index: number, patch: Partial<FormField>) => {
        setFormFields(formFields.map((f, i) => (i === index ? { ...f, ...patch } : f)));
    };
    const removeFormField = (index: number) => {
        setFormFields(formFields.filter((_, i) => i !== index));
    };

    // ← NEW: save the form config for this event (upsert)
    const saveFormFields = async () => {
        if (!formEvent) return;
        setFormLoading(true);

        const { data: existing } = await supabase
            .from("event_forms")
            .select("id")
            .eq("event_id", formEvent.id)
            .maybeSingle();

        if (existing) {
            const { error } = await supabase
                .from("event_forms")
                .update({ fields: formFields, updated_at: new Date().toISOString() })
                .eq("id", existing.id);
            if (error) { alert(error.message); setFormLoading(false); return; }
        } else {
            const { error } = await supabase
                .from("event_forms")
                .insert([{ event_id: formEvent.id, fields: formFields }]);
            if (error) { alert(error.message); setFormLoading(false); return; }
        }

        setFormLoading(false);
        alert("✅ Registration form saved");
    };

    // ← NEW: open registrations viewer for a specific event
    const openRegistrations = async (event: UpcomingEvent) => {
        setRegEvent(event);
        const { data } = await supabase
            .from("event_registrations")
            .select("*")
            .eq("event_id", event.id)
            .order("created_at", { ascending: false });

        const rows = data || [];
        setRegRows(rows);
        const keys = new Set<string>();
        rows.forEach((r) => Object.keys(r.form_data || {}).forEach((k) => keys.add(k)));
        setRegColumns(Array.from(keys));
    };

    // ← NEW: CSV export for the open registrations modal
    const exportRegistrationsCSV = () => {
        if (!regEvent) return;
        const header = ["Submitted At", ...regColumns];
        const lines = regRows.map((r) => [
            new Date(r.created_at).toLocaleString(),
            ...regColumns.map((c) => JSON.stringify(r.form_data?.[c] ?? "")),
        ]);
        const csv = [header, ...lines].map((row) => row.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `registrations_${regEvent.name.replace(/\s+/g, "_")}.csv`;
        a.click();
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
                                        {/* ← NEW: Configure registration form */}
                                        <button
                                            onClick={() => openFormBuilder(event)}
                                            title="Configure registration form"
                                            className="rounded p-2 text-purple-400 hover:bg-purple-400/10 transition-colors"
                                        >
                                            <ClipboardList className="h-4 w-4" />
                                        </button>
                                        {/* ← NEW: View registrations */}
                                        <button
                                            onClick={() => openRegistrations(event)}
                                            title="View registrations"
                                            className="rounded p-2 text-green-400 hover:bg-green-400/10 transition-colors"
                                        >
                                            <Users className="h-4 w-4" />
                                        </button>
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

            {/* Create/Edit Event Dialog — unchanged */}
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

            {/* ← NEW: Form Builder Dialog */}
            {formEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-2xl rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                Registration Form — {formEvent.name}
                            </h3>
                            <button
                                onClick={() => setFormEvent(null)}
                                className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formFields.map((field, i) => (
                                <div key={field.id} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <input
                                            placeholder="Field label (e.g. Full Name)"
                                            className="flex-1 min-w-[140px] rounded bg-white/5 border border-white/10 px-3 py-1.5 text-white text-sm"
                                            value={field.label}
                                            onChange={(e) => updateFormField(i, { label: e.target.value })}
                                        />
                                        <select
                                            className="rounded bg-white/5 border border-white/10 px-2 py-1.5 text-white text-sm"
                                            value={field.type}
                                            onChange={(e) => updateFormField(i, { type: e.target.value as FieldType })}
                                        >
                                            <option value="text">Text</option>
                                            <option value="email">Email</option>
                                            <option value="number">Number</option>
                                            <option value="phone">Phone</option>
                                            <option value="textarea">Textarea</option>
                                            <option value="select">Dropdown</option>
                                            <option value="checkbox">Checkbox</option>
                                        </select>
                                        <label className="flex items-center gap-1 text-xs text-gray-400">
                                            <input
                                                type="checkbox"
                                                checked={field.required}
                                                onChange={(e) => updateFormField(i, { required: e.target.checked })}
                                            />
                                            Required
                                        </label>
                                        <button onClick={() => removeFormField(i)} className="text-red-400 hover:bg-red-400/10 p-1 rounded">
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>

                                    {field.type === "select" && (
                                        <input
                                            placeholder="Options, comma separated (e.g. CSE, ECE, EEE)"
                                            className="w-full rounded bg-white/5 border border-white/10 px-3 py-1.5 text-white text-sm"
                                            value={field.options?.join(", ") || ""}
                                            onChange={(e) =>
                                                updateFormField(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                                            }
                                        />
                                    )}
                                </div>
                            ))}
                            {formFields.length === 0 && (
                                <p className="text-sm text-gray-500">No fields yet — click "Add Field" to build this event's registration form.</p>
                            )}
                        </div>

                        <div className="flex justify-between items-center pt-4 mt-4 border-t border-white/10">
                            <button
                                onClick={addFormField}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5"
                            >
                                <Plus className="h-4 w-4" /> Add Field
                            </button>
                            <button
                                onClick={saveFormFields}
                                disabled={formLoading}
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
                            >
                                {formLoading ? "Saving..." : "Save Form"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ← NEW: Registrations Viewer Dialog */}
            {regEvent && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-4xl rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white">
                                Registrations — {regEvent.name} ({regRows.length})
                            </h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={exportRegistrationsCSV}
                                    className="rounded-lg bg-purple-600 px-3 py-1.5 text-sm text-white hover:bg-purple-500"
                                >
                                    Export CSV
                                </button>
                                <button
                                    onClick={() => setRegEvent(null)}
                                    className="rounded-full p-1 text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
                                >
                                    <X className="h-5 w-5" />
                                </button>
                            </div>
                        </div>

                        <div className="overflow-x-auto rounded-lg border border-white/10">
                            <table className="w-full text-sm text-left text-gray-300">
                                <thead className="bg-white/10 text-xs uppercase">
                                    <tr>
                                        <th className="px-4 py-2">Submitted</th>
                                        {regColumns.map((c) => <th key={c} className="px-4 py-2">{c}</th>)}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {regRows.map((r) => (
                                        <tr key={r.id}>
                                            <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                                            {regColumns.map((c) => <td key={c} className="px-4 py-2">{String(r.form_data?.[c] ?? "")}</td>)}
                                        </tr>
                                    ))}
                                    {regRows.length === 0 && (
                                        <tr>
                                            <td colSpan={regColumns.length + 1} className="px-4 py-8 text-center text-gray-400">
                                                No registrations yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
