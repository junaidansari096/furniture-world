import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct, categories } from '../data/products';

const Admin = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'Beds',
    price: '',
    material: '',
    description: '',
    image: '',
    featured: false,
    discountPercentage: 0
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setProducts(getProducts());
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...formData,
        price: String(formData.price),
        discountPercentage: Number(formData.discountPercentage)
      });
      setEditingProduct(null);
    } else {
      addProduct({
        ...formData,
        price: String(formData.price),
        discountPercentage: Number(formData.discountPercentage)
      });
    }
    
    // Reset form
    setFormData({
      name: '', category: 'Beds', price: '', material: '',
      description: '', image: '', featured: false, discountPercentage: 0
    });
    loadProducts();
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category,
      price: product.price || '',
      material: product.material,
      description: product.description,
      image: product.image,
      featured: product.featured || false,
      discountPercentage: product.discountPercentage || 0
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(id);
      loadProducts();
    }
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setFormData({
      name: '', category: 'Beds', price: '', material: '',
      description: '', image: '', featured: false, discountPercentage: 0
    });
  };

  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">Store Admin</h1>
        <div className="bg-surface-container-highest px-4 py-2 rounded-lg text-sm text-on-surface-variant italic">
          Data saves locally instantly
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Admin Form Panel */}
        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest shadow-ambient p-6 rounded-2xl sticky top-24">
            <h2 className="text-xl font-display font-bold text-on-surface mb-6">
              {editingProduct ? '✏️ Edit Product' : '➕ Add New Product'}
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-on-surface-variant">Name</label>
                <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-on-surface-variant">Category</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full">
                  {categories.filter(c => c !== 'All').map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-on-surface-variant">Price (₹)</label>
                  <input required type="number" name="price" value={formData.price} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase text-on-surface-variant">Discount %</label>
                  <input type="number" min="0" max="100" name="discountPercentage" value={formData.discountPercentage} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-on-surface-variant">Material</label>
                <input required type="text" name="material" value={formData.material} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full" />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-on-surface-variant">Image URL</label>
                <input required type="url" name="image" value={formData.image} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full" />
                {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg" />}
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase text-on-surface-variant">Description</label>
                <textarea required rows="3" name="description" value={formData.description} onChange={handleInputChange} className="bg-surface-container-highest p-3 rounded-lg w-full resize-none"></textarea>
              </div>

              <div className="flex items-center gap-3 mt-2">
                <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="w-5 h-5 accent-primary cursor-pointer" />
                <label htmlFor="featured" className="text-sm font-semibold text-on-surface cursor-pointer">Feature on Homepage</label>
              </div>

              <div className="flex gap-3 mt-4">
                <button type="submit" className="flex-1 bg-wood-gradient text-on-primary py-3 rounded-lg font-bold shadow-sm">
                  {editingProduct ? 'Update Item' : 'Add Item'}
                </button>
                {editingProduct && (
                  <button type="button" onClick={cancelEdit} className="bg-surface-container-highest text-on-surface py-3 px-4 rounded-lg font-bold">
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Existing Products List */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container-lowest rounded-2xl shadow-ambient p-6">
            <h2 className="text-xl font-display font-bold text-on-surface mb-6">Inventory ({products.length})</h2>
            
            <div className="flex flex-col gap-4">
              {products.map(product => (
                <div key={product.id} className="flex flex-col md:flex-row items-center gap-4 p-4 border border-outline-variant/30 rounded-xl bg-surface">
                  <img src={product.image} alt={product.name} className="w-24 h-24 object-cover rounded-lg" />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold font-display text-on-surface">{product.name}</h3>
                      {product.featured && <span className="bg-primary/10 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Featured</span>}
                      {product.discountPercentage > 0 && <span className="bg-tertiary/10 text-tertiary-container text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">{product.discountPercentage}% OFF</span>}
                    </div>
                    <p className="text-sm text-on-surface-variant font-body mb-2">{product.category} • {product.material}</p>
                    <p className="font-semibold text-primary font-body">₹{product.price}</p>
                  </div>

                  <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => startEdit(product)} className="flex-1 md:flex-none bg-surface-container-highest text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(product.id)} className="flex-1 md:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              
              {products.length === 0 && (
                <p className="text-center text-on-surface-variant py-8">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
