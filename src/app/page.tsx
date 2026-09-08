import Link from 'next/link'
import Image from 'next/image'

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

const barbers = [
    {
        name: "James Carter",
        role: "Senior Barber",
        image: "/barber-1.jpg",
    },
    {
        name: "Lewis Grant",
        role: "Fade Specialist",
        image: "/barber-2.jpg",
    },
    {
        name: "Daniel Reed",
        role: "Barber",
        image: "/barber-3.jpg",
    },
];

export default function Home() {
  return (
    <>
        <section className="relative overflow-hidden bg-neutral-950 text-white">
            <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-16 md:grid-cols-2 md:py-24">
                <div>
                    <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-neutral-400">
                        Gloucester Barbers
                    </p>

                    <h1 className="max-w-xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
                        North & Co Barbers
                    </h1>

                    <p className="mt-6 max-w-lg text-lg leading-8 text-neutral-300">
                        Sharp cuts, clean fades, and a relaxed barbershop experience.
                    </p>

                    <div className="mt-8">
                        <Link
                            href="/book"
                            className="inline-block bg-white px-6 py-3 font-semibold text-black transition hover:bg-neutral-200"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>

                <div className="relative">
                    <Image
                        src="/barber-hero.jpg"
                        alt="Barber cutting a customer's hair"
                        width={1200}
                        height={800}
                        className="h-[420px] w-full rounded-2xl object-cover shadow-2xl md:h-[520px]"
                        priority
                    />
                </div>
            </div>
        </section>
        <section className="bg-white py-20 text-neutral-950">
            <div className="mx-auto max-w-7xl px-6">
                <div className="max-w-2xl">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                        Our Services
                    </p>

                    <h2 className="mt-3 text-4xl font-bold tracking-tight">
                        Cuts and grooming, done properly.
                    </h2>
                </div>

                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    {services.map((service) => (
                        <div
                            key={service.name}
                            className="rounded-2xl border border-neutral-200 bg-neutral-50 p-6 shadow-sm"
                        >
                            <h3 className="text-xl font-semibold">
                                {service.name}
                            </h3>

                            <p className="mt-6 text-3xl font-bold">
                                £{service.price}
                            </p>

                            <p className="mt-2 text-sm text-neutral-500">
                                {service.duration} mins
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10">
                    <Link
                        href="/services"
                        className="inline-block border-b border-neutral-950 pb-1 font-semibold"
                    >
                        View All Services
                    </Link>
                </div>
            </div>
        </section>
      <section>
        <h2>barbers preview</h2>
      </section>
      <section>
        <h2>Booking CTA</h2>
        <Link href="/book">Book Now</Link>
      </section>
    </>
  );
}
