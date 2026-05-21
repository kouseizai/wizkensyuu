"use client";

import Link from "next/link";
import {
  CalendarCheck,
  Clock,
  TrendingUp,
  CalendarDays,
  AlertTriangle,
  ArrowUpRight,
  LogIn,
  LogOut,
  Coffee,
  FileCheck2,
} from "lucide-react";
import PunchClock from "@/components/PunchClock";
import { Card, CardHeader, Badge, Avatar, Ring, type Tone } from "@/components/ui";
import { useStore } from "@/lib/store";
import { summarize } from "@/lib/mock-data";
import { minutesToHM } from "@/lib/utils";

const statusTone: Record<string, Tone> = {
  出勤中: "green",
  休憩中: "orange",
  退勤済: "blue",
  休暇: "purple",
  未出勤: "neutral",
};

const activity = [
  { icon: LogIn, name: "佐藤 花子", action: "出勤しました", time: "09:02", tone: "var(--green)" },
  { icon: Coffee, name: "鈴木 一郎", action: "休憩を開始しました", time: "12:15", tone: "var(--orange)" },
  { icon: FileCheck2, name: "渡辺 翔", action: "有給休暇を申請しました", time: "14:32", tone: "var(--blue)" },
  { icon: LogOut, name: "田中 健", action: "退勤しました", time: "18:48", tone: "var(--blue)" },
  { icon: LogIn, name: "中村 由美", action: "出勤しました", time: "08:51", tone: "var(--green)" },
];

export default function DashboardPage() {
  const { records, members, requests } = useStore();
  const sum = summarize(records);

  const monthTarget = 22 * 8 * 60;
  const progress = Math.min(100, Math.round((sum.totalWork / monthTarget) * 100));
  const working = members.filter((m) => m.status === "出勤中").length;
  const onBreak = members.filter((m) => m.status === "休憩中").length;
  const pending = requests.filter((r) => r.status === "承認待ち").length;

  const stats = [
    { icon: CalendarCheck, label: "今月の出勤日数", value: `${sum.workDays}`, unit: "日", sub: "予定 22日", tone: "blue" },
    { icon: Clock, label: "今月の総労働時間", value: `${Math.floor(sum.totalWork / 60)}`, unit: "時間", sub: `残業 ${minutesToHM(sum.overtime)}`, tone: "teal" },
    { icon: TrendingUp, label: "残業時間", value: `${Math.floor(sum.overtime / 60)}`, unit: "時間", sub: "上限 45時間/月", tone: "orange" },
    { icon: CalendarDays, label: "有給休暇 残日数", value: "12.5", unit: "日", sub: "付与 20日", tone: "green" },
  ] as const;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--text-secondary)]">2026年5月21日（木）</p>
          <p className="text-2xl font-bold tracking-tight">おはようございます、山田 太郎さん</p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--text-secondary)] shadow-[var(--shadow-sm)] ring-1 ring-[var(--hairline)]">
          <AlertTriangle size={14} className="text-[var(--orange)]" />
          5/19 の退勤打刻が未入力です
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <PunchClock />
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, i) => (
              <Card key={s.label} className="p-4" delay={i * 0.05} hover>
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--surface-3)] text-[var(--text-secondary)]">
                  <s.icon size={18} />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tabular-nums">{s.value}</span>
                  <span className="text-sm text-[var(--text-secondary)]">{s.unit}</span>
                </p>
                <p className="mt-1 text-[11px] text-[var(--text-tertiary)]">{s.sub}</p>
              </Card>
            ))}
          </div>

          <Card className="p-5" delay={0.2}>
            <div className="flex items-center gap-5">
              <Ring value={progress} size={92} stroke={9}>
                <span className="text-xl font-bold tabular-nums">{progress}%</span>
              </Ring>
              <div className="flex-1">
                <p className="text-sm font-semibold">今月の労働時間の進捗</p>
                <p className="text-xs text-[var(--text-secondary)]">
                  2026年5月 ・ 所定 {minutesToHM(monthTarget)}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                  <MiniStat label="実労働" value={minutesToHM(sum.totalWork)} />
                  <MiniStat label="遅刻" value={`${sum.lateCount}回`} />
                  <MiniStat label="有給取得" value={`${sum.paidLeave}日`} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" delay={0.1}>
          <CardHeader
            title="メンバーの勤務状況"
            desc={`出勤中 ${working}名 ・ 休憩中 ${onBreak}名`}
            action={
              <Link
                href="/members"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--blue)] hover:underline"
              >
                全員を見る <ArrowUpRight size={14} />
              </Link>
            }
          />
          <ul className="divide-y">
            {members.slice(0, 6).map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--surface-2)]"
              >
                <Avatar name={m.name} color={m.avatarColor} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-[var(--text-tertiary)]">
                    {m.department} ・ {m.role}
                  </p>
                </div>
                <Badge tone={statusTone[m.status]} dot>
                  {m.status}
                </Badge>
              </li>
            ))}
          </ul>
        </Card>

        <Card delay={0.15}>
          <CardHeader title="最近のアクティビティ" desc="本日の打刻・申請ログ" />
          <ul className="space-y-1 p-3">
            {activity.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--surface-2)]"
              >
                <span className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--surface-3)] text-[var(--text-secondary)]">
                  <a.icon size={15} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{a.name}</span>
                    <span className="text-[var(--text-secondary)]">
                      {" "}さんが{a.action}
                    </span>
                  </p>
                </div>
                <span className="font-mono text-xs text-[var(--text-tertiary)]">
                  {a.time}
                </span>
              </li>
            ))}
          </ul>
          {pending > 0 && (
            <div className="border-t px-5 py-3">
              <Link
                href="/requests"
                className="flex items-center justify-between rounded-xl bg-[var(--orange-soft)] px-4 py-3 text-sm transition-colors hover:brightness-95"
              >
                <span className="flex items-center gap-2 font-medium text-[var(--orange)]">
                  <FileCheck2 size={16} />
                  承認待ちの申請が{pending}件あります
                </span>
                <ArrowUpRight size={15} className="text-[var(--orange)]" />
              </Link>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--surface-3)] py-2">
      <p className="text-[11px] text-[var(--text-secondary)]">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
