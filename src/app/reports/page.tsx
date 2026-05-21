"use client";

import { Clock, TrendingUp, Users, CalendarOff, Download } from "lucide-react";
import { Card, CardHeader, Avatar } from "@/components/ui";
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
    { icon: Clock, label: "平均労働時間 / 月", value: "159.7h", sub: "前月比 +3.2%", tone: "teal" },
    { icon: TrendingUp, label: "平均残業時間 / 月", value: "15.3h", sub: "上限 45h", tone: "orange" },
    { icon: Users, label: "平均出勤率", value: "96.4%", sub: "全社", tone: "green" },
    { icon: CalendarOff, label: "有給取得率", value: "62.1%", sub: "目標 70%", tone: "blue" },
  ];
  const toneBg: Record<string, string> = {
    teal: "bg-[var(--teal-soft)] text-[var(--teal)]",
    orange: "bg-[var(--orange-soft)] text-[var(--orange)]",
    green: "bg-[var(--green-soft)] text-[var(--green)]",
    blue: "bg-[var(--blue-soft)] text-[var(--blue)]",
  };

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
          <Card key={k.label} className="p-5" delay={i * 0.05} hover>
            <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneBg[k.tone]}`}>
              <k.icon size={20} />
            </div>
            <p className="text-xs text-[var(--text-secondary)]">{k.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{k.value}</p>
            <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{k.sub}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={0.1}>
          <CardHeader title="月別 労働時間の推移" desc="通常労働（青）＋ 残業（橙）" />
          <div className="p-6">
            <div className="flex h-56 items-end justify-between gap-4">
              {monthly.map((d) => {
                const wh = (d.work / maxWork) * 100;
                const oh = (d.ot / maxWork) * 100;
                return (
                  <div key={d.m} className="group flex flex-1 flex-col items-center gap-2">
                    <div className="relative flex w-full flex-1 flex-col justify-end">
                      <span className="mb-1 text-center text-xs font-semibold tabular-nums text-[var(--text-secondary)] opacity-0 transition-opacity group-hover:opacity-100">
                        {d.work + d.ot}h
                      </span>
                      <div className="w-full rounded-t-md bg-[var(--orange)] transition-all" style={{ height: `${oh}%` }} />
                      <div className="w-full rounded-b-md bg-[var(--blue)] transition-all group-hover:brightness-110" style={{ height: `${wh}%` }} />
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
