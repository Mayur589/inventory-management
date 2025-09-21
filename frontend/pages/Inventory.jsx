import { useEffect, useState } from "react";
import {
  createTransactions,
  getItems,
  getTransactionsByDate,
} from "../services/api";

export const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [session, setSession] = useState("morning");
  const [total, setTotal] = useState(0);

  //creating the curr date of format (yyyy - mm - dd)
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth() + 1;
  const day = currentDate.getDate();
  const customDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  useEffect(() => {
    let ignore = false;

    const fetchData = async () => {
      console.log("fetching.....");
      try {
        const res = await getItems();
        const trxRes = await getTransactionsByDate(customDate, session);

        const itemData = res.data.data;
        const trxData = trxRes?.data?.data?.items ?? [];
        console.log(trxData);

        if (!ignore) {
          const mergeData = itemData.map((item) => {
            const trx = trxData.find((t) => t.item_id === item._id);
            return trx
              ? {
                  ...trx,
                  _id: item._id,
                  cost_price: item.default_cost_price,
                  sell_price: item.default_selling_price,
                } // keep the DB _id for updates
              : { ...item, item_id: item._id, quantity: 0 };
          });
          setItems(mergeData);
        }
      } catch (err) {
        console.error("Error in getting itemData: ", err);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchData();

    return () => {
      ignore = true;
    };
  }, [session, customDate]);
  
  useEffect(() => {
    const totalPrice = items.reduce(
      (sum, item) =>
        sum +
        (item.quantity || 0) *
          (item.cost_price ?? item.default_cost_price ?? 0),
      0,
    );
    const roundedTotal = Math.round(totalPrice * 100) / 100;
    setTotal(roundedTotal);
    console.log(roundedTotal);
  }, [items]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const dataToGive = {
      date: customDate,
      session: session,
      items: items.map((item) => ({
        item_id: item._id ?? item.item_id,
        item_name: item.item_name,
        cost_price: item.default_cost_price ?? item.cost_price,
        sell_price: item.default_selling_price ?? item.sell_price,
        quantity: item.quantity || 0,
      })),
    };
    console.log(dataToGive);
    try {
      await createTransactions(dataToGive);
      console.log("Transaction success");
    } catch (err) {
      console.error("Transaction Error ", err);
    }
  };

  return (
    <div className="navigation bg-gray-100 dark:bg-gray-900 min-h-screen p-6">
      <form
        className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-xl p-6"
        onSubmit={handleSubmit}
      >
        {/* Header */}
        <div className="heading flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <h3 className="text-xl font-semibold text-indigo-600 dark:text-indigo-400">Inventory</h3>
          <div>
            <select
              id="time-select"
              value={session ?? "morning"}
              onChange={(e) => setSession(e.target.value)}
              className="block w-48 px-4 py-2 rounded-lg border border-indigo-300 dark:border-indigo-500 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 transition"
            >
              <option value="morning">🌅 Morning</option>
              <option value="afternoon">🌞 Afternoon</option>
            </select>
          </div>
        </div>
    
        {/* Items */}
        <div className="main space-y-3">
          {items.map((item) => (
            <div
              key={item.item_id ?? item._id}
              className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-100">
                {item.item_name}
              </h3>
              <input
                type="number"
                placeholder="0"
                value={item.quantity === 0 ? "" : item.quantity}
                min={0}
                onChange={(e) =>
                  setItems((prev) =>
                    prev.map((i) =>
                      i._id === item._id
                        ? {
                            ...i,
                            quantity:
                              e.target.value === "" ? 0 : Number(e.target.value),
                          }
                        : i
                    )
                  )
                }
                className="w-28 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-indigo-600 text-gray-700 dark:text-gray-100 shadow-sm"
              />
            </div>
          ))}
        </div>
    
        {/* Total */}
        <div className="main space-y-3">
          <div className="flex justify-between items-center px-6 py-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 shadow-sm mt-6">
            <h3 className="text-base font-semibold text-indigo-600 dark:text-indigo-400 tracking-wide">
              Total
            </h3>
            <div className="w-32 px-4 py-2 bg-indigo-600 dark:bg-indigo-500 border border-gray-300 rounded-lg text-white shadow-sm text-center font-medium">
              ₹{total}
            </div>
          </div>
        </div>
    
        {/* Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 rounded-lg bg-indigo-600 dark:bg-indigo-500 text-white font-medium shadow hover:bg-indigo-500 dark:hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-indigo-400 transition"
          >
            Submit
          </button>
        </div>
      </form>
    </div>

  );
};
