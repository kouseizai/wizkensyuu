import { daysInMonth, weekdayJP, workMinutes } from "./utils";

export type AttendanceStatus =
  | "normal" // 通常勤務
  | "late" // 遅刻
  | "early" // 早退
  | "overtime" // 残業あり
  | "absent" // 欠勤
  | "holiday" // 休日
  | "paid_leave" // 有給休暇
  | "pending"; // 未打刻 / 確認待ち

export type AttendanceRecord = {
  date: string; // YYYY-MM-DD
  day: number;
  weekday: string;
  isWeekend: boolean;
  status: AttendanceStatus;
  clockIn: string | null;
  clockOut: string | null;
  breakMin: number;
  note?: string;
};

export type Member = {
  id: string;
  name: string;
  nameKana: string;
  department: string;
  role: string;
  employeeNo: string;
  email: string;
  status: "出勤中" | "退勤済" | "休憩中" | "休暇" | "未出勤";
  avatarColor: string;
  workTypeName: string;
};

export type LeaveRequest = {
  id: string;
  type: "有給休暇" | "残業申請" | "打刻修正" | "振替休日" | "直行直帰";
  applicant: string;
  department: string;
  targetDate: string;
  detail: string;
  appliedAt: string;
  status: "承認待ち" | "承認済" | "却下";
  approver: string;
};

export type ShiftCell = {
  memberId: string;
  date: string;
  label: string; // "早番" "遅番" "日勤" "休"
  start: string | null;
  end: string | null;
};

export const currentUser = {
  name: "山田 太郎",
  nameKana: "ヤマダ タロウ",
  department: "開発部",
  role: "メンバー",
  employeeNo: "EMP-0102",
  avatarColor: "#3b4a63",
};

export const members: Member[] = [
  {
    id: "m1",
    name: "山田 太郎",
    nameKana: "ヤマダ タロウ",
    department: "開発部",
    role: "メンバー",
    employeeNo: "EMP-0102",
    email: "yamada@example.com",
    status: "出勤中",
    avatarColor: "#3b4a63",
    workTypeName: "フルタイム",
  },
  {
    id: "m2",
    name: "佐藤 花子",
    nameKana: "サトウ ハナコ",
    department: "開発部",
    role: "マネージャー",
    employeeNo: "EMP-0044",
    email: "sato@example.com",
    status: "出勤中",
    avatarColor: "#6a3f55",
    workTypeName: "フルタイム",
  },
  {
    id: "m3",
    name: "鈴木 一郎",
    nameKana: "スズキ イチロウ",
    department: "営業部",
    role: "メンバー",
    employeeNo: "EMP-0231",
    email: "suzuki@example.com",
    status: "休憩中",
    avatarColor: "#2f5a4f",
    workTypeName: "フルタイム",
  },
  {
    id: "m4",
    name: "高橋 美咲",
    nameKana: "タカハシ ミサキ",
    department: "管理部",
    role: "メンバー",
    employeeNo: "EMP-0310",
    email: "takahashi@example.com",
    status: "休暇",
    avatarColor: "#6b5333",
    workTypeName: "時短勤務",
  },
  {
    id: "m5",
    name: "田中 健",
    nameKana: "タナカ ケン",
    department: "営業部",
    role: "メンバー",
    employeeNo: "EMP-0288",
    email: "tanaka@example.com",
    status: "退勤済",
    avatarColor: "#414874",
    workTypeName: "フルタイム",
  },
  {
    id: "m6",
    name: "伊藤 さやか",
    nameKana: "イトウ サヤカ",
    department: "管理部",
    role: "マネージャー",
    employeeNo: "EMP-0019",
    email: "ito@example.com",
    status: "出勤中",
    avatarColor: "#6e453c",
    workTypeName: "フルタイム",
  },
  {
    id: "m7",
    name: "渡辺 翔",
    nameKana: "ワタナベ ショウ",
    department: "開発部",
    role: "メンバー",
    employeeNo: "EMP-0407",
    email: "watanabe@example.com",
    status: "未出勤",
    avatarColor: "#355a66",
    workTypeName: "アルバイト",
  },
  {
    id: "m8",
    name: "中村 由美",
    nameKana: "ナカムラ ユミ",
    department: "営業部",
    role: "メンバー",
    employeeNo: "EMP-0356",
    email: "nakamura@example.com",
    status: "出勤中",
    avatarColor: "#5a5436",
    workTypeName: "フルタイム",
  },
];

