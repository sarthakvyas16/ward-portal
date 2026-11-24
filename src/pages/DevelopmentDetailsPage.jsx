import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Construction,
  Image as ImageIcon,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { getMedia } from "../utils/mediaStorage";

export default function DevelopmentDetailsPage() {
  const { id } = useParams();

  const [project, setProject] = useState(null);
  const [cover, setCover] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState(null);

  // Project aur media load karna
  useEffect(() => {
    let cancelled = false;
    const objectUrls = [];

    async function loadProject() {
      setLoading(true);
      setProject(null);
      setCover(null);
      setPhotos([]);
      setVideos([]);
      setViewerIndex(null);

      try {
        const savedProjects = JSON.parse(
          localStorage.getItem("ward_development_projects") || "[]"
        );

        const foundProject = savedProjects.find(
          (item) => String(item.id) === String(id)
        );

        if (!foundProject) {
          if (!cancelled) setLoading(false);
          return;
        }

        if (cancelled) return;
        setProject(foundProject);

        // Media ID handle karna
        const getMediaId = (item) => {
          if (!item) return null;
          if (typeof item === "string") return item;
          return item.id || item.mediaId || item;
        };

        // IndexedDB se media aur Blob URL banana
        const loadOneMedia = async (mediaRef) => {
          const mediaId = getMediaId(mediaRef);
          if (!mediaId) return null;

          const mediaItem = await getMedia(mediaId);

          if (!mediaItem || !mediaItem.blob) return null;

          const url = URL.createObjectURL(mediaItem.blob);
          objectUrls.push(url);

          return {
            ...mediaItem,
            url,
          };
        };

        // Cover
        const loadedCover = await loadOneMedia(foundProject.coverId);

        // Photos
        const photoRefs = Array.isArray(foundProject.photos)
          ? foundProject.photos
          : [];

        const loadedPhotos = (
          await Promise.all(photoRefs.map(loadOneMedia))
        ).filter(Boolean);

        // Videos
        const videoRefs = Array.isArray(foundProject.videos)
          ? foundProject.videos
          : [];

        const loadedVideos = (
          await Promise.all(videoRefs.map(loadOneMedia))
        ).filter(Boolean);

        if (cancelled) return;

        setCover(loadedCover);
        setPhotos(loadedPhotos);
        setVideos(loadedVideos);
      } catch (error) {
        console.error("Development details loading error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadProject();

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id]);

  // Date format
  const formatDate = (date) => {
    if (!date) return "Date not available";

    const parsed = new Date(date);

    if (isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Fullscreen photo viewer keyboard controls
  useEffect(() => {
    function handleKeyDown(event) {
      if (viewerIndex === null) return;

      if (event.key === "Escape") {
        setViewerIndex(null);
      }

      if (event.key === "ArrowRight") {
        setViewerIndex((prev) => (prev + 1) % photos.length);
      }

      if (event.key === "ArrowLeft") {
        setViewerIndex((prev) => (prev - 1 + photos.length) % photos.length);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, photos.length]);

  // Loading screen
  if (loading) {
    return (
      <main className="min-h-screen bg-[#161316] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6D29]/20 border-t-[#FF6D29] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#BABABA]">Loading project...</p>
        </div>
      </main>
    );
  }

  // Project not found
  if (!project) {
    return (
      <main className="min-h-screen bg-[#161316] text-white flex flex-col items-center justify-center px-5">
        <Construction size={48} className="text-[#FF6D29] mb-5" />

        <h1 className="text-2xl md:text-3xl font-bold">
          Project Not Found
        </h1>

        <p className="text-[#BABABA] mt-3 text-center">
          Ye development project nahi mila.
        </p>

        <Link
          to="/development"
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-[#FF6D29] hover:bg-[#e85b1c] rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Development
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#161316] text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 lg:px-16 py-8 md:py-12">

        {/* Back */}
        <Link
          to="/development"
          className="inline-flex items-center gap-2 text-[#BABABA] hover:text-[#FF6D29] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to Development
        </Link>

        {/* Heading */}
        <div className="mb-8 md:mb-10">
          <span className="text-[#FF6D29] text-xs font-bold uppercase tracking-[0.22em]">
            Ward No. 2 · Development
          </span>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mt-3">
            {project.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3 mt-6">
            {project.date && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#BABABA]">
                <CalendarDays size={16} className="text-[#FF6D29]" />
                {formatDate(project.date)}
              </div>
            )}

            {project.status && (
              <span className="px-4 py-2 rounded-xl bg-[#FF6D29]/10 border border-[#FF6D29]/30 text-[#FF6D29] text-sm font-semibold">
                {project.status}
              </span>
            )}

            {project.area && (
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-[#BABABA]">
                <MapPin size={16} className="text-[#FF6D29]" />
                {project.area}
              </span>
            )}
          </div>
        </div>

        {/* Cover Image */}
        <div className="rounded-2xl md:rounded-3xl overflow-hidden bg-[#241d1b] border border-white/10 mb-10">
          {cover ? (
            <img
              src={cover.url}
              alt={project.title}
              className="w-full h-[220px] sm:h-[280px] md:h-[360px] object-cover"
            />
          ) : (
            <div className="min-h-[260px] md:min-h-[420px] flex flex-col items-center justify-center text-[#BABABA]">
              <Construction size={48} className="text-[#FF6D29] mb-4" />
              <p className="text-lg font-semibold">Development Project</p>
            </div>
          )}
        </div>

        {/* Description */}
        <section className="bg-[#211c20] border border-white/10 rounded-2xl md:rounded-3xl p-6 md:p-10 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#FF6D29]/10 flex items-center justify-center">
              <Construction className="text-[#FF6D29]" size={22} />
            </div>

            <h2 className="text-xl md:text-2xl font-bold">
              Project Overview
            </h2>
          </div>

          <p className="text-[#BABABA] leading-8 whitespace-pre-wrap text-sm md:text-base">
            {project.description || "No project description available."}
          </p>
        </section>

        {/* Photo Gallery */}
        {photos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon className="text-[#FF6D29]" size={22} />

              <h2 className="text-xl md:text-2xl font-bold">
                Project Gallery
              </h2>

              <span className="text-sm text-[#BABABA]">
                ({photos.length} photos)
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {photos.map((photo, index) => (
                <button
                  key={photo.id || index}
                  onClick={() => setViewerIndex(index)}
                  className="group relative aspect-[4/3] rounded-xl md:rounded-2xl overflow-hidden bg-[#241d1b] border border-white/10 cursor-pointer"
                >
                  <img
                    src={photo.url}
                    alt={`${project.title} photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />

                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 text-white text-xs backdrop-blur-sm">
                    View Photo
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Play className="text-[#FF6D29]" size={22} />

              <h2 className="text-xl md:text-2xl font-bold">
                Project Videos
              </h2>

              <span className="text-sm text-[#BABABA]">
                ({videos.length} videos)
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {videos.map((video, index) => (
                <div
                  key={video.id || index}
                  className="rounded-2xl overflow-hidden bg-[#241d1b] border border-white/10"
                >
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
                    className="w-full aspect-video bg-black"
                  />

                  <div className="p-4">
                    <p className="text-sm font-medium text-[#BABABA]">
                      {video.name || `Project Video ${index + 1}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty gallery notice */}
        {photos.length === 0 && videos.length === 0 && (
          <section className="bg-[#211c20] border border-white/10 rounded-2xl p-6 text-center mb-10">
            <ImageIcon size={32} className="text-[#FF6D29] mx-auto mb-3" />
            <p className="text-[#BABABA]">
              Project photos and videos will appear here when uploaded.
            </p>
          </section>
        )}

        {/* Bottom Back Button */}
        <div className="border-t border-white/10 pt-8">
          <Link
            to="/development"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-[#FF6D29] hover:border-[#FF6D29] text-white font-semibold transition-all"
          >
            <ArrowLeft size={18} />
            All Development Projects
          </Link>
        </div>
      </div>

      {/* Fullscreen Photo Viewer */}
      {viewerIndex !== null && photos.length > 0 && (
        <div
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setViewerIndex(null)}
        >
          {/* Close */}
          <button
            onClick={() => setViewerIndex(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-[#FF6D29] text-white transition-colors"
            aria-label="Close photo viewer"
          >
            <X size={24} />
          </button>

          {/* Previous */}
          {photos.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                setViewerIndex(
                  (prev) => (prev - 1 + photos.length) % photos.length
                );
              }}
              className="absolute left-3 md:left-6 p-3 rounded-full bg-white/10 hover:bg-[#FF6D29] text-white transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Image */}
          <img
            src={photos[viewerIndex].url}
            alt={`${project.title} gallery photo ${viewerIndex + 1}`}
            onClick={(event) => event.stopPropagation()}
            className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg"
          />

          {/* Next */}
          {photos.length > 1 && (
            <button
              onClick={(event) => {
                event.stopPropagation();
                setViewerIndex((prev) => (prev + 1) % photos.length);
              }}
              className="absolute right-3 md:right-6 p-3 rounded-full bg-white/10 hover:bg-[#FF6D29] text-white transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Counter */}
          <div className="absolute bottom-5 px-4 py-2 rounded-full bg-white/10 text-white text-sm backdrop-blur-sm">
            {viewerIndex + 1} / {photos.length}
          </div>
        </div>
      )}
    </main>
  );
}