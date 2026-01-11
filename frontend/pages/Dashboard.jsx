import { useState, useEffect, useMemo } from "react";
import {
  DollarSign, TrendingUp, Package, ArrowUpRight,
  ArrowDownRight, Activity, Clock, ChevronRight
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from 'recharts';
import { getItems, getTransactionByRange } from "../services/api";
import { Link } from "react-router-dom";

export const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Range: Last 7 Days
  const endDate = new Date().toISOString().split('T')[0];
  const startDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [itemsRes, trxRes] = await Promise.all([
          getItems(),
          getTransactionByRange(startDate, endDate)
        ]);
        setItems(itemsRes.data.data);
        setTransactions(trxRes.data.data || []);
      } catch (err) {
        console.error("Dashboard Load Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  // 1. STATS LOGIC
  const stats = useMemo(() => {
    return transactions.reduce((acc, sess) => {
      const cost = sess.items.reduce((s, i) => s + (i.quantity * (i.default_cost_price || i.cost_price || 0)), 0);
      const profit = sess.items.reduce((s, i) => s + (i.profit || 0), 0);
      return { cost: acc.cost + cost, profit: acc.profit + profit };
    }, { cost: 0, profit: 0 });
  }, [transactions]);

  // 2. CHART DATA LOGIC (Grouping Morning + Afternoon into Daily Totals)
  const chartData = useMemo(() => {
    const dailyMap = {};
    transactions.forEach(txn => {
      const cost = txn.items.reduce((s, i) => s + (i.quantity * (i.default_cost_price || i.cost_price || 0)), 0);
      dailyMap[txn.date] = (dailyMap[txn.date] || 0) + cost;
    });

    // Sort by date and format for Recharts
    return Object.keys(dailyMap).sort().map(date => ({
      name: date.split('-').slice(1).join('/'), // converts 2025-01-11 to 01/11
      cost: dailyMap[date]
    }));
  }, [transactions]);

  if (loading) return <div className="min-h-screen bg-[#0b0f1a] flex items-center justify-center text-blue-500 font-black">SYSTEM LOADING...</div>;

  return (
    <div className="min-h-screen bg-[#0b0f1a] p-4 lg:p-10 text-gray-100 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex justify-between items-end border-b border-gray-800 pb-6">
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter italic">Command Center</h1>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mt-1">Real-time Analytics</p>
          </div>
          <Link to="/inventory" className="bg-blue-600 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-blue-700 transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20">
            Entry <ArrowUpRight size={14}/>
          </Link>
        </div>

        {/* TOP KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 shadow-xl">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Payouts (7d)</p>
            <p className="text-4xl font-black text-red-500 tracking-tighter">₹{stats.cost.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 shadow-xl">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Net Profit (7d)</p>
            <p className="text-4xl font-black text-green-500 tracking-tighter">₹{stats.profit.toLocaleString()}</p>
          </div>
          <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 shadow-xl">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2">Active Catalog</p>
            <p className="text-4xl font-black text-blue-500 tracking-tighter">{items.length} <span className="text-sm font-medium text-gray-600">Items</span></p>
          </div>
        </div>

        {/* CHART SECTION */}
        <div className="bg-gray-900 p-8 rounded-[2.5rem] border border-gray-800 shadow-2xl">
          <div className="mb-8">
            <h3 className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
              <Activity className="text-blue-500" size={18} /> Spending Trend
            </h3>
            <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">Daily Cost Breakdown</p>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
                <XAxis dataKey="name" stroke="#4b5563" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                <YAxis stroke="#4b5563" fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '12px' }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="cost" stroke="#3b82f6" strokeWidth={4} fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* RECENT FEED */}
          <div className="bg-gray-900 rounded-[2rem] border border-gray-800 overflow-hidden shadow-xl">
            <div className="p-6 border-b border-gray-800 bg-gray-950/30 font-black uppercase text-xs tracking-widest">Recent Logs</div>
            <div className="divide-y divide-gray-800">
              {transactions.slice(0, 4).map((txn, idx) => (
                <div key={idx} className="p-5 flex justify-between items-center hover:bg-gray-800/30 transition-colors">
                  <div>
                    <p className="font-bold text-sm">{txn.date}</p>
                    <span className="text-[9px] font-black uppercase text-blue-500 bg-blue-500/10 px-2 py-0.5 rounded">{txn.session}</span>
                  </div>
                  <div className="text-right">
                    <p className="font-mono font-black text-white">₹{txn.items.reduce((s, i) => s + (i.quantity * (i.default_cost_price || i.cost_price || 0)), 0).toLocaleString()}</p>
                    <p className="text-[9px] font-bold text-gray-500 uppercase">{txn.items.length} Items</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SYSTEM INFO */}
          <div className="bg-gray-900 p-8 rounded-[2rem] border border-gray-800 flex flex-col justify-center shadow-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center"><Clock className="text-green-500" /></div>
                <div>
                  <p className="text-xs font-black text-gray-500 uppercase tracking-widest">System Status</p>
                  <p className="text-sm font-bold text-white uppercase">Database Synced</p>
                </div>
             </div>
             <p className="text-gray-500 text-xs italic mb-6">
                Your data is stored locally in PouchDB. This dashboard reflects the latest snapshots from your transaction logs.
             </p>
             <Link to="/admin" className="w-full py-4 bg-gray-800 hover:bg-gray-700 rounded-2xl text-center text-[10px] font-black uppercase tracking-[0.2em] transition-all">
                Audit Master Logs
             </Link>
          </div>
        </div>

      </div>
    </div>
  );
};
