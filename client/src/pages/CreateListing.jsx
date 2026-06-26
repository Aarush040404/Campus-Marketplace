import { useMemo, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  FileText,
  ImagePlus,
  IndianRupee,
  Package,
  Phone,
  Send,
  Tag,
} from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const categories = [
  "Books",
  "Electronics",
  "Hostel Essentials",
  "Cycles",
  "Notes",
  "Lab Equipment",
  "Other",
];

const conditions = ["Brand New", "Like New", "Good", "Used"];

const initialFormData = {
  title: "",
  price: "",
  category: "Books",
  condition: "Like New",
  description: "",
  sellerName: "",
  whatsapp: "",
  image: null,
};

function CreateListing() {
  const [formData, setFormData] = useState(initialFormData);
  const [imagePreview, setImagePreview] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const previewPrice = useMemo(() => {
    if (!formData.price) {
      return "Set price";
    }

    return `Rs. ${Number(formData.price).toLocaleString("en-IN")}`;
  }, [formData.price]);

  const handleChange = (event) => {
    const { name, value, files } = event.target;

    if (name === "image") {
      const selectedImage = files?.[0] ?? null;

      setFormData((currentData) => ({
        ...currentData,
        image: selectedImage,
      }));

      setImagePreview(selectedImage ? URL.createObjectURL(selectedImage) : "");
      return;
    }

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setSuccess("");

    const requiredFields = [
      "title",
      "price",
      "description",
      "sellerName",
      "whatsapp",
    ];

    const hasEmptyField = requiredFields.some(
      (fieldName) => !formData[fieldName].trim()
    );

    if (hasEmptyField) {
      setError("Fill in the product, price, description, seller, and WhatsApp details.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Enter a valid selling price.");
      return;
    }

    setError("");
    setSuccess("Listing details are ready to post.");
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setImagePreview("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="border-b border-slate-800 bg-slate-900/60">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
            <p className="text-orange-400 font-semibold mb-3">
              Sell on CampusMarket
            </p>

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  Create a new listing
                </h1>

                <p className="text-slate-400 mt-3 max-w-2xl">
                  Add clear product details so nearby students can quickly decide and contact you.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="border border-slate-800 bg-slate-950 px-4 py-3 rounded-lg">
                  <p className="text-xl font-bold text-white">3</p>
                  <p className="text-xs text-slate-500">Sections</p>
                </div>

                <div className="border border-slate-800 bg-slate-950 px-4 py-3 rounded-lg">
                  <p className="text-xl font-bold text-white">0%</p>
                  <p className="text-xs text-slate-500">Fee</p>
                </div>

                <div className="border border-slate-800 bg-slate-950 px-4 py-3 rounded-lg">
                  <p className="text-xl font-bold text-white">Direct</p>
                  <p className="text-xs text-slate-500">Chat</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto w-full px-4 md:px-6 py-10 md:py-12">
          <div className="grid lg:grid-cols-[1fr_360px] gap-8 items-start">
            <form
              onSubmit={handleSubmit}
              className="bg-slate-900 border border-slate-800 rounded-lg p-5 md:p-8 shadow-xl"
            >
              <div className="grid md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <div className="flex items-center gap-2 mb-5">
                    <Package
                      size={20}
                      className="text-orange-400"
                    />
                    <h2 className="text-xl font-bold text-white">
                      Product Details
                    </h2>
                  </div>

                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Product name
                  </label>

                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Casio FX-991ES Plus calculator"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Selling price
                  </label>

                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-orange-500 transition">
                    <IndianRupee
                      size={18}
                      className="text-slate-400 shrink-0"
                    />

                    <input
                      id="price"
                      name="price"
                      type="number"
                      min="1"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full bg-transparent outline-none ml-2 text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="category"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Category
                  </label>

                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-orange-500 transition">
                    <Tag
                      size={18}
                      className="text-slate-400 shrink-0"
                    />

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-transparent outline-none ml-2 text-white"
                    >
                      {categories.map((category) => (
                        <option
                          key={category}
                          value={category}
                          className="bg-slate-950"
                        >
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="condition"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Condition
                  </label>

                  <select
                    id="condition"
                    name="condition"
                    value={formData.condition}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  >
                    {conditions.map((condition) => (
                      <option
                        key={condition}
                        value={condition}
                        className="bg-slate-950"
                      >
                        {condition}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="sellerName"
                    className="block text-sm font-medium text-slate-300 mb-2"
                  >
                    Seller name
                  </label>

                  <input
                    id="sellerName"
                    name="sellerName"
                    type="text"
                    value={formData.sellerName}
                    onChange={handleChange}
                    placeholder="Aarush"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <label
                    htmlFor="description"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2"
                  >
                    <FileText size={16} />
                    Description
                  </label>

                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Mention condition, age, included accessories, and pickup location."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition resize-none"
                  />
                </div>

                <div>
                  <label
                    htmlFor="whatsapp"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2"
                  >
                    <Phone size={16} />
                    WhatsApp number
                  </label>

                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white outline-none focus:border-orange-500 transition"
                  />
                </div>

                <div>
                  <label
                    htmlFor="image"
                    className="flex items-center gap-2 text-sm font-medium text-slate-300 mb-2"
                  >
                    <ImagePlus size={16} />
                    Product image
                  </label>

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-slate-400 file:mr-4 file:border-0 file:bg-orange-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-orange-600"
                  />
                </div>
              </div>

              {error && (
                <div className="mt-6 flex gap-3 border border-red-900 bg-red-950/40 text-red-200 rounded-lg px-4 py-3">
                  <AlertCircle
                    size={18}
                    className="shrink-0 mt-0.5"
                  />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mt-6 flex gap-3 border border-emerald-900 bg-emerald-950/30 text-emerald-200 rounded-lg px-4 py-3">
                  <CheckCircle2
                    size={18}
                    className="shrink-0 mt-0.5"
                  />
                  <p className="text-sm">{success}</p>
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:justify-end">
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-5 py-3 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition"
                >
                  Clear
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition"
                >
                  Post Listing
                  <Send size={18} />
                </button>
              </div>
            </form>

            <aside className="lg:sticky lg:top-24 space-y-5">
              <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-xl">
                <div className="h-48 bg-slate-800">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt={formData.title || "Product preview"}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-slate-500">
                      <ImagePlus size={42} />
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {formData.title || "Product title"}
                      </h3>

                      <p className="text-sm text-slate-400 mt-1">
                        {formData.category} · {formData.condition}
                      </p>
                    </div>

                    <span className="shrink-0 bg-orange-500/15 text-orange-300 border border-orange-500/30 text-xs font-semibold px-3 py-1 rounded-full">
                      Draft
                    </span>
                  </div>

                  <p className="text-3xl font-bold text-orange-400 mt-5">
                    {previewPrice}
                  </p>

                  <p className="text-sm text-slate-400 mt-4 line-clamp-4">
                    {formData.description || "Your product description will appear here."}
                  </p>

                  <div className="mt-5 pt-5 border-t border-slate-800">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Seller
                    </p>

                    <p className="text-white font-medium mt-1">
                      {formData.sellerName || "Seller name"}
                    </p>

                    <p className="text-slate-400 text-sm mt-1">
                      {formData.whatsapp || "WhatsApp number"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
                <h3 className="text-white font-semibold mb-4">
                  Listing checklist
                </h3>

                <div className="space-y-3 text-sm">
                  {[
                    ["Product details", formData.title && formData.description],
                    ["Price selected", formData.price],
                    ["Seller contact", formData.sellerName && formData.whatsapp],
                    ["Photo added", formData.image],
                  ].map(([label, isDone]) => (
                    <div
                      key={label}
                      className="flex items-center gap-3 text-slate-300"
                    >
                      <CheckCircle2
                        size={17}
                        className={isDone ? "text-emerald-400" : "text-slate-600"}
                      />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default CreateListing;
