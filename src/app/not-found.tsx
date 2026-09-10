import Link from "next/link";

export default function NotFound() {
  return (
    <section className="site-container section-space">
      <div className="mx-auto max-w-2xl rounded-xl border border-ink/15 bg-white p-7 text-center sm:p-12">
        <p className="eyebrow text-[#795b37]">404 / Page not found</p>
        <h1 className="section-title mt-5">A little off course.</h1>
        <p className="mt-5 text-base leading-7 text-neutral-600">
          We couldn’t find that page. Head back to North & Co. or meet the team to find your barber.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn btn-primary">Back to home</Link>
          <Link href="/barbers" className="btn btn-secondary">Meet the barbers</Link>
        </div>
      </div>
    </section>
  );
}
