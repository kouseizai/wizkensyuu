import type { Metadata } from "next";
import "./globals.css";
import { StoreProvider } from "@/lib/store";
import { ToastProvider } from "@/components/Overlay";
import AppShell from "@/components/AppShell";

export const metadata: Metadata = {
  title: "キンタイPro | 勤怠管理システム",
  description:
    "出退勤の打刻・勤怠管理・申請承認・休暇・シフト・レポートをまとめて管理できる勤怠管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body>
        <StoreProvider>
          <ToastProvider>
            <AppShell>{children}</AppShell>
          </ToastProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
