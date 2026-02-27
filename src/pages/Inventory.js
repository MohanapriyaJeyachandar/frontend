import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import {
  getInventory,
  createInventory,
  updateInventory,
  deleteInventory
} from "../api/inventoryApi";

const Inventory = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [inventory, setInventory] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Supplement',
    price: 0,
    stock: 0,
  });

  useEffect(() => {
  fetchInventory();
}, []);

const fetchInventory = async () => {
  try {
    const res = await getInventory();

    const formatted = res.data.data.map((item) => ({
      id: item._id,              
      name: item.itemName,       
      category: item.category,
      price: item.price,
      stock: item.initialStock   
    }));

    setInventory(formatted);
  } catch (err) {
    console.error(err);
  }
};

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', category: 'Supplement', price: 0, stock: 0 });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item) => {
  setEditingItem(item);

  setFormData({
    name: item.name,
    category: item.category,
    price: item.price,
    stock: item.stock
  });

  setIsModalOpen(true);
};

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editingItem) {
      await updateInventory(editingItem.id, {
        itemName: formData.name,
        category: formData.category,
        price: formData.price,
        initialStock: formData.stock
      });
    } else {
      await createInventory({
        itemName: formData.name,
        category: formData.category,
        price: formData.price,
        initialStock: formData.stock
      });
    }

    fetchInventory();
    setIsModalOpen(false);
  } catch (err) {
    console.error(err.response?.data || err.message);
  }
};

  const handleDelete = async (id) => {
  try {
    await deleteInventory(id);
    fetchInventory();
  } catch (err) {
    console.error(err);
  }
};

  return (
    <div className="flex bg-slate-950 min-h-screen">
      
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 ml-0 md:ml-64 p-8 space-y-8 animate-in slide-in-from-right duration-500">

        <button
          className="md:hidden mb-4 bg-lime-500 text-black px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          Open Menu
        </button>

        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">Inventory & Shop</h2>
            <p className="text-slate-400">
              Manage protein, gear, and merchandise stock levels.
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
            <span>Stock In</span>
          </button>
        </header>

        {/* INVENTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {inventory.map((item) => (
            <div
              key={item.id}
              className="bg-slate-800/50 border border-slate-700/50 rounded-3xl p-5 hover:border-lime-500/50 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                    {item.category}
                  </span>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleOpenEdit(item)}
                      className="text-slate-500 hover:text-white"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
                        <path d="m15 5 4 4"/>
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <h4 className="text-lg font-bold text-white mb-1">
                  {item.name}
                </h4>

                <p className="text-xl font-black text-lime-500">
                  ₹{item.price}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-700 flex justify-between items-center">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-widest">
                  Available
                </span>

                <span
                  className={`text-sm font-bold ${
                    item.stock < 10 ? 'text-red-400' : 'text-white'
                  }`}
                >
                  {item.stock} Units
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* MODAL (UNCHANGED UI) */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in zoom-in duration-300">
              <div className="p-6 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-xl font-bold text-white">
                  {editingItem ? 'Edit Product' : 'Add New Item'}
                </h3>

                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                    Item Name
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

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Category
                    </label>
                    <select
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    >
                      <option>Supplement</option>
                      <option>Apparel</option>
                      <option>Equipment</option>
                      <option>Drink</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Price (₹)
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: Number(e.target.value)
                        })
                      }
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Initial Stock
                    </label>
                    <input
                      type="number"
                      required
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white outline-none focus:ring-1 focus:ring-lime-500"
                      value={formData.stock}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          stock: Number(e.target.value)
                        })
                      }
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full px-4 py-3 rounded-xl bg-lime-500 text-slate-900 font-bold hover:bg-lime-400 transition-colors"
                  >
                    Save Item
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

export default Inventory;