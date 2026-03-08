// pages/AICoach.js
import React, { useState } from "react";
import { getWorkoutPlan } from "../services/geminiService";
import Sidebar from "../components/Sidebar";

const AICoach = () => {
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  const [memberData, setMemberData] = useState({
    fullName: "Alex Johnson",
    age: 28,
    gender: "Male",
    weight: 80,
    height: 175,
    goal: "Muscle Gain",
    healthConditions: []
  });

  const fitnessGoals = [
    "Weight Loss",
    "Weight Gain",
    "Muscle Gain",
    "Endurance",
    "General Fitness",
    "Powerlifting"
  ];

  const handleGenerate = async () => {
    if (!process.env.REACT_APP_API_KEY) {
      alert("API Key is missing! Add your REACT_APP_API_KEY in .env");
      return;
    }
    setLoading(true);
    const result = await getWorkoutPlan(memberData);
    if (!result) alert("Failed to generate plan. Check console for errors.");
    setPlan(result);
    setLoading(false);
  };

  const handleReset = () => setPlan(null);
  const handleExportPDF = () => window.print();
  const getImageUrl = (query) =>
    `https://loremflickr.com/300/200/${encodeURIComponent(query)}`;

  return (
    <div className="flex bg-slate-950 min-h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Content */}
      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          {/* <div>
            <h1 className="text-4xl font-black text-white tracking-tighter">
              IRONCORE FITNESS
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">
              AI-Powered Training & Nutrition Report
            </p>
          </div> */}
          {/* <div className="text-right">
            <p className="text-sm font-bold text-white">
              Generated: {new Date().toLocaleDateString()}
            </p>
            <p className="text-xs text-slate-400">
              Report ID: IC-{Math.floor(Math.random() * 100000)}
            </p>
          </div> */}
        </div>

        {/* AI Coach Title and Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
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
        </div>

        {/* Member Form */}
        {!plan && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div className="bg-slate-800/50 border border-slate-700 rounded-2xl md:rounded-3xl p-5 md:p-8 space-y-6 shadow-2xl">
              <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                Member Assessment
              </h3>
              <div className="space-y-5">

  {/* Full Name */}
  <input
    type="text"
    placeholder="Full Name"
    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
    value={memberData.fullName}
    onChange={(e) =>
      setMemberData({ ...memberData, fullName: e.target.value })
    }
  />

  {/* Age & Gender */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="number"
      placeholder="Age"
      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
      value={memberData.age}
      onChange={(e) =>
        setMemberData({
          ...memberData,
          age: parseInt(e.target.value) || 0
        })
      }
    />

    <select
      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
      value={memberData.gender}
      onChange={(e) =>
        setMemberData({ ...memberData, gender: e.target.value })
      }
    >
      <option value="Male">Male</option>
      <option value="Female">Female</option>
    </select>
  </div>

  {/* Weight & Height */}
  <div className="grid grid-cols-2 gap-4">
    <input
      type="number"
      placeholder="Weight (kg)"
      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
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
      placeholder="Height (cm)"
      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-lime-500"
      value={memberData.height}
      onChange={(e) =>
        setMemberData({
          ...memberData,
          height: parseInt(e.target.value) || 0
        })
      }
    />
  </div>

  {/* Fitness Goals */}
  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
    {fitnessGoals.map((g) => (
      <button
        key={g}
        type="button"
        onClick={() => setMemberData({ ...memberData, goal: g })}
        className={`px-3 py-2 rounded-lg border text-sm font-semibold transition ${
          memberData.goal === g
            ? "bg-lime-500 text-slate-900 border-lime-500"
            : "text-white border-slate-700 hover:bg-slate-800"
        }`}
      >
        {g}
      </button>
    ))}
  </div>

  {/* Generate Button */}
  <button
    onClick={handleGenerate}
    disabled={loading}
    className="w-full bg-lime-500 hover:bg-lime-400 text-slate-900 py-4 rounded-xl font-black tracking-wide transition"
  >
    {loading ? "CALCULATING..." : "GENERATE PLAN"}
  </button>

</div>
            </div>
          </div>
        )}

        {/* Display Plan */}
        {plan && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-800/50 p-5 md:p-6 rounded-2xl border border-slate-700">
                <h3 className="text-lg md:text-xl font-bold text-white">
                  Member: {memberData.fullName}
                </h3>
                <p className="text-xs text-slate-300 mt-3">{plan.summary}</p>
              </div>

              {plan.workoutPlan.map((day, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900 p-4 rounded-xl space-y-2"
                >
                  <h4 className="font-bold text-white">{day.day}</h4>
                  <p className="text-sm text-slate-400">Focus: {day.focus}</p>
                  {day.exercises.map((ex, i) => (
                    <div
                      key={i}
                      className="flex items-center space-x-4 mb-2 bg-slate-800 p-2 rounded-lg"
                    >
                      <img
                        src={getImageUrl(ex.visualQuery)}
                        alt={ex.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-white font-semibold">{ex.name}</p>
                        <p className="text-slate-400 text-sm">{ex.sets}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-slate-800/50 p-5 md:p-6 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-lg md:text-xl font-bold text-white">Nutrition</h3>
              <p className="text-sm text-slate-400">
                Daily Calories: {plan.dietPlan.dailyCalories} KCAL
              </p>
              <p className="text-sm text-slate-400">
                Macros: Protein {plan.dietPlan.macros.protein}g | Carbs{" "}
                {plan.dietPlan.macros.carbs}g | Fat {plan.dietPlan.macros.fat}g
              </p>

              {plan.dietPlan.meals.map((meal, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 bg-slate-900 p-2 rounded-lg"
                >
                  <img
                    src={getImageUrl(meal.visualQuery)}
                    alt={meal.label}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-white font-semibold">{meal.label}</p>
                    <p className="text-slate-400 text-sm">{meal.description}</p>
                    <p className="text-xs text-slate-500">{meal.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoach;