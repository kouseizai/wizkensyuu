"use client";

import { useEffect, useRef, useState } from "react";
import {
  LogIn,
  LogOut,
  Coffee,
  Play,
  MapPin,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { formatClock, formatDateJP, minutesToHM } from "@/lib/utils";

type PunchState = "before" | "working" | "break" | "done";

type Stamp = { in?: string; out?: string; breaks: { start: string; end?: string }[] };

const labelMap: Record<PunchState, { text: string; tone: string; dot: string }> = {
  before: { text: "未出勤", tone: "text-slate-500 bg-slate-100", dot: "bg-slate-400" },
  working: { text: "勤務中", tone: "text-[var(--color-success)] bg-[var(--color-success-soft)]", dot: "bg-[var(--color-success)]" },
  break: { text: "休憩中", tone: "text-[var(--color-warning)] bg-[var(--color-warning-soft)]", dot: "bg-[var(--color-warning)]" },
  done: { text: "退勤済", tone: "text-[var(--color-primary)] bg-[var(--color-primary-soft)]", dot: "bg-[var(--color-primary)]" },
};

export default function PunchClock() {
  const [now, setNow] = useState<Date | null>(null);
  const [state, setState] = useState<PunchState>("before");
  const [stamp, setStamp] = useState<Stamp>({ breaks: [] });
  const breakAccum = useRef(0);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const hhmm = (d: Date) =>
    `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;

  const clockIn = () => {
    if (!now) return;
    setStamp((s) => ({ ...s, in: hhmm(now) }));
    setState("working");
  };
  const startBreak = () => {
    if (!now) return;
    setStamp((s) => ({ ...s, breaks: [...s.breaks, { start: hhmm(now) }] }));
    setState("break");
  };
  const endBreak = () => {
    if (!now) return;
    setStamp((s) => {
      const breaks = [...s.breaks];
      const last = breaks[breaks.length - 1];
      if (last && !last.end) {
        last.end = hhmm(now);
        breakAccum.current += diffMin(last.start, last.end);
      }
      return { ...s, breaks };
    });
    setState("working");
  };
  const clockOut = () => {
    if (!now) return;
    setStamp((s) => ({ ...s, out: hhmm(now) }));
    setState("done");
  };

  const meta = labelMap[state];
  const elapsed =
    stamp.in && now
      ? diffMin(stamp.in, hhmm(now)) - breakAccum.current
      : 0;

  return (
    <div className="rounded-2xl border bg-gradient-to-br from-[#1e3a8a] via-[#2563eb] to-[#3b82f6] p-6 text-white shadow-[0_18px_40px_-18px_rgba(37,99,235,0.7)]">
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${meta.tone}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.text}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-white/70">
          <MapPin size={13} /> 本社オフィス
        </span>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm font-medium text-white/80">
          {now ? formatDateJP(now) : "—"}
        </p>
        <p className="mt-1 font-mono text-5xl font-bold tabular-nums tracking-tight sm:text-6xl">
          {now ? formatClock(now) : "--:--:--"}
        </p>
        {state === "working" && (
          <p className="mt-2 text-sm text-white/80">
            実労働 {minutesToHM(Math.max(0, elapsed))}
          </p>
        )}
        {state === "done" && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/90">
            <CheckCircle2 size={15} /> 本日の勤務を記録しました
          </p>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {(state === "before" || state === "done") && (
          <button
            onClick={clockIn}
            disabled={state === "done"}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-white py-4 text-base font-bold text-[var(--color-primary)] shadow-sm transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn size={20} /> 出勤
          </button>
        )}
        {state === "working" && (
          <>
            <button
              onClick={startBreak}
              className="flex items-center justify-center gap-2 rounded-xl bg-white/15 py-4 text-base font-bold backdrop-blur transition-colors hover:bg-white/25"
            >
              <Coffee size={19} /> 休憩
            </button>
            <button
              onClick={clockOut}
              className="flex items-center justify-center gap-2 rounded-xl bg-white py-4 text-base font-bold text-[var(--color-primary)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
            >
              <LogOut size={19} /> 退勤
            </button>
          </>
        )}
        {state === "break" && (
          <button
            onClick={endBreak}
            className="col-span-2 flex items-center justify-center gap-2 rounded-xl bg-white py-4 text-base font-bold text-[var(--color-warning)] transition-transform hover:scale-[1.01] active:scale-[0.99]"
          >
            <Play size={19} /> 休憩終了・業務再開
          </button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-center">
        <Stat icon={<LogIn size={14} />} label="出勤" value={stamp.in ?? "--:--"} />
        <Stat
          icon={<Coffee size={14} />}
          label="休憩"
          value={breakAccum.current > 0 ? minutesToHM(breakAccum.current) : "--"}
        />
        <Stat icon={<LogOut size={14} />} label="退勤" value={stamp.out ?? "--:--"} />
      </div>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="flex items-center justify-center gap-1 text-[11px] text-white/60">
        {icon}
        {label}
      </p>
      <p className="mt-0.5 font-mono text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}

function diffMin(a: string, b: string): number {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

export { Clock };
