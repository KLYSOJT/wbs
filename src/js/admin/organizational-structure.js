document.addEventListener('DOMContentLoaded', () => {
  createHiddenFileInput();
  replacePlaceholderImages();
  loadSavedDataFromSupabase();

  const buttons = document.querySelectorAll('.change-image-btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleChangeImage(button);
    });
  });
});

/* Replace external placeholder images with data URL placeholders */
function replacePlaceholderImages() {
  const cards = document.querySelectorAll('.card');
  
  cards.forEach(card => {
    const img = card.querySelector('img');
    const title = card.dataset.title;
    
    // Create a simple colored placeholder data URL
    const canvas = document.createElement('canvas');
    canvas.width = 280;
    canvas.height = 200;
    const ctx = canvas.getContext('2d');
    
    // Use a light gray background
    ctx.fillStyle = '#e9ecef';
    ctx.fillRect(0, 0, 280, 200);
    
    // Add gradient
    const gradient = ctx.createLinearGradient(0, 0, 280, 200);
    gradient.addColorStop(0, '#e9ecef');
    gradient.addColorStop(1, '#dee2e6');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 280, 200);
    
    // Add text
    ctx.fillStyle = '#495057';
    ctx.font = 'bold 18px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(title, 140, 100);
    
    // Create placeholder data URL
    const placeholderDataURL = canvas.toDataURL('image/png');
    
    // Replace the external URL with generated placeholder
    img.src = placeholderDataURL;
    
    // Store placeholder as fallback in data attribute
    img.dataset.placeholder = placeholderDataURL;
    
    // Handle image load errors by using fallback
    img.onerror = () => {
      img.src = img.dataset.placeholder;
    };
  });
}

/* Load saved images + timestamps from Supabase */
async function loadSavedDataFromSupabase() {
  const cards = document.querySelectorAll('.card');

  // Load all images from Supabase
  const allImages = await loadAllImagesFromSupabase();
  
  cards.forEach(card => {
    const title = card.dataset.title;
    const img = card.querySelector('img');
    const updatedText = card.querySelector('.updated');

    // Find matching image data
    const imageData = allImages.find(item => item.department === title);

    if (imageData && imageData.image) {
      // Set src for saved image
      img.src = imageData.image;
      // Remove onerror handler for saved images to prevent fallback override
      img.onerror = null;
    } else {
      // Keep onerror handler for placeholders
      img.onerror = () => {
        img.src = img.dataset.placeholder;
      };
    }

    if (imageData && imageData.updated_at) {
      const date = new Date(imageData.updated_at);
      const formatted = date.toLocaleString();
      updatedText.textContent = "Updated: " + formatted;
    }
  });
}

/* Hidden file input */
function createHiddenFileInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.id = 'fileInput';
  input.style.display = 'none';
  document.body.appendChild(input);
}

/* Handle button click */
function handleChangeImage(button) {
  const card = button.closest('.card');
  const title = card.dataset.title;
  const img = card.querySelector('img');
  const updatedText = card.querySelector('.updated');

  const fileInput = document.getElementById('fileInput');

  fileInput.value = '';

  fileInput.onchange = (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;

      // Update image
      img.src = imageData;
      
      // Remove error handler for saved images to prevent fallback override
      img.onerror = null;

      // Store original image data for maximum quality preservation
      const now = new Date();
      const timestamp = now.toISOString();
      
      saveImageToSupabase(title, imageData, timestamp)
        .then(() => {
          // Get formatted date for UI
          const formatted = now.toLocaleString();
          
          // Update UI
          updatedText.textContent = "Updated: " + formatted;
        })
        .catch((error) => {
          console.error('Error saving to Supabase:', error);
          alert('Error saving image: ' + (error.message || 'Unknown error'));
          // Clear the image from display on error
          img.src = img.dataset.placeholder;
        });
    };

    reader.readAsDataURL(file);
  };

  fileInput.click();
}