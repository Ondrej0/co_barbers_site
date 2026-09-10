import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-ink text-neutral-300">
      <div className="site-container">
        <div className="grid gap-10 py-14 md:grid-cols-[1.5fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="inline-block py-2 text-2xl font-semibold uppercase tracking-widest text-white"
            >
              North <span className="font-serif text-brass">&</span> Co.
            </Link>
            <p className="mt-3 text-sm leading-7 text-neutral-400">
              Modern cuts. Traditional standards.
              <br />
              Your barbers in Gloucester.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <p className="eyebrow mb-4 text-brass">Explore</p>
            <div className="grid grid-cols-2 gap-x-5">
              {[
                ["Services", "/services"],
                ["Barbers", "/barbers"],
                ["Gallery", "/gallery"],
                ["About", "/about"],
                ["Contact", "/contact"],
              ].map(([label, href]) => (
                <Link
                  key={href}
                  href={href}
                  className="flex min-h-11 items-center text-sm transition hover:text-brass"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
          <div>
            <p className="eyebrow mb-5 text-brass">
              A little time for yourself
            </p>
            <Link href="/book" className="btn btn-light w-full sm:w-auto">
              Book your visit <span aria-hidden="true">↗</span>
            </Link>
          </div>
        </div>
        <div className="flex flex-wrap justify-between gap-3 border-t border-white/10 py-6 text-xs text-neutral-400">
          <p>© 2026 North & Co. Barbers</p>
          <p>Gloucester, United Kingdom</p>
        </div>
      </div>
    </footer>
  );
}
