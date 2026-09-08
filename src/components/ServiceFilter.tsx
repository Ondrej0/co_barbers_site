"use client";

import { ServiceCard } from "@/components/ServiceCard";
import { useState } from "react";

interface Service {
    name: string;
    price: number;
    duration: number;
}

interface ServiceFilterProps {
    services: Array<Service>;
}

type ServiceDurationState = "all" | "30" | "45+";

export function ServiceFilter({ services }: ServiceFilterProps) {
    const [durationFilter, setDurationFilter] = useState<ServiceDurationState>("all");

    const filteredServices = services.filter((service: Service) => {
        if (durationFilter === "all") {
            return true;
        } else if (durationFilter === "30") {
            return service.duration === 30;
        } else {
            return service.duration >= 45;
        }
    })

    return (
        <>
            <div>
                <button onClick={() => setDurationFilter("all")}>ALL</button>
                <button onClick={() => setDurationFilter("30")}>30</button>
                <button onClick={() => setDurationFilter("45+")}>45+</button>
            </div>

            <div>
                {filteredServices.map((service) => (
                    <ServiceCard
                        key={service.name}
                        name={service.name}
                        price={service.price}
                        duration={service.duration}
                    />
                ))}
            </div>
        </>
    );
}