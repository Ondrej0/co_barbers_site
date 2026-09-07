import Link from "next/link";

export function Navbar() {
    return (
        <nav>
            <Link href="/">Home</Link>
            <Link href="/services">Services</Link>
            <Link href="/barbers">Barbers</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/book">Book</Link>
        </nav>
    )
}