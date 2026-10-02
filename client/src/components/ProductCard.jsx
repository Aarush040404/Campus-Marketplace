import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, Sparkles } from "lucide-react";
import { formatPrice, resolveImage } from "../lib/api";

const fallbackImage = "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1000&auto=format&fit=crop";

export default function ProductCard({ listing }) {
  return (
    <Link
      to={`/listings/${listing.id}`}
      className="group bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 hover:-translate-y-1 transition duration-300 flex flex-col justify-between"
    >
      <div>
        <div className="relative aspect-[4/3] bg-slate-800 overflow-hidden">
          <img
            src={resolveImage(listing.image) || fallbackImage}
            alt={listing.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
          <span className="absolute top-3 left-3 bg-slate-950/85 backdrop-blur text-slate-100 text-xs font-semibold px-3 py-1.5 rounded-full">
            {listing.condition}
          </span>
          {listing.matchScore && (
            <span className="absolute top-3 right-3 bg-orange-500/90 backdrop-blur text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow flex items-center gap-1">
              <Sparkles size={11} /> {Math.round(listing.matchScore * 100)}% match
            </span>
          )}
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs uppercase tracking-widest text-teal-400 font-bold">{listing.category}</p>
            <ArrowUpRight size={17} className="text-slate-600 group-hover:text-orange-400 transition" />
          </div>
          <h3 className="text-lg text-white font-bold mt-2 line-clamp-2 min-h-13">{listing.title}</h3>
          <div className="flex items-baseline justify-between mt-3">
            <p className="text-2xl font-black text-orange-400">{formatPrice(listing.price)}</p>
            {listing.originalPrice && Number(listing.originalPrice) > Number(listing.price) && (
              <span className="text-xs line-through text-slate-500">{formatPrice(listing.originalPrice)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="p-5 pt-0">
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3 text-sm text-slate-500">
          <span className="truncate">{listing.seller?.name || "Campus seller"}</span>
          <span className="flex items-center gap-1 truncate"><MapPin size={14} /> {listing.location}</span>
        </div>
      </div>
    </Link>
  );
}
