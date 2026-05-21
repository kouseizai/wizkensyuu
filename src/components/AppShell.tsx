"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  LayoutDashboard,
  CalendarClock,
  FileCheck2,
  CalendarDays,
  Palmtree,
  Users,
  BarChart3,
  Settings,
  Clock4,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Monitor,
  Check,
  AlertTriangle,
  Inbox,
  CircleCheck,
} from "lucide-react";
import { navSections } from "@/lib/nav";
import { currentUser } from "@/lib/mock-data";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Dropdown } from "@/components/Overlay";
import { Avatar } from "@/components/ui";

const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  CalendarClock,
  FileCheck2,
  CalendarDays,
  Palmtree,
  Users,
  BarChart3,
  Settings,
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const { requests } = useStore();
  const pendingCount = requests.filter((r) => r.status === "承認待ち").length;

  return (
    <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-5">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--text-quaternary)]">
            {section.title}
          </p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const Icon = icons[item.icon];
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              const badge = item.badgeKey === "requests" ? pendingCount : 0;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-colors duration-200",
                      active
                        ? "text-[var(--blue)]"
                        : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 -z-10 rounded-xl bg-[var(--blue-soft)]"
                        transition={{ type: "spring", stiffness: 500, damping: 36 }}
                      />
                    )}
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {badge > 0 && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--red)] px-1.5 text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarInner() {
  return (
    <>
      <div className="flex h-16 items-center gap-2.5 border-b px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--blue)] text-white shadow-sm">
          <Clock4 size={20} />
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-bold tracking-tight text-[var(--text)]">
            キンタイ<span className="text-[var(--blue)]">Pro</span>
          </p>
          <p className="text-[10px] text-[var(--text-tertiary)]">
            勤怠管理システム
          </p>
        </div>
      </div>
      <NavLinks />
      <div className="border-t p-3">
        <Link
          href="/kiosk"
          className="flex items-center gap-2.5 rounded-xl bg-[var(--surface-3)] px-3 py-2.5 text-[13px] font-medium text-[var(--text-secondary)] transition-colors hover:text-[var(--text)]"
        >
          <Monitor size={16} />
          打刻専用画面を開く
        </Link>
      </div>
    </>
  );
}

