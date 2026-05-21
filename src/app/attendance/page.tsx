"use client";

import { useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Clock,
  CalendarCheck,
  TrendingUp,
  Coffee,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import {
  buildMonthlyAttendance,
  summarize,
  type AttendanceStatus,
} from "@/lib/mock-data";
import { minutesToHM, workMinutes } from "@/lib/utils";

const statusMeta: Record<
  AttendanceStatus,
  { label: string; tone: "success" | "warning" | "danger" | "primary" | "info" | "neutral" }
> = {
  normal: { label: "通常", tone: "success" },
  overtime: { label: "残業", tone: "info" },
  late: { label: "遅刻", tone: "warning" },
  early: { label: "早退", tone: "warning" },
  absent: { label: "欠勤", tone: "danger" },
  holiday: { label: "休日", tone: "neutral" },
  paid_leave: { label: "有給", tone: "primary" },
  pending: { label: "未打刻", tone: "neutral" },
};

const records = buildMonthlyAttendance();
const sum = summarize(records);

export default function AttendancePage() {
  const [filter, setFilter] = useState<"all" | "work" | "leave">("all");

  const rows = useMemo(() => {
    if (filter === "work")
      return records.filter((r) => r.clockIn != null);
    if (filter === "leave")
      return records.filter(
        (r) => r.status === "paid_leave" || r.status === "absent"
      );
    return records;
  }, [filter]);

  const summary = [
    { icon: CalendarCheck, label: "出勤日数", value: `${sum.workDays}日`, tone: "primary" },
    { icon: Clock, label: "総労働時間", value: minutesToHM(sum.totalWork), tone: "info" },
    { icon: TrendingUp, label: "残業時間", value: minutesToHM(sum.overtime), tone: "warning" },
    { icon: Coffee, label: "有給取得", value: `${sum.paidLeave}日`, tone: "success" },
  ];
  const toneBg: Record<string, string> = {
    primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
    warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  };

  return (
    <div className="space-y-6">
      {/* month switcher + actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="rounded-xl border bg-[var(--color-surface)] p-2.5 transition-colors hover:bg-slate-50">
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[140px] text-center text-lg font-bold">
            2026年 5月
          </span>
          <button className="rounded-xl border bg-[var(--color-surface)] p-2.5 transition-colors hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl border bg-[var(--color-surface)] p-1 text-sm">
            {[
              { k: "all", l: "全日" },
              { k: "work", l: "勤務日" },
              { k: "leave", l: "休暇" },
            ].map((f) => (
              <button
                key={f.k}
                onClick={() => setFilter(f.k as typeof filter)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  filter === f.k
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {f.l}
              </button>
            ))}
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]">
            <Download size={16} /> CSV出力
          </button>
        </div>
      </div>

      {/* summary */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneBg[s.tone]}`}
            >
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">{s.label}</p>
              <p className="text-lg font-bold tabular-nums">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b bg-[var(--color-surface-muted)] text-left text-xs text-[var(--color-text-muted)]">
                <th className="px-4 py-3 font-semibold">日付</th>
                <th className="px-4 py-3 font-semibold">区分</th>
                <th className="px-4 py-3 font-semibold">出勤</th>
                <th className="px-4 py-3 font-semibold">退勤</th>
                <th className="px-4 py-3 font-semibold">休憩</th>
                <th className="px-4 py-3 font-semibold">実労働</th>
                <th className="px-4 py-3 font-semibold">残業</th>
                <th className="px-4 py-3 font-semibold">備考</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const wm = workMinutes(r.clockIn, r.clockOut, r.breakMin);
                const ot = wm && wm > 480 ? wm - 480 : 0;
                const isSat = r.weekday === "土";
                const isSun = r.weekday === "日";
                return (
                  <tr
                    key={r.date}
                    className="border-b transition-colors last:border-0 hover:bg-[var(--color-surface-muted)]"
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-medium tabular-nums">
                        {r.day}日
                      </span>
                      <span
                        className={`ml-1.5 text-xs ${
                          isSun
                            ? "text-[var(--color-danger)]"
                            : isSat
                              ? "text-[var(--color-info)]"
                              : "text-[var(--color-text-subtle)]"
                        }`}
                      >
                        ({r.weekday})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusMeta[r.status].tone}>
                        {statusMeta[r.status].label}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {r.clockIn ?? "—"}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {r.clockOut ?? (r.clockIn ? "勤務中" : "—")}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-[var(--color-text-muted)]">
                      {r.clockIn ? `${r.breakMin}分` : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold tabular-nums">
                      {wm != null && r.clockOut ? minutesToHM(wm, "colon") : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {ot > 0 ? (
                        <span className="text-[var(--color-warning)]">
                          {minutesToHM(ot, "colon")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-[180px] truncate px-4 py-3 text-xs text-[var(--color-text-muted)]">
                      {r.note ?? ""}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        className="rounded-lg p-1.5 text-[var(--color-text-subtle)] transition-colors hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                        title="打刻を修正"
                      >
                        <Pencil size={15} />
                      </button>
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
