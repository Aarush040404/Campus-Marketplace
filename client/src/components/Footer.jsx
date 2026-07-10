import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#050c17]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link to="/" className="font-black text-lg">
          <span className="text-white">Campus</span><span className="text-orange-500">Market</span>
        </Link>
        <p className="text-slate-500 text-sm flex items-center gap-1.5">
          Built for students, with <Heart size={14} className="text-orange-500" fill="currentColor" /> on campus · © 2026
        </p>
      </div>
    </footer>
  );
}
