import {BookingSteps} from "@/components/BookingSteps";
import {createClient} from "@/utils/supabase/server";

export default async function BookPage(){

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("availability")
        .select(`
        day_of_week,
        start_time,
        end_time,
        barbers (
            name
        )
    `);

    if (error) {
        throw new Error(`Error: ${error.message}`);
    }

    console.log("This is data:", data);

    return (
        <section className="bg-white py-20 text-neutral-950">
            <div className="mx-auto max-w-7xl px-6">
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-neutral-500">
                    North & Co
                </p>

                <h1 className="mt-3 text-5xl font-bold tracking-tight">
                    Book Now
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-neutral-600">
                   Use our internal software to book
                </p>
            </div>
            <BookingSteps />
        </section>
    )
}