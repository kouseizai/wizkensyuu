"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  LogIn,
  LogOut,
  Coffee,
  Play,
  MapPin,
  CheckCircle2,
  Globe,
} from "lucide-react";
import { useStore, derivePunch, type PunchType } from "@/lib/store";
import { useToast } from "@/components/Overlay";
import { formatClock, formatDateJP, minutesToHM } from "@/lib/utils";

const statusMeta: Record<
  string,
  { text: string; chip: string; dot: string }
> = {
  before: { text: "未出勤", chip: "bg-white/10 text-white/80", dot: "bg-white/50" },
  working: { text: "勤務中", chip: "bg-white/12 text-white", dot: "bg-[#6fcf97]" },
  break: { text: "休憩中", chip: "bg-white/12 text-white", dot: "bg-[#e0b15e]" },
  done: { text: "退勤済", chip: "bg-white/12 text-white", dot: "bg-[#8fb8e8]" },
};

const eventLabel: Record<PunchType, string> = {
  clock_in: "出勤",
  clock_out: "退勤",
  break_start: "休憩開始",
  break_end: "休憩終了",
};

export default function PunchClock() {
  const { punches, addPunch, hydrated } = useStore();
  const { toast } = useToast();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const t = () => setNow(new Date());
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  const { status, clockIn, clockOut, breakMin } = derivePunch(punches);
  const meta = statusMeta[status];

  const elapsed =
    clockIn && now
      ? Math.max(
          0,
          now.getHours() * 60 +
            now.getMinutes() -
            (Number(clockIn.split(":")[0]) * 60 + Number(clockIn.split(":")[1])) -
            breakMin
        )
      : 0;

  const punch = (type: PunchType) => {
    addPunch(type);
    toast({
      kind: "success",
      title: `${eventLabel[type]}を記録しました`,
      desc: now ? formatClock(now).slice(0, 5) : undefined,
    });
  };

  return (
    <div
      className="overflow-hidden rounded-[var(--radius-2xl)] p-6 text-white shadow-[0_20px_44px_-20px_rgba(79,70,229,0.6)]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 82% 0%, rgba(255,255,255,0.2), transparent 42%), radial-gradient(circle at 0% 100%, rgba(167,139,250,0.35), transparent 52%), linear-gradient(135deg, #312c8f 0%, #4f46e5 55%, #6d5ce8 100%)",
      }}
    >
      <div className="flex items-center justify-between">
        <motion.span
          layout
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold backdrop-blur ${meta.chip}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot} ${status === "working" ? "animate-pulse" : ""}`} />
          {meta.text}
        </motion.span>
        <span className="flex items-center gap-1.5 text-xs text-white/70">
          <MapPin size={13} /> 本社オフィス
        </span>
      </div>

      <div className="mt-5 text-center">
        <p className="text-sm font-medium text-white/80">
          {now ? formatDateJP(now) : "—"}
        </p>
        <p className="mt-1 font-mono text-5xl font-bold tabular-nums tracking-tight sm:text-[3.4rem]">
          {now ? formatClock(now) : "--:--:--"}
        </p>
        <AnimatePresence mode="wait">
          {status === "working" && (
            <motion.p
              key="elapsed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-sm text-white/85"
            >
              実労働 {minutesToHM(elapsed)}
            </motion.p>
          )}
          {status === "done" && (
            <motion.p
              key="done"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 inline-flex items-center gap-1.5 text-sm text-white/90"
            >
              <CheckCircle2 size={15} /> 本日の勤務を記録しました
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {(status === "before" || status === "done") && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => punch("clock_in")}
            disabled={status === "done" || !hydrated}
            className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-bold text-[var(--accent)] shadow-sm transition-transform disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogIn size={20} /> 出勤
          </motion.button>
        )}
        {status === "working" && (
          <>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => punch("break_start")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white/15 py-4 text-base font-bold backdrop-blur transition-colors hover:bg-white/25"
            >
              <Coffee size={19} /> 休憩
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => punch("clock_out")}
              className="flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-bold text-[var(--accent)]"
            >
              <LogOut size={19} /> 退勤
            </motion.button>
          </>
        )}
        {status === "break" && (
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => punch("break_end")}
            className="col-span-2 flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-base font-bold text-[var(--orange)]"
          >
            <Play size={19} /> 休憩終了・業務再開
          </motion.button>
        )}
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-t border-white/15 pt-4 text-center">
        <Stat icon={<LogIn size={13} />} label="出勤" value={clockIn ?? "--:--"} />
        <Stat
          icon={<Coffee size={13} />}
          label="休憩"
          value={breakMin > 0 ? minutesToHM(breakMin) : "--"}
        />
        <Stat icon={<LogOut size={13} />} label="退勤" value={clockOut ?? "--:--"} />
      </div>

      {/* today's timeline */}
      {punches.length > 0 && (
        <div className="mt-4 space-y-1.5 border-t border-white/15 pt-4">
          <p className="flex items-center gap-1.5 text-[11px] text-white/60">
            <Globe size={12} /> 本日の打刻履歴
          </p>
          <div className="flex flex-wrap gap-1.5">
            {punches.map((p) => (
              <span
                key={p.id}
                className="rounded-lg bg-white/10 px-2 py-1 font-mono text-[11px] tabular-nums backdrop-blur"
              >
                {eventLabel[p.type]} {p.time}
              </span>
            ))}
          </div>
        </div>
      )}
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
