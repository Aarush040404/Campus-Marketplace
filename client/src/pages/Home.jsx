import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import { RefreshCw, Search } from "lucide-react";
import Hero from "../components/Hero";
import PageShell from "../components/PageShell";
import ProductCard from "../components/ProductCard";
import { api, categories } from "../lib/api";

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    if (location.hash === "#marketplace") {
      const element = document.getElementById("marketplace");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [location]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true);
    const controller = new AbortController();
    const params = new URLSearchParams({ limit: "24", search, category, sort });
    api(`/listings?${params}`, { signal: controller.signal })
      .then((data) => setListings(data.items))
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message);
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, [search, category, sort]);

  const updateFilter = (name, value) => {
    const next = new URLSearchParams(searchParams);
    if (!value || value === "All" || value === "newest") next.delete(name);
    else next.set(name, value);
    setSearchParams(next);
  };

  return (
    <PageShell>

      <Hero search={search} onSearch={(event) => {
        event.preventDefault();
        updateFilter("search", new FormData(event.currentTarget).get("search"));
        document.getElementById("marketplace")?.scrollIntoView();
      }} />

      <section id="marketplace" className="max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-20 scroll-mt-20">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-orange-400 uppercase tracking-[.22em] text-xs font-black">Fresh on campus</p>
            <h2 className="mt-3 text-3xl md:text-4xl font-black text-white">
              {search ? `Results for “${search}”` : "Browse student listings"}
            </h2>
            <p className="mt-2 text-slate-400">{loading ? "Finding the best deals…" : `${listings.length} listing${listings.length === 1 ? "" : "s"} found`}</p>
          </div>
          <select value={sort} onChange={(event) => updateFilter("sort", event.target.value)} className="field lg:w-48">
            <option value="newest">Newest first</option>
            <option value="price-low">Price: low to high</option>
            <option value="price-high">Price: high to low</option>
          </select>
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto pb-2">
          {categories.map((item) => (
            <button
              key={item}
              onClick={() => updateFilter("category", item)}
              className={`shrink-0 px-4 py-2.5 rounded-xl text-sm font-semibold border transition ${
                category === item ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {error ? (
          <div className="mt-10 border border-red-900 bg-red-950/20 rounded-2xl p-10 text-center">
            <p className="text-red-200">{error}</p>
            <button onClick={() => window.location.reload()} className="mt-4 inline-flex items-center gap-2 text-white"><RefreshCw size={17} /> Try again</button>
          </div>
        ) : loading ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }, (_, index) => (
              <div key={index} className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden animate-pulse">
                <div className="aspect-[4/3] bg-slate-800" />
                <div className="p-5 space-y-4">
                  <div className="h-4 bg-slate-800 rounded w-1/4" />
                  <div className="h-6 bg-slate-800 rounded w-3/4" />
                  <div className="h-8 bg-slate-800 rounded w-1/3" />
                  <div className="pt-4 border-t border-slate-800 flex justify-between gap-3">
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                    <div className="h-4 bg-slate-800 rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : listings.length ? (
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {listings.map((listing) => <ProductCard key={listing.id} listing={listing} />)}
          </div>
        ) : (
          <div className="mt-10 border border-slate-800 bg-slate-900/60 rounded-2xl p-12 text-center">
            <Search className="mx-auto text-slate-600" size={36} />
            <h3 className="mt-4 text-xl font-bold text-white">No matches yet</h3>
            <p className="mt-2 text-slate-400">Try another search or clear the category filter.</p>
            <button onClick={() => setSearchParams({})} className="mt-5 text-orange-400 font-semibold">Clear all filters</button>
          </div>
        )}
      </section>
    </PageShell>
  );
}
