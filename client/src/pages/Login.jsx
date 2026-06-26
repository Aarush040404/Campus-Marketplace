import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setMessage("");

    if (!formData.email.trim() || !formData.password.trim()) {
      setError("Enter your email and password.");
      return;
    }

    setError("");
    setMessage("Details ready to verify.");
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />

      <main className="flex-grow">
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
          <div className="grid lg:grid-cols-[1fr_440px] gap-10 lg:gap-16 items-center">
            <div className="text-white">
              <p className="text-orange-400 font-semibold mb-4">
                Welcome back
              </p>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Sign in to manage your campus deals.
              </h1>

              <p className="mt-5 text-slate-400 text-lg max-w-2xl">
                Keep track of your listings, contact sellers faster, and get back to the marketplace.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6 md:p-8 shadow-xl">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-white">
                  Login
                </h2>

                <p className="text-slate-400 mt-2">
                  New here?{" "}
                  <Link
                    to="/register"
                    className="text-orange-400 hover:text-orange-300 font-medium"
                  >
                    Create an account
                  </Link>
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                <div>
                  <label
                    htmlFor="email"
                    className="block text-slate-300 mb-2"
                  >
                    Email address
                  </label>

                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-orange-500 transition">
                    <Mail
                      size={18}
                      className="text-slate-400 shrink-0"
                    />

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@college.edu"
                      autoComplete="email"
                      className="w-full bg-transparent outline-none ml-3 text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-slate-300 mb-2"
                  >
                    Password
                  </label>

                  <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus-within:border-orange-500 transition">
                    <Lock
                      size={18}
                      className="text-slate-400 shrink-0"
                    />

                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className="w-full bg-transparent outline-none ml-3 text-white placeholder-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((isVisible) => !isVisible)}
                      className="text-slate-400 hover:text-white transition"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-4 text-sm">
                  <label className="flex items-center gap-2 text-slate-300">
                    <input
                      name="remember"
                      type="checkbox"
                      checked={formData.remember}
                      onChange={handleChange}
                      className="h-4 w-4 accent-orange-500"
                    />
                    Remember me
                  </label>

                  <Link
                    to="/login"
                    className="text-orange-400 hover:text-orange-300 font-medium"
                  >
                    Forgot password?
                  </Link>
                </div>

                {error && (
                  <p className="text-sm text-red-300 bg-red-950/40 border border-red-900 rounded-lg px-4 py-3">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="text-sm text-emerald-300 bg-emerald-950/30 border border-emerald-900 rounded-lg px-4 py-3">
                    {message}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-lg font-semibold transition"
                >
                  Sign In
                  <ArrowRight size={18} />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Login;
