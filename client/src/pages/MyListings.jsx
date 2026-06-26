import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  CheckCircle2,
  Eye,
  MapPin,
  MessageCircle,
  PackageOpen,
  PauseCircle,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialListings = [
  {
    id: 1,
    title: "Casio FX-991ES Plus Calculator",
    category: "Electronics",
    condition: "Like New",
    price: 650,
    status: "Active",
    views: 142,
    inquiries: 8,
    listedAt: "24 Jun 2026",
    location: "Main Block",
    image: "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=900&auto=format&fit=crop",
    description: "Original Casio scientific calculator with cover. Used for one semester only.",
  },
  {
    id: 2,
    title: "Engineering Mathematics Notes",
    category: "Notes",
    condition: "Good",
    price: 250,
    status: "Paused",
    views: 63,
    inquiries: 3,
    listedAt: "21 Jun 2026",
    location: "Library",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?w=900&auto=format&fit=crop",
    description: "Clean handwritten notes for first-year engineering mathematics with solved examples.",
  },
  {
    id: 3,
    title: "Study Table Lamp",
    category: "Hostel Essentials",
    condition: "Good",
    price: 450,
    status: "Sold",
    views: 119,
    inquiries: 12,
    listedAt: "18 Jun 2026",
    location: "Boys Hostel",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=900&auto=format&fit=crop",
    description: "Adjustable LED table lamp with three brightness levels. Works perfectly.",
  },
];

const statusOptions = ["All", "Active", "Paused", "Sold"];

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

function getStatusStyles(status) {
  if (status === "Active") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-300";
  }

  if (status === "Paused") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-300";
  }

  return "border-slate-600 bg-slate-800 text-slate-300";
}

