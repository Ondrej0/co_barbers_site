import Link from "next/link";

export function Navbar() {
    return (
        <header className="border-b border-neutral-800 bg-neutral-950 text-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-widest uppercase"
                >
                    North & Co.
                </Link>

                <div className="flex items-center gap-8 text-sm">
                    <Link href="/services">Services</Link>
                    <Link href="/barbers">Barbers</Link>
                    <Link href="/gallery">Gallery</Link>
                    <Link href="/about">About</Link>
                    <Link href="/contact">Contact</Link>

                    <Link
                        href="/book"
                        className="bg-white px-5 py-2.5 font-semibold text-black transition hover:bg-neutral-200"
                    >
                        Book Now
                    </Link>
                </div>
            </nav>
        </header>
    );
}