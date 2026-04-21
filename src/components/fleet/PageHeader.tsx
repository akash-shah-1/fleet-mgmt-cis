interface Props {
  title: string;
  subtitle?: React.ReactNode;
  actions?: React.ReactNode;
  eyebrow?: string;
}
export default function PageHeader({ title, subtitle, actions, eyebrow }: Props) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div className="min-w-0">
        {eyebrow && (
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary mb-1.5">
            {eyebrow}
          </div>
        )}
        <h1 className="text-[26px] md:text-[28px] font-bold tracking-tight leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}