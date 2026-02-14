import { createClient } from "@/utils/supabase/server";
import ProjectsClient from "@/components/admin/ProjectsClient";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
    const supabase = await createClient();
    const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .order("id", { ascending: true });

    return <ProjectsClient initialProjects={projects || []} />;
}
