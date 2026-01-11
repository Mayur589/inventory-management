import { useEffect, useState, useMemo } from "react";
import { createTransactions, getItems, getTransactionsByDate } from "../services/api";

export const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [session, setSession] = useState("morning");
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });

  const currentDate = new Date();
  const customDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, "0")}-${currentDate.getDate().toString().padStart(2, "0")}`;

  // Fetch Logic
  useEffect(() => {
    let ignore = false;
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getItems();
        const trxRes = await getTransactionsByDate(customDate, session);

        const itemData = res.data.data;
        const trxData = trxRes?.data?.data?.items ?? [];

        if (!ignore) {
          const mergeData = itemData.map((item) => {
            const trx = trxData.find((t) => t.item_id === item._id);
            return trx
              ? { ...item, quantity: trx.quantity || 0 }
              : { ...item, item_id: item._id, quantity: 0 };
          });
          setItems(mergeData);
        }
      } catch (err) {
        console.error("Error fetching:", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };
    fetchData();
    return () => { ignore = true; };
  }, [session, customDate]);

  // Search Filter
  const filteredItems = items.filter(i =>
    i.item_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const total = useMemo(() => {
    return items.reduce((sum, i) => sum + (i.quantity || 0) * (i.default_cost_price || 0), 0);
  }, [items]);

  const handleQty = (id, delta) => {
    setItems(prev => prev.map(i =>
      i._id === id ? { ...i, quantity: Math.max(0, (i.quantity || 0) + delta) } : i
    ));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToGive = {
      date: customDate,
      session: session,
      items: items
        .filter(i => i.quantity > 0)
        .map(i => ({
          item_id: i._id,
          item_name: i.item_name,
          // CRITICAL: Must match backend keys exactly for profit calc
          default_cost_price: i.default_cost_price,
          default_selling_price: i.default_selling_price,
          quantity: i.quantity
        }))
    };

    try {
      await createTransactions(dataToGive);
      setStatus({ type: "success", message: "Inventory saved! ✅" });
      setTimeout(() => setStatus({ type: "", message: "" }), 3000);
    } catch (err) {
      console.error("Submit Error:", err.response?.data);
      setStatus({ type: "error", message: "Failed to save. Check fields." });
    }
  };

  if (loading) return <div className="p-10 text-center dark:text-white">Loading Inventory...</div>;

  return (
    <div className="bg-gray-100 dark:bg-gray-900 min-h-screen p-4">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">

        {/* Header */}
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center bg-indigo-600">
          <h2 className="text-xl font-bold text-white">Inventory</h2>
          <select
            value={session}
            onChange={(e) => setSession(e.target.value)}
            className="bg-indigo-500 text-white border-none rounded-lg px-3 py-1 outline-none"
          >
            <option value="morning">🌅 Morning</option>
            <option value="afternoon">🌞 Afternoon</option>
          </select>
        </div>

        {/* Search */}
        <div className="p-4 border-b dark:border-gray-700">
          <input
            type="text"
            placeholder="Search item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 rounded-lg border dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Items List */}
        <div className="divide-y dark:divide-gray-700 max-h-96 overflow-y-auto">
          {filteredItems.map(item => (
            <div key={item._id} className="p-4 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/40">
              <div className="flex-1">
                <p className="font-semibold dark:text-white">{item.item_name}</p>
                <p className="text-sm text-gray-500">Rate: ₹{item.default_cost_price}</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg dark:border-gray-600 overflow-hidden">
                  <button type="button" onClick={() => handleQty(item._id, -1)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200">-</button>
                  <input
                    type="number"
                    value={item.quantity || ""}
                    onChange={(e) => handleQty(item._id, Number(e.target.value) - (item.quantity || 0))}
                    className="w-12 text-center bg-transparent dark:text-white outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder="0"
                  />
                  <button type="button" onClick={() => handleQty(item._id, 1)} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 dark:text-white hover:bg-gray-200">+</button>
                </div>
                <div className="w-20 text-right font-mono dark:text-gray-300">
                  ₹{(item.quantity || 0) * item.default_cost_price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 dark:bg-gray-700 border-t dark:border-gray-600 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 uppercase">Total Cost</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400">₹{total}</p>
          </div>
          <button type="submit" className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold shadow-lg hover:bg-indigo-700 transition">
            Save Data
          </button>
        </div>
      </form>

      {status.message && (
        <div className={`fixed bottom-5 right-5 p-4 rounded-lg shadow-xl text-white ${status.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {status.message}
        </div>
      )}
    </div>
  );
};
