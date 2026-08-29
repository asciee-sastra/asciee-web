"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

export default function EventRegistrationsView({ eventId }: { eventId: string }) {
  const supabase = createClient();
  const [rows, setRows] = useState<any[]>([]);
  const [columns, setColumns] = useState<string[]>([]);

  useEffect(() => {
    supabase
      .from("event_registrations")
      .select("*")
      .eq("event_id", eventId)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setRows(data || []);
        const keys = new Set<string>();
        (data || []).forEach((r) => Object.keys(r.form_data || {}).forEach((k) => keys.add(k)));
        setColumns(Array.from(keys));
      });
  }, [eventId]);

  const exportCSV = () => {
    const header = ["Submitted At", ...columns];
    const lines = rows.map((r) => [
      new Date(r.created_at).toLocaleString(),
      ...columns.map((c) => JSON.stringify(r.form_data?.[c] ?? "")),
    ]);
    const csv = [header, ...lines].map((row) => row.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `registrations_${eventId}.csv`;
    a.click();
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">{rows.length} registrations</h3>
        <button onClick={exportCSV} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500">
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-white/10">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="bg-white/10 text-xs uppercase">
            <tr>
              <th className="px-4 py-2">Submitted</th>
              {columns.map((c) => <th key={c} className="px-4 py-2">{c}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((r) => (
              <tr key={r.id}>
                <td className="px-4 py-2">{new Date(r.created_at).toLocaleString()}</td>
                {columns.map((c) => <td key={c} className="px-4 py-2">{String(r.form_data?.[c] ?? "")}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
