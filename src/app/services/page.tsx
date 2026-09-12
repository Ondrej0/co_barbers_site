import type { Metadata } from "next";
import { ServiceFilter } from "@/components/ServiceFilter";
import { createClient } from "@/utils/supabase/server";
import { PageHeader } from "@/components/PageHeader";

export const metadata: Metadata = {
    title: "Haircut Services",
    description:
        "Explore our professional barber services in Gloucester, with quality haircuts, skin fades and beard trims at affordable prices.",
};

export default async function ServicesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("services").select("*");
  if (error) {
    throw new Error("Failed to load services");
  }
  const services = data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="The service menu"
        title="Look sharp. Feel good."
        description="From a fresh fade to a beard tidy. Explore our cuts and grooming services, with time set aside to get the details right."
      />
      <ServiceFilter services={services} />
    </>
  );
}
