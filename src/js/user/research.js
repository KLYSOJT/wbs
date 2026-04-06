<<<<<<< Updated upstream
document.addEventListener('DOMContentLoaded', initResearchPage);

const RESEARCH_BUCKET = 'research-files';

const researchState = {
  records: [],
  filteredRecords: []
};

const researchElements = {};

async function initResearchPage() {
  cacheElements();
  bindEvents();

  if (!window.supabaseClient) {
    showStatus('Supabase is not available right now.', true);
    renderEmptyState('Research entries are unavailable right now.', true);
    return;
  }

  try {
    showStatus('Loading research entries...');
    await fetchResearchRecords();
    applyFilters();
    showStatus('');
  } catch (error) {
    console.error('Failed to initialize research page:', error);
    showStatus('Failed to load research entries.', true);
    renderEmptyState('Failed to load research entries.', true);
  }
}

function cacheElements() {
  researchElements.form = document.getElementById('researchSearchForm');
  researchElements.title = document.getElementById('research-title');
  researchElements.grade = document.getElementById('grade-level');
  researchElements.department = document.getElementById('department');
  researchElements.year = document.getElementById('year-publication');
  researchElements.category = document.getElementById('research-category');
  researchElements.items = document.getElementById('researchItems');
  researchElements.status = document.getElementById('statusMessage');
}

function bindEvents() {
  researchElements.form?.addEventListener('submit', (event) => {
    event.preventDefault();
    applyFilters();
  });

  researchElements.form?.addEventListener('reset', () => {
    window.setTimeout(applyFilters, 0);
  });

  [
    researchElements.title,
    researchElements.grade,
    researchElements.department,
    researchElements.year,
    researchElements.category
  ].forEach((field) => {
    field?.addEventListener('input', debounce(applyFilters, 200));
    field?.addEventListener('change', applyFilters);
  });
}

