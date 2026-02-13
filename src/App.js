import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import MemberManagement from './components/MemberManagement';
import TrainerManagement from './components/TrainerManagement';
import PackageManagement from './components/PackageManagement';
import BillingManagement from './components/BillingManagement';
import InventoryManagement from './components/InventoryManagement';
import AttendanceManagement from './components/AttendanceManagement';
import AICoach from './components/AICoach';
import LoginPage from './components/LoginPage';
import MemberDetailView from './components/MemberDetailView';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  // States
  const [members, setMembers] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [attendance, setAttendance] = useState([]);

  // Generic helpers (converted to JS)
  const addEntity = (list, set, item) => {
    set([item, ...list]);
  };

  const updateEntity = (list, set, item) => {
    set(list.map(i => (i.id === item.id ? item : i)));
  };

  const deleteEntity = (list, set, id) => {
    set(list.filter(i => i.id !== id));
  };

  const handleLogin = () => setIsAuthenticated(true);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('dashboard');
    setIsSidebarOpen(false);
    setSelectedMember(null);
  };

  const changeView = (view) => {
    setCurrentView(view);
    setIsSidebarOpen(false);
    if (view !== 'member-detail') setSelectedMember(null);
  };

  const handleViewMember = (member) => {
    setSelectedMember(member);
    setCurrentView('member-detail');
  };

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            members={members}
            trainers={trainers}
            attendance={attendance}
            invoices={invoices}
            onNavigate={changeView}
          />
        );

      case 'members':
        return (
          <MemberManagement
            members={members}
            onAdd={m => addEntity(members, setMembers, m)}
            onUpdate={m => updateEntity(members, setMembers, m)}
            onDelete={id => deleteEntity(members, setMembers, id)}
            onView={handleViewMember}
          />
        );

      case 'trainers':
        return (
          <TrainerManagement
            trainers={trainers}
            onAdd={t => addEntity(trainers, setTrainers, t)}
            onUpdate={t => updateEntity(trainers, setTrainers, t)}
            onDelete={id => deleteEntity(trainers, setTrainers, id)}
          />
        );

      case 'packages':
        return (
          <PackageManagement
            packages={packages}
            onAdd={p => addEntity(packages, setPackages, p)}
            onUpdate={p => updateEntity(packages, setPackages, p)}
            onDelete={id => deleteEntity(packages, setPackages, id)}
          />
        );

      case 'billing':
        return (
          <BillingManagement
            invoices={invoices}
            members={members}
            onAdd={i => addEntity(invoices, setInvoices, i)}
            onUpdate={i => updateEntity(invoices, setInvoices, i)}
            onDelete={id => deleteEntity(invoices, setInvoices, id)}
          />
        );

      case 'inventory':
        return (
          <InventoryManagement
            inventory={inventory}
            onAdd={i => addEntity(inventory, setInventory, i)}
            onUpdate={i => updateEntity(inventory, setInventory, i)}
            onDelete={id => deleteEntity(inventory, setInventory, id)}
          />
        );

      case 'attendance':
        return (
          <AttendanceManagement
            records={attendance}
            members={members}
            onAdd={r => addEntity(attendance, setAttendance, r)}
            onUpdate={r => updateEntity(attendance, setAttendance, r)}
            onDelete={id => deleteEntity(attendance, setAttendance, id)}
          />
        );

      case 'ai-coach':
        return <AICoach />;

      case 'member-detail':
        return selectedMember ? (
          <MemberDetailView
            member={selectedMember}
            onBack={() => setCurrentView('members')}
          />
        ) : (
          <Dashboard
            members={members}
            trainers={trainers}
            attendance={attendance}
            invoices={invoices}
            onNavigate={changeView}
          />
        );

      default:
        return (
          <Dashboard
            members={members}
            trainers={trainers}
            attendance={attendance}
            invoices={invoices}
            onNavigate={changeView}
          />
        );
    }
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-200 overflow-x-hidden">
      <div className="md:hidden flex items-center justify-between p-4 bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-lime-500 rounded flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6.5 6.5 11 11"/>
              <path d="m21 21-1-1"/>
              <path d="m3 3 1 1"/>
              <path d="m18 22 4-4"/>
              <path d="m2 6 4-4"/>
              <path d="m3 10 7-7"/>
              <path d="m14 21 7-7"/>
            </svg>
          </div>
          <span className="font-black text-lg tracking-tighter text-white">
            IRONCORE
          </span>
        </div>

        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-slate-400 bg-slate-800 rounded-lg"
        >
          {isSidebarOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6 6 18"/>
              <path d="m6 6 12 12"/>
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="4" x2="20" y1="12" y2="12"/>
              <line x1="4" x2="20" y1="6" y2="6"/>
              <line x1="4" x2="20" y1="18" y2="18"/>
            </svg>
          )}
        </button>
      </div>

      <Sidebar
        currentView={currentView}
        onViewChange={changeView}
        onLogout={handleLogout}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <main className="flex-1 min-h-screen relative md:ml-64">
        <div className="max-w-[1600px] mx-auto pb-20 md:pb-0">
          {renderView()}
        </div>
      </main>
    </div>
  );
};

export default App;
