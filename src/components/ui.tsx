"use client";

import { motion } from "motion/react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

/* ---------------- Card ---------------- */
export function Card({
  className,
  children,
  hover,
  delay = 0,
}: {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.32, 0.72, 0, 1] }}
      className={cn(
        "rounded-[var(--radius-2xl)] border bg-gradient-to-b from-[var(--surface)] to-[var(--surface-2)] shadow-[var(--shadow-md)]",
        hover && "transition-shadow duration-300 hover:shadow-[var(--shadow-lg)]",
        className
      )}
    >
      {children}
    </motion.div>
  );
}

/* ---------------- Sparkline (micro trend) ---------------- */
export function Sparkline({
  data,
  color = "var(--accent)",
  className,
}: {
  data: number[];
  color?: string;
  className?: string;
}) {
  const max = Math.max(...data, 1);
  return (
    <div className={cn("flex h-7 items-end gap-[3px]", className)}>
      {data.map((v, i) => (
        <motion.span
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${Math.max(8, (v / max) * 100)}%` }}
          transition={{ duration: 0.5, delay: 0.15 + i * 0.04, ease: [0.32, 0.72, 0, 1] }}
          className="min-w-[3px] flex-1 rounded-[2px]"
          style={{ background: color, opacity: i === data.length - 1 ? 1 : 0.3 }}
        />
      ))}
    </div>
  );
}

/* ---------------- StatCard (number-forward, Stripe-style) ---------------- */
export function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  sub,
  delta,
  trend,
  delay = 0,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  unit?: string;
  sub?: string;
  delta?: { up: boolean; value: string };
  trend?: number[];
  delay?: number;
}) {
  return (
    <Card className="p-4" delay={delay} hover>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-secondary)]">
          <Icon size={14} className="text-[var(--text-tertiary)]" />
          {label}
        </span>
        <MoreHorizontal size={15} className="text-[var(--text-quaternary)]" />
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-[28px] font-bold leading-none tracking-tight tabular-nums">
          {value}
        </span>
        {unit && <span className="text-sm font-medium text-[var(--text-secondary)]">{unit}</span>}
      </div>
      <div className="mt-2 flex items-center gap-2 text-[11px]">
        {sub && <span className="text-[var(--text-tertiary)]">{sub}</span>}
        {delta && (
          <span className={delta.up ? "text-[var(--green)]" : "text-[var(--red)]"}>
            {delta.up ? "↑" : "↓"} {delta.value}
          </span>
        )}
      </div>
      {trend && <Sparkline data={trend} className="mt-3" />}
    </Card>
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
        <h3 className="text-[15px] font-semibold tracking-tight text-[var(--text)]">
          {title}
        </h3>
        {desc && (
          <p className="mt-0.5 text-xs text-[var(--text-secondary)]">{desc}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ---------------- Badge ---------------- */
const toneMap: Record<string, string> = {
  blue: "bg-[var(--blue-soft)] text-[var(--blue)]",
  green: "bg-[var(--green-soft)] text-[var(--green)]",
  orange: "bg-[var(--orange-soft)] text-[var(--orange)]",
  red: "bg-[var(--red-soft)] text-[var(--red)]",
  purple: "bg-[var(--purple-soft)] text-[var(--purple)]",
  teal: "bg-[var(--teal-soft)] text-[var(--teal)]",
  neutral: "bg-[var(--surface-3)] text-[var(--text-secondary)]",
};

export type Tone = keyof typeof toneMap;

export function Badge({
  tone = "neutral",
  children,
  className,
  dot,
}: {
  tone?: Tone;
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
      {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

/* ---------------- Button ---------------- */
type BtnVariant = "primary" | "secondary" | "ghost" | "danger" | "success";
const btnVariants: Record<BtnVariant, string> = {
  primary:
    "bg-[var(--blue)] text-white hover:bg-[var(--blue-hover)] shadow-sm",
  secondary:
    "border bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-3)]",
  ghost: "text-[var(--text-secondary)] hover:bg-[var(--surface-3)]",
  danger: "bg-[var(--red)] text-white hover:brightness-110",
  success: "bg-[var(--green)] text-white hover:brightness-110",
};

export function Button({
  variant = "primary",
  className,
  children,
  ...rest
}: {
  variant?: BtnVariant;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <motion.button
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-colors duration-200 disabled:opacity-40",
        btnVariants[variant],
        className
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {children}
    </motion.button>
  );
}

/* ---------------- Segmented control (Apple style) ---------------- */
export function Segmented<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: React.ReactNode }[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative inline-flex rounded-full bg-[var(--surface-3)] p-1",
        className
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={cn(
              "relative z-10 rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors duration-200",
              active ? "text-[var(--text)]" : "text-[var(--text-secondary)]"
            )}
          >
            {active && (
              <motion.span
                layoutId={`seg-${className ?? "x"}-${options.length}`}
                className="absolute inset-0 -z-10 rounded-full bg-[var(--surface)] shadow-sm"
                transition={{ type: "spring", stiffness: 500, damping: 36 }}
              />
            )}
            <span className="flex items-center gap-1.5">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------- Switch (Apple toggle) ---------------- */
export function Switch({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-[31px] w-[51px] shrink-0 rounded-full transition-colors duration-300",
        checked ? "bg-[var(--green)]" : "bg-[var(--surface-3)]"
      )}
    >
      <motion.span
        layout
        transition={{ type: "spring", stiffness: 500, damping: 32 }}
        className="absolute top-[2px] h-[27px] w-[27px] rounded-full bg-white shadow-[0_2px_4px_rgba(0,0,0,0.25)]"
        style={{ left: checked ? "22px" : "2px" }}
      />
    </button>
  );
}

/* ---------------- Avatar ---------------- */
export function Avatar({
  name,
  color,
  size = 36,
}: {
  name: string;
  color: string;
  size?: number;
}) {
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white"
      style={{
        background: color,
        width: size,
        height: size,
        fontSize: size * 0.4,
      }}
    >
      {name.charAt(0)}
    </span>
  );
}

/* ---------------- Skeleton ---------------- */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

/* ---------------- Empty state ---------------- */
export function EmptyState({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="text-[var(--text-quaternary)]">{icon}</div>
      <p className="text-sm font-medium text-[var(--text-secondary)]">{title}</p>
      {desc && <p className="text-xs text-[var(--text-tertiary)]">{desc}</p>}
    </div>
  );
}

/* ---------------- Progress ring ---------------- */
export function Ring({
  value,
  size = 64,
  stroke = 6,
  color = "var(--blue)",
  children,
}: {
  value: number;
  size?: number;
  stroke?: number;
  color?: string;
  children?: React.ReactNode;
}) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.min(100, value) / 100) * c;
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--surface-3)"
          strokeWidth={stroke}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          initial={{ strokeDashoffset: c }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.32, 0.72, 0, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
