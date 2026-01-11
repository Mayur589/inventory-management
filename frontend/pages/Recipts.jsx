import { useState, useEffect, useMemo } from "react";
import { Printer, Calendar, Package, Receipt as ReceiptIcon, ArrowRight, FileText, AlertCircle, Clock } from "lucide-react";
import { getTransactionsByDate, getTransactionByRange } from "../services/api";

export const Receipts = () => {
  const [viewType, setViewType] = useState("session"); // "session" or "range"
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
  const [session, setSession] = useState("morning");
  const [sessionsData, setSessionsData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (viewType === "session") {
          const res = await getTransactionsByDate(date, session);
          setSessionsData(res.data?.data?.items ? [res.data.data] : []);
        } else {
          // Range view fetches multiple distinct session objects
          const res = await getTransactionByRange(date, endDate);
          // Keep them as an array of separate session objects
          setSessionsData(res.data.data || []);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setSessionsData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [viewType, date, endDate, session]);

  // Total for all visible sessions
  const grandTotal = useMemo(() => {
    return sessionsData.reduce((acc, sess) => {
      return acc + sess.items.reduce((sum, item) =>
        sum + (item.quantity * (item.default_cost_price || item.cost_price || 0)), 0
      );
    }, 0);
  }, [sessionsData]);

  const handlePrint = () => {
    if (sessionsData.length > 0) window.print();
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] p-4 lg:p-10 text-gray-100 font-sans">
      <div className="max-w-4xl mx-auto">

        {/* FILTERS - Hidden during print */}
        <div className="no-print mb-8 bg-gray-900/60 backdrop-blur-xl p-6 rounded-3xl border border-gray-800 shadow-2xl space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-black flex items-center gap-2">
              <ReceiptIcon className="text-blue-500" /> SESSION REPORTS
            </h1>
            <div className="flex bg-gray-950 p-1 rounded-xl border border-gray-800">
              <button
                onClick={() => setViewType("session")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewType === 'session' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                Single Session
              </button>
              <button
                onClick={() => setViewType("range")}
                className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${viewType === 'range' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-500'}`}
              >
                Range View
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[180px]">
              <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Start Date</label>
              <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full mt-1 bg-gray-950 p-3 rounded-xl border border-gray-800 text-blue-400 font-bold outline-none"/>
            </div>

            {viewType === 'range' ? (
              <div className="flex-1 min-w-[180px]">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">End Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full mt-1 bg-gray-950 p-3 rounded-xl border border-gray-800 text-blue-400 font-bold outline-none"/>
              </div>
            ) : (
              <div className="flex-1 min-w-[180px]">
                <label className="text-[10px] font-black text-gray-500 uppercase ml-1">Session Slot</label>
                <select value={session} onChange={(e) => setSession(e.target.value)} className="w-full mt-1 bg-gray-950 border border-gray-800 text-white rounded-xl p-3 outline-none font-bold">
                  <option value="morning">🌅 Morning</option>
                  <option value="afternoon">🌞 Afternoon</option>
                </select>
              </div>
            )}

            <button
              onClick={handlePrint}
              disabled={sessionsData.length === 0}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-800 text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            >
              Print Details
            </button>
          </div>
        </div>

        {/* PRINTABLE AREA */}
        <div className="print-container">
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-black animate-pulse">Loading Logs...</div>
          ) : sessionsData.length > 0 ? (
            <div id="receipt-paper" className="bg-white text-black p-10 rounded-sm border-t-[10px] border-black shadow-2xl">

              {/* Receipt Header */}
              <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-8">
                <div>
                  <h1 className="text-4xl font-black tracking-tighter uppercase italic">VENDPRO</h1>
                  <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em]">Audit Trail / Session Records</p>
                </div>
                <div className="text-right text-xs">
                  <p className="font-black bg-black text-white px-2 py-0.5 mb-1">OFFICIAL COPY</p>
                  <p className="font-bold">{viewType === 'range' ? `${date} to ${endDate}` : date}</p>
                </div>
              </div>

              {/* Individual Session Blocks */}
              <div className="space-y-12">
                {sessionsData.map((sess, idx) => {
                  const sessTotal = sess.items.reduce((s, i) => s + (i.quantity * (i.default_cost_price || i.cost_price || 0)), 0);
                  return (
                    <div key={idx} className="session-block border border-gray-100 p-6 rounded-lg">
                      <div className="flex justify-between items-center mb-4 bg-gray-50 p-2 border-l-4 border-black">
                        <div className="flex items-center gap-4">
                          <span className="font-black text-sm uppercase">{sess.date}</span>
                          <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase tracking-widest">
                            {sess.session}
                          </span>
                        </div>
                        <span className="font-mono text-sm font-bold">Subtotal: ₹{sessTotal.toLocaleString()}</span>
                      </div>

                      <table className="w-full text-left">
                        <thead>
                          <tr className="text-[9px] font-black uppercase text-gray-400 border-b border-gray-200">
                            <th className="py-2">Item</th>
                            <th className="py-2 text-center">Rate</th>
                            <th className="py-2 text-center">Qty</th>
                            <th className="py-2 text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sess.items.map((item, iIdx) => (
                            <tr key={iIdx} className="text-sm border-b border-gray-50">
                              <td className="py-3 font-bold uppercase">{item.item_name}</td>
                              <td className="py-3 text-center font-mono text-gray-500">₹{item.default_cost_price || item.cost_price}</td>
                              <td className="py-3 text-center font-black">x{item.quantity}</td>
                              <td className="py-3 text-right font-mono font-bold italic">₹{(item.quantity * (item.default_cost_price || item.cost_price)).toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })}
              </div>

              {/* Final Grand Total Summary */}
              <div className="mt-12 pt-8 border-t-4 border-black flex justify-between items-end">
                <div>
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sessions Logged: {sessionsData.length}</p>
                  <p className="text-[10px] font-black text-gray-300 uppercase mt-1 tracking-widest underline">Voucher generated via VendPro Admin</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black uppercase text-gray-400 mb-1 tracking-widest">Grand Payout Total</p>
                  <p className="text-6xl font-black text-blue-600 tracking-tighter">₹{grandTotal.toLocaleString()}</p>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-2 gap-24 mt-20">
                <div className="border-t border-gray-300 pt-3 text-[8px] font-black text-gray-400 uppercase text-center">Receiver Signature</div>
                <div className="border-t border-gray-300 pt-3 text-[8px] font-black text-gray-400 uppercase text-center">Admin Approval</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-900/30 rounded-[3rem] border-2 border-dashed border-gray-800">
              <AlertCircle className="mx-auto text-gray-700 mb-4" size={40} />
              <p className="text-gray-500 font-black uppercase text-xs tracking-widest">No matching session data found</p>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; background: white !important; }
          .print-container, .print-container * { visibility: visible; }
          .print-container { position: absolute; left: 0; top: 0; width: 100%; padding: 0 !important; }
          #receipt-paper { box-shadow: none !important; border-top: 5px solid black !important; width: 100% !important; margin: 0 !important; }
          .no-print, nav { display: none !important; }
          .session-block { page-break-inside: avoid; margin-bottom: 2rem !important; }
        }
      `}</style>
    </div>
  );
};
