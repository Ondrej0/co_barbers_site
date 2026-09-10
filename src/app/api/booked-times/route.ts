import { NextRequest } from "next/server";
import { createAdminClient } from "@/utils/supabase/admin";

export async function GET(request: NextRequest) {
    const barberId = request.nextUrl.searchParams.get("barberId");
    const date = request.nextUrl.searchParams.get("date");

    if (!barberId || !date) {
        return Response.json(
            { error: "barberId and date are required" },
            { status: 400 },
        );
    }

    const supabase = createAdminClient();

    const { data: appointments, error } = await supabase
        .from("appointments")
        .select(`
      start_time,
      services (
        duration_mins
      )
    `)
        .eq("barber_id", barberId)
        .eq("appointment_date", date);

    if (error) {
        return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ appointments: appointments ?? [] });
}