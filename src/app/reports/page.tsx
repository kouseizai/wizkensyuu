import {
  Clock,
  TrendingUp,
  Users,
  CalendarOff,
  Download,
} from "lucide-react";
import { Card, CardHeader } from "@/components/ui";
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
  { name: "開発部", count: 3, avg: 162, ot: 15, color: "#2563eb" },
  { name: "営業部", count: 3, avg: 171, ot: 22, color: "#16a34a" },
  { name: "管理部", count: 2, avg: 148, ot: 6, color: "#7c3aed" },
];
const maxDeptOt = Math.max(...deptStats.map((d) => d.ot));

export default function ReportsPage() {
  const kpis = [
    { icon: Clock, label: "平均労働時間 / 月", value: "159.7h", sub: "前月比 +3.2%", tone: "info" },
    { icon: TrendingUp, label: "平均残業時間 / 月", value: "15.3h", sub: "上限 45h", tone: "warning" },
    { icon: Users, label: "平均出勤率", value: "96.4%", sub: "全社", tone: "success" },
    { icon: CalendarOff, label: "有給取得率", value: "62.1%", sub: "目標 70%", tone: "primary" },
  ];
  const toneBg: Record<string, string> = {
    info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
    warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
    primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-[var(--color-text-muted)]">
          全社の勤怠データ集計（2025年12月 〜 2026年5月）
        </p>
        <button className="inline-flex items-center gap-2 rounded-xl border bg-[var(--color-surface)] px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-slate-50">
          <Download size={16} /> レポート出力
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="p-5">
            <div
              className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneBg[k.tone]}`}
            >
              <k.icon size={20} />
            </div>
            <p className="text-xs text-[var(--color-text-muted)]">{k.label}</p>
            <p className="mt-1 text-2xl font-bold tabular-nums">{k.value}</p>
            <p className="mt-1 text-[11px] text-[var(--color-text-subtle)]">
              {k.sub}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* monthly bar chart */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="月別 労働時間の推移"
            desc="通常労働（青）＋ 残業（橙）"
          />
          <div className="p-6">
            <div className="flex h-56 items-end justify-between gap-4">
              {monthly.map((d) => {
                const wh = (d.work / maxWork) * 100;
                const oh = (d.ot / maxWork) * 100;
                return (
                  <div
                    key={d.m}
                    className="group flex flex-1 flex-col items-center gap-2"
                  >
                    <div className="relative flex w-full flex-1 flex-col justify-end">
                      <span className="mb-1 text-center text-xs font-semibold tabular-nums text-[var(--color-text-muted)] opacity-0 transition-opacity group-hover:opacity-100">
                        {d.work + d.ot}h
                      </span>
                      <div
                        className="w-full rounded-t-md bg-[var(--color-warning)] transition-all"
                        style={{ height: `${oh}%` }}
                      />
                      <div
                        className="w-full rounded-b-md bg-[var(--color-primary)] transition-all group-hover:brightness-110"
                        style={{ height: `${wh}%` }}
                      />
                    </div>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {d.m}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>

        {/* department breakdown */}
        <Card>
          <CardHeader title="部署別 残業時間" desc="今月の平均残業" />
          <div className="space-y-5 p-6">
            {deptStats.map((d) => (
              <div key={d.name}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium">{d.name}</span>
                  <span className="tabular-nums text-[var(--color-text-muted)]">
                    {d.ot}h
                  </span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${(d.ot / maxDeptOt) * 100}%`,
                      background: d.color,
                    }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-[var(--color-text-subtle)]">
                  {d.count}名 ・ 平均労働 {d.avg}h
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ranking */}
      <Card>
        <CardHeader title="今月の労働時間ランキング" desc="残業時間の多い順" />
        <ul className="divide-y">
          {[...members]
            .slice(0, 5)
            .map((m, i) => ({ ...m, ot: [24, 21, 18, 14, 9][i] }))
            .map((m, i) => (
              <li
                key={m.id}
                className="flex items-center gap-3 px-5 py-3.5 transition-colors hover:bg-[var(--color-surface-muted)]"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${
                    i === 0
                      ? "bg-[var(--color-warning-soft)] text-[var(--color-warning)]"
                      : "bg-slate-100 text-[var(--color-text-muted)]"
                  }`}
                >
                  {i + 1}
                </span>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ background: m.avatarColor }}
                >
                  {m.name.charAt(0)}
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-[var(--color-text-subtle)]">
                    {m.department}
                  </p>
                </div>
                <span className="font-mono text-sm font-semibold tabular-nums text-[var(--color-warning)]">
                  残業 {m.ot}h
                </span>
              </li>
            ))}
        </ul>
      </Card>
    </div>
  );
}
