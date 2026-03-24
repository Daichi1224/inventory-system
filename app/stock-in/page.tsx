"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type ItemOption = {
  id: string;
  item_code: string;
  item_name: string;
};

type FieldErrors = {
  item_id?: string;
  quantity?: string;
  movement_date?: string;
};

export default function StockInPage() {
  const router = useRouter();

  const [items, setItems] = useState<ItemOption[]>([]);
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [movementDate, setMovementDate] = useState(
    new Date().toISOString().slice(0, 10)
  );
  const [note, setNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [pending, setPending] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      const { data, error } = await supabase
        .from("items")
        .select("id, item_code, item_name")
        .order("item_code", { ascending: true });

      if (error) {
        setSubmitError(`品目一覧の取得に失敗しました: ${error.message}`);
        setLoading(false);
        return;
      }

      setItems((data ?? []) as ItemOption[]);
      setLoading(false);
    }

    fetchItems();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitError(null);

    const errors: FieldErrors = {};
    const qty = Number(quantity);

    if (!itemId) {
      errors.item_id = "品目を選択してください";
    }

    if (!quantity.trim()) {
      errors.quantity = "入庫数量を入力してください";
    } else if (!Number.isInteger(qty) || qty <= 0) {
      errors.quantity = "入庫数量は1以上の整数で入力してください";
    }

    if (!movementDate) {
      errors.movement_date = "入庫日を入力してください";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setFieldErrors({});
    setPending(true);

    const { error } = await supabase.from("stock_movements").insert({
      item_id: itemId,
      movement_type: "in",
      quantity: qty,
      movement_date: movementDate,
      note: note.trim() || null,
    });

    setPending(false);

    if (error) {
      setSubmitError(`登録に失敗しました: ${error.message}`);
      return;
    }

    router.push("/");
    router.refresh();
  }

  if (loading) {
    return (
      <main className="page-container">
        <p className="info-text">読み込み中...</p>
      </main>
    );
  }

  return (
    <main className="page-container">
      <h1 className="page-title">入庫登録</h1>

      <div className="card form-card">
        <form onSubmit={handleSubmit} className="form-grid">
          <div className="form-group">
            <label className="label">品目</label>
            <select
              value={itemId}
              onChange={(e) => setItemId(e.target.value)}
              className="select"
            >
              <option value="">選択してください</option>
              {items.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.item_code} / {item.item_name}
                </option>
              ))}
            </select>
            {fieldErrors.item_id ? (
              <p className="error-text">{fieldErrors.item_id}</p>
            ) : null}
          </div>

          <div className="form-group">
            <label className="label">入庫数量</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="input"
              min={1}
              step={1}
            />
            {fieldErrors.quantity ? (
              <p className="error-text">{fieldErrors.quantity}</p>
            ) : null}
          </div>

          <div className="form-group">
            <label className="label">入庫日</label>
            <input
              type="date"
              value={movementDate}
              onChange={(e) => setMovementDate(e.target.value)}
              className="input"
            />
            {fieldErrors.movement_date ? (
              <p className="error-text">{fieldErrors.movement_date}</p>
            ) : null}
          </div>

          <div className="form-group">
            <label className="label">備考</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              className="textarea"
            />
          </div>

          {submitError ? (
            <p className="error-text" role="alert">
              {submitError}
            </p>
          ) : null}

          <div className="actions section-spacing">
            <button type="submit" disabled={pending} className="button">
              {pending ? "登録中..." : "登録"}
            </button>

            <a href="/" className="button button-secondary">
              戻る
            </a>
          </div>
        </form>
      </div>
    </main>
  );
}