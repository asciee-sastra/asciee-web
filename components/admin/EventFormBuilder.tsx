"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Plus, Trash, GripVertical, Save } from "lucide-react";

type FieldType = "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "phone";

type FormField = {
  id: string;
  label: string;
  type: FieldType;
  required: boolean;
  options?: string[];
};

type EventRow = Record<string, any> & { id: string };

// Tries common title-ish column names, falls back to id
function getEventLabel(ev: EventRow): string {
  return ev.name || ev.title || ev.event_name || ev.eventName || `Event ${ev.id.slice(0, 8)}`;
}

export default function EventFormBuilder() {
  const supabase = createClient();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [fields, setFields] = useState<FormField[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.from("upcomingevents").select("*").then(({ data, error }) => {
      if (error) { console.error(error); return; }
      setEvents(data || []);
      if (data && data.length > 0) setSelectedEventId(data[0].id);
    });
  }, []);

  useEffect(() => {
    if (!selectedEventId) return;
    setLoading(true);
    supabase
      .from("event_forms")
      .select("*")
      .eq("event_id", selectedEventId)
      .maybeSingle()
      .then(({ data }) => {
        setFields(data?.fields || []);
        setLoading(false);
      });
  }, [selectedEventId]);

  const addField = () => {
    setFields([
      ...fields,
      { id: `field_${Date.now()}`, label: "", type: "text", required: false },
    ]);
  };

  const updateField = (index: number, patch: Partial<FormField>) => {
    setFields(fields.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  };

  const removeField = (index: number) => {
    setFields(fields.filter((_, i) => i !== index));
  };

  const save = async () => {
    if (!selectedEventId) return;
    setLoading(true);

    const { data: existing } = await supabase
      .from("event_forms")
      .select("id")
      .eq("event_id", selectedEventId)
      .maybeSingle();

    if (existing) {
      const { error } = await supabase
        .from("event_forms")
        .update({ fields, updated_at: new Date().toISOString() })
        .eq("id", existing.id);
      if (error) { alert(error.message); setLoading(false); return; }
    } else {
      const { error } = await supabase
        .from("event_forms")
        .insert([{ event_id: selectedEventId, fields }]);
      if (error) { alert(error.message); setLoading(false); return; }
    }

    setLoading(false);
    alert("✅ Form saved");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Event</label>
        <select
          className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white"
          value={selectedEventId ?? ""}
          onChange={(e) => setSelectedEventId(e.target.value)}
        >
          {events.map((ev) => (
            <option key={ev.id} value={ev.id}>{getEventLabel(ev)}</option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {fields.map((field, i) => (
          <div key={field.id} className="rounded-lg border border-white/10 bg-white/5 p-4 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              <GripVertical className="h-4 w-4 text-gray-500" />
              <input
                placeholder="Field label (e.g. Full Name)"
                className="flex-1 min-w-[140px] rounded bg-white/5 border border-white/10 px-3 py-1.5 text-white text-sm"
                value={field.label}
                onChange={(e) => updateField(i, { label: e.target.value })}
              />
              <select
                className="rounded bg-white/5 border border-white/10 px-2 py-1.5 text-white text-sm"
                value={field.type}
                onChange={(e) => updateField(i, { type: e.target.value as FieldType })}
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
                  onChange={(e) => updateField(i, { required: e.target.checked })}
                />
                Required
              </label>
              <button onClick={() => removeField(i)} className="text-red-400 hover:bg-red-400/10 p-1 rounded">
                <Trash className="h-4 w-4" />
              </button>
            </div>

            {field.type === "select" && (
              <input
                placeholder="Options, comma separated (e.g. CSE, ECE, EEE)"
                className="w-full rounded bg-white/5 border border-white/10 px-3 py-1.5 text-white text-sm"
                value={field.options?.join(", ") || ""}
                onChange={(e) =>
                  updateField(i, { options: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                }
              />
            )}
          </div>
        ))}
        {fields.length === 0 && (
          <p className="text-sm text-gray-500">No fields yet — click "Add Field" to start building this event's registration form.</p>
        )}
      </div>

      <div className="flex gap-3">
        <button onClick={addField} className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5">
          <Plus className="h-4 w-4" /> Add Field
        </button>
        <button onClick={save} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-500 disabled:opacity-50">
          <Save className="h-4 w-4" /> {loading ? "Saving..." : "Save Form"}
        </button>
      </div>
    </div>
  );
}
