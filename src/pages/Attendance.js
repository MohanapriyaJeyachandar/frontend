import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../services/axios";
import QRCode from "react-qr-code";

const AttendancePage = () => {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [isOpen, setIsOpen] = useState(true);

  const peakData = [
    { time: "06:00 AM", capacity: 45 },
    { time: "08:00 AM", capacity: 80 },
    { time: "12:00 PM", capacity: 30 },
    { time: "06:00 PM", capacity: 95 },
  ];

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch members and records
  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersRes = await axiosInstance.get("/attendance/members", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMembers(membersRes.data);

        const recordsRes = await axiosInstance.get("/attendance/records", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRecords(recordsRes.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, [token]);

  // Manual Check-In
  const handleManualLog = async (e) => {
    e.preventDefault();
    if (!selectedMemberId) return;

    const member = members.find((m) => m._id === selectedMemberId);
    if (!member) return;

    try {
      const res = await axiosInstance.post(
        "/attendance/checkin",
        {
          memberId: member._id,
          memberName: member.name,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecords((prev) => [res.data, ...prev]);
      setIsModalOpen(false);
      setSelectedMemberId("");
    } catch (err) {
      console.error("Error in check-in:", err.response?.data || err);
    }
  };

  // Checkout
  const handleCheckout = async (rec) => {
    try {
      const res = await axiosInstance.post(
        `/attendance/checkout/${rec._id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecords((prev) =>
        prev.map((r) => (r._id === rec._id ? res.data : r))
      );
    } catch (err) {
      console.error("Error in checkout:", err.response?.data || err);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/attendance/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRecords((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error("Error in delete:", err.response?.data || err);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* Header */}
        <button
          className="md:hidden mb-4 bg-lime-500 text-black px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Open Menu
        </button>
        <header className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Facility Access
            </h2>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">
              Welcome, {user?.username || "User"} | Real-Time Entry
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="bg-slate-800 text-white px-5 py-3 rounded-xl border border-slate-700 font-bold text-sm hover:bg-slate-700 transition-all">
              Export Manifest
            </button>

            <button
              onClick={() => setIsModalOpen(true)}
              className="bg-lime-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 active:scale-95"
            >
              Manual Check-In
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Attendance Table */}
          <div className="lg:col-span-2 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl">
            <div className="p-6 border-b border-slate-700/50 bg-slate-900/40 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                Live Stream - {new Date().toLocaleDateString()}
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[700px]">
                <thead>
                  <tr className="text-slate-500 text-[10px] uppercase tracking-[0.2em] border-b border-slate-700/50">
                    <th className="px-6 py-5 font-black">Bio-Signature</th>
                    <th className="px-6 py-5 font-black">Check-In</th>
                    <th className="px-6 py-5 font-black">Check-Out</th>
                    <th className="px-6 py-5 text-right font-black">Operations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {records.map((rec) => (
                    <tr key={rec._id} className="hover:bg-slate-700/20 transition-all group">
                      <td className="px-6 py-5">
                        <p className="font-black text-white text-sm">{rec.memberName}</p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">{rec.memberId}</p>
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-lime-500">
                        {new Date(rec.checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
                      </td>
                      <td className="px-6 py-5 font-mono text-xs text-slate-400">
                        {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--"}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end space-x-2">
                          {!rec.checkOut && (
                            <button
                              onClick={() => handleCheckout(rec)}
                              className="bg-lime-500 text-slate-950 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-lime-400 transition-all"
                            >
                              Check-Out
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(rec._id)}
                            className="p-2 text-slate-500 hover:text-red-500 bg-slate-800 rounded-lg transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {records.length === 0 && (
                    <tr>
                      <td colSpan={4} className="py-20 text-center text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">
                        No Active Sessions Detected
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Side Cards */}
          <div className="space-y-6">
            {/* PEAK FLOW ANALYTICS */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-2xl">
              <h4 className="text-lg font-black text-white uppercase mb-4">PEAK FLOW ANALYTICS</h4>
              {peakData.map((p, idx) => (
                <div key={idx} className="mb-3">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span>{p.time}</span>
                    <span>{p.capacity}% Capacity</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full">
                    <div className="h-2 bg-lime-500 rounded-full" style={{ width: `${p.capacity}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* QR CODE CARD */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 shadow-2xl flex flex-col items-center">
              <h4 className="text-lg font-black text-white uppercase mb-4 text-center">
                INSTANT ACCESSOR<br/>FACILITY SECURITY AUTHENTICATION
              </h4>
              <QRCode value={user?.username || "guest"} size={150} />
            </div>
          </div>
        </div>

        {/* MODAL — MANUAL CHECK-IN */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border-t md:border border-slate-700 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
              <div className="p-8 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-2xl font-black text-white tracking-tight">Manual Log</h3>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-all"
                >
                  ✕
                </button>
              </div>
              <form onSubmit={handleManualLog} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                    Member Identification
                  </label>
                  <select
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-lime-500/30 outline-none transition-all appearance-none"
                    value={selectedMemberId}
                    onChange={(e) => setSelectedMemberId(e.target.value)}
                  >
                    <option value="">Choose member...</option>
                    {members.map((m) => (
                      <option key={m._id} value={m._id}>{m.name}</option>
                    ))}
                  </select>
                </div>
                <div className="pt-4 flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-4 py-4 rounded-2xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-4 rounded-2xl bg-lime-500 text-slate-900 font-black hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 active:scale-95"
                  >
                    Authorize Access
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AttendancePage;