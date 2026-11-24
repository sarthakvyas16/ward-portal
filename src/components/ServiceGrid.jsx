
import { motion } from "framer-motion";
import {
  Trash2,
  Construction,
  Droplets,
  Lightbulb,
  Trees,
  Building2,
  Waves,
  MessageCircleMore,
  ArrowUpRight,
} from "lucide-react";

const services = [
  {
    number: "01",
    title: "Safai & Garbage",
    description: "Garbage collection, sanitation and cleanliness concerns.",
    icon: Trash2,
  },
  {
    number: "02",
    title: "Roads & Potholes",
    description: "Damaged roads, potholes and repair requests.",
    icon: Construction,
  },
  {
    number: "03",
    title: "Drainage",
    description: "Blocked drains, waterlogging and sewer concerns.",
    icon: Waves,
  },
  {
    number: "04",
    title: "Street Lights",
    description: "Non-working street lights and dark public areas.",
    icon: Lightbulb,
  },
  {
    number: "05",
    title: "Water Supply",
    description: "Water interruptions, leakage and supply issues.",
    icon: Droplets,
  },
  {
    number: "06",
    title: "Public Facilities",
    description: "Public infrastructure and common-area maintenance.",
    icon: Building2,
  },
  {
    number: "07",
    title: "Parks & Greenery",
    description: "Park upkeep, greenery and environmental concerns.",
    icon: Trees,
  },
  {
    number: "08",
    title: "Other Issues",
    description: "Any other local concern that needs attention.",
    icon: MessageCircleMore,
  },
];

export default function ServiceGrid() {
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-[#161316] px-5 py-24 sm:px-8 sm:py-28 lg:px-12"
    >
      {/* Background glow */}
      <div className="pointer-events-none absolute -right-40 top-20 h-80 w-80 rounded-full bg-[#FF6D29]/[0.07] blur-[120px]" />

      <div className="relative mx-auto max-w-[1440px]">
        {/* Section heading */}
        <div className="mb-12 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-5 flex items-center gap-3">
              <span className="h-[2px] w-8 bg-[#FF6D29]" />
              <p className="text-[10px] font-bold uppercase tracking-[3px] text-[#FF6D29]">
                Citizen Services
              </p>
            </div>

            <h2 className="max-w-2xl text-4xl font-bold leading-tight tracking-[-1.5px] text-white sm:text-5xl">
              How can we
              <br />
              <span className="text-[#FF6D29]">help your ward?</span>
            </h2>
          </div>

          <p className="max-w-sm text-sm leading-7 text-[#BABABA] md:pb-2">
            Find the right service for your concern. We believe every
            neighbourhood issue deserves attention.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {services.map((service, index) => {
            const Icon = service.icon;

            return (
              <motion.div
                key={service.number}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{
                  duration: 0.45,
                  delay: (index % 4) * 0.06,
                }}
                whileHover={{ y: -5 }}
                className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-2xl border border-[#453027] bg-[#24160F] p-6 transition-colors duration-300 hover:border-[#FF6D29]/50 hover:bg-[#2A1B12] sm:min-h-[250px]"
              >
                {/* Top row */}
                <div className="flex items-start justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F6D2BD] text-[#453027] transition-colors duration-300 group-hover:bg-[#FF6D29]">
                    <Icon size={21} strokeWidth={1.8} />
                  </div>

                  <span className="text-[10px] font-semibold tracking-[1px] text-[#BABABA]/50">
                    {service.number}
                  </span>
                </div>

                {/* Content */}
                <div className="mt-7">
                  <h3 className="text-lg font-bold text-white transition-colors group-hover:text-[#FF6D29]">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-xs leading-6 text-[#BABABA]">
                    {service.description}
                  </p>
                </div>

                {/* Bottom accent */}
                <div className="mt-auto flex items-center justify-between pt-5">
                  <div className="h-[2px] w-8 bg-[#453027] transition-all duration-300 group-hover:w-14 group-hover:bg-[#FF6D29]" />

                  <ArrowUpRight
                    size={17}
                    className="text-[#BABABA] transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-[#FF6D29]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <div className="mt-8 flex items-start gap-3 rounded-xl border border-[#453027]/70 bg-[#1C120E] p-4 sm:items-center">
          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FF6D29]/10 text-[#FF6D29]">
            <MessageCircleMore size={16} />
          </div>
          <p className="text-xs leading-6 text-[#BABABA]">
            Unable to find your concern? You will be able to submit
            other issues through our complaint registration system.
          </p>
        </div>
      </div>
    </section>
  );
}
