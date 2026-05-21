"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarClock,
  FileCheck2,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
  Clock4,
  Menu,
  X,
  Search,
  Bell,
  ChevronDown,
} from "lucide-react";
import { navSections } from "@/lib/nav";
import { currentUser } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const icons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  LayoutDashboard,
  CalendarClock,
  FileCheck2,
  CalendarDays,
  Users,
  BarChart3,
  Settings,
};

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-4">
      {navSections.map((section) => (
        <div key={section.title}>
          <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-subtle)]">
            {section.title}
          </p>
          <ul className="space-y-1">
            {section.items.map((item) => {
              const Icon = icons[item.icon];
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={cn(
                      "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[var(--color-primary)] text-white shadow-sm"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-primary-soft)] hover:text-[var(--color-primary)]"
                    )}
                  >
                    <Icon size={18} />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
                      <span
                        className={cn(
                          "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                          active
                            ? "bg-white/25 text-white"
                            : "bg-[var(--color-danger)] text-white"
                        )}
                      >
                        {item.badge}
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
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-primary)] text-white">
          <Clock4 size={20} />
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-bold text-[var(--color-text)]">
            キンタイ
            <span className="text-[var(--color-primary)]">Pro</span>
          </p>
          <p className="text-[10px] text-[var(--color-text-subtle)]">
            勤怠管理システム
          </p>
        </div>
      </div>
      <NavLinks />
      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white"
            style={{ background: currentUser.avatarColor }}
          >
            {currentUser.name.charAt(0)}
          </div>
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{currentUser.name}</p>
            <p className="truncate text-[11px] text-[var(--color-text-subtle)]">
              {currentUser.department}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pageTitle =
    navSections
      .flatMap((s) => s.items)
      .find((i) =>
        i.href === "/" ? pathname === "/" : pathname.startsWith(i.href)
      )?.label ?? "ダッシュボード";

  return (
    <div className="flex min-h-screen">
      {/* Desktop sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r bg-[var(--color-surface)] lg:flex">
        <SidebarInner />
      </aside>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-[var(--color-surface)] shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 z-10 rounded-lg p-1.5 text-[var(--color-text-muted)] hover:bg-slate-100"
            >
              <X size={20} />
            </button>
            <SidebarInner />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-[var(--color-surface)]/85 px-4 backdrop-blur lg:px-7">
          <button
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 text-[var(--color-text-muted)] hover:bg-slate-100 lg:hidden"
          >
            <Menu size={20} />
          </button>
          <h1 className="text-base font-semibold lg:text-lg">{pageTitle}</h1>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative hidden md:block">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]"
              />
              <input
                placeholder="メンバー・申請を検索"
                className="h-10 w-56 rounded-xl border bg-[var(--color-surface-muted)] pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-[var(--color-text-subtle)] focus:border-[var(--color-primary)] focus:bg-white"
              />
            </div>
            <button className="relative rounded-xl border bg-[var(--color-surface)] p-2.5 text-[var(--color-text-muted)] transition-colors hover:text-[var(--color-primary)]">
              <Bell size={18} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--color-danger)] ring-2 ring-white" />
            </button>
            <button className="flex items-center gap-2 rounded-xl border bg-[var(--color-surface)] py-1.5 pl-1.5 pr-2.5 transition-colors hover:bg-slate-50">
              <span
                className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white"
                style={{ background: currentUser.avatarColor }}
              >
                {currentUser.name.charAt(0)}
              </span>
              <span className="hidden text-sm font-medium sm:block">
                {currentUser.name}
              </span>
              <ChevronDown
                size={15}
                className="hidden text-[var(--color-text-subtle)] sm:block"
              />
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-7 lg:py-8">
          <div className="mx-auto max-w-7xl animate-fade-in">{children}</div>
        </main>
      </div>
    </div>
  );
}
