import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const chartData = [
  { name: 'Mon', revenue: 0 },
  { name: 'Tue', revenue: 0 },
  { name: 'Wed', revenue: 0 },
  { name: 'Thu', revenue: 0 },
  { name: 'Fri', revenue: 0 },
  { name: 'Sat', revenue: 0 },
  { name: 'Sun', revenue: 0 },
];

const StatCard = ({ title, value, change, trend, onClick }) => (
  <div
    onClick={onClick}
    className={`bg-slate-800/50 p-6 rounded-3xl border border-slate-700/50 hover:border-lime-500/30 transition-all duration-300 ${
      onClick ? 'cursor-pointer hover:bg-slate-800' : ''
    }`}
  >
    <p className="text-slate-400 text-sm mb-1">{title}</p>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl md:text-3xl font-bold text-white">{value}</h3>
      <span
        className={`text-[10px] md:text-xs font-semibold px-2 py-1 rounded-full ${
          trend === 'up'
            ? 'bg-lime-500/10 text-lime-400'
            : 'bg-red-500/10 text-red-400'
        }`}
      >
        {trend === 'up' ? '↑' : '↓'} {change}
      </span>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);

  // Safe default arrays (no reduce error)
  const members = [];
  const trainers = [];
  const attendance = [];
  const invoices = [];

  const totalRevenue = invoices.reduce(
    (acc, inv) => acc + (inv.amount || 0),
    0
  );

  const activeMembers = members.length;

  return (
    <div className="flex bg-slate-950 min-h-screen">
      
      {/* ✅ SIDEBAR */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* ✅ MAIN CONTENT */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">

        {/* Mobile Menu Button */}
        <button
          className="md:hidden mb-4 bg-lime-500 text-black px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Open Menu
        </button>

        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:justify-between md:items-end space-y-4 md:space-y-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Morning, Chief! 👋
            </h2>
            <p className="text-slate-400 mt-1">
              Ready to push IronCore to new limits today?
            </p>
          </div>

          <div className="flex space-x-2 md:space-x-3">
            <button className="bg-slate-800 text-white px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-bold hover:bg-slate-700 transition-all">
              Export Report
            </button>

            <button
              onClick={() => navigate('/members')}
              className="bg-lime-500 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-black hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 active:scale-95"
            >
              Manage Core
            </button>
          </div>
        </header>

        {/* STAT CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard
            title="Active Members"
            value={activeMembers}
            change="0%"
            trend="up"
            onClick={() => navigate('/members')}
          />
          <StatCard
            title="Total Revenue"
            value={`₹${totalRevenue.toLocaleString()}`}
            change="0%"
            trend="up"
            onClick={() => navigate('/billing')}
          />
          <StatCard
            title="Staff Count"
            value={trainers.length}
            change="0%"
            trend="up"
            onClick={() => navigate('/trainers')}
          />
          <StatCard
            title="Check-ins"
            value={attendance.length}
            change="0%"
            trend="up"
            onClick={() => navigate('/attendance')}
          />
        </div>

        {/* REVENUE SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50">
            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8">
              Revenue Analytics
            </h4>

            <div className="h-64 flex items-center justify-center text-slate-600">
              No data available yet
            </div>
          </div>

          <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50">
            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8">
              Quick Statistics
            </h4>

            <div className="space-y-6">
              <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase font-black mb-1">
                  Conversion Rate
                </p>
                <p className="text-2xl font-black text-white">0%</p>
              </div>

              <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50">
                <p className="text-xs text-slate-500 uppercase font-black mb-1">
                  Attrition
                </p>
                <p className="text-2xl font-black text-white">0%</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;