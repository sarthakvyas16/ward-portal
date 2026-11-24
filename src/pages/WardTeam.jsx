
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Crown,
  Shield,
  UserRound,
  Phone,
  ArrowUpRight,
  X,
  Search,
  ChevronRight,
  Landmark,
} from "lucide-react";

const STORAGE_KEY = "ward_team_structure_v2";

const leadershipRoles = [
  { id: "sahyojak", title: "Shakti Kendra Sahyojak", icon: Shield },
  { id: "pravasi", title: "Booth Pravasi", icon: Users },
  { id: "prabhari", title: "Booth Prabhari", icon: UserRound },
];

const readTeamData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.error("Ward team read error:", error);
  }

  return {
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
};

function Photo({ src, name, className = "" }) {
  return (
    <div
      className={`flex items-center justify-center overflow-hidden bg-[#453027] ${className}`}
    >
      {src ? (
        <img
          src={src}
          alt={name || "Ward team member"}
          className="h-full w-full object-cover object-top"
        />
      ) : (
        <UserRound className="text-white/25" size={48} />
      )}
    </div>
  );
}

function PhoneLink({ phone }) {
  if (!phone) return null;

  return (
    <a
      href={`tel:${phone}`}
      onClick={(e) => e.stopPropagation()}
      className="inline-flex items-center gap-2 text-sm text-[#BABABA] transition hover:text-[#FF6D29]"
    >
      <Phone size={15} />
      {phone}
    </a>
  );
}

