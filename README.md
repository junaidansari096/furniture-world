# Furniture World Connect

A modern, responsive, React-based web application tailored for a local furniture shop. Features a custom design system ("Digital Carpentry"), sleek product showcasing, WhatsApp integration, and Firebase backend support.

## Prerequisites
- Node.js (v18+)

## Setup Instructions

1. **Install Dependencies**
   Navigate to this directory (`e:/Furniture world`) and run:
   ```bash
   npm install
   ```

2. **Configure Firebase (Optional but Recommended)**
   - Create a Firebase Project at [firebase.google.com](https://firebase.google.com).
   - Enable **Firestore** and **Storage**.
   - Get your project's configuration object (Web API key, Auth Domain, Project ID, etc.).
   - Open `src/firebase.js` in this project and replace the placeholder values in the `firebaseConfig` object with your actual keys.
   - For Firestore, make sure your security rules allow writing for testing (or configure them appropriately for production).

3. **Run the Development Server**
   Start Vite:
   ```bash
   npm run dev
   ```
   Open the Local URL (usually `http://localhost:5173`) in your browser to view the app!

## Design System
The UI utilizes Tailwind CSS v4 and the provided custom design system:
- **Primary:** #6B4226 (Wood brown)
- **Secondary:** #F5E6D3 (Beige Canvas)
- **Accent/CTA:** #25D366 (WhatsApp green)
- **Typography:** Poppins (Headings) & Open Sans (Body)
