import { createClient } from "@/utils/supabase/server";
import CoordinatorsClient from "@/components/admin/CoordinatorsClient";

export const dynamic = "force-dynamic";

export default async function AdminCoordinatorsPage() {
    const supabase = await createClient();

    const [
        presRes,
        secRes,
        jointRes,
        headsRes,
        secondRes,
        thirdRes,
        fourthRes
    ] = await Promise.all([
        supabase.from("presidents").select("*").order("id", { ascending: true }),
        supabase.from("secretaries").select("*").order("id", { ascending: true }),
        supabase.from("jointsec").select("*").order("id", { ascending: true }),
        supabase.from("heads").select("*").order("id", { ascending: true }),
        supabase.from("secondyr").select("*").order("id", { ascending: true }),
        supabase.from("thirdyr").select("*").order("id", { ascending: true }),
        supabase.from("fourthyr").select("*").order("id", { ascending: true }),
    ]);

    const data = {
        presidents: presRes.data || [],
        secretaries: secRes.data || [],
        jointsec: jointRes.data || [],
        heads: headsRes.data || [],
        secondyr: secondRes.data || [],
        thirdyr: thirdRes.data || [],
        fourthyr: fourthRes.data || [],
    };

    return <CoordinatorsClient data={data} />;
}
