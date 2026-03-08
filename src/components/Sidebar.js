import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Icons } from '../constants';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
    { path: '/members', label: 'Members', Icon: Icons.Members },
    { path: '/trainers', label: 'Trainers', Icon: Icons.Trainers },
    { path: '/packages', label: 'Packages', Icon: Icons.Packages },
    { path: '/billing', label: 'Billing', Icon: Icons.Billing },
    { path: '/inventory', label: 'Inventory', Icon: Icons.Inventory },
    { path: '/attendance', label: 'Attendance', Icon: Icons.Attendance },
    { path: '/reports', label: 'Reports', Icon: Icons.Reports },
    { path: '/ai-coach', label: 'AI Coach', Icon: Icons.AICoach },
    { path: '/employee', label: 'Employee Management', Icon: Icons.Employee },
    { path: '/settings', label: 'Settings', Icon: Icons.Settings },
    
  ];

  return (
    <div
      className={`
        w-64 bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-800 flex flex-col z-50
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >

      <div className="p-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-white">IRONCORE</h1>

        <button
          className="md:hidden text-slate-500 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          ✕
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-lime-500 text-slate-900 font-semibold shadow-lg shadow-lime-500/20'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <item.Icon />
            <span className="text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => navigate('/')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400"
        >
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;