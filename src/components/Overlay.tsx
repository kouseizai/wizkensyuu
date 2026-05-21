"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { X, Check, AlertTriangle, Info, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

/* ============ Modal ============ */
export function Modal({
  open,
  onClose,
  title,
  desc,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!mounted) return null;
  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/30 backdrop-blur-[6px]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className={cn(
              "relative w-full overflow-hidden rounded-t-[var(--radius-3xl)] border bg-[var(--bg-elevated)] shadow-[var(--shadow-xl)] sm:rounded-[var(--radius-3xl)]",
              widths[size]
            )}
          >
            {(title || desc) && (
              <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
                <div>
                  {title && (
                    <h2 className="text-lg font-semibold tracking-tight">
                      {title}
                    </h2>
                  )}
                  {desc && (
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">
                      {desc}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="-mr-1 rounded-full p-1.5 text-[var(--text-tertiary)] transition-colors hover:bg-[var(--surface-3)]"
                >
                  <X size={18} />
                </button>
              </div>
            )}
            <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
              {children}
            </div>
            {footer && (
              <div className="flex justify-end gap-2 border-t bg-[var(--surface-2)] px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ============ Toast ============ */
type ToastKind = "success" | "error" | "info" | "warning";
type Toast = { id: number; kind: ToastKind; title: string; desc?: string };

const ToastCtx = createContext<{
  toast: (t: Omit<Toast, "id">) => void;
} | null>(null);

const toastIcon: Record<ToastKind, React.ReactNode> = {
  success: <Check size={18} />,
  error: <CircleAlert size={18} />,
  info: <Info size={18} />,
  warning: <AlertTriangle size={18} />,
};
const toastColor: Record<ToastKind, string> = {
  success: "var(--green)",
  error: "var(--red)",
  info: "var(--blue)",
  warning: "var(--orange)",
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [mounted, setMounted] = useState(false);
  const idRef = useRef(0);
  useEffect(() => setMounted(true), []);

  const toast = useCallback((t: Omit<Toast, "id">) => {
    const id = ++idRef.current;
    setToasts((p) => [...p, { ...t, id }]);
    setTimeout(() => setToasts((p) => p.filter((x) => x.id !== id)), 3600);
  }, []);

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      {mounted &&
        createPortal(
          <div className="pointer-events-none fixed bottom-5 left-1/2 z-[200] flex w-full max-w-sm -translate-x-1/2 flex-col gap-2 px-4">
            <AnimatePresence>
              {toasts.map((t) => (
                <motion.div
                  key={t.id}
                  layout
                  initial={{ opacity: 0, y: 24, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ type: "spring", stiffness: 420, damping: 30 }}
                  className="glass pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 shadow-[var(--shadow-lg)]"
                >
                  <span
                    className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-white"
                    style={{ background: toastColor[t.kind] }}
                  >
                    {toastIcon[t.kind]}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{t.title}</p>
                    {t.desc && (
                      <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                        {t.desc}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>,
          document.body
        )}
    </ToastCtx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) return { toast: () => {} };
  return ctx;
}

/* ============ Dropdown / Popover ============ */
export function Dropdown({
  trigger,
  children,
  align = "right",
  width = 320,
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => React.ReactNode;
  children: (close: () => void) => React.ReactNode;
  align?: "left" | "right";
  width?: number;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  return (
    <div ref={ref} className="relative">
      {trigger({ open, toggle: () => setOpen((v) => !v) })}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -6 }}
            transition={{ type: "spring", stiffness: 460, damping: 32 }}
            style={{ width, transformOrigin: align === "right" ? "top right" : "top left" }}
            className={cn(
              "glass absolute z-50 mt-2 overflow-hidden rounded-2xl border shadow-[var(--shadow-lg)]",
              align === "right" ? "right-0" : "left-0"
            )}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
