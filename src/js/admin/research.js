const RESEARCH_TABLE = 'research';
const RESEARCH_BUCKET = 'research-files';
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const researchState = {
  records: [],
  filteredRecords: [],
  editingRecord: null,
  currentPage: 1,
  pageSize: 10
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  ensureDeleteSuccessModal();
  cacheElements();
  bindEvents();
  loadResearchRecords();
});

function cacheElements() {
  elements.form = document.getElementById('researchForm');
  elements.title = document.getElementById('research-title');
  elements.grade = document.getElementById('grade-level');
  elements.department = document.getElementById('department');
  elements.year = document.getElementById('year-publication');
  elements.category = document.getElementById('research-category');
  elements.imageInput = document.getElementById('research-image');
  elements.fileInput = document.getElementById('research-file');
  elements.imageDrop = document.getElementById('dragDropImageArea');
  elements.fileDrop = document.getElementById('dragDropArea');
  elements.imageName = document.getElementById('imageNameDisplay');
  elements.fileName = document.getElementById('fileNameDisplay');
  elements.submitButton = document.getElementById('submitBtn');
  elements.resetButton = document.getElementById('resetBtn');
  elements.cancelEditButton = document.getElementById('cancelEditBtn');
  elements.status = document.getElementById('statusMessage');
  elements.items = document.getElementById('researchItems');
  elements.search = document.getElementById('adminResearchSearch');
  elements.pagination = document.getElementById('paginationControls');
}

function bindEvents() {
  elements.form?.addEventListener('submit', handleSubmit);
  elements.form?.addEventListener('reset', () => {
    window.setTimeout(resetFormState, 0);
  });

  elements.cancelEditButton?.addEventListener('click', resetFormState);
  elements.search?.addEventListener('input', applySearchFilter);

  setupDropZone(elements.imageDrop, elements.imageInput, 'image');
  setupDropZone(elements.fileDrop, elements.fileInput, 'pdf');

  elements.imageInput?.addEventListener('change', () => updateFileLabel('image'));
  elements.fileInput?.addEventListener('change', () => updateFileLabel('pdf'));

  elements.items?.addEventListener('click', async (event) => {
    const editButton = event.target.closest('[data-action="edit"]');
    const deleteButton = event.target.closest('[data-action="delete"]');

    if (editButton) {
      const record = researchState.records.find((item) => Number(item.id) === Number(editButton.dataset.id));
      if (record) {
        populateFormForEdit(record);
      }
      return;
    }

    if (deleteButton) {
      const id = Number(deleteButton.dataset.id);
      if (id) {
        await deleteResearchRecord(id);
      }
    }
  });
}

