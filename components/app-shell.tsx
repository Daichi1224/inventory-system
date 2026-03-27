"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import AuthGuard from "@/components/auth-guard";
import LogoutButton from "@/components/logout-button";

export default function AppShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <AuthGuard>
      {!isLoginPage && (
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
      )}

      {children}
    </AuthGuard>
  );
}