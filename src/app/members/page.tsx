"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, Plus, Mail, Building2, BadgeCheck, ChevronRight } from "lucide-react";
import { Card, Badge, Button, Avatar, Segmented, EmptyState, type Tone } from "@/components/ui";
import { useToast } from "@/components/Overlay";
import { inputCls } from "@/components/forms";
import { useStore } from "@/lib/store";

const statusTone: Record<string, Tone> = {
  出勤中: "green",
  休憩中: "orange",
  退勤済: "blue",
  休暇: "purple",
  未出勤: "neutral",
};

const departments = ["すべて", "開発部", "営業部", "管理部"];

export default function MembersPage() {
  const { members } = useStore();
  const { toast } = useToast();
  const [dept, setDept] = useState("すべて");
  const [q, setQ] = useState("");

  const filtered = useMemo(
    () =>
      members.filter(
        (m) =>
          (dept === "すべて" || m.department === dept) &&
          (q === "" ||
            m.name.includes(q) ||
            m.nameKana.includes(q) ||
            m.employeeNo.toLowerCase().includes(q.toLowerCase()))
      ),
    [dept, q, members]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)]" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="名前・社員番号で検索"
              className={`${inputCls} w-60 rounded-full pl-10`}
            />
          </div>
          <Segmented value={dept} onChange={setDept} options={departments.map((d) => ({ value: d, label: d }))} />
        </div>
        <Button onClick={() => toast({ kind: "info", title: "メンバー追加", desc: "招待メールの送信画面を開きます" })}>
          <Plus size={17} /> メンバー追加
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Search size={40} />} title="該当するメンバーがいません" desc="検索条件を変更してください" />
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((m, i) => (
            <Link key={m.id} href={`/members/${m.id}`}>
              <Card className="group p-5" delay={i * 0.04} hover>
                <div className="flex items-start gap-3">
                  <Avatar name={m.name} color={m.avatarColor} size={48} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-semibold">{m.name}</p>
                      <Badge tone={statusTone[m.status]} dot>{m.status}</Badge>
                    </div>
                    <p className="text-xs text-[var(--text-tertiary)]">{m.nameKana}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-[var(--text-secondary)]">
                  <p className="flex items-center gap-2">
                    <Building2 size={15} className="text-[var(--text-quaternary)]" />
                    {m.department} ・ {m.role}
                  </p>
                  <p className="flex items-center gap-2">
                    <BadgeCheck size={15} className="text-[var(--text-quaternary)]" />
                    {m.employeeNo} ・ {m.workTypeName}
                  </p>
                  <p className="flex items-center gap-2 truncate">
                    <Mail size={15} className="text-[var(--text-quaternary)]" />
                    {m.email}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-end gap-1 text-xs font-medium text-[var(--blue)] opacity-0 transition-opacity group-hover:opacity-100">
                  詳細を見る <ChevronRight size={14} />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