function setupDropZone(dropZone, input, type) {
  if (!dropZone || !input) return;

  const openPicker = () => input.click();

  dropZone.addEventListener('click', openPicker);
  dropZone.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openPicker();
    }
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropZone.addEventListener(eventName, (event) => {
      event.preventDefault();
      dropZone.classList.remove('dragover');
    });
  });

  dropZone.addEventListener('drop', (event) => {
    const file = event.dataTransfer?.files?.[0];
    if (!file) return;

    const validationError = type === 'image' ? validateImage(file) : validatePdf(file);
    if (validationError) {
      showStatus(validationError, true);
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    updateFileLabel(type);
  });
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!window.supabaseClient) {
    showStatus('Supabase is not available right now.', true);
    return;
  }

  const payload = {
    title: elements.title.value.trim(),
    grade: elements.grade.value,
    department: elements.department.value,
    year: elements.year.value,
    category: elements.category.value.trim()
  };

  const imageFile = elements.imageInput.files[0] || null;
  const pdfFile = elements.fileInput.files[0] || null;

  if (!payload.title || !payload.grade || !payload.department || !payload.year || !payload.category) {
    showStatus('Please complete all research details before saving.', true);
    return;
  }

  const imageError = imageFile ? validateImage(imageFile) : '';
  const pdfError = pdfFile ? validatePdf(pdfFile) : '';

  if (imageError) {
    showStatus(imageError, true);
    return;
  }

  if (pdfError) {
    showStatus(pdfError, true);
    return;
  }

  if (!researchState.editingRecord && !imageFile) {
    showStatus('Please upload a research cover image.', true);
    return;
  }

  if (!researchState.editingRecord && !pdfFile) {
    showStatus('Please upload a research PDF file.', true);
    return;
  }

  setSavingState(true);
  showStatus(researchState.editingRecord ? 'Updating research entry...' : 'Saving research entry...');

  const uploadedPaths = [];
  const oldPathsToDelete = [];

  try {
    const recordBeingEdited = researchState.editingRecord;
    let imageUrl = recordBeingEdited?.image || null;
    let fileUrl = recordBeingEdited?.file || null;

    if (imageFile) {
      const imageUpload = await uploadFile(imageFile, 'images');
      uploadedPaths.push(imageUpload.path);
      imageUrl = imageUpload.publicUrl;

      if (recordBeingEdited?.image) {
        oldPathsToDelete.push(recordBeingEdited.image);
      }
    }

    if (pdfFile) {
      const pdfUpload = await uploadFile(pdfFile, 'pdfs');
      uploadedPaths.push(pdfUpload.path);
      fileUrl = pdfUpload.publicUrl;

      if (recordBeingEdited?.file) {
        oldPathsToDelete.push(recordBeingEdited.file);
      }
    }

    const databasePayload = {
      title: payload.title,
      grade: payload.grade,
      department: payload.department,
      year: payload.year,
      category: payload.category,
      image: imageUrl,
      file: fileUrl
    };

    if (recordBeingEdited) {
      const { error } = await window.supabaseClient
        .from(RESEARCH_TABLE)
        .update(databasePayload)
        .eq('id', recordBeingEdited.id);

      if (error) throw error;
    } else {
      const { error } = await window.supabaseClient
        .from(RESEARCH_TABLE)
        .insert(databasePayload);

      if (error) throw error;
    }

    await cleanupStoredFiles(oldPathsToDelete);
    resetFormState();
    await loadResearchRecords();
    showStatus(recordBeingEdited ? 'Research entry updated successfully.' : 'Research entry created successfully.');
  } catch (error) {
    console.error('Failed to save research entry:', error);
    await cleanupStoredFiles(uploadedPaths);
    showStatus(error.message || 'Failed to save the research entry.', true);
  } finally {
    setSavingState(false);
  }
}

