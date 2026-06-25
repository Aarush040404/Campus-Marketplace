import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Plus, Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">

      {/* Top Navbar */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-wide"
        >
          <span className="text-white">Campus</span>
          <span className="text-orange-500">Market</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="flex items-center w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              placeholder="Search books, laptops, calculators..."
              className="w-full bg-transparent outline-none ml-3 text-white placeholder-slate-400"
            />
          </div>
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4">

          <Link
            to="/my-listings"
            className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition"
          >
            My Listings
          </Link>

          <Link
            to="/create-listing"
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition"
          >
            <Plus size={18} />
            Sell
          </Link>

          <Link
            to="/login"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-xl transition"
          >
            Login
          </Link>

        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

   {/* Mobile Search */}
{!isOpen && (
  <div className="md:hidden px-4 pb-4">

    <div className="flex items-center bg-slate-800 border border-slate-700 rounded-xl px-4 py-3">

      <Search
        size={18}
        className="text-slate-400"
      />

      <input
        type="text"
        placeholder="Search products..."
        className="w-full bg-transparent outline-none ml-3 text-white placeholder-slate-400"
      />

    </div>

  </div>
)}

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden px-4 pb-4">

          <div className="flex flex-col gap-3">

            <Link
              to="/my-listings"
              onClick={() => setIsOpen(false)}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-3 rounded-xl text-center transition"
            >
              My Listings
            </Link>

            <Link
              to="/create-listing"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl transition"
            >
              <Plus size={18} />
              Sell
            </Link>

            <Link
              to="/login"
              onClick={() => setIsOpen(false)}
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-3 rounded-xl text-center transition"
            >
              Login
            </Link>

          </div>

        </div>
      )}

    </nav>
  );
}