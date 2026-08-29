"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type FormField = {
  id: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select" | "checkbox" | "phone";
  required: boolean;
  options?: string[];
};

export default function EventRegistrationForm({ eventId }: { eventId: string }) {
  const [fields, setFields] = useState<FormField[]>([]);
  const [values, setValues] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("event_forms")
      .select("fields")
      .eq("event_id", eventId)
      .maybeSingle()
      .then(({ data }) => {
        setFields(data?.fields || []);
        setLoading(false);
      });
  }, [eventId]);

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
      .insert([{ event_id: eventId, form_data: values }]);

    if (insertError) {
      setError(insertError.message);
      return;
    }
    setSubmitted(true);
  };

  if (loading) return <p className="text-center text-gray-400">Loading form...</p>;
  if (fields.length === 0) return <p className="text-center text-gray-400">Registration isn't open yet for this event.</p>;
  if (submitted) return <p className="text-center text-green-400 text-lg">✅ Registered successfully!</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-5">
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

      <button type="submit" className="w-full py-3 rounded-lg bg-purple-600 text-white font-semibold hover:bg-purple-500">
        Register
      </button>
    </form>
  );
}
