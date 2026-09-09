interface ServiceCardProps {
    name: string;
    price_pence: number;
    duration_mins: number;
    description: string;
}

export function ServiceCard({
                                name,
                                price_pence,
                                duration_mins,
                                description,
                            }: ServiceCardProps) {

    const price = (price_pence / 100).toLocaleString("en-GB", {
        style: "currency",
        currency: "GBP",
    });

    return (
        <article className="flex h-full flex-col rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
            <div className="flex items-start justify-between gap-6">
                <div>
                    <h2 className="text-xl font-semibold tracking-tight text-neutral-950">
                        {name}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-neutral-600">
                        {description}
                    </p>
                </div>

                <p className="shrink-0 text-xl font-bold text-neutral-950">
                    {price}
                </p>
            </div>

            <div className="mt-auto pt-6">
                <span className="inline-flex rounded-full bg-neutral-100 px-3 py-1 text-sm font-medium text-neutral-600">
                    {duration_mins} mins
                </span>
            </div>
        </article>
    );
}