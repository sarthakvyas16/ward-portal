import { useEffect, useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  MapPin,
  CalendarDays,
  Construction,
  Upload,
  Image as ImageIcon,
  Video,
} from "lucide-react";
import {
  saveMultipleMedia,
  getMedia,
  deleteMedia,
} from "../utils/mediaStorage";

const STORAGE_KEY = "ward_development_projects";

const emptyForm = {
  area: "",
  title: "",
  description: "",
  date: "",
  status: "Planned",
  coverId: "",
  photos: [],
  videos: [],
};

export default function AdminDevelopment() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setProjects(JSON.parse(saved));
    } catch {
      setProjects([]);
    }
  }, []);

  // Project media load karna
  useEffect(() => {
    let cancelled = false;
    const urls = {};

    async function loadProjectMedia() {
      const ids = new Set();

      projects.forEach((project) => {
        if (project.coverId) ids.add(project.coverId);
        (project.photos || []).forEach((id) => ids.add(id));
        (project.videos || []).forEach((id) => ids.add(id));
      });

      if (form.coverId) ids.add(form.coverId);
      form.photos.forEach((id) => ids.add(id));
      form.videos.forEach((id) => ids.add(id));

      const loaded = {};

      for (const id of ids) {
        try {
          const item = await getMedia(id);
          if (item?.blob) {
            const url = URL.createObjectURL(item.blob);
            urls[id] = url;
            loaded[id] = { ...item, url };
          }
        } catch (error) {
          console.error("Media load error:", error);
        }
      }

      if (!cancelled) {
        setMediaItems((prev) => ({ ...prev, ...loaded }));
      } else {
        Object.values(urls).forEach(URL.revokeObjectURL);
      }
    }

    loadProjectMedia();

    return () => {
      cancelled = true;
    };
  }, [projects, form.coverId, form.photos, form.videos]);

  function saveProjects(updated) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setProjects(updated);
  }

  function openAddForm() {
    setForm({ ...emptyForm, photos: [], videos: [] });
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(project) {
    setForm({
      area: project.area || "",
      title: project.title || "",
      description: project.description || "",
      date: project.date || "",
      status: project.status || "Planned",
      coverId: project.coverId || "",
      photos: project.photos || [],
      videos: project.videos || [],
    });
    setEditingId(project.id);
    setFormOpen(true);
  }

  async function handleFileUpload(event, type) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const maxSize = type === "videos" ? 100 * 1024 * 1024 : 15 * 1024 * 1024;
    const validFiles = files.filter((file) => file.size <= maxSize);

    if (validFiles.length !== files.length) {
      alert(
        type === "videos"
          ? "Video size 100MB se kam honi chahiye."
          : "Photo size 15MB se kam honi chahiye."
      );
    }

    try {
      const saved = await saveMultipleMedia(validFiles);

      const additions = {};
      saved.forEach((item) => {
        additions[item.id] = {
          ...item,
          url: URL.createObjectURL(item.blob),
        };
      });

      setMediaItems((prev) => ({ ...prev, ...additions }));

      if (type === "cover") {
        setForm((prev) => ({ ...prev, coverId: saved[0]?.id || prev.coverId }));
      } else {
        setForm((prev) => ({
          ...prev,
          [type]: [...prev[type], ...saved.map((item) => item.id)],
        }));
      }
    } catch (error) {
      console.error(error);
      alert("Media save nahi ho paya. Browser storage check karo.");
    }

    event.target.value = "";
  }

  function removeFromForm(type, id) {
    if (type === "coverId") {
      setForm((prev) => ({ ...prev, coverId: "" }));
    } else {
      setForm((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item !== id),
      }));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (saving) return;
    setSaving(true);

    try {
      const project = {
        id: editingId || crypto.randomUUID(),
        ...form,
        published: editingId
          ? projects.find((p) => p.id === editingId)?.published ?? true
          : true,
      };

      const updated = editingId
        ? projects.map((p) => (p.id === editingId ? project : p))
        : [project, ...projects];

      saveProjects(updated);
      setForm(emptyForm);
      setEditingId(null);
      setFormOpen(false);
    } catch (error) {
      console.error(error);
      alert("Project save nahi ho paya.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id) {
    if (!window.confirm("Kya tum ye project delete karna chahte ho?")) return;

    const project = projects.find((p) => p.id === id);
    const updated = projects.filter((p) => p.id !== id);
    saveProjects(updated);

    // Project se linked media bhi delete karna
    const ids = [
      project?.coverId,
      ...(project?.photos || []),
      ...(project?.videos || []),
    ].filter(Boolean);

    for (const mediaId of ids) {
      try {
        await deleteMedia(mediaId);
      } catch (error) {
        console.error("Media deletion error:", error);
      }
    }

    setMediaItems((prev) => {
      const next = { ...prev };
      ids.forEach((mediaId) => {
        if (next[mediaId]?.url) URL.revokeObjectURL(next[mediaId].url);
        delete next[mediaId];
      });
      return next;
    });
  }

  function togglePublish(id) {
    saveProjects(
      projects.map((project) =>
        project.id === id
          ? { ...project, published: !project.published }
          : project
      )
    );
  }

  const statusStyle = {
    Planned: "bg-blue-50 text-blue-600",
    "In Progress": "bg-orange-50 text-orange-600",
    Completed: "bg-green-50 text-green-600",
  };

  function MediaPreview({ id, video = false }) {
    const media = mediaItems[id];
    if (!media) return null;

    return (
      <div className="relative rounded-xl overflow-hidden bg-gray-100 aspect-video">
        {video ? (
          <video src={media.url} controls className="w-full h-full object-cover" />
        ) : (
          <img src={media.url} alt={media.name} className="w-full h-full object-cover" />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-[#161316]">
            Development Management
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Ward ke development projects manage karo.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-[#FF6D29] text-white px-5 py-3 rounded-xl font-bold text-sm hover:bg-[#e95c1c]"
        >
          <Plus size={18} /> Add New Project
        </button>
      </div>

      {/* Status Counts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {["Planned", "In Progress", "Completed"].map((status) => (
          <div key={status} className="bg-white border border-[#EAE6E2] rounded-2xl p-5">
            <p className="text-sm text-gray-500">{status}</p>
            <h3 className="text-3xl font-extrabold mt-2">
              {projects.filter((p) => p.status === status).length}
            </h3>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {formOpen && (
        <div className="bg-white border border-[#EAE6E2] rounded-2xl p-5 md:p-7">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-extrabold text-lg">
              {editingId ? "Edit Project" : "Add New Project"}
            </h3>
            <button onClick={() => setFormOpen(false)} className="p-2 rounded-lg hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2">Area / Gali Name</label>
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="e.g. Gali No. 2, Jatav Pura"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Project Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Road Construction"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Project Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">Status</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316] bg-white"
              >
                <option>Planned</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold mb-2">Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Project ke baare mein detail likho..."
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316] resize-y"
              />
            </div>

            {/* Cover Photo */}
            <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-bold mb-3">Cover Photo</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-[#FF6D29]">
                <Upload size={18} className="text-[#FF6D29}" />
                <span className="text-sm text-gray-600">Upload Cover Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "cover")}
                />
              </label>

              {form.coverId && mediaItems[form.coverId] && (
                <div className="mt-4 max-w-sm">
                  <MediaPreview id={form.coverId} />
                  <button
                    type="button"
                    onClick={() => removeFromForm("coverId", form.coverId)}
                    className="mt-2 text-xs text-red-500 font-bold"
                  >
                    Remove Cover
                  </button>
                </div>
              )}
            </div>

            {/* Multiple Photos */}
            <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-bold mb-3">Project Photos</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-[#FF6D29]">
                <ImageIcon size={18} className="text-[#FF6D29}" />
                <span className="text-sm text-gray-600">Choose Multiple Photos</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "photos")}
                />
              </label>

              {form.photos.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
                  {form.photos.map((id) => (
                    <div key={id}>
                      <MediaPreview id={id} />
                      <button
                        type="button"
                        onClick={() => removeFromForm("photos", id)}
                        className="mt-2 text-xs text-red-500 font-bold"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Multiple Videos */}
            <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-bold mb-3">Project Videos</label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-[#FF6D29]">
                <Video size={18} className="text-[#FF6D29]" />
                <span className="text-sm text-gray-600">Choose Multiple Videos</span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "videos")}
                />
              </label>

              <p className="text-xs text-gray-400 mt-2">
                Maximum 100MB per video. Browser storage is limited.
              </p>

              {form.videos.length > 0 && (
                <div className="grid sm:grid-cols-2 gap-3 mt-4">
                  {form.videos.map((id) => (
                    <div key={id}>
                      <MediaPreview id={id} video />
                      <button
                        type="button"
                        onClick={() => removeFromForm("videos", id)}
                        className="mt-2 text-xs text-red-500 font-bold"
                      >
                        Remove Video
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Buttons */}
            <div className="md:col-span-2 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="bg-[#FF6D29] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#e95c1c] disabled:opacity-60"
              >
                {saving ? "Saving..." : editingId ? "Save Changes" : "Create Project"}
              </button>

              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="bg-gray-100 text-gray-600 px-6 py-3 rounded-xl font-bold text-sm hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Projects List */}
      {projects.length === 0 ? (
        <div className="bg-white border border-[#EAE6E2] rounded-2xl py-16 px-5 text-center">
          <Construction size={38} className="mx-auto text-[#FF6D29]" />
          <h3 className="font-extrabold mt-4">No Projects Yet</h3>
          <p className="text-sm text-gray-500 mt-2">
            Add your first ward development project.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project) => (
            <div key={project.id} className="bg-white border border-[#EAE6E2] rounded-2xl overflow-hidden">
              <div className="h-44 bg-[#453027] overflow-hidden">
                {project.coverId && mediaItems[project.coverId] ? (
                  <img
                    src={mediaItems[project.coverId].url}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <Construction size={40} className="text-[#FF6D29]" />
                  </div>
                )}
              </div>

              <div className="p-5">
                <span className={`inline-block text-[11px] font-bold px-3 py-1.5 rounded-full ${statusStyle[project.status] || "bg-gray-100 text-gray-600"}`}>
                  {project.status}
                </span>

                <h3 className="font-extrabold text-lg mt-3">{project.title}</h3>

                <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                  <MapPin size={14} /> {project.area}
                </p>

                <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-2">
                  <CalendarDays size={14} /> {project.date}
                </p>

                <p className="text-sm text-gray-500 mt-3 line-clamp-3">
                  {project.description}
                </p>

                <div className="text-xs text-gray-400 mt-3">
                  {(project.photos || []).length} photos · {(project.videos || []).length} videos
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 mt-5 pt-4 gap-2">
                  <button
                    onClick={() => togglePublish(project.id)}
                    className={`text-xs font-bold px-3 py-2 rounded-lg ${project.published ? "bg-green-50 text-green-700" : "bg-gray-100 text-gray-500"}`}
                  >
                    {project.published ? "Published" : "Unpublished"}
                  </button>

                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(project)}
                      className="p-2 rounded-lg bg-orange-50 text-[#FF6D29] hover:bg-orange-100"
                      title="Edit"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}