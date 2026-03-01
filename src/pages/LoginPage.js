import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from "../services/axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] =  useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axiosInstance.post("/auth/login", {
        identifier,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");

    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
    
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=2000" 
          alt="Gym Equipment" 
          className="w-full h-full object-cover opacity-30 grayscale contrast-125"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20 z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[40rem] h-[40rem] bg-lime-500/20 rounded-full blur-[120px] animate-pulse"></div>
        <div 
          className="absolute bottom-[-10%] left-[-5%] w-[35rem] h-[35rem] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" 
          style={{ animationDelay: '1s' }}
        ></div>
      </div>

      <div className="relative z-10 w-full max-w-md px-6 animate-in fade-in zoom-in duration-700">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-lime-500 rounded-2xl flex items-center justify-center mb-4 shadow-2xl shadow-lime-500/40 transform -rotate-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="m6.5 6.5 11 11"/>
              <path d="m21 21-1-1"/>
              <path d="m3 3 1 1"/>
              <path d="m18 22 4-4"/>
              <path d="m2 6 4-4"/>
              <path d="m3 10 7-7"/>
              <path d="m14 21 7-7"/>
            </svg>
          </div>

          <h1 className="text-5xl font-black tracking-tighter text-white">IRONCORE</h1>
          <p className="text-lime-500 font-black uppercase tracking-[0.5em] text-[10px] mt-2">
            Enterprise Ecosystem
          </p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] p-10 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                Staff Access Identity
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all outline-none text-sm"
                  placeholder="Username or Email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">
                Security Keyphrase
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl px-6 py-4 text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-lime-500/50 focus:border-lime-500/50 transition-all outline-none text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-lime-500 text-slate-950 py-5 rounded-2xl font-black text-lg hover:bg-lime-400 transition-all shadow-2xl shadow-lime-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-4 uppercase tracking-widest"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-5 h-5 border-4 border-slate-950 border-t-transparent rounded-full animate-spin"></div>
                  <span>Syncing...</span>
                </div>
              ) : (
                'Access Core'
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-white/5 flex items-center justify-between text-[10px] font-black text-slate-600 uppercase tracking-widest">
            <button className="hover:text-lime-500 transition-colors">
              Credential Recovery
            </button>
            <button className="hover:text-lime-500 transition-colors">
              Support Link
            </button>
          </div>
        </div>

        <p className="mt-10 text-center text-slate-700 text-[10px] font-black uppercase tracking-widest">
          Secured by IronCore Distributed Ledger v2.4
        </p>
      </div>
    </div>
  );
};

export default LoginPage;