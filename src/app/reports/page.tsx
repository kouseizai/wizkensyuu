"use client";

import { motion } from "motion/react";
import { Clock, TrendingUp, Users, CalendarOff, Download } from "lucide-react";
import { Card, CardHeader, Avatar, StatCard } from "@/components/ui";
import { useToast } from "@/components/Overlay";
import { members } from "@/lib/mock-data";

const monthly = [
  { m: "12月", work: 168, ot: 12 },
  { m: "1月", work: 152, ot: 8 },
  { m: "2月", work: 160, ot: 18 },
  { m: "3月", work: 176, ot: 24 },
  { m: "4月", work: 164, ot: 14 },
  { m: "5月", work: 138, ot: 16 },
];
const maxWork = Math.max(...monthly.map((d) => d.work + d.ot));

const deptStats = [
  { name: "開発部", count: 3, avg: 162, ot: 15, color: "var(--blue)" },
  { name: "営業部", count: 3, avg: 171, ot: 22, color: "var(--green)" },
  { name: "管理部", count: 2, avg: 148, ot: 6, color: "var(--purple)" },
];
const maxDeptOt = Math.max(...deptStats.map((d) => d.ot));

export default function ReportsPage() {
  const { toast } = useToast();
  const kpis = [
    { icon: Clock, label: "平均労働時間 / 月", value: "159.7", unit: "h", sub: "全社平均", delta: { up: true, value: "+3.2%" }, trend: [152, 160, 156, 168, 162, 159], tone: "teal" as const },
    { icon: TrendingUp, label: "平均残業時間 / 月", value: "15.3", unit: "h", sub: "上限 45h", delta: { up: false, value: "-1.8h" }, trend: [12, 18, 16, 24, 14, 15], tone: "orange" as const },
    { icon: Users, label: "平均出勤率", value: "96.4", unit: "%", sub: "全社", delta: { up: true, value: "+0.6%" }, trend: [94, 95, 96, 95, 97, 96], tone: "green" as const },
    { icon: CalendarOff, label: "有給取得率", value: "62.1", unit: "%", sub: "目標 70%", delta: { up: true, value: "+4.1%" }, trend: [48, 52, 55, 58, 60, 62], tone: "indigo" as const },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--text-secondary)]">
          全社の勤怠データ集計（2025年12月 〜 2026年5月）
        </p>
        <button
          onClick={() => toast({ kind: "info", title: "レポートを出力しました", desc: "月次集計_2026-05.pdf" })}
          className="inline-flex items-center gap-2 rounded-full border bg-[var(--surface)] px-4 py-2.5 text-sm font-medium transition-colors hover:bg-[var(--surface-3)]"
        >
          <Download size={16} /> レポート出力
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k, i) => (
          <StatCard key={k.label} {...k} delay={i * 0.05} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={0.1}>
          <CardHeader
            title="月別 労働時間の推移"
            desc="通常労働（青）＋ 残業（橙）"
            action={
              <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[var(--blue)]" />通常
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[var(--orange)]" />残業
                </span>
              </div>
            }
          />
          <div className="p-6">
            <div className="flex h-56 items-end justify-between gap-3 sm:gap-5">
              {monthly.map((d, i) => {
                const wh = (d.work / maxWork) * 200;
                const oh = (d.ot / maxWork) * 200;
                return (
                  <div key={d.m} className="group flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)]">
                      {d.work + d.ot}h
                    </span>
                    <div className="flex w-full max-w-[44px] flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: oh }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                        className="w-full rounded-t-lg bg-[var(--orange)]"
                      />
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: wh }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.06, ease: [0.32, 0.72, 0, 1] }}
                        className="w-full rounded-b-lg bg-[var(--blue)] transition-[filter] group-hover:brightness-110"
                      />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{d.m}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        <Card delay={0.15}>
          <CardHeader title="部署別 残業時間" desc="今月の平均残業" />
          <div className="space-y-5 p-6">
            {deptStats.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="tabular-nums text-[var(--text-secondary)]">{d.ot}h</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-[var(--surface-3)]">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(d.ot / maxDeptOt) * 100}%`, background: d.color }} />
                </div>
                <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{d.count}名 ・ 平均労働 {d.avg}h</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card delay={0.2}>
        <CardHeader title="今月の労働時間ランキング" desc="残業時間の多い順" />
        <ul className="divide-y">
          {[...members]
            .slice(0, 5)
            .map((m, i) => ({ ...m, ot: [24, 21, 18, 14, 9][i] }))
            .map((m, i) => (
              <li key={m.id} className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--surface-2)]">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    i === 0 ? "bg-[var(--orange-soft)] text-[var(--orange)]" : "bg-[var(--surface-3)] text-[var(--text-secondary)]"
                  }`}
                >
                  {i + 1}
                </span>
                <Avatar name={m.name} color={m.avatarColor} size={32} />
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-[var(--text-tertiary)]">{m.department}</p>
                </div>
                <span className="font-mono text-sm font-semibold tabular-nums text-[var(--orange)]">残業 {m.ot}h</span>
              </li>
            ))}
        </ul>
      </Card>
    </div>
  );
}
