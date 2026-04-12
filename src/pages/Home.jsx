import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../data/products';
import { getSettings } from '../data/settings';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [heroImage, setHeroImage] = useState('');

  useEffect(() => {
    // Dynamic fetching of only featured items from localStorage store
    const allProducts = getProducts();
    const featured = allProducts.filter(p => p.featured).sort((a, b) => {
      const discountA = Number(a.discountPercentage) || 0;
      const discountB = Number(b.discountPercentage) || 0;
      return discountB - discountA;
    });
    // Show up to 3 featured products
    setFeaturedProducts(featured.slice(0, 3));
    
    // Load hero image
    setHeroImage(getSettings().heroImage);
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Beautiful wooden furniture room" 
            className="w-full h-full object-cover rounded-none"
          />
          <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px]"></div>
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-display font-bold text-primary mb-6 leading-tight drop-shadow-sm">
            Custom Furniture <br/> <span className="text-primary-container">For Every Home</span>
          </h1>
          <p className="text-lg md:text-xl font-body text-on-surface-variant font-semibold mb-10 max-w-2xl mx-auto">
            Handcrafted with care. Tailored for your space. Quality wooden, steel and fiber furniture straight from local masters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/products" className="w-full sm:w-auto">
              <button className="w-full bg-wood-gradient text-on-primary py-4 px-10 rounded-xl text-lg font-bold shadow-ambient hover:scale-105 transition-transform">
                View Products
              </button>
            </Link>
            <a href="https://wa.me/919876543210?text=I%20want%20to%20order%20furniture" target="_blank" rel="noreferrer" className="w-full sm:w-auto">
              <button className="w-full bg-surface-container-highest text-primary border border-primary/20 py-4 px-10 rounded-xl text-lg font-bold hover:bg-surface-container-low transition-colors">
                Contact on WhatsApp
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* Featured Categories / Products */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface">Explore Curated Pieces</h2>
            <p className="font-body text-on-surface-variant mt-2">Discover popular styles crafted by local artisans.</p>
          </div>
          <Link to="/products" className="hidden md:block text-primary font-bold hover:underline mb-2">View All →</Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
        
        <div className="mt-10 text-center md:hidden">
          <Link to="/products" className="text-primary font-bold hover:underline">View All Products →</Link>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-surface-container-low py-20 px-6 md:px-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-on-surface mb-16">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative">
            <div className="hidden md:block absolute top-[25%] left-1/6 right-1/6 border-t-2 border-dashed border-outline-variant z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-3xl font-display font-bold shadow-ambient mb-6">1</div>
              <h3 className="text-2xl font-display font-bold text-primary mb-3">Choose</h3>
              <p className="font-body text-on-surface-variant">Browse our catalog and select a design you love, or upload your own reference image.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-3xl font-display font-bold shadow-ambient mb-6">2</div>
              <h3 className="text-2xl font-display font-bold text-primary mb-3">Customize</h3>
              <p className="font-body text-on-surface-variant">Select your preferred material, size, and color. We tailor it to fit your exact needs.</p>
            </div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-primary text-on-primary rounded-full flex items-center justify-center text-3xl font-display font-bold shadow-ambient mb-6">3</div>
              <h3 className="text-2xl font-display font-bold text-primary mb-3">Book</h3>
              <p className="font-body text-on-surface-variant">Request a quote easily. finalize via WhatsApp and we start the manufacturing process!</p>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="py-20 px-6 md:px-12 max-w-5xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-12">Trusted by Local Homes</h2>
        <div className="bg-surface-container-highest p-8 md:p-12 rounded-[2rem] shadow-sm relative italic">
          <span className="absolute top-4 left-6 text-6xl text-primary/20 font-display">"</span>
          <p className="font-body text-xl md:text-2xl text-on-surface-variant leading-relaxed">
            The steel almirah I ordered is incredibly strong and beautifully detailed. The whole process was simple, right here on WhatsApp. Highly recommend!
          </p>
          <div className="mt-8">
            <p className="font-display font-bold text-primary text-lg">Ramesh Kumar</p>
            <p className="text-sm text-outline">Verified Customer</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
