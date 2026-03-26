"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isAllowed, setIsAllowed] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      const isLoginPage = pathname === "/login";

      if (!session && !isLoginPage) {
        window.location.href = "/login";
        return;
      }

      if (session && isLoginPage) {
        window.location.href = "/";
        return;
      }

      setIsAllowed(true);
      setChecking(false);
    }

    checkSession();

    return () => {
      mounted = false;
    };
  }, [pathname]);

  if (checking) {
    return (
      <main className="page-container">
        <p className="info-text">認証確認中...</p>
      </main>
    );
  }

  if (!isAllowed) {
    return null;
  }

  return <>{children}</>;
}