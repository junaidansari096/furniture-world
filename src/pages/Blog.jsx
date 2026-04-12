import React from 'react';
import { Link } from 'react-router-dom';

const Blog = () => {
  return (
    <div className="pt-24 px-6 md:px-12 max-w-5xl mx-auto min-h-screen">
      <div className="mb-16 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-6">Our Story & Craft</h1>
        <p className="font-body text-xl text-on-surface-variant max-w-2xl mx-auto">
          Combining generations of local craftsmanship with the modern convenience of digital ordering.
        </p>
      </div>

      {/* Main Content Article */}
      <article className="prose prose-lg prose-headings:font-display prose-headings:text-primary max-w-none text-on-surface mb-20 bg-surface-container-low p-8 md:p-12 rounded-[2rem]">
        
        <img 
          src="https://images.unsplash.com/photo-1628177142898-93e46e46537b?auto=format&fit=crop&q=80&w=1600" 
          alt="Artisans working on wood" 
          className="w-full h-80 object-cover rounded-2xl mb-12 shadow-sm"
        />

        <h2 className="text-3xl font-bold mb-4">Why Furniture World?</h2>
        <p className="mb-8 leading-relaxed text-lg">
          For years, <strong>Furniture World</strong> has been the trusted local provider of robust, beautiful, and affordable furniture tailored to the unique tastes of our semi-urban and rural communities. We understand what our customers look for: unmatched durability, intricate handcrafted designs, and materials that withstand the test of time. 
        </p>

        <h3 className="text-2xl font-bold mb-4 text-primary">1. Pure, Uncompromised Materials</h3>
        <p className="mb-8 leading-relaxed">
          From genuine <strong>Teak</strong> and <strong>Rosewood (Sheesham)</strong> beds that carry traditional joins, to heavy-gauge <strong>Steel Almirahs</strong> equipped with high-security digital lockers, we never compromise on the core material. Our new line of weather-resistant <strong>Fiber Furniture</strong> is specifically designed for the Indian climate, able to sit in the sun or rain without losing its vibrant color.
        </p>

        <h3 className="text-2xl font-bold mb-4 text-primary">2. Digital Carpentry: Modernizing Tradition</h3>
        <p className="mb-8 leading-relaxed">
          We coined the term <em>Digital Carpentry</em> to describe our unique approach. You get the quality of a master carpenter, combined with the ease of an e-commerce platform. See a design you like? You don't need to visit multiple shops. Simply browse our collections, select the "Customise" option, and talk to us directly on <strong>WhatsApp</strong>. We will adapt the dimensions, color, and finish to perfectly match your living space.
        </p>

        <div className="bg-wood-gradient text-on-primary p-8 rounded-2xl my-10 shadow-ambient flex flex-col items-center text-center">
          <h3 className="text-2xl font-display font-bold mb-4">Have your own design?</h3>
          <p className="font-body opacity-90 mb-6">Upload a photo from the internet or a sketch to our Customise portal. If you can imagine it, we can build it.</p>
          <Link to="/products" className="bg-surface text-primary px-8 py-3 rounded-xl font-bold shadow-sm hover:scale-105 transition-transform">
            Start Customising Now
          </Link>
        </div>

        <h3 className="text-2xl font-bold mb-4 text-primary">3. Supporting Local Artisans</h3>
        <p className="mb-4 leading-relaxed">
          When you buy from Furniture World, you aren't paying extra for a brand name or shipping costs from overseas. Every rupee goes directly into the hands of skilled local artisans who have spent their lives perfecting the craft of furniture making. 
        </p>
      </article>
      
    </div>
  );
};

export default Blog;
