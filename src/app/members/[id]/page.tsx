"use client";

import { use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
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
import { Card, CardHeader, Badge, Avatar, Ring, type Tone } from "@/components/ui";
import { members } from "@/lib/mock-data";

const statusTone: Record<string, Tone> = {
  出勤中: "green",
  休憩中: "orange",
  退勤済: "blue",
  休暇: "purple",
  未出勤: "neutral",
};

const recentDays = [
  { date: "5/21", in: "08:58", out: "勤務中", work: "—", tone: "blue" },
  { date: "5/20", in: "09:00", out: "21:15", work: "11:15", tone: "orange" },
  { date: "5/19", in: "09:00", out: "18:00", work: "8:00", tone: "green" },
  { date: "5/16", in: "09:00", out: "18:00", work: "8:00", tone: "green" },
  { date: "5/15", in: "09:42", out: "18:30", work: "7:48", tone: "orange" },
];

export default function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const m = members.find((x) => x.id === id);
  if (!m) notFound();

  const stats = [
    { icon: CalendarClock, label: "今月の出勤", value: "15日", tone: "blue" },
    { icon: Clock, label: "総労働時間", value: "138h", tone: "teal" },
    { icon: TrendingUp, label: "残業時間", value: "16h", tone: "orange" },
    { icon: Palmtree, label: "有給残", value: "12.5日", tone: "green" },
  ];
  const toneBg: Record<string, string> = {
    blue: "bg-[var(--blue-soft)] text-[var(--blue)]",
    teal: "bg-[var(--teal-soft)] text-[var(--teal)]",
    orange: "bg-[var(--orange-soft)] text-[var(--orange)]",
    green: "bg-[var(--green-soft)] text-[var(--green)]",
  };

  return (
    <div className="space-y-6">
      <Link
        href="/members"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
      >
        <ArrowLeft size={16} /> メンバー一覧へ戻る
      </Link>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* profile */}
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
            <Row icon={<Phone size={16} />} label="内線" value="03-1234-56xx" />
          </div>
        </Card>

        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((s, i) => (
              <Card key={s.label} className="p-4" delay={i * 0.05}>
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneBg[s.tone]}`}>
                  <s.icon size={20} />
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
                <p className="mt-1 text-2xl font-bold tabular-nums">{s.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-5">
            <Card className="p-5 sm:col-span-2" delay={0.1}>
              <p className="text-sm font-semibold">今月の出勤率</p>
              <div className="mt-4 flex justify-center">
                <Ring value={96} size={132} stroke={11} color="var(--green)">
                  <div className="text-center">
                    <p className="text-2xl font-bold tabular-nums">96%</p>
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
                    {recentDays.map((d) => (
                      <tr key={d.date} className="border-b transition-colors last:border-0 hover:bg-[var(--surface-2)]">
                        <td className="px-5 py-2.5 font-medium tabular-nums">{d.date}</td>
                        <td className="px-5 py-2.5 font-mono tabular-nums">{d.in}</td>
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
