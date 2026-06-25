export default function Hero() {
  return (
    <section className="bg-slate-950 text-white">

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-20">

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

            Find textbooks, calculators, electronics,
            cycles, hostel essentials and more from
            students around your campus.

          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">

            <button className="bg-orange-500 hover:bg-orange-600 px-8 py-4 rounded-xl font-semibold transition">
              Browse Listings
            </button>

            <button className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-8 py-4 rounded-xl font-semibold transition">
              Sell Something
            </button>

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