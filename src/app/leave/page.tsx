"use client";

import { useMemo } from "react";
import {
  Palmtree,
  Plus,
  CalendarHeart,
  Gift,
  Repeat,
  ShieldAlert,
} from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, Badge, Ring, type Tone } from "@/components/ui";
import { LEAVE_LEDGER } from "@/lib/store";
import { weekdayJP } from "@/lib/utils";

const ledgerIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  年次有給休暇: Palmtree,
  特別休暇: Gift,
  代休: Repeat,
  振替休日: CalendarHeart,
};
const ledgerColor: Record<string, string> = {
  年次有給休暇: "var(--green)",
  特別休暇: "var(--purple)",
  代休: "var(--teal)",
  振替休日: "var(--blue)",
};

const history = [
  { date: "2026-05-12", type: "年次有給休暇", days: "1.0日", reason: "私用", status: "取得済" },
  { date: "2026-04-30", type: "振替休日", days: "1.0日", reason: "5/3出勤の振替", status: "取得済" },
  { date: "2026-04-18", type: "年次有給休暇", days: "0.5日", reason: "通院（午後）", status: "取得済" },
  { date: "2026-03-22", type: "特別休暇", days: "1.0日", reason: "慶弔", status: "取得済" },
  { date: "2026-05-28", type: "年次有給休暇", days: "1.0日", reason: "私用", status: "申請中" },
];

const statusTone: Record<string, Tone> = { 取得済: "neutral", 申請中: "orange" };

// leave days in May for the calendar
const leaveDaysMay: Record<number, { label: string; color: string }> = {
  12: { label: "有給", color: "var(--green)" },
  28: { label: "有給", color: "var(--green)" },
};

export default function LeavePage() {
  const paid = LEAVE_LEDGER[0];
  const obligationUsed = Math.min(5, Math.floor(paid.used));
  const obligationRatio = (obligationUsed / 5) * 100;

  const calendar = useMemo(() => {
    const first = new Date(2026, 4, 1);
    const pad = first.getDay();
    const days = new Date(2026, 5, 0).getDate();
    return [...Array(pad).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-[var(--text-secondary)]">
          休暇の付与・残数・取得状況を管理します（2026年度）
        </p>
        <Link
          href="/requests"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[var(--blue)] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-[var(--blue-hover)]"
        >
          <Plus size={17} /> 休暇を申請
        </Link>
      </div>

      {/* balance cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {LEAVE_LEDGER.map((l, i) => {
          const Icon = ledgerIcon[l.type] ?? Palmtree;
          const remain = l.granted - l.used;
          const ratio = (remain / l.granted) * 100;
          return (
            <Card key={l.type} className="p-5" delay={i * 0.05} hover>
              <div className="flex items-center gap-4">
                <Ring value={ratio} size={72} stroke={7} color={ledgerColor[l.type]}>
                  <Icon size={22} />
                </Ring>
                <div>
                  <p className="text-xs text-[var(--text-secondary)]">{l.type}</p>
                  <p className="mt-0.5 flex items-baseline gap-1">
                    <span className="text-2xl font-bold tabular-nums">{remain}</span>
                    <span className="text-sm text-[var(--text-secondary)]">/ {l.granted}日</span>
                  </p>
                  <p className="mt-0.5 text-[11px] text-[var(--text-tertiary)]">
                    取得 {l.used}日
                  </p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* obligation + calendar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5" delay={0.1}>
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-[var(--orange)]" />
            <p className="text-sm font-semibold">年5日 取得義務</p>
          </div>
          <p className="mt-1 text-xs text-[var(--text-secondary)]">
            年次有給休暇の年5日取得が義務付けられています
          </p>
          <div className="mt-5 flex items-center justify-center">
            <Ring value={obligationRatio} size={140} stroke={12} color={obligationRatio >= 100 ? "var(--green)" : "var(--orange)"}>
              <div className="text-center">
                <p className="text-3xl font-bold tabular-nums">{obligationUsed}</p>
                <p className="text-xs text-[var(--text-tertiary)]">/ 5日</p>
              </div>
            </Ring>
          </div>
          <p className="mt-4 text-center text-xs text-[var(--text-secondary)]">
            あと <span className="font-bold text-[var(--orange)]">{Math.max(0, 5 - obligationUsed)}日</span> の取得が必要です（期限 2027/3/31）
          </p>
        </Card>

        {/* calendar */}
        <Card className="lg:col-span-2" delay={0.15}>
          <CardHeader title="休暇取得カレンダー" desc="2026年 5月" />
          <div className="p-5">
            <div className="grid grid-cols-7 gap-1.5 text-center">
              {["日", "月", "火", "水", "木", "金", "土"].map((w, i) => (
                <span
                  key={w}
                  className={`pb-1 text-xs font-medium ${
                    i === 0 ? "text-[var(--red)]" : i === 6 ? "text-[var(--blue)]" : "text-[var(--text-tertiary)]"
                  }`}
                >
                  {w}
                </span>
              ))}
              {calendar.map((d, i) => {
                if (d === null) return <span key={`e${i}`} />;
                const leave = leaveDaysMay[d];
                const dow = new Date(2026, 4, d).getDay();
                const weekend = dow === 0 || dow === 6;
                return (
                  <div
                    key={d}
                    className={`flex aspect-square flex-col items-center justify-center rounded-xl border text-sm transition-colors ${
                      leave ? "border-transparent text-white" : weekend ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-3)]"
                    }`}
                    style={leave ? { background: leave.color } : undefined}
                  >
                    <span className={leave ? "font-bold" : ""}>{d}</span>
                    {leave && <span className="text-[9px] font-medium">{leave.label}</span>}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </div>

      {/* history */}
      <Card delay={0.2}>
        <CardHeader title="取得・申請履歴" desc="直近の休暇取得状況" />
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b bg-[var(--surface-2)] text-left text-xs text-[var(--text-secondary)]">
                <th className="px-5 py-3 font-semibold">取得日</th>
                <th className="px-5 py-3 font-semibold">種別</th>
                <th className="px-5 py-3 font-semibold">日数</th>
                <th className="px-5 py-3 font-semibold">理由</th>
                <th className="px-5 py-3 font-semibold">状態</th>
              </tr>
            </thead>
            <tbody>
              {history.map((h, i) => {
                const d = new Date(h.date);
                return (
                  <tr key={i} className="border-b transition-colors last:border-0 hover:bg-[var(--surface-2)]">
                    <td className="px-5 py-3 font-medium tabular-nums">
                      {h.date}（{weekdayJP(d.getDay())}）
                    </td>
                    <td className="px-5 py-3">{h.type}</td>
                    <td className="px-5 py-3 font-mono tabular-nums">{h.days}</td>
                    <td className="px-5 py-3 text-[var(--text-secondary)]">{h.reason}</td>
                    <td className="px-5 py-3">
                      <Badge tone={statusTone[h.status]} dot={h.status === "申請中"}>
                        {h.status}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
