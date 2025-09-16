import { useEffect, useState } from "react";
import {
  createTransactions,
  getItems,
  getTransactionsByDate,
} from "../services/api";

export const Inventory = () => {
  const [loading, setLoading] = useState(true);
  const [transactions, setTransactions] = useState({
    quantity: 0,
  });
  const [items, setItems] = useState([]);
  const [session, setSession] = useState("morning");
  const [newItem, setNewItem] = useState([]);
  const [total, setTotal] = useState(0.00);

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
            return trx ? trx : { ...item, quantity: 0 };
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
    <>
      <div className="navigation bg-gray-50 min-h-screen p-6">
        <form
          className="max-w-3xl mx-auto bg-white shadow-md rounded-xl p-6"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <div className="heading flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
            <h3 className="text-xl font-semibold text-[#224193]">Inventory</h3>
            <div>
              <select
                id="time-select"
                value={session ?? "morning"} // default value
                onChange={(e) => setSession(e.target.value)}
                className="block w-48 px-4 py-2 rounded-lg border border-[#6f9bd1] bg-white shadow-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#6f9bd1] focus:border-[#224193] transition"
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
                className="flex justify-between items-center px-6 py-4 bg-gray-50 rounded-lg hover:bg-[#f1f5fb] transition"
              >
                <h3 className="text-sm font-medium text-gray-700">
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
                                e.target.value === ""
                                  ? 0
                                  : Number(e.target.value),
                            }
                          : i,
                      ),
                    )
                  }
                  className="w-28 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#6f9bd1] focus:border-[#224193] text-gray-700 shadow-sm"
                />
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-lg bg-[#224193] text-white font-medium shadow hover:bg-[#6f9bd1] focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#6f9bd1] transition"
              onSubmit={handleSubmit}
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
