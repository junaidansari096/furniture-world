import { FaWhatsapp } from 'react-icons/fa';

const FloatingWhatsApp = () => {
  // Replace with actual shop number
  const phoneNumber = "911234567890"; 
  const message = "Hello! I want to order furniture.";
  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-[#25D366] text-white py-3 px-5 md:py-4 md:px-6 rounded-full shadow-ambient hover:scale-105 transition-transform duration-300"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp className="text-2xl" />
      <span className="hidden md:inline font-bold font-body">Chat with us</span>
    </a>
  );
};

export default FloatingWhatsApp;