async function loadResearchRecords() {
  if (!elements.items) return;

  if (!window.supabaseClient) {
    renderEmptyState('Supabase is not available right now.', true);
    return;
  }

  renderEmptyState('Loading research entries...');

  try {
    const { data, error } = await window.supabaseClient
      .from(RESEARCH_TABLE)
      .select('id, title, grade, department, year, category, image, file, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    researchState.records = (data || []).map(normalizeRecord);
    applySearchFilter();
  } catch (error) {
    console.error('Failed to load research records:', error);
    renderEmptyState('Failed to load research entries.', true);
  }
}

function normalizeRecord(record) {
  return {
    id: record.id,
    title: stringValue(record.title, 'Untitled Research'),
    grade: stringValue(record.grade, 'N/A'),
    department: stringValue(record.department, 'N/A'),
    year: stringValue(record.year, 'N/A'),
    category: stringValue(record.category, 'N/A'),
    image: stringValue(record.image),
    file: stringValue(record.file),
    createdAt: stringValue(record.created_at)
  };
}

function applySearchFilter() {
  const searchTerm = (elements.search?.value || '').trim().toLowerCase();

  researchState.filteredRecords = researchState.records.filter((record) => {
    if (!searchTerm) return true;

    return [
      record.title,
      record.grade,
      record.department,
      record.year,
      record.category
    ].some((value) => value.toLowerCase().includes(searchTerm));
  });

  researchState.currentPage = 1;
  renderRecords();
  renderPagination();
}

function renderRecords() {
  if (!elements.items) return;

  if (researchState.filteredRecords.length === 0) {
    renderEmptyState('No research entries found.');
    return;
  }

  const startIndex = (researchState.currentPage - 1) * researchState.pageSize;
  const visibleRecords = researchState.filteredRecords.slice(
    startIndex,
    startIndex + researchState.pageSize
  );

  elements.items.innerHTML = visibleRecords.map((record, index) => {
    const absoluteIndex = startIndex + index;
    const themeClass = absoluteIndex % 2 === 0 ? 'light-bg' : 'dark-bg';
    const imageContent = record.image
      ? `<img src="${escapeHtml(record.image)}" alt="${escapeHtml(record.title)} cover">`
      : '<div class="image-placeholder"><i class="fas fa-image"></i><span>No image</span></div>';
    const fileLink = record.file
      ? `<a href="${escapeHtml(appendPdfViewerHints(record.file))}" class="btn-view" target="_blank" rel="noopener noreferrer">View PDF</a>`
      : '<span class="file-status">No PDF uploaded</span>';

    return `
      <article class="research-item ${themeClass}">
        <div class="item-image">
          ${imageContent}
        </div>
        <div class="item-content">
          <h3 class="item-title">${escapeHtml(record.title)}</h3>
          <p class="item-description">${escapeHtml(toDisplayLabel(record.category))}</p>
          <p class="item-meta">
            <span class="meta-item">${escapeHtml(toDisplayLabel(record.grade))}</span>
            <span class="meta-item">${escapeHtml(toDisplayLabel(record.department))}</span>
          </p>
          <p class="item-meta">
            <span class="meta-item">${escapeHtml(record.year)}</span>
            <span class="meta-item">${escapeHtml(toDisplayLabel(record.category))}</span>
          </p>
          <div class="item-actions">
            ${fileLink}
            <button type="button" class="btn-delete-record" data-action="delete" data-id="${record.id}">Delete</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function renderEmptyState(message, isError = false) {
  if (!elements.items) return;

  elements.items.innerHTML = `
    <div class="no-results${isError ? ' error-state' : ''}">
      <p>${escapeHtml(message)}</p>
    </div>
  `;

  if (elements.pagination) {
    elements.pagination.innerHTML = '';
  }
}

function renderPagination() {
  const pagination = elements.pagination;
  if (!pagination) return;

  pagination.innerHTML = '';

  const totalPages = Math.ceil(researchState.filteredRecords.length / researchState.pageSize);
  if (totalPages <= 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createPaginationButton('Previous', researchState.currentPage - 1, {
      isDisabled: researchState.currentPage === 1,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Previous page'
    })
  );

  buildPaginationItems(totalPages, researchState.currentPage).forEach((item) => {
    if (item === 'ellipsis') {
      fragment.appendChild(createPaginationEllipsis());
      return;
    }

    fragment.appendChild(
      createPaginationButton(String(item), item, {
        isActive: item === researchState.currentPage,
        ariaLabel: 'Page ' + item
      })
    );
  });

  fragment.appendChild(
    createPaginationButton('Next', researchState.currentPage + 1, {
      isDisabled: researchState.currentPage === totalPages,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Next page'
    })
  );

  pagination.appendChild(fragment);
}

function buildPaginationItems(totalPages, currentPage) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items = [1];
  let startPage = Math.max(2, currentPage - 1);
  let endPage = Math.min(totalPages - 1, currentPage + 1);

  if (currentPage <= 4) {
    startPage = 2;
    endPage = 5;
  } else if (currentPage >= totalPages - 3) {
    startPage = totalPages - 4;
    endPage = totalPages - 1;
  }

  if (startPage > 2) {
    items.push('ellipsis');
  }

  for (let page = startPage; page <= endPage; page += 1) {
    items.push(page);
  }

  if (endPage < totalPages - 1) {
    items.push('ellipsis');
  }

  items.push(totalPages);
  return items;
}

function createPaginationButton(label, page, options = {}) {
  const {
    isActive = false,
    isDisabled = false,
    extraClass = '',
    ariaLabel = label
  } = options;

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'pagination-btn' + (isActive ? ' active' : '') + (extraClass ? ' ' + extraClass : '');
  button.textContent = label;
  button.setAttribute('aria-label', ariaLabel);

  if (isActive) {
    button.setAttribute('aria-current', 'page');
  }

  if (isDisabled) {
    button.disabled = true;
    button.setAttribute('aria-disabled', 'true');
    return button;
  }

  button.addEventListener('click', () => {
    researchState.currentPage = page;
    renderRecords();
    renderPagination();
  });

  return button;
}

function createPaginationEllipsis() {
  const ellipsis = document.createElement('span');
  ellipsis.className = 'pagination-ellipsis';
  ellipsis.textContent = '...';
  ellipsis.setAttribute('aria-hidden', 'true');
  return ellipsis;
}

function populateFormForEdit(record) {
  researchState.editingRecord = record;
  elements.title.value = record.title;
  elements.grade.value = record.grade;
  elements.department.value = record.department;
  elements.year.value = record.year;
  elements.category.value = record.category;
  elements.submitButton.textContent = 'Save Changes';
  elements.cancelEditButton.style.display = 'inline-flex';
  elements.imageName.textContent = record.image ? 'Keep current image or choose a new one' : 'Choose an image';
  elements.fileName.textContent = record.file ? 'Keep current PDF or choose a new one' : 'Choose a PDF';
  elements.imageDrop.classList.toggle('has-file', Boolean(record.image));
  elements.fileDrop.classList.toggle('has-file', Boolean(record.file));
  showStatus(`Editing "${record.title}".`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteResearchRecord(id) {
  const record = researchState.records.find((item) => Number(item.id) === Number(id));
  if (!record) return;

  const confirmed = window.confirm(`Delete "${record.title}"? This action cannot be undone.`);
  if (!confirmed) return;

  showStatus('Deleting research entry...');

  try {
    const { error } = await window.supabaseClient
      .from(RESEARCH_TABLE)
      .delete()
      .eq('id', id);

    if (error) throw error;

    await cleanupStoredFiles([record.image, record.file]);

    if (researchState.editingRecord?.id === id) {
      resetFormState();
    }

    await loadResearchRecords();
    openDeleteSuccessModal('Research entry deleted successfully.');
    showStatus('Research entry deleted successfully.');
  } catch (error) {
    console.error('Failed to delete research entry:', error);
    showStatus(error.message || 'Failed to delete the research entry.', true);
  }
}

function ensureDeleteSuccessModal() {
  if (document.getElementById('deleteSuccessModal')) return;

  const modal = document.createElement('div');
  modal.id = 'deleteSuccessModal';
  modal.className = 'success-modal';
  modal.innerHTML = [
    '<div class="success-modal__dialog" role="dialog" aria-modal="true" aria-labelledby="deleteSuccessTitle">',
      '<button type="button" class="success-modal__close" aria-label="Close">&times;</button>',
      '<div class="success-icon" aria-hidden="true"><i class="fas fa-circle-check"></i></div>',
      '<h2 id="deleteSuccessTitle">Deleted Successfully</h2>',
      '<p id="deleteSuccessMessage">Research entry deleted successfully.</p>',
      '<button type="button" class="success-modal__button">OK</button>',
    '</div>'
  ].join('');

  const closeModal = () => closeDeleteSuccessModal();
  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
  modal.querySelector('.success-modal__close')?.addEventListener('click', closeModal);
  modal.querySelector('.success-modal__button')?.addEventListener('click', closeModal);

  document.body.appendChild(modal);

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeDeleteSuccessModal();
    }
  });
}

function openDeleteSuccessModal(message) {
  const modal = document.getElementById('deleteSuccessModal');
  const modalMessage = document.getElementById('deleteSuccessMessage');
  if (!modal || !modalMessage) return;

  modalMessage.textContent = message;
  modal.classList.add('show');
}

function closeDeleteSuccessModal() {
  const modal = document.getElementById('deleteSuccessModal');
  if (modal) {
    modal.classList.remove('show');
  }
}

function resetFormState() {
  researchState.editingRecord = null;
  elements.form?.reset();
  elements.submitButton.textContent = 'Create New';
  elements.cancelEditButton.style.display = 'none';
  elements.imageName.textContent = 'Drag and drop or click to browse an image';
  elements.fileName.textContent = 'Drag and drop or click to browse a PDF';
  elements.imageDrop.classList.remove('has-file');
  elements.fileDrop.classList.remove('has-file');
}

function updateFileLabel(type) {
  const input = type === 'image' ? elements.imageInput : elements.fileInput;
  const label = type === 'image' ? elements.imageName : elements.fileName;
  const dropZone = type === 'image' ? elements.imageDrop : elements.fileDrop;
  const file = input?.files?.[0];

  if (!file) {
    label.textContent = type === 'image'
      ? 'Drag and drop or click to browse an image'
      : 'Drag and drop or click to browse a PDF';
    dropZone.classList.remove('has-file');
    return;
  }

  label.textContent = `${file.name} (${formatFileSize(file.size)})`;
  dropZone.classList.add('has-file');
}

async function uploadFile(file, folder) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await window.supabaseClient.storage
    .from(RESEARCH_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined
    });

  if (error) throw error;

  const { data } = window.supabaseClient.storage
    .from(RESEARCH_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data?.publicUrl || ''
  };
}

async function cleanupStoredFiles(fileReferences) {
  const paths = fileReferences
    .map(extractStoragePath)
    .filter(Boolean);

  if (paths.length === 0) return;

  try {
    await window.supabaseClient.storage.from(RESEARCH_BUCKET).remove(paths);
  } catch (error) {
    console.warn('Could not clean up some research files:', error);
  }
}

function extractStoragePath(fileReference) {
  if (!fileReference || typeof fileReference !== 'string') return '';

  const marker = `/${RESEARCH_BUCKET}/`;
  if (fileReference.includes(marker)) {
    return fileReference.split(marker)[1].split('?')[0];
  }

  return fileReference.replace(/^\/+/, '').replace(new RegExp(`^${RESEARCH_BUCKET}/`, 'i'), '');
}

function validateImage(file) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return 'Please upload a JPG, PNG, GIF, or WEBP image.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'Image size must be 10 MB or smaller.';
  }

  return '';
}

function validatePdf(file) {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
  if (!isPdf) {
    return 'Please upload a PDF file.';
  }

  if (file.size > MAX_FILE_SIZE) {
    return 'PDF size must be 10 MB or smaller.';
  }

  return '';
}

function setSavingState(isSaving) {
  if (!elements.submitButton) return;

  elements.submitButton.disabled = isSaving;
  elements.resetButton.disabled = isSaving;
  elements.cancelEditButton.disabled = isSaving;
  elements.submitButton.textContent = isSaving
    ? 'Saving...'
    : (researchState.editingRecord ? 'Save Changes' : 'Create New');
}

function showStatus(message, isError = false) {
  if (!elements.status) return;

  elements.status.textContent = message;
  elements.status.className = `status-message${isError ? ' error' : ' success'}`;
}

function toDisplayLabel(value) {
  return String(value || '')
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function escapeHtml(value) {
  const div = document.createElement('div');
  div.textContent = value == null ? '' : String(value);
  return div.innerHTML;
}

function stringValue(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function appendPdfViewerHints(url) {
  return url.includes('#') ? url : `${url}#toolbar=1&navpanes=0`;
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) return '0 KB';
  const mb = size / (1024 * 1024);
  if (mb >= 1) {
    return `${mb.toFixed(2)} MB`;
  }

  return `${(size / 1024).toFixed(0)} KB`;
}
