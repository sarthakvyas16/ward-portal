import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Eye, TrendingUp } from "lucide-react";
import { Counter } from "counterapi";

const WORKSPACE = "ward02-jatav-pura";
const COUNTER_NAME = "website-visits";
const SESSION_KEY = "ward02_visit_counted";

const counter = new Counter({
  workspace: WORKSPACE,
});

export default function VisitorCounter() {
  const [count, setCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadCounter() {
      try {
        let result;

        // Is session mein pehli baar visit count karo
        if (!sessionStorage.getItem(SESSION_KEY)) {
          result = await counter.up(COUNTER_NAME);
          sessionStorage.setItem(SESSION_KEY, "true");
        } else {
          // Same session mein dobara count nahi badhega
          result = await counter.get(COUNTER_NAME);
        }

        if (!cancelled) {
          setCount(result.data.up_count);
          setError(false);
        }
      } catch (err) {
        console.error("Visitor Counter Error:", err);

        if (!cancelled) setError(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadCounter();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-4 pb-16 pt-4 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl border border-[#453027] bg-[#201B19] p-6 sm:p-10"
        >
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF6D29]/10 text-[#FF6D29]">
              <Eye size={26} />
            </div>

            <p className="mt-4 text-xs font-bold uppercase tracking-[3px] text-[#BABABA]">
              Website Statistics
            </p>

            <h2 className="mt-2 text-xl sm:text-2xl font-bold text-white">
              कुल वेबसाइट विज़िटर
            </h2>

            <motion.p
              key={count}
              initial={{ opacity: 0.5, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-4xl sm:text-6xl font-black tracking-wider text-[#FF6D29]"
            >
              {loading
                ? "..."
                : error
                ? "Unavailable"
                : count?.toLocaleString("en-IN")}
            </motion.p>

            <div className="mt-4 flex items-center gap-2 text-sm text-[#BABABA]">
              <TrendingUp size={16} className="text-[#FF6D29" />
              <span>Ward 02 · Jatav Pura</span>
            </div>

            <p className="mt-3 text-xs text-[#777]">
              {error
                ? "Counter load nahi hua. Refresh karke try karein."
                : "Visitors count is updated live through CounterAPI."}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}