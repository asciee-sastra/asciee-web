import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import SettingsForm from "./settings-form";

export default async function SettingsPage() {
    const supabase = await createClient();
    let currentFeedbackUrl = "";
    let currentOrderUrl = "";

    try {
        const { data: links, error } = await supabase
            .from("links")
            .select("name, link")
            .in("name", ["feedback", "order"]);

        if (links) {
            const feedbackLink = links.find((l) => l.name === "feedback");
            if (feedbackLink) currentFeedbackUrl = feedbackLink.link;

            const orderLink = links.find((l) => l.name === "order");
            if (orderLink) currentOrderUrl = orderLink.link;
        }
    } catch (error) {
        console.error("Error fetching settings:", error);
    }

    async function updateLink(name: string, url: string) {
        "use server";
        const supabase = await createClient();
        const { data: existing } = await supabase
            .from("links")
            .select("id")
            .eq("name", name)
            .maybeSingle();

        let error;
        if (existing) {
            const result = await supabase
                .from("links")
                .update({ link: url })
                .eq("id", existing.id);
            error = result.error;
        } else {
            const result = await supabase
                .from("links")
                .insert({ name: name, link: url });
            error = result.error;
        }

        if (error) {
            console.error(`Error updating ${name}:`, error);
            throw new Error(`Failed to update ${name}`);
        }

        revalidatePath("/admin/settings");
        revalidatePath("/");
        revalidatePath("/inventory");
    }

    async function updateFeedbackSettings(formData: FormData) {
        "use server";
        const url = formData.get("url") as string;
        await updateLink("feedback", url);
    }

    async function updateOrderSettings(formData: FormData) {
        "use server";
        const url = formData.get("url") as string;
        await updateLink("order", url);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-white">Settings</h1>
                <p className="text-gray-400">Manage global site settings.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold text-white mb-4">Feedback Form</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Update the Feedback Form URL linked in the navigation bar.
                    </p>
                    <SettingsForm
                        initialUrl={currentFeedbackUrl}
                        action={updateFeedbackSettings}
                        label="Feedback Form URL"
                    />
                </div>

                <div className="bg-white/5 p-6 rounded-lg border border-white/10 backdrop-blur-sm">
                    <h2 className="text-xl font-semibold text-white mb-4">Order Form</h2>
                    <p className="text-sm text-gray-400 mb-4">
                        Update the Order Form URL linked on the inventory page.
                    </p>
                    <SettingsForm
                        initialUrl={currentOrderUrl}
                        action={updateOrderSettings}
                        label="Order Form URL"
                    />
                </div>
            </div>
        </div>
    );
}
