import { createPublicClient } from "@/utils/supabase/public";

export async function getAvailability() {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("availability")
        .select("*");

    if (error) {
        throw new Error("Failed to load availability");
    }

    return data ?? [];
}