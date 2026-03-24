"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase/client";

type InventoryRow = {
  id: string;
  item_code: string;
  item_name: string;
  category: string;
  unit: string;
  current_stock: number;
};

export default function Home() {
  const [inventoryList, setInventoryList] = useState<InventoryRow[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInventory() {
      setLoading(true);
      setErrorMessage(null);

      const { data, error } = await supabase
        .from("item_stock_summary")
        .select("*")
        .order("item_code", { ascending: true });

      if (error) {
        setErrorMessage(`データ取得に失敗しました: ${error.message}`);
        setInventoryList([]);
        setLoading(false);
        return;
      }

      setInventoryList((data ?? []) as InventoryRow[]);
      setLoading(false);
    }

    fetchInventory();
  }, []);

  const filteredInventoryList = useMemo(() => {
    const keyword = q.trim().toLowerCase();
    if (!keyword) return inventoryList;

    return inventoryList.filter((item) =>
      item.item_name.toLowerCase().includes(keyword)
    );
  }, [inventoryList, q]);

  return (
    <main className="page-container">
      <h1 className="page-title">在庫一覧</h1>

      <div className="card section-spacing" style={{ padding: 20, marginBottom: 20 }}>
        <div className="toolbar">
          <div className="form-group">
            <label className="label">品目名</label>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="キーワードを入力"
              className="input"
            />
          </div>

          <div className="actions">
            <button type="button" className="button">
              検索
            </button>
            <button
              type="button"
              className="button button-secondary"
              onClick={() => setQ("")}
            >
              条件をクリア
            </button>
          </div>
        </div>

        {errorMessage && <p className="error-text">{errorMessage}</p>}
      </div>

      <div className="card table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>品目コード</th>
              <th>品目名</th>
              <th>カテゴリ</th>
              <th>現在在庫数</th>
              <th>単位</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5}>読み込み中...</td>
              </tr>
            ) : filteredInventoryList.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  {q ? "該当する在庫がありません" : "データがありません"}
                </td>
              </tr>
            ) : (
              filteredInventoryList.map((item) => (
                <tr key={item.id}>
                  <td>{item.item_code}</td>
                  <td>{item.item_name}</td>
                  <td>{item.category}</td>
                  <td>{item.current_stock}</td>
                  <td>{item.unit}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}