export const leaveRequests: LeaveRequest[] = [
  {
    id: "r1",
    type: "有給休暇",
    applicant: "渡辺 翔",
    department: "開発部",
    targetDate: "2026-05-28",
    detail: "私用のため終日休暇を取得します。",
    appliedAt: "2026-05-20 14:32",
    status: "承認待ち",
    approver: "佐藤 花子",
  },
  {
    id: "r2",
    type: "残業申請",
    applicant: "鈴木 一郎",
    department: "営業部",
    targetDate: "2026-05-21",
    detail: "見積書作成のため2時間の残業を申請します。",
    appliedAt: "2026-05-21 17:05",
    status: "承認待ち",
    approver: "伊藤 さやか",
  },
  {
    id: "r3",
    type: "打刻修正",
    applicant: "中村 由美",
    department: "営業部",
    targetDate: "2026-05-19",
    detail: "退勤打刻を忘れたため 19:00 に修正をお願いします。",
    appliedAt: "2026-05-20 09:12",
    status: "承認待ち",
    approver: "伊藤 さやか",
  },
  {
    id: "r4",
    type: "振替休日",
    applicant: "田中 健",
    department: "営業部",
    targetDate: "2026-05-30",
    detail: "5/17（休日出勤）の振替として取得します。",
    appliedAt: "2026-05-18 11:48",
    status: "承認済",
    approver: "伊藤 さやか",
  },
  {
    id: "r5",
    type: "有給休暇",
    applicant: "高橋 美咲",
    department: "管理部",
    targetDate: "2026-05-21",
    detail: "通院のため半日休暇（午後）を取得します。",
    appliedAt: "2026-05-15 16:20",
    status: "承認済",
    approver: "伊藤 さやか",
  },
  {
    id: "r6",
    type: "直行直帰",
    applicant: "鈴木 一郎",
    department: "営業部",
    targetDate: "2026-05-14",
    detail: "クライアント訪問のため直行直帰します。",
    appliedAt: "2026-05-13 18:02",
    status: "却下",
    approver: "伊藤 さやか",
  },
];

/** 当月の自分の勤怠を疑似生成（2026-05） */
export function buildMonthlyAttendance(
  year = 2026,
  month0 = 4 // 0-indexed -> 5月
): AttendanceRecord[] {
  const total = daysInMonth(year, month0);
  const today = 21;
  const records: AttendanceRecord[] = [];

  // 適度なばらつきを持たせた固定パターン
  const lateDays = new Set([7, 15]);
  const overtimeDays = new Set([2, 8, 13, 18, 20]);
  const paidLeaveDays = new Set([12]);
  const earlyDays = new Set([6]);

  for (let d = 1; d <= total; d++) {
    const date = new Date(year, month0, d);
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    const iso = `${year}-${String(month0 + 1).padStart(2, "0")}-${String(
      d
    ).padStart(2, "0")}`;

    if (isWeekend) {
      records.push({
        date: iso,
        day: d,
        weekday: weekdayJP(dow),
        isWeekend,
        status: "holiday",
        clockIn: null,
        clockOut: null,
        breakMin: 0,
      });
      continue;
    }

    if (d > today) {
      records.push({
        date: iso,
        day: d,
        weekday: weekdayJP(dow),
        isWeekend,
        status: "pending",
        clockIn: null,
        clockOut: null,
        breakMin: 0,
      });
      continue;
    }

    if (paidLeaveDays.has(d)) {
      records.push({
        date: iso,
        day: d,
        weekday: weekdayJP(dow),
        isWeekend,
        status: "paid_leave",
        clockIn: null,
        clockOut: null,
        breakMin: 0,
        note: "有給休暇（全日）",
      });
      continue;
    }

    let clockIn = "09:00";
    let clockOut: string | null = "18:00";
    let status: AttendanceStatus = "normal";
    let note: string | undefined;

    if (lateDays.has(d)) {
      clockIn = "09:42";
      status = "late";
      note = "電車遅延";
    }
    if (earlyDays.has(d)) {
      clockOut = "16:10";
      status = "early";
      note = "通院のため早退";
    }
    if (overtimeDays.has(d)) {
      clockOut = d % 2 === 0 ? "20:30" : "21:15";
      status = "overtime";
    }
    if (d === today) {
      // 本日：出勤中（退勤前）
      clockIn = "08:58";
      clockOut = null;
      status = "normal";
      note = "勤務中";
    }

    records.push({
      date: iso,
      day: d,
      weekday: weekdayJP(dow),
      isWeekend,
      status,
      clockIn,
      clockOut,
      breakMin: clockOut ? 60 : 45,
      note,
    });
  }

  return records;
}

