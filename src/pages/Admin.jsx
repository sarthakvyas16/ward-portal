import { useState } from "react";
import {
  LayoutDashboard,
  Construction,
  Lightbulb,
  MessageSquare,
  Newspaper,
  Image,
  Settings,
  Menu,
  X,
  ArrowUpRight,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";

import AdminDevelopment from "./AdminDevelopment";
import AdminComplaints from "./AdminComplaints";
import AdminNews from "./AdminNews";
import AdminWardTeam from "./AdminWardTeam";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Development", icon: Construction },
    { name: "Complaints", icon: MessageSquare },
    { name: "Ward Team", icon: Users },
    { name: "Media Gallery", icon: Image },
    { name: "Settings", icon: Settings },
  ];

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      icon: Construction,
      color: "#FF6D29",
    },
    {
      title: "Complaints",
      value: "24",
      icon: MessageSquare,
      color: "#E8A15B",
    },
    {
      title: "Completed Works",
      value: "08",
      icon: CheckCircle2,
      color: "#66C59A",
    },
    {
      title: "Ward Members",
      value: "—",
      icon: Users,
      color: "#A78BFA",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F3F1] text-[#161316] flex">

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-[270px] bg-[#161316] text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="h-[90px] px-7 flex items-center justify-between border-b border-white/10">
          <div>
            <h1 className="text-xl font-extrabold tracking-wide">
              WARD<span className="text-[#FF6D29]">.02</span>
            </h1>

            <p className="text-[10px] text-white/45 tracking-[3px] mt-1">
              ADMINISTRATION
            </p>
          </div>

          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/70"
          >
            <X size={22} />
          </button>
        </div>

        {/* Menu Label */}
        <div className="px-6 pt-8 pb-3 text-[10px] tracking-[2px] text-white/35">
          MAIN MENU
        </div>

        {/* Navigation */}
        <nav className="px-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.name;

            return (
              <button
                key={item.name}
                onClick={() => {
                  setActiveTab(item.name);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? "bg-[#FF6D29] text-white shadow-lg shadow-orange-900/20"
                    : "text-white/55 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span className="font-semibold">{item.name}</span>
              </button>
            );
          })}
        </nav>

        {/* Sidebar Bottom */}
        <div className="mt-auto p-5">
          <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
            <p className="text-xs font-bold text-white">
              Ward No. 02
            </p>

            <p className="text-[11px] text-white/40 mt-1">
              Bareilly, Uttar Pradesh
            </p>

            <div className="flex items-center gap-2 mt-3 text-[10px] text-green-400">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
              Admin workspace
            </div>
          </div>
        </div>
      </aside>

      {/* Main Area */}
      <div className="flex-1 min-w-0">

        {/* Top Navbar */}
        <header className="h-[80px] bg-white border-b border-[#EAE6E2] flex items-center justify-between px-5 md:px-9 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>

            <div>
              <p className="text-xs text-gray-400">
                Ward Portal / Admin
              </p>

              <h2 className="font-extrabold text-lg md:text-xl mt-1">
                {activeTab}
              </h2>
            </div>
          </div>

          {/* Administrator */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-xs font-bold">Administrator</p>
              <p className="text-[10px] text-gray-400 mt-1">
                Ward Management
              </p>
            </div>

            <div className="w-10 h-10 rounded-xl bg-[#453027] text-white flex items-center justify-center font-extrabold text-sm">
              A
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-5 md:p-9 max-w-[1500px] mx-auto">


 {activeTab === "Ward Team" ? (
  <AdminWardTeam />
) : activeTab === "Development" ? (
  <AdminDevelopment />

  /* COMPLAINTS SECTION */
) : activeTab === "Complaints" ? (
  <AdminComplaints />

  /* NEWS SECTION */
) : activeTab === "News & Updates" ? (
  <AdminNews />

  /* DASHBOARD SECTION */
) : activeTab === "Dashboard" ? (
            <>
              {/* Dashboard Heading */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold">
                    Welcome to Admin Panel
                  </h1>

                  <p className="text-sm text-gray-500 mt-2">
                    Manage ward development and public services.
                  </p>
                </div>

                <div className="bg-white px-4 py-3 rounded-xl border border-[#EAE6E2] text-xs font-semibold text-gray-500">
                  <Clock size={14} className="inline mr-2" />
                  Management Dashboard
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
                {stats.map((stat) => {
                  const Icon = stat.icon;

                  return (
                    <div
                      key={stat.title}
                      className="bg-white rounded-2xl p-5 md:p-6 border border-[#EAE6E2] hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center"
                          style={{
                            backgroundColor: `${stat.color}15`,
                          }}
                        >
                          <Icon
                            size={21}
                            style={{ color: stat.color }}
                          />
                        </div>

                        <ArrowUpRight
                          size={17}
                          className="text-gray-300"
                        />
                      </div>

                      <p className="text-sm text-gray-500 mt-5">
                        {stat.title}
                      </p>

                      <h3 className="text-3xl font-extrabold mt-1">
                        {stat.value}
                      </h3>
                    </div>
                  );
                })}
              </div>

              {/* Quick Management */}
              <div className="bg-white border border-[#EAE6E2] rounded-2xl p-5 md:p-7">
                <h3 className="text-lg font-extrabold">
                  Quick Management
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Select a section to manage website content.
                </p>

                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
                  {menuItems.slice(1, 5).map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.name}
                        onClick={() => setActiveTab(item.name)}
                        className="text-left border border-[#EAE6E2] rounded-xl p-5 hover:border-[#FF6D29] hover:bg-orange-50/40 transition-all group"
                      >
                        <Icon size={22} className="text-[#FF6D29]" />

                        <h4 className="font-bold mt-4">
                          {item.name}
                        </h4>

                        <p className="text-xs text-gray-400 mt-2">
                          Open and manage {item.name.toLowerCase()}
                        </p>

                        <ArrowUpRight
                          size={17}
                          className="ml-auto mt-3 text-gray-300 group-hover:text-[#FF6D29]"
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Admin Workspace */}
              <div className="mt-6 bg-white border border-[#EAE6E2] rounded-2xl p-5 md:p-7">
                <h3 className="font-extrabold text-lg">
                  Admin Workspace
                </h3>

                <div className="mt-5 rounded-xl bg-[#F8F6F4] p-5 flex gap-3 items-start">
                  <div className="bg-[#FF6D29]/10 p-2 rounded-lg">
                    <LayoutDashboard
                      size={18}
                      className="text-[#FF6D29]"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Workspace is ready
                    </p>

                    <p className="text-xs text-gray-500 mt-1 leading-5">
                      Your ward website management dashboard is set up.
                      Management features will be added section by section.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Other Sections Placeholder */
            <div className="bg-white border border-[#EAE6E2] rounded-2xl p-10 md:p-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto">
                <Lightbulb size={25} className="text-[#FF6D29]" />
              </div>

              <h2 className="text-2xl font-extrabold mt-5">
                {activeTab}
              </h2>

              <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
                This management section is ready for development.
                We'll add its features next.
              </p>

              <button
                onClick={() => setActiveTab("Dashboard")}
                className="mt-6 bg-[#FF6D29] text-white px-5 py-3 rounded-xl text-sm font-bold hover:bg-[#e95c1c] transition"
              >
                Back to Dashboard
              </button>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}