import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle2, ImagePlus, Send, Sparkles } from "lucide-react";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";
import { api, categories, formatPrice, resolveImage } from "../lib/api";

const conditions = ["Brand New", "Like New", "Good", "Used"];
const emptyForm = {
  title: "",
  price: "",
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

  useEffect(() => {
    if (!editId) return;
    api(`/listings/mine/${editId}`)
      .then(({ listing }) => {
        setForm({
          title: listing.title,
          price: listing.price,
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
    }
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
          <p className="mt-3 text-slate-400">A clear description and a good photo help products sell faster.</p>
        </div>
      </section>
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-[1fr_360px] gap-8 items-start">
        <form onSubmit={submit} className="glass border border-slate-800 rounded-3xl p-5 md:p-8">
          <div className="grid md:grid-cols-2 gap-5">
            <label className="md:col-span-2 text-sm font-medium text-slate-300">Product title
              <input name="title" value={form.title} onChange={change} className="field mt-2" placeholder="e.g. Casio FX-991ES calculator" required minLength="4" maxLength="100" />
            </label>
            <label className="text-sm font-medium text-slate-300">Price (₹)
              <input name="price" value={form.price} onChange={change} className="field mt-2" type="number" min="1" max="10000000" placeholder="650" required />
            </label>
            <label className="text-sm font-medium text-slate-300">Category
              <select name="category" value={form.category} onChange={change} className="field mt-2">{categories.slice(1).map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <label className="text-sm font-medium text-slate-300">Condition
              <select name="condition" value={form.condition} onChange={change} className="field mt-2">{conditions.map((item) => <option key={item}>{item}</option>)}</select>
            </label>
            <label className="text-sm font-medium text-slate-300">Campus pickup spot
              <input name="location" value={form.location} onChange={change} className="field mt-2" placeholder="Main block, library, hostel…" required maxLength="100" />
            </label>
            <label className="md:col-span-2 text-sm font-medium text-slate-300">Description
              <textarea name="description" value={form.description} onChange={change} className="field mt-2 min-h-32 resize-y" placeholder="Mention age, condition, included accessories, and anything a buyer should know." required minLength="15" maxLength="1200" />
            </label>
            <label className="text-sm font-medium text-slate-300">WhatsApp number
              <input name="whatsapp" value={form.whatsapp} onChange={change} className="field mt-2" type="tel" inputMode="tel" minLength="10" placeholder="98765 43210" required />
            </label>
            <label className="text-sm font-medium text-slate-300">Product image
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
              <p className="text-teal-400 text-xs font-bold uppercase tracking-widest">{form.category}</p>
              <h2 className="mt-2 text-xl font-bold text-white">{form.title || "Your product title"}</h2>
              <p className="mt-4 text-3xl font-black text-orange-400">{form.price ? formatPrice(form.price) : "Set a price"}</p>
              <p className="mt-3 text-sm text-slate-400 line-clamp-2">{form.description || "Your description will appear here."}</p>
              <p className="mt-5 pt-4 border-t border-slate-800 text-sm text-slate-500">Selling as <span className="text-slate-300">{user.name}</span></p>
            </div>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5">
            <p className="font-bold text-white">Listing quality</p>
            <div className="mt-4 space-y-3">
              {checklist.map(([label, done]) => <div key={label} className="flex items-center gap-3 text-sm text-slate-400"><CheckCircle2 size={17} className={done ? "text-emerald-400" : "text-slate-700"} />{label}</div>)}
            </div>
          </div>
        </aside>
      </section>
    </PageShell>
  );
}
