import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import ProductCard from "../components/ProductCard";

function Home() {
  return (
    <div className="bg-slate-950 min-h-screen">
    <div className="min-h-screen flex flex-col">

      <Navbar />

      <div className="flex-grow">
        <Hero/>

<div className="max-w-7xl mx-auto px-6 py-16">

  <h2 className="text-4xl font-bold text-white mb-3">
    Latest Listings
  </h2>

  <p className="text-slate-400 mb-12 text-lg">
    Discover deals posted by students around your campus.
  </p>

  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
  <ProductCard
    image="https://images.unsplash.com/photo-1587145820266-a5951ee6f620?w=800"
    title="Scientific Calculator"
    price={500}
    seller="Rahul"
    condition="Like New"
  />

  <ProductCard
    image="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"
    title="Smart Watch"
    price={1500}
    seller="Priya"
    condition="Good"
  />

  <ProductCard
   image="https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop"
    title="Laptop"
    price={25000}
    seller="Aman"
    condition="Excellent"
  />

  <ProductCard
    image="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800"
    title="Headphones"
    price={1200}
    seller="Neha"
    condition="Used"
  />
  </div>
  </div>

</div>
      </div>

      <Footer />

    </div>
  );
}

export default Home;