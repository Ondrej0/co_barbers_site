import type { Metadata } from "next";
import { BarberCard } from "@/components/BarberCard";
import { createClient } from "@/utils/supabase/server";
import { PageHeader } from "@/components/PageHeader";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = { title: "Our Barbers" };

export default async function Barbers() {
  const supabase = await createClient();
  const { data: barbers, error } = await supabase.from("barbers").select("*");
  if (error) {
    console.error("Supabase error:", error);
    throw new Error(error.message);
  }
  return (
    <>
      <PageHeader
        eyebrow="Behind the chair"
        title="Meet your barber."
        description="Experienced barbers, sharp attention to detail, and a style for every client. Get to know the people behind your next cut."
      />
      <section className="site-container py-12 md:py-20">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {barbers.map((barber, index) => (
            <Reveal key={barber.id} delay={(index % 3) * 80}>
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
          <p className="notice">
            Our team profiles are being updated. Please check back soon.
          </p>
        )}
      </section>
    </>
  );
}
