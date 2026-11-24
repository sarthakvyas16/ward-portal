import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Development from "../components/Development";

export default function DevelopmentPage() {
  return (
    <main className="min-h-screen bg-[#161316]">
      <div className="px-5 md:px-10 lg:px-16 pt-8 max-w-7xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#BABABA] hover:text-[#FF6D29] transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Home
        </Link>
      </div>

      <Development fullPage />
    </main>
  );
}