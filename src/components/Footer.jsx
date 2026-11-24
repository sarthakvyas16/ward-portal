
import {
  ArrowUpRight,
  ChevronRight,
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
} from "lucide-react";

const quickLinks = [
  ["Home", "#home"],
  ["About Ward", "#about"],
  ["Services", "#services"],
  ["Development", "#development"],
  ["Gallery", "#gallery"],
  ["Contact", "#contact"],
];

const services = [
  ["Complaint Registration", "#complaint"],
  ["Track Complaint", "#tracking"],
  ["Ward Updates", "#updates"],
  ["Development Works", "#development"],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#161316] px-5 pt-16 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        {/* Top CTA */}
        <div className="mb-16 flex flex-col justify-between gap-6 rounded-3xl border border-[#FF6D29]/20 bg-[#FF6D29]/5 p-7 md:flex-row md:items-center md:p-10">
          <div>
            <p className="mb-3 text-xs font-bold tracking-[3px] text-[#FF6D29]">
              YOUR WARD, YOUR VOICE
            </p>
            <h2 className="text-2xl font-extrabold md:text-4xl">
              Let's make our ward <span className="text-[#FF6D29]">better.</span>
            </h2>
            <p className="mt-3 text-sm text-[#BABABA]">
              Report a problem and be a part of positive change.
            </p>
          </div>

          <a
            href="#complaint"
            className="group flex w-fit items-center gap-3 rounded-full bg-[#FF6D29] px-6 py-4 text-sm font-bold text-[#161316] transition hover:bg-[#F6D2BD]"
          >
            Report an Issue
            <ArrowUpRight
              size={18}
              className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
            />
          </a>
        </div>

        {/* Footer columns */}
        <div className="grid gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <a href="#home" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6D29] text-[#161316]">
                <Landmark size={23} />
              </div>
              <div>
                <p className="text-xl font-extrabold">
                  WARD<span className="text-[#FF6D29]">02</span>
                </p>
                <p className="text-[10px] tracking-[2px] text-[#BABABA]">
                  BAREILLY, U.P.
                </p>
              </div>
            </a>

            <p className="mt-5 max-w-xs text-sm leading-7 text-[#BABABA]">
              Together for a cleaner, greener and better ward.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-sm font-bold">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-2 text-sm text-[#BABABA] transition hover:text-[#FF6D29]"
                  >
                    <ChevronRight
                      size={15}
                      className="text-[#FF6D29] transition group-hover:translate-x-1"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-sm font-bold">Citizen Services</h3>
            <ul className="space-y-3">
              {services.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    className="group flex items-center gap-2 text-sm text-[#BABABA] transition hover:text-[#FF6D29]"
                  >
                    <ChevronRight
                      size={15}
                      className="text-[#FF6D29] transition group-hover:translate-x-1"
                    />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="footer-contact">
            <h3 className="mb-5 text-sm font-bold">Ward Information</h3>

            <div className="space-y-4 text-sm text-[#BABABA]">
              <div className="flex items-start gap-3">
                <MapPin size={17} className="mt-1 shrink-0 text-[#FF6D29]" />
                <span>Ward No. 2, Bareilly, Uttar Pradesh</span>
              </div>

              <div className="flex items-start gap-3">
                <Phone size={17} className="mt-1 shrink-0 text-[#FF6D29]" />
                <span>Contact details to be updated</span>
              </div>

              <div className="flex items-start gap-3">
                <Mail size={17} className="mt-1 shrink-0 text-[#FF6D29]" />
                <span>Email address to be updated</span>
              </div>

              <div className="flex items-start gap-3">
                <Clock size={17} className="mt-1 shrink-0 text-[#FF6D29]" />
                <span>Office timings to be updated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col justify-between gap-3 border-t border-white/10 py-6 text-xs text-[#777] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Ward No. 2, Bareilly. All rights reserved.</p>
          <p className="text-[#BABABA]">
  Designed & Developed by{" "}
  <span className="sarthak-glow cursor-default font-bold text-white">
    Sarthak Vyas
  </span>
</p>
        </div>
      </div>
    </footer>
  );
}
