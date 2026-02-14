import { createClient } from "@/utils/supabase/server";
import UpcomingEventsClient from "@/components/admin/UpcomingEventsClient";

export const dynamic = "force-dynamic";

export default async function AdminUpcomingEventsPage() {
    const supabase = await createClient();
    const { data: events } = await supabase
        .from("upcomingevents")
        .select("*")
        .order("date", { ascending: true });

    return <UpcomingEventsClient initialEvents={events || []} />;
}
