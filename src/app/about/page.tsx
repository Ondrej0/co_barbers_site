import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { BookingCTA } from "@/components/BookingCTA";

export const metadata: Metadata = { title: "About" };

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="The North & Co. approach"
        title="More than a haircut."
        description="Modern cuts. Traditional standards. A relaxed barbershop experience, right here in Gloucester."
      />
      <section className="section-space">
        <div className="site-container grid items-center gap-10 md:grid-cols-2 lg:gap-20">
          <Reveal className="image-frame group aspect-[4/5] max-h-[600px]">
            <Image
              src="/barber-1.jpg"
              alt="A barber carefully shaping a client's beard with a straight razor"
              fill
              sizes="(max-width: 767px) 100vw, 50vw"
              className="image-zoom"
            />
          </Reveal>
          <Reveal>
            <p className="eyebrow text-[#795b37]">
              Time in the chair, well spent
            </p>
            <h2 className="section-title mt-5">
              Good barbering.
              <br />
              No shortcuts.
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600">
              From a clean fade to a classic cut, North & Co. brings a sharp eye
              for detail to everyday grooming. We believe a great cut should
              feel as good as it looks.
            </p>
            <p className="mt-4 text-base leading-8 text-neutral-600">
              Meet the people behind the chair, find a service that suits you,
              and make a little time for yourself.
            </p>
            <Link href="/barbers" className="text-link mt-6">
              Meet your barber <span aria-hidden="true">↗</span>
            </Link>
          </Reveal>
        </div>
      </section>
      <section className="border-y border-ink/10 bg-[#eaece5] py-12 md:py-16">
        <div className="site-container grid gap-8 md:grid-cols-3">
          {[
            [
              "01",
              "Attention to detail",
              "Clean lines, careful finishing and a cut that feels like you.",
            ],
            [
              "02",
              "Your own style",
              "Classic shapes, modern fades and thoughtful grooming.",
            ],
            [
              "03",
              "A relaxed experience",
              "A welcoming space to take a seat and enjoy your visit.",
            ],
          ].map(([number, title, copy], index) => (
            <Reveal
              key={number}
              delay={index * 80}
              className="border-t border-ink/20 pt-6"
            >
              <p className="eyebrow text-[#795b37]">{number}</p>
              <h2 className="mt-5 font-serif text-2xl">{title}</h2>
              <p className="mt-3 text-base leading-7 text-neutral-600">
                {copy}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
