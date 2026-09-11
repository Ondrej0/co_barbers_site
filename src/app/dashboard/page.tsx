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
            <header className="border-b border-ink/10 bg-[#eeeee7]">
                <div className="site-container py-8 md:py-10">
                    <p className="eyebrow text-[#795b37]">North & Co. · Staff</p>
                    <div className="mt-4 flex min-w-0 flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                        <div className="min-w-0">
                            <h1 className="section-title">Staff dashboard</h1>
                            <p className="mt-4 text-sm leading-6 text-neutral-600">
                                Logged in as
                                <span className="mt-1 block font-medium text-ink [overflow-wrap:anywhere]">
                                    {user.email}
                                </span>
                            </p>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </header>

            <section aria-labelledby="appointments-heading" className="site-container py-8 md:py-10 lg:pb-16">
                <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                    <h2 id="appointments-heading" className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
                        Upcoming appointments
                    </h2>
                    {appointments && (
                        <p className="text-sm text-neutral-600">
                            <span className="font-semibold tabular-nums text-ink">{appointments.length}</span>
                            {appointments.length === 1 ? " appointment" : " appointments"}
                        </p>
                    )}
                </div>

                {error && (
                    <p role="alert" className="error-notice mb-6">
                        Appointments could not be loaded. Please try again later.
                    </p>
                )}

                {appointments?.length === 0 && (
                    <div className="rounded-xl border border-ink/15 bg-white px-6 py-10 text-center sm:px-8">
                        <p className="font-serif text-2xl text-ink">No upcoming appointments.</p>
                        <p className="mt-3 text-sm leading-6 text-neutral-600">
                            Your schedule is clear. New appointments will appear here.
                        </p>
                    </div>
                )}

                <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {appointments?.map((appointment) => (
                        <article key={appointment.id} className="surface-card min-w-0 p-5 hover:translate-y-0 sm:p-6">
                            <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-ink/10 pb-4">
                                <time dateTime={appointment.appointment_date} className="text-sm font-semibold text-[#795b37]">
                                    {new Intl.DateTimeFormat("en-GB", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                        timeZone: "UTC",
                                    }).format(new Date(`${appointment.appointment_date}T00:00:00Z`))}
                                </time>
                                <time dateTime={appointment.start_time} className="text-2xl font-semibold tracking-tight text-ink tabular-nums">
                                    {appointment.start_time.slice(0, 5)}
                                </time>
                            </div>

                            <h3 className="mt-5 text-lg font-semibold leading-7 tracking-tight text-ink [overflow-wrap:anywhere]">
                                {appointment.customer_name}
                            </h3>
                            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-4 text-sm leading-6">
                                <div className="min-w-0">
                                    <dt className="text-neutral-500">Service</dt>
                                    <dd className="mt-1 font-medium text-ink [overflow-wrap:anywhere]">
                                        {appointment.services?.name || "Not specified"}
                                    </dd>
                                </div>
                                <div className="min-w-0">
                                    <dt className="text-neutral-500">Barber</dt>
                                    <dd className="mt-1 font-medium text-ink [overflow-wrap:anywhere]">
                                        {appointment.barbers?.name || "Not specified"}
                                    </dd>
                                </div>
                                <div className="col-span-2 min-w-0">
                                    <dt className="text-neutral-500">Email</dt>
                                    <dd className="mt-1 text-ink [overflow-wrap:anywhere]">
                                        {appointment.customer_email}
                                    </dd>
                                </div>
                                <div className="col-span-2 flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-ink/10 pt-4">
                                    <dt className="text-neutral-500">Status</dt>
                                    <dd className="min-w-0 max-w-full rounded-full border border-brass/40 bg-brass/15 px-3 py-1 text-xs font-semibold leading-5 text-[#795b37] [overflow-wrap:anywhere]">
                                        {appointment.status}
                                    </dd>
                                </div>
                            </dl>
                        </article>
                    ))}
                </div>
            </section>
        </>
    );
}
