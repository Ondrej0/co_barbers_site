import { createPublicClient } from "@/utils/supabase/public";

export async function getBarbers() {
    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("barbers")
        .select("*");

    if (error) {
        throw new Error("Failed to load barbers");
    }

    return data ?? [];
}

export async function getBarberBySlug(slug: string) {

    const supabase = createPublicClient();

    const { data, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !data) {
        return null;
    }

    return data;
}