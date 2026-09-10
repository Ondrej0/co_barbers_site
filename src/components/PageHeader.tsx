export function PageHeader({
  eyebrow = "North & Co. · Gloucester",
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description: string;
}) {
  return (
    <header className="border-b border-ink/10 bg-[#eeeee7]">
      <div className="site-container py-14 md:py-20">
        <p className="eyebrow text-[#795b37]">{eyebrow}</p>
        <div className="mt-5 grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end lg:gap-16">
          <h1 className="display-title">{title}</h1>
          <p className="max-w-xl text-base leading-7 text-neutral-600 md:text-lg md:leading-8">
            {description}
          </p>
        </div>
      </div>
    </header>
  );
}
