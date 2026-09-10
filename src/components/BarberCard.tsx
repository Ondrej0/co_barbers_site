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
    <article className="surface-card group h-full overflow-hidden">
      <Link
        href={`/barbers/${slug}`}
        className="block rounded-xl focus-visible:outline-offset-[-5px]"
        aria-label={`View ${name}'s profile`}
      >
        <div className="relative aspect-[4/5] overflow-hidden bg-neutral-200">
          <Image
            src={imageUrl}
            alt={`${name}, ${role}`}
            fill
            sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
            className="image-zoom"
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
            aria-hidden="true"
          />
          <span className="absolute bottom-5 left-5 rounded border border-white/30 bg-ink/65 px-3 py-2 text-xs text-white backdrop-blur-sm">
            {experienceYears} years of experience
          </span>
        </div>
        <div className="p-6">
          <p className="eyebrow text-[#795b37]">{role}</p>
          <div className="mt-3 flex items-center justify-between gap-4">
            <h2 className="font-serif text-3xl tracking-tight text-ink">
              {name}
            </h2>
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-ink/20 text-ink transition group-hover:border-brass group-hover:bg-brass"
              aria-hidden="true"
            >
              ↗
            </span>
          </div>
          <p className="mt-3 text-sm text-neutral-500">Meet your barber</p>
        </div>
      </Link>
    </article>
  );
}
