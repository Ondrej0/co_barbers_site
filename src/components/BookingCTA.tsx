import Link from "next/link";
import { Reveal } from "@/components/Reveal";

export function BookingCTA() {
  return (
    <section className="section-space">
      <div className="site-container">
        <Reveal className="relative overflow-hidden rounded-xl bg-ink px-6 py-12 text-white sm:px-12 md:flex md:items-center md:justify-between md:gap-10 md:py-16">
          <div
            className="absolute inset-y-0 left-0 w-1 bg-brass"
            aria-hidden="true"
          />
          <div>
            <p className="eyebrow text-brass">Your next visit</p>
            <h2 className="section-title mt-4">Ready for a fresh cut?</h2>
            <p className="mt-4 text-base leading-7 text-neutral-300">
              Choose your service. Find your barber. Take a seat.
            </p>
          </div>
          <Link href="/book" className="btn btn-brass mt-8 shrink-0 md:mt-0">
            Book an appointment <span aria-hidden="true">↗</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
