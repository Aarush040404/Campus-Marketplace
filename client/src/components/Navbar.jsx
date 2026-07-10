import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { LogOut, Menu, Plus, Search, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const searchParam = searchParams.get("search") || "";
  const [query, setQuery] = useState(searchParam);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setQuery(searchParam);
  }, [searchParam]);

  const submitSearch = (event) => {
    event.preventDefault();
    navigate(`/?search=${encodeURIComponent(query.trim())}#marketplace`);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto h-18 px-4 md:px-6 flex items-center gap-5">
        <Link to="/" className="text-xl font-black tracking-tight shrink-0" aria-label="CampusMarket home">
          <span className="text-white">Campus</span><span className="text-orange-500">Market</span>
        </Link>

        <form onSubmit={submitSearch} className="hidden md:flex flex-1 max-w-xl ml-3">
          <div className="flex items-center w-full bg-slate-950/70 border border-slate-700 rounded-xl px-4 focus-within:border-orange-500 transition">
            <Search size={17} className="text-slate-500" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search campus deals"
              className="w-full bg-transparent outline-none px-3 py-2.5 text-sm text-white placeholder-slate-500"
            />
          </div>
        </form>

        <nav className="hidden md:flex items-center gap-1 ml-auto">
          <NavLink to="/#marketplace" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">Browse</NavLink>
          {user && <NavLink to="/my-listings" className="px-3 py-2 text-sm font-medium text-slate-300 hover:text-white">My listings</NavLink>}
          <Link to="/sell" className="ml-2 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-400 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition">
            <Plus size={17} /> Sell
          </Link>
          {user ? (
            <button onClick={handleLogout} title="Sign out" className="ml-2 p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800">
              <LogOut size={19} />
            </button>
          ) : (
            <Link to="/login" state={{ from: location.pathname + location.search }} className="ml-2 px-4 py-2.5 text-sm font-semibold text-white border border-slate-700 rounded-xl hover:bg-slate-800">Sign in</Link>
          )}
        </nav>

        <button onClick={() => setOpen(!open)} className="md:hidden ml-auto p-2 text-white" aria-label="Toggle menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-800 px-4 py-4 space-y-3">
          <form onSubmit={submitSearch} className="flex items-center bg-slate-950 border border-slate-700 rounded-xl px-4">
            <Search size={17} className="text-slate-500" />
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search campus deals" className="w-full bg-transparent outline-none px-3 py-3 text-white" />
          </form>
          <Link onClick={() => setOpen(false)} to="/#marketplace" className="block px-4 py-3 text-slate-200">Browse listings</Link>
          {user && <Link onClick={() => setOpen(false)} to="/my-listings" className="block px-4 py-3 text-slate-200">My listings</Link>}
          <Link onClick={() => setOpen(false)} to="/sell" className="block text-center bg-orange-500 px-4 py-3 rounded-xl font-bold text-white">Sell something</Link>
          {user ? (
            <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-slate-300">Sign out · {user.name}</button>
          ) : (
            <Link onClick={() => setOpen(false)} to="/login" state={{ from: location.pathname + location.search }} className="block text-center border border-slate-700 px-4 py-3 rounded-xl text-white">Sign in</Link>
          )}
        </div>
      )}
    </header>
  );
}
