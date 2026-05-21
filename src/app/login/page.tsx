"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "motion/react";
import { Clock4, Mail, Lock, ArrowRight, Monitor } from "lucide-react";
import { useStore } from "@/lib/store";
import { inputCls } from "@/components/forms";

export default function LoginPage() {
  const { login } = useStore();
  const router = useRouter();
  const [email, setEmail] = useState("yamada@example.com");
  const [pw, setPw] = useState("password");
  const [loading, setLoading] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      login();
      router.push("/");
    }, 700);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[var(--bg)] px-4">
      {/* ambient gradient blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[var(--blue)] opacity-20 blur-[120px]"
        />
        <motion.div
          animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-40 -right-24 h-[28rem] w-[28rem] rounded-full bg-[var(--purple)] opacity-20 blur-[130px]"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 26 }}
        className="glass relative w-full max-w-md rounded-[var(--radius-3xl)] border p-8 shadow-[var(--shadow-xl)] sm:p-10"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--blue)] text-white shadow-lg">
            <Clock4 size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            キンタイ<span className="text-[var(--blue)]">Pro</span>
          </h1>
          <p className="mt-1.5 text-sm text-[var(--text-secondary)]">
            アカウントにログインしてください
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium">メールアドレス</label>
            <div className="relative">
              <Mail
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)]"
              />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`${inputCls} pl-11`}
                required
              />
            </div>
          </div>
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium">パスワード</label>
              <button
                type="button"
                className="text-xs font-medium text-[var(--blue)] hover:underline"
              >
                パスワードを忘れた方
              </button>
            </div>
            <div className="relative">
              <Lock
                size={17}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-quaternary)]"
              />
              <input
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                className={`${inputCls} pl-11`}
                required
              />
            </div>
          </div>

          <motion.button
            type="submit"
            whileTap={{ scale: 0.97 }}
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-[var(--blue)] text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-[var(--blue-hover)] disabled:opacity-60"
          >
            {loading ? (
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="h-5 w-5 rounded-full border-2 border-white/40 border-t-white"
              />
            ) : (
              <>
                ログイン <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-6 flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
          <div className="h-px flex-1 bg-[var(--hairline)]" />
          または
          <div className="h-px flex-1 bg-[var(--hairline)]" />
        </div>

        <Link
          href="/kiosk"
          className="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl border bg-[var(--surface)] text-sm font-medium transition-colors hover:bg-[var(--surface-3)]"
        >
          <Monitor size={18} />
          打刻専用端末モード
        </Link>

        <p className="mt-6 text-center text-xs text-[var(--text-quaternary)]">
          デモ環境です。そのままログインできます。
        </p>
      </motion.div>
    </div>
  );
}
