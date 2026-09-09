import { BarberCard } from "@/components/BarberCard";
import { createClient } from "@/utils/supabase/server";

export default async function Barbers() {
    const supabase = await createClient();

    const { data: barbers, error } = await supabase
        .from("barbers")
        .select("*");

    if (error) {
        console.error("Supabase error:", error);
        throw new Error(error.message);
    }

    return (
        <>
            <section className="bg-white py-20 text-neutral-950">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                        North & Co
                    </p>

                    <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-6xl">
                        Meet the Barbers
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                        Meet the people behind the chair. Experienced barbers,
                        sharp attention to detail, and a style for every client.
                    </p>
                </div>
            </section>

            <section className="bg-white pb-24 text-neutral-950">
                <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-2 lg:grid-cols-3">
                    {barbers.map((barber) => (
                        <BarberCard
                            key={barber.id}
                            slug={barber.slug}
                            name={barber.name}
                            role={barber.role}
                            experienceYears={barber.experience_years}
                            imageUrl={barber.image_url}
                        />
                    ))}
                </div>
            </section>
        </>
    );
}