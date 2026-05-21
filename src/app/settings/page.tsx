"use client";

import { useState } from "react";
import { Building2, Clock, Bell, MapPin, ShieldCheck, Save } from "lucide-react";
import { Card, CardHeader } from "@/components/ui";

function Toggle({
  defaultOn = false,
}: {
  defaultOn?: boolean;
}) {
  const [on, setOn] = useState(defaultOn);
  return (
    <button
      onClick={() => setOn((v) => !v)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        on ? "bg-[var(--color-primary)]" : "bg-slate-300"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          on ? "translate-x-[22px]" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">{label}</span>
      {children}
    </label>
  );
}

const inputCls =
  "h-10 w-full rounded-xl border bg-[var(--color-surface)] px-3 text-sm outline-none focus:border-[var(--color-primary)]";

const rows = [
  { label: "出退勤の打刻通知をメールで受け取る", on: true },
  { label: "残業が月45時間を超えそうな場合に警告する", on: true },
  { label: "申請が承認待ちの際にプッシュ通知を送る", on: false },
  { label: "退勤打刻の漏れを翌朝リマインドする", on: true },
];

export default function SettingsPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* nav */}
      <Card className="h-fit p-2 lg:col-span-1">
        <ul className="space-y-1">
          {[
            { icon: Building2, label: "会社情報", active: true },
            { icon: Clock, label: "勤務時間ルール" },
            { icon: Bell, label: "通知設定" },
            { icon: MapPin, label: "打刻方法・拠点" },
            { icon: ShieldCheck, label: "権限・セキュリティ" },
          ].map((s) => (
            <li key={s.label}>
              <button
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  s.active
                    ? "bg-[var(--color-primary-soft)] text-[var(--color-primary)]"
                    : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-muted)]"
                }`}
              >
                <s.icon size={18} />
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="space-y-6 lg:col-span-2">
        <Card>
          <CardHeader title="会社情報" desc="勤怠管理の基本となる組織情報" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="会社名">
              <input className={inputCls} defaultValue="株式会社サンプル" />
            </Field>
            <Field label="事業所名">
              <input className={inputCls} defaultValue="本社" />
            </Field>
            <Field label="締め日">
              <select className={inputCls} defaultValue="末日">
                <option>末日</option>
                <option>15日</option>
                <option>20日</option>
              </select>
            </Field>
            <Field label="タイムゾーン">
              <select className={inputCls} defaultValue="Asia/Tokyo">
                <option>Asia/Tokyo (GMT+9)</option>
              </select>
            </Field>
          </div>
        </Card>

        <Card>
          <CardHeader title="勤務時間ルール" desc="所定労働時間と休憩の初期設定" />
          <div className="grid gap-4 p-5 sm:grid-cols-2">
            <Field label="所定始業時刻">
              <input type="time" className={inputCls} defaultValue="09:00" />
            </Field>
            <Field label="所定終業時刻">
              <input type="time" className={inputCls} defaultValue="18:00" />
            </Field>
            <Field label="休憩時間（分）">
              <input type="number" className={inputCls} defaultValue={60} />
            </Field>
            <Field label="1日の所定労働時間（分）">
              <input type="number" className={inputCls} defaultValue={480} />
            </Field>
          </div>
          <div className="flex items-center justify-between border-t px-5 py-4">
            <div>
              <p className="text-sm font-medium">フレックスタイム制を有効にする</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                コアタイム 11:00〜15:00
              </p>
            </div>
            <Toggle />
          </div>
        </Card>

        <Card>
          <CardHeader title="通知設定" desc="アラート・リマインドの送信ルール" />
          <ul className="divide-y">
            {rows.map((r) => (
              <li
                key={r.label}
                className="flex items-center justify-between px-5 py-3.5"
              >
                <span className="text-sm">{r.label}</span>
                <Toggle defaultOn={r.on} />
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex justify-end">
          <button className="inline-flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-primary-hover)]">
            <Save size={17} /> 設定を保存
          </button>
        </div>
      </div>
    </div>
  );
}
