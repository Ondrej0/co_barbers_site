import {ServiceFilter} from "@/components/ServiceFilter";


export default function ServicesPage() {
    const services = [
        {
            name: "Classic Haircut",
            price: 24,
            duration: 30,
        },
        {
            name: "Skin Fade",
            price: 28,
            duration: 45,
        },
        {
            name: "Hair & Beard",
            price: 35,
            duration: 60,
        },
    ];

    return (
        <section className="bg-white py-20 text-neutral-950">
            <div className="mx-auto max-w-7xl px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    North & Co
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight">
                    Services
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                    Explore our cuts, fades, beard trims, and grooming services.
                </p>
            </div>
            <div>
                <ServiceFilter services={services} />
            </div>
        </section>
    );
}