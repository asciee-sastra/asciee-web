import { createClient } from "@/utils/supabase/server";
import EventsClient from "@/components/admin/EventsClient";

export const dynamic = "force-dynamic";

export default async function AdminEventsPage() {
    const supabase = await createClient();
    const { data: events } = await supabase
        .from("events-1")
        .select("*")
        .order("date", { ascending: false });

    return <EventsClient initialEvents={events || []} />;
}
