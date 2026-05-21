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
import { Card, CardHeader, Badge } from "@/components/ui";
import {
  buildMonthlyAttendance,
  summarize,
  members,
  leaveRequests,
} from "@/lib/mock-data";
import { minutesToHM } from "@/lib/utils";

const records = buildMonthlyAttendance();
const sum = summarize(records);

const statusTone: Record<string, "success" | "warning" | "primary" | "neutral"> = {
  出勤中: "success",
  休憩中: "warning",
  退勤済: "primary",
  休暇: "neutral",
  未出勤: "neutral",
};

const activity = [
  { icon: LogIn, name: "佐藤 花子", action: "出勤しました", time: "09:02", tone: "text-[var(--color-success)]" },
  { icon: Coffee, name: "鈴木 一郎", action: "休憩を開始しました", time: "12:15", tone: "text-[var(--color-warning)]" },
  { icon: FileCheck2, name: "渡辺 翔", action: "有給休暇を申請しました", time: "14:32", tone: "text-[var(--color-primary)]" },
  { icon: LogOut, name: "田中 健", action: "退勤しました", time: "18:48", tone: "text-[var(--color-primary)]" },
  { icon: LogIn, name: "中村 由美", action: "出勤しました", time: "08:51", tone: "text-[var(--color-success)]" },
];

export default function DashboardPage() {
  const monthTarget = 22 * 8 * 60; // 22営業日 × 8h
  const progress = Math.min(100, Math.round((sum.totalWork / monthTarget) * 100));
  const working = members.filter((m) => m.status === "出勤中").length;
  const onBreak = members.filter((m) => m.status === "休憩中").length;
  const pending = leaveRequests.filter((r) => r.status === "承認待ち").length;

  const stats = [
    {
      icon: CalendarCheck,
      label: "今月の出勤日数",
      value: `${sum.workDays}`,
      unit: "日",
      sub: "予定 22日",
      tone: "primary" as const,
    },
    {
      icon: Clock,
      label: "今月の総労働時間",
      value: minutesToHM(sum.totalWork).replace("時間", "").split("分")[0],
      unit: "時間",
      sub: `残業 ${minutesToHM(sum.overtime)}`,
      tone: "info" as const,
    },
    {
      icon: TrendingUp,
      label: "残業時間",
      value: `${Math.floor(sum.overtime / 60)}`,
      unit: "時間",
      sub: "上限 45時間/月",
      tone: "warning" as const,
    },
    {
      icon: CalendarDays,
      label: "有給休暇 残日数",
      value: "12.5",
      unit: "日",
      sub: "付与 20日",
      tone: "success" as const,
    },
  ];

  const toneBg: Record<string, string> = {
    primary: "bg-[var(--color-primary-soft)] text-[var(--color-primary)]",
    info: "bg-[var(--color-info-soft)] text-[var(--color-info)]",
    warning: "bg-[var(--color-warning-soft)] text-[var(--color-warning)]",
    success: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  };

  return (
    <div className="space-y-6">
      {/* greeting */}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-[var(--color-text-muted)]">
            こんにちは、山田 太郎さん 👋
          </p>
          <p className="text-xl font-bold">本日も一日よろしくお願いします</p>
        </div>
        <Badge tone="warning" className="gap-2">
          <AlertTriangle size={14} />
          未退勤の打刻があります
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* punch clock */}
        <div className="lg:col-span-1">
          <PunchClock />
        </div>

        {/* stat cards + progress */}
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s) => (
              <Card key={s.label} className="p-4">
                <div
                  className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneBg[s.tone]}`}
                >
                  <s.icon size={20} />
                </div>
                <p className="text-xs text-[var(--color-text-muted)]">
                  {s.label}
                </p>
                <p className="mt-1 flex items-baseline gap-1">
                  <span className="text-2xl font-bold tabular-nums">
                    {s.value}
                  </span>
                  <span className="text-sm text-[var(--color-text-muted)]">
                    {s.unit}
                  </span>
                </p>
                <p className="mt-1 text-[11px] text-[var(--color-text-subtle)]">
                  {s.sub}
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">今月の労働時間の進捗</p>
                <p className="text-xs text-[var(--color-text-muted)]">
                  2026年5月 ・ 所定 {minutesToHM(monthTarget)}
                </p>
              </div>
              <span className="text-2xl font-bold text-[var(--color-primary)]">
                {progress}%
              </span>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[#60a5fa] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              <MiniStat label="実労働" value={minutesToHM(sum.totalWork)} />
              <MiniStat label="遅刻" value={`${sum.lateCount}回`} />
              <MiniStat label="有給取得" value={`${sum.paidLeave}日`} />
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* team status */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="メンバーの勤務状況"
            desc={`出勤中 ${working}名 ・ 休憩中 ${onBreak}名`}
            action={
              <a
                href="/members"
                className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--color-primary)] hover:underline"
              >
                全員を見る <ArrowUpRight size={14} />
              </a>
            }
          />
          <ul className="divide-y">
            {members.slice(0, 6).map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-[var(--color-surface-muted)]"
              >
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
                  style={{ background: m.avatarColor }}
                >
                  {m.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-[var(--color-text-subtle)]">
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

        {/* activity */}
        <Card>
          <CardHeader title="最近のアクティビティ" desc="本日の打刻・申請ログ" />
          <ul className="space-y-1 p-3">
            {activity.map((a, i) => (
              <li
                key={i}
                className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-[var(--color-surface-muted)]"
              >
                <span className={`mt-0.5 ${a.tone}`}>
                  <a.icon size={18} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold">{a.name}</span>
                    <span className="text-[var(--color-text-muted)]">
                      {" "}
                      さんが{a.action}
                    </span>
                  </p>
                </div>
                <span className="font-mono text-xs text-[var(--color-text-subtle)]">
                  {a.time}
                </span>
              </li>
            ))}
          </ul>
          {pending > 0 && (
            <div className="border-t px-5 py-3">
              <a
                href="/requests"
                className="flex items-center justify-between rounded-xl bg-[var(--color-warning-soft)] px-4 py-3 text-sm transition-colors hover:brightness-95"
              >
                <span className="flex items-center gap-2 font-medium text-[var(--color-warning)]">
                  <FileCheck2 size={16} />
                  承認待ちの申請が{pending}件あります
                </span>
                <ArrowUpRight size={15} className="text-[var(--color-warning)]" />
              </a>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface-muted)] py-2.5">
      <p className="text-[11px] text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
