import React, { useState } from 'react';
// import { getWorkoutPlan } from '../services/geminiService';

const AICoach = () => {

  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [memberData, setMemberData] = useState({
    fullName: 'Alex Johnson',
    age: 28,
    gender: 'Male',
    weight: 80,
    height: 175,
    goal: 'Muscle Gain',
    healthConditions: []
  });

  // const handleGenerate = async () => {
  //   setLoading(true);
  //   const result = await getWorkoutPlan(memberData);
  //   setPlan(result);
  //   setLoading(false);
  // };

  const handleReset = () => {
    setPlan(null);
  };

  const handleExportPDF = () => {
    window.print();
  };

  const getImageUrl = (query, category) => {
    return `https://loremflickr.com/300/200/${category},${encodeURIComponent(
      query.toLowerCase().replace(/ /g, ',')
    )}`;
  };

  const fitnessGoals = [
    'Weight Loss',
    'Weight Gain',
    'Muscle Gain',
    'Endurance',
    'General Fitness',
    'Powerlifting'
  ];

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-in zoom-in duration-500 overflow-x-hidden">

      {/* Printable Header */}
      <div className="hidden print:flex justify-between items-center border-b-4 border-lime-500 pb-6 mb-8">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tighter">
            IRONCORE FITNESS
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
            AI-Powered Training & Nutrition Report
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-slate-900">
            Generated: {new Date().toLocaleDateString()}
          </p>
          <p className="text-xs text-slate-500">
            Report ID: IC-{Math.floor(Math.random() * 100000)}
          </p>
        </div>
      </div>

      <header className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0 no-print">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-white flex items-center space-x-3">
            <span className="p-2 bg-lime-500 text-slate-900 rounded-xl font-black text-sm md:text-base">
              AI
            </span>
            <span>IronCore Smart Coach</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1">
            AI-Precision nutrition and training plans.
          </p>
        </div>

        {plan && (
          <div className="flex space-x-2">
            <button
              onClick={handleExportPDF}
              className="flex-1 md:flex-none bg-blue-600 text-white flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl hover:bg-blue-500 transition-all font-bold text-sm"
            >
              Export PDF
            </button>
            <button
              onClick={handleReset}
              className="flex-1 md:flex-none text-slate-400 hover:text-white flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl border border-slate-700 hover:bg-slate-800 transition-all text-sm"
            >
              Reset
            </button>
          </div>
        )}
      </header>

      {!plan && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start no-print">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
            <h3 className="text-lg md:text-xl font-bold text-white mb-2">
              Member Assessment
            </h3>

            <div className="space-y-4">

              <input
                type="text"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm"
                value={memberData.fullName}
                onChange={(e) =>
                  setMemberData({ ...memberData, fullName: e.target.value })
                }
              />

              <input
                type="number"
                value={memberData.age}
                onChange={(e) =>
                  setMemberData({
                    ...memberData,
                    age: parseInt(e.target.value) || 0
                  })
                }
              />

              <input
                type="number"
                value={memberData.weight}
                onChange={(e) =>
                  setMemberData({
                    ...memberData,
                    weight: parseInt(e.target.value) || 0
                  })
                }
              />

              <input
                type="number"
                value={memberData.height}
                onChange={(e) =>
                  setMemberData({
                    ...memberData,
                    height: parseInt(e.target.value) || 0
                  })
                }
              />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {fitnessGoals.map((g) => (
                  <button
                    key={g}
                    onClick={() =>
                      setMemberData({ ...memberData, goal: g })
                    }
                  >
                    {g}
                  </button>
                ))}
              </div>

              <button
                // onClick={handleGenerate}
                disabled={loading}
                className="w-full bg-lime-500 text-slate-900 py-4 rounded-xl font-black"
              >
                {loading ? 'CALCULATING...' : 'GENERATE PLAN'}
              </button>
            </div>
          </div>
        </div>
      )}

      {plan && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-slate-800/50 p-5 md:p-6 rounded-2xl border border-slate-700">
              <h3 className="text-lg md:text-xl font-bold text-white">
                Member: {memberData.fullName}
              </h3>

              <p className="text-xs text-slate-300 mt-3">
                {plan.summary}
              </p>
            </div>

            <div className="space-y-4">
              {plan.workoutPlan.map((day, idx) => (
                <div key={idx}>
                  <h4>{day.day}</h4>

                  {day.exercises.map((ex, i) => (
                    <div key={i}>
                      <p>{ex.name}</p>
                      <p>{ex.sets}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>

          </div>

          <div>
            <h3>Nutrition</h3>
            <p>{plan.dietPlan.dailyCalories} KCAL</p>

            {plan.dietPlan.meals.map((meal, idx) => (
              <div key={idx}>
                <p>{meal.label}</p>
                <p>{meal.description}</p>
              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default AICoach;
