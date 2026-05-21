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
  ChevronRight,
  RotateCcw,
  Dot,
} from "lucide-react";
import { Card, Badge, Button, Segmented, Avatar, EmptyState, type Tone } from "@/components/ui";
import { Modal, useToast } from "@/components/Overlay";
import { Field, Select, Textarea, DatePicker } from "@/components/forms";
import { useStore, type RequestFull, type ApprovalStep } from "@/lib/store";
import { currentUser } from "@/lib/mock-data";

const typeIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  有給休暇: CalendarOff,
  残業申請: Clock,
  打刻修正: PencilLine,
  振替休日: Repeat,
  直行直帰: Navigation,
};

const statusTone: Record<string, Tone> = {
  承認待ち: "orange",
  承認済: "green",
  却下: "red",
};

const stepTone: Record<string, string> = {
  承認済: "var(--green)",
  承認待ち: "var(--orange)",
  却下: "var(--red)",
  差戻し: "var(--orange)",
  未到達: "var(--text-quaternary)",
};

export default function RequestsPage() {
  const { requests, addRequest, decideRequest } = useStore();
  const { toast } = useToast();
  const [tab, setTab] = useState<"承認待ち" | "承認済" | "却下" | "all">("承認待ち");
  const [formOpen, setFormOpen] = useState(false);
  const [rejecting, setRejecting] = useState<RequestFull | null>(null);

  const counts = useMemo(
    () => ({
      承認待ち: requests.filter((r) => r.status === "承認待ち").length,
      承認済: requests.filter((r) => r.status === "承認済").length,
      却下: requests.filter((r) => r.status === "却下").length,
      all: requests.length,
    }),
    [requests]
  );

  const filtered = useMemo(
    () => (tab === "all" ? requests : requests.filter((r) => r.status === tab)),
    [tab, requests]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Segmented
          value={tab}
          onChange={setTab}
          options={[
            { value: "承認待ち", label: <>承認待ち<Count n={counts.承認待ち} /></> },
            { value: "承認済", label: <>承認済<Count n={counts.承認済} /></> },
            { value: "却下", label: <>却下<Count n={counts.却下} /></> },
            { value: "all", label: "すべて" },
          ]}
        />
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={17} /> 新規申請
        </Button>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState icon={<Inbox size={40} />} title="該当する申請はありません" />
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((r, i) => {
            const Icon = typeIcon[r.type] ?? Clock;
            return (
              <Card key={r.id} className="p-5" delay={i * 0.04}>
                <div className="flex flex-wrap items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--blue-soft)] text-[var(--blue)]">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold">{r.type}</span>
                      <Badge tone={statusTone[r.status]} dot>{r.status}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">{r.detail}</p>
                    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--text-tertiary)]">
                      <span>申請者：{r.applicant}（{r.department}）</span>
                      <span>対象日：{r.targetDate}</span>
                      <span>申請日時：{r.appliedAt}</span>
                    </div>

                    {/* approval route */}
                    <div className="mt-4 inline-flex w-fit max-w-full flex-wrap items-center gap-x-2 gap-y-2 rounded-xl bg-[var(--surface-2)] px-3.5 py-2.5">
                      <span className="mr-1 text-[10px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)]">
                        承認経路
                      </span>
                      {r.route.map((step, idx) => (
                        <RouteStep key={idx} step={step} last={idx === r.route.length - 1} />
                      ))}
                    </div>
                  </div>

                  {r.status === "承認待ち" && (
                    <div className="flex gap-2">
                      <Button variant="secondary" onClick={() => setRejecting(r)}>
                        <X size={16} /> 却下
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => {
                          decideRequest(r.id, "承認済");
                          toast({ kind: "success", title: "申請を承認しました", desc: `${r.applicant}さんの${r.type}` });
                        }}
                      >
                        <Check size={16} /> 承認
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <RequestForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={(data) => {
          addRequest(data);
          setFormOpen(false);
          toast({ kind: "success", title: "申請を送信しました", desc: `${data.type}・承認者へ通知しました` });
        }}
      />

      <RejectModal
        request={rejecting}
        onClose={() => setRejecting(null)}
        onReject={(id, comment, sendBack) => {
          decideRequest(id, sendBack ? "差戻し" : "却下", comment);
          setRejecting(null);
          toast({ kind: sendBack ? "warning" : "error", title: sendBack ? "申請を差し戻しました" : "申請を却下しました" });
        }}
      />
    </div>
  );
}

function Count({ n }: { n: number }) {
  return (
    <span className="ml-1 rounded-full bg-[var(--surface-3)] px-1.5 text-[10px] font-bold text-[var(--text-secondary)]">
      {n}
    </span>
  );
}

function RouteStep({ step, last }: { step: ApprovalStep; last: boolean }) {
  return (
    <>
      <div className="flex items-center gap-1.5">
        <span
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: stepTone[step.state] }}
        >
          {step.state === "承認済" ? (
            <Check size={11} />
          ) : step.state === "却下" ? (
            <X size={11} />
          ) : step.state === "承認待ち" ? (
            <Clock size={11} />
          ) : (
            <Dot size={20} />
          )}
        </span>
        <div className="leading-tight">
          <p className="text-[11px] font-medium">{step.name}</p>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            {step.role}
            {step.at ? ` ・ ${step.at.split(" ")[1] ?? step.at}` : ""}
          </p>
        </div>
      </div>
      {!last && <ChevronRight size={14} className="shrink-0 text-[var(--text-quaternary)]" />}
    </>
  );
}

