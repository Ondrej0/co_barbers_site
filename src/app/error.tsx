"use client";

import Link from "next/link";

export default function ErrorPage({ retry }: { error: Error & { digest?: string }; retry: () => void }) {
  return (
    <section className="site-container section-space">
      <div role="alert" className="mx-auto max-w-2xl rounded-xl border border-ink/15 bg-white p-7 sm:p-12">
        <p className="eyebrow text-[#795b37]">Something went wrong</p>
        <h1 className="section-title mt-5">Let’s try that again.</h1>
        <p className="mt-5 text-base leading-7 text-neutral-600">We couldn’t load this page. Please try again in a moment.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={retry} className="btn btn-primary">Try again</button>
          <Link href="/" className="btn btn-secondary">Back to home</Link>
        </div>
      </div>
    </section>
  );
}
