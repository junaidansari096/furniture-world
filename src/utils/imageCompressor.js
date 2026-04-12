/**
 * Compresses an image file and converts it to a tiny Base64 WebP string 
 * suitable for LocalStorage without blowing up the 5MB browser quota.
 * 
 * @param {File} file - The image file from the input
 * @param {number} maxWidth - Maximum width (height scales automatically)
 * @param {number} quality - Quality of webp compression (0.0 to 1.0)
 * @returns {Promise<string>} Base64 data URL
 */
export const compressImage = (file, maxWidth = 1000, quality = 0.6) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject("No file provided");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        // Create a canvas and draw the resized image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        // Good practice: fill canvas with white in case of transparent PNGs converting to JPEG/WebP
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        
        ctx.drawImage(img, 0, 0, width, height);

        // Convert back to Base64 (WebP is extremely space efficient)
        // If webp isn't supported, it silently falls back to png which is larger. 
        // We'll use webp/jpeg to keep it small
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };

      img.onerror = (err) => reject("Image loading error", err);
      img.src = event.target.result;
    };

    reader.onerror = (err) => reject("File reading error", err);
    reader.readAsDataURL(file);
  });
};
