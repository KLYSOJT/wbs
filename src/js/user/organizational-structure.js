// User Organizational Structure - Load Local Images with Supabase Fallback

// Map department names to local image files
const departmentImageMap = {
  'TLE': '../../imgs/tle.png',
  'Math': '../../imgs/math.png',
  'English': '../../imgs/english.png',
  'Science': '../../imgs/science.png',
  'Filipino': '../../imgs/filipino.jpg',
  'AP': '../../imgs/ap.jpg',
  'MAPEH': '../../imgs/mapeh.png',
  'Values Education': '../../imgs/esp.png'
};

document.addEventListener('DOMContentLoaded', () => {
  loadOrganizationalStructureImages();
});

/**
 * Load organizational structure images - Keep card images static (local only)
 * Uploaded images will only appear in the modal
 */
async function loadOrganizationalStructureImages() {
  const departmentCards = document.querySelectorAll('.department-card');
  
  departmentCards.forEach(card => {
    const deptName = card.getAttribute('onclick').match(/'([^']+)'/)[1];
    const imgElement = card.querySelector('img');
    
    // Ensure local image path is set
    const localImagePath = departmentImageMap[deptName];
    
    if (localImagePath && !imgElement.src.includes(localImagePath)) {
      imgElement.src = localImagePath;
      imgElement.alt = deptName + ' Department';
    }
  });
  
  // Card images stay static - uploaded images only show in modal
  console.log('Department card images loaded (static). Uploaded images will appear in modal.');
}

/**
 * Create a placeholder image for departments
 * @param {string} deptName - Department name
 * @returns {string} - Data URL of placeholder image
 */
function createPlaceholderImage(deptName) {
  const canvas = document.createElement('canvas');
  canvas.width = 280;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  
  // Use a light gray background with gradient
  const gradient = ctx.createLinearGradient(0, 0, 280, 200);
  gradient.addColorStop(0, '#e9ecef');
  gradient.addColorStop(1, '#dee2e6');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 280, 200);
  
  // Add text
  ctx.fillStyle = '#495057';
  ctx.font = 'bold 16px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(deptName, 140, 100);
  
  return canvas.toDataURL('image/png');
}

/**
 * Show placeholders for all department cards on error
 */
function showPlaceholders() {
  const departmentCards = document.querySelectorAll('.department-card');
  departmentCards.forEach(card => {
    const deptName = card.getAttribute('onclick').match(/'([^']+)'/)[1];
    const imgElement = card.querySelector('img');
    imgElement.src = createPlaceholderImage(deptName);
  });
}

/**
 * Open modal with department information and image
 * @param {string} department - Department name
 */
async function openModal(department) {
  const modal = document.getElementById('departmentModal');
  const modalBody = document.getElementById('modalBody');
  
  try {
    // Fetch department image from Supabase
    const imageData = await loadImageFromSupabase(department);
    
    // Create modal content
    let content = `<h2>${department} Department</h2>`;
    
    if (imageData && imageData.image) {
      content += `
        <div class="modal-image-container">
          <img src="${imageData.image}" alt="${department}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
        </div>
      `;
      
      if (imageData.updated_at) {
        const date = new Date(imageData.updated_at);
        const formatted = date.toLocaleString();
        content += `<p style="color: #666; font-size: 0.9rem; margin-top: 10px;">Updated: ${formatted}</p>`;
      }
    } else {
      content += `
        <div class="modal-image-container">
          <img src="${createPlaceholderImage(department)}" alt="${department}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
        </div>
        <p style="color: #999; font-size: 0.9rem;">No image available for this department.</p>
      `;
    }
    
    modalBody.innerHTML = content;
    modal.classList.add('show');
    document.body.classList.add('department-modal-open');
  } catch (error) {
    console.error('Error opening modal:', error);
    const placeholderSrc = createPlaceholderImage(department);
    modalBody.innerHTML = `
      <h2>${department} Department</h2>
      <div class="modal-image-container">
        <img src="${placeholderSrc}" alt="${department}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0;">
      </div>
      <p style="color: #999; font-size: 0.9rem;">Unable to load department information.</p>
    `;
    modal.classList.add('show');
    document.body.classList.add('department-modal-open');
  }
}

/**
 * Close modal
 */
function closeModal() {
  const modal = document.getElementById('departmentModal');
  modal.classList.remove('show');
  document.body.classList.remove('department-modal-open');
}

/**
 * Close modal when clicking outside the content
 */
window.onclick = (event) => {
  const modal = document.getElementById('departmentModal');
  if (event.target === modal) {
    modal.classList.remove('show');
    document.body.classList.remove('department-modal-open');
  }
};
