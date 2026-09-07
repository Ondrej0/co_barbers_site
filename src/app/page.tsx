import Link from 'next/link'

export default function Home() {
  return (
    <>
      <section>
        <h1>This is hero</h1>
      </section>
      <section>
        <h2>service preview</h2>
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
