import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Eye, MessageCircle, PackageOpen, Pencil, Plus, Trash2 } from "lucide-react";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { api, formatPrice, resolveImage } from "../lib/api";

const statusStyles = {
  Active: "text-emerald-300 bg-emerald-500/10 border-emerald-500/20",
  Paused: "text-amber-300 bg-amber-500/10 border-amber-500/20",
  Sold: "text-slate-300 bg-slate-700/50 border-slate-600",
};

export default function MyListings() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState("All");
  const location = useLocation();

  useEffect(() => {
    api("/listings/mine")
      .then((data) => setListings(data.listings))
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const visible = status === "All" ? listings : listings.filter((listing) => listing.status === status);
  const stats = useMemo(() => ({
    active: listings.filter((listing) => listing.status === "Active").length,
    views: listings.reduce((sum, listing) => sum + listing.views, 0),
    inquiries: listings.reduce((sum, listing) => sum + listing.inquiries, 0),
  }), [listings]);

  const updateStatus = async (listing, nextStatus) => {
    try {
      const data = await api(`/listings/${listing.id}`, { method: "PATCH", body: JSON.stringify({ status: nextStatus }) });
      setListings((items) => items.map((item) => item.id === listing.id ? data.listing : item));
    } catch (requestError) {
      setError(requestError);
    }
  };

  const remove = async (listing) => {
    if (!window.confirm(`Delete “${listing.title}”? This cannot be undone.`)) return;
    try {
      await api(`/listings/${listing.id}`, { method: "DELETE" });
      setListings((items) => items.filter((item) => item.id !== listing.id));
    } catch (requestError) {
      setError(requestError);
    }
  };

  return (
    <PageShell>
      <section className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div><p className="text-orange-400 font-bold">Seller dashboard</p><h1 className="mt-3 text-4xl md:text-5xl font-black text-white">My listings</h1><p className="mt-2 text-slate-400">Manage availability and see how your products are doing.</p></div>
          <Link to="/sell" className="inline-flex items-center justify-center gap-2 bg-orange-500 px-5 py-3 rounded-xl text-white font-bold"><Plus size={18} /> New listing</Link>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">
        {location.state?.notice && <div className="mb-6"><StatusMessage success={location.state.notice} /></div>}
        <div className="grid grid-cols-3 gap-3 md:gap-5">
          {[
            ["Active", stats.active, PackageOpen],
            ["Total views", stats.views, Eye],
            ["Inquiries", stats.inquiries, MessageCircle],
          ].map(([label, value, Icon]) => <div key={label} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6"><Icon className="text-orange-400" size={20} /><p className="mt-4 text-2xl md:text-3xl font-black text-white">{value}</p><p className="mt-1 text-xs md:text-sm text-slate-500">{label}</p></div>)}
        </div>
        <div className="mt-7 flex gap-2 overflow-auto pb-2">
          {["All", "Active", "Paused", "Sold"].map((item) => <button key={item} onClick={() => setStatus(item)} className={`px-4 py-2 rounded-xl text-sm font-semibold border ${status === item ? "bg-orange-500 border-orange-500 text-white" : "bg-slate-900 border-slate-800 text-slate-400"}`}>{item}</button>)}
        </div>
        <div className="mt-6"><StatusMessage error={error} /></div>
        {loading ? (
          <div className="mt-7 space-y-4">
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden grid md:grid-cols-[180px_1fr] animate-pulse">
                <div className="w-full h-52 md:h-full min-h-[180px] bg-slate-800" />
                <div className="p-5 md:p-6 space-y-4">
                  <div className="h-5 bg-slate-800 rounded w-1/6" />
                  <div className="h-7 bg-slate-800 rounded w-1/3" />
                  <div className="h-4 bg-slate-800 rounded w-1/2" />
                  <div className="pt-5 border-t border-slate-800 flex flex-wrap gap-2">
                    <div className="h-9 bg-slate-800 rounded-lg w-24" />
                    <div className="h-9 bg-slate-800 rounded-lg w-24" />
                    <div className="h-9 bg-slate-800 rounded-lg w-20" />
                    <div className="h-9 bg-slate-800 rounded-lg w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : visible.length ? (
          <div className="mt-7 space-y-4">
            {visible.map((listing) => (
              <article key={listing.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden grid md:grid-cols-[180px_1fr]">
                {listing.image ? <img src={resolveImage(listing.image)} alt={listing.title} className="w-full h-52 md:h-full object-cover bg-slate-800" /> : <div className="w-full h-52 md:h-full min-h-44 grid place-items-center bg-slate-800 text-slate-500"><PackageOpen size={34} /></div>}
                <div className="p-5 md:p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-5">
                    <div>
                      <span className={`inline-block border rounded-full px-3 py-1 text-xs font-bold ${statusStyles[listing.status]}`}>{listing.status}</span>
                      <h2 className="mt-3 text-xl md:text-2xl font-bold text-white">{listing.title}</h2>
                      <p className="mt-2 text-sm text-slate-400">{listing.category} · {listing.condition} · {listing.location}</p>
                    </div>
                    <div className="lg:text-right"><p className="text-2xl font-black text-orange-400">{formatPrice(listing.price)}</p><p className="mt-2 text-sm text-slate-500">{listing.views} views · {listing.inquiries} inquiries</p></div>
                  </div>
                  <div className="mt-5 pt-5 border-t border-slate-800 flex flex-wrap gap-2">
                    <Link to={`/listings/${listing.id}`} className="inline-flex items-center gap-2 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"><Eye size={15} /> Preview</Link>
                    <Link to={`/sell?edit=${listing.id}`} className="inline-flex items-center gap-2 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300"><Pencil size={15} /> Edit</Link>
                    {listing.status !== "Sold" && <button onClick={() => updateStatus(listing, listing.status === "Active" ? "Paused" : "Active")} className="border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">{listing.status === "Active" ? "Pause" : "Activate"}</button>}
                    {listing.status !== "Sold" && <button onClick={() => updateStatus(listing, "Sold")} className="border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300">Mark sold</button>}
                    <button onClick={() => remove(listing)} className="ml-auto inline-flex items-center gap-2 border border-red-900 rounded-lg px-3 py-2 text-sm text-red-300"><Trash2 size={15} /> Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-8 py-16 bg-slate-900 border border-slate-800 rounded-2xl text-center">
            <BarChart3 size={36} className="mx-auto text-slate-600" /><h2 className="mt-4 text-xl font-bold text-white">Nothing here yet</h2><p className="mt-2 text-slate-400">Create a listing or try another status filter.</p>
          </div>
        )}
      </section>
    </PageShell>
  );
}
