"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    setPending(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <main
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <div style={{ width: "100%", maxWidth: "420px" }}>
        <h1
          style={{
            textAlign: "center",
            marginBottom: "24px",
            fontSize: "24px",
            fontWeight: "bold",
          }}
        >
          ログイン
        </h1>

        <div className="card form-card">
          <form onSubmit={handleSubmit} className="form-grid">
            <div className="form-group">
              <label className="label">メールアドレス</label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="label">パスワード</label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            {errorMessage && <p className="error-text">{errorMessage}</p>}

            <button type="submit" className="button" disabled={pending}>
              {pending ? "ログイン中..." : "ログイン"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}