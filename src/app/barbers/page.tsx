import {BarberCard} from "@/components/BarberCard";
import {barbers} from "@/data/barbers";

export default function Barbers(){
    return (
        <>
            <section className="bg-white py-20 text-neutral-950">
                <div className="mx-auto max-w-7xl px-6">
                    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                        North & Co
                    </p>

                    <h1 className="mt-3 text-5xl font-bold tracking-tight">
                        Meet the Barbers
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                        Get to know your team
                    </p>
                </div>
            </section>
            <section className="bg-white py-20 text-neutral-950">
                {barbers.map((barber) => (
                    <BarberCard key={barber.id} name={barber.name} id={barber.id} experience={barber.experience} role={barber.role} />
                ))}
            </section>
        </>
    )
}