function MyListings() {
  const [listings, setListings] = useState(initialListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredListings = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();

    return listings.filter((listing) => {
      const matchesStatus =
        statusFilter === "All" || listing.status === statusFilter;
      const matchesSearch =
        !query ||
        listing.title.toLowerCase().includes(query) ||
        listing.category.toLowerCase().includes(query) ||
        listing.location.toLowerCase().includes(query);

      return matchesStatus && matchesSearch;
    });
  }, [listings, searchTerm, statusFilter]);

  const stats = useMemo(() => {
    const activeListings = listings.filter(
      (listing) => listing.status === "Active"
    ).length;
    const totalViews = listings.reduce((total, listing) => total + listing.views, 0);
    const totalInquiries = listings.reduce(
      (total, listing) => total + listing.inquiries,
      0
    );
    const totalValue = listings
      .filter((listing) => listing.status !== "Sold")
      .reduce((total, listing) => total + listing.price, 0);

    return [
      { label: "Active listings", value: activeListings },
      { label: "Total views", value: totalViews },
      { label: "Buyer inquiries", value: totalInquiries },
      { label: "Unsold value", value: currencyFormatter.format(totalValue) },
    ];
  }, [listings]);

  const updateListingStatus = (listingId, status) => {
    setListings((currentListings) =>
      currentListings.map((listing) =>
        listing.id === listingId ? { ...listing, status } : listing
      )
    );
  };

  const deleteListing = (listingId) => {
    setListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== listingId)
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatusFilter("All");
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-slate-800 bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <p className="text-orange-400 font-semibold mb-3">
                  Seller dashboard
                </p>

                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  My Listings
                </h1>

                <p className="text-slate-400 mt-3 max-w-2xl">
                  Track your posted products, update availability, and see what buyers are checking.
                </p>
              </div>

              <Link
                to="/create-listing"
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
              >
                <Plus size={18} />
                New Listing
              </Link>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="bg-slate-900 border border-slate-800 rounded-lg p-5"
              >
                <p className="text-slate-500 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-4 md:p-5">
            <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 lg:max-w-md w-full focus-within:border-orange-500 transition">
                <Search
                  size={18}
                  className="text-slate-400 shrink-0"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder="Search by product, category, or location"
                  className="w-full bg-transparent outline-none ml-3 text-white placeholder-slate-500"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <div className="flex items-center gap-2 text-slate-400">
                  <SlidersHorizontal size={18} />
                  <span className="text-sm">Status</span>
                </div>

                <div className="grid grid-cols-4 bg-slate-950 border border-slate-800 rounded-lg p-1">
                  {statusOptions.map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setStatusFilter(status)}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                        statusFilter === status
                          ? "bg-orange-500 text-white"
                          : "text-slate-400 hover:text-white"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {filteredListings.length > 0 ? (
            <div className="mt-8 space-y-4">
              {filteredListings.map((listing) => (
                <article
                  key={listing.id}
                  className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden"
                >
                  <div className="grid lg:grid-cols-[220px_1fr]">
                    <div className="h-52 lg:h-full bg-slate-800">
                      <img
                        src={listing.image}
                        alt={listing.title}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="p-5 md:p-6">
                      <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <span
                              className={`border text-xs font-semibold px-3 py-1 rounded-full ${getStatusStyles(
                                listing.status
                              )}`}
                            >
                              {listing.status}
                            </span>

                            <span className="text-slate-500 text-sm">
                              {listing.category} · {listing.condition}
                            </span>
                          </div>

                          <h2 className="text-2xl font-bold text-white mt-3">
                            {listing.title}
                          </h2>

                          <p className="text-slate-400 mt-2 max-w-3xl">
                            {listing.description}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                            <span className="inline-flex items-center gap-2">
                              <CalendarDays size={16} />
                              {listing.listedAt}
                            </span>

                            <span className="inline-flex items-center gap-2">
                              <MapPin size={16} />
                              {listing.location}
                            </span>
                          </div>
                        </div>

                        <div className="xl:text-right shrink-0">
                          <p className="text-3xl font-bold text-orange-400">
                            {currencyFormatter.format(listing.price)}
                          </p>

                          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                            <div className="border border-slate-800 bg-slate-950 rounded-lg px-4 py-3">
                              <p className="text-slate-500">Views</p>
                              <p className="text-white font-semibold mt-1">
                                {listing.views}
                              </p>
                            </div>

                            <div className="border border-slate-800 bg-slate-950 rounded-lg px-4 py-3">
                              <p className="text-slate-500">Inquiries</p>
                              <p className="text-white font-semibold mt-1">
                                {listing.inquiries}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-5 border-t border-slate-800 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                          >
                            <Eye size={16} />
                            Preview
                          </button>

                          <Link
                            to="/create-listing"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                          >
                            <Pencil size={16} />
                            Edit
                          </Link>

                          {listing.status === "Active" ? (
                            <button
                              type="button"
                              onClick={() => updateListingStatus(listing.id, "Paused")}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-amber-700/60 text-amber-300 hover:bg-amber-950/40 transition"
                            >
                              <PauseCircle size={16} />
                              Pause
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() => updateListingStatus(listing.id, "Active")}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-emerald-700/60 text-emerald-300 hover:bg-emerald-950/40 transition"
                            >
                              <CheckCircle2 size={16} />
                              Activate
                            </button>
                          )}

                          {listing.status !== "Sold" && (
                            <button
                              type="button"
                              onClick={() => updateListingStatus(listing.id, "Sold")}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                            >
                              <PackageOpen size={16} />
                              Mark Sold
                            </button>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                          >
                            <MessageCircle size={16} />
                            Messages
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteListing(listing.id)}
                            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-900/80 text-red-300 hover:bg-red-950/40 transition"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-8 bg-slate-900 border border-slate-800 rounded-lg p-10 text-center">
              <div className="mx-auto h-14 w-14 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500">
                <PackageOpen size={28} />
              </div>

              <h2 className="text-2xl font-bold text-white mt-5">
                No listings found
              </h2>

              <p className="text-slate-400 mt-2 max-w-md mx-auto">
                Adjust your filters or create a new product listing.
              </p>

              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-5 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                >
                  Clear Filters
                </button>

                <Link
                  to="/create-listing"
                  className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-lg font-semibold transition"
                >
                  <Plus size={18} />
                  New Listing
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default MyListings;
