import { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct, categories } from '../data/products';
import { getSettings, updateSettings } from '../data/settings';
import { getQueries, deleteQuery } from '../data/queries';
import { compressImage } from '../utils/imageCompressor';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);

  const [activeTab, setActiveTab] = useState('Inventory'); // 'Inventory', 'Settings', 'Queries'

  // Data States
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState({ heroImage: '' });
  const [queries, setQueries] = useState([]);

  // Inventory Form State
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '', category: 'Beds', price: '', material: '',
    description: '', image: '', featured: false, discountPercentage: 0
  });

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      setSettings(getSettings());
      setQueries(getQueries());
    }
  }, [isAuthenticated]);

  const loadProducts = () => setProducts(getProducts());

  // === Image Upload Handlers ===
  const handleProductImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsCompressing(true);
      try {
        const base64Str = await compressImage(e.target.files[0], 800, 0.6);
        setFormData(prev => ({ ...prev, image: base64Str }));
      } catch (err) {
        alert("Failed to compress image");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  const handleHeroImageUpload = async (e) => {
    if (e.target.files && e.target.files[0]) {
      setIsCompressing(true);
      try {
        const base64Str = await compressImage(e.target.files[0], 1600, 0.7);
        setSettings(prev => ({ ...prev, heroImage: base64Str }));
      } catch (err) {
        alert("Failed to compress image");
      } finally {
        setIsCompressing(false);
      }
    }
  };

  // === Inventory Handlers ===
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, price: String(formData.price), discountPercentage: Number(formData.discountPercentage) };
    if (editingProduct) {
      updateProduct(editingProduct.id, payload);
      setEditingProduct(null);
    } else {
      addProduct(payload);
    }
    setFormData({ name: '', category: 'Beds', price: '', material: '', description: '', image: '', featured: false, discountPercentage: 0 });
    loadProducts();
  };

  const startEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name, category: product.category, price: product.price || '',
      material: product.material, description: product.description, image: product.image,
      featured: product.featured || false, discountPercentage: product.discountPercentage || 0
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
    setFormData({ name: '', category: 'Beds', price: '', material: '', description: '', image: '', featured: false, discountPercentage: 0 });
  };

  // === Settings Handlers ===
  const handleSettingsSave = (e) => {
    e.preventDefault();
    updateSettings(settings);
    alert('Settings Saved! Homepage has been updated.');
  };

  // === Queries Handlers ===
  const handleDeleteQuery = (id) => {
    if(window.confirm('Delete this query permanently?')) {
      deleteQuery(id);
      setQueries(getQueries());
    }
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="pt-32 px-6 flex justify-center items-center min-h-[70vh]">
        <div className="bg-surface-container-lowest shadow-ambient p-10 rounded-3xl max-w-md w-full border border-outline-variant/20">
          <h2 className="text-3xl font-display font-bold text-primary mb-2 text-center">Admin Access</h2>
          <p className="text-on-surface-variant font-body text-center mb-8">Please enter the master password</p>
          <form onSubmit={(e) => {
            e.preventDefault();
            if (passwordInput === 'FW2026') {
              setIsAuthenticated(true);
            } else {
              setLoginError('Incorrect password. Please try again.');
            }
          }} className="flex flex-col gap-4">
            <input 
              type="password" placeholder="Password" value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="bg-surface-container-highest p-4 text-lg rounded-xl w-full outline-none focus:ring-2 focus:ring-primary transition-all text-center tracking-widest"
              autoFocus
            />
            {loginError && <p className="text-[#e84b4b] text-sm text-center font-semibold">{loginError}</p>}
            <button type="submit" className="mt-2 w-full bg-wood-gradient text-on-primary py-4 rounded-xl font-bold shadow-ambient hover:opacity-90 transition-opacity">
              Unlock Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 px-6 md:px-12 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl md:text-4xl font-display font-bold text-primary">Store Admin</h1>
        <div className="bg-surface-container-highest px-4 py-2 rounded-lg text-sm text-on-surface-variant italic">
          Data saves locally instantly • Logged In
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {['Inventory', 'Settings', 'Queries'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 rounded-xl font-bold font-display whitespace-nowrap transition-colors ${activeTab === tab ? 'bg-primary text-on-primary shadow-ambient' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}
          >
            {tab}
            {tab === 'Queries' && queries.length > 0 && (
               <span className="ml-2 bg-error text-on-error text-xs px-2 py-0.5 rounded-full">{queries.length}</span>
            )}
          </button>
        ))}
      </div>

      {/* TABS CONTENT */}
      {activeTab === 'Inventory' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
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
                    {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
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
                  <label className="text-xs font-semibold uppercase text-on-surface-variant">Image Source</label>
                  <div className="flex flex-col gap-2 border border-outline-variant/30 rounded-lg p-2 bg-surface">
                     <input 
                       type="file" accept="image/*"
                       onChange={handleProductImageUpload} 
                       className="block w-full text-xs text-on-surface-variant file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90 cursor-pointer"
                     />
                     <input 
                        type="text" name="image" placeholder="Or stick URL here" value={formData.image} 
                        onChange={handleInputChange} 
                        className="bg-surface-container-highest p-2 rounded-md w-full text-sm outline-none" 
                     />
                  </div>
                  {isCompressing && <p className="text-primary text-xs font-bold animate-pulse mt-1">Compressing...</p>}
                  {formData.image && !isCompressing && <img src={formData.image} alt="Preview" className="mt-2 h-20 w-20 object-cover rounded-lg border border-outline-variant/30" />}
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
                  {editingProduct && <button type="button" onClick={cancelEdit} className="bg-surface-container-highest text-on-surface py-3 px-4 rounded-lg font-bold">Cancel</button>}
                </div>
              </form>
            </div>
          </div>
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
                      </div>
                      <p className="text-sm text-on-surface-variant font-body mb-2">{product.category} • {product.material}</p>
                      <p className="font-semibold text-primary font-body">₹{product.price}</p>
                    </div>
                    <div className="flex gap-2 w-full md:w-auto">
                      <button onClick={() => startEdit(product)} className="flex-1 md:flex-none bg-surface-container-highest text-primary px-4 py-2 rounded-lg font-bold hover:bg-surface-container-low transition-colors">Edit</button>
                      <button onClick={() => handleDelete(product.id)} className="flex-1 md:flex-none bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'Settings' && (
        <div className="max-w-2xl bg-surface-container-lowest shadow-ambient p-8 rounded-2xl">
          <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Site Customization</h2>
          <form onSubmit={handleSettingsSave} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold uppercase text-on-surface-variant tracking-wider">Home Hero Background Image</label>
              
              <div className="flex flex-col border border-outline-variant/30 rounded-xl p-4 bg-surface gap-4">
                 <input 
                   type="file" accept="image/*"
                   onChange={handleHeroImageUpload} 
                   className="block w-full text-sm text-on-surface-variant file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary/90 cursor-pointer"
                 />
                 <div className="flex items-center gap-2">
                   <div className="h-px bg-outline-variant/30 flex-1"></div>
                   <span className="text-xs uppercase font-bold text-outline">OR PASTE URL</span>
                   <div className="h-px bg-outline-variant/30 flex-1"></div>
                 </div>
                 <input 
                   type="text" placeholder="https://..."
                   value={settings.heroImage} 
                   onChange={(e) => setSettings(prev => ({...prev, heroImage: e.target.value}))} 
                   className="bg-surface-container-highest p-3 rounded-lg w-full outline-none focus:ring-2 focus:ring-primary text-sm" 
                 />
              </div>

              {isCompressing && <p className="text-primary text-sm font-bold animate-pulse mt-2">Compressing image...</p>}

              {settings.heroImage && !isCompressing && (
                <div className="mt-4 rounded-xl overflow-hidden border border-outline-variant/30 relative h-48 w-full group">
                  <img src={settings.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-surface/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <p className="font-bold text-on-surface shadow-sm text-lg drop-shadow-md">Hero Preview</p>
                  </div>
                </div>
              )}
            </div>
            <button disabled={isCompressing} type="submit" className="w-full bg-wood-gradient text-on-primary py-4 rounded-xl font-bold shadow-ambient mt-4 disabled:opacity-50">
              Apply Changes
            </button>
          </form>
        </div>
      )}

      {activeTab === 'Queries' && (
        <div className="bg-surface-container-lowest shadow-ambient p-8 rounded-2xl">
          <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Customer Queries & Pre-Orders</h2>
          
          <div className="flex flex-col gap-6">
            {queries.length === 0 ? (
               <p className="text-on-surface-variant italic py-8 text-center bg-surface-container-highest rounded-xl">No queries found. They will appear here when customers submit forms.</p>
            ) : (
               queries.map(q => (
                 <div key={q.id} className="border border-outline-variant/30 rounded-xl p-6 bg-surface shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-2 h-full bg-wood-gradient"></div>
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                       <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                             <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${q.type === 'contact' ? 'bg-secondary/10 text-secondary' : 'bg-tertiary/10 text-tertiary-container'}`}>
                               {q.type === 'contact' ? 'General Contact' : 'Custom Quote'}
                             </span>
                             <span className="text-sm text-on-surface-variant font-mono">{new Date(q.timestamp).toLocaleString()}</span>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                             <div>
                                <p className="font-bold text-on-surface">Customer Details:</p>
                                <p className="text-on-surface-variant">Name: {q.name}</p>
                                <p className="text-on-surface-variant">Phone: {q.phone}</p>
                             </div>
                             
                             {q.type === 'quote' && (
                               <div>
                                  <p className="font-bold text-on-surface">Order Specifics ({q.productName}):</p>
                                  <p className="text-on-surface-variant">Size: {q.size}</p>
                                  <p className="text-on-surface-variant">Material: {q.finalMaterial || q.material}</p>
                                  <p className="flex items-center gap-2 text-on-surface-variant">
                                    Color: <span className="inline-block w-4 h-4 rounded" style={{backgroundColor: q.color}}></span> {q.color}
                                  </p>
                                  <p className="text-on-surface-variant">Category: {q.finalCategory || q.category}</p>
                               </div>
                             )}
                          </div>
                          
                          <div className="mt-4 bg-surface-container-low p-4 rounded-lg">
                             <p className="font-bold text-on-surface text-sm mb-1">Message / Notes:</p>
                             <p className="text-on-surface-variant whitespace-pre-wrap">{q.message || q.customNotes || "No additional notes provided."}</p>
                          </div>
                       </div>
                       
                       <div className="flex flex-col items-end justify-between min-w-[120px]">
                          {q.referenceImage && (
                             <img src={q.referenceImage} alt="Reference" className="w-24 h-24 object-cover rounded-lg shadow-sm border border-outline-variant/20 mb-4" />
                          )}
                          <div className="flex flex-col gap-2 w-full mt-auto">
                             <a href={`https://wa.me/91${q.phone}`} target="_blank" rel="noreferrer" className="w-full text-center bg-[#25D366] text-white py-2 rounded-lg font-bold shadow-sm hover:opacity-90 transition-opacity whitespace-nowrap px-4">
                                WhatsApp
                             </a>
                             <button onClick={() => handleDeleteQuery(q.id)} className="w-full text-center bg-error/10 text-error py-2 rounded-lg font-bold hover:bg-error/20 transition-colors">
                                Resolve
                             </button>
                          </div>
                       </div>
                    </div>
                 </div>
               ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
