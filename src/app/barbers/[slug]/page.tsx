import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { Reveal } from "@/components/Reveal";

interface BarberProfilePageProps {
  params: Promise<{ slug: string }>;
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
  if (error || !barber) notFound();

  return (
    <section className="site-container py-8 md:py-12 lg:pb-24">
      <Link href="/barbers" className="text-link mb-8 text-neutral-600">
        <span aria-hidden="true">←</span> All barbers
      </Link>
      <div className="grid gap-10 md:grid-cols-2 lg:items-center lg:gap-20">
        <div className="image-frame group aspect-[4/5] max-h-[700px]">
          <Image
            alt={`${barber.name}, ${barber.role}`}
            src={barber.image_url}
            fill
            sizes="(max-width: 767px) 100vw, 50vw"
            className="image-zoom"
            preload
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent"
            aria-hidden="true"
          />
          <p className="absolute bottom-6 left-6 text-sm text-white">
            Behind the chair at North & Co.
          </p>
        </div>
        <Reveal className="py-3 md:py-6">
          <p className="eyebrow text-[#795b37]">{barber.role}</p>
          <h1 className="display-title mt-5">{barber.name}</h1>
          <dl className="mt-8 grid gap-6 border-y border-ink/15 py-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow text-neutral-500">Experience</dt>
              <dd className="mt-3 font-serif text-3xl">
                {barber.experience_years} years
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-neutral-500">The next step</dt>
              <dd className="mt-3 text-base font-medium">
                Find your appointment
              </dd>
            </div>
          </dl>
          <p className="mt-7 whitespace-pre-line text-base leading-8 text-neutral-600">
            {barber.bio}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/book" className="btn btn-primary">
              Book a visit <span aria-hidden="true">↗</span>
            </Link>
            <Link href="/barbers" className="btn btn-secondary">
              Back to barbers
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
