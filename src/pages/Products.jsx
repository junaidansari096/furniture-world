import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { getProducts, categories } from '../data/products';

const Products = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [allProducts, setAllProducts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    // Load local db
    setAllProducts(getProducts());

    const params = new URLSearchParams(location.search);
    const categoryQuery = params.get('category');
    if (categoryQuery && categories.includes(categoryQuery)) {
      setActiveCategory(categoryQuery);
    }
  }, [location]);

  const filteredProducts = activeCategory === 'All' 
    ? allProducts 
    : allProducts.filter(p => p.category === activeCategory);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    // 1. Prioritize Featured
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    
    // 2. Prioritize Highest Discount
    const discountA = Number(a.discountPercentage) || 0;
    const discountB = Number(b.discountPercentage) || 0;
    return discountB - discountA;
  });

  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-4">Our Collection</h1>
        <p className="font-body text-lg text-on-surface-variant max-w-2xl">
          Everything from durable steel almirahs to luxurious custom teak beds. Select a product to customize it.
        </p>
      </div>

      {/* Category Filter Chips */}
      <div className="flex flex-wrap gap-4 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-full font-body font-semibold transition-colors duration-300 ${
              activeCategory === cat 
                ? 'bg-wood-gradient text-on-primary shadow-ambient' 
                : 'bg-surface-container-highest text-on-surface hover:bg-surface-container-low'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {sortedProducts.map(product => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-20">
          <p className="text-xl font-body text-on-surface-variant">No products found in this category.</p>
          <button 
            onClick={() => setActiveCategory('All')} 
            className="mt-6 text-primary font-bold hover:underline"
          >
            View all products
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
