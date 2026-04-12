import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { addQuery } from '../data/queries';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Save to local query store for Admin panel
      addQuery({ type: 'contact', source: 'Contact Page', ...formData });

      try {
        await addDoc(collection(db, 'contact_queries'), {
          ...formData,
          timestamp: serverTimestamp()
        });
      } catch (fbError) {
        // Fallback for unset firebase config
      }
      setSuccess(true);
      setFormData({ name: '', phone: '', message: '' });
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 px-6 md:px-12 max-w-6xl mx-auto min-h-[70vh]">
      <h1 className="text-4xl md:text-5xl font-display font-bold text-primary mb-12 text-center">Get In Touch</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        
        {/* Contact Info & Map */}
        <div className="flex flex-col gap-8">
          <div className="bg-surface-container-low p-8 rounded-[2rem] ghost-border">
            <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Shop Location</h2>
            <div className="text-lg text-on-surface-variant font-body mb-4 flex gap-4">
              <span className="mt-1">📍</span>
              <p>Furniture World<br/>124 Main Market, Workshop Row<br/>West Bengal, India</p>
            </div>
            <div className="text-lg text-on-surface-variant font-body mb-4 flex items-center gap-4">
              <span>📞</span>
              <p className="font-bold">+91 98765 43210</p>
            </div>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
              <button className="mt-4 bg-[#25D366] text-white px-6 py-3 rounded-lg font-bold hover:opacity-90 transition-opacity">WhatsApp Us</button>
            </a>
          </div>

          <div className="w-full h-64 bg-surface-container-highest rounded-[2rem] overflow-hidden">
            {/* Simple dummy iframe for map requirement */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117925.21689626325!2d88.26495147879482!3d22.535564937803628!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f882db4908f667%3A0x43e330e68f6c2cbc!2sKolkata%2C%20West%20Bengal!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Google Map"
            ></iframe>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-surface-container-lowest shadow-ambient p-8 md:p-10 rounded-[2rem]">
          <h2 className="text-2xl font-display font-bold text-on-surface mb-6">Send a Message</h2>
          
          {success ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4 bg-tertiary-container inline-block w-16 h-16 rounded-full leading-[64px] text-on-tertiary">✓</div>
              <h3 className="text-2xl font-bold text-primary mb-2">Message Sent</h3>
              <p className="text-on-surface-variant font-body">We will get back to you soon.</p>
              <button onClick={() => setSuccess(false)} className="mt-6 text-primary underline">Send another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase text-on-surface-variant">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="bg-surface-container-highest p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase text-on-surface-variant">Phone (Required)</label>
                <input required type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-surface-container-highest p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold uppercase text-on-surface-variant">Message</label>
                <textarea required rows="4" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} className="bg-surface-container-highest p-4 rounded-xl focus:ring-2 focus:ring-primary outline-none resize-none"></textarea>
              </div>
              
              <button disabled={loading} type="submit" className="w-full bg-wood-gradient text-on-primary py-4 font-bold text-lg rounded-xl shadow-ambient mt-4">
                {loading ? "Sending..." : "Submit Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
