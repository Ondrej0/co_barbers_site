import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

interface BarberProfilePageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function BarberProfilePage({
                                                    params,
                                                }: BarberProfilePageProps) {
    const { slug } = await params;

    const supabase = await createClient();

    const { data: barber, error } = await supabase
        .from("barbers")
        .select("*")
        .eq("slug", slug)
        .single();

    if (error || !barber) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-white text-neutral-950">
            <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-2 lg:items-center">
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-neutral-100 shadow-sm">
                    <Image
                        alt={`${barber.name}, ${barber.role}`}
                        src={barber.image_url}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                        North & Co
                    </p>

                    <h1 className="mt-3 text-5xl font-bold tracking-tight md:text-6xl">
                        {barber.name}
                    </h1>

                    <p className="mt-4 text-xl font-medium text-neutral-600">
                        {barber.role}
                    </p>

                    <div className="mt-10 grid gap-4 border-y border-neutral-200 py-6 sm:grid-cols-2">
                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                                Experience
                            </p>

                            <p className="mt-2 text-lg font-semibold">
                                {barber.experience_years} years
                            </p>
                        </div>

                        <div>
                            <p className="text-sm uppercase tracking-[0.18em] text-neutral-500">
                                Status
                            </p>

                            <p className="mt-2 text-lg font-semibold">
                                Available for bookings
                            </p>
                        </div>
                    </div>

                    <p className="mt-8 max-w-xl text-lg leading-8 text-neutral-600">
                        {barber.bio}
                    </p>

                    <div className="mt-10 flex flex-wrap gap-4">
                        <Link
                            href="/book"
                            className="rounded-full bg-neutral-950 px-6 py-3 font-semibold text-white transition hover:bg-neutral-800"
                        >
                            Book with {barber.name.split(" ")[0]}
                        </Link>

                        <Link
                            href="/barbers"
                            className="rounded-full border border-neutral-300 px-6 py-3 font-semibold transition hover:bg-neutral-100"
                        >
                            Back to Barbers
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}