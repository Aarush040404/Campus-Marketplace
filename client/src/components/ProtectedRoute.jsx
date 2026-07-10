import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#07111f] flex flex-col justify-center items-center gap-4 text-slate-400">
        <div className="relative flex h-12 w-12 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-500 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-8 w-8 bg-orange-600"></span>
        </div>
        <p className="text-sm font-semibold tracking-wide animate-pulse">Verifying session...</p>
      </div>
    );
  }
  return user ? <Outlet /> : <Navigate to="/login" replace state={{ from: `${location.pathname}${location.search}` }} />;
}
