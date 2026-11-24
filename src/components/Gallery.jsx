
import { motion } from "framer-motion";
import { ArrowUpRight, Images } from "lucide-react";

const galleryItems = [
  {
    title: "Community & People",
    category: "COMMUNITY",
    image:
      "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=900&q=85",
    size: "large",
  },
  {
    title: "Clean Surroundings",
    category: "CLEANLINESS",
    image:
      "https://images.unsplash.com/photo-1565402170291-8491f6b8d1f0?auto=format&fit=crop&w=900&q=85",
    size: "small",
  },
  {
    title: "Green Neighbourhood",
    category: "ENVIRONMENT",
    image:
      "https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=900&q=85",
    size: "small",
  },
  {
    title: "Infrastructure & Roads",
    category: "DEVELOPMENT",
    image:
      "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?auto=format&fit=crop&w=900&q=85",
    size: "large",
  },
];

export default function Gallery() {
  return (
    <section id="gallery" className="px-5 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="mb-4 flex items-center gap-2 text-[#FF6D29]">
              <Images size={18} />
              <span className="text-xs font-bold tracking-[3px]">
                WARD IN PICTURES
              </span>
            </div>

            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              Our <span className="text-[#FF6D29]">Gallery.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#BABABA] md:text-base">
              Ward ki activities, community initiatives aur development
              moments ki jhalak.
            </p>
          </div>

          <span className="text-xs tracking-widest text-[#BABABA]">
            COMMUNITY · DEVELOPMENT · CHANGE
          </span>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {galleryItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative h-[280px] overflow-hidden rounded-3xl border border-white/10 sm:h-[340px] md:h-[420px]"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              {/* Image overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#161316]/95 via-[#161316]/20 to-transparent" />

              {/* Category */}
              <div className="absolute left-5 top-5">
                <span className="rounded-full border border-white/20 bg-black/30 px-3 py-2 text-[10px] font-bold tracking-widest text-white backdrop-blur-md">
                  {item.category}
                </span>
              </div>

              {/* Title */}
              <div className="absolute bottom-0 left-0 flex w-full items-end justify-between p-6 md:p-8">
                <h3 className="text-2xl font-extrabold text-white md:text-3xl">
                  {item.title}
                </h3>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FF6D29] text-[#161316] transition duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={20} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
