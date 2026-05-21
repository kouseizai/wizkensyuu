export type NavItem = {
  href: string;
  label: string;
  icon: string; // lucide icon name
  badgeKey?: "requests";
};

export type NavSection = {
  title: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    title: "勤怠",
    items: [
      { href: "/", label: "ダッシュボード", icon: "LayoutDashboard" },
      { href: "/attendance", label: "勤怠一覧", icon: "CalendarClock" },
      { href: "/requests", label: "申請・承認", icon: "FileCheck2", badgeKey: "requests" },
      { href: "/leave", label: "休暇管理", icon: "Palmtree" },
      { href: "/shifts", label: "シフト管理", icon: "CalendarDays" },
    ],
  },
  {
    title: "管理",
    items: [
      { href: "/members", label: "メンバー", icon: "Users" },
      { href: "/reports", label: "レポート", icon: "BarChart3" },
      { href: "/settings", label: "設定", icon: "Settings" },
    ],
  },
];
