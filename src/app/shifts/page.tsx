"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus, Info, Users } from "lucide-react";
import { Card, Button, Segmented, Avatar } from "@/components/ui";
import { useToast } from "@/components/Overlay";
import { buildWeekShifts, members, shiftLabels } from "@/lib/mock-data";

const { dates, rows } = buildWeekShifts();
const memberById = Object.fromEntries(members.map((m) => [m.id, m]));

export default function ShiftsPage() {
  const { toast } = useToast();
  const [view, setView] = useState<"week" | "month">("week");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="rounded-full border bg-[var(--surface)] p-2.5 transition-colors hover:bg-[var(--surface-3)]">
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[150px] text-center text-lg font-bold tracking-tight">
            {view === "week" ? "5/18 - 5/24" : "2026年 5月"}
          </span>
          <button className="rounded-full border bg-[var(--surface)] p-2.5 transition-colors hover:bg-[var(--surface-3)]">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            value={view}
            onChange={setView}
            options={[
              { value: "week", label: "週表示" },
              { value: "month", label: "月表示" },
            ]}
          />
          <Button onClick={() => toast({ kind: "info", title: "シフト追加", desc: "シフト編集パネルを開きます" })}>
            <Plus size={17} /> シフト追加
          </Button>
        </div>
      </div>

      {/* legend */}
      <div className="flex flex-wrap items-center gap-3 text-xs">
        <span className="flex items-center gap-1.5 text-[var(--text-secondary)]">
          <Info size={14} /> シフト区分：
        </span>
        {Object.entries(shiftLabels).map(([label, cfg]) => (
          <span
            key={label}
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium"
            style={{ background: cfg.bg, color: cfg.color }}
          >
            {label}
            {cfg.start && <span className="opacity-70">{cfg.start}〜{cfg.end}</span>}
          </span>
        ))}
      </div>

      {view === "week" ? <WeekView /> : <MonthView />}
    </div>
  );
}

function WeekView() {
  return (
    <Card className="overflow-hidden p-0">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[840px] border-collapse text-sm">
          <thead>
            <tr className="bg-[var(--surface-2)]">
              <th className="sticky left-0 z-10 w-44 border-b border-r bg-[var(--surface-2)] px-4 py-3 text-left text-xs font-semibold text-[var(--text-secondary)]">
                メンバー
              </th>
              {dates.map((d, i) => (
                <th
                  key={d.iso}
                  className={`border-b px-2 py-3 text-center text-xs font-semibold ${
                    i === 6 ? "text-[var(--red)]" : i === 5 ? "text-[var(--blue)]" : "text-[var(--text-secondary)]"
                  }`}
                >
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const m = memberById[row[0].memberId];
              return (
                <tr key={row[0].memberId} className="group">
                  <td className="sticky left-0 z-10 border-b border-r bg-[var(--surface)] px-4 py-3 group-hover:bg-[var(--surface-2)]">
                    <div className="flex items-center gap-2.5">
                      <Avatar name={m.name} color={m.avatarColor} size={32} />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.name}</p>
                        <p className="truncate text-[11px] text-[var(--text-tertiary)]">{m.department}</p>
                      </div>
                    </div>
                  </td>
                  {row.map((cell) => {
                    const cfg = shiftLabels[cell.label];
                    return (
                      <td
                        key={cell.date}
                        className="border-b border-l px-2 py-2 text-center align-middle group-hover:bg-[var(--surface-2)]"
                      >
                        <div
                          className="mx-auto flex min-h-[46px] w-full max-w-[92px] cursor-pointer flex-col items-center justify-center rounded-xl px-2 py-1.5 text-xs font-semibold transition-transform hover:scale-105"
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
  );
}

function MonthView() {
  const calendar = useMemo(() => {
    const first = new Date(2026, 4, 1);
    const pad = first.getDay();
    const days = new Date(2026, 5, 0).getDate();
    return [...Array(pad).fill(null), ...Array.from({ length: days }, (_, i) => i + 1)];
  }, []);

  // pseudo staffing: needed vs assigned
  const staffing = (d: number) => {
    const dow = new Date(2026, 4, d).getDay();
    if (dow === 0) return { need: 0, have: 0 };
    const need = dow === 6 ? 3 : 5;
    const have = Math.max(0, need - ((d * 7) % 3));
    return { need, have };
  };

  return (
    <Card className="overflow-hidden p-0">
      <div className="grid grid-cols-7 border-b text-center text-xs font-semibold text-[var(--text-secondary)]">
        {["日", "月", "火", "水", "木", "金", "土"].map((w, i) => (
          <div
            key={w}
            className={`py-2.5 ${i === 0 ? "text-[var(--red)]" : i === 6 ? "text-[var(--blue)]" : ""}`}
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {calendar.map((d, i) => {
          if (d === null) return <div key={`e${i}`} className="min-h-[92px] border-b border-r bg-[var(--surface-2)]" />;
          const { need, have } = staffing(d);
          const short = have < need;
          const dow = new Date(2026, 4, d).getDay();
          return (
            <div
              key={d}
              className="min-h-[92px] border-b border-r p-2 transition-colors hover:bg-[var(--surface-2)]"
            >
              <div className="flex items-center justify-between">
                <span
                  className={`text-sm font-semibold tabular-nums ${
                    dow === 0 ? "text-[var(--red)]" : dow === 6 ? "text-[var(--blue)]" : ""
                  }`}
                >
                  {d}
                </span>
                {need > 0 && (
                  <span
                    className={`inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold ${
                      short ? "bg-[var(--red-soft)] text-[var(--red)]" : "bg-[var(--green-soft)] text-[var(--green)]"
                    }`}
                  >
                    <Users size={10} />
                    {have}/{need}
                  </span>
                )}
              </div>
              {need > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {Array.from({ length: have }).map((_, k) => (
                    <span
                      key={k}
                      className="h-5 w-5 rounded-full border-2 border-[var(--surface)]"
                      style={{ background: members[k % members.length].avatarColor }}
                    />
                  ))}
                  {short &&
                    Array.from({ length: need - have }).map((_, k) => (
                      <span key={`s${k}`} className="h-5 w-5 rounded-full border border-dashed border-[var(--text-quaternary)]" />
                    ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}
