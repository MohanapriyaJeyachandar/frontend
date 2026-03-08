import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getmembers } from "../api/memberApi";
import { getBillings } from "../api/billingApi";
import { getUsers } from "../api/userApi";
import { getAttendanceRecords } from "../api/attendanceApi";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

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

  // ----------------- MEMBERS -----------------
  const [members, setMembers] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [billings, setBillings] = useState([]);
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState([

    { name: 'Mon', revenue: 0 },
    { name: 'Tue', revenue: 0 },
    { name: 'Wed', revenue: 0 },
    { name: 'Thu', revenue: 0 },
    { name: 'Fri', revenue: 0 },
    { name: 'Sat', revenue: 0 },
    { name: 'Sun', revenue: 0 },
  ]);

  // Fetch members
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await getmembers();
        setMembers(res.data);
      } catch (error) {
        console.log("Error fetching members", error);
      }
    };
    fetchMembers();
  }, []);

  //getcheckins
  useEffect(() => {
  const fetchCheckins = async () => {
    try {
      const res = await getAttendanceRecords();
      setAttendance(res);
    } catch (error) {
      console.log("Error fetching checkins", error);
    }
  };

  fetchCheckins();
}, []);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsers();
        setUsers(res.data);
      } catch (error) {
        console.log("Error fetching users", error);
      }
    };
    fetchUsers();
  }, []);

  // Fetch billings
  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const res = await getBillings();
        setBillings(res.data.data);
      } catch (error) {
        console.log("Error fetching billings", error);
      }
    };
    fetchBillings();
  }, []);

  // Compute chart data whenever billings change
  useEffect(() => {
    if (billings.length > 0) {
      const revenueByDay = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

      billings.forEach((bill) => {
        const date = new Date(bill.createdAt);
        const dayIndex = date.getDay(); // 0 = Sun, 1 = Mon, ...
        const adjustedIndex = dayIndex === 0 ? 6 : dayIndex - 1; // shift Sunday to last
        revenueByDay[adjustedIndex] += bill.valuation || 0;
      });

      setChartData([
        { name: 'Mon', revenue: revenueByDay[0] },
        { name: 'Tue', revenue: revenueByDay[1] },
        { name: 'Wed', revenue: revenueByDay[2] },
        { name: 'Thu', revenue: revenueByDay[3] },
        { name: 'Fri', revenue: revenueByDay[4] },
        { name: 'Sat', revenue: revenueByDay[5] },
        { name: 'Sun', revenue: revenueByDay[6] },
      ]);
    }
  }, [billings]);

  const activeMembers = members.length;
  const totalRevenue = billings.reduce((acc, bill) => acc + (bill.valuation || 0), 0);
  const userCount = users.length;
  const checkin = attendance.length;

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
            value={userCount}
            change="0%"
            trend="up"
            onClick={() => navigate('/employee')}
          />
          <StatCard
            title="Check-ins"
            value={checkin}
            change="0%"
            trend="up"
            onClick={() => navigate('/attendance')}
          />
        </div>

        {/* REVENUE SECTION */}
        <div className="grid grid-cols-1 gap-6">
          <div className="lg:col-span-2 bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50">
            <h4 className="text-xl font-black text-white uppercase tracking-tight mb-8">
              Revenue Analytics
            </h4>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#fff" />
                  <YAxis stroke="#fff" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#84cc16"
                    strokeWidth={3}
                    dot={{ r: 4, stroke: '#84cc16', strokeWidth: 2, fill: '#84cc16' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;