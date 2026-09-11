import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
    const supabase = await createClient();

    const {
        data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const today = new Date().toISOString().split("T")[0];

    const { data: appointments, error } = await supabase
        .from("appointments")
        .select(`
            *,
            barbers (
                name
            ),
            services (
                name
            )
        `)
        .gte("appointment_date", today)
        .order("appointment_date", { ascending: true })
        .order("start_time", { ascending: true });

    if (error) {
        console.error("Failed to load appointments:", error);
    }

    console.log(JSON.stringify(appointments, null, 2));

    return (
        <>
            <h1>Dashboard</h1>

            <p>Logged in as: {user.email}</p>

            <LogoutButton />

            <h2>Upcoming appointments</h2>

            {appointments?.length === 0 && (
                <p>No upcoming appointments.</p>
            )}

            {appointments?.map((appointment) => (
                <div key={appointment.id}>
                    <h3>{appointment.customer_name}</h3>

                    <p>
                        {appointment.appointment_date} at {appointment.start_time}
                    </p>

                    <p>
                        Barber: {appointment.barbers?.name}
                    </p>

                    <p>
                        Service: {appointment.services?.name}
                    </p>

                    <p>
                        Email: {appointment.customer_email}
                    </p>

                    <p>
                        Status: {appointment.status}
                    </p>
                </div>
            ))}
        </>
    );
}