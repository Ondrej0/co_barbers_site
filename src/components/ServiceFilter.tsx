"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { Reveal } from "@/components/Reveal";
import { useState } from "react";

interface Service {
  id: string;
  name: string;
  description: string;
  price_pence: number;
  duration_mins: number;
  active: boolean;
}
interface ServiceFilterProps {
  services: Service[];
}
type ServiceDurationState = "all" | "30" | "45+";

export function ServiceFilter({ services }: ServiceFilterProps) {
  const [durationFilter, setDurationFilter] =
    useState<ServiceDurationState>("all");
  const filteredServices = services.filter((service) => {
    if (durationFilter === "all") return true;
    if (durationFilter === "30") return service.duration_mins === 30;
    return service.duration_mins >= 45;
  });
  const filterButtonClass = (filter: ServiceDurationState) =>
    `min-h-11 rounded-md border px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[.98] ${durationFilter === filter ? "border-ink bg-ink text-white shadow-sm" : "border-ink/15 bg-white text-neutral-600 hover:border-brass hover:bg-background"}`;

  return (
    <section
      className="site-container py-10 md:py-16 lg:pb-24"
      aria-label="Services"
    >
      <div className="mb-9 flex flex-wrap items-center justify-between gap-5 border-b border-ink/15 pb-7">
        <div
          role="group"
          aria-label="Filter services by duration"
          className="flex flex-wrap gap-2"
        >
          <button
            type="button"
            onClick={() => setDurationFilter("all")}
            aria-pressed={durationFilter === "all"}
            className={filterButtonClass("all")}
          >
            All services
          </button>
          <button
            type="button"
            onClick={() => setDurationFilter("30")}
            aria-pressed={durationFilter === "30"}
            className={filterButtonClass("30")}
          >
            30 mins
          </button>
          <button
            type="button"
            onClick={() => setDurationFilter("45+")}
            aria-pressed={durationFilter === "45+"}
            className={filterButtonClass("45+")}
          >
            45+ mins
          </button>
        </div>
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-sm text-neutral-500"
        >
          {filteredServices.length}{" "}
          {filteredServices.length === 1 ? "service" : "services"}
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredServices.map((service, index) => (
          <Reveal key={service.id} delay={(index % 3) * 60}>
            <ServiceCard
              name={service.name}
              description={service.description}
              price_pence={service.price_pence}
              duration_mins={service.duration_mins}
            />
          </Reveal>
        ))}
      </div>
      {filteredServices.length === 0 && (
        <div className="notice py-12 text-center">
          <h2 className="font-serif text-2xl text-ink">No services to show</h2>
          <p className="mt-3">
            Try another duration, or check back for our updated menu.
          </p>
          <button
            className="btn btn-secondary mt-5"
            onClick={() => setDurationFilter("all")}
          >
            Show all services
          </button>
        </div>
      )}
    </section>
  );
}
