"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Pencil,
  Clock,
  CalendarCheck,
  TrendingUp,
  Coffee,
  ShieldCheck,
  AlertTriangle,
  Moon,
} from "lucide-react";
import { Card, Badge, Button, Segmented, type Tone } from "@/components/ui";
import { Modal, useToast } from "@/components/Overlay";
import { Field, Input, Select, inputCls } from "@/components/forms";
import { useStore } from "@/lib/store";
import { summarize, type AttendanceStatus, type AttendanceRecord } from "@/lib/mock-data";
import { minutesToHM, workMinutes } from "@/lib/utils";

const statusMeta: Record<AttendanceStatus, { label: string; tone: Tone }> = {
  normal: { label: "通常", tone: "green" },
  overtime: { label: "残業", tone: "teal" },
  late: { label: "遅刻", tone: "orange" },
  early: { label: "早退", tone: "orange" },
  absent: { label: "欠勤", tone: "red" },
  holiday: { label: "休日", tone: "neutral" },
  paid_leave: { label: "有給", tone: "purple" },
  pending: { label: "未打刻", tone: "neutral" },
};

export default function AttendancePage() {
  const { records, editRecord } = useStore();
  const { toast } = useToast();
  const [filter, setFilter] = useState<"all" | "work" | "leave">("all");
  const [editing, setEditing] = useState<AttendanceRecord | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const sum = useMemo(() => summarize(records), [records]);

  const rows = useMemo(() => {
    if (filter === "work") return records.filter((r) => r.clockIn != null);
    if (filter === "leave")
      return records.filter((r) => r.status === "paid_leave" || r.status === "absent");
    return records;
  }, [filter, records]);

  const totals = useMemo(() => {
    let work = 0,
      ot = 0,
      brk = 0,
      night = 0;
    for (const r of records) {
      const wm = workMinutes(r.clockIn, r.clockOut, r.breakMin);
      if (wm != null && r.clockOut) {
        work += wm;
        brk += r.breakMin;
        if (wm > 480) ot += wm - 480;
        const outH = Number(r.clockOut.split(":")[0]);
        if (outH >= 22) night += (outH - 22) * 60;
      }
    }
    return { work, ot, brk, night };
  }, [records]);

  const otHours = Math.floor(sum.overtime / 60);
  const otRatio = Math.min(100, Math.round((sum.overtime / (45 * 60)) * 100));

  const summary = [
    { icon: CalendarCheck, label: "出勤日数", value: `${sum.workDays}日`, tone: "blue" },
    { icon: Clock, label: "総労働時間", value: minutesToHM(sum.totalWork), tone: "teal" },
    { icon: TrendingUp, label: "残業時間", value: minutesToHM(sum.overtime), tone: "orange" },
    { icon: Coffee, label: "有給取得", value: `${sum.paidLeave}日`, tone: "green" },
  ];
  const toneBg: Record<string, string> = {
    blue: "bg-[var(--blue-soft)] text-[var(--blue)]",
    teal: "bg-[var(--teal-soft)] text-[var(--teal)]",
    orange: "bg-[var(--orange-soft)] text-[var(--orange)]",
    green: "bg-[var(--green-soft)] text-[var(--green)]",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button className="rounded-full border bg-[var(--surface)] p-2.5 transition-colors hover:bg-[var(--surface-3)]">
            <ChevronLeft size={18} />
          </button>
          <span className="min-w-[130px] text-center text-lg font-bold tracking-tight">
            2026年 5月
          </span>
          <button className="rounded-full border bg-[var(--surface)] p-2.5 transition-colors hover:bg-[var(--surface-3)]">
            <ChevronRight size={18} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: "all", label: "全日" },
              { value: "work", label: "勤務日" },
              { value: "leave", label: "休暇" },
            ]}
          />
          <Button
            variant="secondary"
            onClick={() => toast({ kind: "info", title: "CSVを書き出しました", desc: "勤怠_2026-05.csv" })}
          >
            <Download size={16} /> CSV出力
          </Button>
        </div>
      </div>

      {/* 36協定 alert */}
      <Card className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[var(--orange-soft)] text-[var(--orange)]">
            <AlertTriangle size={20} />
          </div>
          <div className="min-w-[180px] flex-1">
            <p className="text-sm font-semibold">36協定 残業上限モニタリング</p>
            <p className="text-xs text-[var(--text-secondary)]">
              今月の残業 {minutesToHM(sum.overtime)} / 上限 45時間（{otRatio}%）
            </p>
          </div>
          <div className="h-2.5 w-full max-w-xs overflow-hidden rounded-full bg-[var(--surface-3)] sm:w-56">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${otRatio}%`,
                background: otRatio > 80 ? "var(--red)" : otRatio > 60 ? "var(--orange)" : "var(--green)",
              }}
            />
          </div>
          <span className="text-lg font-bold tabular-nums">{otHours}h</span>
        </div>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {summary.map((s) => (
          <Card key={s.label} className="flex items-center gap-3 p-4">
            <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${toneBg[s.tone]}`}>
              <s.icon size={20} />
            </div>
            <div>
              <p className="text-xs text-[var(--text-secondary)]">{s.label}</p>
              <p className="text-lg font-bold tabular-nums">{s.value}</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b px-5 py-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-[15px] font-semibold">日次勤怠</h3>
            {confirmed ? (
              <Badge tone="green" dot>本人確定済</Badge>
            ) : (
              <Badge tone="neutral">未確定</Badge>
            )}
          </div>
          <Button
            variant={confirmed ? "secondary" : "primary"}
            onClick={() => {
              setConfirmed(true);
              toast({ kind: "success", title: "月次勤怠を確定しました", desc: "上長へ承認依頼を送信しました" });
            }}
          >
            <ShieldCheck size={16} />
            {confirmed ? "確定済み" : "月次を確定して申請"}
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-sm">
            <thead>
              <tr className="border-b bg-[var(--surface-2)] text-left text-xs text-[var(--text-secondary)]">
                <th className="px-4 py-3 font-semibold">日付</th>
                <th className="px-4 py-3 font-semibold">区分</th>
                <th className="px-4 py-3 font-semibold">出勤</th>
                <th className="px-4 py-3 font-semibold">退勤</th>
                <th className="px-4 py-3 font-semibold">休憩</th>
                <th className="px-4 py-3 font-semibold">実労働</th>
                <th className="px-4 py-3 font-semibold">残業</th>
                <th className="px-4 py-3 font-semibold">深夜</th>
                <th className="px-4 py-3 font-semibold">備考</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const wm = workMinutes(r.clockIn, r.clockOut, r.breakMin);
                const ot = wm && wm > 480 ? wm - 480 : 0;
                const outH = r.clockOut ? Number(r.clockOut.split(":")[0]) : 0;
                const night = r.clockOut && outH >= 22 ? (outH - 22) * 60 : 0;
                const isSat = r.weekday === "土";
                const isSun = r.weekday === "日";
                return (
                  <tr
                    key={r.date}
                    className={`border-b transition-colors last:border-0 hover:bg-[var(--surface-2)] ${
                      r.note === "勤務中" ? "bg-[var(--blue-soft)]/40" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="font-medium tabular-nums">{r.day}日</span>
                      <span
                        className={`ml-1.5 text-xs ${
                          isSun ? "text-[var(--red)]" : isSat ? "text-[var(--blue)]" : "text-[var(--text-tertiary)]"
                        }`}
                      >
                        ({r.weekday})
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge tone={statusMeta[r.status].tone}>{statusMeta[r.status].label}</Badge>
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">{r.clockIn ?? "—"}</td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {r.clockOut ?? (r.clockIn ? <span className="text-[var(--blue)]">勤務中</span> : "—")}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-[var(--text-secondary)]">
                      {r.clockIn ? `${r.breakMin}分` : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono font-semibold tabular-nums">
                      {wm != null && r.clockOut ? minutesToHM(wm, "colon") : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums">
                      {ot > 0 ? <span className="text-[var(--orange)]">{minutesToHM(ot, "colon")}</span> : "—"}
                    </td>
                    <td className="px-4 py-3 font-mono tabular-nums text-[var(--text-tertiary)]">
                      {night > 0 ? (
                        <span className="inline-flex items-center gap-1 text-[var(--purple)]">
                          <Moon size={12} />
                          {minutesToHM(night, "colon")}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="max-w-[160px] truncate px-4 py-3 text-xs text-[var(--text-secondary)]">
                      {r.note ?? ""}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setEditing(r)}
                        className="rounded-lg p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--blue-soft)] hover:text-[var(--blue)]"
                        title="打刻を修正"
                      >
                        <Pencil size={15} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="border-t-2 bg-[var(--surface-2)] font-semibold">
                <td className="px-4 py-3" colSpan={5}>
                  月次合計
                </td>
                <td className="px-4 py-3 font-mono tabular-nums">{minutesToHM(totals.work, "colon")}</td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--orange)]">
                  {minutesToHM(totals.ot, "colon")}
                </td>
                <td className="px-4 py-3 font-mono tabular-nums text-[var(--purple)]">
                  {minutesToHM(totals.night, "colon")}
                </td>
                <td colSpan={2} />
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>

      <EditModal
        record={editing}
        onClose={() => setEditing(null)}
        onSave={(date, patch) => {
          editRecord(date, patch);
          setEditing(null);
          toast({ kind: "success", title: "打刻を修正しました", desc: `${date} を更新しました` });
        }}
      />
    </div>
  );
}

function EditModal({
  record,
  onClose,
  onSave,
}: {
  record: AttendanceRecord | null;
  onClose: () => void;
  onSave: (date: string, patch: Partial<AttendanceRecord>) => void;
}) {
  const [clockIn, setIn] = useState("");
  const [clockOut, setOut] = useState("");
  const [breakMin, setBreak] = useState(60);
  const [status, setStatus] = useState<AttendanceStatus>("normal");
  const [note, setNote] = useState("");

  // sync when opened
  useEffect(() => {
    if (record) {
      setIn(record.clockIn ?? "09:00");
      setOut(record.clockOut ?? "18:00");
      setBreak(record.breakMin || 60);
      setStatus(record.status);
      setNote(record.note ?? "");
    }
  }, [record]);

  return (
    <Modal
      open={!!record}
      onClose={onClose}
      title="打刻の修正"
      desc={record ? `${record.date}（${record.weekday}）の勤怠を修正します` : ""}
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            キャンセル
          </Button>
          <Button
            onClick={() =>
              record && onSave(record.date, { clockIn, clockOut, breakMin: Number(breakMin), status, note })
            }
          >
            保存する
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="出勤時刻">
          <Input type="time" value={clockIn} onChange={(e) => setIn(e.target.value)} />
        </Field>
        <Field label="退勤時刻">
          <Input type="time" value={clockOut} onChange={(e) => setOut(e.target.value)} />
        </Field>
        <Field label="休憩（分）">
          <Input type="number" value={breakMin} onChange={(e) => setBreak(Number(e.target.value))} />
        </Field>
        <Field label="勤務区分">
          <Select value={status} onChange={(e) => setStatus(e.target.value as AttendanceStatus)}>
            <option value="normal">通常</option>
            <option value="overtime">残業</option>
            <option value="late">遅刻</option>
            <option value="early">早退</option>
            <option value="paid_leave">有給</option>
            <option value="absent">欠勤</option>
          </Select>
        </Field>
        <Field label="備考" className="sm:col-span-2">
          <input className={inputCls} value={note} onChange={(e) => setNote(e.target.value)} placeholder="修正理由などを入力" />
        </Field>
      </div>
    </Modal>
  );
}
