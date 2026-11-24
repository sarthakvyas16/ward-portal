
import { useEffect, useState } from "react";
import {
  Search,
  MessageSquare,
  Clock,
  CheckCircle2,
  Eye,
  Trash2,
  X,
  MapPin,
  Phone,
  CalendarDays,
  RefreshCw,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

const STORAGE_KEYS = [
  "ward_complaints",
  "complaints",
  "ward-complaints",
  "wardComplaints",
];

function readComplaints() {
  for (const key of STORAGE_KEYS) {
    try {
      const data = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(data) && data.length > 0) {
        return { data, key };
      }
    } catch {
      // Invalid storage data
    }
  }

  return { data: [], key: STORAGE_KEYS[0] };
}

const getName = (c) =>
  c.name || c.fullName || c.citizenName || c.userName || "Unknown Citizen";

const getPhone = (c) =>
  c.phone || c.mobile || c.mobileNumber || c.contact || "Not provided";

const getCategory = (c) =>
  c.category || c.subject || c.type || "General";

const getDescription = (c) =>
  c.description || c.message || c.complaint || c.details || "No description provided.";

const getAddress = (c) =>
  c.address || c.location || c.area || c.ward || "Not provided";

const getDate = (c) => {
  const value = c.createdAt || c.date || c.submittedAt || c.timestamp;
  if (!value) return "N/A";

  const date = new Date(value);
  if (isNaN(date.getTime())) return String(value);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const getStatus = (c) => {
  const status = (c.status || c.state || "Pending").toLowerCase();

  if (status.includes("resolved") || status.includes("completed"))
    return "Resolved";

  if (status.includes("progress"))
    return "In Progress";

  return "Pending";
};

const statusStyles = {
  Pending: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "In Progress": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Resolved: "bg-green-500/10 text-green-400 border-green-500/20",
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusStyles[status]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          status === "Pending"
            ? "bg-orange-400"
            : status === "In Progress"
            ? "bg-blue-400"
            : "bg-green-400"
        }`}
      />
      {status}
    </span>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, accent }) {
  return (
    <div className="relative overflow-hidden bg-[#211b1a] border border-[#382d28] rounded-2xl p-5 hover:border-[#FF6D29]/40 transition-all duration-300">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-[#BABABA] font-medium">{title}</p>
          <h2 className="text-3xl font-bold text-white mt-3">{value}</h2>
          <p className="text-xs text-[#88817c] mt-2">{subtitle}</p>
        </div>

        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center ${accent}`}
        >
          <Icon size={21} />
        </div>
      </div>

      <div className="absolute -right-8 -bottom-8 w-24 h-24 rounded-full bg-[#FF6D29]/5 blur-2xl" />
    </div>
  );
}

