import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import AuthGuard from "@/components/auth-guard";
import LogoutButton from "@/components/logout-button";

export const metadata: Metadata = {
  title: "在庫管理システム",
  description: "在庫管理システム",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>
        <AuthGuard>
          <header className="header">
            <div className="header-inner">
              <Link href="/" className="site-title">
                在庫管理システム
              </Link>

              <nav className="nav">
                <Link href="/" className="nav-link">
                  在庫一覧
                </Link>
                <Link href="/items" className="nav-link">
                  品目一覧
                </Link>
                <Link href="/items/new" className="nav-link">
                  品目追加
                </Link>
                <Link href="/stock-in" className="nav-link">
                  入庫登録
                </Link>
                <Link href="/stock-out" className="nav-link">
                  出庫登録
                </Link>
              </nav>

              <div style={{ marginLeft: "auto" }}>
                <LogoutButton />
              </div>
            </div>
          </header>

          {children}
        </AuthGuard>
      </body>
    </html>
  );
}