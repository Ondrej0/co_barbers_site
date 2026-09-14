import { createPublicClient } from "@/utils/supabase/public";

export async function getServices() {

    const supabase = createPublicClient();

    const { data, error } = await supabase.from("services").select("*")

    if (error) {
        throw new Error("Failed to load services");
    }

    return data ?? [];
}