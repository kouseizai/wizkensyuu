"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Check,
  X,
  CalendarOff,
  Clock,
  PencilLine,
  Repeat,
  Navigation,
  Inbox,
} from "lucide-react";
import { Card, Badge } from "@/components/ui";
import { leaveRequests, type LeaveRequest } from "@/lib/mock-data";

const typeIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  有給休暇: CalendarOff,
  残業申請: Clock,
  打刻修正: PencilLine,
  振替休日: Repeat,
  直行直帰: Navigation,
};

const statusTone: Record<string, "warning" | "success" | "danger"> = {
  承認待ち: "warning",
  承認済: "success",
  却下: "danger",
};

export default function RequestsPage() {
  const [tab, setTab] = useState<"承認待ち" | "承認済" | "却下" | "all">("承認待ち");
  const [data, setData] = useState<LeaveRequest[]>(leaveRequests);

  const counts = useMemo(() => {
    return {
      承認待ち: data.filter((r) => r.status === "承認待ち").length,
      承認済: data.filter((r) => r.status === "承認済").length,
      却下: data.filter((r) => r.status === "却下").length,
      all: data.length,
    };
  }, [data]);

  const filtered = useMemo(
    () => (tab === "all" ? data : data.filter((r) => r.status === tab)),
    [tab, data]
  );

  const decide = (id: string, status: "承認済" | "却下") =>
    setData((d) => d.map((r) => (r.id === id ? { ...r, status } : r)));

  const tabs: { k: typeof tab; l: string }[] = [
    { k: "承認待ち", l: "承認待ち" },
    { k: "承認済", l: "承認済" },
    { k: "却下", l: "却下" },
    { k: "all", l: "すべて" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-xl border bg-[var(--color-surface)] p-1 text-sm">
          {tabs.map((t) => (
            <button
              key={t.k}
              onClick={() => setTab(t.k)}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 font-medium transition-colors ${
                tab === t.k
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
              }`}
            >
              {t.l}
              <span
                className={`rounded-full px-1.5 text-[10px] font-bold ${
                  tab === t.k
                    ? "bg-white/25"
                    : "bg-slate-100 text-[var(--color-text-muted)]"
                }`}
              >
                {counts[t.k]}
              </span>
            </button>
          ))}
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]">
          <Plus size={17} /> 新規申請
        </button>
      </div>

      {filtered.length === 0 ? (
        <Card className="flex flex-col items-center justify-center gap-2 py-16 text-center">
          <Inbox size={40} className="text-[var(--color-text-subtle)]" />
          <p className="text-sm font-medium text-[var(--color-text-muted)]">
            該当する申請はありません
          </p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r) => {
            const Icon = typeIcon[r.type] ?? Clock;
            return (
              <Card key={r.id} className="p-5">
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-[var(--color-primary)]">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{r.type}</span>
                      <Badge tone={statusTone[r.status]} dot>
                        {r.status}
                      </Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--color-text-muted)]">
                      {r.detail}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--color-text-subtle)]">
                      <span>申請者：{r.applicant}（{r.department}）</span>
                      <span>対象日：{r.targetDate}</span>
                      <span>承認者：{r.approver}</span>
                      <span>申請日時：{r.appliedAt}</span>
                    </div>
                  </div>

                  {r.status === "承認待ち" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => decide(r.id, "却下")}
                        className="inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-2 text-sm font-medium text-[var(--color-danger)] transition-colors hover:bg-[var(--color-danger-soft)]"
                      >
                        <X size={16} /> 却下
                      </button>
                      <button
                        onClick={() => decide(r.id, "承認済")}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-[var(--color-success)] px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:brightness-110"
                      >
                        <Check size={16} /> 承認
                      </button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
