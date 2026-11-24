
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  MapPin,
  MessageSquare,
  Send,
  User,
  Phone,
} from "lucide-react";

export default function ComplaintForm() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    category: "",
    address: "",
    description: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Complaint form UI ready! Backend abhi connect nahi hua hai.");
  };

  const inputStyle =
    "w-full rounded-2xl border border-white/10 bg-[#161316] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#777] focus:border-[#FF6D29]";

  return (
    <section id="complaint" className="px-5 py-24 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-4 flex items-center gap-2 text-[#FF6D29]">
              <MessageSquare size={18} />
              <span className="text-xs font-bold tracking-[3px]">
                YOUR VOICE MATTERS
              </span>
            </div>

            <h2 className="text-4xl font-extrabold leading-tight tracking-tight md:text-6xl">
              समस्या 
              <br />
              <span className="text-[#FF6D29]">बताइए।.</span>
            </h2>

            <p className="mt-6 max-w-lg text-sm leading-8 text-[#BABABA] md:text-base">
              Aapke area ki samasya hamare liye important hai.
              Apni complaint register karein aur ward se judi
              problems ko hum tak pahunchayein.
            </p>

            <div className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6D29]/10 text-[#FF6D29]">
                  <MapPin size={21} />
                </div>
                <div>
                  <h3 className="font-bold">Area Specific Issues / क्षेत्र से जुड़ी समस्याएँ </h3>
                  <p className="mt-1 text-sm text-[#BABABA]">
                    Apne locality aur exact location ke saath problem share karein.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FF6D29]/10 text-[#FF6D29]">
                  <MessageSquare size={21} />
                </div>
                <div>
                  <h3 className="font-bold">Direct Feedback / सीधे सुझाव एवं प्रतिक्रिया</h3>
                  <p className="mt-1 text-sm text-[#BABABA]">
                    Apne ward ki civic problems aur suggestions humein batayein.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12 overflow-hidden rounded-3xl border border-[#FF6D29]/20 bg-[#FF6D29]/5 p-6">
              <p className="text-sm leading-7 text-[#BABABA]">
                <span className="font-bold text-[#FF6D29]">सूचना:</span>{" "}
                शिकायत दर्ज करने, उसकी स्थिति जानने और सूचनाएँ प्राप्त करने की सुविधाएँ सर्वर से जुड़ने के बाद सक्रिय होंगी।
              </p>
            </div>
          </motion.div>

          {/* Right Form */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl border border-white/[0.08] bg-[#201c20] p-6 md:p-9"
          >
            <div className="mb-8">
              <h3 className="text-2xl font-extrabold">Complaint Form</h3>
              <p className="mt-2 text-sm text-[#BABABA]">
                Fill in the details below to report an issue.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#BABABA]">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]"
                  />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter your full name"
                    className={`${inputStyle} pl-11`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#BABABA]">
                  Mobile Number
                </label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[#777]"
                  />
                  <input
                    name="phone"
                    type="tel"
                    pattern="[0-9]{10}"
                    maxLength={10}
                    value={form.phone}
                    onChange={handleChange}
                    required
                    placeholder="10-digit mobile number"
                    className={`${inputStyle} pl-11`}
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#BABABA]">
                  Issue Category
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  required
                  className={`${inputStyle} appearance-none`}
                >
                  <option value="" disabled>
                    Select issue category
                  </option>
                  <option value="cleaning">Safai & Garbage</option>
                  <option value="road">Road & Potholes</option>
                  <option value="drainage">Drainage Problem</option>
                  <option value="streetlight">Street Lights</option>
                  <option value="water">Water Supply</option>
                  <option value="parks">Parks & Greenery</option>
                  <option value="public">Public Facilities</option>
                  <option value="other">Other Issues</option>
                </select>
              </div>

              {/* Address */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#BABABA]">
                  Issue Location / Address
                </label>
                <div className="relative">
                  <MapPin
                    size={17}
                    className="absolute left-4 top-5 text-[#777]"
                  />
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    required
                    rows={2}
                    placeholder="Enter locality, street or landmark"
                    className={`${inputStyle} resize-none pl-11`}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-[#BABABA]">
                  Problem Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  required
                  rows={4}
                  placeholder="Describe your problem in detail..."
                  className={`${inputStyle} resize-none`}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[#FF6D29] px-6 py-4 font-bold text-[#161316] transition hover:bg-[#F6D2BD]"
              >
                Submit Complaint
                <Send
                  size={17}
                  className="transition group-hover:translate-x-1"
                />
              </button>

              <p className="text-center text-xs text-[#777]">
                UI preview only · Submission is not saved yet
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
