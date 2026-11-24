import { useEffect, useState } from "react";
import {
  Users,
  Crown,
  Shield,
  UserRound,
  Plus,
  Pencil,
  Trash2,
  Search,
  ImagePlus,
  Phone,
  Save,
  X,
  ChevronDown,
  LayoutGrid,
} from "lucide-react";

const STORAGE_KEY = "ward_team_structure_v2";
const OLD_STORAGE_KEY = "ward_team_members";

const emptyMember = {
  name: "",
  designation: "",
  phone: "",
  photo: "",
  description: "",
};

const createInitialData = () => ({
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
});

const leadershipRoles = [
  {
    id: "parshad",
    title: "Parshad",
    subtitle: "Ward elected representative",
    icon: Crown,
  },
  {
    id: "sahyojak",
    title: "Shakti Kendra Sahyojak",
    subtitle: "Shakti Kendra leadership",
    icon: Shield,
  },
  {
    id: "pravasi",
    title: "Booth Pravasi",
    subtitle: "Booth organization",
    icon: Users,
  },
  {
    id: "prabhari",
    title: "Booth Prabhari",
    subtitle: "Booth organization",
    icon: UserRound,
  },
];

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// Purane Admin Ward Team data ko naye format mein convert karta hai.
function migrateOldMembers(oldMembers) {
  const data = createInitialData();

  if (!Array.isArray(oldMembers)) return data;

  oldMembers.forEach((member) => {
    const section = member.section;
    const designation = (member.designation || "").toLowerCase();

    const cleanMember = {
      id: member.id || makeId(),
      name: member.name || "",
      designation: member.designation || "",
      phone: member.phone || "",
      photo: member.photo || "",
      description: member.description || "",
    };

    if (section === "parshad") {
      data.leaders.parshad ||= cleanMember;
    } else if (section === "sahyojak") {
      data.leaders.sahyojak ||= cleanMember;
    } else if (section === "ward") {
      if (designation.includes("pravasi")) {
        data.leaders.pravasi ||= cleanMember;
      } else if (designation.includes("prabhari")) {
        data.leaders.prabhari ||= cleanMember;
      } else {
        data.others.push(cleanMember);
      }
    } else if (section === "booths") {
      const boothNum = parseInt(member.boothNumber, 10);
      if (boothNum >= 1 && boothNum <= 6) {
        data.booths[boothNum - 1].chairman ||= cleanMember;
      } else {
        data.others.push(cleanMember);
      }
    } else if (section === "others") {
      data.others.push(cleanMember);
    } else {
      data.others.push(cleanMember);
    }
  });

  return data;
}

