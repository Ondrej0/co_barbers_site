import Link from "next/link";

interface BarberCardProps {
    id: string;
    name: string;
    role: string;
    experience: number;
}

export function BarberCard({ id, name, role, experience }: BarberCardProps) {
    return (
        <>
            <p>{name}</p>
            <p>{role}</p>
            <p>{experience} years experience</p>
            <Link href={`/barbers/${id}`}>View Profile</Link>
        </>
    )
}