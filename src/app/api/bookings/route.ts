import { createAdminClient } from "@/utils/supabase/admin";
import { createClient as createPublicClient } from "@/utils/supabase/server";

type BookingPayload = {
    serviceId?: unknown;
    barberId?: unknown;
    appointmentDate?: unknown;
    startTime?: unknown;
    customerName?: unknown;
    customerEmail?: unknown;
    customerPhone?: unknown;
    notes?: unknown;
};

function timeToMinutes(time: string) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}

function isNonEmptyString(value: unknown): value is string {
    return typeof value === "string" && value.trim().length > 0;
}

export async function POST(request: Request) {
    let payload: BookingPayload;

    try {
        payload = await request.json();
    } catch {
        return Response.json({ error: "Invalid booking data." }, { status: 400 });
    }

    const {
        serviceId,
        barberId,
        appointmentDate,
        startTime,
        customerName,
        customerEmail,
        customerPhone,
        notes,
    } = payload;

    if (
        !isNonEmptyString(serviceId) ||
        !isNonEmptyString(barberId) ||
        !isNonEmptyString(appointmentDate) ||
        !isNonEmptyString(startTime) ||
        !isNonEmptyString(customerName) ||
        !isNonEmptyString(customerEmail) ||
        !isNonEmptyString(customerPhone)
    ) {
        return Response.json({ error: "Please complete all required fields." }, { status: 400 });
    }

    if (
        !/^\S+@\S+\.\S+$/.test(customerEmail) ||
        !/^\d{4}-\d{2}-\d{2}$/.test(appointmentDate) ||
        !/^([01]\d|2[0-3]):[0-5]\d$/.test(startTime)
    ) {
        return Response.json({ error: "Please enter valid booking details." }, { status: 400 });
    }

    const bookingDate = new Date(`${appointmentDate}T00:00:00Z`);

    if (
        Number.isNaN(bookingDate.getTime()) ||
        bookingDate.toISOString().slice(0, 10) !== appointmentDate ||
        appointmentDate < new Date().toISOString().slice(0, 10)
    ) {
        return Response.json({ error: "Please choose a future date." }, { status: 400 });
    }

    const supabase = createAdminClient();
    const publicSupabase = await createPublicClient();
    const { data: service, error: serviceError } = await supabase
        .from("services")
        .select("duration_mins, active")
        .eq("id", serviceId)
        .maybeSingle();

    if (serviceError || !service || !service.active) {
        return Response.json({ error: "That service is no longer available." }, { status: 400 });
    }

    const { data: workingPeriods, error: availabilityError } = await publicSupabase
        .from("availability")
        .select("start_time, end_time")
        .eq("barber_id", barberId)
        .eq("day_of_week", bookingDate.getUTCDay());

    if (availabilityError || !workingPeriods?.length) {
        return Response.json({ error: "That barber is not available on this date." }, { status: 400 });
    }

    const requestedStart = timeToMinutes(startTime);
    const requestedEnd = requestedStart + service.duration_mins;
    const fitsWorkingHours = workingPeriods.some((period) =>
        requestedStart >= timeToMinutes(period.start_time) &&
        requestedEnd <= timeToMinutes(period.end_time),
    );

    if (!fitsWorkingHours) {
        return Response.json({ error: "That time is no longer available." }, { status: 409 });
    }

    const { data: existingAppointments, error: appointmentsError } = await supabase
        .from("appointments")
        .select(`
            start_time,
            services (
                duration_mins
            )
        `)
        .eq("barber_id", barberId)
        .eq("appointment_date", appointmentDate);

    if (appointmentsError) {
        return Response.json({ error: "We could not confirm availability." }, { status: 500 });
    }

    const overlapsExistingAppointment = (existingAppointments ?? []).some((appointment) => {
        const bookedDuration = appointment.services?.duration_mins;

        if (!bookedDuration) {
            return false;
        }

        const bookedStart = timeToMinutes(appointment.start_time);
        const bookedEnd = bookedStart + bookedDuration;

        return requestedStart < bookedEnd && requestedEnd > bookedStart;
    });

    if (overlapsExistingAppointment) {
        return Response.json({ error: "That time has just been booked. Please choose another." }, { status: 409 });
    }

    const { data: appointment, error: insertError } = await supabase
        .from("appointments")
        .insert({
            service_id: serviceId,
            barber_id: barberId,
            appointment_date: appointmentDate,
            start_time: `${startTime}:00`,
            customer_name: customerName.trim(),
            customer_email: customerEmail.trim(),
            customer_phone: customerPhone.trim(),
            notes: typeof notes === "string" && notes.trim() ? notes.trim() : null,
        })
        .select("id")
        .single();

    if (insertError || !appointment) {
        return Response.json({ error: "We could not create your booking." }, { status: 500 });
    }

    return Response.json({ appointment }, { status: 201 });
}
