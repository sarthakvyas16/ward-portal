
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Construction,
  CalendarDays,
  MapPin,
  X,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Video,
  Search,
  ArrowLeft,
} from "lucide-react";
import { getMedia } from "../utils/mediaStorage";

const STORAGE_KEY = "ward_development_projects";

export default function Development({ fullPage = false }) {
  const [projects, setProjects] = useState([]);
  const [mediaMap, setMediaMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [photoViewer, setPhotoViewer] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  // Load projects and media
  useEffect(() => {
    let cancelled = false;
    const objectUrls = [];

    async function createMediaUrl(mediaId) {
      if (!mediaId) return null;

      try {
        const media = await getMedia(mediaId);
        if (!media?.blob || cancelled) return null;

        const url = URL.createObjectURL(media.blob);
        objectUrls.push(url);
        return url;
      } catch (error) {
        console.error("Media load error:", error);
        return null;
      }
    }

    async function loadProjects() {
      try {
        const stored = JSON.parse(
          localStorage.getItem(STORAGE_KEY) || "[]"
        );

        const published = stored.filter((project) => project.published);

        const sorted = [...published].sort(
          (a, b) =>
            new Date(b.date || 0).getTime() -
            new Date(a.date || 0).getTime()
        );

        const assets = {};

        for (const project of sorted) {
          const cover = await createMediaUrl(project.coverId);

          const photos = await Promise.all(
            (project.photos || []).map((item) =>
              createMediaUrl(
                typeof item === "string" ? item : item?.id
              )
            )
          );

          const videos = await Promise.all(
            (project.videos || []).map((item) =>
              createMediaUrl(
                typeof item === "string" ? item : item?.id
              )
            )
          );

          assets[project.id] = {
            cover,
            photos: photos.filter(Boolean),
            videos: videos.filter(Boolean),
          };
        }

        if (!cancelled) {
          setProjects(sorted);
          setMediaMap(assets);
        }
      } catch (error) {
        console.error("Development load error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProjects();

    function refreshProjects() {
      loadProjects();
    }

    window.addEventListener("storage", refreshProjects);
    window.addEventListener("ward-development-updated", refreshProjects);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", refreshProjects);
      window.removeEventListener("ward-development-updated", refreshProjects);
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

// Keyboard controls
useEffect(() => {
  function handleKeyDown(event) {
    if (event.key === "Escape") {
      setSelectedProject(null);
      setPhotoViewer(null);
    }

    if (photoViewer && event.key === "ArrowRight") {
      setPhotoViewer((prev) => ({
        ...prev,
        index: (prev.index + 1) % prev.images.length,
      }));
    }

    if (photoViewer && event.key === "ArrowLeft") {
      setPhotoViewer((prev) => ({
        ...prev,
        index:
          (prev.index - 1 + prev.images.length) % prev.images.length,
      }));
    }
  }

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [photoViewer]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "Date not specified";

    return new Date(date + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Status styles
  const statusStyle = (status) => {
    if (status === "Completed") {
      return "bg-green-500/15 text-green-400 border-green-500/20";
    }

    if (status === "In Progress") {
      return "bg-[#FF6D29]/15 text-[#FF6D29] border-[#FF6D29]/20";
    }

    return "bg-blue-500/15 text-blue-400 border-blue-500/20";
  };

  // Search and filters
  const filteredProjects = projects.filter((project) => {
    const matchesFilter =
      activeFilter === "All" || project.status === activeFilter;

    const query = searchQuery.toLowerCase().trim();

    const matchesSearch =
      (project.title || "").toLowerCase().includes(query) ||
      (project.area || "").toLowerCase().includes(query) ||
      (project.description || "").toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  const visibleProjects = fullPage
    ? filteredProjects
    : filteredProjects.slice(0, 3);

  const filters = ["All", "Planned", "In Progress", "Completed"];

  return (
    <section
      id="development"
      className="relative py-20 md:py-24 px-5 md:px-10 lg:px-16 bg-[#161316] overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6D29]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-5">
              {fullPage && (
                <Link
                  to="/"
                  className="text-[#BABABA] hover:text-[#FF6D29] transition-colors"
                >
                  <ArrowLeft size={20} />
                </Link>
              )}

              <span className="w-10 h-[2px] bg-[#FF6D29]" />

              <span className="text-[#FF6D29] text-xs font-bold tracking-[0.25em] uppercase">
                Ward Development
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Development <span className="text-[#FF6D29]">Works</span>
            </h2>

            <p className="text-[#BABABA] mt-5 max-w-2xl text-sm md:text-base leading-7">
              Ward mein chal rahe, poore ho chuke aur aane wale
              development works ki jaankari.
            </p>
          </div>

          <div className="text-sm text-[#BABABA] flex items-center gap-2">
            <Construction size={18} className="text-[#FF6D29]" />
            <span>Public Project Updates</span>
          </div>
        </div>

        {/* Search and Filters */}
        {fullPage && !loading && projects.length > 0 && (
          <div className="mb-9 space-y-4">
            <div className="relative max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BABABA]"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search projects or areas..."
                className="w-full bg-[#453027]/30 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-[#777] outline-none focus:border-[#FF6D29]/50"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {filters.map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all ${
                    activeFilter === filter
                      ? "bg-[#FF6D29] text-white border-[#FF6D29]"
                      : "bg-white/5 text-[#BABABA] border-white/10 hover:border-[#FF6D29]/40"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            <p className="text-xs text-[#777]">
              Showing {filteredProjects.length} project
              {filteredProjects.length !== 1 ? "s" : ""}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse h-[360px] rounded-2xl bg-[#453027]/40 border border-white/5"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && visibleProjects.length === 0 && (
          <div className="border border-white/10 bg-[#453027]/20 rounded-2xl py-16 px-6 text-center">
            <Construction
              size={40}
              className="text-[#FF6D29] mx-auto mb-5"
            />

            <h3 className="text-xl font-bold text-white">
              {searchQuery || activeFilter !== "All"
                ? "No Matching Projects"
                : "No Development Updates Yet"}
            </h3>

            <p className="text-[#BABABA] text-sm mt-3">
              {searchQuery || activeFilter !== "All"
                ? "Try another search or filter."
                : "Development works ki updates jald hi yahan share ki jayengi."}
            </p>
          </div>
        )}

        {/* Project Cards */}
        {!loading && visibleProjects.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className="group bg-[#453027]/30 border border-white/10 rounded-2xl overflow-hidden hover:border-[#FF6D29]/40 transition-all duration-300"
              >
                {/* Cover */}
                <div className="relative h-56 bg-[#453027] overflow-hidden">
                  {mediaMap[project.id]?.cover ? (
                    <img
                      src={mediaMap[project.id].cover}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#453027] to-[#161316]">
                      <Construction
                        size={50}
                        className="text-[#FF6D29]/60"
                      />
                    </div>
                  )}

                  <span
                    className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold border ${statusStyle(
                      project.status
                    )}`}
                  >
                    {project.status || "Planned"}
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {project.area && (
                    <div className="flex items-center gap-2 text-[#FF6D29] text-xs font-semibold uppercase tracking-wider mb-3">
                      <MapPin size={14} />
                      {project.area}
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white leading-snug">
                    {project.title}
                  </h3>

                  <p className="text-[#BABABA] text-sm leading-6 mt-3 line-clamp-3">
                    {project.description}
                  </p>
<div className="flex items-center justify-between gap-3 mt-6 pt-4 border-t border-white/10">
  <div className="flex items-center gap-2 text-xs text-[#BABABA]">
    <CalendarDays size={15} className="text-[#FF6D29]" />
    {formatDate(project.date)}
  </div>

  <button
    onClick={() => {
      window.location.href = `/development/${project.id}`;
    }}
    className="flex items-center gap-1 text-[#FF6D29] text-sm font-semibold hover:gap-2 transition-all cursor-pointer"
  >
    Details
    <ArrowUpRight size={16} />
  </button>
</div>

                  {/* Media Counts */}
                  {(project.photos?.length > 0 ||
                    project.videos?.length > 0) && (
                    <div className="flex flex-wrap gap-3 mt-4">
                      {project.photos?.length > 0 && (
                        <span className="text-xs text-[#BABABA] bg-white/5 px-3 py-1.5 rounded-lg">
                          📷 {project.photos.length} Photos
                        </span>
                      )}

                      {project.videos?.length > 0 && (
                        <span className="text-xs text-[#BABABA] bg-white/5 px-3 py-1.5 rounded-lg">
                          🎥 {project.videos.length} Videos
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}

        {/* View All */}
{!fullPage && !loading && projects.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="flex justify-center mt-12"
  >
    <Link
      to="/development"
      className="group inline-flex items-center gap-3 px-7 py-4 rounded-xl bg-[#FF6D29] text-white font-bold hover:bg-[#e85b1c] hover:shadow-[0_8px_30px_rgba(255,109,41,0.25)] transition-all duration-300"
    >
      View All Development
      <ArrowUpRight
        size={18}
        className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300"
      />
    </Link>
  </motion.div>
)}
      </div>

      {/* Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              onClick={(event) => event.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto bg-[#1D191A] border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl"
            >
              {/* Modal Header */}
              <div className="sticky top-0 z-20 flex items-center justify-between px-5 sm:px-7 py-4 bg-[#1D191A]/95 backdrop-blur border-b border-white/10">
                <div className="min-w-0 pr-3">
                  <p className="text-[#FF6D29] text-xs font-bold tracking-widest uppercase">
                    Development Details
                  </p>

                  <h2 className="text-white text-lg sm:text-xl font-bold truncate mt-1">
                    {selectedProject.title}
                  </h2>
                </div>

                <button
                  onClick={() => setSelectedProject(null)}
                  className="shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-[#FF6D29] text-white transition-colors cursor-pointer"
                  aria-label="Close details"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-5 sm:p-7">
                {/* Cover */}
                {mediaMap[selectedProject.id]?.cover && (
                  <div className="rounded-2xl overflow-hidden mb-6 bg-[#453027]">
                    <img
                      src={mediaMap[selectedProject.id].cover}
                      alt={selectedProject.title}
                      className="w-full max-h-[420px] object-cover"
                    />
                  </div>
                )}

                {/* Metadata */}
                <div className="flex flex-wrap gap-3 mb-5">
                  {selectedProject.area && (
                    <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#FF6D29]/10 border border-[#FF6D29]/20 text-[#FF6D29] text-sm">
                      <MapPin size={15} />
                      {selectedProject.area}
                    </span>
                  )}

                  <span
                    className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-sm ${statusStyle(
                      selectedProject.status
                    )}`}
                  >
                    {selectedProject.status || "Planned"}
                  </span>

                  <span className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-[#BABABA] text-sm">
                    <CalendarDays size={15} className="text-[#FF6D29]" />
                    {formatDate(selectedProject.date)}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedProject.title}
                </h3>

                <p className="text-[#BABABA] text-sm sm:text-base leading-7 mt-4 whitespace-pre-wrap">
                  {selectedProject.description || "No description provided."}
                </p>

                {/* Photos */}
                {mediaMap[selectedProject.id]?.photos?.length > 0 && (
                  <div className="mt-9">
                    <div className="flex items-center gap-2 mb-4">
                      <ImageIcon className="text-[#FF6D29]" size={20} />

                      <h3 className="text-white text-lg font-bold">
                        Project Photos
                      </h3>

                      <span className="text-[#BABABA] text-sm">
                        ({mediaMap[selectedProject.id].photos.length})
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {mediaMap[selectedProject.id].photos.map(
                        (photo, index) => (
                          <button
                            key={index}
                            onClick={() =>
                              setPhotoViewer({
                                images: mediaMap[selectedProject.id].photos,
                                index,
                              })
                            }
                            className="relative aspect-square rounded-xl overflow-hidden bg-[#453027] group cursor-pointer"
                          >
                            <img
                              src={photo}
                              alt={`Project photo ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Videos */}
                {mediaMap[selectedProject.id]?.videos?.length > 0 && (
                  <div className="mt-9">
                    <div className="flex items-center gap-2 mb-4">
                      <Video className="text-[#FF6D29]" size={20} />

                      <h3 className="text-white text-lg font-bold">
                        Project Videos
                      </h3>

                      <span className="text-[#BABABA] text-sm">
                        ({mediaMap[selectedProject.id].videos.length})
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      {mediaMap[selectedProject.id].videos.map(
                        (video, index) => (
                          <div
                            key={index}
                            className="rounded-xl overflow-hidden bg-black border border-white/10"
                          >
                            <video
                              src={video}
                              controls
                              playsInline
                              preload="metadata"
                              className="w-full aspect-video"
                            />

                            <p className="px-3 py-2 text-xs text-[#BABABA]">
                              Video {index + 1}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

                {/* Empty Media */}
                {!mediaMap[selectedProject.id]?.photos?.length &&
                  !mediaMap[selectedProject.id]?.videos?.length && (
                    <div className="mt-7 rounded-xl bg-white/5 border border-white/10 p-5 text-center text-sm text-[#BABABA]">
                      No additional photos or videos available for this project.
                    </div>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fullscreen Photo Viewer */}
      <AnimatePresence>
        {photoViewer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setPhotoViewer(null)}
            className="fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-4"
          >
            {/* Close */}
            <button
              onClick={() => setPhotoViewer(null)}
              className="absolute top-4 right-4 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-[#FF6D29] text-white flex items-center justify-center cursor-pointer"
              aria-label="Close photo viewer"
            >
              <X size={22} />
            </button>

            {/* Previous */}
            {photoViewer.images.length > 1 && (
              <button
                onClick={(event) => {
                  event.stopPropagation();

                  setPhotoViewer((prev) => ({
                    ...prev,
                    index:
                      (prev.index - 1 + prev.images.length) %
                      prev.images.length,
                  }));
                }}
                className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-[#FF6D29] text-white flex items-center justify-center cursor-pointer"
                aria-label="Previous photo"
              >
                <ChevronLeft size={26} />
              </button>
            )}

            {/* Current Photo */}
            <img
              src={photoViewer.images[photoViewer.index]}
              alt={`Gallery image ${photoViewer.index + 1}`}
              onClick={(event) => event.stopPropagation()}
              className="max-w-full max-h-[85vh] object-contain rounded-lg"
            />

            {/* Next */}
            {photoViewer.images.length > 1 && (
              <button
                onClick={(event) => {
                  event.stopPropagation();

                  setPhotoViewer((prev) => ({
                    ...prev,
                    index: (prev.index + 1) % prev.images.length,
                  }));
                }}
                className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-white/10 hover:bg-[#FF6D29] text-white flex items-center justify-center cursor-pointer"
                aria-label="Next photo"
              >
                <ChevronRight size={26} />
              </button>
            )}

            {/* Counter */}
            <div className="absolute bottom-5 text-white/70 text-sm bg-white/10 px-4 py-2 rounded-full">
              {photoViewer.index + 1} / {photoViewer.images.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
