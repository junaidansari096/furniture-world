export const categories = ["All", "Computer Tables", "Steel Almirah", "Beds", "Sofas", "Custom Furniture"];

const defaultProducts = [
  {
    id: 999,
    name: "Customise",
    category: "Custom Furniture",
    price: "0",
    material: "Various",
    description: "Design your own furniture from scratch! Choose your desired category, material, and provide dimensions or references. We will build it to your exact specifications.",
    image: "https://placehold.co/800x600/6B4226/FFF?text=Custom+Design",
    featured: true,
    discountPercentage: 0,
    isCustomProduct: true
  },
  {
    id: 1,
    name: "Classic Teak Wood Bed",
    category: "Beds",
    price: "35000",
    material: "Wood (Teak)",
    description: "A beautifully crafted pure teak wood bed, designed for both elegance and durability. Features traditional joins and a polished finish. Available in King, Queen, or Custom sizes.",
    image: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800",
    featured: true,
    discountPercentage: 0
  },
  {
    id: 2,
    name: "Modern Steel Almirah",
    category: "Steel Almirah",
    price: "12500",
    material: "Heavy Duty Steel",
    description: "Secure and spacious steel almirah with multiple shelves, a digital locker option, and rust-proof coating. Perfect for Indian climates.",
    image: "https://placehold.co/800x600/808080/FFF?text=Steel+Almirah",
    featured: true,
    discountPercentage: 15
  },
  {
    id: 3,
    name: "L-Shape Luxury Sofa",
    category: "Sofas",
    price: "28000",
    material: "Fabric & Wood Frame",
    description: "A spacious 5-seater L-Shape sofa. Choose the fabric color to match your living room. Ergonomically designed for large families.",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800",
    featured: false,
    discountPercentage: 0
  },
  {
    id: 4,
    name: "Executive Computer Table",
    category: "Computer Tables",
    price: "8500",
    material: "Engineered Wood",
    description: "Compact and sturdy computer table with a sliding keyboard tray, CPU compartment, and side drawers for your home office.",
    image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800",
    featured: true,
    discountPercentage: 10
  },
  {
    id: 5,
    name: "Fiber Designer Chairs (Set of 4)",
    category: "Custom Furniture",
    price: "6000",
    material: "Fiber",
    description: "Lightweight, weather-resistant designer fiber chairs perfect for indoor or outdoor use. Available in various colors.",
    image: "https://placehold.co/800x600/ab9273/FFF?text=Fiber+Chairs",
    featured: false,
    discountPercentage: 0
  },
  {
    id: 6,
    name: "Traditional Diwan Bed",
    category: "Beds",
    price: "15000",
    material: "Rosewood",
    description: "A classic single diwan bed that doubles as seating during the day. Extremely robust, features hand-carved detailing.",
    image: "https://placehold.co/800x600/5c3a21/FFF?text=Diwan+Bed",
    featured: false,
    discountPercentage: 20
  }
];

export const getProducts = () => {
  const stored = localStorage.getItem('fw_products_v3');
  if (stored) {
    return JSON.parse(stored);
  }
  // Initialize with defaults if empty
  localStorage.setItem('fw_products_v3', JSON.stringify(defaultProducts));
  return defaultProducts;
};

export const saveProducts = (products) => {
  localStorage.setItem('fw_products_v3', JSON.stringify(products));
};

export const addProduct = (product) => {
  const products = getProducts();
  const newProduct = { ...product, id: Date.now() }; // simple ID generator
  saveProducts([...products, newProduct]);
};

export const updateProduct = (id, updatedData) => {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...updatedData };
    saveProducts(products);
  }
};

export const deleteProduct = (id) => {
  const products = getProducts();
  saveProducts(products.filter(p => p.id !== id));
};