// Image ko compress karta hai taaki browser storage kam use ho.
function compressImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onerror = () => reject(new Error("Image read nahi ho paayi."));

    reader.onload = () => {
      const image = new Image();

      image.onerror = () => reject(new Error("Image load nahi ho paayi."));

      image.onload = () => {
        const maxSize = 850;
        const ratio = Math.min(
          maxSize / image.width,
          maxSize / image.height,
          1
        );

        const canvas = document.createElement("canvas");
        canvas.width = Math.round(image.width * ratio);
        canvas.height = Math.round(image.height * ratio);

        const ctx = canvas.getContext("2d");
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };

      image.src = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

function MemberPhoto({ photo, name, size = "h-20 w-20" }) {
  return (
    <div
      className={`${size} flex shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#453027]`}
    >
      {photo ? (
        <img
          src={photo}
          alt={name || "Member"}
          className="h-full w-full object-cover"
        />
      ) : (
        <UserRound className="text-white/30" size={30} />
      )}
    </div>
  );
}

export default function AdminWardTeam() {
  const [data, setData] = useState(createInitialData);
  const [loaded, setLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState("leadership");
  const [activeBooth, setActiveBooth] = useState(1);
  const [search, setSearch] = useState("");

  // Editor modal state
  const [editor, setEditor] = useState(null);
  const [draft, setDraft] = useState(emptyMember);
  const [photoLoading, setPhotoLoading] = useState(false);

  // Load data (new format first, old format migration second)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        setData(JSON.parse(saved));
      } else {
        const oldSaved = localStorage.getItem(OLD_STORAGE_KEY);

        if (oldSaved) {
          const migrated = migrateOldMembers(JSON.parse(oldSaved));
          setData(migrated);
        }
      }
    } catch (error) {
      console.error("Ward team load error:", error);
    }

    setLoaded(true);
  }, []);

  // Save data
  useEffect(() => {
    if (!loaded) return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Ward team save error:", error);
      alert(
        "Storage bhar gaya hai. Kuch photos chhoti karo ya kuch purani photos hatao."
      );
    }
  }, [data, loaded]);

  const allMembers = [
    ...Object.values(data.leaders).filter(Boolean),
    ...data.booths.flatMap((booth) => [
      ...(booth.chairman ? [booth.chairman] : []),
      ...booth.committee,
    ]),
    ...data.others,
  ];

  const totalCommittee = data.booths.reduce(
    (total, booth) => total + booth.committee.length,
    0
  );

  const filteredMembers = (members) =>
    members.filter((member) =>
      `${member.name} ${member.designation} ${member.phone}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // Open editor
  const openEditor = (type, boothId = null, member = null) => {
    setEditor({
      type,
      boothId,
      memberId: member?.id || null,
    });

    setDraft(
      member
        ? {
            name: member.name || "",
            designation: member.designation || "",
            phone: member.phone || "",
            photo: member.photo || "",
            description: member.description || "",
          }
        : { ...emptyMember }
    );
  };

  const closeEditor = () => {
    setEditor(null);
    setDraft({ ...emptyMember });
  };

  // Photo upload
  const handlePhoto = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Sirf image upload kar sakte ho.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image 5 MB se chhoti honi chahiye.");
      return;
    }

    setPhotoLoading(true);

    try {
      const compressed = await compressImage(file);
      setDraft((prev) => ({ ...prev, photo: compressed }));
    } catch {
      alert("Photo process nahi ho paayi.");
    } finally {
      setPhotoLoading(false);
    }
  };

  // Save member
  const saveMember = () => {
    if (!draft.name.trim()) {
      alert("Member ka naam daal bhai.");
      return;
    }

    const member = {
      ...draft,
      id: editor.memberId || makeId(),
      name: draft.name.trim(),
      designation: draft.designation.trim(),
      phone: draft.phone.trim(),
    };

    setData((prev) => {
      const next = structuredClone(prev);

      if (editor.type.startsWith("leader:")) {
        const role = editor.type.split(":")[1];
        next.leaders[role] = member;
      } else if (editor.type === "chairman") {
        const booth = next.booths.find((b) => b.id === editor.boothId);
        if (booth) booth.chairman = member;
      } else if (editor.type === "committee") {
        const booth = next.booths.find((b) => b.id === editor.boothId);

        if (booth) {
          if (editor.memberId) {
            booth.committee = booth.committee.map((m) =>
              m.id === editor.memberId ? member : m
            );
          } else {
            booth.committee.push(member);
          }
        }
      } else if (editor.type === "other") {
        if (editor.memberId) {
          next.others = next.others.map((m) =>
            m.id === editor.memberId ? member : m
          );
        } else {
          next.others.push(member);
        }
      }

      return next;
    });

    closeEditor();
  };

  // Delete member
  const deleteMember = (type, boothId = null, memberId = null) => {
    if (!confirm("Kya sach mein is member ko delete karna hai?")) return;

    setData((prev) => {
      const next = structuredClone(prev);

      if (type.startsWith("leader:")) {
        const role = type.split(":")[1];
        next.leaders[role] = null;
      } else if (type === "chairman") {
        const booth = next.booths.find((b) => b.id === boothId);
        if (booth) booth.chairman = null;
      } else if (type === "committee") {
        const booth = next.booths.find((b) => b.id === boothId);
        if (booth) {
          booth.committee = booth.committee.filter((m) => m.id !== memberId);
        }
      } else if (type === "other") {
        next.others = next.others.filter((m) => m.id !== memberId);
      }

      return next;
    });
  };

  const CardActions = ({ onEdit, onDelete }) => (
    <div className="flex gap-2">
      <button
        onClick={onEdit}
        className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:border-[#FF6D29] hover:text-[#FF6D29]"
      >
        <Pencil size={14} /> Edit
      </button>

      <button
        onClick={onDelete}
        className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-500/10"
      >
        <Trash2 size={14} /> Delete
      </button>
    </div>
  );

  const MemberCard = ({ member, onEdit, onDelete }) => (
    <div className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-[#211C1D] p-4 sm:flex-row sm:items-center">
      <MemberPhoto photo={member.photo} name={member.name} />

      <div className="min-w-0 flex-1">
        <h4 className="truncate font-bold text-white">{member.name}</h4>
        <p className="mt-1 text-sm text-[#FF6D29]">
          {member.designation || "Team Member"}
        </p>

        {member.phone && (
          <p className="mt-2 flex items-center gap-2 text-xs text-[#BABABA]">
            <Phone size={13} /> {member.phone}
          </p>
        )}

        <div className="mt-4">
          <CardActions onEdit={onEdit} onDelete={onDelete} />
        </div>
      </div>
    </div>
  );

  const LeaderCard = ({ role }) => {
    const member = data.leaders[role.id];
    const Icon = role.icon;

    return (
      <div className="rounded-2xl border border-white/10 bg-[#211C1D] p-5">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#453027] text-[#FF6D29]">
            <Icon size={19} />
          </div>
          <div>
            <h3 className="font-bold text-white">{role.title}</h3>
            <p className="text-xs text-[#BABABA]">{role.subtitle}</p>
          </div>
        </div>

        {member ? (
          <div className="flex flex-col gap-4">
            <MemberCard
              member={member}
              onEdit={() => openEditor(`leader:${role.id}`, null, member)}
              onDelete={() => deleteMember(`leader:${role.id}`)}
            />
          </div>
        ) : (
          <button
            onClick={() => openEditor(`leader:${role.id}`)}
            className="flex min-h-[100px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 bg-white/[0.02] text-sm text-[#BABABA] transition hover:border-[#FF6D29] hover:text-[#FF6D29]"
          >
            <Plus size={20} />
            Add {role.title}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#161316] p-4 text-white sm:p-6 lg:p-8">
      <div className="mx-auto max-w-[1500px]">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[3px] text-[#FF6D29]">
              Ward Management
            </p>
            <h1 className="mt-2 text-3xl font-black sm:text-4xl">Ward Team</h1>
            <p className="mt-2 text-sm text-[#BABABA]">
              Manage ward leadership, booths and committee members.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { label: "Total Members", value: allMembers.length, icon: Users },
            { label: "Leadership", value: Object.values(data.leaders).filter(Boolean).length, icon: Crown },
            { label: "Booths", value: data.booths.length, icon: LayoutGrid },
            { label: "Committee Members", value: totalCommittee, icon: Shield },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <div key={stat.label} className="rounded-2xl border border-white/10 bg-[#211C1D] p-4 sm:p-5">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-[#BABABA]">{stat.label}</p>
                  <Icon size={17} className="text-[#FF6D29]" />
                </div>
                <p className="mt-3 text-3xl font-black">{stat.value}</p>
              </div>
            );
          })}
        </div>

        {/* Navigation Tabs */}
        <div className="mb-6 flex flex-wrap gap-2">
          {[
            { id: "leadership", label: "Ward Leadership" },
            { id: "booths", label: "Booth Management" },
            { id: "others", label: "Other Members" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setSearch("");
              }}
              className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                activeTab === tab.id
                  ? "bg-[#FF6D29] text-[#161316]"
                  : "border border-white/10 bg-white/5 text-[#BABABA] hover:border-[#FF6D29]/50 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leadership */}
        {activeTab === "leadership" && (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {leadershipRoles.map((role) => (
              <LeaderCard key={role.id} role={role} />
            ))}
          </div>
        )}

        {/* Booth Management */}
        {activeTab === "booths" && (
          <div>
            {/* Booth selector */}
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {data.booths.map((booth) => (
                <button
                  key={booth.id}
                  onClick={() => setActiveBooth(booth.id)}
                  className={`rounded-xl border p-4 text-center transition ${
                    activeBooth === booth.id
                      ? "border-[#FF6D29] bg-[#453027]"
                      : "border-white/10 bg-[#211C1D] hover:border-[#FF6D29]/40"
                  }`}
                >
                  <p className="text-xs text-[#BABABA]">Booth</p>
                  <p className="mt-1 text-2xl font-black">{booth.id}</p>
                  <p className="mt-2 text-[10px] text-[#FF6D29]">
                    {booth.committee.length}/11 Members
                  </p>
                </button>
              ))}
            </div>

            {data.booths
              .filter((booth) => booth.id === activeBooth)
              .map((booth) => (
                <div key={booth.id} className="space-y-6">

                  {/* Booth Header */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-2xl font-black">
                        Booth {booth.id}
                      </h2>
                      <p className="mt-1 text-sm text-[#BABABA]">
                        Booth Adhyaksh + 11 Samiti Members
                      </p>
                    </div>
                  </div>

                  {/* Booth Chairman */}
                  <div className="rounded-2xl border border-[#FF6D29]/30 bg-[#2C2422] p-5">
                    <div className="mb-4 flex items-center gap-2 text-[#FF6D29]">
                      <Crown size={18} />
                      <h3 className="font-bold">Booth Adhyaksh</h3>
                    </div>

                    {booth.chairman ? (
                      <MemberCard
                        member={booth.chairman}
                        onEdit={() =>
                          openEditor("chairman", booth.id, booth.chairman)
                        }
                        onDelete={() => deleteMember("chairman", booth.id)}
                      />
                    ) : (
                      <button
                        onClick={() => openEditor("chairman", booth.id)}
                        className="flex min-h-[110px] w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 text-sm text-[#BABABA] hover:border-[#FF6D29] hover:text-[#FF6D29]"
                      >
                        <Plus size={20} /> Add Booth Adhyaksh
                      </button>
                    )}
                  </div>

                  {/* Committee */}
                  <div className="rounded-2xl border border-white/10 bg-[#211C1D] p-5 sm:p-6">
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <h3 className="text-xl font-black">Booth {booth.id} Samiti</h3>
                        <p className="mt-1 text-sm text-[#BABABA]">
                          {booth.committee.length} of 11 members added
                        </p>
                      </div>

                      <button
                        disabled={booth.committee.length >= 11}
                        onClick={() => openEditor("committee", booth.id)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6D29] px-4 py-3 text-sm font-bold text-[#161316] transition hover:bg-[#ff854c] disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <Plus size={16} /> Add Samiti Member
                      </button>
                    </div>

                    {/* Progress */}
                    <div className="mb-6 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-[#FF6D29] transition-all"
                        style={{
                          width: `${(booth.committee.length / 11) * 100}%`,
                        }}
                      />
                    </div>

                    {booth.committee.length > 0 ? (
                      <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                        {filteredMembers(booth.committee).map((member) => (
                          <MemberCard
                            key={member.id}
                            member={member}
                            onEdit={() =>
                              openEditor("committee", booth.id, member)
                            }
                            onDelete={() =>
                              deleteMember("committee", booth.id, member.id)
                            }
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-xl border border-dashed border-white/10 py-12 text-center text-sm text-[#777]">
                        Abhi samiti members add nahi kiye gaye.
                      </div>
                    )}

                    {booth.committee.length === 11 && (
                      <div className="mt-5 rounded-xl border border-green-500/20 bg-green-500/5 p-4 text-sm text-green-400">
                        Booth {booth.id} ki 11-member samiti complete hai.
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}

        {/* Other Members */}
        {activeTab === "others" && (
          <div className="rounded-2xl border border-white/10 bg-[#211C1D] p-5 sm:p-6">
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-2xl font-black">Other Members</h2>
                <p className="mt-1 text-sm text-[#BABABA]">
                  Additional team members and volunteers
                </p>
              </div>

              <button
                onClick={() => openEditor("other")}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#FF6D29] px-5 py-3 text-sm font-bold text-[#161316] hover:bg-[#ff854c]"
              >
                <Plus size={17} /> Add Member
              </button>
            </div>

            {/* Search */}
            <div className="mb-6 flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
              <Search size={17} className="text-[#BABABA]" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search members..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-[#777]"
              />
            </div>

            {filteredMembers(data.others).length > 0 ? (
              <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                {filteredMembers(data.others).map((member) => (
                  <MemberCard
                    key={member.id}
                    member={member}
                    onEdit={() => openEditor("other", null, member)}
                    onDelete={() => deleteMember("other", null, member.id)}
                  />
                ))}
              </div>
            ) : (
              <div className="py-14 text-center text-sm text-[#777]">
                No other members added yet.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Member Editor Modal */}
      {editor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm">
          <div className="my-auto w-full max-w-xl rounded-2xl border border-white/10 bg-[#211C1D] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/10 p-5">
              <div>
                <h2 className="text-xl font-black">
                  {editor.memberId ? "Edit Member" : "Add Member"}
                </h2>
                <p className="mt-1 text-xs text-[#BABABA]">
                  Enter member details below
                </p>
              </div>

              <button
                onClick={closeEditor}
                className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#BABABA] hover:text-white"
              >
                <X size={19} />
              </button>
            </div>

            <div className="max-h-[75vh] space-y-5 overflow-y-auto p-5">

              {/* Photo */}
              <div className="flex items-center gap-4">
                <MemberPhoto photo={draft.photo} name={draft.name} size="h-24 w-24" />

                <div className="flex flex-wrap gap-2">
                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-bold hover:border-[#FF6D29]">
                    <ImagePlus size={15} />
                    {photoLoading ? "Processing..." : "Upload Photo"}
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      disabled={photoLoading}
                      onChange={(e) => {
                        handlePhoto(e.target.files?.[0]);
                        e.target.value = "";
                      }}
                    />
                  </label>

                  {draft.photo && (
                    <button
                      onClick={() =>
                        setDraft((prev) => ({ ...prev, photo: "" }))
                      }
                      className="rounded-xl border border-white/10 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-400/5"
                    >
                      Remove Photo
                    </button>
                  )}
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#BABABA]">
                  Full Name *
                </label>
                <input
                  value={draft.name}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Member name"
                  className="w-full rounded-xl border border-white/10 bg-[#161316] px-4 py-3 text-sm outline-none focus:border-[#FF6D29]"
                />
              </div>

              {/* Designation */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#BABABA]">
                  Designation / Post
                </label>
                <input
                  value={draft.designation}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      designation: e.target.value,
                    }))
                  }
                  placeholder="Designation"
                  className="w-full rounded-xl border border-white/10 bg-[#161316] px-4 py-3 text-sm outline-none focus:border-[#FF6D29]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#BABABA]">
                  Phone Number
                </label>
                <input
                  value={draft.phone}
                  onChange={(e) =>
                    setDraft((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Phone number"
                  type="tel"
                  className="w-full rounded-xl border border-white/10 bg-[#161316] px-4 py-3 text-sm outline-none focus:border-[#FF6D29]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-bold text-[#BABABA]">
                  About / Description
                </label>
                <textarea
                  rows={4}
                  value={draft.description}
                  onChange={(e) =>
                    setDraft((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Write member details, introduction, work, etc."
                  className="w-full resize-y rounded-xl border border-white/10 bg-[#161316] px-4 py-3 text-sm outline-none focus:border-[#FF6D29]"
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex gap-3 border-t border-white/10 p-5">
              <button
                onClick={closeEditor}
                className="flex-1 rounded-xl border border-white/10 bg-white/5 py-3 text-sm font-bold text-[#BABABA] hover:text-white"
              >
                Cancel
              </button>

              <button
                disabled={photoLoading}
                onClick={saveMember}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#FF6D29] py-3 text-sm font-bold text-[#161316] hover:bg-[#ff854c] disabled:opacity-50"
              >
                <Save size={16} /> Save Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}