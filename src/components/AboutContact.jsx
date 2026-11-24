
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Landmark,
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
} from "lucide-react";

const contactItems = [
  {
    icon: MapPin,
    label: "WARD OFFICE",
    value: "Ward No. 2, Bareilly, Uttar Pradesh",
  },
  {
    icon: Phone,
    label: "CONTACT NUMBER",
    value: "Contact details to be updated",
  },
  {
    icon: Mail,
    label: "EMAIL",
    value: "Email address to be updated",
  },
  {
    icon: Clock,
    label: "OFFICE HOURS",
    value: "Office timings to be updated",
  },
];

export default function AboutContact() {
  return (
    <>
      {/* ABOUT WARD */}
      <section id="about" className="px-5 py-24 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left */}
            <motion.div
              initial={{ opacity: 0, x: -25 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="mb-5 flex items-center gap-2 text-[#FF6D29]">
                <Landmark size={18} />
                <span className="text-xs font-bold tracking-[3px]">
                  ABOUT OUR WARD
                </span>
              </div>

              <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
                A Ward That
                <br />
                <span className="text-[#FF6D29]">Moves Forward.</span>
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-8 text-[#BABABA] md:text-base">
                Ward No. 2 ka ye digital platform residents aur ward
                administration ke beech communication ko accessible,
                transparent aur convenient banane ki ek initiative hai.
              </p>

              <p className="mt-4 max-w-xl text-sm leading-8 text-[#BABABA] md:text-base">
                Safai, road, drainage, street lights aur public
                facilities se judi information aur complaints ko
                ek hi platform par lana hamara objective hai.
              </p>

              <a
                href="#services"
                className="group mt-8 inline-flex items-center gap-3 rounded-full bg-[#FF6D29] px-6 py-4 text-sm font-bold text-[#161316] transition hover:bg-[#F6D2BD]"
              >
                Explore Ward Services
                <ArrowUpRight
                  size={17}
                  className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
                />
              </a>
            </motion.div>

            {/* Right visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative overflow-hidden rounded-[32px] border border-white/10 bg-[#201c20] p-8 md:p-12"
            >
              <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF6D29]/10 blur-[80px]" />

              <div className="relative">
                <p className="text-xs font-bold tracking-[3px] text-[#FF6D29]">
                  OUR COMMITMENT
                </p>

                <div className="mt-8 text-[130px] font-extrabold leading-none tracking-tighter text-[#FF6D29] md:text-[180px]">
                  02
                </div>

                <div className="mt-5 h-px bg-white/10" />

                <div className="mt-6 flex items-end justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold">Ward No. 2</h3>
                    <p className="mt-2 text-sm text-[#BABABA]">
                      Bareilly, Uttar Pradesh
                    </p>
                  </div>

                  <MapPin className="mb-1 text-[#FF6D29]" size={25} />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="px-5 pb-24 pt-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12">
            <p className="mb-4 text-xs font-bold tracking-[3px] text-[#FF6D29]">
              GET IN TOUCH
            </p>

            <h2 className="text-4xl font-extrabold tracking-tight md:text-6xl">
              We're Here to <span className="text-[#FF6D29]">Help.</span>
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-[#BABABA]">
              Ward se related kisi bhi issue, query ya suggestion
              ke liye contact details aur complaint facility ka use karein.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {contactItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-3xl border border-white/[0.07] bg-[#201c20] p-6 transition hover:border-[#FF6D29]/30"
                >
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF6D29]/10 text-[#FF6D29]">
                    <Icon size={21} />
                  </div>

                  <p className="text-[10px] font-bold tracking-[2px] text-[#FF6D29]">
                    {item.label}
                  </p>

                  <p className="mt-3 text-sm leading-7 text-white">
                    {item.value}
                  </p>
                </motion.div>
);
})}
</div>

          {/* Contact CTA */}
          <div className="mt-8 flex flex-col justify-between gap-6 rounded-3xl border border-[#FF6D29]/20 bg-[#FF6D29]/5 p-7 md:flex-row md:items-center md:p-10">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6D29] text-[#161316]">
                <MessageCircle size={22} />
              </div>

              <div>
                <h3 className="text-xl font-bold">Have an issue in your area?</h3>
                <p className="mt-2 text-sm leading-7 text-[#BABABA]">
                  Submit your complaint through our online complaint form.
                </p>
              </div>
            </div>

            <a
              href="#complaint"
              className="group flex w-fit items-center gap-3 rounded-full bg-[#FF6D29] px-6 py-4 text-sm font-bold text-[#161316] transition hover:bg-[#F6D2BD]"
            >
              Report an Issue
              <ArrowUpRight
                size={17}
                className="transition group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