function NotificationBell() {
  const { notifications, unread, markRead, markAllRead } = useStore();
  const kindIcon = {
    warning: <AlertTriangle size={15} />,
    request: <Inbox size={15} />,
    approve: <CircleCheck size={15} />,
    info: <Bell size={15} />,
  };
  const kindColor = {
    warning: "var(--orange)",
    request: "var(--blue)",
    approve: "var(--green)",
    info: "var(--text-tertiary)",
  };
  return (
    <Dropdown
      width={360}
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="relative rounded-full border bg-[var(--surface)] p-2.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--blue)]"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--red)] px-1 text-[9px] font-bold text-white ring-2 ring-[var(--surface)]">
              {unread}
            </span>
          )}
        </button>
      )}
    >
      {() => (
        <div>
          <div className="flex items-center justify-between border-b px-4 py-3">
            <p className="text-sm font-semibold">通知</p>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="text-xs font-medium text-[var(--blue)] hover:underline"
              >
                すべて既読
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {notifications.map((n) => (
              <li key={n.id}>
                <button
                  onClick={() => markRead(n.id)}
                  className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-[var(--surface-3)]"
                >
                  <span
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
                    style={{ background: kindColor[n.kind] }}
                  >
                    {kindIcon[n.kind]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 text-[13px] font-medium">
                      {n.title}
                      {!n.read && (
                        <span className="h-1.5 w-1.5 rounded-full bg-[var(--blue)]" />
                      )}
                    </p>
                    <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                      {n.body}
                    </p>
                    <p className="mt-1 text-[11px] text-[var(--text-quaternary)]">
                      {n.time}
                    </p>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </Dropdown>
  );
}

function UserMenu() {
  const { theme, toggleTheme, logout } = useStore();
  const router = useRouter();
  return (
    <Dropdown
      width={240}
      trigger={({ toggle }) => (
        <button
          onClick={toggle}
          className="flex items-center gap-2 rounded-full border bg-[var(--surface)] py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-[var(--surface-3)]"
        >
          <Avatar name={currentUser.name} color={currentUser.avatarColor} size={28} />
          <span className="hidden text-sm font-medium sm:block">
            {currentUser.name}
          </span>
          <ChevronDown size={15} className="hidden text-[var(--text-tertiary)] sm:block" />
        </button>
      )}
    >
      {(close) => (
        <div className="p-1.5">
          <div className="flex items-center gap-3 px-2.5 py-2">
            <Avatar name={currentUser.name} color={currentUser.avatarColor} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{currentUser.name}</p>
              <p className="truncate text-xs text-[var(--text-tertiary)]">
                {currentUser.department} ・ {currentUser.employeeNo}
              </p>
            </div>
          </div>
          <div className="my-1.5 h-px bg-[var(--hairline)]" />
          <MenuItem
            icon={<UserIcon size={16} />}
            label="プロフィール"
            onClick={() => {
              close();
              router.push("/members/m1");
            }}
          />
          <MenuItem
            icon={theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            label={theme === "dark" ? "ライトモード" : "ダークモード"}
            onClick={toggleTheme}
          />
          <MenuItem
            icon={<Settings size={16} />}
            label="設定"
            onClick={() => {
              close();
              router.push("/settings");
            }}
          />
          <div className="my-1.5 h-px bg-[var(--hairline)]" />
          <MenuItem
            icon={<LogOut size={16} />}
            label="ログアウト"
            danger
            onClick={() => {
              logout();
              router.push("/login");
            }}
          />
        </div>
      )}
    </Dropdown>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-2.5 py-2 text-sm font-medium transition-colors",
        danger
          ? "text-[var(--red)] hover:bg-[var(--red-soft)]"
          : "text-[var(--text)] hover:bg-[var(--surface-3)]"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { loggedIn, hydrated, theme, toggleTheme } = useStore();

  const bare = pathname === "/login" || pathname.startsWith("/kiosk");

  // auth gate
  useEffect(() => {
    if (hydrated && !loggedIn && !bare) router.replace("/login");
  }, [hydrated, loggedIn, bare, router]);

  if (bare) return <>{children}</>;

  const pageTitle =
    navSections
      .flatMap((s) => s.items)
      .find((i) =>
        i.href === "/" ? pathname === "/" : pathname.startsWith(i.href)
      )?.label ?? "ダッシュボード";

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-[244px] shrink-0 flex-col border-r bg-[var(--surface)] lg:flex">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 38 }}
              className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--surface)] shadow-2xl"
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-[var(--text-secondary)] hover:bg-[var(--surface-3)]"
              >
                <X size={20} />
              </button>
              <SidebarInner />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-3 border-b px-4 lg:px-7">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-[var(--text-secondary)] hover:bg-[var(--surface-3)] lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold tracking-tight lg:text-lg">
            {pageTitle}
          </h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)]"
              />
              <input
                placeholder="検索"
                className="h-10 w-48 rounded-full border bg-[var(--surface-2)] pl-9 pr-3 text-sm outline-none transition-all duration-200 placeholder:text-[var(--text-quaternary)] focus:w-60 focus:border-[var(--blue)] focus:bg-[var(--surface)] focus:ring-4 focus:ring-[var(--blue-soft)]"
              />
            </div>
            <button
              onClick={toggleTheme}
              className="rounded-full border bg-[var(--surface)] p-2.5 text-[var(--text-secondary)] transition-colors hover:text-[var(--blue)]"
              aria-label="テーマ切替"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <NotificationBell />
            <UserMenu />
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="mx-auto max-w-7xl"
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
