import React, { useState } from 'react';
import { MembershipType, PaymentStatus } from '../types';

const MemberManagement = ({ members, onAdd, onUpdate, onDelete, onView }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    gender: 'Male',
    membershipType: MembershipType.MONTHLY,
    paymentStatus: PaymentStatus.PAID,
    weight: 70,
    height: 170,
    age: 25,
    healthConditions: [],
    goal: 'General Fitness'
  });

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      gender: 'Male',
      membershipType: MembershipType.MONTHLY,
      paymentStatus: PaymentStatus.PAID,
      weight: 70,
      height: 170,
      age: 25,
      healthConditions: [],
      goal: 'General Fitness',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      dob: '1995-01-01'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
    setEditingMember(m);
    setFormData({
      ...m,
      healthConditions: m.healthConditions || [],
      goal: m.goal || 'General Fitness'
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalData = {
      ...formData,
      healthConditions: formData.healthConditions || [],
      goal: formData.goal || 'General Fitness'
    };

    if (editingMember) {
      onUpdate({ ...editingMember, ...finalData });
    } else {
      onAdd({
        ...finalData,
        id: `MEM-${Math.floor(Math.random() * 10000)}`
          .padStart(8, '0')
      });
    }

    setIsModalOpen(false);
  };

  const filteredMembers = members.filter(
    (m) =>
      m.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fitnessGoals = [
    'Weight Loss',
    'Weight Gain',
    'Muscle Gain',
    'Endurance',
    'General Fitness',
    'Powerlifting'
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in slide-in-from-right duration-500">

      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Member Registry
          </h2>
          <p className="text-slate-400 text-sm">
            Active base and biological profile management.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-lime-500 text-slate-900 px-5 py-3 rounded-xl font-bold hover:bg-lime-400 transition-all flex items-center justify-center space-x-2 shadow-xl shadow-lime-500/20 active:scale-95"
        >
          <span>Enroll Member</span>
        </button>
      </header>

      {/* SEARCH */}
      <div className="relative w-full">
        <input
          type="text"
          placeholder="Search members by name, ID or email..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl py-3.5 pl-4 pr-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-lime-500/50 transition-all text-sm shadow-inner"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* TABLE */}
      <div className="bg-slate-800/50 rounded-[2rem] border border-slate-700/50 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          {filteredMembers.length > 0 ? (
            <table className="w-full text-left min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-700 text-slate-500 text-[10px] uppercase tracking-[0.2em] bg-slate-900/40">
                  <th className="px-6 py-5 font-black">Identity</th>
                  <th className="px-6 py-5 font-black">Goal</th>
                  <th className="px-6 py-5 font-black">Membership</th>
                  <th className="px-6 py-5 font-black">Status</th>
                  <th className="px-6 py-5 text-right font-black">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/50">
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-5">
                      <p className="font-black text-white">
                        {member.fullName}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {member.id}
                      </p>
                    </td>

                    <td className="px-6 py-5">
                      {member.goal || 'General'}
                    </td>

                    <td className="px-6 py-5">
                      {member.membershipType}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={
                          member.paymentStatus === PaymentStatus.PAID
                            ? 'text-lime-500'
                            : 'text-red-500'
                        }
                      >
                        {member.paymentStatus}
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right space-x-2">
                      <button onClick={() => onView(member)}>View</button>
                      <button onClick={() => handleOpenEdit(member)}>Edit</button>
                      <button onClick={() => onDelete(member.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="py-20 text-center text-slate-500">
              No Members Found
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-[2.5rem] shadow-2xl">
            <form
              onSubmit={handleSubmit}
              className="p-8 space-y-6 max-h-[75vh] overflow-y-auto"
            >
              <input
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />

              <div className="pt-4 flex space-x-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-4 rounded-2xl bg-slate-800 text-white"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-4 rounded-2xl bg-lime-500 text-slate-900 font-black"
                >
                  Authorize Identity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberManagement;
