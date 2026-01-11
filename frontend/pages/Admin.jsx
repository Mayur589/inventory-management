import { Lock, Plus, Save, X, History, TrendingUp, DollarSign, Calendar, LogOut, Package, ArrowRight, Trash2, Edit3, Check } from "lucide-react";
import { useEffect, useState, useMemo } from "react";
import {
  createItems,
  deleteItems,
  getItems,
  updateItems,
  getTransactionByRange,
  deleteTransaction
} from "../services/api";

export const Admin = () => {
  const [isLoggedIn, setLogedIn] = useState(false);

  useEffect(() => {
    const savedLoggedIn = JSON.parse(localStorage.getItem("loggedIn") || "false");
    setLogedIn(savedLoggedIn);
  }, []);

  useEffect(() => {
    localStorage.setItem("loggedIn", JSON.stringify(isLoggedIn));
  }, [isLoggedIn]);

  return isLoggedIn ? (
    <AdminPage onLogOut={() => setLogedIn(false)} />
  ) : (
    <LogInPage onSuccess={() => setLogedIn(true)} />
  );
};

const LogInPage = ({ onSuccess }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === "admin123") {
      onSuccess();
    } else {
      setError("Invalid Password");
    }
  };

  return (
    <div className="bg-[#05070a] flex items-center justify-center h-screen px-4 font-sans">
      <div className="bg-gray-900 rounded-3xl shadow-2xl border border-gray-800 p-10 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
            <Lock className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Admin Console</h2>
        <p className="text-gray-500 mb-8 text-xs uppercase tracking-widest font-bold italic">Secure Access Only</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Password"
            className="w-full px-5 py-4 rounded-2xl border border-gray-800 bg-gray-950 text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
            required
          />
          {error && <p className="text-red-500 text-xs font-bold uppercase tracking-tighter">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black shadow-lg shadow-blue-500/20 transition-all active:scale-95">
            UNLOCK DASHBOARD
          </button>
        </form>
      </div>
    </div>
  );
};

