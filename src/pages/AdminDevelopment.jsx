
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
  getAdminDevelopmentProjects,
  uploadDevelopmentMedia,
  createDevelopmentProject,
  updateDevelopmentProject,
  deleteDevelopmentProject,
  deleteDevelopmentMedia,
} from "../utils/developmentApi";

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

const getProjectId = (project) => project?._id || project?.id;

const getMediaKey = (media) => media?.publicId;

function normalizeMedia(media) {
  if (!media?.url || !media?.publicId) return null;

  return {
    id: crypto.randomUUID(),
    name: media.originalName || media.name || "Media",
    url: media.url,
    publicId: media.publicId,
    resourceType: media.resourceType || "image",
    format: media.format || "",
    size: media.size || 0,
  };
}

function mediaPayload(media) {
  if (!media) return null;

  return {
    url: media.url,
    publicId: media.publicId,
    resourceType: media.resourceType,
    format: media.format || "",
    originalName: media.originalName || media.name || "",
    size: media.size || 0,
  };
}

function getProjectMedia(project) {
  // New database format
  if (project.cover || project.photos?.some((item) => item?.url) ||
      project.videos?.some((item) => item?.url)) {
    return {
      cover: project.cover || null,
      photos: project.photos || [],
      videos: project.videos || [],
    };
  }

  // Legacy backend media format compatibility
  const legacy = project.media || [];

  return {
    cover: legacy.find((item) => item.resourceType === "image") || null,
    photos: legacy.filter((item) => item.resourceType === "image"),
    videos: legacy.filter((item) => item.resourceType === "video"),
  };
}

