import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import {
  getPackages,
  createPackage,
  updatePackage,
  deletePackage
} from "../api/packageApi";

const PackageManagement = () => {
  const [packages, setPackages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState(null);
  const [isOpen, setIsOpen] = useState(true);
  
  const [formData, setFormData] = useState({
    name: "",
    price: 999,
    duration: 1,
    category: "General",
    features: []
  });

  useEffect(() => {
  fetchPackages();
}, []);

const fetchPackages = async () => {
  try {
    const res = await getPackages();
    setPackages(res.data);
  } catch (err) {
    console.error(err);
  }
};


  const handleOpenAdd = () => {
    setEditingPkg(null);
    setFormData({
      name: "",
      price: 999,
      duration: 1,
      category: "General",
      features: []
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
  setEditingPkg(p);

  setFormData({
    name: p.packagename || "",
    price: p.price || 0,
    duration: p.duration || 1,
    features: p.features
      ? p.features.split(",").map((f) => f.trim())
      : []
  });

  setIsModalOpen(true);
};

  const handleDelete = async (id) => {
  try {
    await deletePackage(id);
    fetchPackages();
  } catch (err) {
    console.error(err);
  }
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payload = {
    packagename: formData.name,
    price: formData.price,
    duration: formData.duration,
    features: formData.features.join(", ")
  };

  try {
    if (editingPkg) {
      await updatePackage(editingPkg._id, payload);
    } else {
      await createPackage(payload);
    }

    fetchPackages();
    setIsModalOpen(false);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in duration-700">
   <button
          className="md:hidden mb-4 bg-lime-500 text-black px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Open Menu
        </button>

        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Membership Packages
            </h2>
            <p className="text-slate-400">
              Design pricing tiers and specialized training plans.
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
            <span>Create Package</span>
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div key={pkg._id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-lime-500 to-blue-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

              <div className="relative bg-slate-900 border border-slate-700/50 rounded-3xl p-8 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <span className="px-3 py-1 rounded-full bg-lime-500/10 text-lime-400 text-[10px] font-bold uppercase tracking-widest">
                    {pkg.category}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenEdit(pkg)}
                      className="text-slate-500 hover:text-white"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(pkg._id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      🗑
                    </button>
                  </div>
                </div>

                <h3 className="text-2xl font-bold text-white mb-2">
                  {pkg.name}
                </h3>

                <div className="flex items-baseline mb-6">
                  <span className="text-4xl font-black text-white">
                    ₹{pkg.price}
                  </span>
                  <span className="text-slate-400 ml-2">
                    / {pkg.duration} mo
                  </span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {pkg.features && pkg.features.split(",").map((f, i) => (
                    <li key={i} className="flex items-center space-x-3 text-sm text-slate-300">
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <button className="w-full py-3 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 transition-colors border border-slate-700">
                  Assign to Members
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ===== MODAL (UNCHANGED DESIGN) ===== */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">

              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {editingPkg ? "Edit Package" : "New Plan Creation"}
                </h3>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">

                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Package Name
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
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({ ...formData, price: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Duration (Months)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                      value={formData.duration}
                      onChange={(e) =>
                        setFormData({ ...formData, duration: Number(e.target.value) })
                      }
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Features (comma separated)
                    </label>
                    <textarea
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500 h-24 resize-none"
                      placeholder="24/7 Access, Personal Trainer, Sauna..."
                      value={formData.features?.join(", ")}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          features: e.target.value
                            .split(",")
                            .map((f) => f.trim())
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
                    Save Plan
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PackageManagement;