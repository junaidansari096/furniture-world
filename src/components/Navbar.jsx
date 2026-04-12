import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="glass-nav sticky top-0 z-50 py-4 px-6 md:px-12 flex justify-between items-center transition-all">
      <Link to="/" className="text-2xl font-bold font-display text-primary flex items-center gap-2">
        <span className="bg-wood-gradient text-on-primary rounded-xl px-2 py-1 tracking-tight text-xl">FW</span>
        Furniture World
      </Link>
      
      <div className="hidden md:flex gap-8 font-semibold text-on-surface-variant">
        <Link to="/" className="hover:text-primary transition-colors">Home</Link>
        <Link to="/products" className="hover:text-primary transition-colors">Products</Link>
        <Link to="/blog" className="hover:text-primary transition-colors">Our Story</Link>
        <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
      </div>

      <Link to="/contact">
        <button className="bg-surface-container-highest text-on-surface hover:text-primary px-5 py-3 rounded-lg font-bold shadow-sm transition">
          Get Quote
        </button>
      </Link>
    </nav>
  );
};

export default Navbar;
