
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  Camera,
  Landmark,
  FileText,
  FolderOpen,
  Users,
  ShieldCheck,
  Phone,
  MessageSquare,
  Info,
} from "lucide-react";

const boothMembers = [1, 2, 3, 4, 5, 6];

function PhotoPlaceholder({ className = "" }) {
  return (
    <div
      className={`flex items-center justify-center rounded-2xl border border-[#FF6D29]/20 bg-gradient-to-br from-[#453027] to-[#201C20] text-[#FF6D29] ${className}`}
    >
      <Camera size={28} strokeWidth={1.5} />
    </div>
  );
}

function DocumentCard({ icon: Icon, title, description }) {
  return (
    <div className="group rounded-xl border border-white/[0.06] bg-[#161316] p-4 transition duration-300 hover:border-[#FF6D29]/30">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-[#FF6D29]/10 text-[#FF6D29] transition group-hover:bg-[#FF6D29] group-hover:text-[#161316]">
        <Icon size={18} />
      </div>

      <h4 className="text-xs font-bold leading-5 text-white">{title}</h4>

      <p className="mt-1 text-[10px] leading-4 text-[#BABABA]">
        {description}
      </p>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden px-5 pb-16 pt-28 md:px-12 md:pb-20 md:pt-32 lg:px-20"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-[#FF6D29]/[0.05] blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-40 h-96 w-96 rounded-full bg-[#FF6D29]/[0.04] blur-[120px]" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">

        {/* LEFT COLUMN */}
        <div className="flex flex-col gap-6">

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-2">
              <span className="h-[2px] w-8 bg-[#FF6D29]" />
              <p className="text-[10px] font-extrabold tracking-[3px] text-[#FF6D29]">
                VIKSIT WARD · SAMRIDDH BAREILLY
              </p>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-5xl xl:text-6xl">
              WARD NO.
              <span className="text-[#FF6D29]"> 02</span>
              <br />
              BAREILLY.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-[#BABABA] sm:text-base">
              Viksit Ward, Viksit Bharat. A step towards a cleaner,
              better-connected and progressive community.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 gap-3"
          >
            <a
              href="#complaint"
              className="flex items-center justify-between gap-2 rounded-xl bg-[#FF6D29] p-4 text-[#161316] transition hover:bg-[#F6D2BD]"
            >
              <div>
                <p className="text-xs font-extrabold">Register Complaint</p>
                <p className="mt-1 text-[10px] opacity-70">Report an issue</p>
              </div>
              <MessageSquare size={18} />
            </a>

            <a
              href="#tracking"
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#201C20] p-4 text-white transition hover:border-[#FF6D29]/40"
            >
              <div>
                <p className="text-xs font-extrabold">Track Issue</p>
                <p className="mt-1 text-[10px] text-[#BABABA]">Complaint status</p>
              </div>
              <ArrowUpRight size={18} className="text-[#FF6D29]" />
            </a>

            <a
              href="#services"
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#201C20] p-4 text-white transition hover:border-[#FF6D29]/40"
            >
              <div>
                <p className="text-xs font-extrabold">Ward Services</p>
                <p className="mt-1 text-[10px] text-[#BABABA]">Public facilities</p>
              </div>
              <Landmark size={18} className="text-[#FF6D29]" />
            </a>

            <a
              href="#contact"
              className="flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#201C20] p-4 text-white transition hover:border-[#FF6D29]/40"
            >
              <div>
                <p className="text-xs font-extrabold">Contact</p>
                <p className="mt-1 text-[10px] text-[#BABABA]">Get in touch</p>
              </div>
              <Phone size={18} className="text-[#FF6D29]" />
            </a>
          </motion.div>

          {/* DOCUMENT CENTRE – Replaces Ward Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-2xl border border-white/[0.07] bg-[#201C20] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-extrabold tracking-[3px] text-[#FF6D29]">
                  PUBLIC DOCUMENTS
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-white">
                  Document Centre
                </h2>
                <p className="mt-1 text-xs leading-5 text-[#BABABA]">
                  Ward-related documents and public information.
                </p>
              </div>

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FF6D29]/10 text-[#FF6D29]">
                <FolderOpen size={22} />
              </div>
            </div>

            {/* Document categories */}
            <div className="grid grid-cols-2 gap-3">
              <DocumentCard
                icon={FileText}
                title="Development Reports"
                description="Development works & reports"
              />

              <DocumentCard
                icon={Info}
                title="Public Notices"
                description="Important notices & updates"
              />

              <DocumentCard
                icon={MapPin}
                title="Ward Map"
                description="Ward area information"
              />

              <DocumentCard
                icon={ShieldCheck}
                title="Govt. Schemes"
                description="Public welfare information"
              />
            </div>

            {/* View all button */}
            <a
              href="#documents"
              className="mt-5 flex items-center justify-between rounded-xl bg-[#FF6D29] px-4 py-3 text-xs font-extrabold text-[#161316] transition hover:bg-[#F6D2BD]"
            >
              View All Documents
              <ArrowUpRight size={17} />
            </a>
          </motion.div>

          {/* Location */}
          <div className="flex items-center gap-2 text-xs text-[#BABABA]">
            <MapPin size={15} className="text-[#FF6D29]" />
            Ward No. 2, Bareilly, Uttar Pradesh
          </div>
        </div>

        {/* RIGHT COLUMN - LEADERSHIP */}
        <div className="flex flex-col gap-5">

          {/* Ward Councillor */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="rounded-2xl border border-[#FF6D29]/20 bg-[#201C20] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="h-[2px] w-7 bg-[#FF6D29]" />
              <p className="text-[10px] font-extrabold tracking-[2.5px] text-[#FF6D29]">
                WARD LEADERSHIP
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <PhotoPlaceholder className="h-48 w-full sm:h-52 sm:w-40" />

              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  Parshad Name
                </h2>

                <p className="mt-2 text-sm text-[#BABABA]">
                  Ward Councillor · Ward No. 2
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs text-[#BABABA]">
                  <MapPin size={14} className="text-[#FF6D29]" />
                  Bareilly, Uttar Pradesh
                </div>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FF6D29]/10 px-3 py-2 text-[10px] font-bold text-[#FF6D29]">
                  <Landmark size={13} />
                  WARD REPRESENTATIVE
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shakti Kendra Sanyojak */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="rounded-2xl border border-[#FF6D29]/20 bg-[#201C20] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center gap-2">
              <span className="h-[2px] w-7 bg-[#FF6D29]" />
              <p className="text-[10px] font-extrabold tracking-[2.5px] text-[#FF6D29]">
                SHAKTI KENDRA SAHYOJAK
              </p>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <PhotoPlaceholder className="h-44 w-full sm:h-44 sm:w-36" />

              <div>
                <h2 className="text-xl font-extrabold text-white">
                  Sanyojak Name
                </h2>

                <p className="mt-2 text-sm text-[#BABABA]">
                  Ward No. 2 · Bareilly
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FF6D29]/10 px-3 py-2 text-[10px] font-bold text-[#FF6D29]">
                  <ShieldCheck size={13} />
                  WARD LEADERSHIP
                </div>
              </div>
            </div>
          </motion.div>

          {/* Booth Team */}
          <motion.div
            initial={{ opacity: 0, x: 25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="rounded-2xl border border-white/[0.07] bg-[#201C20] p-5 sm:p-6"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-extrabold tracking-[2.5px] text-white">
                  WARD NO. 2 — BOOTH TEAM
                </p>
                <p className="mt-1 text-xs text-[#BABABA]">
                  Six Booth Adhyakhs
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6D29]/10 text-[#FF6D29]">
                <Users size={20} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {boothMembers.map((booth) => (
                <div
                  key={booth}
                  className="rounded-xl border border-white/[0.05] bg-[#161316] p-3 text-center transition hover:border-[#FF6D29]/25"
                >
                  <PhotoPlaceholder className="mb-3 h-24 w-full rounded-lg" />

                  <p className="text-[10px] font-extrabold text-white">
                    Booth Adhyaksh
                  </p>

                  <p className="mt-1 text-[10px] text-[#FF6D29]">
                    Booth {booth}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
