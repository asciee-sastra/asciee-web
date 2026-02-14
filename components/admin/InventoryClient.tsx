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
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

type InventoryItem = {
    id: number;
    name: string;
    stock?: number;
    path?: string;
};

// Map tableName to label
const TABLES = {
    mcus: { label: "MCUs", bucket: "components/mcus", hasStock: true, hasImage: true },
    sensors: { label: "Sensors", bucket: "components/sensors", hasStock: true, hasImage: true },
    ics: { label: "ICs", bucket: null, hasStock: true, hasImage: false },
    lumps: { label: "Lumps", bucket: null, hasStock: false, hasImage: false, table: "lumped" }, // table name 'lumped'
    misc: { label: "Misc", bucket: null, hasStock: false, hasImage: false, table: "miscellaneous" }, // table name 'miscellaneous'
};

export default function InventoryClient({
    mcus,
    sensors,
    ics,
    lumps,
    misc,
}: {
    mcus: InventoryItem[];
    sensors: InventoryItem[];
    ics: InventoryItem[];
    lumps: InventoryItem[];
    misc: InventoryItem[];
}) {
    const [data, setData] = useState({
        mcus,
        sensors,
        ics,
        lumps,
        misc,
    });
    const [activeTab, setActiveTab] = useState<keyof typeof TABLES>("mcus");
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentItem, setCurrentItem] = useState<Partial<InventoryItem>>({});
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const currentConfig = TABLES[activeTab];
    const currentTable = (currentConfig as any).table || activeTab; // handle custom table names

    const handleOpenCreate = () => {
        setCurrentItem({});
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleOpenEdit = (item: InventoryItem) => {
        setCurrentItem(item);
        setImageFile(null);
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure?")) return;
        setLoading(true);
        const { error } = await supabase.from(currentTable).delete().eq("id", id);
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

            if (currentConfig.hasImage && imageFile && currentConfig.bucket) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                // Bucket for mcus is 'components/mcus' which suggests 'components' bucket and 'mcus' folder? 
                // Or 'components' bucket and prefix?
                // Let's check Mcus.tsx: STORAGE_URL = `${URL}/storage/v1/object/public/components/mcus`;
                // This implies bucket is 'components' and folder is 'mcus'.
                // So upload to 'mcus/filename' in 'components' bucket.
                // Wait, 'bucket' prop in TABLES is 'components/mcus'.
                // I will assume bucket is 'components' and folder is derived.
                const [bucketName, folder] = currentConfig.bucket.split("/");

                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from("components") // Assuming bucket is 'components'
                    .upload(`${folder}/${fileName}`, imageFile);

                if (uploadError) throw uploadError;
                path = uploadData?.path.split("/").pop(); // usually we store just filename if path logic in component reconstructs it
                // Actually Mcus.tsx uses `${STORAGE_URL}/${mcu.path}`.
                // STORAGE_URL ends in 'components/mcus'.
                // So `mcu.path` is just filename.
                // Supabase upload returns `path` as `mcus/filename`.
                // So we need just filename.
                path = fileName;
            }

            const itemData: any = {
                name: currentItem.name,
            };
            if (currentConfig.hasStock) itemData.stock = currentItem.stock ? Number(currentItem.stock) : 0;
            if (currentConfig.hasImage && path) itemData.path = path;

            if (currentItem.id) {
                const { error } = await supabase.from(currentTable).update(itemData).eq("id", currentItem.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from(currentTable).insert([itemData]);
                if (error) throw error;
            }

            setDialogOpen(false);
            router.refresh();
            // Reload logic manually for smoother UX
            const { data: newData } = await supabase.from(currentTable).select("*");
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
                <h2 className="text-2xl font-bold text-white">Inventory</h2>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Item
                </button>
            </div>

            <Tabs
                defaultValue="mcus"
                value={activeTab}
                onValueChange={(val) => setActiveTab(val as any)}
                className="w-full"
            >
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-xl">
                    {Object.entries(TABLES).map(([key, conf]) => (
                        <TabsTrigger
                            key={key}
                            value={key}
                            className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-gray-400 hover:text-white rounded-lg px-4 py-2 transition-all"
                        >
                            {conf.label}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <div className="mt-6 overflow-x-auto rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                    <table className="w-full text-left text-sm text-gray-300">
                        <thead className="bg-white/10 text-xs uppercase text-gray-200">
                            <tr>
                                <th className="px-6 py-3">Name</th>
                                {currentConfig.hasStock && <th className="px-6 py-3">Stock</th>}
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {data[activeTab].map((item) => (
                                <tr key={item.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                                        {currentConfig.hasImage && item.path && (
                                            <div className="w-10 h-10 rounded overflow-hidden relative border border-white/10 bg-black">
                                                <img
                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${currentConfig.bucket}/${item.path}`}
                                                    alt={item.name}
                                                    className="object-contain w-full h-full"
                                                />
                                            </div>
                                        )}
                                        {item.name}
                                    </td>
                                    {currentConfig.hasStock && (
                                        <td className="px-6 py-4">
                                            <span className={item.stock && item.stock > 0 ? "text-green-400" : "text-red-400"}>
                                                {item.stock}
                                            </span>
                                        </td>
                                    )}
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
                            {data[activeTab].length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-400">No items found.</td>
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
                                {currentItem.id ? `Edit ${currentConfig.label}` : `Add ${currentConfig.label}`}
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
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                                    value={currentItem.name || ""}
                                    onChange={(e) => setCurrentItem({ ...currentItem, name: e.target.value })}
                                />
                            </div>

                            {currentConfig.hasStock && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Stock</label>
                                    <input
                                        type="number"
                                        required
                                        className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                                        value={currentItem.stock || 0}
                                        onChange={(e) => setCurrentItem({ ...currentItem, stock: Number(e.target.value) })}
                                    />
                                </div>
                            )}

                            {currentConfig.hasImage && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-1">Image (Optional)</label>
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
                            )}

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
