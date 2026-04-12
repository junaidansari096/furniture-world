import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, storage } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getProducts } from '../data/products';
import { addQuery } from '../data/queries';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    size: 'Medium',
    category: '',
    material: 'Wood',
    customCategory: '',
    customMaterial: '',
    color: '#6B4226',
    customNotes: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Dynamic fetch of product ID from localStorage wrapper
    const allProducts = getProducts();
    const foundProduct = allProducts.find(p => String(p.id) === String(id));
    if (foundProduct) {
      setProduct(foundProduct);
      setFormData(prev => ({ 
        ...prev, 
        material: foundProduct.isCustomProduct ? 'Wood' : foundProduct.material,
        category: foundProduct.isCustomProduct ? '' : foundProduct.category 
      }));
    }
  }, [id]);

  if (!product) {
    return <div className="pt-32 text-center text-2xl font-display text-primary">Product Not Found</div>;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = null;
      if (imageFile) {
        // Upload image if provided
        const storageRef = ref(storage, `quotes/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      }

      // Save data locally for Admin panel
      addQuery({
        type: 'quote',
        source: 'Product Detail',
        productId: product.id,
        productName: product.name,
        ...formData,
        finalCategory: formData.category === 'Other' ? formData.customCategory : formData.category,
        finalMaterial: formData.material === 'Other' ? formData.customMaterial : formData.material,
        referenceImage: imageUrl
      });

      // Save data to Firestore (Assuming user has properly setup FB)
      try {
        await addDoc(collection(db, 'quote_requests'), {
          productId: product.id,
          productName: product.name,
          ...formData,
          finalCategory: formData.category === 'Other' ? formData.customCategory : formData.category,
          finalMaterial: formData.material === 'Other' ? formData.customMaterial : formData.material,
          referenceImage: imageUrl,
          timestamp: serverTimestamp()
        });
      } catch (fbError) {
        console.warn("Firebase save failed or rules missing, proceeding to WhatsApp anyway.", fbError);
        // Continue to success to drop to whatsapp
      }

      setSuccess(true);
      setLoading(false);

    } catch (error) {
      console.error("Error submitting quote request:", error);
      alert("Something went wrong. Please try contacting us on WhatsApp directly.");
      setLoading(false);
    }
  };

  const openWhatsApp = () => {
    const finalCategory = formData.category === 'Other' ? formData.customCategory : formData.category;
    const finalMaterial = formData.material === 'Other' ? formData.customMaterial : formData.material;
    
    let message = `Hello! I would like a quote for:\n*${product.name}*\nSize: ${formData.size}\n`;
    if (product.isCustomProduct) {
      message += `Category: ${finalCategory || 'Not specified'}\n`;
    }
    message += `Material: ${finalMaterial}\nColor: ${formData.color}\nNotes: ${formData.customNotes}`;
    
    const url = `https://wa.me/919641382271?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pt-24 px-6 md:px-12 max-w-6xl mx-auto mb-20">
      <button onClick={() => navigate(-1)} className="mb-8 font-body font-bold text-on-surface-variant hover:text-primary transition-colors">
        ← Back to products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Left: Product Images */}
        <div>
          <div className="bg-surface-container-low rounded-[2rem] p-4 lg:sticky lg:top-32">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full aspect-[4/3] object-cover rounded-xl shadow-sm mb-4"
            />
            
            <div className="flex items-center gap-4 mt-6">
              <h2 className="text-2xl font-display font-bold text-primary">Product Details</h2>
              {product.discountPercentage > 0 && (
                <span className="bg-tertiary/10 text-tertiary-container px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>

            <div className="mt-2 mb-4 flex items-center gap-3">
              <p className="font-display text-3xl font-bold text-on-surface">
                 ₹{(Number(product.price) - (Number(product.price) * (product.discountPercentage / 100) || 0)).toFixed(0)}
              </p>
              {product.discountPercentage > 0 && (
                <p className="text-lg text-outline-variant line-through font-bold">₹{product.price}</p>
              )}
            </div>

            <p className="font-body text-on-surface-variant leading-relaxed mb-6">{product.description}</p>
            <div className="flex gap-4">
               <span className="bg-surface py-2 px-4 rounded-xl text-sm font-bold text-on-surface ghost-border">
                 Category: {product.category}
               </span>
               <span className="bg-surface py-2 px-4 rounded-xl text-sm font-bold text-on-surface ghost-border">
                 Material: {product.material}
               </span>
            </div>
          </div>
        </div>

        {/* Right: Customize Form */}
        <div className="bg-surface-container-lowest rounded-[2rem] p-8 md:p-10 shadow-ambient">
          <h1 className="text-3xl md:text-4xl font-display font-bold text-on-surface mb-2">{product.name}</h1>
          <p className="font-body text-lg text-primary font-semibold mb-8 border-b border-outline-variant/30 pb-6">Request Quote / Pre-Order</p>

          {success ? (
            <div className="bg-surface-container-low p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-[#25D366]/20 text-[#25D366] rounded-full flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
              <h2 className="text-2xl font-display font-bold text-on-surface mb-2">Request Taken!</h2>
              <p className="font-body text-on-surface-variant mb-6">We have saved your details. Open WhatsApp to finalize your quote instantly.</p>
              <button 
                onClick={openWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 font-bold text-lg rounded-xl shadow-ambient hover:scale-[1.02] transition-transform"
              >
                Continue to WhatsApp
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {product.isCustomProduct && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Category</label>
                    <select name="category" required value={formData.category} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all">
                      <option value="">Select Category...</option>
                      <option value="Beds">Beds</option>
                      <option value="Sofas">Sofas</option>
                      <option value="Steel Almirah">Steel Almirah</option>
                      <option value="Computer Tables">Computer Tables</option>
                      <option value="Other">Other (Specify below)</option>
                    </select>
                  </div>
                  {formData.category === 'Other' && (
                    <div className="flex flex-col gap-2">
                      <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Specify Category</label>
                      <input type="text" required name="customCategory" value={formData.customCategory} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Size</label>
                <select name="size" value={formData.size} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all">
                  <option value="Small">Small (Standard)</option>
                  <option value="Medium">Medium (Standard)</option>
                  <option value="Large">Large (Standard)</option>
                  <option value="Custom">Custom Size (Provide measurements below)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Material</label>
                  {product.isCustomProduct ? (
                    <select name="material" value={formData.material} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all">
                      <option value="Wood">Wood</option>
                      <option value="Steel">Steel</option>
                      <option value="Fiber">Fiber</option>
                      <option value="Other">Other (Specify below)</option>
                    </select>
                  ) : (
                    <input type="text" name="material" value={formData.material} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Color</label>
                  <div className="flex items-center gap-2 bg-surface-container-highest p-3 rounded-lg">
                     <input type="color" name="color" value={formData.color} onChange={handleInputChange} className="h-8 w-8 cursor-pointer rounded overflow-hidden" />
                     <span className="font-mono text-sm">{formData.color}</span>
                  </div>
                </div>
                
                {formData.material === 'Other' && product.isCustomProduct && (
                  <div className="flex flex-col gap-2 col-span-2">
                    <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Specify Material</label>
                    <input type="text" required name="customMaterial" value={formData.customMaterial} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Reference Image (Optional)</label>
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleFileChange} 
                  className="w-full bg-surface-container-highest px-4 py-3 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-on-primary hover:file:bg-primary-container"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-6 border-t border-outline-variant/30">
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Your Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleInputChange} placeholder="Full Name" className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Phone Number</label>
                  <input type="tel" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="10-digit number" className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all placeholder:text-outline" />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-semibold text-on-surface-variant text-sm uppercase tracking-wide">Custom Requirements / Notes</label>
                <textarea name="customNotes" rows="3" value={formData.customNotes} onChange={handleInputChange} className="w-full bg-surface-container-highest p-4 focus:ring-2 focus:ring-primary outline-none transition-all resize-none"></textarea>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="mt-6 w-full bg-wood-gradient text-on-primary font-bold text-lg py-4 rounded-xl shadow-ambient hover:opacity-90 transition-all flex justify-center items-center gap-2"
              >
                {loading ? (
                  <span className="w-6 h-6 border-4 border-on-primary border-t-transparent rounded-full animate-spin"></span>
                ) : "Request Custom Quote"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
