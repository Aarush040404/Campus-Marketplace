import { MessageCircle } from "lucide-react";

export default function ProductCard({
  image,
  title,
  price,
  seller,
  condition,
}) {
  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">

      {/* Image Section */}
      <div className="relative h-64 bg-gradient-to-br from-slate-800 to-slate-700">

        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />

        <span className="absolute top-4 left-4 bg-orange-500 text-white text-xs font-medium px-3 py-1 rounded-full">
          {condition}
        </span>

      </div>

      {/* Content */}
      <div className="bg-slate-950 p-5">

        <h3 className="text-white text-xl font-bold">
          {title}
        </h3>

        <p className="text-slate-400 text-sm mt-1">
          Seller: {seller}
        </p>

        <div className="mt-6 flex items-center justify-between">

          <div>

            <p className="text-slate-500 text-xs uppercase tracking-wider">
              Price
            </p>

            <h2 className="text-orange-500 text-3xl font-bold">
              ₹{price}
            </h2>

          </div>

          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-2xl transition">

            <MessageCircle size={18} />

            Contact

          </button>

        </div>

      </div>

    </div>
  );
}