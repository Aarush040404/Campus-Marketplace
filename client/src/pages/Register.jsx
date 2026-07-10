import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, GraduationCap, Lock, Mail, Phone, User } from "lucide-react";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", college: "", phone: "", password: "" });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const fields = [
    ["name", "Full name", "Aarush Gambhir", User, "text"],
    ["email", "College email", "you@college.edu", Mail, "email"],
    ["college", "College or university", "Your campus", GraduationCap, "text"],
    ["phone", "WhatsApp number (optional)", "98765 43210", Phone, "tel"],
    ["password", "Password", "At least 8 characters", Lock, "password"],
  ];

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await register(form);
      navigate("/sell");
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-18 grid lg:grid-cols-[.9fr_1.1fr] gap-12 items-center">
        <div>
          <p className="text-teal-400 font-bold">Join your campus network</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black text-white leading-tight">Turn unused stuff into someone&apos;s best find.</h1>
          <p className="mt-5 text-lg text-slate-400">Create a free account, post in minutes, and connect directly with verified campus buyers.</p>
          <div className="mt-8 grid grid-cols-3 gap-3">
            {["Free forever", "Direct chat", "Campus-first"].map((item) => <div key={item} className="border border-slate-800 rounded-xl p-3 text-sm text-slate-300 text-center">{item}</div>)}
          </div>
        </div>
        <div className="glass border border-slate-800 rounded-3xl p-6 md:p-8">
          <h2 className="text-3xl font-black text-white">Create account</h2>
          <p className="mt-2 text-slate-400">Already a member? <Link to="/login" className="text-orange-400 font-semibold">Sign in</Link></p>
          <form onSubmit={submit} className="mt-7 grid sm:grid-cols-2 gap-5">
            {fields.map(([name, label, placeholder, Icon, type], index) => (
              <label key={name} className={`block text-sm font-medium text-slate-300 ${index === 2 || index === 4 ? "sm:col-span-2" : ""}`}>{label}
                <div className="relative mt-2"><Icon className="pointer-events-none absolute left-4 top-3.5 text-slate-500" size={18} /><input className="field field-with-icon" name={name} type={type} required={name !== "phone"} minLength={name === "password" ? 8 : undefined} value={form[name]} onChange={(event) => setForm({ ...form, [name]: event.target.value })} placeholder={placeholder} /></div>
              </label>
            ))}
            <div className="sm:col-span-2"><StatusMessage error={error} /></div>
            <button disabled={submitting} className="sm:col-span-2 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 py-3.5 rounded-xl font-bold text-white">
              {submitting ? "Creating account…" : "Create my account"} {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
