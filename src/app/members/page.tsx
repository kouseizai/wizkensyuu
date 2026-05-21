"use client";

import { useMemo, useState } from "react";
import { Search, Plus, Mail, Building2, BadgeCheck } from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { members } from "@/lib/mock-data";

const statusTone: Record<string, "success" | "warning" | "primary" | "neutral"> = {
  出勤中: "success",
  休憩中: "warning",
  退勤済: "primary",
  休暇: "neutral",
  未出勤: "neutral",
};

const departments = ["すべて", "開発部", "営業部", "管理部"];

export default function MembersPage() {
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
    [dept, q]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
            />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="名前・社員番号で検索"
              className="h-10 w-60 rounded-xl border bg-[var(--color-surface)] pl-9 pr-3 text-sm outline-none focus:border-[var(--color-primary)]"
            />
          </div>
          <div className="flex rounded-xl border bg-[var(--color-surface)] p-1 text-sm">
            {departments.map((d) => (
              <button
                key={d}
                onClick={() => setDept(d)}
                className={`rounded-lg px-3 py-1.5 font-medium transition-colors ${
                  dept === d
                    ? "bg-[var(--color-primary)] text-white"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]">
          <Plus size={17} /> メンバー追加
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => (
          <Card key={m.id} className="p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white"
                style={{ background: m.avatarColor }}
              >
                {m.name.charAt(0)}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate font-semibold">{m.name}</p>
                  <Badge tone={statusTone[m.status]} dot>
                    {m.status}
                  </Badge>
                </div>
                <p className="text-xs text-[var(--color-text-subtle)]">
                  {m.nameKana}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5 text-sm text-[var(--color-text-muted)]">
              <p className="flex items-center gap-2">
                <Building2 size={15} className="text-[var(--color-text-subtle)]" />
                {m.department} ・ {m.role}
              </p>
              <p className="flex items-center gap-2">
                <BadgeCheck size={15} className="text-[var(--color-text-subtle)]" />
                {m.employeeNo} ・ {m.workTypeName}
              </p>
              <p className="flex items-center gap-2 truncate">
                <Mail size={15} className="text-[var(--color-text-subtle)]" />
                {m.email}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
