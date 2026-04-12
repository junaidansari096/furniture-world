import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-surface-container-low text-on-surface-variant py-12 px-6 md:px-12 mt-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="font-display font-bold text-xl text-primary mb-4">Furniture World</h3>
          <p className="font-body text-sm leading-relaxed max-w-sm">
            Local craftsmanship for rural and semi-urban India. Premium computer tables, steel almirahs, beds, sofas, and fiber furniture. 
          </p>
        </div>
        
        <div>
          <h4 className="font-display font-semibold text-lg mb-4 text-on-surface">Explore</h4>
          <ul className="flex flex-col gap-2 font-body text-sm">
            <li><Link to="/" className="hover:text-primary">Home</Link></li>
            <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
            <li><Link to="/products?category=Custom" className="hover:text-primary">Custom Furniture</Link></li>
            <li><Link to="/contact" className="hover:text-primary">Contact Us</Link></li>
            <li><Link to="/admin" className="hover:text-primary border-t border-outline-variant/30 pt-2 mt-2 w-max text-xs uppercase tracking-wider font-bold text-on-surface-variant">Admin Dahboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-lg mb-4 text-on-surface">Contact</h4>
          <ul className="flex flex-col gap-2 font-body text-sm">
            <li>📍 123 Artisan Village, West Bengal</li>
            <li>📞 +91 98765 43210</li>
            <li>Open: Mon-Sat, 9AM to 7PM</li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-outline-variant/30 text-center text-sm">
        <p>&copy; {new Date().getFullYear()} Furniture World. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
