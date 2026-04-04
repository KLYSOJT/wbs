const RECOGNIZED_TABLE = 'recognized-structure';
const RECOGNIZED_BUCKET = 'recognized-structure-files';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const state = {
  records: []
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  cacheElements();
  bindEvents();
  loadOrganizations();
});

function cacheElements() {
  elements.form = document.getElementById('recognizedForm');
  elements.grid = document.getElementById('recognizedGrid');
  elements.status = document.getElementById('statusMessage');
  elements.imageInput = document.getElementById('orgImage');
  elements.pdfInput = document.getElementById('orgPdf');
  elements.imageDrop = document.getElementById('imageDragDrop');
  elements.pdfDrop = document.getElementById('pdfDragDrop');
  elements.imageLabel = document.getElementById('imageFileLabel');
  elements.pdfLabel = document.getElementById('pdfFileLabel');
  elements.saveButton = document.getElementById('saveButton');
}

function bindEvents() {
  elements.form?.addEventListener('submit', handleSubmit);
  setupDropZone(elements.imageDrop, elements.imageInput, updateFileLabels, ['image/']);
  setupDropZone(elements.pdfDrop, elements.pdfInput, updateFileLabels, ['application/pdf']);
  elements.imageInput?.addEventListener('change', updateFileLabels);
  elements.pdfInput?.addEventListener('change', updateFileLabels);
}

function setupDropZone(dropZone, input, onChange, allowedPrefixes) {
  if (!dropZone || !input) return;

  dropZone.addEventListener('click', () => input.click());

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

    const isAllowed = allowedPrefixes.some((prefix) => {
      if (prefix === 'application/pdf') {
        return file.type === prefix || file.name.toLowerCase().endsWith('.pdf');
      }

      return file.type.startsWith(prefix);
    });

    if (!isAllowed) {
      window.alert('Invalid file type selected.');
      return;
    }

    const transfer = new DataTransfer();
    transfer.items.add(file);
    input.files = transfer.files;
    onChange();
  });
}

function updateFileLabels() {
  elements.imageLabel.textContent = elements.imageInput?.files?.[0]?.name || 'Drag and drop or click to browse';
  elements.pdfLabel.textContent = elements.pdfInput?.files?.[0]?.name || 'Drag and drop or click to browse';
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!window.supabaseClient) {
    showStatus('Supabase is not available right now.', true);
    return;
  }

  const orgName = document.getElementById('org_name').value.trim();
  const dateEstablished = document.getElementById('date_established').value || null;
  const adviserName = document.getElementById('adviser_name').value.trim() || null;
  const imageFile = elements.imageInput.files[0];
  const pdfFile = elements.pdfInput.files[0] || null;

  if (!orgName || !imageFile) {
    showStatus('Organization name and image are required.', true);
    return;
  }

  if (!isValidImage(imageFile)) {
    showStatus('Please upload a valid image file under 10 MB.', true);
    return;
  }

  if (pdfFile && !isValidPdf(pdfFile)) {
    showStatus('Please upload a valid PDF file under 10 MB.', true);
    return;
  }

  setSavingState(true);
  showStatus('Uploading files and saving organization...');

  const uploadedPaths = [];

  try {
    const imageUpload = await uploadFile(imageFile, 'images');
    uploadedPaths.push(imageUpload.path);

    let pdfUpload = null;
    if (pdfFile) {
      pdfUpload = await uploadFile(pdfFile, 'pdfs');
      uploadedPaths.push(pdfUpload.path);
    }

    const payload = {
      org_name: orgName,
      date_established: dateEstablished,
      adviser_name: adviserName,
      image_url: imageUpload.publicUrl,
      image_path: imageUpload.path,
      image_mime: imageFile.type || null,
      pdf_url: pdfUpload?.publicUrl || null,
      pdf_path: pdfUpload?.path || null,
      pdf_mime: pdfFile?.type || null
    };

    const { error } = await window.supabaseClient
      .from(RECOGNIZED_TABLE)
      .insert(payload);

    if (error) {
      throw error;
    }

    elements.form.reset();
    updateFileLabels();
    showStatus('Recognized organization saved successfully.');
    await loadOrganizations();
  } catch (error) {
    await cleanupUploadedFiles(uploadedPaths);
    console.error('Failed to save organization:', error);
    showStatus(error.message || 'Failed to save organization.', true);
  } finally {
    setSavingState(false);
  }
}