async function fetchResearchRecords() {
  const { data, error } = await window.supabaseClient
    .from('research')
    .select('id, title, grade, department, year, category, image, file, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  researchState.records = (data || []).map(normalizeRecord);
  researchState.filteredRecords = [...researchState.records];
}

function normalizeRecord(record) {
  const imageUrl = resolveStorageUrl(record.image);
  const fileUrl = resolveStorageUrl(record.file);

  return {
    id: record.id,
    title: stringValue(record.title, 'Untitled Research'),
    grade: stringValue(record.grade),
    department: stringValue(record.department),
    year: stringValue(record.year),
    category: stringValue(record.category),
    image: imageUrl,
    file: fileUrl
  };
}

function resolveStorageUrl(fileValue) {
  if (!fileValue || typeof fileValue !== 'string') {
    return '';
  }

  if (/^https?:\/\//i.test(fileValue)) {
    return fileValue;
  }

  const cleanedPath = fileValue
    .replace(/^\/+/, '')
    .replace(new RegExp(`^${RESEARCH_BUCKET}/`, 'i'), '');

  if (!cleanedPath) {
    return '';
  }

  const { data } = window.supabaseClient.storage
    .from(RESEARCH_BUCKET)
    .getPublicUrl(cleanedPath);

  return data?.publicUrl || '';
}

function applyFilters() {
  const titleFilter = (researchElements.title?.value || '').trim().toLowerCase();
  const gradeFilter = (researchElements.grade?.value || '').trim().toLowerCase();
  const departmentFilter = (researchElements.department?.value || '').trim().toLowerCase();
  const yearFilter = (researchElements.year?.value || '').trim().toLowerCase();
  const categoryFilter = (researchElements.category?.value || '').trim().toLowerCase();

  researchState.filteredRecords = researchState.records.filter((record) => {
    const matchesTitle = !titleFilter || record.title.toLowerCase().includes(titleFilter);
    const matchesGrade = !gradeFilter || record.grade.toLowerCase() === gradeFilter;
    const matchesDepartment = !departmentFilter || record.department.toLowerCase() === departmentFilter;
    const matchesYear = !yearFilter || record.year.toLowerCase() === yearFilter;
    const matchesCategory = !categoryFilter || record.category.toLowerCase().includes(categoryFilter);

    return matchesTitle && matchesGrade && matchesDepartment && matchesYear && matchesCategory;
  });

  renderRecords();
}

function renderRecords() {
  if (!researchElements.items) return;

  if (researchState.filteredRecords.length === 0) {
    renderEmptyState('No research matched your filters.');
    return;
  }

  researchElements.items.innerHTML = researchState.filteredRecords.map((record, index) => {
    const themeClass = index % 2 === 0 ? 'light-bg' : 'dark-bg';
    const imageContent = record.image
      ? `<img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} cover">`
      : '<div class="image-placeholder"><i class="fas fa-image"></i><span>No image available</span></div>';
    const actionMarkup = record.file
      ? `<a href="${escapeHtml(appendPdfViewerHints(record.file))}" class="btn-view" target="_blank" rel="noopener noreferrer">View Research</a>`
      : '<span class="file-status">PDF unavailable</span>';

    return `
      <article class="research-item ${themeClass}">
        <div class="item-image">
          ${imageContent}
        </div>
        <div class="item-content">
          <h3 class="item-title">${escapeHtml(record.title)}</h3>
          <p class="item-description">${escapeHtml(toDisplayLabel(record.category || 'Research'))}</p>
          <p class="item-meta">
            <span class="meta-item">${escapeHtml(toDisplayLabel(record.grade || 'N/A'))}</span>
            <span class="meta-item">${escapeHtml(toDisplayLabel(record.department || 'N/A'))}</span>
          </p>
          <p class="item-meta">
            <span class="meta-item">${escapeHtml(record.year || 'N/A')}</span>
            <span class="meta-item">${escapeHtml(toDisplayLabel(record.category || 'N/A'))}</span>
          </p>
          ${actionMarkup}
        </div>
      </article>
    `;
  }).join('');
}

function renderEmptyState(message, isError = false) {
  if (!researchElements.items) return;

  researchElements.items.innerHTML = `
    <div class="no-results${isError ? ' error-state' : ''}">
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

function showStatus(message, isError = false) {
  if (!researchElements.status) return;

  researchElements.status.textContent = message;
  researchElements.status.className = message
    ? `status-message${isError ? ' error' : ' success'}`
    : 'status-message';
}

function appendPdfViewerHints(url) {
  return url.includes('#') ? url : `${url}#toolbar=1&navpanes=0`;
}

function toDisplayLabel(value) {
  return String(value || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function stringValue(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}
=======
// research.js - Handles research page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Handle search form
    const searchForm = document.getElementById('researchSearchForm');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Implement search logic here
            console.log('Search submitted');
            // For now, just log
        });
    }

    // Handle submit research form
    const submitForm = document.getElementById('submitResearchForm');
    if (submitForm) {
        submitForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const title = formData.get('title');
            const grade = formData.get('grade');
            const department = formData.get('department');
            const year = formData.get('year');
            const category = formData.get('category');
            const pictureFile = formData.get('picture');
            const researchFile = formData.get('file');

            console.log('Form data:', { title, grade, department, year, category, pictureFile, researchFile });

            if (!pictureFile || !researchFile) {
                alert('Please select both picture and file to upload.');
                return;
            }

            try {
                // Upload picture
                const pictureFileName = `research-images/${Date.now()}-${pictureFile.name}`;
                console.log('Uploading picture:', pictureFileName);
                const { data: pictureData, error: pictureError } = await window.supabaseClient.storage
                    .from('research')
                    .upload(pictureFileName, pictureFile);

                if (pictureError) {
                    console.error('Picture upload error:', pictureError);
                    throw pictureError;
                }
                console.log('Picture uploaded:', pictureData);

                const { data: pictureUrlData } = window.supabaseClient.storage
                    .from('research')
                    .getPublicUrl(pictureFileName);
                console.log('Picture URL:', pictureUrlData.publicUrl);

                // Upload research file
                const researchFileName = `research-files/${Date.now()}-${researchFile.name}`;
                console.log('Uploading file:', researchFileName);
                const { data: fileData, error: fileError } = await window.supabaseClient.storage
                    .from('research')
                    .upload(researchFileName, researchFile);

                if (fileError) {
                    console.error('File upload error:', fileError);
                    throw fileError;
                }
                console.log('File uploaded:', fileData);

                const { data: fileUrlData } = window.supabaseClient.storage
                    .from('research')
                    .getPublicUrl(researchFileName);
                console.log('File URL:', fileUrlData.publicUrl);

                // Insert into database
                console.log('Inserting into database...');
                const { data, error: insertError } = await window.supabaseClient
                    .from('research')
                    .insert([
                        {
                            title: title,
                            grade: grade,
                            department: department,
                            year: year,
                            category: category,
                            image: pictureUrlData.publicUrl,
                            file: fileUrlData.publicUrl
                        }
                    ]);

                if (insertError) {
                    console.error('Database insert error:', insertError);
                    throw insertError;
                }
                console.log('Inserted successfully:', data);

                alert('Research submitted successfully!');
                this.reset();

            } catch (error) {
                console.error('Error submitting research:', error);
                alert('Error submitting research: ' + error.message);
            }
        });
    }
});

// Function for viewing research (placeholder)
function viewResearch(id, title) {
    alert(`Viewing research: ${title}`);
}
>>>>>>> Stashed changes
