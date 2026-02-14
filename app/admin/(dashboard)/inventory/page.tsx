import { createClient } from "@/utils/supabase/server";
import InventoryClient from "@/components/admin/InventoryClient";

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
    const supabase = await createClient();

    const [mcus, sensors, ics, lumps, misc] = await Promise.all([
        supabase.from("mcus").select("*").order("id", { ascending: true }),
        supabase.from("sensors").select("*").order("id", { ascending: true }),
        supabase.from("ics").select("*").order("id", { ascending: true }),
        supabase.from("lumped").select("*").order("id", { ascending: true }), // Verify table name 'lumped'
        supabase.from("miscellaneous").select("*").order("id", { ascending: true }), // Verify table name 'miscellaneous'
    ]);

    return (
        <InventoryClient
            mcus={mcus.data || []}
            sensors={sensors.data || []}
            ics={ics.data || []}
            lumps={lumps.data || []}
            misc={misc.data || []}
        />
    );
}
