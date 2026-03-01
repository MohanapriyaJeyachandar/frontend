import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import TrainerManagement from './pages/TrainerManagement';
import PackageManagement from "./pages/PackageManagement";
import Billing from './pages/Billing';
import Inventory from './pages/Inventory';
import AttendancePage from './pages/Attendance';
import Employee from './pages/Employee';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AICoach from './pages/AICoach';

<ToastContainer position="top-right" autoClose={3000} />

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/members" element={<Members />} />
        <Route path="/trainers" element={<TrainerManagement />} />
        <Route path="/packages" element={<PackageManagement />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/ai-coach" element={<AICoach />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;