"use client";

import { useState } from "react";
import Link from "next/link";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <header className="border-b border-neutral-800 bg-neutral-950 text-white">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                <Link
                    href="/"
                    className="text-xl font-bold tracking-widest uppercase"
                >
                    North & Co.
                </Link>

                <div className="hidden items-center gap-8 text-sm md:flex">
                    <Link
                        href="/services"
                        className="transition hover:text-neutral-300"
                    >
                        Services
                    </Link>

                    <Link
                        href="/barbers"
                        className="transition hover:text-neutral-300"
                    >
                        Barbers
                    </Link>

                    <Link
                        href="/gallery"
                        className="transition hover:text-neutral-300"
                    >
                        Gallery
                    </Link>

                    <Link
                        href="/about"
                        className="transition hover:text-neutral-300"
                    >
                        About
                    </Link>

                    <Link
                        href="/contact"
                        className="transition hover:text-neutral-300"
                    >
                        Contact
                    </Link>

                    <Link
                        href="/book"
                        className="bg-white px-5 py-2.5 font-semibold text-black transition hover:bg-neutral-200"
                    >
                        Book Now
                    </Link>
                </div>

                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="flex flex-col gap-1.5 md:hidden"
                    aria-label="Toggle navigation menu"
                    aria-expanded={isOpen}
                >
                    <span className="h-0.5 w-6 bg-white" />
                    <span className="h-0.5 w-6 bg-white" />
                    <span className="h-0.5 w-6 bg-white" />
                </button>
            </nav>

            {isOpen && (
                <div className="border-t border-neutral-800 px-6 py-6 md:hidden">
                    <div className="mx-auto flex max-w-7xl flex-col gap-5 text-sm">
                        <Link
                            href="/"
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-neutral-300"
                        >
                            Home
                        </Link>

                        <Link
                            href="/services"
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-neutral-300"
                        >
                            Services
                        </Link>

                        <Link
                            href="/barbers"
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-neutral-300"
                        >
                            Barbers
                        </Link>

                        <Link
                            href="/gallery"
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-neutral-300"
                        >
                            Gallery
                        </Link>

                        <Link
                            href="/about"
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-neutral-300"
                        >
                            About
                        </Link>

                        <Link
                            href="/contact"
                            onClick={() => setIsOpen(false)}
                            className="transition hover:text-neutral-300"
                        >
                            Contact
                        </Link>

                        <Link
                            href="/book"
                            onClick={() => setIsOpen(false)}
                            className="mt-2 w-fit bg-white px-5 py-2.5 font-semibold text-black transition hover:bg-neutral-200"
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}