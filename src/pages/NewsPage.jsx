import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Newspaper,
  ArrowUpRight,
  Search,
  ArrowDownWideNarrow,
  Image as ImageIcon,
  Play,
} from "lucide-react";
import { getMedia } from "../utils/mediaStorage";

export default function NewsPage() {
  const [news, setNews] = useState([]);
  const [mediaUrls, setMediaUrls] = useState({});
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Load published news
  useEffect(() => {
    const loadNews = () => {
      try {
        const saved = JSON.parse(
          localStorage.getItem("ward_news_updates") || "[]"
        );

        const publishedNews = saved
          .filter((item) => item.published)
          .sort((a, b) => {
            const dateA = new Date(a.date || 0).getTime();
            const dateB = new Date(b.date || 0).getTime();
            return dateB - dateA;
          });

        setNews(publishedNews);
      } catch (error) {
        console.error("News load error:", error);
        setNews([]);
      }
    };

    loadNews();

    window.addEventListener("storage", loadNews);
    window.addEventListener("ward-news-updated", loadNews);

    return () => {
      window.removeEventListener("storage", loadNews);
      window.removeEventListener("ward-news-updated", loadNews);
    };
  }, []);

  // Load cover images from IndexedDB
  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    const loadMedia = async () => {
      const coverIds = [
        ...new Set(news.map((item) => item.coverId).filter(Boolean)),
      ];

      const urls = {};

      for (const id of coverIds) {
        try {
          const media = await getMedia(id);

          if (media?.blob) {
            const url = URL.createObjectURL(media.blob);
            urls[id] = url;
            createdUrls.push(url);
          }
        } catch (error) {
          console.error("Cover image error:", error);
        }
      }

      if (!cancelled) {
        setMediaUrls(urls);
      } else {
        createdUrls.forEach((url) => URL.revokeObjectURL(url));
      }
    };

    loadMedia();

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [news]);

  // Format date
  const formatDate = (date) => {
    if (!date) return "Ward Update";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) return "Ward Update";

    return parsed.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Search news
  const filteredNews = news
    .filter((item) => {
      const searchText = search.toLowerCase().trim();

      if (!searchText) return true;

      return (
        (item.title || "").toLowerCase().includes(searchText) ||
        (item.description || "").toLowerCase().includes(searchText)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();

      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    });

  return (
    <main className="min-h-screen bg-[#161316] text-white">

      {/* Header */}
      <header className="border-b border-white/[0.07] bg-[#1d191c]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-16">
          <Link
            to="/"
            className="flex items-center gap-2 text-sm font-medium text-[#BABABA] transition hover:text-[#FF6D29]"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>

          <span className="text-xs font-bold tracking-[0.2em] text-[#FF6D29]">
            WARD NO. 2
          </span>
        </div>
      </header>

      {/* Hero / Page Heading */}
      <section className="px-5 pb-10 pt-16 sm:px-8 sm:pt-24 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <span className="inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-[#FF6D29]">
            <span className="h-2 w-2 rounded-full bg-[#FF6D29]" />
            NEWSROOM
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight sm:text-6xl">
            News & <span className="text-[#FF6D29]">Updates.</span>
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#BABABA] sm:text-base">
            Latest announcements, ward activities, development news and important
            updates from Ward No. 2.
          </p>

          {/* News Stats */}
          <div className="mt-9 flex flex-wrap gap-4">

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#211d20] px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6D29]/10">
                <Newspaper size={20} className="text-[#FF6D29]" />
              </div>

              <div>
                <p className="text-2xl font-bold">{news.length}</p>
                <p className="text-xs text-[#BABABA]">Published Updates</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#211d20] px-5 py-4">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FF6D29]/10">
                <CalendarDays size={20} className="text-[#FF6D29]" />
              </div>

              <div>
                <p className="text-2xl font-bold">Latest</p>
                <p className="text-xs text-[#BABABA]">Ward Activities</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Search and Sort */}
      <section className="px-5 pb-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col gap-4 rounded-2xl border border-white/[0.07] bg-[#211d20] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">

            {/* Search */}
            <div className="relative w-full sm:max-w-md">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#BABABA]"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search news or announcements..."
                className="w-full rounded-xl border border-white/[0.08] bg-[#161316] py-3 pl-11 pr-4 text-sm text-white outline-none transition focus:border-[#FF6D29]/60 placeholder:text-[#777]"
              />
            </div>

            {/* Sorting */}
            <div className="flex items-center gap-3">
              <ArrowDownWideNarrow
                size={18}
                className="shrink-0 text-[#FF6D29]"
              />

              <span className="whitespace-nowrap text-sm text-[#BABABA]">
                Sort by
              </span>

              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full cursor-pointer rounded-xl border border-white/[0.08] bg-[#161316] px-4 py-3 text-sm text-white outline-none focus:border-[#FF6D29]/60 sm:w-auto"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>

          </div>

          {/* Results Count */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-[#BABABA]">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredNews.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">{news.length}</span>{" "}
              updates
            </p>

            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-semibold text-[#FF6D29] transition hover:text-white"
              >
                Clear Search
              </button>
            )}
          </div>

        </div>
      </section>

      {/* News Grid */}
      <section className="px-5 pb-24 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">

          {filteredNews.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">

              {filteredNews.map((item, index) => (
                <article
                  key={item.id || item._id || index}
                  className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-[#211d20] transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6D29]/40 hover:shadow-[0_15px_45px_rgba(255,109,41,0.06)]"
                >

                  {/* Cover */}
                  <Link
                    to={`/news/${item.id || item._id}`}
                    className="relative block h-56 overflow-hidden bg-[#2b2428] sm:h-64"
                  >
                    {mediaUrls[item.coverId] ? (
                      <img
                        src={mediaUrls[item.coverId]}
                        alt={item.title || "Ward news"}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Newspaper
                          size={48}
                          className="text-[#FF6D29]/40"
                        />
                      </div>
                    )}

                    {/* News Tag */}
                    <span className="absolute left-4 top-4 rounded-full border border-[#FF6D29]/30 bg-[#161316]/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#FF6D29]">
                      WARD NEWS
                    </span>

                    {/* Media Badges */}
                    {(item.photos?.length > 0 || item.videos?.length > 0) && (
                      <div className="absolute bottom-4 right-4 flex flex-wrap gap-2">

                        {item.photos?.length > 0 && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1.5 text-xs text-white backdrop-blur">
                            <ImageIcon size={13} />
                            {item.photos.length}
                          </span>
                        )}

                        {item.videos?.length > 0 && (
                          <span className="flex items-center gap-1.5 rounded-lg bg-black/75 px-2.5 py-1.5 text-xs text-white backdrop-blur">
                            <Play size={13} />
                            {item.videos.length}
                          </span>
                        )}

                      </div>
                    )}
                  </Link>

                  {/* Content */}
                  <div className="p-6">

                    <div className="flex items-center gap-2 text-xs text-[#BABABA]">
                      <CalendarDays size={14} className="text-[#FF6D29]" />
                      {formatDate(item.date)}
                    </div>

                    <h2 className="mt-4 line-clamp-2 text-xl font-bold leading-snug transition group-hover:text-[#FF6D29]">
                      {item.title || "Ward Update"}
                    </h2>

                    <p className="mt-3 line-clamp-3 min-h-[84px] text-sm leading-7 text-[#BABABA]">
                      {item.description || "Read the latest update from Ward No. 2."}
                    </p>

                    {/* Read More */}
                    <Link
                      to={`/news/${item.id || item._id}`}
                      className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5 text-sm font-semibold text-white transition hover:text-[#FF6D29]"
                    >
                      Read Full Update
                      <ArrowUpRight
                        size={18}
                        className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </Link>

                  </div>
                </article>
              ))}

            </div>
          ) : (
            /* Empty State */
            <div className="rounded-2xl border border-white/[0.07] bg-[#211d20] px-6 py-20 text-center">

              <Search
                size={42}
                className="mx-auto text-[#FF6D29]/60"
              />

              <h2 className="mt-5 text-xl font-bold">
                {search ? "No matching news found" : "No news published yet"}
              </h2>

              <p className="mt-2 text-sm text-[#BABABA]">
                {search
                  ? "Try searching with a different title or keyword."
                  : "Published ward updates will appear here."}
              </p>

              {search ? (
                <button
                  onClick={() => setSearch("")}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#FF6D29] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#e85b1c]"
                >
                  Clear Search
                </button>
              ) : (
                <Link
                  to="/"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[#FF6D29]"
                >
                  Return to Home
                  <ArrowUpRight size={16} />
                </Link>
              )}

            </div>
          )}

        </div>
      </section>

    </main>
  );
}
