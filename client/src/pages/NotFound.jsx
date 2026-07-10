import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import PageShell from "../components/PageShell";

export default function NotFound() {
  return (
    <PageShell>
      <section className="min-h-[65vh] grid place-items-center px-4 text-center">
        <div><p className="text-orange-400 font-black text-8xl">404</p><h1 className="mt-4 text-3xl font-black text-white">This deal slipped away.</h1><p className="mt-3 text-slate-400">The page may have moved, expired, or never existed.</p><Link to="/" className="mt-7 inline-flex items-center gap-2 bg-slate-800 px-5 py-3 rounded-xl text-white font-bold"><ArrowLeft size={17} /> Back to marketplace</Link></div>
      </section>
    </PageShell>
  );
}
