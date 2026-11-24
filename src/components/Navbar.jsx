
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  Landmark,
} from "lucide-react";

const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About Ward", href: "#about" },
  { name: "Services", href: "#services" },
  { name: "Development", href: "#development" },
  { name: "Team", href: "/ward-team" },
  
  
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#161316]/90 backdrop-blur-xl">
        <nav className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* BRAND */}
          <a href="#home" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center">
  <img
    src="/bjp-logo.png"
    alt="BJP Lotus"
    className="h-11 w-11 object-contain"
  />
</div>

            <div className="leading-tight">
              <h1 className="text-[17px] font-extrabold tracking-tight text-white">
                WARD<span className="text-[#FF6D29]">02</span>
              </h1>
              <p className="mt-1 text-[9px] font-semibold uppercase tracking-[2px] text-[#BABABA]">
                Bareilly · Uttar Pradesh
              </p>
            </div>
          </a>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative text-[13px] transition-colors duration-300 hover:text-[#FF6D29] ${
                  index === 0
                    ? "font-semibold text-[#FF6D29]"
                    : "text-[#BABABA]"
                }`}
              >
                {link.name}

                {index === 0 && (
                  <span className="absolute -bottom-2 left-0 h-[2px] w-full rounded-full bg-[#FF6D29]" />
                )}
              </a>
            ))}
          </div>

          {/* DESKTOP CONTACT */}
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full bg-[#FF6D29] px-5 py-3 text-[13px] font-bold text-[#161316] transition-all duration-300 hover:bg-[#ff854c] hover:shadow-[0_0_25px_rgba(255,109,41,0.2)] lg:flex"
          >
            Get in Touch
            <ArrowUpRight size={16} />
          </a>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#453027] bg-[#24160F] text-white transition-colors hover:border-[#FF6D29] lg:hidden"
          >
            {menuOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </nav>
      </header>

      {/* MOBILE MENU DRAWER */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* BACKDROP */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
            />

            {/* DRAWER */}
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22 }}
              className="fixed left-0 right-0 top-[76px] z-[70] border-b border-[#453027] bg-[#1C120E] p-5 shadow-2xl lg:hidden"
            >
              <div className="mb-5 flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[2px] text-[#BABABA]">
                  Navigation
                </p>
                <span className="rounded-full bg-[#453027] px-3 py-1 text-[10px] text-[#FF6D29]">
                  WARD 02
                </span>
              </div>

              <div className="flex flex-col">
                {navLinks.map((link, index) => (
                  <motion.a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04 }}
                    className="flex items-center justify-between border-b border-white/[0.06] py-4 text-[15px] text-white transition-colors hover:text-[#FF6D29]"
                  >
                    {link.name}
                    <ArrowUpRight size={16} className="text-[#FF6D29]" />
                  </motion.a>
                ))}
              </div>

              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF6D29] py-3.5 text-sm font-bold text-[#161316]"
              >
                Contact Ward Office
                <ArrowUpRight size={17} />
              </a>

              <p className="mt-5 text-center text-[10px] tracking-wide text-[#BABABA]">
                Your Ward. Your Voice. Your Future.
              </p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
