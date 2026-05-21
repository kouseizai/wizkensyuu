"use client";

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import {
  Search,
  LayoutDashboard,
  CalendarClock,
  FileCheck2,
  CalendarDays,
  Palmtree,
  Users,
  BarChart3,
  Settings,
  Monitor,
  CornerDownLeft,
} from "lucide-react";
import { navSections } from "@/lib/nav";
import { members } from "@/lib/mock-data";
import { Avatar } from "@/components/ui";

const navIcons: Record<string, React.ComponentType<{ size?: number }>> = {
  LayoutDashboard,
  CalendarClock,
  FileCheck2,
  CalendarDays,
  Palmtree,
  Users,
  BarChart3,
  Settings,
};

type Item =
  | { kind: "page"; label: string; href: string; icon: React.ComponentType<{ size?: number }> }
  | { kind: "member"; label: string; sub: string; href: string; color: string };

export default function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const allItems: Item[] = useMemo(() => {
    const pages: Item[] = navSections
      .flatMap((s) => s.items)
      .map((i) => ({ kind: "page", label: i.label, href: i.href, icon: navIcons[i.icon] }));
    pages.push({ kind: "page", label: "打刻専用画面", href: "/kiosk", icon: Monitor });
    const mem: Item[] = members.map((m) => ({
      kind: "member",
      label: m.name,
      sub: `${m.department} ・ ${m.role}`,
      href: `/members/${m.id}`,
      color: m.avatarColor,
    }));
    return [...pages, ...mem];
  }, []);

  const results = useMemo(() => {
    if (!q.trim()) return allItems;
    const lower = q.toLowerCase();
    return allItems.filter(
      (i) =>
        i.label.toLowerCase().includes(lower) ||
        (i.kind === "member" && i.sub.toLowerCase().includes(lower))
    );
  }, [q, allItems]);

  useEffect(() => setActive(0), [q, open]);
  useEffect(() => {
    if (open) setQ("");
  }, [open]);

  const go = (item: Item) => {
    router.push(item.href);
    onClose();
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, results.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter" && results[active]) {
        e.preventDefault();
        go(results[active]);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  });

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-[6px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border bg-[var(--bg-elevated)] shadow-[var(--shadow-xl)]"
          >
            <div className="flex items-center gap-3 border-b px-4">
              <Search size={18} className="text-[var(--text-tertiary)]" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="ページ・メンバーを検索…"
                className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-[var(--text-quaternary)]"
              />
              <kbd className="rounded-md border bg-[var(--surface-2)] px-1.5 py-0.5 text-[10px] text-[var(--text-tertiary)]">
                ESC
              </kbd>
            </div>
            <ul className="max-h-[52vh] overflow-y-auto p-2">
              {results.length === 0 && (
                <li className="px-3 py-8 text-center text-sm text-[var(--text-tertiary)]">
                  「{q}」に一致する項目がありません
                </li>
              )}
              {results.map((item, idx) => (
                <li key={item.href}>
                  <button
                    onMouseEnter={() => setActive(idx)}
                    onClick={() => go(item)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                      active === idx ? "bg-[var(--blue-soft)]" : ""
                    }`}
                  >
                    {item.kind === "page" ? (
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--surface-3)] text-[var(--text-secondary)]">
                        <item.icon size={16} />
                      </span>
                    ) : (
                      <Avatar name={item.label} color={item.color} size={32} />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{item.label}</p>
                      {item.kind === "member" && (
                        <p className="truncate text-xs text-[var(--text-tertiary)]">{item.sub}</p>
                      )}
                    </div>
                    <span className="text-[10px] text-[var(--text-quaternary)]">
                      {item.kind === "page" ? "ページ" : "メンバー"}
                    </span>
                    {active === idx && <CornerDownLeft size={14} className="text-[var(--blue)]" />}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
