import { notFound } from "next/navigation";
import Image from "next/image";
import {barbers} from "@/data/barbers";

interface BarberProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function BarberProfilePage({params}: BarberProfilePageProps) {
    const { id } = await params;

    const barber = barbers.find((barber) => barber.id === id);

    if (!barber) {
        notFound();
    }

    return (
        <>
            <h3>{barber.name}</h3>
            <p>{barber.role}</p>
            <p>{barber.experience} years experience</p>
            <Image
                alt={`${barber.name}, ${barber.role}`}
                src={barber.image}
                width={800}
                height={800}
            />
        </>

    );
}