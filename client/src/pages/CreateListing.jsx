import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function CreateListing() {
  return (
    <div className="bg-slate-950 min-h-screen flex flex-col">

      <Navbar />

      <main className="flex-grow">

        <div className="max-w-3xl mx-auto px-6 py-16">

          <div className="mb-10">

            <h1 className="text-5xl font-bold text-white">
              Create Listing
            </h1>

            <p className="text-slate-400 mt-3">
              Sell books, electronics, hostel essentials and more to students on campus.
            </p>

          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-xl">

            <form className="space-y-6">

              {/* Product Name */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Product Name
                </label>

                <input
                  type="text"
                  placeholder="Scientific Calculator"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              {/* Price */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Price (₹)
                </label>

                <input
                  type="number"
                  placeholder="500"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Category
                </label>

                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  <option>Books</option>
                  <option>Electronics</option>
                  <option>Hostel Essentials</option>
                  <option>Cycles</option>
                  <option>Notes</option>
                  <option>Other</option>
                </select>
              </div>

              {/* Condition */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Condition
                </label>

                <select
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                >
                  <option>Brand New</option>
                  <option>Like New</option>
                  <option>Good</option>
                  <option>Used</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Description
                </label>

                <textarea
                  rows="4"
                  placeholder="Write a short description..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="block text-slate-300 mb-2">
                  WhatsApp Number
                </label>

                <input
                  type="text"
                  placeholder="+91 9876543210"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white outline-none focus:border-orange-500"
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-slate-300 mb-2">
                  Product Image
                </label>

                <input
                  type="file"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-slate-400"
                />
              </div>

              {/* Button */}
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-xl font-semibold transition"
              >
                Post Listing
              </button>

            </form>

          </div>

        </div>

      </main>

      <Footer />

    </div>
  );
}

export default CreateListing;