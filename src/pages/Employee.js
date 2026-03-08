import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { getUsers, createUser, deleteUser } from "../api/userApi";

const Employee = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    role: "",
    username: "",
    password: "",
    experience: "",
    education: "",
    dob: ""
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();
      setUsers(res.data);
    } catch (err) {
      console.error("Fetch Error:", err);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();

    try {
      await createUser(formData);
      fetchUsers();
      setIsModalOpen(false);

      setFormData({
        name: "",
        phone: "",
        email: "",
        role: "",
        username: "",
        password: "",
        experience: "",
        education: "",
        dob: ""
      });

    } catch (err) {
      console.error("Create Error:", err.response?.data || err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (err) {
      console.error("Delete Error:", err);
    }
  };

  return (
    <div className="flex bg-slate-950 min-h-screen">
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-8">

        <header className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Employee Command Center
            </h2>
            <p className="text-slate-400 text-sm uppercase tracking-widest mt-1">
              Workforce Management
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-lime-500 text-slate-900 px-6 py-3 rounded-xl font-black hover:bg-lime-400"
          >
            Add Employee
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase">Total Employees</p>
            <h3 className="text-3xl font-black text-white">
              {users.length}
            </h3>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase">Trainers</p>
            <h3 className="text-3xl font-black text-blue-400">
              {users.filter(u => u.role === "Trainer").length}
            </h3>
          </div>

          <div className="bg-slate-800/40 p-6 rounded-[2rem] border border-slate-700/50">
            <p className="text-slate-500 text-xs uppercase">Admins</p>
            <h3 className="text-3xl font-black text-red-400">
              {users.filter(u => u.role === "Admin").length}
            </h3>
          </div>
        </div>

        <div className="bg-slate-800/40 rounded-[2.5rem] border border-slate-700/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-700 text-slate-500 text-xs uppercase bg-slate-900/40">
                  <th className="px-6 py-5">Code</th>
                  <th className="px-6 py-5">Name</th>
                  <th className="px-6 py-5">Username</th>
                  <th className="px-6 py-5">Role</th>
                  <th className="px-6 py-5">Phone</th>
                  <th className="px-6 py-5">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-700/50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-700/20">
                    <td className="px-6 py-5 text-slate-400">{u.employeeCode}</td>
                    <td className="px-6 py-5 text-white font-bold">{u.name}</td>
                    <td className="px-6 py-5 text-lime-400">{u.username}</td>
                    <td className="px-6 py-5 text-blue-400">{u.role}</td>
                    <td className="px-6 py-5 text-slate-400">{u.phone}</td>
                    <td className="px-6 py-5">
                      <button
                        onClick={() => handleDelete(u._id)}
                        className="px-3 py-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                        viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18"/>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                      </svg>
                      </button>
                    </td>
                  </tr>
                ))}

                {users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-slate-600 uppercase text-xs">
                      No Employees Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-[2.5rem] p-8">

              <h3 className="text-2xl font-black text-white mb-6">
                Register New Employee
              </h3>

              <form onSubmit={handleCreate} className="grid grid-cols-2 gap-4">

                {Object.keys(formData).map((key) => (
                  <input
                    key={key}
                    type={
                      key === "password"
                        ? "password"
                        : key === "dob"
                        ? "date"
                        : key === "experience"
                        ? "number"
                        : "text"
                    }
                    placeholder={key}
                    required={!["experience", "education", "dob"].includes(key)}
                    className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white"
                    value={formData[key]}
                    onChange={(e) =>
                      setFormData({ ...formData, [key]: e.target.value })
                    }
                  />
                ))}

                <div className="col-span-2 flex space-x-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-slate-800 text-white"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-lime-500 text-slate-900 font-black"
                  >
                    Create
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

export default Employee;
