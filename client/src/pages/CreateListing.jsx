import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, Check, CheckCircle2, ImagePlus, Loader2, Send, Sparkles, TrendingUp } from "lucide-react";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { api, categories, formatPrice, resolveImage } from "../lib/api";

const conditions = ["Brand New", "Like New", "Good", "Used"];
const emptyForm = {
  title: "",
  price: "",
  originalPrice: "",
  brand: "",
  ageMonths: "",
  tags: "",
  category: "Books",
  condition: "Like New",
  description: "",
  location: "",
  whatsapp: "",
  image: null,
};

export default function CreateListing() {
  const { user } = useAuth();
  const [form, setForm] = useState(() => ({ ...emptyForm, whatsapp: user?.phone || "" }));
  const [existingImage, setExistingImage] = useState("");
  const [preview, setPreview] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [loading, setLoading] = useState(Boolean(editId));
  const navigate = useNavigate();

  // ML Price Prediction States
  const [prediction, setPrediction] = useState(null);
  const [predicting, setPredicting] = useState(false);
  const [predictError, setPredictError] = useState("");
  const [priceApplied, setPriceApplied] = useState(false);

  useEffect(() => {
    if (!editId) return;
    api(`/listings/mine/${editId}`)
      .then(({ listing }) => {
        setForm({
          title: listing.title,
          price: listing.price,
          originalPrice: listing.originalPrice ?? "",
          brand: listing.brand ?? "",
          ageMonths: listing.ageMonths ?? "",
          tags: Array.isArray(listing.tags) ? listing.tags.join(", ") : (listing.tags || ""),
          category: listing.category,
          condition: listing.condition,
          description: listing.description,
          location: listing.location,
          whatsapp: listing.whatsapp,
          image: null,
        });
        setExistingImage(listing.image);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [editId]);

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  const checklist = useMemo(() => [
    ["Clear product name", form.title.trim().length >= 4],
    ["Useful description", form.description.trim().length >= 15],
    ["Price and category", Number(form.price) > 0 && form.category],
    ["Pickup and contact", form.location.trim() && form.whatsapp.replace(/\D/g, "").length >= 10],
    ["Product photo", form.image || existingImage],
  ], [form, existingImage]);

  const change = (event) => {
    const { name, value, files } = event.target;
    if (name === "image") {
      const file = files?.[0] || null;
      setForm((current) => ({ ...current, image: file }));
      setPreview(file ? URL.createObjectURL(file) : "");
    } else {
      setForm((current) => ({ ...current, [name]: value }));
      if (name === "price") setPriceApplied(false);
    }
  };

  const handleEstimatePrice = async () => {
    setPredicting(true);
    setPredictError("");
    setPriceApplied(false);

    try {
      const res = await api("/ai/predict-price", {
        method: "POST",
        body: JSON.stringify({
          category: form.category,
          condition: form.condition,
          originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
          brand: form.brand.trim() || undefined,
          ageMonths: form.ageMonths !== "" ? Number(form.ageMonths) : undefined,
          title: form.title.trim() || undefined,
        }),
      });
      setPrediction(res);
    } catch (err) {
      setPredictError(err.message || "Unable to estimate price right now.");
    } finally {
      setPredicting(false);
    }
  };

  const applySuggestedPrice = () => {
    if (!prediction?.predictedPrice) return;
    setForm((current) => ({ ...current, price: prediction.predictedPrice }));
    setPriceApplied(true);
  };

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    const body = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (value !== null && value !== "") body.append(key, value);
    });
    try {
      if (editId) {
        await api(`/listings/${editId}`, { method: "PATCH", body });
      } else {
        await api("/listings", { method: "POST", body });
      }
      navigate("/my-listings", { state: { notice: editId ? "Listing updated." : "Your listing is live!" } });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <PageShell>
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 flex justify-center items-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mr-3"></div>
          <span className="font-medium animate-pulse">Retrieving listing details...</span>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="border-b border-slate-800 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-10">
          <p className="text-orange-400 font-bold flex items-center gap-2"><Sparkles size={17} /> Seller studio</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-black text-white">{editId ? "Edit your listing" : "List it. Meet up. Get paid."}</h1>
          <p className="mt-3 text-slate-400">A clear description, fair pricing, and a good photo help products sell faster.</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <form onSubmit={submit} className="glass border border-slate-800 rounded-3xl p-5 md:p-8 space-y-6">
          <div className="grid md:grid-cols-2 gap-5">
            <label className="md:col-span-2 text-sm font-medium text-slate-300">Product title
              <input name="title" value={form.title} onChange={change} className="field mt-2" placeholder="e.g. Casio FX-991ES Plus Scientific Calculator" required minLength="4" maxLength="100" />
            </label>

            <label className="text-sm font-medium text-slate-300">Category
              <select name="category" value={form.category} onChange={change} className="field mt-2">{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
            </label>

            <label className="text-sm font-medium text-slate-300">Condition
              <select name="condition" value={form.condition} onChange={change} className="field mt-2">{conditions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>

            <label className="text-sm font-medium text-slate-300">Brand / Maker <span className="text-slate-500 font-normal">(optional)</span>
              <input name="brand" value={form.brand} onChange={change} className="field mt-2" placeholder="e.g. Casio, Firefox, Boat, Pearson" maxLength="60" />
            </label>

            <label className="text-sm font-medium text-slate-300">Original price / MRP (₹) <span className="text-slate-500 font-normal">(optional)</span>
              <input name="originalPrice" value={form.originalPrice} onChange={change} className="field mt-2" type="number" min="0" placeholder="e.g. 1295 (helps ML predict fair price)" />
            </label>

            <label className="text-sm font-medium text-slate-300">Age / Usage (months) <span className="text-slate-500 font-normal">(optional)</span>
              <input name="ageMonths" value={form.ageMonths} onChange={change} className="field mt-2" type="number" min="0" max="120" placeholder="e.g. 6 (months used)" />
            </label>

            <label className="text-sm font-medium text-slate-300">Campus pickup spot
              <input name="location" value={form.location} onChange={change} className="field mt-2" placeholder="Main block, library, hostel…" required maxLength="100" />
            </label>

            {/* Smart ML Price Prediction Box */}
            <div className="md:col-span-2 rounded-2xl border border-orange-500/20 bg-orange-950/10 p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-full">
                    <Sparkles size={13} /> ML Price Assistant
                  </span>
                  <p className="mt-1 text-sm text-slate-300">Unsure what to charge? Predict a fair student price based on category depreciation & condition.</p>
                </div>

                <button
                  type="button"
                  onClick={handleEstimatePrice}
                  disabled={predicting}
                  className="shrink-0 inline-flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-orange-400 font-semibold px-4 py-2.5 rounded-xl text-sm transition active:scale-[0.98] disabled:opacity-50"
                >
                  {predicting ? <Loader2 size={16} className="animate-spin text-orange-400" /> : <TrendingUp size={16} />}
                  {predicting ? "Analyzing..." : "Estimate Resale Price"}
                </button>
              </div>

              {predictError && (
                <p className="text-xs text-red-300 bg-red-950/30 border border-red-900/50 rounded-lg p-2.5">{predictError}</p>
              )}

              {prediction && (
                <div className="pt-3 border-t border-slate-800/80 space-y-3">
                  {prediction.warning && (
                    <div className="flex items-start gap-2.5 text-xs text-amber-300 bg-amber-950/40 border border-amber-500/30 rounded-xl p-3">
                      <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <p className="font-semibold text-amber-200">Out of Distribution Notice</p>
                        <p className="text-amber-300/90 leading-relaxed">{prediction.warning}</p>
                      </div>
                    </div>
                  )}

                  <div className="grid sm:grid-cols-[1fr_auto] gap-4 items-center">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-400">ML Estimated Fair Price:</span>
                        <span className="text-xl font-black text-orange-400">{formatPrice(prediction.predictedPrice)}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${
                          prediction.isOutOfDistribution
                            ? "bg-amber-950/40 text-amber-400 border-amber-500/30"
                            : "bg-slate-800 text-teal-400 border-teal-500/20"
                        }`}>
                          {prediction.confidence} Confidence
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Suggested range: <strong className="text-slate-200">{formatPrice(prediction.minPrice)}</strong> – <strong className="text-slate-200">{formatPrice(prediction.maxPrice)}</strong>
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Model: {prediction.modelInfo?.modelName || "Random Forest Regressor"} (R²: {prediction.modelInfo?.r2Score || 0.95}) · Does not overwrite your price automatically.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={applySuggestedPrice}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition ${
                        priceApplied
                          ? "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
                          : "bg-orange-500 hover:bg-orange-400 text-white"
                      }`}
                    >
                      {priceApplied ? <Check size={14} /> : null}
                      {priceApplied ? "Price Applied" : `Use ₹${prediction.predictedPrice}`}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <label className="text-sm font-medium text-slate-300">Listing price (₹)
              <input name="price" value={form.price} onChange={change} className="field mt-2" type="number" min="1" max="10000000" placeholder="e.g. 650" required />
            </label>

            <label className="text-sm font-medium text-slate-300">WhatsApp number
              <input name="whatsapp" value={form.whatsapp} onChange={change} className="field mt-2" type="tel" inputMode="tel" minLength="10" placeholder="98765 43210" required />
            </label>

            <label className="md:col-span-2 text-sm font-medium text-slate-300">Description
              <textarea name="description" value={form.description} onChange={change} className="field mt-2 min-h-32 resize-y" placeholder="Mention age, condition, included accessories, and anything a buyer should know." required minLength="15" maxLength="1200" />
            </label>

            <label className="md:col-span-2 text-sm font-medium text-slate-300">Tags / Keywords <span className="text-slate-500 font-normal">(optional, comma-separated e.g. calculator, casio, 1st sem)</span>
              <input name="tags" value={form.tags} onChange={change} className="field mt-2" placeholder="e.g. textbook, gate, engineering, semester 1" />
            </label>

            <label className="md:col-span-2 text-sm font-medium text-slate-300">Product image
              <input name="image" onChange={change} className="field mt-2 text-slate-400 file:mr-3 file:border-0 file:bg-orange-500 file:text-white file:rounded-lg file:px-3 file:py-1.5" type="file" accept="image/*" />
            </label>
          </div>

          <div className="mt-6"><StatusMessage error={error} /></div>

          <div className="mt-7 flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <button type="button" onClick={() => navigate(-1)} className="px-5 py-3 rounded-xl border border-slate-700 text-slate-300">Cancel</button>
            <button disabled={submitting} className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 disabled:opacity-60 text-white font-bold">
              {submitting ? "Saving…" : editId ? "Save changes" : "Publish listing"} {!submitting && <Send size={17} />}
            </button>
          </div>
        </form>

        <aside className="lg:sticky lg:top-24 space-y-5">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="aspect-[4/3] bg-slate-800">
              {preview || existingImage ? <img src={preview || resolveImage(existingImage)} alt="" className="w-full h-full object-cover" /> : <div className="h-full grid place-items-center text-slate-600"><ImagePlus size={42} /></div>}
            </div>
            <div className="p-5">
              <div className="flex items-center justify-between">
                <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{form.category}</p>
                {form.brand && <span className="text-xs text-slate-400 font-medium">{form.brand}</span>}
              </div>
              <h2 className="mt-2 text-xl font-bold text-white">{form.title || "Your product title"}</h2>
              <div className="mt-4 flex items-baseline gap-2">
                <p className="text-3xl font-black text-orange-400">{form.price ? formatPrice(form.price) : "Set a price"}</p>
                {form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
                  <span className="text-xs line-through text-slate-500">MRP {formatPrice(form.originalPrice)}</span>
                )}
              </div>
              <p className="mt-3 text-sm text-slate-400 line-clamp-2">{form.description || "Your description will appear here."}</p>
              <p className="mt-5 pt-4 border-t border-slate-800 text-sm text-slate-500">Selling as <span className="text-slate-300">{user?.name || "Campus seller"}</span></p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="font-bold text-white">Listing quality</p>
            <div className="mt-4 space-y-3">
              {checklist.map(([label, done]) => (
                <div key={label} className="flex items-center gap-3 text-sm text-slate-400">
                  <CheckCircle2 size={17} className={done ? "text-emerald-400" : "text-slate-700"} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
