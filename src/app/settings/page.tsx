"use client";

import { useState } from "react";
import {
  Building2,
  Clock,
  Bell,
  MapPin,
  ShieldCheck,
  Save,
  Sun,
  Moon,
} from "lucide-react";
import { Card, CardHeader, Button, Switch } from "@/components/ui";
import { useToast } from "@/components/Overlay";
import { Field, Input, Select } from "@/components/forms";
import { useStore } from "@/lib/store";

const notifyRows = [
  { key: "punchMail", label: "出退勤の打刻通知をメールで受け取る" },
  { key: "overtimeWarn", label: "残業が月45時間を超えそうな場合に警告する" },
  { key: "approvePush", label: "申請が承認待ちの際にプッシュ通知を送る" },
  { key: "forgotRemind", label: "退勤打刻の漏れを翌朝リマインドする" },
];

export default function SettingsPage() {
  const { settings, updateSettings, theme, toggleTheme } = useStore();
  const { toast } = useToast();
  const [active, setActive] = useState("company");

  const nav = [
    { key: "company", icon: Building2, label: "会社情報" },
    { key: "rules", icon: Clock, label: "勤務時間ルール" },
    { key: "notify", icon: Bell, label: "通知設定" },
    { key: "appearance", icon: Sun, label: "外観" },
    { key: "security", icon: ShieldCheck, label: "権限・セキュリティ" },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="h-fit p-2 lg:col-span-1">
        <ul className="space-y-1">
          {nav.map((s) => (
            <li key={s.key}>
              <button
                onClick={() => setActive(s.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active === s.key
                    ? "bg-[var(--blue-soft)] text-[var(--blue)]"
                    : "text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
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
        {active === "company" && (
          <Card>
            <CardHeader title="会社情報" desc="勤怠管理の基本となる組織情報" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="会社名">
                <Input value={settings.companyName} onChange={(e) => updateSettings({ companyName: e.target.value })} />
              </Field>
              <Field label="事業所名">
                <Input value={settings.officeName} onChange={(e) => updateSettings({ officeName: e.target.value })} />
              </Field>
              <Field label="締め日">
                <Select value={settings.closingDay} onChange={(e) => updateSettings({ closingDay: e.target.value })}>
                  <option>末日</option>
                  <option>15日</option>
                  <option>20日</option>
                </Select>
              </Field>
              <Field label="タイムゾーン">
                <Select defaultValue="Asia/Tokyo">
                  <option>Asia/Tokyo (GMT+9)</option>
                </Select>
              </Field>
            </div>
          </Card>
        )}

        {active === "rules" && (
          <Card>
            <CardHeader title="勤務時間ルール" desc="所定労働時間と休憩の初期設定" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              <Field label="所定始業時刻">
                <Input type="time" value={settings.startTime} onChange={(e) => updateSettings({ startTime: e.target.value })} />
              </Field>
              <Field label="所定終業時刻">
                <Input type="time" value={settings.endTime} onChange={(e) => updateSettings({ endTime: e.target.value })} />
              </Field>
              <Field label="休憩時間（分）">
                <Input type="number" value={settings.breakMin} onChange={(e) => updateSettings({ breakMin: Number(e.target.value) })} />
              </Field>
              <Field label="1日の所定労働時間（分）">
                <Input type="number" value={settings.standardMin} onChange={(e) => updateSettings({ standardMin: Number(e.target.value) })} />
              </Field>
            </div>
            <div className="flex items-center justify-between border-t px-5 py-4">
              <div>
                <p className="text-sm font-medium">フレックスタイム制を有効にする</p>
                <p className="text-xs text-[var(--text-secondary)]">コアタイム 11:00〜15:00</p>
              </div>
              <Switch checked={settings.flex} onChange={(v) => updateSettings({ flex: v })} />
            </div>
          </Card>
        )}

        {active === "notify" && (
          <Card>
            <CardHeader title="通知設定" desc="アラート・リマインドの送信ルール" />
            <ul className="divide-y">
              {notifyRows.map((r) => (
                <li key={r.key} className="flex items-center justify-between px-5 py-3.5">
                  <span className="text-sm">{r.label}</span>
                  <Switch
                    checked={settings.notify[r.key]}
                    onChange={(v) => updateSettings({ notify: { ...settings.notify, [r.key]: v } })}
                  />
                </li>
              ))}
            </ul>
          </Card>
        )}

        {active === "appearance" && (
          <Card>
            <CardHeader title="外観" desc="表示テーマを切り替えます" />
            <div className="grid gap-4 p-5 sm:grid-cols-2">
              {(["light", "dark"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => {
                    if (theme !== t) toggleTheme();
                  }}
                  className={`flex flex-col gap-3 rounded-2xl border-2 p-4 text-left transition-all ${
                    theme === t ? "border-[var(--blue)]" : "border-[var(--hairline)] hover:border-[var(--text-quaternary)]"
                  }`}
                >
                  <div
                    className={`flex h-20 items-center justify-center rounded-xl ${
                      t === "light" ? "bg-[#f5f5f7] text-[#1d1d1f]" : "bg-[#1c1c1e] text-white"
                    }`}
                  >
                    {t === "light" ? <Sun size={28} /> : <Moon size={28} />}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{t === "light" ? "ライト" : "ダーク"}</span>
                    {theme === t && <span className="h-2.5 w-2.5 rounded-full bg-[var(--blue)]" />}
                  </div>
                </button>
              ))}
            </div>
          </Card>
        )}

        {active === "security" && (
          <Card>
            <CardHeader title="権限・セキュリティ" desc="アクセス制御と打刻制限" />
            <div className="space-y-1 p-2">
              {[
                { label: "IPアドレス制限（オフィスのみ打刻可）", on: true },
                { label: "GPS位置情報を打刻時に記録する", on: true },
                { label: "二要素認証（2FA）を必須にする", on: false },
                { label: "管理者による代理打刻を許可する", on: false },
              ].map((r) => (
                <SecurityRow key={r.label} label={r.label} defaultOn={r.on} />
              ))}
            </div>
            <div className="border-t px-5 py-4">
              <Field label="権限ロール">
                <Select defaultValue="メンバー">
                  <option>システム管理者</option>
                  <option>承認者（マネージャー）</option>
                  <option>メンバー</option>
                </Select>
              </Field>
            </div>
          </Card>
        )}

        <div className="flex justify-end">
          <Button onClick={() => toast({ kind: "success", title: "設定を保存しました" })}>
            <Save size={17} /> 設定を保存
          </Button>
        </div>
      </div>
    </div>
  );
}

function SecurityRow({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5">
      <span className="text-sm">{label}</span>
      <Switch checked={on} onChange={setOn} />
    </div>
  );
}
