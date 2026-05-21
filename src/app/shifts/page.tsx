import { ChevronLeft, ChevronRight, Plus, Info } from "lucide-react";
import { Card } from "@/components/ui";
import {
  buildWeekShifts,
  members,
  shiftLabels,
} from "@/lib/mock-data";

const { dates, rows } = buildWeekShifts();
const memberById = Object.fromEntries(members.map((m) => [m.id, m]));

export default function ShiftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="rounded-xl border bg-[var(--color-surface)] p-2.5 transition-colors hover:bg-slate-50">
            <ChevronLeft size={18} />
          </button>
          <span className="text-center text-lg font-bold">
            2026年 5/18 - 5/24
          </span>
          <button className="rounded-xl border bg-[var(--color-surface)] p-2.5 transition-colors hover:bg-slate-50">
            <ChevronRight size={18} />
          </button>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]">
          <Plus size={17} /> シフトを追加
        </button>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
          <Info size={14} /> シフト区分：
        </span>
        {Object.entries(shiftLabels).map(([label, cfg]) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {label}
            {cfg.start && (
              <span className="opacity-70">
                {cfg.start}〜{cfg.end}
              </span>
            )}
          </span>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="bg-[var(--color-surface-muted)]">
                <th className="sticky left-0 z-10 w-44 border-b border-r bg-[var(--color-surface-muted)] px-4 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)]">
                  メンバー
                </th>
                {dates.map((d, i) => {
                  const isSun = i === 6;
                  const isSat = i === 5;
                  return (
                    <th
                      key={d.iso}
                      className={`border-b px-2 py-3 text-center text-xs font-semibold ${
                        isSun
                          ? "text-[var(--color-danger)]"
                          : isSat
                            ? "text-[var(--color-info)]"
                            : "text-[var(--color-text-muted)]"
                      }`}
                    >
                      {d.label}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => {
                const m = memberById[row[0].memberId];
                return (
                  <tr key={row[0].memberId} className="group">
                    <td className="sticky left-0 z-10 border-b border-r bg-[var(--color-surface)] px-4 py-3 group-hover:bg-[var(--color-surface-muted)]">
                      <div className="flex items-center gap-2.5">
                        <span
                          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                          style={{ background: m.avatarColor }}
                        >
                          {m.name.charAt(0)}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {m.name}
                          </p>
                          <p className="truncate text-[11px] text-[var(--color-text-subtle)]">
                            {m.department}
                          </p>
                        </div>
                      </div>
                    </td>
                    {row.map((cell) => {
                      const cfg = shiftLabels[cell.label];
                      return (
                        <td
                          key={cell.date}
                          className="border-b border-l px-2 py-2 text-center align-middle group-hover:bg-[var(--color-surface-muted)]"
                        >
                          <div
                            className="mx-auto flex min-h-[46px] w-full max-w-[92px] cursor-pointer flex-col items-center justify-center rounded-lg px-2 py-1.5 text-xs font-semibold transition-transform hover:scale-105"
                            style={{ background: cfg.bg, color: cfg.color }}
                          >
                            <span>{cell.label}</span>
                            {cell.start && (
                              <span className="mt-0.5 text-[10px] font-medium opacity-75">
                                {cell.start}-{cell.end}
                              </span>
                            )}
                          </div>
                        </td>
                      );
                    })}
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