export function summarize(records: AttendanceRecord[]) {
  let workDays = 0;
  let totalWork = 0;
  let overtime = 0;
  let lateCount = 0;
  let earlyCount = 0;
  let paidLeave = 0;
  const standardDay = 8 * 60;

  for (const r of records) {
    if (r.status === "paid_leave") paidLeave++;
    if (r.status === "late") lateCount++;
    if (r.status === "early") earlyCount++;
    const wm = workMinutes(r.clockIn, r.clockOut, r.breakMin);
    if (wm != null && r.clockOut) {
      workDays++;
      totalWork += wm;
      if (wm > standardDay) overtime += wm - standardDay;
    }
  }

  return { workDays, totalWork, overtime, lateCount, earlyCount, paidLeave };
}

/** メンバーごとの疑似勤怠統計（id から決定的に生成） */
export function memberStats(id: string) {
  const idx = Math.max(0, members.findIndex((m) => m.id === id));
  const seed = idx + 1;
  const workDays = 14 + (seed * 2) % 6; // 14-19
  const totalHours = 120 + ((seed * 7) % 5) * 8; // 120-152
  const otHours = (seed * 5) % 28; // 0-27
  const paidRemain = [12.5, 8.0, 15.5, 6.0, 10.0, 18.0, 4.5, 13.0][idx % 8];
  const attendanceRate = 92 + ((seed * 3) % 8); // 92-99

  const baseDays = ["5/21", "5/20", "5/19", "5/16", "5/15"];
  const recent = baseDays.map((date, i) => {
    const lateSeed = (seed + i) % 7;
    const otSeed = (seed + i) % 4;
    if (i === 0 && idx === 0) {
      return { date, in: "08:58", out: "勤務中", work: "—", tone: "blue" };
    }
    const inMin = 540 + (lateSeed === 0 ? 42 : lateSeed === 3 ? 12 : 0);
    const outMin = 1080 + (otSeed === 0 ? 195 : otSeed === 1 ? 90 : 0);
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const work = outMin - inMin - 60;
    return {
      date,
      in: fmt(inMin),
      out: fmt(outMin),
      work: `${Math.floor(work / 60)}:${String(work % 60).padStart(2, "0")}`,
      tone: lateSeed === 0 ? "orange" : work > 540 ? "orange" : "green",
    };
  });

  const trend = ["12月", "1月", "2月", "3月", "4月", "5月"].map((m, i) => ({
    m,
    h: 130 + ((seed * (i + 2)) % 50),
  }));

  return { workDays, totalHours, otHours, paidRemain, attendanceRate, recent, trend };
}

export const shiftLabels: Record<
  string,
  { bg: string; color: string; start: string | null; end: string | null }
> = {
  早番: { bg: "#eff4ff", color: "#2563eb", start: "07:00", end: "16:00" },
  日勤: { bg: "#ecfdf3", color: "#16a34a", start: "09:00", end: "18:00" },
  遅番: { bg: "#fff7ed", color: "#d97706", start: "12:00", end: "21:00" },
  休: { bg: "#e2e8f0", color: "#475569", start: null, end: null },
};

export function buildWeekShifts(): { dates: { iso: string; label: string }[]; rows: ShiftCell[][] } {
  const base = new Date(2026, 4, 18); // 月曜
  const dates: { iso: string; label: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(d.getDate()).padStart(2, "0")}`;
    dates.push({ iso, label: `${d.getMonth() + 1}/${d.getDate()} (${weekdayJP(d.getDay())})` });
  }

  const patterns: Record<string, string[]> = {
    m1: ["日勤", "日勤", "日勤", "日勤", "日勤", "休", "休"],
    m2: ["日勤", "日勤", "遅番", "日勤", "日勤", "休", "休"],
    m3: ["早番", "早番", "休", "遅番", "遅番", "日勤", "休"],
    m6: ["遅番", "日勤", "日勤", "早番", "早番", "休", "休"],
    m8: ["日勤", "休", "日勤", "日勤", "遅番", "遅番", "休"],
  };

  const rows: ShiftCell[][] = Object.entries(patterns).map(([memberId, labels]) =>
    labels.map((label, i) => ({
      memberId,
      date: dates[i].iso,
      label,
      start: shiftLabels[label].start,
      end: shiftLabels[label].end,
    }))
  );

  return { dates, rows };
}
