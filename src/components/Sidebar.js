import React from 'react';
import { Icons, COLORS } from '../constants';

const Sidebar = ({
  currentView,
  onViewChange,
  onLogout,
  isOpen,
  setIsOpen
}) => {

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', Icon: Icons.Dashboard },
    { id: 'members', label: 'Members', Icon: Icons.Members },
    { id: 'trainers', label: 'Trainers', Icon: Icons.Trainers },
    { id: 'packages', label: 'Packages', Icon: Icons.Packages },
    { id: 'billing', label: 'Billing', Icon: Icons.Billing },
    { id: 'inventory', label: 'Inventory', Icon: Icons.Inventory },
    { id: 'attendance', label: 'Attendance', Icon: Icons.Attendance },
    { id: 'ai-coach', label: 'AI Coach', Icon: Icons.AICoach },
  ];

  return (
    <div
      className={`
        w-64 bg-slate-900 h-screen fixed left-0 top-0 border-r border-slate-800 flex flex-col no-print z-50
        transition-transform duration-300 ease-in-out md:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="p-6 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-lime-500 rounded-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6.5 6.5 11 11"/>
              <path d="m21 21-1-1"/>
              <path d="m3 3 1 1"/>
              <path d="m18 22 4-4"/>
              <path d="m2 6 4-4"/>
              <path d="m3 10 7-7"/>
              <path d="m14 21 7-7"/>
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white">
            IRONCORE
          </h1>
        </div>

        <button
          className="md:hidden text-slate-500 hover:text-white"
          onClick={() => setIsOpen && setIsOpen(false)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6"/>
          </svg>
        </button>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              currentView === item.id
                ? 'bg-lime-500 text-slate-900 font-semibold shadow-lg shadow-lime-500/20'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.Icon />
            <span className="text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800 space-y-4">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-slate-800/50">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden">
            <img
              src="https://picsum.photos/32/32?random=admin"
              alt="Admin"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-medium text-white truncate">
              Gym Manager
            </p>
            <p className="text-[10px] text-slate-400 truncate">
              admin@ironcore.fit
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span className="text-sm font-semibold">Sign Out</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
