import React, { useState } from 'react';

const TrainerManagement = ({ trainers, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Trainer',
    specialization: [],
    salary: 0
  });

  const handleOpenAdd = () => {
    setEditingTrainer(null);
    setFormData({
      name: '',
      role: 'Trainer',
      specialization: [],
      salary: 25000
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t) => {
    setEditingTrainer(t);
    setFormData(t);
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (editingTrainer) {
      onUpdate({ ...editingTrainer, ...formData });
    } else {
      onAdd({
        ...formData,
        id: `STF-${Math.floor(Math.random() * 1000)}`,
        rating: 5.0,
        avatarUrl: `https://picsum.photos/150/150?random=${Math.random()}`
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in slide-in-from-right duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Staff & Trainers</h2>
          <p className="text-slate-400">
            Manage specialized coaches and facility staff.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-lime-500 text-slate-900 px-6 py-3 rounded-2xl font-bold hover:bg-lime-400 transition-all shadow-xl shadow-lime-500/20 flex items-center space-x-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
            viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14"/>
            <path d="M12 5v14"/>
          </svg>
          <span>Recruit Staff</span>
        </button>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {trainers.map((trainer) => (
          <div
            key={trainer.id}
            className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-6 hover:border-lime-500/50 transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="w-16 h-16 rounded-2xl bg-slate-700 overflow-hidden border-2 border-slate-600">
                <img src={trainer.avatarUrl} alt={trainer.name} />
              </div>

              <div className="flex space-x-1">
                <button
                  onClick={() => handleOpenEdit(trainer)}
                  className="p-2 text-slate-500 hover:text-white transition-colors"
                >
                  ✏️
                </button>

                <button
                  onClick={() => onDelete(trainer.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition-colors"
                >
                  🗑
                </button>
              </div>
            </div>

            <h3 className="text-xl font-bold text-white group-hover:text-lime-500 transition-colors">
              {trainer.name}
            </h3>

            <p className="text-sm text-lime-500/80 font-semibold mb-2">
              {trainer.role}
            </p>

            <div className="flex flex-wrap gap-2 mb-4">
              {trainer.specialization &&
                trainer.specialization.map((s) => (
                  <span
                    key={s}
                    className="px-2 py-0.5 rounded-full bg-slate-900 border border-slate-700 text-[10px] text-slate-400 uppercase tracking-wider"
                  >
                    {s}
                  </span>
                ))}
            </div>

            <div className="pt-4 border-t border-slate-700 flex justify-between items-center">
              <div>
                <p className="text-[10px] text-slate-500 uppercase">
                  Monthly Salary
                </p>
                <p className="text-lg font-bold text-white">
                  ₹{trainer.salary}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[10px] text-slate-500 uppercase">
                  Rating
                </p>
                <div className="flex items-center text-amber-400 font-bold">
                  ⭐ {trainer.rating?.toFixed(1)}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">

            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {editingTrainer ? 'Update Staff Member' : 'New Staff Onboarding'}
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">

              <div className="grid grid-cols-2 gap-4">

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Full Name
                  </label>
                  <input
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Role
                  </label>
                  <select
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                  >
                    <option>Trainer</option>
                    <option>Manager</option>
                    <option>Receptionist</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Base Salary (₹)
                  </label>
                  <input
                    type="number"
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                    value={formData.salary}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        salary: Number(e.target.value)
                      })
                    }
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Specializations (comma separated)
                  </label>
                  <input
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                    placeholder="HIIT, Yoga, Strength..."
                    value={formData.specialization.join(', ')}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        specialization: e.target.value
                          .split(',')
                          .map((s) => s.trim())
                      })
                    }
                  />
                </div>

              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex-1 px-4 py-3 rounded-xl bg-lime-500 text-slate-900 font-bold hover:bg-lime-400 transition-colors"
                >
                  Save Staff
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrainerManagement;
