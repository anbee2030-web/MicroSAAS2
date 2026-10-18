export function PageIntro({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-brass">{eyebrow}</p>
        <h1 className="mt-2 font-display text-4xl tracking-tight text-ink sm:text-5xl">{title}</h1>
        {description ? <p className="mt-3 max-w-xl text-base leading-7 text-ink-soft">{description}</p> : null}
      </div>
      {action ? <div className="flex flex-wrap gap-2">{action}</div> : null}
    </div>
  );
}
