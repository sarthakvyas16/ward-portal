
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  FileCheck,
  Clock3,
  Wrench,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

const demoComplaint = {
  id: "WARD-2026-001",
  title: "Street light repair request",
  category: "Street Lights",
  address: "Ward No. 2, Bareilly",
  status: "In Progress",
};

const steps = [
  { title: "Complaint Received", icon: FileCheck },
  { title: "Under Review", icon: Clock3 },
  { title: "Work In Progress", icon: Wrench },
  { title: "Resolved", icon: CheckCircle2 },
];

export default function ComplaintTracking() {
  const [complaintId, setComplaintId] = useState("");
  const [result, setResult] = useState(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);

    if (complaintId.trim().toUpperCase() === demoComplaint.id) {
      setResult(demoComplaint);
    } else {
      setResult(null);
    }
  };

  const currentStep = result
    ? result.status === "Resolved"
      ? 3
      : result.status === "In Progress"
        ? 2
        : result.status === "Under Review"
          ? 1
          : 0
    : -1;

  return (
    <section id="tracking" className="px-5 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <div className="mb-4 flex items-center justify-center gap-2 text-[#FF6D29]">
            <Search size={18} />
            <span className="text-xs font-bold tracking-[3px]">
              COMPLAINT TRACKER
            </span>
          </div>

          <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
            Track Your <span className="text-[#FF6D29]">Complaint.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[#BABABA] md:text-base">
            Apni complaint ka reference number enter karke uska
            current status check karein.
          </p>
        </div>

        {/* Search Card */}
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/[0.08] bg-[#201c20] p-6 md:p-10">
          <form onSubmit={handleSearch}>
            <label className="mb-3 block text-sm font-semibold">
              Complaint Reference ID
            </label>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]"
                />

                <input
                  value={complaintId}
                  onChange={(e) => {
                    setComplaintId(e.target.value);
                    setSearched(false);
                    setResult(null);
                  }}
                  placeholder="e.g. WARD-2026-001"
                  className="w-full rounded-2xl border border-white/10 bg-[#161316] py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-[#777] focus:border-[#FF6D29]"
                  required
                />
              </div>

              <button
                type="submit"
                className="flex items-center justify-center gap-2 rounded-2xl bg-[#FF6D29] px-7 py-4 font-bold text-[#161316] transition hover:bg-[#F6D2BD]"
              >
                Track Status
                <ArrowRight size={17} />
              </button>
            </div>
          </form>

          {/* Demo Hint */}
          <div className="mt-5 rounded-xl border border-[#FF6D29]/15 bg-[#FF6D29]/5 p-4">
            <p className="text-xs leading-6 text-[#BABABA]">
              Demo ID:{" "}
              <button
                type="button"
                onClick={() => {
                  setComplaintId(demoComplaint.id);
                  setResult(null);
                  setSearched(false);
                }}
                className="font-bold text-[#FF6D29] underline underline-offset-4"
              >
                WARD-2026-001
              </button>
            </p>
          </div>

          {/* Result */}
          {searched && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8"
            >
              {result ? (
                <div className="rounded-2xl border border-white/10 bg-[#161316] p-5 md:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="text-xs text-[#BABABA]">
                      Reference: {result.id}
                    </span>
                    <span className="rounded-full bg-[#FF6D29]/10 px-3 py-1.5 text-xs font-bold text-[#FF6D29]">
                      {result.status}
                    </span>
                  </div>

                  <h3 className="mt-5 text-xl font-bold">{result.title}</h3>
                  <p className="mt-2 text-sm text-[#BABABA]">
                    Category: {result.category}
                  </p>
                  <p className="mt-1 text-sm text-[#BABABA]">
                    Location: {result.address}
                  </p>

                  {/* Timeline */}
                  <div className="mt-8 space-y-0">
                    {steps.map((step, index) => {
                      const Icon = step.icon;
                      const completed = index <= currentStep;
                      const active = index === currentStep;

                      return (
                        <div key={step.title} className="flex gap-4">
                          <div className="flex flex-col items-center">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-full border ${
                                completed
                                  ? "border-[#FF6D29] bg-[#FF6D29] text-[#161316]"
                                  : "border-white/10 bg-[#201c20] text-[#777]"
                              }`}
                            >
                              <Icon size={17} />
                            </div>

                            {index !== steps.length - 1 && (
                              <div
                                className={`h-12 w-0.5 ${
                                  index < currentStep
                                    ? "bg-[#FF6D29]"
                                    : "bg-white/10"
                                }`}
                              />
                            )}
                          </div>

                          <div className="pt-2">
                            <p
                              className={`text-sm font-bold ${
                                completed ? "text-white" : "text-[#777]"
                              }`}
                            >
                              {step.title}
                            </p>

                            {active && (
                              <p className="mt-1 text-xs text-[#FF6D29]">
                                Current status
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5 text-sm text-[#BABABA]">
                  <p className="font-bold text-red-400">
                    Complaint not found
                  </p>
                  <p className="mt-2 leading-6">
                    Demo mein sirf WARD-2026-001 available hai.
                    Real complaint tracking database connect hone ke baad active hogi.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
