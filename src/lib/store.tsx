"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  buildMonthlyAttendance,
  leaveRequests as seedRequests,
  members as seedMembers,
  type AttendanceRecord,
  type LeaveRequest,
  type Member,
} from "./mock-data";

/* ---------------- types ---------------- */

export type PunchMethod = "web" | "kiosk" | "mobile" | "ic";
export type PunchType = "clock_in" | "clock_out" | "break_start" | "break_end";

export type PunchEvent = {
  id: string;
  type: PunchType;
  time: string; // HH:MM
  method: PunchMethod;
  location?: string;
};

export type ApprovalStep = {
  name: string;
  role: string;
  state: "承認待ち" | "承認済" | "却下" | "差戻し" | "未到達";
  at?: string;
  comment?: string;
};

export type RequestFull = LeaveRequest & {
  route: ApprovalStep[];
};

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  time: string;
  kind: "info" | "approve" | "warning" | "request";
  read: boolean;
};

export type Settings = {
  companyName: string;
  officeName: string;
  closingDay: string;
  startTime: string;
  endTime: string;
  breakMin: number;
  standardMin: number;
  flex: boolean;
  notify: Record<string, boolean>;
};

export type Theme = "light" | "dark";

export type LeaveLedger = {
  type: string;
  granted: number;
  used: number;
  expires: string;
};

type Persisted = {
  theme: Theme;
  loggedIn: boolean;
  todayDate: string;
  punches: PunchEvent[];
  attendanceOverrides: Record<string, Partial<AttendanceRecord>>;
  requests: RequestFull[];
  notifications: AppNotification[];
  settings: Settings;
};

/* ---------------- seeds ---------------- */

const TODAY = "2026-05-21";

const seedRequestsFull: RequestFull[] = seedRequests.map((r) => ({
  ...r,
  route: buildRoute(r),
}));

function buildRoute(r: LeaveRequest): ApprovalStep[] {
  const base: ApprovalStep[] = [
    { name: r.applicant, role: "申請者", state: "承認済", at: r.appliedAt },
    {
      name: r.approver,
      role: "直属上長",
      state:
        r.status === "承認待ち"
          ? "承認待ち"
          : r.status === "承認済"
            ? "承認済"
            : "却下",
      at: r.status === "承認待ち" ? undefined : r.appliedAt,
    },
    {
      name: "伊藤 さやか",
      role: "部門長",
      state:
        r.status === "承認済"
          ? "承認済"
          : r.status === "承認待ち"
            ? "未到達"
            : "未到達",
    },
  ];
  return base;
}

const seedNotifications: AppNotification[] = [
  {
    id: "n1",
    title: "残業時間の警告",
    body: "今月の残業が30時間を超えました。上限45時間に注意してください。",
    time: "10分前",
    kind: "warning",
    read: false,
  },
  {
    id: "n2",
    title: "承認依頼",
    body: "渡辺 翔さんから有給休暇の申請が届いています。",
    time: "1時間前",
    kind: "request",
    read: false,
  },
  {
    id: "n3",
    title: "申請が承認されました",
    body: "5/30の振替休日が伊藤 さやかさんに承認されました。",
    time: "昨日",
    kind: "approve",
    read: true,
  },
];

const defaultSettings: Settings = {
  companyName: "株式会社サンプル",
  officeName: "本社",
  closingDay: "末日",
  startTime: "09:00",
  endTime: "18:00",
  breakMin: 60,
  standardMin: 480,
  flex: false,
  notify: {
    punchMail: true,
    overtimeWarn: true,
    approvePush: false,
    forgotRemind: true,
  },
};

function initialState(): Persisted {
  return {
    theme: "light",
    loggedIn: true,
    todayDate: TODAY,
    punches: [
      { id: "p1", type: "clock_in", time: "08:58", method: "web", location: "本社オフィス" },
    ],
    attendanceOverrides: {},
    requests: seedRequestsFull,
    notifications: seedNotifications,
    settings: defaultSettings,
  };
}

export const LEAVE_LEDGER: LeaveLedger[] = [
  { type: "年次有給休暇", granted: 20, used: 7.5, expires: "2027-03-31" },
  { type: "特別休暇", granted: 5, used: 1, expires: "2027-03-31" },
  { type: "代休", granted: 2, used: 0, expires: "2026-08-31" },
  { type: "振替休日", granted: 1, used: 1, expires: "2026-06-30" },
];

/* ---------------- derived punch ---------------- */

export type PunchStatus = "before" | "working" | "break" | "done";

export function derivePunch(events: PunchEvent[]) {
  let status: PunchStatus = "before";
  let clockIn: string | null = null;
  let clockOut: string | null = null;
  let breakMin = 0;
  let openBreak: string | null = null;

  for (const e of events) {
    if (e.type === "clock_in") {
      if (!clockIn) clockIn = e.time;
      status = "working";
    } else if (e.type === "break_start") {
      openBreak = e.time;
      status = "break";
    } else if (e.type === "break_end") {
      if (openBreak) breakMin += diff(openBreak, e.time);
      openBreak = null;
      status = "working";
    } else if (e.type === "clock_out") {
      clockOut = e.time;
      status = "done";
    }
  }
  return { status, clockIn, clockOut, breakMin, openBreak };
}

function diff(a: string, b: string) {
  const [ah, am] = a.split(":").map(Number);
  const [bh, bm] = b.split(":").map(Number);
  return bh * 60 + bm - (ah * 60 + am);
}

/* ---------------- context ---------------- */

