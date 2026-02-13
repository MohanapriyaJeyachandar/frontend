import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

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

const Dashboard = ({ members, trainers, attendance, invoices, onNavigate }) => {
  const totalRevenue = invoices.reduce((acc, inv) => acc + inv.amount, 0);
  const activeMembers = members.length;
  const recentCheckins = attendance.slice(0, 5);

  const expiringMembers = members.filter((m) => {
    const end = new Date(m.endDate);
    const now = new Date();
    const diff = (end.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff > 0 && diff < 7;
  });

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
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
          <button className="flex-1 md:flex-none bg-slate-800 text-white px-5 py-2.5 rounded-xl border border-slate-700 text-sm font-bold hover:bg-slate-700 transition-all no-print">
            Export Report
          </button>

          <button
            onClick={() => onNavigate('members')}
            className="flex-1 md:flex-none bg-lime-500 text-slate-900 px-5 py-2.5 rounded-xl text-sm font-black hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 active:scale-95"
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
          onClick={() => onNavigate('members')}
        />
        <StatCard
          title="Total Revenue"
          value={`₹${totalRevenue.toLocaleString()}`}
          change="0%"
          trend="up"
          onClick={() => onNavigate('billing')}
        />
        <StatCard
          title="Staff Count"
          value={trainers.length}
          change="0%"
          trend="up"
          onClick={() => onNavigate('trainers')}
        />
        <StatCard
          title="Check-ins"
          value={attendance.length}
          change="0%"
          trend="up"
          onClick={() => onNavigate('attendance')}
        />
      </div>

      {/* REVENUE CHART */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-800/50 p-4 md:p-8 rounded-[2.5rem] border border-slate-700/50">
          <div className="flex justify-between items-center mb-10">
            <h4 className="text-xl font-black text-white uppercase tracking-tight">
              Revenue Analytics
            </h4>
            <div className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Live Feed
            </div>
          </div>

          <div className="h-64 md:h-80">
            {invoices.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#84cc16" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#84cc16" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#334155"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: 'none',
                      borderRadius: '12px',
                      color: '#fff',
                      fontSize: '12px',
                    }}
                    itemStyle={{ color: '#84cc16' }}
                    formatter={(value) => [`₹${value}`, 'Revenue']}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#84cc16"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRev)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4">
                <p className="text-sm font-bold uppercase tracking-widest">
                  No data available yet
                </p>
              </div>
            )}
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="bg-slate-800/50 p-4 md:p-8 rounded-[2.5rem] border border-slate-700/50 flex flex-col">
          <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8">
            Quick Statistics
          </h4>

          <div className="space-y-6 flex-1">
            <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                Conversion Rate
              </p>
              <p className="text-2xl font-black text-white">0%</p>
            </div>

            <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-700/50">
              <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">
                Attrition
              </p>
              <p className="text-2xl font-black text-white">0%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
