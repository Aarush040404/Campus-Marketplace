import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Eye, MapPin, MessageCircle, ShieldCheck, UserRound } from "lucide-react";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { api, formatPrice, resolveImage } from "../lib/api";

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api(`/listings/${id}`)
      .then((data) => setListing(data.listing))
      .catch(setError);
  }, [id]);

  const contact = async () => {
    try {
      await api(`/listings/${id}/inquiry`, { method: "POST" });
    } catch {
      // Opening the seller chat remains useful even if analytics are unavailable.
    }
    const phone = listing.whatsapp.replace(/\D/g, "");
    const text = encodeURIComponent(`Hi ${listing.seller?.name || "there"}, I'm interested in your “${listing.title}” listing on CampusMarket. Is it still available?`);
    window.open(`https://wa.me/${phone}?text=${text}`, "_blank", "noopener,noreferrer");
  };

  if (error) return <PageShell><div className="max-w-4xl mx-auto px-4 py-20"><StatusMessage error={error} /><Link to="/" className="mt-5 inline-flex items-center gap-2 text-orange-400"><ArrowLeft size={17} /> Back to marketplace</Link></div></PageShell>;
  if (!listing) return <PageShell><div className="max-w-7xl mx-auto px-4 py-20 text-slate-400">Loading listing…</div></PageShell>;

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"><ArrowLeft size={17} /> Back to marketplace</Link>
        <div className="mt-7 grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-start">
          <div className="space-y-6">
            <div className="aspect-[4/3] md:aspect-[16/10] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              {listing.image ? <img src={resolveImage(listing.image)} alt={listing.title} className="w-full h-full object-cover" /> : <div className="h-full grid place-items-center text-slate-600">No image</div>}
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white">About this item</h2>
              <p className="mt-4 text-slate-300 leading-7 whitespace-pre-line">{listing.description}</p>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <span className="text-teal-400">{listing.category}</span>
              <span className="text-slate-700">•</span>
              <span className={listing.status === "Active" ? "text-emerald-400" : "text-amber-400"}>{listing.status}</span>
            </div>
            <h1 className="mt-4 text-3xl md:text-4xl font-black text-white leading-tight">{listing.title}</h1>
            <p className="mt-5 text-4xl font-black text-orange-400">{formatPrice(listing.price)}</p>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="border border-slate-800 bg-slate-950/50 rounded-xl p-3"><p className="text-xs text-slate-500">Condition</p><p className="mt-1 font-semibold text-white">{listing.condition}</p></div>
              <div className="border border-slate-800 bg-slate-950/50 rounded-xl p-3"><p className="text-xs text-slate-500">Views</p><p className="mt-1 font-semibold text-white flex items-center gap-2"><Eye size={15} /> {listing.views}</p></div>
            </div>
            <div className="mt-6 py-5 border-y border-slate-800 space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-3"><MapPin size={17} className="text-slate-500" /> Meetup at {listing.location}</p>
              <p className="flex items-center gap-3"><CalendarDays size={17} className="text-slate-500" /> Posted {new Date(listing.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>
            <div className="mt-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-500/15 grid place-items-center text-orange-400"><UserRound size={21} /></div>
              <div><p className="font-bold text-white">{listing.seller?.name || "Campus seller"}</p><p className="text-sm text-slate-500">{listing.seller?.college || "CampusMarket member"}</p></div>
            </div>
            <button onClick={contact} disabled={listing.status !== "Active"} className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 py-4 rounded-xl text-white font-bold transition">
              <MessageCircle size={20} /> {listing.status === "Active" ? "Chat on WhatsApp" : "Listing unavailable"}
            </button>
            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><ShieldCheck size={15} /> Meet in a public campus area and verify before paying.</p>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
