"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import {
    Edit,
    Loader2,
    Plus,
    Trash,
    X,
} from "lucide-react";
import { useRouter } from "next/navigation";

type Project = {
    id: number;
    title: string;
    description: string;
    tags: string[];
    status: boolean; // true = Ongoing, false = Completed
};

export default function ProjectsClient({ initialProjects }: { initialProjects: Project[] }) {
    const [projects, setProjects] = useState<Project[]>(initialProjects);
    const [loading, setLoading] = useState(false);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentProject, setCurrentProject] = useState<Partial<Project>>({});
    const [tagsInput, setTagsInput] = useState("");
    const router = useRouter();
    const supabase = createClient();

    const resetForm = () => {
        setCurrentProject({ status: true }); // Default to ongoing
        setTagsInput("");
        setLoading(false);
        setDialogOpen(false);
    };

    const handleOpenCreate = () => {
        resetForm();
        setDialogOpen(true);
    };

    const handleOpenEdit = (project: Project) => {
        setCurrentProject(project);
        setTagsInput(project.tags ? project.tags.join(", ") : "");
        setDialogOpen(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this project?")) return;

        setLoading(true);
        const { error } = await supabase.from("projects").delete().eq("id", id);
        if (error) {
            alert("Error deleting project: " + error.message);
        } else {
            setProjects(projects.filter((p) => p.id !== id));
            router.refresh();
        }
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const tagsArray = tagsInput.split(",").map((t) => t.trim()).filter((t) => t !== "");

            const projectData = {
                title: currentProject.title,
                description: currentProject.description,
                tags: tagsArray,
                status: currentProject.status,
            };

            if (currentProject.id) {
                const { error } = await supabase
                    .from("projects")
                    .update(projectData)
                    .eq("id", currentProject.id);
                if (error) throw error;
            } else {
                const { error } = await supabase.from("projects").insert([projectData]);
                if (error) throw error;
            }

            setDialogOpen(false);
            router.refresh();
            // Optimistic update or refetch
            const { data } = await supabase.from("projects").select("*").order("id", { ascending: true });
            if (data) setProjects(data);

        } catch (error: any) {
            alert("Error saving project: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Projects Management</h2>
                <button
                    onClick={handleOpenCreate}
                    className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2 text-white hover:bg-purple-500 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Project
                </button>
            </div>

            <div className="overflow-x-auto rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
                <table className="w-full text-left text-sm text-gray-300">
                    <thead className="bg-white/10 text-xs uppercase text-gray-200">
                        <tr>
                            <th className="px-6 py-3">Title</th>
                            <th className="px-6 py-3">Status</th>
                            <th className="px-6 py-3">Description</th>
                            <th className="px-6 py-3">Tags</th>
                            <th className="px-6 py-3 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/10">
                        {projects.map((project) => (
                            <tr key={project.id} className="hover:bg-white/5 transition-colors">
                                <td className="px-6 py-4 font-medium text-white max-w-[200px] truncate" title={project.title}>
                                    {project.title}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${project.status ? "bg-green-500/20 text-green-300 border border-green-500/30" : "bg-blue-500/20 text-blue-300 border border-blue-500/30"}`}>
                                        {project.status ? "Ongoing" : "Completed"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 max-w-[300px] truncate" title={project.description}>
                                    {project.description}
                                </td>
                                <td className="px-6 py-4 max-w-[200px] truncate">
                                    {project.tags?.join(", ")}
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button
                                            onClick={() => handleOpenEdit(project)}
                                            className="rounded p-2 text-blue-400 hover:bg-blue-400/10 transition-colors"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(project.id)}
                                            className="rounded p-2 text-red-400 hover:bg-red-400/10 transition-colors"
                                        >
                                            <Trash className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                                    No projects found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Dialog */}
            {dialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-2xl bg-[#0a0a0a] border border-white/10 p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-bold text-white">
                                {currentProject.id ? "Edit Project" : "Create Project"}
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
                                    value={currentProject.title || ""}
                                    onChange={(e) =>
                                        setCurrentProject({ ...currentProject, title: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Status
                                </label>
                                <select
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none"
                                    value={currentProject.status ? "ongoing" : "completed"}
                                    onChange={(e) =>
                                        setCurrentProject({ ...currentProject, status: e.target.value === "ongoing" })
                                    }
                                >
                                    <option value="ongoing" className="bg-black">Ongoing</option>
                                    <option value="completed" className="bg-black">Completed</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea
                                    rows={4}
                                    required
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    value={currentProject.description || ""}
                                    onChange={(e) =>
                                        setCurrentProject({ ...currentProject, description: e.target.value })
                                    }
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">
                                    Tags (comma separated)
                                </label>
                                <input
                                    type="text"
                                    className="w-full rounded-lg bg-white/5 border border-white/10 px-4 py-2 text-white focus:border-purple-500 focus:outline-none placeholder-gray-500"
                                    placeholder="React, Next.js, Node.js"
                                    value={tagsInput}
                                    onChange={(e) => setTagsInput(e.target.value)}
                                />
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
                                    disabled={loading}
                                    className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-500 transition-colors disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Project"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
