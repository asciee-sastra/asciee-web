import {
    CalendarDays,
    LayoutDashboard,
    LogOut,
    Package,
    Settings,
    Users,
    FolderOpen
} from "lucide-react";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/admin/login");
    }

    const {
        data: { session },
    } = await supabase.auth.getSession();

    const handleSignOut = async () => {
        "use server";
        const supabase = await createClient();
        await supabase.auth.signOut();
        redirect("/admin/login");
    };

    return (
        <div className="flex min-h-screen text-white">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-white/10  backdrop-blur-md transition-transform sm:translate-x-0">
                <div className="flex h-full flex-col px-3 py-4">
                    <Link
                        href="/admin"
                        className="flex items-center pl-2.5 mb-5 space-x-2"
                    >
                        <span className="self-center whitespace-nowrap text-xl font-semibold text-white">
                            ASCIEE Admin
                        </span>
                    </Link>
                    <ul className="space-y-2 font-medium">
                        <li>
                            <Link
                                href="/admin"
                                className="flex items-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white group"
                            >
                                <LayoutDashboard className="h-5 w-5 text-gray-400 group-hover:text-white" />
                                <span className="ml-3">Dashboard</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/events"
                                className="flex items-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white group"
                            >
                                <CalendarDays className="h-5 w-5 text-gray-400 group-hover:text-white" />
                                <span className="ml-3">Events</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/upcoming-events"
                                className="flex items-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white group"
                            >
                                <CalendarDays className="h-5 w-5 text-gray-400 group-hover:text-white" />
                                <span className="ml-3">Upcoming Events</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/projects"
                                className="flex items-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white group"
                            >
                                <FolderOpen className="h-5 w-5 text-gray-400 group-hover:text-white" />
                                <span className="ml-3">Projects</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/inventory"
                                className="flex items-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white group"
                            >
                                <Package className="h-5 w-5 text-gray-400 group-hover:text-white" />
                                <span className="ml-3">Inventory</span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/admin/coordinators"
                                className="flex items-center rounded-lg p-2 text-gray-300 hover:bg-white/10 hover:text-white group"
                            >
                                <Users className="h-5 w-5 text-gray-400 group-hover:text-white" />
                                <span className="ml-3">Coordinators</span>
                            </Link>
                        </li>
                    </ul>
                    <div className="border-t border-gray-700 mt-auto pt-4">
                        <form action={handleSignOut}>
                            <button
                                type="submit"
                                className="flex w-full items-center rounded-lg p-2 text-gray-300 hover:bg-red-500/10 hover:text-red-400 group transition-colors"
                            >
                                <LogOut className="h-5 w-5 text-gray-400 group-hover:text-red-400" />
                                <span className="ml-3">Sign Out</span>
                            </button>
                        </form>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 sm:ml-64 bg-cover bg-center bg-fixed bg-no-repeat">
                <div className="mt-14 p-4 lg:ml-0">
                    <div className="backdrop-blur-xl border border-white/5 rounded-2xl min-h-[calc(100vh-6rem)] p-6 shadow-2xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
