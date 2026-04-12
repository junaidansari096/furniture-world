import { Link } from 'react-router-dom';

const ProductCard = ({ id, name, category, image, material, price, featured, discountPercentage }) => {
  const isSale = discountPercentage > 0;
  const originalPrice = Number(price);
  const salePrice = isSale ? originalPrice - (originalPrice * (discountPercentage / 100)) : originalPrice;

  return (
    <Link to={`/products/${id}`} className="block group">
      <div className="bg-surface-container-low rounded-[1.5rem] p-4 h-full flex flex-col transition-all duration-300 group-hover:shadow-ambient group-hover:scale-[1.02]">
        
        {/* Floating Image Pattern */}
        <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-4">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2 items-start">
            <div className="bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-primary">
              {category}
            </div>
            {featured && (
              <div className="bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-on-primary uppercase tracking-widest shadow-sm">
                Featured
              </div>
            )}
          </div>
          
          {isSale && (
            <div className="absolute top-3 right-3 bg-[#e84b4b] text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm animate-pulse">
              {discountPercentage}% OFF
            </div>
          )}
        </div>
        
        <div className="flex flex-col flex-grow px-2 pb-2">
          <h3 className="font-display font-semibold text-lg text-on-surface mb-1">{name}</h3>
          <p className="font-body text-sm text-on-surface-variant flex-grow opacity-80">
            Material: {material}
          </p>
          
          <div className="mt-4 mb-4 flex items-center gap-2">
            <p className="font-display font-bold text-lg text-primary">₹{salePrice.toFixed(0)}</p>
            {isSale && (
              <p className="font-body text-sm text-outline-variant line-through">₹{originalPrice}</p>
            )}
          </div>
          
          <button className="w-full py-3 bg-surface-container-highest text-primary font-bold rounded-xl group-hover:bg-wood-gradient group-hover:text-on-primary transition-all duration-300">
            Customize / Enquire
          </button>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
