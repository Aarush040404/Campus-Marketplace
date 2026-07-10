import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import PageShell from "../components/PageShell";
import StatusMessage from "../components/StatusMessage";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const  navigate = useNavigate();
  const location = useLocation();

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await login(form);
      const destination = location.state?.from;
      navigate(typeof destination === "string" && destination.startsWith("/") ? destination : "/", { replace: true });
    } catch (requestError) {
      setError(requestError);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageShell>
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-12 md:py-20 grid lg:grid-cols-[1fr_460px] gap-12 items-center">
        <div>
          <p className="text-orange-400 font-bold">Welcome back</p>
          <h1 className="mt-4 text-4xl md:text-6xl font-black text-white leading-tight">Your next campus deal is waiting.</h1>
          <p className="mt-5 text-lg text-slate-400 max-w-xl">Sign in to publish listings, manage your products, and keep your seller dashboard in sync.</p>
          <div className="mt-7 flex items-center gap-3 text-sm text-slate-400">
            <span className="h-px w-10 bg-orange-500" /> Secure access to your real marketplace account
          </div>
        </div>
        <div className="glass border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl">
          <h2 className="text-3xl font-black text-white">Sign in</h2>
          <p className="text-slate-400 mt-2">New here? <Link to="/register" className="text-orange-400 font-semibold">Create an account</Link></p>
          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="block text-sm font-medium text-slate-300">Email address
              <div className="mt-2 relative"><Mail className="pointer-events-none absolute left-4 top-3.5 text-slate-500" size={18} /><input className="field field-with-icon" type="email" required autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} placeholder="you@college.edu" /></div>
            </label>
            <label className="block text-sm font-medium text-slate-300">Password
              <div className="mt-2 relative"><Lock className="pointer-events-none absolute left-4 top-3.5 text-slate-500" size={18} /><input className="field field-with-icon field-with-action" type={showPassword ? "text" : "password"} required autoComplete="current-password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="Your password" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-4 top-3.5 text-slate-500">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            </label>
            <StatusMessage error={error} />
            <button disabled={submitting} className="w-full flex justify-center items-center gap-2 bg-orange-500 hover:bg-orange-400 disabled:opacity-60 py-3.5 rounded-xl font-bold text-white transition">
              {submitting ? "Signing in…" : "Sign in"} {!submitting && <ArrowRight size={18} />}
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}
