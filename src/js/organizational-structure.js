const modal = document.getElementById('departmentModal');
const modalBody = document.getElementById('modalBody');

function openModal(department) {
  fetch(`admin/organization/get_org_structure.php?dept_name=${encodeURIComponent(department)}`)
    .then(response => response.json())
    .then(data => {
      let html = `<h2>${department.toUpperCase()}</h2>`;
      
      if (data.success) {
        const imagePath = data.image ? data.image : '';
        const pdfs = data.pdfs ? data.pdfs : [];
        
        if (imagePath) {
          html += `<div class="modal-image-section">
            <img src="${imagePath}" class="modal-image">
          </div>`;
        }
        
        if (pdfs.length > 0) {
          html += `<div class="modal-pdf-section">`;
          html += `<h3>Accomplishment Reports</h3>`;
          html += `<div class="pdf-items-container">`;

          pdfs.forEach(pdf => {
            html += `<a href="${pdf.path}" target="_blank" class="pdf-item">
              <i class="fas fa-file-pdf"></i>
              <span class="pdf-filename">${pdf.filename}</span>
            </a>`;
          });

          html += `</div></div>`;
        }
        
        if (!imagePath && pdfs.length === 0) {
          html += `<p class="no-data">No files available for this department.</p>`;
        }
      } else {
        html += `<p class="no-data">No information available for this department.</p>`;
      }
      
      modalBody.innerHTML = html;
      modal.style.display = 'block';
    })
    .catch(error => {
      console.error('Error fetching department data:', error);
      modalBody.innerHTML = `
        <h2>${department.toUpperCase()}</h2>
        <p class="no-data">Error loading department information.</p>
      `;
      modal.style.display = 'block';
    });
}

function closeModal() {
  modal.style.display = 'none';
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = 'none';
  }
};