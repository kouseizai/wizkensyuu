"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import {
  LogIn,
  LogOut,
  Coffee,
  Play,
  MapPin,
  Wifi,
  ArrowLeft,
  Delete,
  CreditCard,
  QrCode,
  KeyRound,
  CircleCheck,
  Lock,
  ScanLine,
} from "lucide-react";
import { useStore, derivePunch, type PunchType } from "@/lib/store";
import { formatClock, formatDateJP } from "@/lib/utils";

const methods = [
  { key: "pin", label: "PIN", icon: KeyRound },
  { key: "ic", label: "ICカード", icon: CreditCard },
  { key: "qr", label: "QRコード", icon: QrCode },
] as const;

export default function KioskPage() {
  const { punches, addPunch, resetPunch } = useStore();
  const [now, setNow] = useState<Date | null>(null);
  const [method, setMethod] = useState<"pin" | "ic" | "qr">("pin");
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [done, setDone] = useState<null | { type: PunchType; time: string }>(null);

  useEffect(() => {
    const t = () => setNow(new Date());
    t();
    const id = setInterval(t, 1000);
    return () => clearInterval(id);
  }, []);

  // PIN: auto-auth at 4 digits
  useEffect(() => {
    if (pin.length === 4) setAuthed(true);
  }, [pin]);

  // reset auth when switching method
  useEffect(() => {
    setAuthed(false);
    setPin("");
  }, [method]);

  const { status } = derivePunch(punches);

  const allowed: Record<PunchType, boolean> = {
    clock_in: status === "before" || status === "done",
    break_start: status === "working",
    break_end: status === "break",
    clock_out: status === "working" || status === "break",
  };

  const punch = (type: PunchType) => {
    if (!authed || !allowed[type]) return;
    const now2 = new Date();
    addPunch(type, method === "ic" ? "ic" : "kiosk");
    setDone({
      type,
      time: `${String(now2.getHours()).padStart(2, "0")}:${String(now2.getMinutes()).padStart(2, "0")}`,
    });
    // re-lock for the next person
    setAuthed(false);
    setPin("");
    setTimeout(() => setDone(null), 2600);
  };

  const labelOf: Record<PunchType, string> = {
    clock_in: "出勤",
    clock_out: "退勤",
    break_start: "休憩開始",
    break_end: "休憩終了",
  };

  return (
    <div className="relative flex min-h-screen flex-col bg-gradient-to-br from-[#0b1220] via-[#11244a] to-[#0b1220] text-white">
      <div className="flex items-center justify-between px-6 py-5">
        <Link
          href="/login"
          className="flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium backdrop-blur transition-colors hover:bg-white/20"
        >
          <ArrowLeft size={16} /> 戻る
        </Link>
        <div className="flex items-center gap-4 text-sm text-white/70">
          <span className="flex items-center gap-1.5">
            <MapPin size={15} /> 本社オフィス
          </span>
          <span className="flex items-center gap-1.5">
            <Wifi size={15} /> 192.168.1.24
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 pb-12">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <p className="text-base font-medium text-white/70">{now ? formatDateJP(now) : "—"}</p>
          <p className="mt-1 font-mono text-7xl font-bold tabular-nums tracking-tight sm:text-8xl">
            {now ? formatClock(now) : "--:--:--"}
          </p>
        </motion.div>

        <AnimatePresence>
          {done && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                className="flex flex-col items-center gap-4 rounded-[32px] bg-white/10 px-16 py-12 text-center backdrop-blur-xl"
              >
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.1 }}>
                  <CircleCheck size={72} className="text-green-400" />
                </motion.div>
                <div>
                  <p className="text-2xl font-bold">山田 太郎 さん</p>
                  <p className="mt-1 text-lg text-white/80">{labelOf[done.type]}を記録しました</p>
                  <p className="mt-2 font-mono text-3xl font-bold tabular-nums">{done.time}</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid w-full max-w-3xl gap-6 md:grid-cols-2">
          {/* auth card */}
          <div className="rounded-[28px] border border-white/10 bg-white/[0.06] p-6 backdrop-blur-xl">
            <div className="mb-5 flex gap-2 rounded-full bg-white/10 p-1">
              {methods.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMethod(m.key)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-full py-2 text-sm font-medium transition-colors ${
                    method === m.key ? "bg-white text-[#11244a]" : "text-white/70 hover:text-white"
                  }`}
                >
                  <m.icon size={15} /> {m.label}
                </button>
              ))}
            </div>

            {method === "pin" && (
              <div>
                <div
                  className={`mb-4 flex h-12 items-center justify-center gap-3 rounded-xl font-mono text-2xl tracking-[0.4em] transition-colors ${
                    authed ? "bg-green-500/20 text-green-300" : "bg-white/10"
                  }`}
                >
                  {authed ? (
                    <span className="flex items-center gap-2 text-base tracking-normal">
                      <CircleCheck size={18} /> 認証OK
                    </span>
                  ) : pin ? (
                    "•".repeat(pin.length) + "○".repeat(4 - pin.length)
                  ) : (
                    <span className="text-base tracking-normal text-white/40">4桁のPINを入力</span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "del"].map((k, i) =>
                    k === "" ? (
                      <span key={i} />
                    ) : (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.92 }}
                        onClick={() =>
                          k === "del"
                            ? (setPin((p) => p.slice(0, -1)), setAuthed(false))
                            : pin.length < 4 && setPin((p) => p + k)
                        }
                        className="flex h-14 items-center justify-center rounded-xl bg-white/10 text-xl font-semibold backdrop-blur transition-colors hover:bg-white/20"
                      >
                        {k === "del" ? <Delete size={20} /> : k}
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            )}

            {method === "ic" && (
              <div className="flex flex-col items-center justify-center gap-4 py-8 text-center">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setAuthed(true)}
                  animate={authed ? {} : { scale: [1, 1.06, 1] }}
                  transition={{ duration: 1.8, repeat: authed ? 0 : Infinity }}
                  className={`flex h-24 w-24 items-center justify-center rounded-3xl transition-colors ${
                    authed ? "bg-green-500/25 text-green-300" : "bg-white/10"
                  }`}
                >
                  {authed ? <CircleCheck size={44} /> : <CreditCard size={44} />}
                </motion.button>
                <p className="text-white/70">
                  {authed ? "認証OK" : "ICカードをタップして認証（デモ）"}
                </p>
              </div>
            )}

            {method === "qr" && (
              <div className="flex flex-col items-center justify-center gap-4 py-6 text-center">
                <button onClick={() => setAuthed(true)} className="relative grid h-32 w-32 grid-cols-5 grid-rows-5 gap-1 rounded-2xl bg-white p-3">
                  {Array.from({ length: 25 }).map((_, i) => (
                    <span
                      key={i}
                      className={`rounded-sm ${
                        [0, 1, 4, 5, 6, 9, 12, 14, 18, 20, 22, 24].includes(i) ? "bg-[#11244a]" : "bg-transparent"
                      }`}
                    />
                  ))}
                  {!authed && (
                    <ScanLine size={28} className="absolute inset-0 m-auto animate-pulse text-[#11244a]/40" />
                  )}
                </button>
                <p className="text-white/70">{authed ? "認証OK" : "QRをタップして読み取り（デモ）"}</p>
              </div>
            )}
          </div>

          {/* punch buttons */}
          <div className="flex flex-col gap-3">
            {!authed && (
              <div className="flex items-center gap-2 rounded-xl bg-amber-400/15 px-4 py-2.5 text-sm text-amber-200">
                <Lock size={15} /> 打刻するには本人認証が必要です
              </div>
            )}
            <PunchBtn
              onClick={() => punch("clock_in")}
              enabled={authed && allowed.clock_in}
              authed={authed}
              icon={<LogIn size={26} />}
              label="出勤"
              tone="from-emerald-400 to-emerald-600"
            />
            <div className="grid grid-cols-2 gap-3">
              <PunchBtn
                onClick={() => punch(status === "break" ? "break_end" : "break_start")}
                enabled={authed && (allowed.break_start || allowed.break_end)}
                authed={authed}
                icon={status === "break" ? <Play size={22} /> : <Coffee size={22} />}
                label={status === "break" ? "休憩終了" : "休憩"}
                tone="from-amber-400 to-amber-600"
                small
              />
              <PunchBtn
                onClick={() => punch("clock_out")}
                enabled={authed && allowed.clock_out}
                authed={authed}
                icon={<LogOut size={22} />}
                label="退勤"
                tone="from-sky-400 to-blue-600"
                small
              />
            </div>
            <button
              onClick={resetPunch}
              className="mt-1 rounded-xl bg-white/5 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
            >
              本日の打刻をリセット（デモ用）
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PunchBtn({
  onClick,
  enabled,
  authed,
  icon,
  label,
  tone,
  small,
}: {
  onClick: () => void;
  enabled: boolean;
  authed: boolean;
  icon: React.ReactNode;
  label: string;
  tone: string;
  small?: boolean;
}) {
  return (
    <motion.button
      whileTap={{ scale: enabled ? 0.97 : 1 }}
      onClick={onClick}
      disabled={!enabled}
      className={`flex ${small ? "h-28 flex-col" : "h-24 flex-row"} items-center justify-center gap-2 rounded-[24px] font-bold transition-all ${
        enabled
          ? `bg-gradient-to-br ${tone} text-white shadow-lg`
          : "border border-white/10 bg-white/[0.04] text-white/35"
      }`}
    >
      {!authed ? <Lock size={small ? 20 : 22} /> : icon}
      <span className={small ? "text-lg" : "text-2xl"}>{label}</span>
    </motion.button>
  );
}
