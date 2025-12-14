import { useState, useEffect, useCallback } from "react";
import { Trash2, Plus, RefreshCw, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataBrowserProps {
  resourceId: string;
  fields: Record<string, string>;
  apiUrl: string;
}

export const DataBrowser = ({
  resourceId,
  fields,
  apiUrl,
}: DataBrowserProps) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/_mockserver/data/${resourceId}`);
      if (!res.ok) throw new Error("Failed to fetch data");
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
      // alert("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [apiUrl, resourceId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`${apiUrl}/_mockserver/data/${resourceId}/${id}`, {
        method: "DELETE",
      });
      setData(data.filter((d) => d.id !== id));
    } catch (e) {
      alert("Failed to delete");
    }
  };

  const handleSaveItem = async () => {
    try {
      const url = isNew
        ? `${apiUrl}/_mockserver/data/${resourceId}`
        : `${apiUrl}/_mockserver/data/${resourceId}/${editingItem.id}`;
      const method = isNew ? "POST" : "PUT";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingItem),
      });

      if (!res.ok) throw new Error("Failed to save");
      const saved = await res.json();

      if (isNew) {
        setData([...data, saved]);
      } else {
        setData(data.map((d) => (d.id === saved.id ? saved : d)));
      }
      setEditingItem(null);
      setIsNew(false);
    } catch (e) {
      alert("Failed to save item");
    }
  };

  if (loading)
    return <div className="p-8 text-center text-gray-400">Loading data...</div>;

  return (
    <div className="space-y-4">
      {editingItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">
                {isNew ? "New Item" : "Edit Item"}
              </h3>
              <button
                onClick={() => setEditingItem(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.keys(fields).map((field) => (
                <div key={field}>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">
                    {field} ({fields[field]})
                  </label>
                  {field === "id" && !isNew ? (
                    <input
                      disabled
                      value={editingItem[field] || ""}
                      className="w-full bg-gray-100 border border-gray-200 rounded px-3 py-2 text-gray-500 cursor-not-allowed"
                    />
                  ) : (
                    <input
                      value={editingItem[field] || ""}
                      onChange={(e) =>
                        setEditingItem({
                          ...editingItem,
                          [field]: e.target.value,
                        })
                      }
                      className="w-full bg-white border border-gray-200 rounded px-3 py-2 focus:ring-2 focus:ring-blue-100 focus:border-blue-400 outline-none"
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-3 mt-8">
              <button
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveItem}
                className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Save Item
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center">
        <h3 className="font-bold text-lg text-gray-800">
          Data Records ({data.length})
        </h3>
        <div className="flex gap-2">
          <button
            onClick={fetchData}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={() => {
              const schemaTemplate = Object.keys(fields).reduce(
                (acc, key) => ({ ...acc, [key]: "" }),
                {},
              );
              setEditingItem(schemaTemplate);
              setIsNew(true);
            }}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 transition"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 uppercase text-xs font-semibold">
              <tr>
                {Object.keys(fields).map((f) => (
                  <th key={f} className="px-4 py-3 min-w-[120px]">
                    {f}
                  </th>
                ))}
                <th className="px-4 py-3 w-20 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 group">
                  {Object.keys(fields).map((f) => (
                    <td key={f} className="px-4 py-3 max-w-[200px] truncate">
                      {typeof item[f] === "object"
                        ? JSON.stringify(item[f])
                        : String(item[f] || "")}
                    </td>
                  ))}
                  <td className="px-4 py-3 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setIsNew(false);
                      }}
                      className="text-blue-500 hover:bg-blue-50 p-1.5 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td
                    colSpan={Object.keys(fields).length + 1}
                    className="px-4 py-8 text-center text-gray-400 italic"
                  >
                    No data found. Add an item or generate data via API.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
