import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";

export default async function Home() {
    const supabase = await createClient();

    const [
        { data: services, error: servicesError },
        { data: barbers, error: barbersError },
    ] = await Promise.all([
        supabase.from("services").select("*"),
        supabase.from("barbers").select("*"),
    ]);

    if (servicesError || barbersError) {
        throw new Error("There has been an error");
    }

    return (
        <>
            <section className="relative overflow-hidden bg-neutral-950 text-white">
                <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
                    <div>
                        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                            Gloucester Barbers
                        </p>

                        <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
                            North & Co Barbers
                        </h1>

                        <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-300">
                            Sharp cuts, clean fades, and a relaxed barbershop experience.
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/book"
                                className="inline-block bg-white px-6 py-3 font-semibold text-black transition hover:bg-neutral-200"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>

                    <div className="relative">
                        <Image
                            src="/barber-hero.jpg"
                            alt="Barber cutting a customer's hair"
                            width={1200}
                            height={800}
                            className="h-[420px] w-full rounded-2xl object-cover shadow-2xl md:h-[520px]"
                            priority
                        />
                    </div>
                </div>
            </section>

            <section className="bg-white py-20 text-neutral-950">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                            Our Services
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight">
                            Cuts and grooming, done properly.
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {services.map((service) => {
                            const price = (service.price_pence / 100).toLocaleString("en-GB", {
                                style: "currency",
                                currency: "GBP",
                            });

                            return (
                                <div
                                    key={service.id}
                                    className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm"
                                >
                                    <h3 className="text-xl font-semibold">
                                        {service.name}
                                    </h3>

                                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                                        {service.description}
                                    </p>

                                    <p className="mt-6 text-3xl font-bold">
                                        {price}
                                    </p>

                                    <p className="mt-2 text-sm text-neutral-500">
                                        {service.duration_mins} mins
                                    </p>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-10">
                        <Link
                            href="/services"
                            className="inline-block border-b border-neutral-950 pb-1 font-semibold"
                        >
                            View All Services
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-neutral-950 py-20 text-white">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="max-w-2xl">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                            Meet the Team
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight">
                            Experienced barbers. No rushed cuts.
                        </h2>
                    </div>

                    <div className="mt-10 grid gap-6 md:grid-cols-3">
                        {barbers.map((barber) => (
                            <div key={barber.id}>
                                <Image
                                    src={barber.image_url}
                                    alt={`${barber.name}, ${barber.role}`}
                                    width={600}
                                    height={800}
                                    className="h-[420px] w-full rounded-2xl object-cover shadow-xl"
                                />

                                <h3 className="mt-5 text-xl font-semibold">
                                    {barber.name}
                                </h3>

                                <p className="mt-1 text-sm text-neutral-400">
                                    {barber.role}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10">
                        <Link
                            href="/barbers"
                            className="inline-block border-b border-white pb-1 font-semibold"
                        >
                            Meet All Barbers
                        </Link>
                    </div>
                </div>
            </section>

            <section className="bg-white py-20 text-neutral-950">
                <div className="mx-auto max-w-7xl px-6">
                    <div className="rounded-3xl bg-neutral-100 px-8 py-14 text-center shadow-sm md:px-12 md:py-16">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                            Book Your Visit
                        </p>

                        <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">
                            Ready for a fresh cut?
                        </h2>

                        <p className="mx-auto mt-4 max-w-2xl text-lg leading-8 text-neutral-600">
                            Book your appointment with North & Co today.
                        </p>

                        <div className="mt-8">
                            <Link
                                href="/book"
                                className="inline-block rounded-xl bg-neutral-950 px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
                            >
                                Book Now
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}