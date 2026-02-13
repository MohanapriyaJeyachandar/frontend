import React, { useState } from 'react';
// import { getWorkoutPlan } from '../services/geminiService';

const MemberDetailView = ({ member, onBack }) => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [activeTab, setActiveTab] = useState('workout');

  const bmi =
    member.weight && member.height
      ? (member.weight / ((member.height / 100) ** 2)).toFixed(1)
      : 'N/A';

  const getBmiStatus = (val) => {
    const n = parseFloat(val);
    if (isNaN(n)) return { label: 'Unknown', color: 'text-slate-400' };
    if (n < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
    if (n < 25) return { label: 'Normal', color: 'text-lime-400' };
    if (n < 30) return { label: 'Overweight', color: 'text-amber-400' };
    return { label: 'Obese', color: 'text-red-400' };
  };

  const bmiStatus = getBmiStatus(bmi);

  // const fetchPlan = async () => {
  //   setLoading(true);
  //   const result = await getWorkoutPlan({
  //     fullName: member.fullName,
  //     age: member.age,
  //     gender: member.gender,
  //     weight: member.weight,
  //     height: member.height,
  //     healthConditions: member.healthConditions || [],
  //     goal: member.goal || 'Performance Optimization'
  //   });
  //   setPlan(result);
  //   setLoading(false);
  // };

  const getImageUrl = (query, category) => {
    return `https://loremflickr.com/600/400/${category},${encodeURIComponent(
      query.toLowerCase().replace(/ /g, ',')
    )}`;
  };

  return (
    <div className="p-4 md:p-10 space-y-10 animate-in slide-in-from-bottom duration-700">
      
      {/* HEADER */}
      <header className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <button
            onClick={onBack}
            className="p-3 bg-slate-900 border border-slate-800 hover:bg-slate-800 rounded-2xl text-slate-400 hover:text-white transition-all active:scale-90"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
          <div>
            <h2 className="text-3xl font-black text-white tracking-tight">
              Member Passport
            </h2>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
              Bio-Metric Analysis & Training Protocol
            </p>
          </div>
        </div>

        {plan && (
          <button
            onClick={() => window.print()}
            className="bg-slate-800 text-white px-6 py-3 rounded-xl border border-slate-700 text-sm font-bold hover:bg-slate-700 transition-all flex items-center space-x-2 no-print"
          >
            Export Protocol
          </button>
        )}
      </header>

      {/* CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* LEFT PANEL */}
        <div className="lg:col-span-1 space-y-8">
          
          <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-8 text-center backdrop-blur-md shadow-2xl relative overflow-hidden">
            
            <div className="w-40 h-40 mx-auto rounded-[2.5rem] bg-slate-950 border-2 border-slate-800 overflow-hidden mb-6 shadow-inner">
              <img
                src={
                  member.photoUrl ||
                  `https://picsum.photos/200/200?random=${member.id}`
                }
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="text-2xl font-black text-white tracking-tight">
              {member.fullName}
            </h3>

            <div className="mt-6 bg-slate-950 p-6 rounded-[2.5rem] border border-slate-800 shadow-inner">
              <p className="text-5xl font-black text-white tracking-tighter">
                {bmi}
              </p>
              <p className={`text-[10px] font-black mt-2 uppercase tracking-widest ${bmiStatus.color}`}>
                {bmiStatus.label}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="lg:col-span-3 space-y-8">
          
          <div className="flex bg-slate-900 p-1.5 rounded-2xl border border-slate-800 w-fit">
            <button
              onClick={() => setActiveTab('workout')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${
                activeTab === 'workout'
                  ? 'bg-lime-500 text-slate-900'
                  : 'text-slate-500'
              }`}
            >
              Workout Hub
            </button>
            <button
              onClick={() => setActiveTab('diet')}
              className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest ${
                activeTab === 'diet'
                  ? 'bg-lime-500 text-slate-900'
                  : 'text-slate-500'
              }`}
            >
              Nutrition Hub
            </button>
          </div>

          {!plan && !loading && (
            <div className="bg-slate-900/40 border-2 border-dashed border-slate-800 rounded-[3rem] p-20 text-center">
              <button
                // onClick={fetchPlan}
                className="bg-lime-500 text-slate-900 px-10 py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-lime-400 transition-all"
              >
                Initiate AI Synthesis
              </button>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900/40 border border-slate-800 rounded-[3rem] p-20 text-center">
              <h4 className="text-2xl font-black text-white">
                Processing Bio-Signals...
              </h4>
            </div>
          )}

          {plan && (
            <div className="space-y-10">
              {activeTab === 'workout' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {plan.workoutPlan &&
                    plan.workoutPlan.map((day, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6">
                        <span className="text-[10px] font-black text-lime-500 uppercase tracking-[0.2em]">
                          {day.day}
                        </span>
                      </div>
                    ))}
                </div>
              ) : (
                <div>
                  {plan.dietPlan &&
                    plan.dietPlan.meals &&
                    plan.dietPlan.meals.map((meal, i) => (
                      <div key={i} className="bg-slate-900/40 border border-slate-800 rounded-[2.5rem] p-6">
                        <h5 className="font-black text-white">
                          {meal.label}
                        </h5>
                      </div>
                    ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetailView;
