import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
    return (
        <section aria-labelledby="login-heading" className="site-container py-12 sm:py-16 lg:py-20">
            <div className="hero-enter mx-auto max-w-md rounded-xl border border-ink/15 bg-white shadow-sm">
                <header className="rounded-t-xl border-b border-ink/10 bg-[#eeeee7] p-6 sm:p-8">
                    <p className="eyebrow text-[#795b37]">North & Co. · Staff</p>
                    <h1 id="login-heading" className="section-title mt-4">Staff Login</h1>
                    <p className="mt-4 text-base leading-7 text-neutral-600">
                        Sign in to view your upcoming appointments.
                    </p>
                </header>
                <div className="p-6 sm:p-8">
                    <LoginForm />
                </div>
            </div>
        </section>
    );
}
