"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ChevronDown, Calendar } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";

export const inputCls =
  "h-11 w-full rounded-xl border bg-[var(--surface)] px-3.5 text-sm text-[var(--text)] outline-none transition-all duration-200 placeholder:text-[var(--text-quaternary)] focus:border-[var(--blue)] focus:ring-4 focus:ring-[var(--blue-soft)]";

export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm font-medium text-[var(--text)]">
        {label}
      </span>
      {children}
      {hint && (
        <span className="mt-1 block text-xs text-[var(--text-tertiary)]">
          {hint}
        </span>
      )}
    </label>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}

export function Textarea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>
) {
  return (
    <textarea
      {...props}
      className={cn(
        inputCls,
        "h-auto min-h-[88px] resize-none py-2.5",
        props.className
      )}
    />
  );
}

export function Select({
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative">
      <select {...props} className={cn(inputCls, "cursor-pointer appearance-none pr-10", className)}>
        {children}
      </select>
      <ChevronDown
        size={16}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)]"
      />
    </div>
  );
}

/* ---------------- Calendar date picker ---------------- */
const WD = ["日", "月", "火", "水", "木", "金", "土"];

export function DatePicker({
  value,
  onChange,
  placeholder = "日付を選択",
}: {
  value: string | null;
  onChange: (iso: string) => void;
  placeholder?: string;
}) {
  const [open, setOpen] = useState(false);
  const init = value ? new Date(value) : new Date(2026, 4, 21);
  const [view, setView] = useState({ y: init.getFullYear(), m: init.getMonth() });

  const first = new Date(view.y, view.m, 1);
  const startPad = first.getDay();
  const days = new Date(view.y, view.m + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(startPad).fill(null),
    ...Array.from({ length: days }, (_, i) => i + 1),
  ];

  const fmt = (d: number) =>
    `${view.y}-${String(view.m + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(inputCls, "flex items-center justify-between text-left")}
      >
        <span className={value ? "" : "text-[var(--text-quaternary)]"}>
          {value
            ? `${value.split("-")[0]}年${Number(value.split("-")[1])}月${Number(
                value.split("-")[2]
              )}日`
            : placeholder}
        </span>
        <Calendar size={16} className="text-[var(--text-tertiary)]" />
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -6 }}
              transition={{ type: "spring", stiffness: 460, damping: 32 }}
              className="glass absolute z-50 mt-2 w-72 rounded-2xl border p-3 shadow-[var(--shadow-lg)]"
            >
              <div className="mb-2 flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() =>
                    setView((v) =>
                      v.m === 0 ? { y: v.y - 1, m: 11 } : { ...v, m: v.m - 1 }
                    )
                  }
                  className="rounded-lg p-1.5 hover:bg-[var(--surface-3)]"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-sm font-semibold">
                  {view.y}年 {view.m + 1}月
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setView((v) =>
                      v.m === 11 ? { y: v.y + 1, m: 0 } : { ...v, m: v.m + 1 }
                    )
                  }
                  className="rounded-lg p-1.5 hover:bg-[var(--surface-3)]"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center">
                {WD.map((w, i) => (
                  <span
                    key={w}
                    className={cn(
                      "py-1 text-[11px] font-medium",
                      i === 0
                        ? "text-[var(--red)]"
                        : i === 6
                          ? "text-[var(--blue)]"
                          : "text-[var(--text-tertiary)]"
                    )}
                  >
                    {w}
                  </span>
                ))}
                {cells.map((d, i) => {
                  if (d === null) return <span key={`e${i}`} />;
                  const iso = fmt(d);
                  const selected = iso === value;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => {
                        onChange(iso);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex h-9 items-center justify-center rounded-lg text-sm transition-colors",
                        selected
                          ? "bg-[var(--blue)] font-semibold text-white"
                          : "hover:bg-[var(--surface-3)]"
                      )}
                    >
                      {d}
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
