interface ServiceCardProps {
    name: string
    price: number
    duration: number
}

export function ServiceCard({ name, price, duration }: ServiceCardProps) {
    return (
        <>
            <p>{name}</p>
            <p>{price}</p>
            <p>{duration}</p>
        </>
    );
}