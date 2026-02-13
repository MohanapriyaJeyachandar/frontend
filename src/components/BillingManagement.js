import React, { useState } from 'react';
import { PaymentStatus } from '../types';

const BillingManagement = ({ invoices, members, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    memberName: '',
    memberId: '',
    amount: 0,
    status: PaymentStatus.PENDING,
    items: ['Monthly Membership']
  });

  const handleCreateInvoice = (e) => {
    e.preventDefault();
    onAdd({
      ...formData,
      id: `INV-${Math.floor(Math.random() * 100000)}`,
      date: new Date().toISOString().split('T')[0],
    });
    setIsModalOpen(false);
  };

  const toggleStatus = (inv) => {
    onUpdate({
      ...inv,
      status:
        inv.status === PaymentStatus.PAID
          ? PaymentStatus.PENDING
          : PaymentStatus.PAID
    });
  };

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in slide-in-from-right duration-500">
      <header className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Ledger & Revenue
          </h2>
          <p className="text-slate-400 text-sm font-medium uppercase tracking-widest mt-1">
            Enterprise Financial Tracking
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-lime-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 flex items-center justify-center space-x-2 active:scale-95"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          <span>Issue Invoice</span>
        </button>
      </header>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 shadow-inner">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Total Revenue
          </p>
          <h3 className="text-3xl font-black text-white">
            ₹{invoices.reduce((acc, i) => acc + i.amount, 0).toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 shadow-inner">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Outstanding
          </p>
          <h3 className="text-3xl font-black text-red-500">
            ₹{invoices
              .filter(i => i.status !== PaymentStatus.PAID)
              .reduce((acc, i) => acc + i.amount, 0)
              .toLocaleString()}
          </h3>
        </div>

        <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50 shadow-inner">
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
            Transactions
          </p>
          <h3 className="text-3xl font-black text-blue-400">
            {invoices.length}
          </h3>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-700 text-slate-500 text-[10px] uppercase tracking-[0.2em] bg-slate-900/40">
                <th className="px-6 py-5 font-black">Invoice ID</th>
                <th className="px-6 py-5 font-black">Member Identity</th>
                <th className="px-6 py-5 font-black">Valuation</th>
                <th className="px-6 py-5 font-black">Status</th>
                <th className="px-6 py-5 text-right font-black">Operations</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {invoices.map(inv => (
                <tr key={inv.id} className="hover:bg-slate-700/20 transition-all group">
                  <td className="px-6 py-5 font-mono text-[10px] text-slate-500">
                    {inv.id}
                  </td>
                  <td className="px-6 py-5 font-black text-white">
                    {inv.memberName}
                  </td>
                  <td className="px-6 py-5 font-black text-lime-500">
                    ₹{inv.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-5">
                    <button
                      onClick={() => toggleStatus(inv)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                        inv.status === PaymentStatus.PAID
                          ? 'bg-lime-500/10 text-lime-500 border border-lime-500/20'
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}
                    >
                      {inv.status}
                    </button>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button
                      onClick={() => onDelete(inv.id)}
                      className="p-2 text-slate-400 hover:text-red-500 bg-slate-800 rounded-lg transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {invoices.length === 0 && (
                <tr>
                  <td colSpan="5"
                    className="py-20 text-center text-slate-600 font-black uppercase text-[10px] tracking-[0.3em]">
                    No Financial Transactions Registered
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border-t md:border border-slate-700 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl">
            <form onSubmit={handleCreateInvoice} className="p-8 space-y-6">
              <select
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                onChange={e => {
                  const member = members.find(m => m.id === e.target.value);
                  if (member)
                    setFormData({
                      ...formData,
                      memberId: member.id,
                      memberName: member.fullName
                    });
                }}
              >
                <option value="">Choose active identity...</option>
                {members.map(m => (
                  <option key={m.id} value={m.id}>
                    {m.fullName} ({m.id})
                  </option>
                ))}
              </select>

              <input
                type="number"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                value={formData.amount}
                onChange={e =>
                  setFormData({
                    ...formData,
                    amount: Number(e.target.value)
                  })
                }
              />

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl bg-slate-800 text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-4 rounded-2xl bg-lime-500 text-slate-900 font-black"
                >
                  Verify & Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BillingManagement;
