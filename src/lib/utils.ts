export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** "9:05" のような時刻文字列を分に変換 */
export function timeToMinutes(time: string | null | undefined): number | null {
  if (!time) return null;
  const [h, m] = time.split(":").map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return h * 60 + m;
}

/** 分を "8時間30分" / "8:30" 形式へ */
export function minutesToHM(min: number, style: "jp" | "colon" = "jp"): string {
  const sign = min < 0 ? "-" : "";
  const abs = Math.abs(min);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  if (style === "colon") return `${sign}${h}:${String(m).padStart(2, "0")}`;
  return m === 0 ? `${sign}${h}時間` : `${sign}${h}時間${m}分`;
}

/** 出退勤・休憩から実労働時間（分）を計算 */
export function workMinutes(
  clockIn: string | null,
  clockOut: string | null,
  breakMin = 0
): number | null {
  const start = timeToMinutes(clockIn);
  const end = timeToMinutes(clockOut);
  if (start == null || end == null) return null;
  return Math.max(0, end - start - breakMin);
}

export function pad2(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatClock(d: Date): string {
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

const WEEKDAYS = ["日", "月", "火", "水", "木", "金", "土"];

export function formatDateJP(d: Date): string {
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日（${
    WEEKDAYS[d.getDay()]
  }）`;
}

export function weekdayJP(dow: number): string {
  return WEEKDAYS[dow];
}

export function daysInMonth(year: number, month0: number): number {
  return new Date(year, month0 + 1, 0).getDate();
}
