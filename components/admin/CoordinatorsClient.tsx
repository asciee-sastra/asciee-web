"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Edit,
    Loader2,
    Plus,
    Trash,
    Upload,
    X,
    User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Coordinator = {
    id: string; // id is string in coordinators.tsx
    name: string;
    role: string;
    path?: string;
};

const GROUPS = {
    presidents: { label: "Presidents", bucket: "fourthyr", table: "presidents" },
    secretaries: { label: "Secretaries", bucket: "thirdyr", table: "secretaries" },
    jointsec: { label: "Joint Sec", bucket: "secondyr", table: "jointsec" },
    heads: { label: "Cluster Heads", bucket: "thirdyr", table: "heads" },
    fourthyr: { label: "4th Year", bucket: "fourthyr", table: "fourthyr" },
    thirdyr: { label: "3rd Year", bucket: "thirdyr", table: "thirdyr" },
    secondyr: { label: "2nd Year", bucket: "secondyr", table: "secondyr" },
};

export default function CoordinatorsClient({ data: initialData }: { data: Record<string, Coordinator[]> }) {
    const [data, setData] = useState(initialData);
    const [activeTab, setActiveTab] = useState<keyof typeof GROUPS>("presidents");
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<Coordinator>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const currentConfig = GROUPS[activeTab];

    const handleOpenCreate = () => {
        setCurrentItem({});
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (item: Coordinator) => {
        setCurrentItem(item);
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        const { error } = await supabase.from(currentConfig.table).delete().eq("id", id);
        if (!error) {
            setData({
                ...data,
                [activeTab]: data[activeTab].filter((i) => i.id !== id),
            });
            router.refresh();
        } else {
            alert(error.message);
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let path = currentItem.path;

            if (imageFile) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from(currentConfig.bucket)
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;
                path = fileName; // We store just filename usually based on code exploration
            }

            const itemData: any = {
                name: currentItem.name,
                role: currentItem.role,
            };
            if (path) itemData.path = path;

            if (currentItem.id) {
                const { error } = await supabase.from(currentConfig.table).update(itemData).eq("id", currentItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(currentConfig.table).insert([itemData]);
                if (error) throw error;
            }

            setDialogOpen(false);
            router.refresh();
            // Reload current tab data
            const { data: newData } = await supabase.from(currentConfig.table).select("*").order("id", { ascending: true });
            if (newData) setData({ ...data, [activeTab]: newData });

        } catch (error: any) {
            alert("Error: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Coordinators</h2>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Member
                </button>
            </div>

            <Tabs
                defaultValue="presidents"
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="w-full"
            >
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl flex-wrap h-auto justify-start gap-1">
                    {Object.entries(GROUPS).map(([key, conf]) => (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white rounded-lg px-3 py-1.5 text-xs sm:text-sm transition-all whitespace-nowrap"
                        >
                            {conf.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/10 text-xs uppercase text-gray-200">
                            <tr>
                                <th className="px-6 py-3">Member</th>
                                <th className="px-6 py-3">Role</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {data[activeTab]?.map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full overflow-hidden relative border border-white/10 bg-gray-800 flex items-center justify-center">
                                            {item.path ? (
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${currentConfig.bucket}/${item.path}`}
                                                    alt={item.name}
                                                    className="object-cover w-full h-full"
                                                />
                                            ) : (
                                                <User className="h-5 w-5 text-gray-400" />
                                            )}
                                        </div>
                                        {item.name}
                                    </td>
                                    <td className="px-6 py-4 text-gray-300">{item.role}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button onClick={() => handleOpenEdit(item)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded">
                                                <Edit className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => handleDelete(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded">
                                                <Trash className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!data[activeTab] || data[activeTab].length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-gray-400">No members found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Tabs>

            {/* Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-md rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {currentItem.id ? `Edit Member` : `Add Member`}
                            </h3>
                            <button onClick={() => setDialogOpen(false)} className="text-gray-400 hover:text-white">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentItem.name || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentItem.role || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, role: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Photo (Optional)</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-500"
                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                />
                                {currentItem.path && !imageFile && (
                                    <div className="mt-2 text-xs text-gray-500">Current: {currentItem.path}</div>
                                )}
                            </div>

                            <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
                                <button type="button" onClick={() => setDialogOpen(false)} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
                                <button type="submit" disabled={loading} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-500 disabled:opacity-50">
                                    {loading ? "Saving..." : "Save"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
