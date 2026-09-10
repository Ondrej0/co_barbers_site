import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { ServiceCard } from "@/components/ServiceCard";
import { BarberCard } from "@/components/BarberCard";
import { BookingCTA } from "@/components/BookingCTA";
import { Reveal } from "@/components/Reveal";

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
      <section className="overflow-hidden bg-ink text-white">
        <div className="site-container grid items-center gap-10 py-10 md:grid-cols-2 md:gap-12 md:py-16 lg:gap-20">
          <div className="hero-enter py-4 md:py-10">
            <p className="eyebrow text-brass">
              Gloucester · North & Co. Barbers
            </p>
            <h1 className="display-title mt-7 text-[3.6rem] sm:text-7xl md:text-[3.5rem] lg:text-[4.5rem] xl:text-[5.6rem]">
              Modern cuts.
              <br />
              <span className="italic text-brass">Traditional</span>
              <br />
              standards.
            </h1>
            <p className="mt-7 max-w-md text-base leading-7 text-neutral-300 md:text-lg md:leading-8">
              Sharp cuts, clean fades, and a relaxed barbershop experience. A
              little time in the chair. A fresh start to your day.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link href="/book" className="btn btn-brass">
                Book your visit <span aria-hidden="true">↗</span>
              </Link>
              <Link href="/services" className="btn btn-light">
                Explore services
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-4 border-t border-white/15 pt-6 text-xs uppercase tracking-[0.15em] text-neutral-400">
              <span className="h-px w-8 bg-brass" aria-hidden="true" />
              Cuts · Fades · Grooming
            </div>
          </div>
          <div className="group relative">
            <div className="image-frame aspect-[4/5] max-h-[650px] rounded-t-[7rem] rounded-b-lg md:rounded-t-[10rem]">
              <Image
                src="/barber-hero.jpg"
                alt="A precise scissor cut at the barber's chair"
                fill
                sizes="(max-width: 767px) 100vw, 50vw"
                className="image-zoom object-[center_45%]"
                preload
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent"
                aria-hidden="true"
              />
              <p className="absolute inset-x-6 bottom-7 border-t border-white/30 pt-4 text-sm tracking-wide text-white">
                Good hair. Good company.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-space">
        <div className="site-container">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow text-[#795b37]">01 / The service menu</p>
              <h2 className="section-title mt-4">
                Cuts and grooming,
                <br />
                done properly.
              </h2>
            </div>
            <Link href="/services" className="text-link">
              All services <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, index) => (
              <Reveal key={service.id} delay={(index % 3) * 70}>
                <ServiceCard
                  name={service.name}
                  description={service.description}
                  price_pence={service.price_pence}
                  duration_mins={service.duration_mins}
                />
              </Reveal>
            ))}
          </div>
          {services.length === 0 && (
            <p className="notice mt-8">
              Our service menu is being updated. Please check back soon.
            </p>
          )}
        </div>
      </section>
      <section className="section-space border-y border-ink/10 bg-[#eaece5]">
        <div className="site-container">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-xl">
              <p className="eyebrow text-[#795b37]">02 / Behind the chair</p>
              <h2 className="section-title mt-4">
                Experienced hands.
                <br />
                Individual style.
              </h2>
            </div>
            <Link href="/barbers" className="text-link">
              Meet the team <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {barbers.map((barber, index) => (
              <Reveal key={barber.id} delay={(index % 3) * 90}>
                <BarberCard
                  slug={barber.slug}
                  name={barber.name}
                  role={barber.role}
                  experienceYears={barber.experience_years}
                  imageUrl={barber.image_url}
                />
              </Reveal>
            ))}
          </div>
          {barbers.length === 0 && (
            <p className="notice mt-8">
              Our team profiles are being updated. Please check back soon.
            </p>
          )}
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
