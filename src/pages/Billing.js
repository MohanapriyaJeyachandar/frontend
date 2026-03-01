import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  getBillings,
  createBilling,
  updateBilling,
  deleteBilling
} from "../api/billingApi";
import { getmembers } from "../api/memberApi";

const PaymentStatus = {
  PAID: 'Paid',
  PENDING: 'Pending',
};

const Billing = () => {
  const [members, setMembers] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState({
    memberName: '',
    memberId: '',
    amount: 0,
    status: PaymentStatus.PENDING,
    items: ['Monthly Membership'],
  });

  useEffect(() => {
    fetchMembers();
    fetchBillings();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await getmembers();
      setMembers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBillings = async () => {
    try {
      const res = await getBillings();

      const formatted = (res.data.data || []).map((b) => ({
        id: b._id,
        memberId: b.memberSelection?._id,
        memberName: b.memberSelection?.name || "Unknown",
        amount: b.valuation || 0,
        status: b.status === "paid"
          ? PaymentStatus.PAID
          : PaymentStatus.PENDING,
      }));

      setInvoices(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateInvoice = async (e) => {
    e.preventDefault();

    try {
      await createBilling({
        memberSelection: formData.memberId,
        valuation: formData.amount,
        status: formData.status.toLowerCase(),
      });

      fetchBillings();
      setIsModalOpen(false);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  const toggleStatus = async (inv) => {
    try {
      await updateBilling(inv.id, {
        status: inv.status === PaymentStatus.PAID
          ? "pending"
          : "paid",
      });

      fetchBillings();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBilling(id);
      fetchBillings();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* HEADER */}
        <header className="flex justify-between items-center">
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
            Issue Invoice
          </button>
        </header>

        {/* SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
              Total Revenue
            </p>
            <h3 className="text-3xl font-black text-white">
              ₹{(invoices || [])
                .reduce((acc, i) => acc + Number(i.amount || 0), 0)
                .toLocaleString()}
            </h3>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50">
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">
              Outstanding
            </p>
            <h3 className="text-3xl font-black text-red-500">
              ₹{(invoices || [])
                .filter(i => i.status !== PaymentStatus.PAID)
                .reduce((acc, i) => acc + Number(i.amount || 0), 0)
                .toLocaleString()}
            </h3>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50">
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
                      ₹{Number(inv.amount || 0).toLocaleString()}
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
                        onClick={() => handleDelete(inv.id)}
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

        {/* MODAL (UNCHANGED UI) */}
     {isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4 bg-slate-950/90 backdrop-blur-md">
    
    <div className="bg-slate-900 border-t md:border border-slate-700 w-full max-w-lg rounded-t-[2.5rem] md:rounded-[2.5rem] overflow-hidden shadow-2xl animate-in slide-in-from-bottom md:zoom-in duration-300">
      
      {/* Header */}
      <div className="p-8 border-b border-slate-800 flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-black text-white tracking-tight">
            Financial Manifest
          </h3>
          <p className="text-slate-500 text-[10px] mt-1 font-black uppercase tracking-widest tracking-tighter">
            New Ledger Entry
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
      <form onSubmit={handleCreateInvoice} className="p-8 space-y-6">

        {/* Member Selection */}
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
            Member Selection
          </label>
          <select
            required
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-lime-500/30 outline-none transition-all appearance-none"
            onChange={(e) => {
              const member = members.find(
                (m) => m._id === e.target.value   // ✅ FIXED
              );
              if (member) {
                setFormData({
                  ...formData,
                  memberId: member._id,          // ✅ FIXED
                  memberName: member.name        // ✅ FIXED
                });
              }
            }}
          >
            <option value="">Choose active identity...</option>
            {members.map((m) => (
              <option key={m._id} value={m._id}>   {/* ✅ FIXED */}
                {m.name} ({m._id})                {/* ✅ FIXED */}
              </option>
            ))}
          </select>
        </div>

        {/* Amount + Status */}
        <div className="grid grid-cols-2 gap-4">
          
          {/* Amount */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
              Valuation (₹)
            </label>
            <input
              type="number"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-lime-500/30 outline-none transition-all"
              value={formData.amount}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  amount: Number(e.target.value)
                })
              }
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
              Status
            </label>
            <select
              className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white focus:ring-2 focus:ring-lime-500/30 outline-none transition-all"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value
                })
              }
            >
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

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
            Verify & Post
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

export default Billing;