const AdminPage = ({ onLogOut }) => {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [refresh, setRefresh] = useState(0);
  const [loading, setLoading] = useState(false);

  // Form States
  const [newItem, setNewItem] = useState({});
  const [showAddForm, setShowAddForm] = useState(false);

  // Master Catalog Editing State
  const [editingItemId, setEditingItemId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Date Filtering
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(today);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [itemsRes, trxRes] = await Promise.all([
          getItems(),
          getTransactionByRange(startDate, endDate)
        ]);
        setItems(itemsRes.data.data);
        setTransactions(trxRes.data.data || []);
      } catch (err) {
        console.error("Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refresh, startDate, endDate]);

  const stats = useMemo(() => {
    return transactions.reduce((acc, sess) => {
      const sessCost = sess.items.reduce((sum, i) => sum + (i.quantity * (i.default_cost_price || 0)), 0);
      const sessProfit = sess.items.reduce((sum, i) => sum + (i.profit || 0), 0);
      return { cost: acc.cost + sessCost, profit: acc.profit + sessProfit };
    }, { cost: 0, profit: 0 });
  }, [transactions]);

  // Master Catalog Handlers
  const handleStartEdit = (item) => {
    setEditingItemId(item._id);
    setEditFormData({ ...item });
  };

  const handleSaveMasterEdit = async () => {
    try {
      await updateItems(editingItemId, editFormData);
      setEditingItemId(null);
      setRefresh(r => r + 1);
    } catch (err) { console.error("Update Error:", err); }
  };

  const handleDeleteProduct = async (id) => {
    if (confirm("Permanently delete this product? Past transactions will remain unchanged.")) {
      try {
        await deleteItems(id);
        setRefresh(r => r + 1);
      } catch (err) { console.error("Delete Error:", err); }
    }
  };

  const handleDeleteTrx = async (date, session) => {
    if (confirm(`Delete the ${session} session on ${date}? This resets the owed amount for this period.`)) {
      try {
        await deleteTransaction(date, session);
        setRefresh(r => r + 1);
      } catch (err) { console.error("Delete Trx Error:", err); }
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-gray-100 p-4 lg:p-10 font-sans selection:bg-blue-500/30">

      {/* HEADER SECTION */}
      <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-3 rounded-2xl shadow-lg shadow-blue-600/20"><Package className="text-white w-6 h-6" /></div>
          <div>
            <h1 className="text-2xl font-black uppercase tracking-tight">System Admin</h1>
            <p className="text-[10px] text-gray-500 font-black tracking-[0.2em] uppercase">Control & Logistics</p>
          </div>
        </div>
        <button onClick={onLogOut} className="bg-red-500/10 text-red-400 px-5 py-2.5 rounded-xl text-xs font-black border border-red-500/20 hover:bg-red-500 hover:text-white transition-all flex items-center gap-2">
          <LogOut size={14} /> EXIT PANEL
        </button>
      </div>

      {/* KPI STATS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-800">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <Package className="w-3 h-3 text-blue-500" /> Active Items
          </p>
          <p className="text-4xl font-black">{items.length}</p>
        </div>
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-800 border-l-4 border-l-red-500">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <DollarSign className="w-3 h-3 text-red-500" /> Total Owed (Debt)
          </p>
          <p className="text-4xl font-black text-red-500">₹{stats.cost.toLocaleString()}</p>
        </div>
        <div className="bg-gray-900/40 backdrop-blur-md p-6 rounded-3xl border border-gray-800 border-l-4 border-l-green-500">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 flex items-center gap-2">
            <TrendingUp className="w-3 h-3 text-green-500" /> Range Profit
          </p>
          <p className="text-4xl font-black text-green-500">₹{stats.profit.toLocaleString()}</p>
        </div>
      </div>

      {/* MASTER CATALOG TABLE */}
      <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden mb-10 shadow-2xl">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-950/40">
          <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
            Master Rate Management
          </h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className={`text-[10px] font-black uppercase px-5 py-2.5 rounded-xl transition-all ${showAddForm ? 'bg-gray-700' : 'bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20'}`}
          >
            {showAddForm ? 'Close' : '+ New Product'}
          </button>
        </div>

        {showAddForm && (
          <form
            onSubmit={(e) => { e.preventDefault(); createItems(newItem).then(() => {setRefresh(r=>r+1); setShowAddForm(false); setNewItem({});}) }}
            className="p-6 bg-blue-600/5 border-b border-gray-800 grid grid-cols-1 md:grid-cols-4 gap-4 animate-in slide-in-from-top duration-200"
          >
            <input type="text" placeholder="Item Name" className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 text-sm outline-none focus:border-blue-500" onChange={e => setNewItem({...newItem, item_name: e.target.value})} required />
            <input type="number" placeholder="Default Cost" className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 text-sm outline-none focus:border-blue-500" onChange={e => setNewItem({...newItem, default_cost_price: Number(e.target.value)})} required />
            <input type="number" placeholder="Default Sell" className="p-3.5 rounded-2xl bg-gray-950 border border-gray-800 text-sm outline-none focus:border-blue-500" onChange={e => setNewItem({...newItem, default_selling_price: Number(e.target.value)})} required />
            <button type="submit" className="bg-blue-600 text-white font-black rounded-2xl py-3.5 hover:bg-blue-700 text-xs uppercase tracking-widest">Add Product</button>
          </form>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] text-gray-500 uppercase font-black bg-gray-950/50">
              <tr>
                <th className="px-8 py-5">Product Details</th>
                <th className="px-8 py-5 text-center">Cost Rate</th>
                <th className="px-8 py-5 text-center">Sell Rate</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {items.map(item => (
                <tr key={item._id} className="hover:bg-gray-800/30 transition-colors group">
                  {editingItemId === item._id ? (
                    <>
                      <td className="px-8 py-4"><input className="bg-gray-950 border border-blue-500 p-2 rounded-xl w-full text-sm text-white" value={editFormData.item_name} onChange={e => setEditFormData({...editFormData, item_name: e.target.value})} /></td>
                      <td className="px-8 py-4"><input type="number" className="bg-gray-950 border border-blue-500 p-2 rounded-xl w-24 mx-auto block text-center text-sm" value={editFormData.default_cost_price} onChange={e => setEditFormData({...editFormData, default_cost_price: Number(e.target.value)})} /></td>
                      <td className="px-8 py-4"><input type="number" className="bg-gray-950 border border-blue-500 p-2 rounded-xl w-24 mx-auto block text-center text-sm" value={editFormData.default_selling_price} onChange={e => setEditFormData({...editFormData, default_selling_price: Number(e.target.value)})} /></td>
                      <td className="px-8 py-4 text-right flex justify-end gap-2">
                        <button onClick={handleSaveMasterEdit} className="p-2.5 text-green-400 bg-green-400/10 rounded-xl hover:bg-green-400 hover:text-black transition-all"><Check size={18} /></button>
                        <button onClick={() => setEditingItemId(null)} className="p-2.5 text-gray-400 bg-gray-400/10 rounded-xl"><X size={18} /></button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-8 py-6 font-bold text-white tracking-tight">{item.item_name}</td>
                      <td className="px-8 py-6 text-center font-mono text-gray-300">₹{item.default_cost_price}</td>
                      <td className="px-8 py-6 text-center font-mono text-gray-300">₹{item.default_selling_price}</td>
                      <td className="px-8 py-6 text-right flex justify-end gap-3">
                        <button onClick={() => handleStartEdit(item)} className="p-2.5 text-amber-400 hover:bg-amber-400/20 bg-amber-400/5 border border-amber-400/10 rounded-xl transition-all shadow-lg" title="Edit Prices">
                          <Edit3 size={16} />
                        </button>
                        <button onClick={() => handleDeleteProduct(item._id)} className="p-2.5 text-red-500 hover:bg-red-500/20 bg-red-500/5 border border-red-500/10 rounded-xl transition-all shadow-lg" title="Delete Product">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TRANSACTION HISTORY SECTION */}
      <div className="space-y-6 pt-10 border-t border-gray-800">
        <div className="flex flex-col md:flex-row justify-between items-end gap-4">
          <div>
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
              <History className="text-blue-500" /> Financial Audit Logs
            </h3>
            <p className="text-[10px] text-gray-500 font-black tracking-widest mt-1 uppercase">Date-wise Transaction Summaries</p>
          </div>
          <div className="flex items-center gap-3 bg-gray-950 p-3 rounded-2xl border border-gray-800 shadow-2xl">
            <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="bg- text-sm outline-none font-bold text-blue-400" />
            <ArrowRight className="w-3 h-3 text-gray-700" />
            <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="bg-transparent text-sm outline-none font-bold text-blue-400" />
          </div>
        </div>

        <div className="bg-gray-900 rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
          <table className="w-full text-left">
            <thead className="text-[10px] text-gray-500 uppercase font-black bg-gray-950/50">
              <tr>
                <th className="px-8 py-5">Period & Session</th>
                <th className="px-8 py-5 text-right">Owed (Cost)</th>
                <th className="px-8 py-5 text-right">Net Profit</th>
                <th className="px-8 py-5 text-right">Delete Log</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {transactions.length > 0 ? transactions.map(txn => {
                const totalCost = txn.items.reduce((s, i) => s + (i.quantity * i.default_cost_price), 0);
                const totalProfit = txn.items.reduce((s, i) => s + (i.profit || 0), 0);
                return (
                  <tr key={txn._id} className="hover:bg-gray-800/40 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-black block text-white tracking-tight">{txn.date}</span>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-lg uppercase border mt-1 inline-block ${txn.session === 'morning' ? 'border-orange-500/20 text-orange-400 bg-orange-500/5' : 'border-blue-500/20 text-blue-400 bg-blue-500/5'}`}>
                        {txn.session}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right font-mono font-black text-red-500">₹{totalCost.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right font-mono font-black text-green-500">₹{totalProfit.toLocaleString()}</td>
                    <td className="px-8 py-6 text-right">
                      <button onClick={() => handleDeleteTrx(txn.date, txn.session)} className="p-3 text-red-500 hover:bg-red-500/20 bg-red-500/5 border border-red-500/10 rounded-2xl transition-all shadow-lg">
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" className="text-center py-20 text-gray-600 font-bold uppercase tracking-widest text-xs">No transactions found for this range</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
