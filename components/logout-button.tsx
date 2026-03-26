"use client";

import { supabase } from "@/lib/supabase/client";

export default function LogoutButton() {
  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  return (
    <button
      type="button"
      className="button button-secondary"
      onClick={handleLogout}
    >
      ログアウト
    </button>
  );
}