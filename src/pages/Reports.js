
import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import { useNavigate } from "react-router-dom";
import { getmembers } from "../api/memberApi";
import { getRecords } from "../api/attendanceApi";
import { CSVLink } from "react-csv";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FaFileCsv, FaFilePdf, FaChartBar } from "react-icons/fa";

const Reports = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(true);

  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);

  const [attendances, setAttendances] = useState([]);
  const [filteredAttendances, setFilteredAttendances] = useState([]);

  const [selectedReport, setSelectedReport] = useState("Member Report");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const membersData = await getmembers();
        setMembers(membersData.data);
        setFilteredMembers(membersData.data);

        const attendanceData = await getRecords();
        setAttendances(attendanceData);
        setFilteredAttendances(attendanceData);
      } catch (error) {
        console.log("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    if (!fromDate || !toDate) {
      setFilteredMembers(members);
      setFilteredAttendances(attendances);
      return;
    }

    const from = new Date(fromDate);
    const to = new Date(toDate);

    const filteredM = members.filter((m) => {
      const created = new Date(m.createdAt);
      return created >= from && created <= to;
    });

    const filteredA = attendances.filter((a) => {
      const check = new Date(a.checkIn);
      return check >= from && check <= to;
    });

    setFilteredMembers(filteredM);
    setFilteredAttendances(filteredA);
  };

  const clearFilters = () => {
    setFromDate("");
    setToDate("");
    setFilteredMembers(members);
    setFilteredAttendances(attendances);
  };

  const csvData = filteredMembers.map((m) => ({
    MemberID: m._id,
    Name: m.name,
    Phone: m.contactPhone,
    Gender: m.genderIdentity,
    Age: m.biologicalAge,
    Goal: m.fitnessGoal,
    Plan: m.membershipPlan,
    Ledger: m.ledgerStatus,
  }));

  const exportPDF = () => {
    const doc = new jsPDF();

    let title = "Members Report";
    let tableRows = [];

    if (selectedReport === "Member Report") {
      title = "Members Report";

      tableRows = filteredMembers.map((m) => [
        m._id,
        m.name,
        m.contactPhone,
        m.genderIdentity,
        m.biologicalAge,
        m.fitnessGoal,
        m.membershipPlan,
        m.ledgerStatus,
      ]);

      autoTable(doc, {
        head: [["MemberID", "Name", "Phone", "Gender", "Age", "Goal", "Plan", "Ledger"]],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
      });
    }

    if (selectedReport === "Attendance Report") {
      title = "Attendance Report";

      tableRows = filteredAttendances.map((a) => [
        a.memberId,
        a.memberName,
        new Date(a.checkIn).toLocaleString(),
        a.checkOut ? new Date(a.checkOut).toLocaleString() : "ACTIVE",
      ]);

      autoTable(doc, {
        head: [["MemberID", "Member Name", "Check In", "Check Out"]],
        body: tableRows,
        startY: 30,
        styles: { fontSize: 8 },
      });
    }

    doc.text(title, 14, 20);
    doc.save("report.pdf");
  };

  return (
    <div className="flex bg-slate-950 min-h-screen">

      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div className="flex-1 ml-0 md:ml-64 p-4 md:p-8 space-y-6 md:space-y-8">

        <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Reports Engine
            </h2>
            <p className="text-slate-400 mt-1 text-sm">
              Generate and export system-wide analytics
            </p>
          </div>

          <div className="flex space-x-2 mt-4 md:mt-0 text-sm font-semibold">
            <CSVLink
              data={csvData}
              className="flex items-center px-3 py-1 rounded hover:bg-slate-700 transition-all"
            >
              <FaFileCsv className="mr-1" /> CSV
            </CSVLink>

            <button
              onClick={exportPDF}
              className="flex items-center px-3 py-1 rounded hover:bg-slate-700 transition-all"
            >
              <FaFilePdf className="mr-1" /> PDF
            </button>

            <button className="flex items-center px-3 py-1 rounded hover:bg-slate-700 transition-all">
              <FaChartBar className="mr-1" /> Report
            </button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">

          <div className="lg:w-[30%] bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 text-[10px] uppercase tracking-[0.2em]">

            <h4 className="text-white font-black mb-4">
              Report Category
            </h4>

            <div className="space-y-2">
              {["Member Report", "Attendance Report", "Outstanding Report"].map((report) => (
                <button
                  key={report}
                  onClick={() => setSelectedReport(report)}
                  className={`w-full text-left px-3 py-2 rounded transition-colors duration-300 ${
                    selectedReport === report
                      ? "bg-lime-500 text-black font-black"
                      : "bg-slate-700 text-white hover:bg-slate-600"
                  }`}
                >
                  {report}
                </button>
              ))}
            </div>

            <div className="mt-6 space-y-3">
              <h5 className="text-slate-400 font-black">
                Date Range
              </h5>

              <div className="flex space-x-2">
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                />

                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-slate-700 text-white px-3 py-2 rounded w-full"
                />
              </div>

              <div className="flex space-x-2 mt-2">
                <button
                  onClick={applyFilters}
                  className="px-3 py-2 rounded text-white bg-slate-700 hover:bg-lime-500 hover:text-black"
                >
                  Apply
                </button>

                <button
                  onClick={clearFilters}
                  className="px-3 py-2 rounded text-white bg-slate-700 hover:bg-red-500"
                >
                  Clear
                </button>
              </div>
            </div>

          </div>

          <div className="lg:w-[70%] bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50">

            <h4 className="text-white font-bold mb-4 text-sm">
              Preview: {selectedReport}
            </h4>

            {selectedReport === "Member Report" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700 text-[10px] uppercase tracking-[0.2em] text-white">

                  <thead>
                    <tr className="border-b border-slate-700 text-slate-500 bg-slate-900/40">
                      <th className="px-6 py-5 font-black text-left">Identity</th>
                      <th className="px-6 py-5 font-black text-left">Goal</th>
                      <th className="px-6 py-5 font-black text-left">Membership</th>
                      <th className="px-6 py-5 font-black text-left">Status</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700 text-[10px] uppercase tracking-[0.2em] font-semibold">
                    {filteredMembers.map((m) => (
                      <tr key={m._id} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4">{m.name}</td>
                        <td className="px-6 py-4">{m.fitnessGoal}</td>
                        <td className="px-6 py-4">{m.membershipPlan}</td>
                        <td className="px-6 py-4">{m.ledgerStatus}</td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

            {selectedReport === "Attendance Report" && (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-700 text-[10px] uppercase tracking-[0.2em] text-white">

                  <thead>
                    <tr className="border-b border-slate-700 text-slate-500 bg-slate-900/40">
                      <th className="px-6 py-5 font-black text-left">Member ID</th>
                      <th className="px-6 py-5 font-black text-left">Member Name</th>
                      <th className="px-6 py-5 font-black text-left">Check In</th>
                      <th className="px-6 py-5 font-black text-left">Check Out</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-700 text-[10px] uppercase tracking-[0.2em] font-semibold">
                    {filteredAttendances.map((a) => (
                      <tr key={a._id} className="hover:bg-slate-700/50">
                        <td className="px-6 py-4">{a.memberId}</td>
                        <td className="px-6 py-4">{a.memberName}</td>
                        <td className="px-6 py-4">
                          {new Date(a.checkIn).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          {a.checkOut ? new Date(a.checkOut).toLocaleString() : "ACTIVE"}
                        </td>
                      </tr>
                    ))}
                  </tbody>

                </table>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
