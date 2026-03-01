import React, { useEffect, useState } from 'react';
import { MembershipType, PaymentStatus } from '../types';
import Sidebar from '../components/Sidebar';
import {getmembers, createmembers, updatemembers, deletemembers} from "../api/memberApi";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    gender: 'male',
    membershipType: 'monthly',
    paymentStatus: 'paid',
    weight: 70,
    height: 170,
    age: 25,
    healthConditions: [],
    goal: 'general fitness'
});

  const fetchmember = async () =>{
    try{
       const res = await getmembers();
       setMembers (res.data);
    }
    catch(err)
    {
       console.error("Erro fetching member:", err);
    }
  };

  useEffect(()=>{
    fetchmember();
  },[]);

  const handleOpenAdd = () => {
    setEditingMember(null);
    setFormData({
      fullName: '',
      phone: '',
      gender: 'Male',
      membershipType: 'Monthly',
      paymentStatus: 'Paid',
      weight: 70,
      height: 170,
      age: 25,
      healthConditions: [],
      goal: 'General Fitness'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (m) => {
  setEditingMember(m);

  setFormData({
    fullName: m.name,
    phone: m.contactPhone,
    gender: m.genderIdentity,
    age: m.biologicalAge,
    weight: m.mass,
    height: m.structure,
    goal: m.fitnessGoal,
    membershipType: m.membershipPlan,
    paymentStatus: m.ledgerStatus,
    healthConditions: m.medicalConditions
      ? m.medicalConditions.split(",")
      : [],
  });

  setIsModalOpen(true);
};

    
  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    name: formData.fullName.trim(),
    contactPhone: formData.phone.trim(),
    genderIdentity: formData.gender.toLowerCase(),
    biologicalAge: Number(formData.age),
    mass: Number(formData.weight),
    structure: Number(formData.height),
    fitnessGoal: formData.goal.toLowerCase(),
    membershipPlan: formData.membershipType.toLowerCase(),
    ledgerStatus: formData.paymentStatus.toLowerCase(),
    medicalConditions: formData.healthConditions.join(", ")
  };

  try {
    if (editingMember) {
      await updatemembers(editingMember._id, payload);
    } else {
      await createmembers(payload);
    }

    setIsModalOpen(false);
    fetchmember();
  } catch (err) {
    console.error("Submission Error:", err.response?.data || err.message);
  }
};

  const handleDelete = async (id) =>{
    try{
      await deletemembers(id);
      fetchmember();
    }
    catch(err)
    {
      console.error("Error deleting", err);
    }
  };

  const filteredMembers = members.filter(
  (m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m._id.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="flex bg-slate-950 min-h-screen">
  <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
   <button
          className="md:hidden mb-4 bg-lime-500 text-black px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Open Menu
        </button>

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
          placeholder="Search members by name or ID..."
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
                  <tr key={member._id}>
                    <td className="px-6 py-5">
                      <p className="font-black text-white">{member.name}</p>
                      <p className="text-[10px] text-slate-500">{member._id}</p>
                    </td>
                    <td className="px-6 py-5">{member.fitnessGoal}</td>
                    <td className="px-6 py-5">{member.membershipPlan}</td>
                    <td className="px-6 py-5">
                      <span
                        className={
                          member.ledgerStatus === 'paid'
                            ? 'text-lime-500'
                            : 'text-red-500'
                        }
                      >
                        {member.ledgerStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button
                        onClick={() => handleOpenEdit(member)}
                        className="px-4 py-2 bg-slate-700 rounded-xl text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                      </button>
                      <button
                        onClick={() => handleDelete(member._id)}
                        className="ml-2 px-4 py-2 bg-red-500 rounded-xl text-white"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      </button>
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

      {/* Modal remains SAME as your original */}
       {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-xl rounded-[2.5rem] shadow-2xl">
              <form
                onSubmit={handleSubmit}
                className="p-8 space-y-6 max-h-[75vh] overflow-y-auto"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Full Name */}
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                        Full Identity Name
                      </label>
                      <input
                        required
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                        Contact Phone
                      </label>
                      <input
                        className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                    </div>

                  {/* Gender */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Gender Identity
                    </label>
                    <select
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      value={formData.gender}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    >
                      <option>Male</option>
                      <option>Female</option>
                      <option>Non-Binary</option>
                    </select>
                  </div>

                  {/* Age */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Biological Age
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      value={formData.age}
                      onChange={(e) =>
                        setFormData({ ...formData, age: Number(e.target.value) })
                      }
                    />
                  </div>

                  {/* Weight */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Mass (kg)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      value={formData.weight}
                      onChange={(e) =>
                        setFormData({ ...formData, weight: Number(e.target.value) })
                      }
                    />
                  </div>

                  {/* Height */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Stature (cm)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: Number(e.target.value) })
                      }
                    />
                  </div>

                  {/* Fitness Goal */}
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Fitness Goal
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {fitnessGoals.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, goal: g })
                          }
                          className={`py-2.5 rounded-xl border font-black text-[9px] uppercase tracking-widest ${
                            formData.goal === g
                              ? "bg-lime-500 border-lime-500 text-slate-900"
                              : "bg-slate-950 border-slate-800 text-slate-500"
                          }`}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Membership Plan */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Membership Plan
                    </label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      value={formData.membershipType}
                      onChange={(e) =>
                        setFormData({ ...formData, membershipType: e.target.value })
                      }
                    >
                      <option value="Monthly">Monthly</option>
                      <option value="Quarterly">Quarterly</option>
                      <option value="Yearly">Yearly</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Ledger Status
                    </label>
                    <select
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      value={formData.paymentStatus}
                      onChange={(e) =>
                        setFormData({ ...formData, paymentStatus: e.target.value })
                      }
                    >
                      <option value="Paid">Paid</option>
                      <option value="Pending">Pending</option>
                    </select>
                  </div>

                  {/* Medical Conditions */}
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest ml-1">
                      Medical Conditions (Comma separated)
                    </label>
                    <input
                      className="w-full bg-slate-900 border border-slate-800 rounded-2xl px-5 py-4 text-white"
                      placeholder="None"
                      value={formData.healthConditions?.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          healthConditions: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>

                </div>


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
</div>
  );
};

export default Members;