import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [members, setMembers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleAdd = (newRecord) => {
    setRecords((prev) => [newRecord, ...prev]);
  };

  const handleUpdate = (updatedRecord) => {
    setRecords((prev) =>
      prev.map((rec) =>
        rec.id === updatedRecord.id ? updatedRecord : rec
      )
    );
  };

  const handleDelete = (id) => {
    setRecords((prev) => prev.filter((rec) => rec.id !== id));
  };

  const handleManualLog = (e) => {
    e.preventDefault();

    const member = members.find((m) => m.id === selectedMemberId);
    if (!member) return;

    handleAdd({
      id: `ATT-${Date.now()}`,
      memberId: member.id,
      memberName: member.fullName,
      checkIn: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      }),
      date: new Date().toISOString().split('T')[0]
    });

    setIsModalOpen(false);
    setSelectedMemberId('');
  };

  const handleCheckout = (rec) => {
    handleUpdate({
      ...rec,
      checkOut: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      })
    });
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-white">
       <Sidebar  isOpen={isOpen} setIsOpen={setIsOpen} />
 <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
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
              Real-Time Occupancy & Entry Tracking
            </p>
          </div>

          <div className="flex space-x-3">
            <button className="bg-slate-800 text-white px-5 py-3 rounded-xl border border-slate-700 font-bold text-sm hover:bg-slate-700 transition-all no-print">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

          <div className="lg:col-span-3 bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl">

            <div className="p-6 border-b border-slate-700/50 bg-slate-900/40 flex justify-between items-center">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em]">
                Live Stream - {new Date().toLocaleDateString()}
              </h3>
              <span className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse" />
                <span className="text-[10px] text-lime-500 font-black uppercase">
                  System Online
                </span>
              </span>
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
                    <tr key={rec.id} className="hover:bg-slate-700/20 transition-all group">
                      <td className="px-6 py-5">
                        <p className="font-black text-white text-sm">
                          {rec.memberName}
                        </p>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">
                          {rec.memberId}
                        </p>
                      </td>

                      <td className="px-6 py-5 font-mono text-xs text-lime-500">
                        {rec.checkIn}
                      </td>

                      <td className="px-6 py-5 font-mono text-xs text-slate-400">
                        {rec.checkOut || '--:--'}
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
                            onClick={() => handleDelete(rec.id)}
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

        </div>

        {/* MODAL — UNCHANGED UI */}
        {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">

    <div className="bg-slate-900 border-t md:border border-slate-700 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">

      {/* Header */}
      <div className="p-8 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Manual Log
          </h3>
          <p className="text-slate-500 text-[10px] mt-1 font-black uppercase tracking-widest tracking-tighter">
            Override System Entry
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-full transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleManualLog} className="p-8 space-y-6">

        {/* Member Selection */}
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
            <option value="">Choose active identity...</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.fullName} ({m.id})
              </option>
            ))}
          </select>
        </div>

        {/* Buttons */}
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

export default Attendance;