"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { Save } from "lucide-react";

export default function SettingsForm({
    initialUrl,
    action,
    label,
    placeholder = "https://forms.gle/..."
}: {
    initialUrl: string,
    action: (formData: FormData) => Promise<void>,
    label: string,
    placeholder?: string
}) {
    const [url, setUrl] = useState(initialUrl);

    return (
        <form action={async (formData) => {
            await action(formData);
            alert("Settings updated successfully!");
        }} className="space-y-4 max-w-md">
            <div>
                <label htmlFor="url" className="block text-sm font-medium text-gray-300">
                    {label}
                </label>
                <input
                    type="url"
                    name="url"
                    id="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-black/20 text-white shadow-sm focus:border-purple-500 focus:ring-purple-500 sm:text-sm p-2 border transition-colors"
                    placeholder={placeholder}
                    required
                />
            </div>
            <SubmitButton />
        </form>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
        >
            {pending ? "Saving..." : <><Save className="mr-2 h-4 w-4" /> Save Settings</>}
        </button>
    );
}
