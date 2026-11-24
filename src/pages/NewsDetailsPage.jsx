
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Newspaper,
  Image as ImageIcon,
  Play,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getMedia } from "../utils/mediaStorage";

export default function NewsDetailsPage() {
  const { id } = useParams();

  const [news, setNews] = useState(null);
  const [cover, setCover] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewerIndex, setViewerIndex] = useState(null);

  // News aur media load karna
  useEffect(() => {
    let cancelled = false;
    const objectUrls = [];

    async function loadNews() {
      setLoading(true);
      setNews(null);
      setCover(null);
      setPhotos([]);
      setVideos([]);
      setViewerIndex(null);

      try {
        const savedNews = JSON.parse(
          localStorage.getItem("ward_news_updates") || "[]"
        );

        const foundNews = savedNews.find(
          (item) => String(item.id || item._id) === String(id)
        );

        if (!foundNews) {
          if (!cancelled) setLoading(false);
          return;
        }

        if (cancelled) return;
        setNews(foundNews);

        const getMediaId = (item) => {
          if (!item) return null;
          if (typeof item === "string") return item;
          return item.id || item.mediaId || null;
        };

        const loadOneMedia = async (mediaRef) => {
          const mediaId = getMediaId(mediaRef);
          if (!mediaId) return null;

          const mediaItem = await getMedia(mediaId);
          if (!mediaItem?.blob) return null;

          const url = URL.createObjectURL(mediaItem.blob);
          objectUrls.push(url);

          return {
            ...mediaItem,
            url,
          };
        };

        // Cover image
        const loadedCover = await loadOneMedia(foundNews.coverId);

        // Photos
        const photoRefs = Array.isArray(foundNews.photos)
          ? foundNews.photos
          : [];

        const loadedPhotos = (
          await Promise.all(photoRefs.map(loadOneMedia))
        ).filter(Boolean);

        // Videos
        const videoRefs = Array.isArray(foundNews.videos)
          ? foundNews.videos
          : [];

        const loadedVideos = (
          await Promise.all(videoRefs.map(loadOneMedia))
        ).filter(Boolean);

        if (cancelled) return;

        setCover(loadedCover);
        setPhotos(loadedPhotos);
        setVideos(loadedVideos);
      } catch (error) {
        console.error("News details loading error:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadNews();

    return () => {
      cancelled = true;
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [id]);

  // Date format
  const formatDate = (date) => {
    if (!date) return "Ward Update";

    const parsed = new Date(date);
    if (Number.isNaN(parsed.getTime())) return date;

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Photo viewer keyboard controls
  useEffect(() => {
    function handleKeyDown(event) {
      if (viewerIndex === null || photos.length === 0) return;

      if (event.key === "Escape") {
        setViewerIndex(null);
      }

      if (event.key === "ArrowRight") {
        setViewerIndex((prev) => (prev + 1) % photos.length);
      }

      if (event.key === "ArrowLeft") {
        setViewerIndex(
          (prev) => (prev - 1 + photos.length) % photos.length
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewerIndex, photos.length]);

  // Loading
  if (loading) {
    return (
      <main className="min-h-screen bg-[#161316] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#FF6D29]/20 border-t-[#FF6D29] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#BABABA]">Loading news...</p>
        </div>
      </main>
    );
  }

  // News not found
  if (!news) {
    return (
      <main className="min-h-screen bg-[#161316] text-white flex flex-col items-center justify-center px-5">
        <Newspaper size={48} className="text-[#FF6D29] mb-5" />

        <h1 className="text-2xl md:text-3xl font-bold">News Not Found</h1>

        <p className="text-[#BABABA] mt-3 text-center">
          Ye news update nahi mili.
        </p>

        <Link
          to="/news"
          className="mt-7 inline-flex items-center gap-2 px-6 py-3 bg-[#FF6D29] hover:bg-[#e85b1c] rounded-xl font-semibold transition-colors"
        >
          <ArrowLeft size={18} />
          Back to News
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#161316] text-white">
      <div className="max-w-5xl mx-auto px-5 md:px-10 py-8 md:py-12">

        {/* Back */}
        <Link
          to="/news"
          className="inline-flex items-center gap-2 text-[#BABABA] hover:text-[#FF6D29] transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to News
        </Link>

        {/* Heading */}
        <div className="mb-8">
          <span className="text-[#FF6D29] text-xs font-bold uppercase tracking-[0.22em]">
            Ward No. 2 · News & Updates
          </span>

          <h1 className="text-3xl md:text-5xl font-bold leading-tight mt-3">
            {news.title}
          </h1>

          {news.date && (
            <div className="inline-flex items-center gap-2 mt-5 text-sm text-[#BABABA]">
              <CalendarDays size={16} className="text-[#FF6D29]" />
              {formatDate(news.date)}
            </div>
          )}
        </div>

        {/* Cover */}
        <div className="rounded-2xl overflow-hidden bg-[#241d1b] border border-white/10 mb-9">
          {cover ? (
            <img
              src={cover.url}
              alt={news.title}
              className="w-full h-[220px] sm:h-[280px] md:h-[380px] object-cover"
            />
          ) : (
            <div className="h-[220px] md:h-[320px] flex items-center justify-center">
              <Newspaper size={48} className="text-[#FF6D29]/40" />
            </div>
          )}
        </div>

        {/* Article */}
        <article className="bg-[#211c20] border border-white/10 rounded-2xl p-6 md:p-10 mb-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-[#FF6D29]/10 flex items-center justify-center">
              <Newspaper className="text-[#FF6D29]" size={22} />
            </div>

            <h2 className="text-xl md:text-2xl font-bold">Full Update</h2>
          </div>

          <div className="text-[#BABABA] leading-8 whitespace-pre-wrap text-sm md:text-base">
            {news.description || "No description available."}
          </div>
        </article>

        {/* Photos */}
        {photos.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <ImageIcon size={22} className="text-[#FF6D29]" />

              <h2 className="text-xl md:text-2xl font-bold">Photo Gallery</h2>

              <span className="text-sm text-[#BABABA]">
                ({photos.length})
              </span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
              {photos.map((photo, index) => (
                <button
                  key={photo.id || index}
                  onClick={() => setViewerIndex(index)}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-[#241d1b] border border-white/10"
                >
                  <img
                    src={photo.url}
                    alt={`News photo ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  <span className="absolute bottom-3 right-3 px-3 py-1 rounded-lg bg-black/60 text-white text-xs">
                    View Photo
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Videos */}
        {videos.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <Play size={22} className="text-[#FF6D29]" />

              <h2 className="text-xl md:text-2xl font-bold">Videos</h2>

              <span className="text-sm text-[#BABABA]">
                ({videos.length})
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

                  <div className="p-4 text-sm text-[#BABABA]">
                    {video.name || `News Video ${index + 1}`}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* No media */}
        {photos.length === 0 && videos.length === 0 && (
          <div className="bg-[#211c20] border border-white/10 rounded-2xl p-6 text-center mb-10">
            <ImageIcon size={32} className="text-[#FF6D29] mx-auto mb-3" />
            <p className="text-[#BABABA]">
              Additional photos and videos will appear here when available.
            </p>
          </div>
        )}

        {/* Bottom Back */}
        <div className="border-t border-white/10 pt-8">
          <Link
            to="/news"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/5 hover:bg-[#FF6D29] hover:border-[#FF6D29] text-white font-semibold transition-all"
          >
            <ArrowLeft size={18} />
            All News Updates
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
            alt={`News gallery photo ${viewerIndex + 1}`}
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
