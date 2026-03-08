import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import TrainerManagement from "./pages/TrainerManagement";
import PackageManagement from "./pages/PackageManagement";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import AttendancePage from "./pages/Attendance";
import Employee from "./pages/Employee";
import AICoach from "./pages/AICoach";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";

import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>

      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>

        {/* Public */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/members"
          element={
            <ProtectedRoute>
              <Members />
            </ProtectedRoute>
          }
        />

        <Route
          path="/trainers"
          element={
            <ProtectedRoute>
              <TrainerManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/packages"
          element={
            <ProtectedRoute>
              <PackageManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route
          path="/inventory"
          element={
            <ProtectedRoute>
              <Inventory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <AttendancePage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employee"
          element={
            <ProtectedRoute>
              <Employee />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-coach"
          element={
            <ProtectedRoute>
              <AICoach />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;