export default function AdminDevelopment() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [mediaItems, setMediaItems] = useState({});
  const [saving, setSaving] = useState(false);

  // Load projects and their Cloudinary media from backend
  async function loadProjects() {
    const data = await getAdminDevelopmentProjects();
    const list = data || [];
    setProjects(list);

    const mediaMap = {};

    list.forEach((project) => {
      const media = getProjectMedia(project);
      [media.cover, ...media.photos, ...media.videos].forEach((item) => {
        const normalized = normalizeMedia(item);
        if (normalized) mediaMap[normalized.id] = normalized;
      });
    });

    setMediaItems((prev) => ({ ...prev, ...mediaMap }));
    return list;
  }

  useEffect(() => {
    let cancelled = false;

    async function initialLoad() {
      try {
        const data = await getAdminDevelopmentProjects();
        if (cancelled) return;

        const list = data || [];
        setProjects(list);

        const mediaMap = {};

        list.forEach((project) => {
          const media = getProjectMedia(project);
          [media.cover, ...media.photos, ...media.videos].forEach((item) => {
            const normalized = normalizeMedia(item);
            if (normalized) mediaMap[normalized.id] = normalized;
          });
        });

        setMediaItems(mediaMap);
      } catch (error) {
        console.error("Development projects load error:", error);
        if (!cancelled) {
          alert("Projects server se load nahi ho paye. Please refresh try karein.");
        }
      }
    }

    initialLoad();

    return () => {
      cancelled = true;
    };
  }, []);

  function openAddForm() {
    setForm({ ...emptyForm, photos: [], videos: [] });
    setEditingId(null);
    setFormOpen(true);
  }

  function openEditForm(project) {
    const media = getProjectMedia(project);
    const cover = normalizeMedia(media.cover);
    const photos = media.photos.map(normalizeMedia).filter(Boolean);
    const videos = media.videos.map(normalizeMedia).filter(Boolean);

    const map = {};
    if (cover) map[cover.id] = cover;
    photos.forEach((item) => (map[item.id] = item));
    videos.forEach((item) => (map[item.id] = item));

    setMediaItems((prev) => ({ ...prev, ...map }));

    setForm({
      area: project.area || "",
      title: project.title || "",
      description: project.description || "",
      date: project.date || "",
      status: project.status || "Planned",
      coverId: cover?.id || "",
      photos: photos.map((item) => item.id),
      videos: videos.map((item) => item.id),
    });

    setEditingId(getProjectId(project));
    setFormOpen(true);
  }

  async function handleFileUpload(event, type) {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const isVideo = type === "videos";
    const maxSize = isVideo
      ? 100 * 1024 * 1024
      : 15 * 1024 * 1024;

    const validFiles = files.filter((file => {
      const correctType = isVideo
        ? file.type.startsWith("video/")
        : file.type.startsWith("image/");

      return correctType && file.size <= maxSize;
    }));

    if (validFiles.length !== files.length) {
      alert(
        isVideo
          ? "Only videos up to 100MB are allowed."
          : "Only photos up to 15MB are allowed."
      );
    }

    if (!validFiles.length) {
      event.target.value = "";
      return;
    }

    try {
      for (const file of validFiles) {
        const uploaded = await uploadDevelopmentMedia(file);

        const id = crypto.randomUUID();

        const mediaItem = {
          id,
          name: uploaded.originalName || file.name,
          url: uploaded.url,
          publicId: uploaded.publicId,
          resourceType: uploaded.resourceType,
          format: uploaded.format,
          size: uploaded.size,
        };

        setMediaItems((prev) => ({
          ...prev,
          [id]: mediaItem,
        }));

        if (type === "cover") {
          setForm((prev) => ({ ...prev, coverId: id }));
        } else {
          setForm((prev) => ({
            ...prev,
            [type]: [...prev[type], id],
          }));
        }
      }

      alert("Media upload successfully ho gaya!");
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      alert(error.message || "Media upload failed. Please try again.");
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
      const cover = mediaPayload(mediaItems[form.coverId]);
      const photos = form.photos
        .map((id) => mediaPayload(mediaItems[id]))
        .filter(Boolean);
      const videos = form.videos
        .map((id) => mediaPayload(mediaItems[id]))
        .filter(Boolean);

      const payload = {
        area: form.area.trim(),
        title: form.title.trim(),
        description: form.description,
        date: form.date,
        status: form.status,
        cover,
        photos,
        videos,
        isPublished: editingId
          ? projects.find((p) => getProjectId(p) === editingId)?.isPublished ?? true
          : true,
      };

      let savedProject;

      if (editingId) {
        const oldProject = projects.find(
          (p) => getProjectId(p) === editingId
        );

        const oldMedia = getProjectMedia(oldProject || {});
        const oldItems = [
          oldMedia.cover,
          ...oldMedia.photos,
          ...oldMedia.videos,
        ].filter(Boolean);

        savedProject = await updateDevelopmentProject(editingId, payload);

        // Delete media removed from project only after DB update succeeds
        const newItems = [cover, ...photos, ...videos].filter(Boolean);
        const newPublicIds = new Set(newItems.map(getMediaKey));

        for (const item of oldItems) {
          if (item.publicId && !newPublicIds.has(item.publicId)) {
            try {
              await deleteDevelopmentMedia(
                item.publicId,
                item.resourceType
              );
            } catch (error) {
              console.error("Removed media cleanup error:", error);
            }
          }
        }
      } else {
        savedProject = await createDevelopmentProject(payload);
      }

      await loadProjects();

      setForm({ ...emptyForm, photos: [], videos: [] });
      setEditingId(null);
      setFormOpen(false);
      alert("Project successfully save ho gaya!");
    } catch (error) {
      console.error("Project save error:", error);
      alert(error.message || "Project save nahi ho paya.");
    } finally {
      setSaving(false);
    }
  }

  async function deleteProject(id) {
    if (!window.confirm("Kya tum ye project delete karna chahte ho?")) return;

    const project = projects.find((p) => getProjectId(p) === id);
    if (!project) return;

    const media = getProjectMedia(project);
    const mediaToDelete = [
      media.cover,
      ...media.photos,
      ...media.videos,
    ].filter(Boolean);

    try {
      // First delete the MongoDB record
      await deleteDevelopmentProject(id);

      // Update UI only after DB deletion succeeds
      setProjects((prev) => prev.filter((p) => getProjectId(p) !== id));

      // Then delete Cloudinary assets
      for (const item of mediaToDelete) {
        if (!item.publicId || !item.resourceType) continue;

        try {
          await deleteDevelopmentMedia(item.publicId, item.resourceType);
        } catch (error) {
          console.error("Cloudinary media cleanup error:", error);
        }
      }

      alert("Project delete ho gaya.");
    } catch (error) {
      console.error("Project deletion error:", error);
      alert(error.message || "Project delete nahi ho paya.");
    }
  }

  async function togglePublish(id) {
    const project = projects.find((p) => getProjectId(p) === id);
    if (!project) return;

    const nextStatus = !project.isPublished;

    try {
      await updateDevelopmentProject(id, {
        isPublished: nextStatus,
      });

      setProjects((prev) =>
        prev.map((p) =>
          getProjectId(p) === id
            ? { ...p, isPublished: nextStatus }
            : p
        )
      );
    } catch (error) {
      console.error("Publish status update error:", error);
      alert(error.message || "Publish status update nahi ho paya.");
    }
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
          <video
            src={media.url}
            controls
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            src={media.url}
            alt={media.name}
            className="w-full h-full object-cover"
          />
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
          <div
            key={status}
            className="bg-white border border-[#EAE6E2] rounded-2xl p-5"
          >
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
            <button
              onClick={() => setFormOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-bold mb-2">
                Area / Gali Name
              </label>
              <input
                value={form.area}
                onChange={(e) => setForm({ ...form, area: e.target.value })}
                placeholder="e.g. Gali No. 2, Jatav Pura"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Project Title
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Road Construction"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316]"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Project Date
              </label>
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
              <label className="block text-sm font-bold mb-2">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Project ke baare mein detail likho..."
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-[#FF6D29] text-sm text-[#161316] resize-y"
              />
            </div>

            {/* Cover Photo */}
            <div className="md:col-span-2 border border-gray-200 rounded-xl p-4">
              <label className="block text-sm font-bold mb-3">
                Cover Photo
              </label>
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
              <label className="block text-sm font-bold mb-3">
                Project Photos
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-[#FF6D29]">
                <ImageIcon size={18} className="text-[#FF6D29}" />
                <span className="text-sm text-gray-600">
                  Choose Multiple Photos
                </span>
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
              <label className="block text-sm font-bold mb-3">
                Project Videos
              </label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-gray-300 p-5 hover:border-[#FF6D29]">
                <Video size={18} className="text-[#FF6D29}" />
                <span className="text-sm text-gray-600">
                  Choose Multiple Videos
                </span>
                <input
                  type="file"
                  accept="video/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, "videos")}
                />
              </label>

              <p className="text-xs text-gray-400 mt-2">
                Maximum 100MB per video.
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
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Save Changes"
                  : "Create Project"}
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
          {projects.map((project) => {
            const id = getProjectId(project);
            const projectMedia = getProjectMedia(project);
            const published = project.isPublished ?? project.published ?? true;

            return (
              <div
                key={id}
                className="bg-white border border-[#EAE6E2] rounded-2xl overflow-hidden"
              >
                <div className="h-44 bg-[#453027] overflow-hidden">
                  {projectMedia.cover?.url ? (
                    <img
                      src={projectMedia.cover.url}
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center">
                      <Construction size={40} className="text-[#FF6D29}" />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <span
                    className={`inline-block text-[11px] font-bold px-3 py-1.5 rounded-full ${
                      statusStyle[project.status] || "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {project.status}
                  </span>

                  <h3 className="font-extrabold text-lg mt-3">
                    {project.title}
                  </h3>

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
                    {(projectMedia.photos || []).length} photos ·{" "}
                    {(projectMedia.videos || []).length} videos
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 mt-5 pt-4 gap-2">
                    <button
                      onClick={() => togglePublish(id)}
                      className={`text-xs font-bold px-3 py-2 rounded-lg ${
                        published
                          ? "bg-green-50 text-green-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {published ? "Published" : "Unpublished"}
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
                        onClick={() => deleteProject(id)}
                        className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
