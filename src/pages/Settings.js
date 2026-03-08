import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FiSmartphone, FiClock, FiThumbsDown, FiPrinter  } from "react-icons/fi";

import { getSettings, updateSettings } from "../api/settingsApi";

const Settings = () => {

  const [isOpen, setIsOpen] = useState(true);

  const [settings, setSettings] = useState({
    facilityName: "",
    contactEmail: "",
    address: "",
    openTime: "06:00",
    closeTime: "22:00",
    currency: "INR"
  });

  // Load settings
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getSettings();
        if (data) setSettings(data);
      } catch (err) {
        console.log(err);
      }
    };

    loadSettings();
  }, []);

  // Input change
  const handleChange = (e) => {
    setSettings({
      ...settings,
      [e.target.name]: e.target.value
    });
  };

  // Save settings
  const deployChanges = async () => {
    try {
      await updateSettings(settings);
      alert("Settings deployed successfully");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 pb-32 space-y-8">

        <header>
          <h1 className="text-3xl font-black text-white tracking-tight">
            System Nexus
          </h1>
          <p className="text-slate-400 mt-1">
            Core Operational Parameters
          </p>
        </header>

        <div className="space-y-6">

          {/* BUSINESS INTELLIGENCE */}
          <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50">

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-lime-500/10 text-lime-400 p-3 rounded-xl">
                <FiSmartphone size={20}/>
              </div>

              <h3 className="text-xl font-black text-white">
                Business Intelligence
              </h3>
            </div>

            <div className="space-y-5">

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <label className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                    Facility Name
                  </label>

                  <input
                    type="text"
                    name="facilityName"
                    value={settings.facilityName}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <label className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                    Contact Email
                  </label>

                  <input
                    type="email"
                    name="contactEmail"
                    value={settings.contactEmail}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                  />
                </div>

              </div>

              <div>
                <label className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                  Physical Coordinates
                </label>

                <input
                  type="text"
                  name="address"
                  value={settings.address}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                />
              </div>

            </div>
          </div>


          {/* OPERATION WINDOW */}
          <div className="bg-slate-800/50 p-8 rounded-[2.5rem] border border-slate-700/50">

            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-500/10 text-blue-400 p-3 rounded-xl">
                <FiClock size={20}/>
              </div>

              <h3 className="text-xl font-black text-white">
                Operation Window
              </h3>
            </div>

            <div className="space-y-6">

              <div className="grid md:grid-cols-2 gap-4">

                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                    Activation
                  </p>

                  <input
                    type="time"
                    name="openTime"
                    value={settings.openTime}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                  />
                </div>

                <div>
                  <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                    Deactivation
                  </p>

                  <input
                    type="time"
                    name="closeTime"
                    value={settings.closeTime}
                    onChange={handleChange}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                  />
                </div>

              </div>

              <div>
                <p className="text-slate-500 text-[10px] uppercase tracking-[0.2em] font-black mb-2">
                  Fiscal Localization
                </p>

                <select
                  name="currency"
                  value={settings.currency}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white"
                >
                  <option value="INR">India (INR)</option>
                  <option value="USD">USA (USD)</option>
                  <option value="EUR">Europe (EUR)</option>
                </select>

              </div>

            </div>
          </div>


          {/* DANGER ZONE */}
          <div className="bg-red-500/10 p-8 rounded-[2.5rem] border border-red-500/30">

            <div className="flex items-center gap-3 mb-3">
              <FiThumbsDown className="text-red-400" size={22}/>
              <h3 className="text-xl font-black text-red-400">
                Danger Zone
              </h3>
            </div>

            <p className="text-slate-300 text-sm mb-6">
              Destructive operations targeting core system data.
            </p>

            <div className="flex gap-4">

              <button className="bg-transparent border border-red-500/40 text-red-400 px-6 py-3 rounded-xl hover:bg-red-500/10 text-[10px] uppercase tracking-[0.2em] font-black">
                Purge Database
              </button>

              <button className="bg-transparent border border-slate-600 text-white px-6 py-3 rounded-xl hover:bg-slate-800 text-[10px] uppercase tracking-[0.2em] font-black">
                Hard System Reset
              </button>

            </div>
          </div>

        </div>


        {/* STICKY DEPLOY BUTTON */}
       <div className="fixed bottom-6 right-6">

            <button
                onClick={deployChanges}
                className="flex items-center gap-2 bg-lime-500 text-black px-6 py-3 rounded-xl shadow-lg transition transform hover:scale-105 font-bold"
            >
                <FiPrinter size={18} />
                Deploy Changes
            </button>

</div>

      </div>
    </div>
  );
};

export default Settings;