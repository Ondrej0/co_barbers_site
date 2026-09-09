import Image from "next/image";
import Link from "next/link";

interface BarberCardProps {
    slug: string;
    name: string;
    role: string;
    experienceYears: number;
    imageUrl: string;
}

export function BarberCard({
                               slug,
                               name,
                               role,
                               experienceYears,
                               imageUrl,
                           }: BarberCardProps) {
    return (
        <article className="group overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100">
                <Image
                    src={imageUrl}
                    alt={`${name}, ${role}`}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                />
            </div>

            <div className="p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    {role}
                </p>

                <h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">
                    {name}
                </h2>

                <p className="mt-2 text-sm text-neutral-600">
                    {experienceYears} years experience
                </p>

                <Link
                    href={`/barbers/${slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-neutral-950 transition hover:text-neutral-500"
                >
                    View Profile
                    <span aria-hidden="true">→</span>
                </Link>
            </div>
        </article>
    );
}