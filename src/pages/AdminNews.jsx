import { useEffect, useState } from "react";
import {
  Plus,
  Newspaper,
  Pencil,
  Trash2,
  X,
  ImagePlus,
  Video,
  CalendarDays,
  Eye,
  EyeOff,
  Save,
} from "lucide-react";
import { saveMedia, getMedia, deleteMedia } from "../utils/mediaStorage";

const NEWS_KEY = "ward_news_updates";

const emptyForm = {
  title: "",
  description: "",
  date: new Date().toISOString().slice(0, 10),
  coverId: "",
  photos: [],
  videos: [],
  published: false,
};

export default function AdminNews() {
  const [news, setNews] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [mediaUrls, setMediaUrls] = useState({});
  const [saving, setSaving] = useState(false);

  // Load news
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(NEWS_KEY) || "[]");
      setNews(Array.isArray(saved) ? saved : []);
    } catch {
      setNews([]);
    }
  }, []);

  // Save news
  useEffect(() => {
    localStorage.setItem(NEWS_KEY, JSON.stringify(news));

    window.dispatchEvent(new Event("ward-news-updated"));
  }, [news]);

  // Load media previews
  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    async function loadPreviews() {
      const urls = {};

      const allIds = news.flatMap((item) => [
        item.coverId,
        ...(item.photos || []),
        ...(item.videos || []),
      ]).filter(Boolean);

      const uniqueIds = [...new Set(allIds)];

      for (const id of uniqueIds) {
        try {
          const media = await getMedia(id);
          if (media?.blob) {
            const url = URL.createObjectURL(media.blob);
            urls[id] = { url, type: media.type, name: media.name };
            createdUrls.push(url);
          }
        } catch (error) {
          console.error("Media loading error:", error);
        }
      }

      if (!cancelled) setMediaUrls(urls);
    }

    loadPreviews();

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [news]);

  const persistNews = (updated) => {
    setNews(updated);
    localStorage.setItem(NEWS_KEY, JSON.stringify(updated));
  };

  const openNewForm = () => {
    setForm({ ...emptyForm, date: new Date().toISOString().slice(0, 10) });
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setForm({
      title: item.title || "",
      description: item.description || "",
      date: item.date || "",
      coverId: item.coverId || "",
      photos: item.photos || [],
      videos: item.videos || [],
      published: !!item.published,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleCover = async (file) => {
    if (!file) return;
    try {
      const saved = await saveMedia(file);
      setForm((prev) => ({ ...prev, coverId: saved.id }));
    } catch {
      alert("Cover image upload failed.");
    }
  };

  const handlePhotos = async (files) => {
    if (!files?.length) return;

    try {
      const uploaded = [];
      for (const file of files) {
        const saved = await saveMedia(file);
        uploaded.push(saved.id);
      }

      setForm((prev) => ({
        ...prev,
        photos: [...prev.photos, ...uploaded],
      }));
    } catch {
      alert("Photo upload failed.");
    }
  };

  const handleVideos = async (files) => {
    if (!files?.length) return;

    const oversized = [...files].some((file => file.size > 100 * 1024 * 1024));
    if (oversized) {
      alert("Each video must be 100 MB or less.");
      return;
    }

    try {
      const uploaded = [];
      for (const file of files) {
        const saved = await saveMedia(file);
        uploaded.push(saved.id);
      }

      setForm((prev) => ({
        ...prev,
        videos: [...prev.videos, ...uploaded],
      }));
    } catch {
      alert("Video upload failed.");
    }
  };

  const removePhoto = (id) => {
    setForm((prev) => ({
      ...prev,
      photos: prev.photos.filter((photoId) => photoId !== id),
    }));
  };

  const removeVideo = (id) => {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((videoId) => videoId !== id),
    }));
  };

  const saveNews = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      alert("Please enter a title and description.");
      return;
    }

    setSaving(true);

    try {
      const item = {
        ...form,
        title: form.title.trim(),
        description: form.description.trim(),
        id: editingId || crypto.randomUUID(),
        updatedAt: new Date().toISOString(),
      };

      const updated = editingId
        ? news.map((n) => (n.id === editingId ? item : n))
        : [item, ...news];

      persistNews(updated);
      setShowForm(false);
      setForm(emptyForm);
      setEditingId(null);
    } catch {
      alert("Unable to save news.");
    } finally {
      setSaving(false);
    }
  };

  const togglePublish = (item) => {
    persistNews(
      news.map((n) =>
        n.id === item.id ? { ...n, published: !n.published } : n
      )
    );
  };

  const deleteNews = async (item) => {
    if (!window.confirm(`Delete "${item.title}"? This cannot be undone.`)) return;

    const updated = news.filter((n) => n.id !== item.id);
    persistNews(updated);

    const ids = [
      item.coverId,
      ...(item.photos || []),
      ...(item.videos || []),
    ].filter(Boolean);

    for (const id of new Set(ids)) {
      try {
        await deleteMedia(id);
      } catch (error) {
        console.error("Media deletion error:", error);
      }
    }
  };

  const cancelForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="min-h-screen bg-[#161316] text-white p-4 md:p-7 lg:p-9">

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <p className="text-[#FF6D29] text-xs font-bold tracking-[2px] uppercase mb-2">
            Ward Management System
          </p>
          <h1 className="text-2xl md:text-3xl font-bold">News & Updates</h1>
          <p className="text-[#99918d] text-sm mt-2">
            Create and manage ward announcements and news.
          </p>
        </div>

        <button
          onClick={openNewForm}
          className="flex items-center justify-center gap-2 bg-[#FF6D29] hover:bg-[#e95c1c] px-5 py-3 rounded-xl font-semibold text-sm transition"
        >
          <Plus size={18} />
          Add News
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
  { label: "Total News", value: news.length, icon: Newspaper },
  { label: "Published", value: news.filter((n) => n.published).length, icon: Eye },
  { label: "Drafts", value: news.filter((n) => !n.published).length, icon: EyeOff },
].map((stat) => {
  const Icon = stat.icon;

  return (
          <div
            key={stat.label}
            className="bg-[#211b1a] border border-[#382d28] rounded-2xl p-5 flex items-center justify-between"
          >
            <div>
              <p className="text-sm text-[#BABABA]">{stat.label}</p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-[#FF6D29]/10 text-[#FF6D29] flex items-center justify-center">
              <stat.icon size={22} />
            </div>
          </div>
          );
})}
      </div>

      {/* News List */}
      {news.length === 0 ? (
        <div className="bg-[#211b1a] border border-[#382d28] rounded-2xl py-20 text-center">
          <Newspaper size={40} className="text-[#FF6D29] mx-auto mb-4" />
          <h3 className="text-lg font-bold">No news added yet</h3>
          <p className="text-sm text-[#89817c] mt-2">
            Click Add News to create your first update.
          </p>
          <button
            onClick={openNewForm}
            className="mt-5 bg-[#FF6D29] px-5 py-3 rounded-xl font-semibold text-sm"
          >
            Create News
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {news.map((item) => (
            <div
              key={item.id}
              className="bg-[#211b1a] border border-[#382d28] rounded-2xl overflow-hidden hover:border-[#FF6D29]/40 transition group"
            >
              {/* Cover */}
              <div className="h-48 bg-[#191514] relative overflow-hidden">
                {mediaUrls[item.coverId]?.url ? (
                  <img
                    src={mediaUrls[item.coverId].url}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#FF6D29]/40">
                    <ImagePlus size={40} />
                  </div>
                )}

                <span
                  className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold ${
                    item.published
                      ? "bg-green-500/15 text-green-400 border border-green-500/20"
                      : "bg-orange-500/15 text-orange-400 border border-orange-500/20"
                  }`}
                >
                  {item.published ? "Published" : "Draft"}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center gap-2 text-xs text-[#89817c] mb-3">
                  <CalendarDays size={14} className="text-[#FF6D29]" />
                  {item.date || "Date not set"}
                </div>

                <h3 className="font-bold text-lg text-white line-clamp-2">
                  {item.title}
                </h3>

                <p className="text-sm text-[#a59a93] leading-6 mt-3 line-clamp-3">
                  {item.description}
                </p>

                <div className="flex items-center gap-4 text-xs text-[#89817c] mt-4">
                  <span className="flex items-center gap-1.5">
                    <ImagePlus size={14} /> {item.photos?.length || 0} Photos
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Video size={14} /> {item.videos?.length || 0} Videos
                  </span>
                </div>

                {/* Actions */}
                <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-[#382d28]">
                  <button
                    onClick={() => openEditForm(item)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#FF6D29]/10 text-[#FF6D29] hover:bg-[#FF6D29] hover:text-white text-xs font-semibold transition"
                  >
                    <Pencil size={14} /> Edit
                  </button>

                  <button
                    onClick={() => togglePublish(item)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-semibold transition ${
                      item.published
                        ? "bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white"
                        : "bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white"
                    }`}
                  >
                    {item.published ? <EyeOff size={14} /> : <Eye size={14} />}
                    {item.published ? "Hide" : "Publish"}
                  </button>

                  <button
                    onClick={() => deleteNews(item)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white text-xs font-semibold transition"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Editor Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-5"
          onClick={cancelForm}
        >
          <div
            className="w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-[#211b1a] border border-[#49362c] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 bg-[#211b1a] border-b border-[#382d28] p-5 flex justify-between items-center">
              <div>
                <p className="text-xs uppercase tracking-[1.5px] text-[#FF6D29] font-bold">
                  News Editor
                </p>
                <h2 className="text-xl font-bold mt-1">
                  {editingId ? "Edit News" : "Create News"}
                </h2>
              </div>
              <button
                onClick={cancelForm}
                className="p-2 rounded-lg bg-[#161316] border border-[#382d28] text-gray-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={saveNews} className="p-5 space-y-5">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-[#d7d0cb] mb-2">
                  News Title *
                </label>
                <input
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Enter news title"
                  className="w-full bg-[#161316] border border-[#382d28] rounded-xl px-4 py-3 text-white placeholder:text-[#756d68] outline-none focus:border-[#FF6D29]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#d7d0cb] mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Write news details..."
                  className="w-full bg-[#161316] border border-[#382d28] rounded-xl px-4 py-3 text-white placeholder:text-[#756d68] outline-none focus:border-[#FF6D29] resize-y"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-semibold text-[#d7d0cb] mb-2">
                  News Date
                </label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full bg-[#161316] border border-[#382d28] rounded-xl px-4 py-3 text-white outline-none focus:border-[#FF6D29]"
                />
              </div>

              {/* Cover */}
              <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                <label className="block text-sm font-semibold text-[#d7d0cb] mb-3">
                  Cover Image
                </label>

                {form.coverId && (
                  <div className="mb-3">
                    {mediaUrls[form.coverId]?.url ? (
                      <img
                        src={mediaUrls[form.coverId].url}
                        alt="Cover preview"
                        className="w-full max-h-56 object-cover rounded-xl"
                      />
                    ) : (
                      <p className="text-xs text-[#89817c]">Cover selected</p>
                    )}
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, coverId: "" })}
                      className="text-xs text-red-400 mt-2 hover:text-red-300"
                    >
                      Remove Cover
                    </button>
                  </div>
                )}

                <label className="flex items-center justify-center gap-2 border border-dashed border-[#49362c] rounded-xl p-4 text-sm text-[#a59a93] hover:border-[#FF6D29] hover:text-[#FF6D29] cursor-pointer transition">
                  <ImagePlus size={18} />
                  Upload Cover Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleCover(e.target.files?.[0])}
                  />
                </label>
              </div>

              {/* Multiple Photos */}
              <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                <label className="block text-sm font-semibold text-[#d7d0cb] mb-3">
                  Gallery Photos ({form.photos.length})
                </label>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-3">
                  {form.photos.map((id) => (
                    <div key={id} className="relative group">
                      {mediaUrls[id]?.url ? (
                        <img
                          src={mediaUrls[id].url}
                          alt="Gallery"
                          className="w-full h-28 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-28 bg-[#211b1a] rounded-lg flex items-center justify-center text-xs text-gray-500">
                          Photo
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={() => removePhoto(id)}
                        className="absolute top-1 right-1 p-1.5 bg-black/70 text-red-400 rounded-md"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex items-center justify-center gap-2 border border-dashed border-[#49362c] rounded-xl p-4 text-sm text-[#a59a93] hover:border-[#FF6D29] hover:text-[#FF6D29] cursor-pointer transition">
                  <ImagePlus size={18} />
                  Add Multiple Photos
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handlePhotos(Array.from(e.target.files || []));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {/* Videos */}
              <div className="bg-[#161316] border border-[#382d28] rounded-xl p-4">
                <label className="block text-sm font-semibold text-[#d7d0cb] mb-3">
                  Videos ({form.videos.length})
                </label>

                <div className="space-y-2 mb-3">
                  {form.videos.map((id) => (
                    <div
                      key={id}
                      className="flex items-center justify-between gap-3 bg-[#211b1a] border border-[#382d28] rounded-lg p-3"
                    >
                      <div className="flex items-center gap-2 text-sm text-[#d7d0cb] min-w-0">
                        <Video size={16} className="text-[#FF6D29] shrink-0" />
                        <span className="truncate">
                          {mediaUrls[id]?.name || "Uploaded Video"}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeVideo(id)}
                        className="text-red-400 hover:text-red-300 shrink-0"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="flex items-center justify-center gap-2 border border-dashed border-[#49362c] rounded-xl p-4 text-sm text-[#a59a93] hover:border-[#FF6D29] hover:text-[#FF6D29] cursor-pointer transition">
                  <Video size={18} />
                  Add Videos (Max 100 MB each)
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      handleVideos(Array.from(e.target.files || []));
                      e.target.value = "";
                    }}
                  />
                </label>
              </div>

              {/* Publish Toggle */}
              <label className="flex items-center justify-between bg-[#161316] border border-[#382d28] rounded-xl p-4 cursor-pointer">
                <div>
                  <p className="text-sm font-semibold text-white">Publish News</p>
                  <p className="text-xs text-[#89817c] mt-1">
                    Visible on public website when enabled
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.published}
                  onChange={(e) => setForm({ ...form, published: e.target.checked })}
                  className="w-5 h-5 accent-[#FF6D29]"
                />
              </label>

              {/* Submit */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="button"
                  onClick={cancelForm}
                  className="flex-1 py-3 rounded-xl border border-[#49362c] text-[#c4bbb5] hover:bg-[#2a211e] transition font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF6D29] hover:bg-[#e95c1c] disabled:opacity-50 transition font-bold"
                >
                  <Save size={17} />
                  {saving ? "Saving..." : editingId ? "Update News" : "Save News"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}