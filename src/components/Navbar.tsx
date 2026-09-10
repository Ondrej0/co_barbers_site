"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

const links = [
  { href: "/services", label: "Services" },
  { href: "/barbers", label: "Barbers" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span
      className={`flex flex-col gap-[6px] ${open ? "menu-open" : ""}`}
      aria-hidden="true"
    >
      <span className="menu-line" />
      <span className="menu-line" />
      <span className="menu-line" />
    </span>
  );
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  useEffect(() => {
    const menu = dialog.current;
    if (!menu) return;
    if (!isOpen) {
      menu.close();
      return;
    }
    // The native modal provides focus trapping, Escape and focus restoration.
    menu.showModal();
    const originalOverflow = document.body.style.overflow;
    const originalPadding = document.body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    document.body.style.overflow = "hidden";
    const desktop = window.matchMedia("(min-width: 1024px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setIsOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.paddingRight = originalPadding;
      desktop.removeEventListener("change", closeOnDesktop);
      menu.close();
    };
  }, [isOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-ink/95 text-white backdrop-blur-xl">
      <nav
        aria-label="Main navigation"
        className="site-container flex min-h-20 items-center justify-between gap-5"
      >
        <Link href="/" aria-label="North & Co. home" className="shrink-0 py-2">
          <span className="block text-xl font-semibold uppercase tracking-[0.12em]">
            North <span className="font-serif font-normal text-brass">&</span>{" "}
            Co.
          </span>
          <span className="mt-0.5 block text-xs uppercase tracking-[0.24em] text-neutral-400">
            Barbers · Gloucester
          </span>
        </Link>
        <div className="hidden items-center gap-7 text-sm lg:flex">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="nav-link"
              aria-current={isActive(href) ? "page" : undefined}
            >
              {label}
            </Link>
          ))}
          <Link
            href="/book"
            className="btn btn-brass ml-2"
            aria-current={isActive("/book") ? "page" : undefined}
          >
            Book now <span aria-hidden="true">↗</span>
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex h-12 w-12 items-center justify-center rounded-md border border-white/20 transition hover:bg-white/10 lg:hidden"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
        >
          <MenuIcon open={isOpen} />
        </button>
      </nav>
      <dialog
        ref={dialog}
        id="mobile-navigation"
        className="mobile-drawer"
        aria-label="Navigation menu"
        onKeyDown={(event) => {
          if (event.key !== "Tab") return;
          const controls = event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not(:disabled)',
          );
          const first = controls[0];
          const last = controls[controls.length - 1];
          if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last?.focus();
          } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first?.focus();
          }
        }}
        onCancel={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === dialog.current) setIsOpen(false);
        }}
      >
        <div
          className="flex min-h-full flex-col px-7 pb-10 pt-4"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-center justify-between border-b border-white/15 pb-4">
            <span className="eyebrow text-brass">North & Co.</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close navigation menu"
              className="flex h-12 w-12 items-center justify-center rounded-md border border-white/20 transition hover:bg-white/10"
            >
              <MenuIcon open={isOpen} />
            </button>
          </div>
          <nav aria-label="Mobile navigation" className="flex flex-col py-6">
            {[{ href: "/", label: "Home" }, ...links].map(
              ({ href, label }, index) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setIsOpen(false)}
                  aria-current={isActive(href) ? "page" : undefined}
                  className="group flex min-h-16 items-center gap-5 border-b border-white/10 py-3 font-serif text-3xl transition hover:pl-2 hover:text-brass aria-[current=page]:text-brass"
                >
                  <span className="font-sans text-xs text-neutral-400">
                    0{index + 1}
                  </span>
                  {label}
                </Link>
              ),
            )}
          </nav>
          <Link
            href="/book"
            onClick={() => setIsOpen(false)}
            className="btn btn-brass"
          >
            Book an appointment <span aria-hidden="true">↗</span>
          </Link>
          <p className="mt-auto pt-10 text-sm text-neutral-400">
            Modern cuts. Traditional standards.
          </p>
        </div>
      </dialog>
    </header>
  );
}
