import Link from "next/link";

interface ServiceCardProps {
  name: string;
  price_pence: number;
  duration_mins: number;
  description: string;
}

export function ServiceCard({
  name,
  price_pence,
  duration_mins,
  description,
}: ServiceCardProps) {
  const price = (price_pence / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return (
    <article className="surface-card group flex h-full flex-col p-6 sm:p-7">
      <div className="mb-7 flex items-center justify-between gap-4 border-b border-ink/10 pb-5">
        <span className="text-sm text-neutral-500">
          {duration_mins} minutes
        </span>
        <span className="font-serif text-3xl tracking-tight text-ink">
          {price}
        </span>
      </div>
      <h2 className="text-xl font-semibold tracking-tight text-ink">{name}</h2>
      <p className="mt-3 text-base leading-7 text-neutral-600">{description}</p>
      <div className="mt-auto pt-7">
        <Link
          href="/book"
          aria-label={`Book an appointment — ${name}`}
          className="text-link text-ink"
        >
          Book an appointment <span aria-hidden="true">↗</span>
        </Link>
      </div>
    </article>
  );
}
