

import { Link } from "react-router-dom";

export default function Hero() {
  const handleBrowseClick = () => {
    const element = document.getElementById("marketplace");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="bg-slate-950 text-white relative overflow-hidden border-b border-slate-900/80">
      {/* Subtle background glow for visual depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[25rem] bg-orange-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 relative z-10">
        <div className="text-center">
          <div className="inline-block bg-orange-500/10 text-orange-400 border border-orange-500/20 px-4 py-2 rounded-full text-sm font-medium">
            🎓 Exclusively for College Students
          </div>

          <h1 className="mt-6 text-5xl md:text-7xl font-bold leading-tight">
            Buy. Sell.
            <br />
            <span className="text-orange-500">
              Save Money.
            </span>
          </h1>

          <p className="mt-6 text-slate-400 text-lg max-w-2xl mx-auto">
            Find textbooks, calculators, electronics, cycles, hostel essentials and more from students around your campus.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleBrowseClick}
              className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold transition active:scale-[0.98]"
            >
              Browse Listings
            </button>

            <Link 
              to="/sell"
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl font-semibold transition inline-block text-center active:scale-[0.98]"
            >
              Sell Something
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-3xl font-bold text-orange-500">
              500+
            </h3>
            <p className="text-slate-400 mt-2">
              Listings Posted
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-3xl font-bold text-orange-500">
              100+
            </h3>
            <p className="text-slate-400 mt-2">
              Active Sellers
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center">
            <h3 className="text-3xl font-bold text-orange-500">
              24/7
            </h3>
            <p className="text-slate-400 mt-2">
              Campus Deals
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}