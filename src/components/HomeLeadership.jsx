
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VisitorCounter from "./VisitorCounter";
import {
  Users,
  Phone,
  Crown,
  Shield,
  UserRound,
  MapPin,
  X,
  ArrowUpRight,
} from "lucide-react";

const STORAGE_KEY = "ward_team_structure_v2";

const emptyData = {
  leaders: {
    parshad: null,
    sahyojak: null,
    pravasi: null,
    prabhari: null,
  },
  booths: Array.from({ length: 6 }, (_, i) => ({
    id: i + 1,
    chairman: null,
    committee: [],
  })),
  others: [],
};

function getData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return emptyData;

    const parsed = JSON.parse(saved);

    return {
      ...emptyData,
      ...parsed,
      leaders: {
        ...emptyData.leaders,
        ...parsed.leaders,
      },
      booths: parsed.booths || emptyData.booths,
      others: parsed.others || [],
    };
  } catch {
    return emptyData;
  }
}

function ProfileCard({
  member,
  title,
  size = "medium",
  icon: Icon,
  onMore,
}) {
  const imageSizes = {
    large: "w-28 h-32 sm:w-32 sm:h-36",
    second: "w-24 h-28 sm:w-28 sm:h-32",
    medium: "w-20 h-24 sm:w-24 sm:h-28",
    small: "w-16 h-20 sm:w-20 sm:h-24",
  };

  const cardSizes = {
    large: "max-w-lg w-full",
    second: "max-w-md w-full",
    medium: "w-full",
    small: "w-full",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className={`${cardSizes[size]} bg-[#201B19] border border-[#453027] rounded-2xl p-3 sm:p-4 text-center hover:border-[#FF6D29]/60 transition-all`}
    >
      <div className="flex flex-col items-center">

        {/* Small Photo */}
        <div
          className={`${imageSizes[size]} rounded-xl overflow-hidden bg-[#302722] border border-[#453027] flex items-center justify-center mb-3`}
        >
          {member?.photo ? (
            <img
              src={member.photo}
              alt={member.name || title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Icon className="text-[#FF6D29]" size={30} />
          )}
        </div>

        <p className="text-[#FF6D29] text-[10px] sm:text-xs uppercase tracking-wider font-semibold mb-1">
          {title}
        </p>

        <h3 className="text-white font-bold text-sm sm:text-base leading-tight">
          {member?.name || "Name not added"}
        </h3>

        {member?.designation && member.designation !== title && (
          <p className="text-[#BABABA] text-xs mt-1">
            {member.designation}
          </p>
        )}

        {member?.phone && (
          <a
            href={`tel:${member.phone}`}
            className="inline-flex items-center gap-1.5 text-[#F6D2BD] text-xs mt-2 hover:text-[#FF6D29]"
          >
            <Phone size={13} />
            {member.phone}
          </a>
        )}

        {size !== "small" && member?.description && (
          <p className="text-[#BABABA] text-xs mt-2 leading-relaxed line-clamp-2">
            {member.description}
          </p>
        )}

        {/* More About - Sahyojak */}
        {onMore && (
          <button
            onClick={onMore}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#FF6D29] text-white text-xs font-semibold hover:bg-[#e85b1c] transition"
          >
            More About
            <ArrowUpRight size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function HomeLeadership() {
  const [data, setData] = useState(emptyData);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    setData(getData());

    const refresh = () => setData(getData());
    window.addEventListener("storage", refresh);

    return () => window.removeEventListener("storage", refresh);
  }, []);

  const leaders = data.leaders || {};
  const booths = data.booths || [];
  const sahyojak = leaders.sahyojak;

  return (
    <section
      id="leadership"
      className="px-4 pt-12 pb-16 sm:pt-16 sm:pb-20 bg-[#161316]"
    >
      <div className="max-w-7xl mx-auto">

{/* Ward Hero Section */}
<div className="grid grid-cols-1 md:grid-cols-[60%_40%] items-center gap-4 mb-14 px-2 sm:px-4">

  {/* LEFT - Ward Heading & Slogan (60%) */}
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.6 }}
    className="text-center md:text-left md:pr-6"
  >
    <p className="text-[#FF6D29] text-xs sm:text-sm font-bold tracking-[0.3em] uppercase mb-4">
      सेवा • समर्पण • विकास
    </p>

    <h1 className="text-white font-black leading-[1.05] tracking-tight">
      <span className="block text-4xl sm:text-5xl lg:text-6xl xl:text-7xl">
        WARD NO. 2
      </span>

      <span className="block text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-[#FF6D29] mt-2">
        JATAV PURA
      </span>
    </h1>

    <h2 className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-6">
      विकसित वार्ड, विकसित भारत।
    </h2>

    <p className="text-[#BABABA] text-sm sm:text-base max-w-xl mx-auto md:mx-0 mt-3 leading-relaxed">
      सेवा ही संकल्प, विकास ही लक्ष्य, जनकल्याण ही हमारा मार्ग।
    </p>

    <div className="w-16 h-1 bg-[#FF6D29] rounded-full mt-6 mx-auto md:mx-0" />
  </motion.div>

  {/* RIGHT - Modi Ji & Yogi Ji Image (40%) */}
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.7 }}
    className="flex justify-center md:justify-end items-center"
  >
    <img
      src="/modi-yogi.png"
      alt="Narendra Modi Ji and Yogi Adityanath Ji"
      className="w-full max-w-[280px] sm:max-w-[340px] lg:max-w-[420px] h-auto object-contain"
    />
  </motion.div>

</div>

        {/* Team Heading */}
        <div className="text-center mb-8">
          <p className="text-[#FF6D29] uppercase tracking-[0.25em] text-xs font-bold mb-2">
            Ward No. 2 · Jatav Pura
          </p>

          <h2 className="text-white text-2xl sm:text-4xl font-bold">
            Hamari <span className="text-[#FF6D29]">Team</span>
          </h2>

          <p className="text-[#BABABA] mt-3 text-sm max-w-xl mx-auto">
            वार्ड के विकास एवं जनसेवा हेतु समर्पित हमारे जनप्रतिनिधि।
          </p>
        </div>

        {/* Parshad */}
        <div className="flex justify-center mb-5">
          <ProfileCard
            member={leaders.parshad}
            title="Parshad"
            size="large"
            icon={Crown}
          />
        </div>

        {/* Shakti Kendra Sahyojak */}
        <div className="flex justify-center mb-8">
          <ProfileCard
            member={sahyojak}
            title="Shakti Kendra Sahyojak"
            size="second"
            icon={Shield}
            onMore={() => setShowAbout(true)}
          />
        </div>

        {/* Booth Prabhari + Booth Pravasi */}
        <div className="grid grid-cols-2 gap-3 sm:gap-5 max-w-2xl mx-auto mb-12">
          <ProfileCard
            member={leaders.prabhari}
            title="Booth Prabhari"
            size="medium"
            icon={Users}
          />

          <ProfileCard
            member={leaders.pravasi}
            title="Booth Pravasi"
            size="medium"
            icon={MapPin}
          />
        </div>

        {/* Booth Adhyaksh */}
        <div>
          <div className="text-center mb-6">
            <h3 className="text-white text-xl sm:text-3xl font-bold">
              Booth <span className="text-[#FF6D29]">Adhyaksh</span>
            </h3>

            <p className="text-[#BABABA] text-xs sm:text-sm mt-2">
              Hamare 6 booth ke pratinidhi
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {booths.map((booth, index) => (
              <ProfileCard
                key={booth.id || index}
                member={booth.chairman}
                title={`Booth ${booth.id || index + 1}`}
                size="small"
                icon={UserRound}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Visitor Counter */}
<VisitorCounter />

      {/* Sahyojak More About Modal */}
      <AnimatePresence>
        {showAbout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAbout(false)}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-[#201B19] border border-[#453027] rounded-2xl p-5 sm:p-7 relative"
            >
              <button
                onClick={() => setShowAbout(false)}
                className="absolute top-3 right-3 p-2 rounded-lg text-[#BABABA] hover:text-white hover:bg-[#382A23]"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-28 h-32 rounded-xl overflow-hidden bg-[#302722] border border-[#453027] flex items-center justify-center mb-4">
                  {sahyojak?.photo ? (
                    <img
                      src={sahyojak.photo}
                      alt={sahyojak?.name || "Shakti Kendra Sahyojak"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Shield size={38} className="text-[#FF6D29]" />
                  )}
                </div>

                <p className="text-[#FF6D29] text-xs uppercase tracking-widest font-bold">
                  Shakti Kendra Sahyojak
                </p>

                <h2 className="text-white text-xl sm:text-2xl font-bold mt-1">
                  {sahyojak?.name || "Name not added"}
                </h2>

                {sahyojak?.phone && (
                  <a
                    href={`tel:${sahyojak.phone}`}
                    className="text-[#F6D2BD] text-sm flex items-center gap-2 mt-3"
                  >
                    <Phone size={15} />
                    {sahyojak.phone}
                  </a>
                )}

                <div className="w-full h-px bg-[#453027] my-5" />

                <h3 className="text-white font-semibold text-left w-full mb-2">
                  About
                </h3>

                <p className="text-[#BABABA] text-sm leading-7 text-left whitespace-pre-wrap w-full">
                  {sahyojak?.description || "Description Admin panel se abhi add nahi ki gayi hai."}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
    </section>
  );
}