function MemberCard({ member, compact = false }) {
  if (!member) return null;

  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#211C1D] transition hover:border-[#FF6D29]/40">
      <Photo
        src={member.photo}
        name={member.name}
        className={compact ? "h-56 w-full" : "h-72 w-full"}
      />

      <div className="p-5">
        <p className="text-xs font-bold uppercase tracking-wider text-[#FF6D29]">
          {member.designation || "Ward Team Member"}
        </p>

        <h3 className="mt-2 text-xl font-bold text-white">
          {member.name || "Name not added"}
        </h3>

        {member.phone && (
          <div className="mt-3">
            <PhoneLink phone={member.phone} />
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileModal({ member, title, onClose }) {
  if (!member) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 25, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#211C1D]"
        >
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
            <div>
              <p className="text-xs uppercase tracking-[2px] text-[#FF6D29]">
                Ward Team Profile
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">{title}</h2>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#BABABA] hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-[220px_1fr]">
              <Photo
                src={member.photo}
                name={member.name}
                className="h-72 w-full rounded-2xl sm:h-64"
              />

              <div>
                <p className="text-sm font-bold text-[#FF6D29]">
                  {member.designation}
                </p>
                <h3 className="mt-2 text-2xl font-black text-white">
                  {member.name}
                </h3>

                {member.phone && (
                  <div className="mt-4">
                    <PhoneLink phone={member.phone} />
                  </div>
                )}

                {member.description && (
                  <div className="mt-6">
                    <h4 className="text-sm font-bold text-white">About</h4>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-7 text-[#BABABA]">
                      {member.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function BoothModal({ booth, onClose }) {
  if (!booth) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-sm sm:p-5"
      >
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="my-auto w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-[#161316]"
        >
          {/* Modal header */}
          <div className="flex items-center justify-between border-b border-white/10 bg-[#211C1D] p-5 sm:p-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
                Ward No. 2
              </p>
              <h2 className="mt-1 text-2xl font-black text-white">
                Booth {booth.id} Team
              </h2>
              <p className="mt-1 text-sm text-[#BABABA]">
                Booth Adhyaksh & Booth Samiti
              </p>
            </div>

            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#BABABA] hover:text-white"
            >
              <X size={19} />
            </button>
          </div>

          <div className="max-h-[80vh] overflow-y-auto p-5 sm:p-7">
            {/* Booth Adhyaksh */}
            <div className="mb-8">
              <div className="mb-4 flex items-center gap-2">
                <Crown className="text-[#FF6D29]" size={19} />
                <h3 className="text-lg font-bold text-white">Booth Adhyaksh</h3>
              </div>

              {booth.chairman ? (
                <div className="max-w-md">
                  <MemberCard member={booth.chairman} />
                </div>
              ) : (
                <p className="rounded-xl border border-dashed border-white/10 p-6 text-sm text-[#777]">
                  Booth Adhyaksh profile abhi add nahi ki gayi.
                </p>
              )}
            </div>

            {/* Committee */}
            <div>
              <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h3 className="text-lg font-bold text-white">
                  Booth Samiti Members
                </h3>
                <p className="text-sm text-[#BABABA]">
                  {booth.committee?.length || 0} / 11 Members
                </p>
              </div>

              {booth.committee?.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {booth.committee.map((member) => (
                    <MemberCard key={member.id} member={member} compact />
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 py-12 text-center text-sm text-[#777]">
                  Samiti members abhi add nahi kiye gaye.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function WardTeam() {
  const [data, setData] = useState(readTeamData);
  const [activeBooth, setActiveBooth] = useState(null);
  const [profile, setProfile] = useState(null);
  const [search, setSearch] = useState("");

  // Admin updates are reflected after page refresh.
  useEffect(() => {
    const syncData = () => setData(readTeamData());

    window.addEventListener("storage", syncData);
    window.addEventListener("focus", syncData);

    return () => {
      window.removeEventListener("storage", syncData);
      window.removeEventListener("focus", syncData);
    };
  }, []);

  const parshad = data.leaders?.parshad;
  const sahyojak = data.leaders?.sahyojak;
  const pravasi = data.leaders?.pravasi;
  const prabhari = data.leaders?.prabhari;
  const booths = data.booths || [];
  const others = data.others || [];

  const totalMembers =
    Object.values(data.leaders || {}).filter(Boolean).length +
    booths.reduce(
      (sum, booth) =>
        sum + (booth.chairman ? 1 : 0) + (booth.committee?.length || 0),
      0
    ) +
    others.length;

  const matchingOthers = others.filter((member) =>
    `${member.name} ${member.designation}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#161316] text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/[0.06] px-5 py-20 sm:py-24 lg:py-28">
        <div className="absolute inset-0 bg-gradient-to-br from-[#453027]/80 via-[#161316] to-[#161316]" />
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#FF6D29]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FF6D29]/20 bg-[#FF6D29]/5 px-4 py-2">
              <Landmark size={14} className="text-[#FF6D29]" />
              <span className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
                Ward No. 2 · Jatav Pura
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight sm:text-5xl lg:text-7xl">
              Our Ward.
              <br />
              <span className="text-[#FF6D29]">Our Team.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-7 text-[#BABABA] sm:text-base sm:leading-8">
              Meet the people serving our ward, connecting our community,
              and working together for local development.
            </p>
          </motion.div>

          <div className="mt-10 grid max-w-xl grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs text-[#BABABA]">Team Members</p>
              <p className="mt-2 text-3xl font-black">{totalMembers}</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <p className="text-xs text-[#BABABA]">Booths</p>
              <p className="mt-2 text-3xl font-black">{booths.length}</p>
            </div>
          </div>
        </div>
      </section>

      {/* PARSHAD FEATURE */}
      {parshad && (
        <section className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20">
          <div className="mb-6 flex items-center gap-3">
            <Crown className="text-[#FF6D29]" size={21} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
                Ward Leadership
              </p>
              <h2 className="mt-1 text-2xl font-black">Parshad</h2>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid overflow-hidden rounded-3xl border border-[#FF6D29]/20 bg-[#211C1D] md:grid-cols-2"
          >
            <Photo
              src={parshad.photo}
              name={parshad.name}
              className="h-[360px] w-full sm:h-[460px]"
            />

            <div className="flex flex-col justify-center p-6 sm:p-10 lg:p-14">
              <p className="text-xs font-bold uppercase tracking-[3px] text-[#FF6D29]">
                Ward Representative
              </p>
              <h3 className="mt-3 text-3xl font-black sm:text-4xl">
                {parshad.name}
              </h3>
              <p className="mt-3 text-[#BABABA]">
                {parshad.designation || "Parshad · Ward No. 2"}
              </p>

              {parshad.phone && (
                <div className="mt-5">
                  <PhoneLink phone={parshad.phone} />
                </div>
              )}

              {parshad.description && (
                <p className="mt-6 line-clamp-5 text-sm leading-7 text-[#BABABA]">
                  {parshad.description}
                </p>
              )}

              <button
                onClick={() =>
                  setProfile({ member: parshad, title: "Parshad Profile" })
                }
                className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[#FF6D29] px-5 py-3 text-sm font-bold text-[#161316] transition hover:bg-[#ff854c]"
              >
                More About <ArrowUpRight size={17} />
              </button>
            </div>
          </motion.div>
        </section>
      )}

      {/* SHAKTI KENDRA SAHYOJAK */}
      {sahyojak && (
        <section className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20">
          <div className="mb-6 flex items-center gap-3">
            <Shield className="text-[#FF6D29]" size={21} />
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
                Organization
              </p>
              <h2 className="mt-1 text-2xl font-black">
                Shakti Kendra Sahyojak
              </h2>
            </div>
          </div>

          <div className="grid overflow-hidden rounded-3xl border border-white/10 bg-[#211C1D] md:grid-cols-[0.85fr_1.15fr]">
            <Photo
              src={sahyojak.photo}
              name={sahyojak.name}
              className="h-80 w-full sm:h-[400px]"
            />

            <div className="flex flex-col justify-center p-6 sm:p-9">
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
                {sahyojak.designation || "Shakti Kendra Sahyojak"}
              </p>
              <h3 className="mt-2 text-2xl font-black sm:text-3xl">
                {sahyojak.name}
              </h3>

              {sahyojak.phone && (
                <div className="mt-4">
                  <PhoneLink phone={sahyojak.phone} />
                </div>
              )}

              {sahyojak.description && (
                <p className="mt-5 line-clamp-4 text-sm leading-7 text-[#BABABA]">
                  {sahyojak.description}
                </p>
              )}

              <button
                onClick={() =>
                  setProfile({
                    member: sahyojak,
                    title: "Shakti Kendra Sahyojak",
                  })
                }
                className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl border border-[#FF6D29]/40 bg-[#FF6D29]/10 px-5 py-3 text-sm font-bold text-[#FF6D29] transition hover:bg-[#FF6D29] hover:text-[#161316]"
              >
                More About <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* BOOTH PRAVASI & PRABHARI */}
      {(pravasi || prabhari) && (
        <section className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
              Booth Organization
            </p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              Booth Leadership
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {[
              { member: pravasi, title: "Booth Pravasi" },
              { member: prabhari, title: "Booth Prabhari" },
            ]
              .filter((item) => item.member)
              .map((item) => (
                <div
                  key={item.title}
                  className="grid overflow-hidden rounded-2xl border border-white/10 bg-[#211C1D] sm:grid-cols-[180px_1fr]"
                >
                  <Photo
                    src={item.member.photo}
                    name={item.member.name}
                    className="h-60 w-full sm:h-full sm:min-h-[220px]"
                  />

                  <div className="flex flex-col justify-center p-5">
                    <p className="text-xs font-bold uppercase tracking-wider text-[#FF6D29]">
                      {item.member.designation || item.title}
                    </p>
                    <h3 className="mt-2 text-xl font-bold">{item.member.name}</h3>

                    {item.member.phone && (
                      <div className="mt-3">
                        <PhoneLink phone={item.member.phone} />
                      </div>
                    )}

                    <button
                      onClick={() =>
                        setProfile({ member: item.member, title: item.title })
                      }
                      className="mt-5 flex w-fit items-center gap-2 text-sm font-bold text-[#FF6D29] hover:gap-3"
                    >
                      View Profile <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* BOOTH ADHYAKSH */}
      <section className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20">
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
              Ground Level Organization
            </p>
            <h2 className="mt-1 text-2xl font-black sm:text-3xl">
              Booth Adhyaksh
            </h2>
            <p className="mt-2 text-sm text-[#BABABA]">
              Explore booth-wise leadership and committee members.
            </p>
          </div>

          <p className="text-sm text-[#BABABA]">{booths.length} Booths</p>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {booths.map((booth, index) => (
            <motion.div
              key={booth.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="overflow-hidden rounded-2xl border border-white/10 bg-[#211C1D] transition hover:border-[#FF6D29]/40"
            >
              <div className="relative">
                <Photo
                  src={booth.chairman?.photo}
                  name={booth.chairman?.name}
                  className="h-72 w-full"
                />

                <div className="absolute left-4 top-4 rounded-lg bg-[#FF6D29] px-3 py-2 text-xs font-black text-[#161316]">
                  BOOTH {booth.id}
                </div>
              </div>

              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-[#FF6D29]">
                  Booth Adhyaksh
                </p>
                <h3 className="mt-2 text-xl font-bold">
                  {booth.chairman?.name || "Profile Not Added"}
                </h3>

                <p className="mt-1 text-sm text-[#BABABA]">
                  {booth.chairman?.designation || "Booth Adhyaksh"}
                </p>

                {booth.chairman?.phone && (
                  <div className="mt-3">
                    <PhoneLink phone={booth.chairman.phone} />
                  </div>
                )}

                <div className="my-5 flex items-center justify-between border-y border-white/[0.07] py-4">
                  <span className="text-sm text-[#BABABA]">Samiti Members</span>
                  <span className="rounded-full bg-[#453027] px-3 py-1.5 text-xs font-bold text-[#FF6D29]">
                    {booth.committee?.length || 0} / 11
                  </span>
                </div>

                <button
                  onClick={() => setActiveBooth(booth)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-bold text-white transition hover:bg-[#FF6D29] hover:text-[#161316]"
                >
                  View Booth Team <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* OTHER MEMBERS */}
      {others.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pt-14 sm:pt-20">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[2px] text-[#FF6D29]">
                Extended Team
              </p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                Other Members
              </h2>
              <p className="mt-2 text-sm text-[#BABABA]">
                Additional members and volunteers
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 sm:w-72">
              <Search size={16} className="text-[#BABABA]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#777]"
              />
            </div>
          </div>

          {matchingOthers.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {matchingOthers.map((member) => (
                <MemberCard key={member.id} member={member} compact />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-white/10 py-10 text-center text-sm text-[#777]">
              No matching members found.
            </div>
          )}
        </section>
      )}

      {/* Footer CTA */}
      <section className="mx-auto max-w-7xl px-5 pb-20 pt-16 sm:pt-24">
        <div className="rounded-3xl border border-[#FF6D29]/15 bg-gradient-to-br from-[#453027] to-[#211C1D] p-7 sm:p-12">
          <p className="text-xs font-bold uppercase tracking-[3px] text-[#FF6D29]">
            Together for Ward No. 2
          </p>
          <h2 className="mt-3 text-2xl font-black sm:text-4xl">
            Your Ward. Your Voice. Your Future.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-[#BABABA]">
            Our team is committed to staying connected with residents and working
            towards a better community.
          </p>
        </div>
      </section>

      {/* Modals */}
      {activeBooth && (
        <BoothModal booth={activeBooth} onClose={() => setActiveBooth(null)} />
      )}

      {profile && (
        <ProfileModal
          member={profile.member}
          title={profile.title}
          onClose={() => setProfile(null)}
        />
      )}
    </div>
  );
}
