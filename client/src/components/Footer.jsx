import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">

      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">

        <Link
          to="/"
          className="font-bold text-lg"
        >
          <span className="text-white">Campus</span>
          <span className="text-orange-500">Market</span>
        </Link>

        <p className="text-slate-500 text-sm mt-2 md:mt-0">
          © 2026 CampusMarket
        </p>

      </div>

    </footer>
  );
}