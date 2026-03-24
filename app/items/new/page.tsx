"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type FieldKey = "item_code" | "item_name" | "category" | "unit";
type FieldErrors = Partial<Record<FieldKey, string>>;

export default function NewItemPage() {
  const router = useRouter();
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [unit, setUnit] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const code = itemCode.trim();
    const name = itemName.trim();
    const cat = category.trim();
    const u = unit.trim();

    const errors: FieldErrors = {};
    if (!code) errors.item_code = "品目コードを入力してください";
    if (!name) errors.item_name = "品目名を入力してください";
    if (!cat) errors.category = "カテゴリを入力してください";
    if (!u) errors.unit = "単位を入力してください";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setPending(true);

    const { error } = await supabase.from("items").insert({
      item_code: code,
      item_name: name,
      category: cat,
      unit: u,
    });

    setPending(false);

    if (error) {
      setSubmitError(error.message);
      return;
    }

    router.push("/items");
    router.refresh();
  }

  return (
    <main className="page-container">
      <h1 className="page-title">品目追加</h1>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="label">品目コード</label>
            <input
              type="text"
              name="item_code"
              value={itemCode}
              onChange={(e) => setItemCode(e.target.value)}
              autoComplete="off"
              className="input"
              aria-invalid={fieldErrors.item_code ? true : undefined}
              aria-describedby={fieldErrors.item_code ? "err-item_code" : undefined}
            />
            {fieldErrors.item_code ? (
              <p id="err-item_code" className="error-text">
                {fieldErrors.item_code}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label className="label">品目名</label>
            <input
              type="text"
              name="item_name"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              autoComplete="off"
              className="input"
              aria-invalid={fieldErrors.item_name ? true : undefined}
              aria-describedby={fieldErrors.item_name ? "err-item_name" : undefined}
            />
            {fieldErrors.item_name ? (
              <p id="err-item_name" className="error-text">
                {fieldErrors.item_name}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label className="label">カテゴリ</label>
            <input
              type="text"
              name="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              autoComplete="off"
              className="input"
              aria-invalid={fieldErrors.category ? true : undefined}
              aria-describedby={fieldErrors.category ? "err-category" : undefined}
            />
            {fieldErrors.category ? (
              <p id="err-category" className="error-text">
                {fieldErrors.category}
              </p>
            ) : null}
          </div>

          <div className="form-group">
            <label className="label">単位</label>
            <input
              type="text"
              name="unit"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              autoComplete="off"
              className="input"
              aria-invalid={fieldErrors.unit ? true : undefined}
              aria-describedby={fieldErrors.unit ? "err-unit" : undefined}
            />
            {fieldErrors.unit ? (
              <p id="err-unit" className="error-text">
                {fieldErrors.unit}
              </p>
            ) : null}
          </div>

          {submitError ? (
            <p className="error-text" role="alert">
              登録に失敗しました: {submitError}
            </p>
          ) : null}

          <div className="actions section-spacing">
            <button type="submit" disabled={pending} className="button">
              {pending ? "登録中…" : "登録"}
            </button>
            <a href="/items" className="button button-secondary">
              戻る
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}