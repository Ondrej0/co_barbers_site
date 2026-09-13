import type { MetadataRoute } from "next";
import { createClient } from "@/utils/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl =
        process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const supabase = await createClient();

    const { data: barbers, error } = await supabase
        .from("barbers")
        .select("slug")
        .eq("active", true);

    if (error) {
        console.error("Failed to load barber slugs for sitemap:", error.message);
    }

    const staticPages: MetadataRoute.Sitemap = [
        {
            url: `${baseUrl}/`,
        },
        {
            url: `${baseUrl}/services`,
        },
        {
            url: `${baseUrl}/barbers`,
        },
        {
            url: `${baseUrl}/gallery`,
        },
        {
            url: `${baseUrl}/about`,
        },
        {
            url: `${baseUrl}/contact`,
        },
        {
            url: `${baseUrl}/book`,
        },
    ];

    const barberPages: MetadataRoute.Sitemap =
        barbers?.map((barber) => ({
            url: `${baseUrl}/barbers/${barber.slug}`,
        })) ?? [];

    return [...staticPages, ...barberPages];
}