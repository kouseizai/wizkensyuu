"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { motion } from "motion/react";
import {
  ArrowLeft,
  Mail,
  Building2,
  BadgeCheck,
  Phone,
  CalendarClock,
  Clock,
  TrendingUp,
  Palmtree,
} from "lucide-react";
import { Card, CardHeader, Badge, Avatar, Ring, StatCard, type Tone } from "@/components/ui";
import { members, memberStats } from "@/lib/mock-data";

const statusTone: Record<string, Tone> = {
  出勤中: "green",
  休憩中: "orange",
  退勤済: "blue",
  休暇: "purple",
  未出勤: "neutral",
};

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const m = members.find((x) => x.id === id);
  if (!m) notFound();

  const s = memberStats(id);
  const maxTrend = Math.max(...s.trend.map((t) => t.h));

  const stats = [
    { icon: CalendarClock, label: "今月の出勤", value: `${s.workDays}`, unit: "日" },
    { icon: Clock, label: "総労働時間", value: `${s.totalHours}`, unit: "h" },
    { icon: TrendingUp, label: "残業時間", value: `${s.otHours}`, unit: "h" },
    { icon: Palmtree, label: "有給残", value: `${s.paidRemain}`, unit: "日" },
  ];

  return (
    <div className="space-y-6">
      <Link
        href="/members"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
      >
        <ArrowLeft size={16} /> メンバー一覧へ戻る
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <div className="flex flex-col items-center text-center">
            <Avatar name={m.name} color={m.avatarColor} size={88} />
            <h2 className="mt-4 text-xl font-bold tracking-tight">{m.name}</h2>
            <p className="text-sm text-[var(--text-tertiary)]">{m.nameKana}</p>
            <div className="mt-3">
              <Badge tone={statusTone[m.status]} dot>{m.status}</Badge>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t pt-5 text-sm">
            <Row icon={<Building2 size={16} />} label="部署 / 役職" value={`${m.department} ・ ${m.role}`} />
            <Row icon={<BadgeCheck size={16} />} label="社員番号" value={m.employeeNo} />
            <Row icon={<CalendarClock size={16} />} label="勤務形態" value={m.workTypeName} />
            <Row icon={<Mail size={16} />} label="メール" value={m.email} />
            <Row icon={<Phone size={16} />} label="内線" value={`03-1234-56${m.employeeNo.slice(-2)}`} />
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((st, i) => (
              <StatCard key={st.label} {...st} delay={i * 0.05} />
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-5">
            <Card className="p-5 sm:col-span-2" delay={0.1}>
              <p className="text-sm font-semibold">今月の出勤率</p>
              <div className="mt-4 flex justify-center">
                <Ring value={s.attendanceRate} size={132} stroke={11} color="var(--green)">
                  <div className="text-center">
                    <p className="text-2xl font-bold tabular-nums">{s.attendanceRate}%</p>
                    <p className="text-[11px] text-[var(--text-tertiary)]">出勤率</p>
                  </div>
                </Ring>
              </div>
            </Card>

            <Card className="sm:col-span-3" delay={0.15}>
              <CardHeader title="直近の勤怠" />
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-[var(--surface-2)] text-left text-xs text-[var(--text-secondary)]">
                      <th className="px-5 py-2.5 font-semibold">日付</th>
                      <th className="px-5 py-2.5 font-semibold">出勤</th>
                      <th className="px-5 py-2.5 font-semibold">退勤</th>
                      <th className="px-5 py-2.5 font-semibold">実労働</th>
                    </tr>
                  </thead>
                  <tbody>
                    {s.recent.map((d) => (
                      <tr key={d.date} className="border-b transition-colors last:border-0 hover:bg-[var(--surface-2)]">
                        <td className="px-5 py-2.5 font-medium tabular-nums">{d.date}</td>
                        <td className="px-5 py-2.5 font-mono tabular-nums">
                          {d.tone === "orange" && d.in > "09:15" ? (
                            <span className="text-[var(--orange)]">{d.in}</span>
                          ) : (
                            d.in
                          )}
                        </td>
                        <td className="px-5 py-2.5 font-mono tabular-nums">
                          {d.out === "勤務中" ? <span className="text-[var(--blue)]">勤務中</span> : d.out}
                        </td>
                        <td className="px-5 py-2.5 font-mono font-semibold tabular-nums">{d.work}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* trend */}
          <Card delay={0.2}>
            <CardHeader title="労働時間の推移" desc="直近6ヶ月" />
            <div className="p-6">
              <div className="flex h-40 items-end justify-between gap-3 sm:gap-5">
                {s.trend.map((t, i) => (
                  <div key={t.m} className="flex flex-1 flex-col items-center gap-2">
                    <span className="text-xs font-semibold tabular-nums text-[var(--text-secondary)]">{t.h}h</span>
                    <div className="flex w-full max-w-[40px] flex-col justify-end">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: (t.h / maxTrend) * 130 }}
                        transition={{ duration: 0.6, delay: 0.1 + i * 0.05, ease: [0.32, 0.72, 0, 1] }}
                        className="w-full rounded-lg bg-[var(--blue)]"
                        style={{ background: m.avatarColor }}
                      />
                    </div>
                    <span className="text-xs text-[var(--text-secondary)]">{t.m}</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[var(--text-quaternary)]">{icon}</span>
      <span className="w-24 shrink-0 text-xs text-[var(--text-tertiary)]">{label}</span>
      <span className="min-w-0 flex-1 truncate text-right font-medium">{value}</span>
    </div>
  );
}
