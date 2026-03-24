"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type ItemRow = {
  id: string;
  item_code: string;
  item_name: string;
  category: string;
  unit: string;
};

export default function ItemsPage() {
  const [items, setItems] = useState<ItemRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function fetchItems(searchText = "") {
    setLoading(true);
    setErrorMessage(null);

    let query = supabase
      .from("items")
      .select("id, item_code, item_name, category, unit")
      .order("item_code", { ascending: true });

    if (searchText.trim()) {
      query = query.ilike("item_name", `%${searchText.trim()}%`);
    }

    const { data, error } = await query;

    if (error) {
      setErrorMessage(`データ取得に失敗しました: ${error.message}`);
      setItems([]);
      setLoading(false);
      return;
    }

    setItems((data ?? []) as ItemRow[]);
    setLoading(false);
  }

  useEffect(() => {
    fetchItems();
  }, []);

  async function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    fetchItems(q);
  }

  async function handleDelete(itemId: string, itemName: string) {
    setErrorMessage(null);

    const confirmed = window.confirm(`「${itemName}」を削除しますか？`);
    if (!confirmed) return;

    const { count, error: countError } = await supabase
      .from("stock_movements")
      .select("*", { count: "exact", head: true })
      .eq("item_id", itemId);

    if (countError) {
      setErrorMessage(`削除前チェックに失敗しました: ${countError.message}`);
      return;
    }

    if ((count ?? 0) > 0) {
      setErrorMessage("入出庫履歴がある品目は削除できません。");
      return;
    }

    const { error: deleteError } = await supabase
      .from("items")
      .delete()
      .eq("id", itemId);

    if (deleteError) {
      setErrorMessage(`削除に失敗しました: ${deleteError.message}`);
      return;
    }

    fetchItems(q);
  }

  return (
    <main className="page-container">
      <h1 className="page-title">品目一覧</h1>

      <div className="toolbar" style={{ marginBottom: 20 }}>
        <a href="/items/new" className="button">
          品目追加
        </a>
      </div>

      <div className="card" style={{ padding: 20, marginBottom: 20 }}>
        <form onSubmit={handleSearch} className="toolbar">
          <div className="form-group">
            <label className="label">品目名</label>
            <input
              type="search"
              name="q"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="キーワードを入力"
              className="input"
            />
          </div>

          <div className="actions">
            <button type="submit" className="button">
              検索
            </button>

            <button
              type="button"
              className="button button-secondary"
              onClick={() => {
                setQ("");
                fetchItems("");
              }}
            >
              条件をクリア
            </button>
          </div>
        </form>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>品目コード</th>
              <th>品目名</th>
              <th>カテゴリ</th>
              <th>単位</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>読み込み中...</td>
              </tr>
            ) : items.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  {q ? "該当する品目がありません" : "データがありません"}
                </td>
              </tr>
            ) : (
              items.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_code}</td>
                  <td>{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.unit}</td>
                  <td>
                    <div className="actions">
                      <a
                        href={`/items/${item.id}/edit`}
                        className="inline-link"
                      >
                        編集
                      </a>
                      <button
                        type="button"
                        className="button button-secondary"
                        onClick={() => handleDelete(item.id, item.item_name)}
                        style={{ minHeight: 32, padding: "0 12px" }}
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}