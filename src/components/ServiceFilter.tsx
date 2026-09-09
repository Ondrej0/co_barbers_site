"use client";

import { ServiceCard } from "@/components/ServiceCard";
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
        if (durationFilter === "all") {
            return true;
        }

        if (durationFilter === "30") {
            return service.duration_mins === 30;
        }

        return service.duration_mins >= 45;
    });

    const filterButtonClass = (filter: ServiceDurationState) =>
        `rounded-full px-4 py-2 text-sm font-semibold transition ${
            durationFilter === filter
                ? "bg-neutral-950 text-white"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
        }`;

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <div className="mb-8 flex flex-wrap gap-3">
                <button
                    onClick={() => setDurationFilter("all")}
                    className={filterButtonClass("all")}
                >
                    All
                </button>

                <button
                    onClick={() => setDurationFilter("30")}
                    className={filterButtonClass("30")}
                >
                    30 mins
                </button>

                <button
                    onClick={() => setDurationFilter("45+")}
                    className={filterButtonClass("45+")}
                >
                    45+ mins
                </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredServices.map((service) => (
                    <ServiceCard
                        key={service.id}
                        name={service.name}
                        description={service.description}
                        price_pence={service.price_pence}
                        duration_mins={service.duration_mins}
                    />
                ))}
            </div>
        </div>
    );
}