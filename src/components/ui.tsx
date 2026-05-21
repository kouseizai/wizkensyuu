import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-[var(--color-surface)] shadow-[0_1px_2px_rgba(16,24,40,0.04),0_8px_24px_-12px_rgba(16,24,40,0.12)]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  title,
  desc,
  action,
  className,
}: {
  title: React.ReactNode;
  desc?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b px-5 py-4",
        className
      )}
    >
      <div>
        <h3 className="text-[15px] font-semibold text-[var(--color-text)]">
          {title}
        </h3>
        {desc && (
          <p className="mt-0.5 text-xs text-[var(--color-text-muted)]">{desc}</p>
        )}
      </div>
      {action}
    </div>
  );
}

const toneMap: Record<string, string> = {
  primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
  danger: "bg-[var(--color-danger-soft)] text-[var(--color-danger)]",
  info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({
  tone = "neutral",
  children,
  className,
  dot,
}: {
  tone?: keyof typeof toneMap;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium",
        toneMap[tone],
        className
      )}
    >
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-80" />
      )}
      {children}
    </span>
  );
}
