import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="North & Co. · Gloucester"
        title="Let's get you sorted."
        description="Planning your next visit? Explore the service menu, get to know the team, or find an appointment that works for you."
      />
      <section className="section-space">
        <div className="site-container grid gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal className="flex flex-col gap-6">
            <div className="rounded-xl border border-white/10 bg-ink p-7 text-white sm:p-10">
              <p className="eyebrow text-brass">Appointments</p>
              <h2 className="section-title mt-5">Your chair is waiting.</h2>
              <p className="mt-5 max-w-md text-base leading-7 text-neutral-300">
                Choose your service and barber, then see available dates and
                times in our online booking.
              </p>
              <Link href="/book" className="btn btn-brass mt-7">
                Find an appointment <span aria-hidden="true">↗</span>
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="rounded-xl border border-ink/15 p-6">
                <h2 className="text-lg font-semibold">Choosing a service?</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  See the full menu, prices and appointment lengths.
                </p>
                <Link href="/services" className="text-link mt-3">
                  View services <span aria-hidden="true">↗</span>
                </Link>
              </div>
              <div className="rounded-xl border border-ink/15 p-6">
                <h2 className="text-lg font-semibold">Meet the team</h2>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Find out more about the people behind the chair.
                </p>
                <Link href="/barbers" className="text-link mt-3">
                  Our barbers <span aria-hidden="true">↗</span>
                </Link>
              </div>
            </div>
          </Reveal>
          <Reveal className="image-frame group min-h-96 lg:min-h-full">
            <Image
              src="/barber-hero.jpg"
              alt="A barber finishing a customer's haircut"
              fill
              sizes="(max-width: 1023px) 100vw, 50vw"
              className="image-zoom object-[center_40%]"
            />
            <div
              className="absolute inset-0 bg-gradient-to-t from-ink/90 via-transparent to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-7 bottom-8 text-white">
              <p className="eyebrow text-brass">Find your local</p>
              <p className="mt-3 font-serif text-4xl">Gloucester, UK.</p>
              <p className="mt-3 text-sm text-neutral-200">
                North & Co. Barbers
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
