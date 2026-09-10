import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";
import { BookingCTA } from "@/components/BookingCTA";

export const metadata: Metadata = { title: "Gallery" };
const photos = [
  {
    src: "/barber-hero.jpg",
    alt: "Scissor work on a textured haircut",
    title: "The finishing touches",
    category: "Scissor work",
  },
  {
    src: "/barber-3.jpg",
    alt: "A finished skin fade with a defined side part",
    title: "Clean lines. Sharp finish.",
    category: "Cuts & fades",
  },
  {
    src: "/barber-1.jpg",
    alt: "A barber shaping a beard with a straight razor",
    title: "A considered detail",
    category: "Beard grooming",
  },
  {
    src: "/barber-2.jpg",
    alt: "A barber carefully detailing a customer's hairline",
    title: "Behind the chair",
    category: "The craft",
  },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        eyebrow="A closer look"
        title="The craft, in focus."
        description="Cuts, fades and the details in between. Take a look at life behind the chair."
      />
      <section className="pt-12 md:pt-20">
        <div className="site-container grid gap-x-8 gap-y-10 md:grid-cols-2">
          {photos.map((photo, index) => (
            <Reveal
              key={photo.src}
              delay={(index % 2) * 90}
              className={index % 2 ? "md:pt-14" : ""}
            >
              <figure className="group">
                <div className="image-frame aspect-[4/5]">
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    sizes="(max-width: 767px) 100vw, 50vw"
                    className="image-zoom"
                  />
                </div>
                <figcaption className="mt-5 flex items-start justify-between gap-4 border-b border-ink/15 pb-5">
                  <div>
                    <p className="eyebrow text-[#795b37]">{photo.category}</p>
                    <h2 className="mt-2 font-serif text-2xl tracking-tight">
                      {photo.title}
                    </h2>
                  </div>
                  <span className="pt-1 text-xs text-neutral-500">
                    0{index + 1}
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>
      <BookingCTA />
    </>
  );
}
