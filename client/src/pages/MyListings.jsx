import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MyListings() {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow max-w-7xl mx-auto w-full px-6 py-12">

        <h1 className="text-4xl font-bold text-white mb-4">
          My Listings
        </h1>

        <p className="text-slate-400">
          You haven't posted any listings yet.
        </p>

      </main>

      <Footer />

    </div>
  );
}
export default MyListings;