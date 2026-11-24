
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Search,
  FolderOpen,
  ArrowUpRight,
} from "lucide-react";

const documents = [
  {
    title: "Ward Development Reports",
    description: "Ward mein chal rahe aur poore hue vikas karyon ki reports.",
    category: "Development",
  },
  {
    title: "Public Notices",
    description: "Ward se sambandhit official notices aur public announcements.",
    category: "Notices",
  },
  {
    title: "Ward Map",
    description: "Ward boundaries aur public-area map documents.",
    category: "Ward Information",
  },
  {
    title: "Government Schemes",
    description: "Public welfare schemes aur official information documents.",
    category: "Schemes",
  },
];

export default function Documents() {
  return (
    <section
      id="documents"
      className="relative overflow-hidden px-5 py-20 md:px-12 lg:px-20"
    >
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-3 text-[10px] font-bold tracking-[3px] text-[#FF6D29]">
              PUBLIC DOCUMENTS
            </p>
            <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
              Document <span className="text-[#FF6D29]">Centre.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-7 text-[#BABABA]">
              Ward-related public documents, notices and useful information
              in one place.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#201C20] px-4 py-3 text-xs text-[#BABABA]">
            <FolderOpen size={16} className="text-[#FF6D29]" />
            Public Document Library
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {documents.map((doc, index) => (
            <motion.div
              key={doc.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="group rounded-2xl border border-white/[0.07] bg-[#201C20] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#FF6D29]/30"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FF6D29]/10 text-[#FF6D29] transition group-hover:bg-[#FF6D29] group-hover:text-[#161316]">
                <FileText size={22} />
              </div>

              <p className="text-[9px] font-bold tracking-[2px] text-[#FF6D29]">
                {doc.category.toUpperCase()}
              </p>

              <h3 className="mt-2 text-base font-extrabold text-white">
                {doc.title}
              </h3>

              <p className="mt-2 min-h-[60px] text-xs leading-6 text-[#BABABA]">
                {doc.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-white/[0.06] pt-4">
                <span className="text-[10px] text-[#BABABA]">
                  Admin-managed
                </span>
                <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-[#FF6D29]">
                  <Download size={15} />
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-4 rounded-2xl border border-[#FF6D29]/15 bg-[#FF6D29]/[0.04] p-5 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-sm font-bold text-white">
              Looking for official election information?
            </h3>
            <p className="mt-1 text-xs text-[#BABABA]">
              Visit the Election Commission's official voter services website.
            </p>
          </div>

          <a
            href="https://voters.eci.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#FF6D29] px-4 py-3 text-xs font-bold text-[#161316] transition hover:bg-[#F6D2BD]"
          >
            Official Portal <ArrowUpRight size={15} />
          </a>
        </div>
      </div>
    </section>
  );
}
