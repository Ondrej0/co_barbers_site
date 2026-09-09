import Image from "next/image";
import Link from "next/link";

interface BarberCardProps {
    id: string;
    name: string;
    role: string;
    experience: number;
    image: string;
}

export function BarberCard({
                               id,
                               name,
                               role,
                               experience,
                               image,
                           }: BarberCardProps) {
    return (
        <article className="group overflow-hidden bg-neutral-100">
            <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                    src={image}
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
                    {experience} years experience
                </p>

                <Link
                    href={`/barbers/${id}`}
                    className="mt-6 inline-block border-b border-neutral-950 pb-1 text-sm font-semibold transition hover:text-neutral-500"
                >
                    View Profile
                </Link>
            </div>
        </article>
    );
}