async function loadOrganizations() {
  if (!elements.grid) return;

  if (!window.supabaseClient) {
    elements.grid.innerHTML = '<div class="notice error">Supabase is not available right now.</div>';
    return;
  }

  elements.grid.innerHTML = '<div class="notice">Loading organizations...</div>';

  try {
    const { data, error } = await window.supabaseClient
      .from(RECOGNIZED_TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    state.records = data || [];
    renderOrganizations();
  } catch (error) {
    console.error('Failed to load organizations:', error);
    elements.grid.innerHTML = '<div class="notice error">Failed to load organizations.</div>';
  }
}

function renderOrganizations() {
  if (!elements.grid) return;

  if (state.records.length === 0) {
    elements.grid.innerHTML = '<div class="notice">No organizations uploaded yet.</div>';
    return;
  }

  elements.grid.innerHTML = state.records.map((record) => {
    const established = record.date_established ? formatDate(record.date_established) : 'N/A';
    const adviser = escapeHtml(record.adviser_name || 'N/A');
    const updated = record.updated_at ? formatDateTime(record.updated_at) : 'N/A';
    const pdfLink = record.pdf_url
      ? `<div class="pdf-link"><a href="${escapeHtml(record.pdf_url)}" target="_blank" rel="noopener noreferrer" class="btn-pdf"><i class="fas fa-file-pdf"></i> View PDF</a></div>`
      : '<div class="pdf-link"><span class="date">No PDF uploaded</span></div>';

    return `
      <article class="uploaded-item">
        <img src="${escapeHtml(record.image_url || '')}" alt="${escapeHtml(record.org_name)}" class="item-image">
        <div class="meta">${escapeHtml(record.org_name)}</div>
        <div class="established">Established: ${escapeHtml(established)}</div>
        <div class="adviser">Adviser: ${adviser}</div>
        <div class="date">Updated: ${escapeHtml(updated)}</div>
        ${pdfLink}
        <div class="replace-form">
          <button type="button" class="btn-delete" data-id="${record.id}">Delete</button>
        </div>
      </article>
    `;
  }).join('');

  elements.grid.querySelectorAll('[data-id]').forEach((button) => {
    button.addEventListener('click', () => deleteOrganization(Number(button.dataset.id)));
  });
}

async function deleteOrganization(id) {
  const record = state.records.find((item) => Number(item.id) === Number(id));
  if (!record) return;

  const confirmed = window.confirm(`Delete "${record.org_name}"? This action cannot be undone.`);
  if (!confirmed) return;

  showStatus('Deleting organization...');

  try {
    const pathsToDelete = [record.image_path, record.pdf_path].filter(Boolean);
    if (pathsToDelete.length > 0) {
      const { error: storageError } = await window.supabaseClient.storage
        .from(RECOGNIZED_BUCKET)
        .remove(pathsToDelete);

      if (storageError) {
        throw storageError;
      }
    }

    const { error } = await window.supabaseClient
      .from(RECOGNIZED_TABLE)
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    showStatus('Organization deleted successfully.');
    await loadOrganizations();
  } catch (error) {
    console.error('Failed to delete organization:', error);
    showStatus(error.message || 'Failed to delete organization.', true);
  }
}

async function uploadFile(file, folder) {
  const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `${folder}/${uniqueId}-${safeName}`;

  const { error } = await window.supabaseClient.storage
    .from(RECOGNIZED_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined
    });

  if (error) {
    throw error;
  }

  const { data } = window.supabaseClient.storage
    .from(RECOGNIZED_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    publicUrl: data?.publicUrl || ''
  };
}

async function cleanupUploadedFiles(paths) {
  const cleanPaths = paths.filter(Boolean);
  if (cleanPaths.length === 0 || !window.supabaseClient?.storage) return;

  try {
    await window.supabaseClient.storage.from(RECOGNIZED_BUCKET).remove(cleanPaths);
  } catch (error) {
    console.warn('Cleanup failed:', error);
  }
}

function showStatus(message, isError = false) {
  if (!elements.status) return;
  elements.status.hidden = false;
  elements.status.className = `notice ${isError ? 'error' : 'success'}`;
  elements.status.textContent = message;
}

function setSavingState(isSaving) {
  if (!elements.saveButton) return;
  elements.saveButton.disabled = isSaving;
  elements.saveButton.textContent = isSaving ? 'Saving...' : 'Save Organization';
}

function isValidImage(file) {
  return Boolean(file && file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE);
}

function isValidPdf(file) {
  return Boolean(file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) && file.size <= MAX_FILE_SIZE);
}

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function formatDateTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