type StoreCtx = {
  hydrated: boolean;
  theme: Theme;
  toggleTheme: () => void;
  loggedIn: boolean;
  login: () => void;
  logout: () => void;

  punches: PunchEvent[];
  addPunch: (type: PunchType, method?: PunchMethod) => void;
  resetPunch: () => void;

  records: AttendanceRecord[];
  editRecord: (date: string, patch: Partial<AttendanceRecord>) => void;

  requests: RequestFull[];
  addRequest: (
    r: Omit<LeaveRequest, "id" | "status" | "appliedAt" | "approver">
  ) => void;
  decideRequest: (
    id: string,
    decision: "承認済" | "却下" | "差戻し",
    comment?: string
  ) => void;

  notifications: AppNotification[];
  unread: number;
  markRead: (id: string) => void;
  markAllRead: () => void;

  settings: Settings;
  updateSettings: (patch: Partial<Settings>) => void;

  members: Member[];
};

const Ctx = createContext<StoreCtx | null>(null);
const KEY = "kintai-pro-v2";

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<Persisted>(initialState);
  const [hydrated, setHydrated] = useState(false);

  // hydrate from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<Persisted>;
        setS((prev) => ({ ...prev, ...parsed }));
      }
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  // persist
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(s));
    } catch {
      /* ignore */
    }
  }, [s, hydrated]);

  // apply theme class
  useEffect(() => {
    const root = document.documentElement;
    if (s.theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
  }, [s.theme]);

  const toggleTheme = useCallback(
    () => setS((p) => ({ ...p, theme: p.theme === "dark" ? "light" : "dark" })),
    []
  );
  const login = useCallback(() => setS((p) => ({ ...p, loggedIn: true })), []);
  const logout = useCallback(() => setS((p) => ({ ...p, loggedIn: false })), []);

  const addPunch = useCallback(
    (type: PunchType, method: PunchMethod = "web") => {
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(
        now.getMinutes()
      ).padStart(2, "0")}`;
      setS((p) => ({
        ...p,
        punches: [
          ...p.punches,
          {
            id: `p${Date.now()}`,
            type,
            time,
            method,
            location: "本社オフィス",
          },
        ],
      }));
    },
    []
  );
  const resetPunch = useCallback(
    () => setS((p) => ({ ...p, punches: [] })),
    []
  );

  const editRecord = useCallback(
    (date: string, patch: Partial<AttendanceRecord>) =>
      setS((p) => ({
        ...p,
        attendanceOverrides: {
          ...p.attendanceOverrides,
          [date]: { ...p.attendanceOverrides[date], ...patch },
        },
      })),
    []
  );

  const addRequest: StoreCtx["addRequest"] = useCallback((r) => {
    const now = new Date();
    const stamp = `2026-05-21 ${String(now.getHours()).padStart(2, "0")}:${String(
      now.getMinutes()
    ).padStart(2, "0")}`;
    const full: RequestFull = {
      ...r,
      id: `r${Date.now()}`,
      status: "承認待ち",
      appliedAt: stamp,
      approver: "佐藤 花子",
      route: buildRoute({
        ...r,
        id: "",
        status: "承認待ち",
        appliedAt: stamp,
        approver: "佐藤 花子",
      }),
    };
    setS((p) => ({ ...p, requests: [full, ...p.requests] }));
  }, []);

  const decideRequest: StoreCtx["decideRequest"] = useCallback(
    (id, decision, comment) =>
      setS((p) => ({
        ...p,
        requests: p.requests.map((r) => {
          if (r.id !== id) return r;
          const status =
            decision === "差戻し" ? "承認待ち" : (decision as LeaveRequest["status"]);
          const route = r.route.map((step) =>
            step.state === "承認待ち"
              ? {
                  ...step,
                  state: decision,
                  at: "2026-05-21 17:30",
                  comment,
                }
              : step
          );
          return { ...r, status, route };
        }),
      })),
    []
  );

  const markRead = useCallback(
    (id: string) =>
      setS((p) => ({
        ...p,
        notifications: p.notifications.map((n) =>
          n.id === id ? { ...n, read: true } : n
        ),
      })),
    []
  );
  const markAllRead = useCallback(
    () =>
      setS((p) => ({
        ...p,
        notifications: p.notifications.map((n) => ({ ...n, read: true })),
      })),
    []
  );

  const updateSettings = useCallback(
    (patch: Partial<Settings>) =>
      setS((p) => ({ ...p, settings: { ...p.settings, ...patch } })),
    []
  );

  // merged attendance records
  const records = useMemo(() => {
    const base = buildMonthlyAttendance();
    const today = derivePunch(s.punches);
    return base.map((rec) => {
      let r = { ...rec, ...s.attendanceOverrides[rec.date] };
      if (rec.date === s.todayDate && today.clockIn) {
        r = {
          ...r,
          clockIn: today.clockIn,
          clockOut: today.clockOut,
          breakMin: today.breakMin || r.breakMin,
          status: today.clockOut ? "normal" : "normal",
          note: today.status === "done" ? "本日勤務完了" : "勤務中",
        };
      }
      return r;
    });
  }, [s.punches, s.attendanceOverrides, s.todayDate]);

  const unread = s.notifications.filter((n) => !n.read).length;

  const value: StoreCtx = {
    hydrated,
    theme: s.theme,
    toggleTheme,
    loggedIn: s.loggedIn,
    login,
    logout,
    punches: s.punches,
    addPunch,
    resetPunch,
    records,
    editRecord,
    requests: s.requests,
    addRequest,
    decideRequest,
    notifications: s.notifications,
    unread,
    markRead,
    markAllRead,
    settings: s.settings,
    updateSettings,
    members: seedMembers,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
