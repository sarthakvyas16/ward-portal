
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, CalendarDays, Newspaper } from "lucide-react";
import { getMedia } from "../utils/mediaStorage";

export default function LatestUpdates() {
  const [news, setNews] = useState([]);
  const [mediaUrls, setMediaUrls] = useState({});

  // Load published news
  useEffect(() => {
    const loadNews = () => {
      try {
        const savedNews = JSON.parse(
          localStorage.getItem("ward_news_updates") || "[]"
        );

        const publishedNews = savedNews
          .filter((item) => item.published)
          .sort(
            (a, b) => new Date(b.date || 0) - new Date(a.date || 0)
          );

        setNews(publishedNews.slice(0, 3));
      } catch (error) {
        console.error("News loading error:", error);
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

  // Load news cover images
  useEffect(() => {
    let cancelled = false;
    const createdUrls = [];

    const loadImages = async () => {
      const ids = [...new Set(news.map((item) => item.coverId).filter(Boolean))];
      const urls = {};

      for (const id of ids) {
        try {
          const media = await getMedia(id);

          if (media?.blob) {
            const url = URL.createObjectURL(media.blob);
            urls[id] = url;
            createdUrls.push(url);
          }
        } catch (error) {
          console.error("News cover loading error:", error);
        }
      }

      if (!cancelled) {
        setMediaUrls(urls);
      } else {
        createdUrls.forEach((url) => URL.revokeObjectURL(url));
      }
    };

    loadImages();

    return () => {
      cancelled = true;
      createdUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [news]);

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

  return (
    <section
      id="news"
      className="bg-[#161316] px-5 py-24 sm:px-8 lg:px-16"
    >
      <div className="mx-auto max-w-7xl">

        {/* Section Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <span className="mb-4 inline-flex items-center gap-2 text-xs font-bold tracking-[0.25em] text-[#FF6D29]">
              <span className="h-2 w-2 rounded-full bg-[#FF6D29]" />
              NEWS & UPDATES
            </span>

            <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Latest news
              <br />
              <span className="text-[#FF6D29]">from our ward.</span>
            </h2>
          </div>

          <p className="max-w-md text-sm leading-7 text-[#BABABA] sm:text-base">
            Stay informed about the latest activities, announcements and
            initiatives from Ward No. 2.
          </p>
        </motion.div>

        {/* News Cards */}
        {news.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item, index) => (
              <Link
  to={`/news/${item.id || item._id}`}
  key={item.id || item._id || index}
  className="block h-full"
>
                <motion.article
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group h-full overflow-hidden rounded-2xl border border-white/[0.07] bg-[#211d20] transition-all duration-300 hover:border-[#FF6D29]/40"
                >
                  {/* Cover Image */}
                  <div className="relative h-56 overflow-hidden bg-[#2b2428]">
                    {mediaUrls[item.coverId] ? (
                      <img
                        src={mediaUrls[item.coverId]}
                        alt={item.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <Newspaper size={52} className="text-[#FF6D29]/40" />
                      </div>
                    )}

                    <span className="absolute left-4 top-4 rounded-full border border-[#FF6D29]/30 bg-[#161316]/90 px-3 py-1.5 text-[10px] font-bold tracking-widest text-[#FF6D29]">
                      WARD NEWS
                    </span>

                    {(item.photos?.length > 0 || item.videos?.length > 0) && (
                      <div className="absolute bottom-4 right-4 flex gap-2">
                        {item.photos?.length > 0 && (
                          <span className="rounded-lg bg-black/70 px-2.5 py-1.5 text-xs text-white">
                            {item.photos.length} Photos
                          </span>
                        )}

                        {item.videos?.length > 0 && (
                          <span className="rounded-lg bg-black/70 px-2.5 py-1.5 text-xs text-white">
                            {item.videos.length} Videos
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 sm:p-7">
                    <div className="flex items-center gap-2 text-xs text-[#BABABA]">
                      <CalendarDays size={14} className="text-[#FF6D29]" />
                      {formatDate(item.date)}
                    </div>

                    <h3 className="mt-4 line-clamp-2 text-xl font-bold leading-snug text-white">
                      {item.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-[#BABABA]">
                      {item.description}
                    </p>

                    <div className="mt-6 flex items-center justify-between border-t border-white/[0.07] pt-5 text-sm font-semibold text-white transition-colors group-hover:text-[#FF6D29]">
                      <span>Read Full Update</span>
                      <ArrowUpRight
                        size={18}
                        className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1"
                      />
                    </div>
                  </div>
                </motion.article>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-white/[0.07] bg-[#211d20] px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FF6D29]/10">
              <Newspaper size={30} className="text-[#FF6D29]" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              No news updates yet
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#BABABA]">
              New announcements and ward activities will appear here as soon
              as they are published.
            </p>
          </div>
        )}

        {/* View All News */}
        <div className="mt-10 flex justify-center">
          <Link
            to="/news"
            className="inline-flex items-center gap-3 rounded-xl border border-[#FF6D29]/40 bg-[#FF6D29]/10 px-7 py-4 text-sm font-bold text-[#FF6D29] transition-all hover:bg-[#FF6D29] hover:text-white"
          >
            View All News
            <ArrowUpRight size={18} />
          </Link>
        </div>

      </div>
    </section>
  );
}
