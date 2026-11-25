
import { useState } from "react";
import { motion } from "framer-motion";
import { LockKeyhole, Eye, EyeOff, ArrowRight, ShieldCheck } from "lucide-react";
import { loginAdmin } from "../utils/wardTeamApi";

export default function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

async function handleSubmit(e) {
  e.preventDefault();
  setError("");

  try {
    await loginAdmin(username, password);
    onLogin();
  } catch (error) {
    setError(error.message || "Invalid username or password.");
  }
}

  return (
    <div className="min-h-screen bg-[#161316] flex items-center justify-center px-5 py-10 relative overflow-hidden">
      
      <div className="absolute w-[350px] h-[350px] bg-[#FF6D29]/10 blur-[120px] rounded-full top-[-100px] right-[-80px]" />
      <div className="absolute w-[300px] h-[300px] bg-[#FF6D29]/10 blur-[120px] rounded-full bottom-[-100px] left-[-80px]" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-[440px]"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-[#FF6D29] flex items-center justify-center mx-auto shadow-lg shadow-orange-900/20">
            <LockKeyhole size={28} className="text-white" />
          </div>

          <h1 className="text-white text-3xl font-extrabold mt-5">
            WARD<span className="text-[#FF6D29]">.02</span>
          </h1>

          <p className="text-white/40 text-xs tracking-[3px] mt-2">
            ADMINISTRATOR PORTAL
          </p>
        </div>

        <div className="bg-white rounded-[28px] p-7 sm:p-9 shadow-2xl">
          <div className="mb-7">
            <h2 className="text-2xl font-extrabold text-[#161316]">
              Welcome back
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Login to manage your ward website.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs font-bold text-gray-700">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full mt-2 px-4 py-3.5 rounded-xl border border-gray-200 outline-none focus:border-[#FF6D29] transition-colors text-sm text-[#161316] placeholder:text-gray-400"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-700">
                Password
              </label>
              <div className="relative mt-2">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                 className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 outline-none focus:border-[#FF6D29] transition-colors text-sm text-[#161316] placeholder:text-gray-400"
                  required
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 font-medium">{error}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-[#FF6D29] hover:bg-[#e95c1c] text-white py-3.5 rounded-xl font-bold text-sm transition-colors"
            >
              Sign In <ArrowRight size={17} />
            </button>
          </form>

          <div className="flex items-center gap-2 justify-center mt-6 text-gray-400">
            <ShieldCheck size={15} />
            <p className="text-[11px]">Ward Management Access</p>
          </div>
        </div>

        <p className="text-center text-white/30 text-xs mt-6">
          Ward No. 02 · Bareilly, Uttar Pradesh
        </p>
      </motion.div>
    </div>
  );
}