export default function AdminComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [storageKey, setStorageKey] = useState(STORAGE_KEYS[0]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selected, setSelected] = useState(null);

  const loadComplaints = () => {
    const result = readComplaints();
    setComplaints(result.data);
    setStorageKey(result.key);
  };

  useEffect(() => {
    loadComplaints();

    const handleStorage = () => loadComplaints();
    window.addEventListener("storage", handleStorage);

    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const updateStatus = (id, newStatus) => {
    const updated = complaints.map((c) =>
      c.id === id || c._id === id
        ? { ...c, status: newStatus }
        : c
    );

    setComplaints(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));

    if (selected) {
      setSelected({ ...selected, status: newStatus });
    }
  };

  const deleteComplaint = (complaint) => {
    if (!window.confirm("Are you sure you want to delete this complaint?"))
      return;

    const id = complaint.id || complaint._id;

    const updated = complaints.filter(
      (c) => c.id !== id && c._id !== id
    );

    setComplaints(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
    setSelected(null);
  };

  const total = complaints.length;
  const pending = complaints.filter((c) => getStatus(c) === "Pending").length;
  const progress = complaints.filter(
    (c) => getStatus(c) === "In Progress"
  ).length;
  const resolved = complaints.filter(
    (c) => getStatus(c) === "Resolved"
  ).length;

  const filteredComplaints = complaints.filter((c) => {
    const text = [
      getName(c),
      getPhone(c),
      getCategory(c),
      getDescription(c),
      getAddress(c),
    ]
      .join(" ")
      .toLowerCase();

    const matchesSearch = text.includes(search.toLowerCase());
    const matchesStatus =
      filterStatus === "All" || getStatus(c) === filterStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="min-h-full bg-[#161316] text-white p-4 md:p-7 lg:p-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#FF6D29] text-xs font-bold uppercase tracking-[2px] mb-2">
            Ward Management System
          </p>

          <h1 className="text-2xl md:text-3xl font-bold text-white">
            Complaints Management
          </h1>

          <p className="text-[#99918d] text-sm mt-2">
            Manage, track and resolve citizen complaints.
          </p>
        </div>

        <button
          onClick={loadComplaints}
          className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#382d28] bg-[#211b1a] text-[#d7d0cb] hover:border-[#FF6D29]/50 hover:text-white transition w-fit"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          title="Total Complaints"
          value={total}
          subtitle="All submitted complaints"
          icon={MessageSquare}
          accent="bg-orange-500/10 text-[#FF6D29]"
        />

        <StatCard
          title="Pending"
          value={pending}
          subtitle="Awaiting action"
          icon={Clock}
          accent="bg-yellow-500/10 text-yellow-400"
        />

        <StatCard
          title="In Progress"
          value={progress}
          subtitle="Currently being handled"
          icon={AlertCircle}
          accent="bg-blue-500/10 text-blue-400"
        />

        <StatCard
          title="Resolved"
          value={resolved}
          subtitle="Successfully completed"
          icon={CheckCircle2}
          accent="bg-green-500/10 text-green-400"
        />
      </div>

      {/* Main Panel */}
      <div className="bg-[#211b1a] border border-[#382d28] rounded-2xl overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 md:p-5 border-b border-[#382d28] flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">All Complaints</h2>
            <p className="text-xs text-[#89817c] mt-1">
              {filteredComplaints.length} records found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#827a75]"
              />

              <input
                type="text"
                placeholder="Search complaints..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:w-64 bg-[#161316] border border-[#382d28] rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder:text-[#756d68] outline-none focus:border-[#FF6D29] transition"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#161316] border border-[#382d28] rounded-xl px-4 py-3 text-sm text-[#d7d0cb] outline-none focus:border-[#FF6D29]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] text-left">
            <thead className="bg-[#191514]">
              <tr>
                {["Citizen", "Category", "Date", "Status", "Action"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-4 text-[11px] uppercase tracking-wider text-[#89817c] font-bold"
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-[#382d28]">
              {filteredComplaints.map((complaint, index) => (
                <tr
                  key={complaint.id || complaint._id || index}
                  className="hover:bg-[#2a211e]/60 transition"
                >
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white text-sm">
                      {getName(complaint)}
                    </div>
                    <div className="text-xs text-[#8c827c] mt-1">
                      {getPhone(complaint)}
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <span className="text-sm text-[#d2c8c2]">
                      {getCategory(complaint)}
                    </span>
                  </td>

                  <td className="px-5 py-4 text-sm text-[#99918d]">
                    {getDate(complaint)}
                  </td>

                  <td className="px-5 py-4">
                    <StatusBadge status={getStatus(complaint)} />
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelected(complaint)}
                        className="p-2 rounded-lg bg-[#FF6D29]/10 text-[#FF6D29] hover:bg-[#FF6D29] hover:text-white transition"
                        title="View complaint"
                      >
                        <Eye size={17} />
                      </button>

                      <button
                        onClick={() => deleteComplaint(complaint)}
                        className="p-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition"
                        title="Delete complaint"
                      >
                        <Trash2 size={17} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Empty state */}
          {filteredComplaints.length === 0 && (
            <div className="py-16 text-center">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#FF6D29]/10 flex items-center justify-center mb-4">
                <MessageSquare size={26} className="text-[#FF6D29]" />
              </div>

              <h3 className="text-white font-bold text-lg">
                No complaints found
              </h3>

              <p className="text-[#89817c] text-sm mt-2">
                Complaints will appear here when citizens submit them.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#382d28] flex items-center justify-between">
          <p className="text-xs text-[#89817c]">
            Showing {filteredComplaints.length} of {total} complaints
          </p>
          <span className="text-xs text-[#FF6D29] font-semibold">
            Ward No. 2
          </span>
        </div>
      </div>

      {/* Complaint Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#211b1a] border border-[#49362c] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#211b1a] border-b border-[#382d28] p-5 flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[1.5px] text-[#FF6D29] font-bold">
                  Complaint Details
                </p>
                <h2 className="text-xl font-bold text-white mt-2">
                  {getCategory(selected)}
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-lg bg-[#161316] border border-[#382d28] text-gray-400 hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                  <p className="text-xs text-[#89817c] mb-2">Citizen Name</p>
                  <p className="text-white font-semibold">{getName(selected)}</p>
                </div>

                <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                  <p className="text-xs text-[#89817c] mb-2">Phone Number</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <Phone size={15} className="text-[#FF6D29]" />
                    {getPhone(selected)}
                  </p>
                </div>

                <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                  <p className="text-xs text-[#89817c] mb-2">Submitted Date</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <CalendarDays size={15} className="text-[#FF6D29]" />
                    {getDate(selected)}
                  </p>
                </div>

                <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                  <p className="text-xs text-[#89817c] mb-2">Location</p>
                  <p className="text-white font-semibold flex items-center gap-2">
                    <MapPin size={15} className="text-[#FF6D29]" />
                    {getAddress(selected)}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                <p className="text-xs text-[#89817c] mb-3">Complaint Description</p>
                <p className="text-sm text-[#d5ccc6] leading-7 whitespace-pre-wrap">
                  {getDescription(selected)}
                </p>
              </div>

              {/* Status Update */}
              <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                <label className="text-xs text-[#89817c] mb-3 block">
                  Update Complaint Status
                </label>

                <select
                  value={getStatus(selected)}
                  onChange={(e) =>
                    updateStatus(selected.id || selected._id, e.target.value)
                  }
                  className="w-full bg-[#211b1a] border border-[#49362c] rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D29]"
                >
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>

              <button
                onClick={() => deleteComplaint(selected)}
                className="w-full flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl py-3 hover:bg-red-500 hover:text-white transition font-semibold"
              >
                <Trash2 size={16} />
                Delete Complaint
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
