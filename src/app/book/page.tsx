import type { Metadata } from "next";
import { BookingSteps } from "@/components/BookingSteps";
import { createClient } from "@/utils/supabase/server";

export const metadata: Metadata = { title: "Book an Appointment" };

export default async function BookPage() {
  const supabase = await createClient();

  const [
    { data: availability, error: availabilityError },
    { data: services, error: servicesError },
    { data: barbers, error: barbersError },
  ] = await Promise.all([
    supabase.from("availability").select("*"),
    supabase.from("services").select("*"),
    supabase.from("barbers").select("*").order("name"),
  ]);

  if (availabilityError) {
    throw new Error(`Error: ${availabilityError.message}`);
  }

  if (servicesError) {
    throw new Error(`Error: ${servicesError.message}`);
  }

  if (barbersError) {
    throw new Error(`Error: ${barbersError.message}`);
  }

  return (
    <section className="site-container py-10 md:py-14 lg:pb-24">
      <div className="mx-auto max-w-4xl">
        <p className="eyebrow text-[#795b37]">Make time for a fresh cut</p>
        <h1 className="section-title mt-4">Book your visit.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-neutral-600">
          Your service, your barber, your time. Choose an appointment in four
          simple steps.
        </p>
      </div>
      <BookingSteps
        services={services ?? []}
        barbers={barbers ?? []}
        availability={availability ?? []}
      />
    </section>
  );
}