const TYPES = ["有給休暇", "残業申請", "打刻修正", "振替休日", "直行直帰"] as const;

function RequestForm({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    type: RequestFull["type"];
    applicant: string;
    department: string;
    targetDate: string;
    detail: string;
  }) => void;
}) {
  const [type, setType] = useState<RequestFull["type"]>("有給休暇");
  const [date, setDate] = useState<string | null>("2026-05-28");
  const [detail, setDetail] = useState("");

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="新規申請"
      desc="申請内容を入力してください。承認経路に沿って通知されます。"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>キャンセル</Button>
          <Button
            disabled={!date || !detail}
            onClick={() =>
              date &&
              onSubmit({
                type,
                applicant: currentUser.name,
                department: currentUser.department,
                targetDate: date,
                detail,
              })
            }
          >
            申請する
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Field label="申請種別">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {TYPES.map((t) => {
              const Icon = typeIcon[t];
              const active = type === t;
              return (
                <button
                  key={t}
                  onClick={() => setType(t)}
                  className={`flex items-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-medium transition-all ${
                    active
                      ? "border-[var(--blue)] bg-[var(--blue-soft)] text-[var(--blue)]"
                      : "hover:bg-[var(--surface-3)]"
                  }`}
                >
                  <Icon size={16} /> {t}
                </button>
              );
            })}
          </div>
        </Field>
        <Field label="対象日">
          <DatePicker value={date} onChange={setDate} />
        </Field>
        <Field label="理由・詳細">
          <Textarea
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="申請理由を入力してください"
          />
        </Field>
        <div className="flex items-center gap-2 rounded-xl bg-[var(--surface-2)] p-3 text-xs text-[var(--text-secondary)]">
          <Avatar name="佐藤 花子" color="#db2777" size={28} />
          承認経路：佐藤 花子（直属上長）→ 伊藤 さやか（部門長）
        </div>
      </div>
    </Modal>
  );
}

function RejectModal({
  request,
  onClose,
  onReject,
}: {
  request: RequestFull | null;
  onClose: () => void;
  onReject: (id: string, comment: string, sendBack: boolean) => void;
}) {
  const [comment, setComment] = useState("");
  return (
    <Modal
      open={!!request}
      onClose={onClose}
      title="申請を却下／差し戻し"
      desc={request ? `${request.applicant}さんの${request.type}` : ""}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={() => request && onReject(request.id, comment, true)}>
            <RotateCcw size={15} /> 差し戻す
          </Button>
          <Button variant="danger" onClick={() => request && onReject(request.id, comment, false)}>
            <X size={16} /> 却下する
          </Button>
        </>
      }
    >
      <Field label="コメント（申請者に通知されます）">
        <Textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="却下・差し戻しの理由を入力してください"
        />
      </Field>
    </Modal>
  );
}
