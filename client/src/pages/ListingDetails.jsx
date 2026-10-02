import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Clock, Eye, MapPin, MessageCircle, ShieldCheck, Sparkles, Tag, UserRound } from "lucide-react";
import PageShell from "../components/PageShell";
import ProductCard from "../components/ProductCard";
import StatusMessage from "../components/StatusMessage";
import { api, formatPrice, resolveImage } from "../lib/api";

export default function ListingDetails() {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    api(`/listings/${id}`)
      .then((data) => {
        if (active) setListing(data.listing);
      })
      .catch((err) => {
        if (active) setError(err);
      });

    api(`/listings/${id}/recommendations?limit=4`)
      .then((data) => {
        if (active) setRecommendations(data.recommendations || []);
      })
      .catch(() => {
        if (active) setRecommendations([]);
      });

    return () => {
      active = false;
    };
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

  if (error) {
    return (
      <PageShell>
        <div className="max-w-4xl mx-auto px-4 py-20">
          <StatusMessage error={error} />
          <Link to="/" className="mt-5 inline-flex items-center gap-2 text-orange-400">
            <ArrowLeft size={17} /> Back to marketplace
          </Link>
        </div>
      </PageShell>
    );
  }

  if (!listing) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 py-20 text-slate-400 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
          <span className="animate-pulse">Loading listing details...</span>
        </div>
      </PageShell>
    );
  }

  const discountPercent = listing.originalPrice && listing.originalPrice > listing.price
    ? Math.round(((listing.originalPrice - listing.price) / listing.originalPrice) * 100)
    : null;

  return (
    <PageShell>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition">
          <ArrowLeft size={17} /> Back to marketplace
        </Link>

        <div className="mt-7 grid lg:grid-cols-[1.15fr_.85fr] gap-8 items-start">
          <div className="space-y-6">
            <div className="aspect-[4/3] md:aspect-[16/10] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
              {listing.image ? (
                <img src={resolveImage(listing.image)} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <div className="h-full grid place-items-center text-slate-600">No image uploaded</div>
              )}
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white">About this item</h2>
              <p className="mt-4 text-slate-300 leading-7 whitespace-pre-line">{listing.description}</p>

              {/* Tags if present */}
              {Array.isArray(listing.tags) && listing.tags.length > 0 && (
                <div className="mt-6 pt-5 border-t border-slate-800 flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-500 flex items-center gap-1"><Tag size={13} /> Tags:</span>
                  {listing.tags.map((t) => (
                    <span key={t} className="text-xs bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="lg:sticky lg:top-24 bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
              <span className="text-teal-400">{listing.category}</span>
              {listing.brand && (
                <>
                  <span className="text-slate-700">•</span>
                  <span className="text-slate-300">{listing.brand}</span>
                </>
              )}
              <span className="text-slate-700">•</span>
              <span className={listing.status === "Active" ? "text-emerald-400" : "text-amber-400"}>{listing.status}</span>
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-black text-white leading-tight">{listing.title}</h1>

            <div className="mt-5 flex items-baseline gap-3">
              <p className="text-4xl font-black text-orange-400">{formatPrice(listing.price)}</p>
              {listing.originalPrice && Number(listing.originalPrice) > Number(listing.price) && (
                <div className="flex items-center gap-2">
                  <span className="text-base line-through text-slate-500">{formatPrice(listing.originalPrice)}</span>
                  {discountPercent && (
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {discountPercent}% OFF
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="border border-slate-800 bg-slate-950/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Condition</p>
                <p className="mt-1 font-semibold text-white">{listing.condition}</p>
              </div>

              <div className="border border-slate-800 bg-slate-950/50 rounded-xl p-3">
                <p className="text-xs text-slate-500">Views & Interest</p>
                <p className="mt-1 font-semibold text-white flex items-center gap-2">
                  <Eye size={15} /> {listing.views} <span className="text-xs text-slate-500 font-normal">({listing.inquiries} chats)</span>
                </p>
              </div>

              {listing.ageMonths !== undefined && listing.ageMonths > 0 && (
                <div className="col-span-2 border border-slate-800 bg-slate-950/50 rounded-xl p-3 flex items-center justify-between">
                  <span className="text-xs text-slate-500 flex items-center gap-1.5"><Clock size={14} /> Usage Duration</span>
                  <span className="text-sm font-semibold text-slate-200">{listing.ageMonths} month(s) used</span>
                </div>
              )}
            </div>

            <div className="mt-6 py-5 border-y border-slate-800 space-y-3 text-sm text-slate-400">
              <p className="flex items-center gap-3"><MapPin size={17} className="text-slate-500" /> Meetup at {listing.location}</p>
              <p className="flex items-center gap-3"><CalendarDays size={17} className="text-slate-500" /> Posted {new Date(listing.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-orange-500/15 grid place-items-center text-orange-400 shrink-0">
                <UserRound size={21} />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-white truncate">{listing.seller?.name || "Campus seller"}</p>
                <p className="text-sm text-slate-500 truncate">{listing.seller?.college || "CampusMarket member"}</p>
              </div>
            </div>

            <button
              onClick={contact}
              disabled={listing.status !== "Active"}
              className="mt-7 w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-400 py-4 rounded-xl text-white font-bold transition shadow-lg shadow-emerald-950/40"
            >
              <MessageCircle size={20} /> {listing.status === "Active" ? "Chat on WhatsApp" : "Listing unavailable"}
            </button>

            <p className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} /> Meet in a public campus area and verify before paying.
            </p>
          </aside>
        </div>

        {/* Similar Listings Recommendation Section */}
        {recommendations.length > 0 && (
          <div className="mt-16 pt-12 border-t border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                  <Sparkles size={13} /> Campus AI Recommender
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-black text-white">
                  Similar Listings You Might Like
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  Recommended based on category similarity, student budget compatibility, and campus proximity.
                </p>
              </div>
            </div>

            <div className="mt-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {recommendations.map((item) => (
                <ProductCard key={item.id} listing={item} />
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}
