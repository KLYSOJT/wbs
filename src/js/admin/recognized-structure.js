const RECOGNIZED_TABLE = 'recognized-structure';
const RECOGNIZED_BUCKET = 'recognized-structure-files';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const state = {
  records: [],
  editingRecordId: null,
  pendingPdfFiles: [],
  removedExistingPdfPaths: []
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  ensureDeleteSuccessModal();
  cacheElements();
  bindEvents();
  updateFormMode();
  loadOrganizations();
});

function cacheElements() {
  elements.form = document.getElementById('recognizedForm');
  elements.grid = document.getElementById('recognizedGrid');
  elements.status = document.getElementById('statusMessage');
  elements.logoInput = document.getElementById('orgLogo');
  elements.chartInput = document.getElementById('orgChart');
  elements.pdfInput = document.getElementById('orgPdf');
  elements.logoDrop = document.getElementById('logoDragDrop');
  elements.chartDrop = document.getElementById('chartDragDrop');
  elements.pdfDrop = document.getElementById('pdfDragDrop');
  elements.logoLabel = document.getElementById('logoFileLabel');
  elements.chartLabel = document.getElementById('chartFileLabel');
  elements.pdfLabel = document.getElementById('pdfFileLabel');
  elements.saveButton = document.getElementById('saveButton');
  elements.cancelEditButton = document.getElementById('cancelEditButton');
  elements.formTitle = document.getElementById('formTitle');
  elements.formDescription = document.getElementById('formDescription');
  elements.currentPdfWrap = document.getElementById('currentPdfWrap');
  elements.currentPdfList = document.getElementById('currentPdfList');
  elements.selectedPdfWrap = document.getElementById('selectedPdfWrap');
  elements.selectedPdfList = document.getElementById('selectedPdfList');
}

function bindEvents() {
  elements.form?.addEventListener('submit', handleSubmit);
  elements.cancelEditButton?.addEventListener('click', () => resetFormState());
  setupDropZone(elements.logoDrop, elements.logoInput, updateFileLabels, ['image/']);
  setupDropZone(elements.chartDrop, elements.chartInput, updateFileLabels, ['image/']);
  setupDropZone(elements.pdfDrop, elements.pdfInput, updateFileLabels, ['application/pdf'], true);
  elements.logoInput?.addEventListener('change', updateFileLabels);
  elements.chartInput?.addEventListener('change', updateFileLabels);
  elements.pdfInput?.addEventListener('change', handlePdfSelectionChange);
  elements.selectedPdfList?.addEventListener('click', handleSelectedPdfListClick);
  elements.currentPdfList?.addEventListener('click', handleCurrentPdfListClick);
}

function setupDropZone(dropZone, input, onChange, allowedPrefixes, allowMultiple = false) {
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
    const droppedFiles = Array.from(event.dataTransfer?.files || []);
    if (droppedFiles.length === 0) return;

    const files = allowMultiple ? droppedFiles : droppedFiles.slice(0, 1);
    const invalidFile = files.find((file) => !matchesAllowedFileType(file, allowedPrefixes));
    if (invalidFile) {
      window.alert('Invalid file type selected.');
      return;
    }

    if (allowMultiple) {
      setInputFiles(input, mergeUniqueFiles(Array.from(input.files || []), files));
    } else {
      setInputFiles(input, files);
    }

    onChange();
  });
}

function matchesAllowedFileType(file, allowedPrefixes) {
  return allowedPrefixes.some((prefix) => {
    if (prefix === 'application/pdf') {
      return file.type === prefix || file.name.toLowerCase().endsWith('.pdf');
    }

    return file.type.startsWith(prefix);
  });
}

function updateFileLabels() {
  elements.logoLabel.textContent = elements.logoInput?.files?.[0]?.name || 'Drag and drop or click to browse';
  elements.chartLabel.textContent = elements.chartInput?.files?.[0]?.name || 'Drag and drop or click to browse';
  elements.pdfLabel.textContent = formatPdfSelectionLabel(state.pendingPdfFiles);
  renderSelectedPdfFiles();
}

function formatPdfSelectionLabel(fileList) {
  const files = Array.from(fileList || []);
  if (files.length === 0) {
    return 'Drag and drop one or more PDFs, or click to browse';
  }

  if (files.length === 1) {
    return files[0].name;
  }

  return `${files.length} PDF files selected`;
}

async function handleSubmit(event) {
  event.preventDefault();

  if (!window.supabaseClient) {
    showStatus('Supabase is not available right now.', true);
    return;
  }

  const editingRecord = getEditingRecord();
  const isEditing = Boolean(editingRecord);
  const orgName = document.getElementById('org_name').value.trim();
  const dateEstablished = normalizeEstablishedYear(document.getElementById('date_established').value);
  const adviserName = document.getElementById('adviser_name').value.trim() || null;
  const logoFile = elements.logoInput?.files?.[0] || null;
  const chartFile = elements.chartInput?.files?.[0] || null;
  const pdfFiles = [...state.pendingPdfFiles];

  if (!orgName || (!isEditing && (!logoFile || !chartFile))) {
    showStatus('Organization name, logo, and organization chart are required.', true);
    return;
  }

  if (logoFile && !isValidImage(logoFile)) {
    showStatus('Please upload a valid logo image under 10 MB.', true);
    return;
  }

  if (chartFile && !isValidImage(chartFile)) {
    showStatus('Please upload a valid organization chart image under 10 MB.', true);
    return;
  }

  if (pdfFiles.some((file) => !isValidPdf(file))) {
    showStatus('Please upload only PDF files under 10 MB each.', true);
    return;
  }

  setSavingState(true);
  showStatus(isEditing ? 'Updating organization...' : 'Uploading files and saving organization...');

  const uploadedPaths = [];
  const uploadedPdfPaths = [];
  const oldPathsToDelete = [];

  try {
    let logoData = getExistingImageData(editingRecord, 'logo');
    let chartData = getExistingImageData(editingRecord, 'chart');
    let pdfData = getExistingPdfData(editingRecord);

    if (logoFile) {
      const logoUpload = await uploadFile(logoFile, 'logos');
      uploadedPaths.push(logoUpload.path);
      if (logoData.path) {
        oldPathsToDelete.push(logoData.path);
      }
      logoData = {
        url: logoUpload.publicUrl,
        path: logoUpload.path,
        mime: getUploadContentType(logoFile)
      };
    }

    if (chartFile) {
      const chartUpload = await uploadFile(chartFile, 'charts');
      uploadedPaths.push(chartUpload.path);
      if (chartData.path) {
        oldPathsToDelete.push(chartData.path);
      }
      chartData = {
        url: chartUpload.publicUrl,
        path: chartUpload.path,
        mime: getUploadContentType(chartFile)
      };
    }

    if (pdfFiles.length > 0) {
      const uploads = [];
      for (const file of pdfFiles) {
        const pdfUpload = await uploadFile(file, 'pdfs');
        uploadedPaths.push(pdfUpload.path);
        uploadedPdfPaths.push(pdfUpload.path);
        uploads.push({
          url: pdfUpload.publicUrl,
          path: pdfUpload.path,
          mime: getUploadContentType(file) || 'application/pdf',
          name: file.name || extractFileName(pdfUpload.path)
        });
      }

      pdfData = mergePdfData(pdfData, normalizePdfEntries(uploads));
    }

    if (state.removedExistingPdfPaths.length > 0) {
      pdfData = removePdfPathsFromData(pdfData, state.removedExistingPdfPaths);
    }

    const payload = {
      org_name: orgName,
      date_established: dateEstablished,
      adviser_name: adviserName,
      logo_url: logoData.url,
      logo_path: logoData.path,
      logo_mime: logoData.mime,
      chart_url: chartData.url,
      chart_path: chartData.path,
      chart_mime: chartData.mime,
      image_url: chartData.url,
      image_path: chartData.path,
      image_mime: chartData.mime,
      pdf_url: pdfData.urls[0] || null,
      pdf_path: pdfData.paths[0] || null,
      pdf_mime: pdfData.mimes[0] || null,
      pdf_urls: pdfData.urls,
      pdf_paths: pdfData.paths,
      pdf_mimes: pdfData.mimes,
      pdf_names: pdfData.names
    };

    const legacyPayload = {
      org_name: orgName,
      date_established: dateEstablished,
      adviser_name: adviserName,
      logo_url: logoData.url,
      logo_path: logoData.path,
      logo_mime: logoData.mime,
      chart_url: chartData.url,
      chart_path: chartData.path,
      chart_mime: chartData.mime,
      image_url: chartData.url,
      image_path: chartData.path,
      image_mime: chartData.mime,
      pdf_url: pdfData.urls[0] || null,
      pdf_path: pdfData.paths[0] || null,
      pdf_mime: pdfData.mimes[0] || null
    };

    let saveResult = null;

    try {
      saveResult = isEditing
        ? await window.supabaseClient.from(RECOGNIZED_TABLE).update(payload).eq('id', editingRecord.id)
        : await window.supabaseClient.from(RECOGNIZED_TABLE).insert(payload);
    } catch (error) {
      saveResult = { error };
    }

    if (saveResult?.error && isMissingMultiPdfSchemaError(saveResult.error)) {
      saveResult = isEditing
        ? await window.supabaseClient.from(RECOGNIZED_TABLE).update(legacyPayload).eq('id', editingRecord.id)
        : await window.supabaseClient.from(RECOGNIZED_TABLE).insert(legacyPayload);

      const extraPdfPaths = uploadsToCleanupForLegacyFallback(
        pdfData.paths[0] || null,
        getExistingPdfData(editingRecord).paths,
        uploadedPdfPaths
      );
      await cleanupUploadedFiles(extraPdfPaths);

      const fallbackMessage = pdfFiles.length > 1
        ? 'Saved using the current database schema. Only the first PDF was stored because the multi-PDF migration is not applied yet.'
        : 'Saved using the current database schema. Apply the latest migration to enable multi-PDF storage.';

      if (saveResult.error) {
        throw saveResult.error;
      }

      if (isEditing) {
        await cleanupUploadedFiles(uniqueNonEmpty([
          ...oldPathsToDelete,
          ...state.removedExistingPdfPaths
        ]));
        showStatus(fallbackMessage);
      } else {
        showStatus(fallbackMessage);
      }

      resetFormState({ preserveStatus: true });
      await loadOrganizations();
      return;
    }

    if (saveResult?.error) {
      throw saveResult.error;
    }

    if (isEditing) {
      await cleanupUploadedFiles(uniqueNonEmpty([
        ...oldPathsToDelete,
        ...state.removedExistingPdfPaths
      ]));
      showStatus('Recognized organization updated successfully.');
    } else {
      showStatus('Recognized organization saved successfully.');
    }

    resetFormState({ preserveStatus: true });
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
    const logoUrl = resolveImageUrl(record.logo_url, record.logo_path, record.chart_url, record.chart_path, record.image_url, record.image_path);
    const chartUrl = resolveImageUrl(record.chart_url, record.chart_path, record.image_url, record.image_path, record.logo_url, record.logo_path);
    const established = formatEstablishedYear(record.date_established);
    const adviser = escapeHtml(record.adviser_name || 'N/A');
    const updated = record.updated_at ? formatDateTime(record.updated_at) : 'N/A';
    const pdfEntries = getPdfEntries(record);
    const pdfLink = pdfEntries.length > 0
      ? `<div class="pdf-link">${pdfEntries.map((pdf, index) => `
          <a href="${escapeHtml(pdf.url)}" target="_blank" rel="noopener noreferrer" class="btn-pdf">
            <i class="fas fa-file-pdf"></i> View PDF ${pdfEntries.length > 1 ? index + 1 : ''}
          </a>
        `).join('')}</div>`
      : '<div class="pdf-link"><span class="date">No PDF uploaded</span></div>';

    return `
      <article class="uploaded-item">
        <div class="item-media">
          <div class="item-logo-wrap">
            <img src="${escapeHtml(logoUrl)}" alt="${escapeHtml(record.org_name)} logo" class="item-logo">
          </div>
          <img src="${escapeHtml(chartUrl)}" alt="${escapeHtml(record.org_name)} organization chart" class="item-image">
        </div>
        <div class="meta">${escapeHtml(record.org_name)}</div>
        <div class="established">Established: ${escapeHtml(established)}</div>
        <div class="adviser">Adviser: ${adviser}</div>
        <div class="date">Updated: ${escapeHtml(updated)}</div>
        ${pdfLink}
        <div class="replace-form">
          <button type="button" class="btn-edit" data-action="edit" data-id="${record.id}">Edit</button>
          <button type="button" class="btn-delete" data-action="delete" data-id="${record.id}">Delete</button>
        </div>
      </article>
    `;
  }).join('');

  elements.grid.querySelectorAll('[data-action="edit"]').forEach((button) => {
    button.addEventListener('click', () => startEditOrganization(Number(button.dataset.id)));
  });

  elements.grid.querySelectorAll('[data-action="delete"]').forEach((button) => {
    button.addEventListener('click', () => deleteOrganization(Number(button.dataset.id)));
  });
}

function startEditOrganization(id) {
  const record = state.records.find((item) => Number(item.id) === Number(id));
  if (!record) return;

  state.editingRecordId = Number(record.id);
  state.removedExistingPdfPaths = [];
  state.pendingPdfFiles = [];
  elements.form?.reset();
  document.getElementById('org_name').value = record.org_name || '';
  document.getElementById('date_established').value = record.date_established ?? '';
  document.getElementById('adviser_name').value = record.adviser_name || '';
  updateFileLabels();
  updateCurrentPdfList(record);
  updateFormMode();
  showStatus(`Editing "${record.org_name}". Upload new files only if you want to replace the current ones.`);
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function resetFormState(options = {}) {
  state.editingRecordId = null;
  state.pendingPdfFiles = [];
  state.removedExistingPdfPaths = [];
  elements.form?.reset();
  updateFileLabels();
  updateCurrentPdfList(null);
  updateFormMode();

  if (!options.preserveStatus && elements.status) {
    elements.status.hidden = true;
    elements.status.textContent = '';
    elements.status.className = 'notice';
  }
}

function updateFormMode() {
  const isEditing = state.editingRecordId !== null;

  if (elements.formTitle) {
    elements.formTitle.textContent = isEditing ? 'Edit Organization Details' : 'Organization Details';
  }

  if (elements.formDescription) {
    elements.formDescription.textContent = isEditing
      ? 'Update the details below. Leave upload fields empty to keep the current files.'
      : 'Add a recognized organization with its logo, chart, and optional PDF files.';
  }

  if (elements.saveButton) {
    elements.saveButton.textContent = isEditing ? 'Update Organization' : 'Save Organization';
  }

  if (elements.cancelEditButton) {
    elements.cancelEditButton.hidden = !isEditing;
  }

  if (elements.logoInput) {
    elements.logoInput.required = !isEditing;
  }

  if (elements.chartInput) {
    elements.chartInput.required = !isEditing;
  }
}

function updateCurrentPdfList(record) {
  if (!elements.currentPdfWrap || !elements.currentPdfList) {
    return;
  }

  const isEditing = state.editingRecordId !== null;
  const pdfEntries = record ? getPdfEntries(record) : [];
  const visiblePdfEntries = pdfEntries.filter((pdf) => !state.removedExistingPdfPaths.includes(pdf.path));

  elements.currentPdfWrap.hidden = !isEditing;

  if (!isEditing) {
    elements.currentPdfList.innerHTML = '';
    return;
  }

  if (visiblePdfEntries.length === 0) {
    elements.currentPdfList.innerHTML = '<li>No PDF uploaded yet.</li>';
    return;
  }

  elements.currentPdfList.innerHTML = visiblePdfEntries.map((pdf, index) => `
    <li class="selected-pdf-item">
      <a class="selected-pdf-name" href="${escapeHtml(pdf.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(pdf.name || `PDF ${index + 1}`)}</a>
      <button type="button" class="selected-pdf-remove" data-remove-existing-pdf-path="${escapeHtml(pdf.path)}">Remove</button>
    </li>
  `).join('');
}

function handlePdfSelectionChange() {
  const latestFiles = Array.from(elements.pdfInput?.files || []);
  state.pendingPdfFiles = mergeUniqueFiles(state.pendingPdfFiles, latestFiles);
  setInputFiles(elements.pdfInput, state.pendingPdfFiles);
  updateFileLabels();
}

function handleSelectedPdfListClick(event) {
  const button = event.target instanceof HTMLElement ? event.target.closest('[data-remove-pdf-index]') : null;
  if (!button) {
    return;
  }

  const index = Number(button.getAttribute('data-remove-pdf-index'));
  if (!Number.isInteger(index) || index < 0) {
    return;
  }

  state.pendingPdfFiles = state.pendingPdfFiles.filter((_, fileIndex) => fileIndex !== index);
  setInputFiles(elements.pdfInput, state.pendingPdfFiles);
  updateFileLabels();
}

function handleCurrentPdfListClick(event) {
  const button = event.target instanceof HTMLElement ? event.target.closest('[data-remove-existing-pdf-path]') : null;
  if (!button) {
    return;
  }

  const path = button.getAttribute('data-remove-existing-pdf-path') || '';
  if (!path) {
    return;
  }

  if (!state.removedExistingPdfPaths.includes(path)) {
    state.removedExistingPdfPaths = [...state.removedExistingPdfPaths, path];
  }

  updateCurrentPdfList(getEditingRecord());
}

function renderSelectedPdfFiles() {
  if (!elements.selectedPdfWrap || !elements.selectedPdfList) {
    return;
  }

  elements.selectedPdfWrap.hidden = state.pendingPdfFiles.length === 0;

  if (state.pendingPdfFiles.length === 0) {
    elements.selectedPdfList.innerHTML = '';
    return;
  }

  elements.selectedPdfList.innerHTML = state.pendingPdfFiles.map((file, index) => `
    <li class="selected-pdf-item">
      <span class="selected-pdf-name">${escapeHtml(file.name)} (${formatFileSize(file.size)})</span>
      <button type="button" class="selected-pdf-remove" data-remove-pdf-index="${index}">Remove</button>
    </li>
  `).join('');
}

function getEditingRecord() {
  if (state.editingRecordId === null) {
    return null;
  }

  return state.records.find((item) => Number(item.id) === Number(state.editingRecordId)) || null;
}

async function deleteOrganization(id) {
  const record = state.records.find((item) => Number(item.id) === Number(id));
  if (!record) return;

  const confirmed = window.confirm(`Delete "${record.org_name}"? This action cannot be undone.`);
  if (!confirmed) return;

  showStatus('Deleting organization...');

  try {
    const pathsToDelete = uniqueNonEmpty([
      record.logo_path,
      record.chart_path,
      record.image_path,
      ...getPdfEntries(record).map((pdf) => pdf.path)
    ]);

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

    if (Number(state.editingRecordId) === Number(id)) {
      resetFormState({ preserveStatus: true });
    }

    showStatus('Organization deleted successfully.');
    await loadOrganizations();
    openDeleteSuccessModal('Organization deleted successfully.');
  } catch (error) {
    console.error('Failed to delete organization:', error);
    showStatus(error.message || 'Failed to delete organization.', true);
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
      '<p id="deleteSuccessMessage">Organization deleted successfully.</p>',
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

async function uploadFile(file, folder) {
  const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueId = window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  const path = `${folder}/${uniqueId}-${safeName}`;
  const contentType = getUploadContentType(file);

  const { error } = await window.supabaseClient.storage
    .from(RECOGNIZED_BUCKET)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: contentType || undefined
    });

  if (error) {
    throw error;
  }

  const { data } = window.supabaseClient.storage
    .from(RECOGNIZED_BUCKET)
    .getPublicUrl(path);

  return {
    path,
    publicUrl: data?.publicUrl || buildStoragePublicUrl(path) || ''
  };
}

async function cleanupUploadedFiles(paths) {
  const cleanPaths = uniqueNonEmpty(paths);
  if (cleanPaths.length === 0 || !window.supabaseClient?.storage) return;

  try {
    await window.supabaseClient.storage.from(RECOGNIZED_BUCKET).remove(cleanPaths);
  } catch (error) {
    console.warn('Cleanup failed:', error);
  }
}

function getExistingImageData(record, type) {
  if (!record) {
    return { url: null, path: null, mime: null };
  }

  if (type === 'logo') {
    return {
      url: record.logo_url || null,
      path: record.logo_path || null,
      mime: record.logo_mime || null
    };
  }

  return {
    url: record.chart_url || record.image_url || null,
    path: record.chart_path || record.image_path || null,
    mime: record.chart_mime || record.image_mime || null
  };
}

function getExistingPdfData(record) {
  const pdfEntries = getPdfEntries(record).filter((entry) => !state.removedExistingPdfPaths.includes(entry.path));
  return {
    urls: pdfEntries.map((entry) => entry.url),
    paths: pdfEntries.map((entry) => entry.path),
    mimes: pdfEntries.map((entry) => entry.mime),
    names: pdfEntries.map((entry) => entry.name)
  };
}

function getPdfEntries(record) {
  if (!record) {
    return [];
  }

  const urls = Array.isArray(record.pdf_urls) ? record.pdf_urls : [];
  const paths = Array.isArray(record.pdf_paths) ? record.pdf_paths : [];
  const mimes = Array.isArray(record.pdf_mimes) ? record.pdf_mimes : [];
  const names = Array.isArray(record.pdf_names) ? record.pdf_names : [];
  const normalized = [];
  const maxLength = Math.max(urls.length, paths.length, mimes.length, names.length);

  for (let index = 0; index < maxLength; index += 1) {
    const path = paths[index] || '';
    const url = urls[index] || buildStoragePublicUrl(path) || '';
    if (!url && !path) {
      continue;
    }

    normalized.push({
      url,
      path,
      mime: mimes[index] || 'application/pdf',
      name: names[index] || extractFileName(path) || `PDF ${index + 1}`
    });
  }

  if (normalized.length > 0) {
    return normalized;
  }

  if (record.pdf_url || record.pdf_path) {
    return [{
      url: record.pdf_url || buildStoragePublicUrl(record.pdf_path) || '',
      path: record.pdf_path || '',
      mime: record.pdf_mime || 'application/pdf',
      name: extractFileName(record.pdf_path) || 'PDF 1'
    }];
  }

  return [];
}

function normalizePdfEntries(entries) {
  const normalizedEntries = entries.filter((entry) => entry?.url || entry?.path);
  return {
    urls: normalizedEntries.map((entry) => entry.url || buildStoragePublicUrl(entry.path) || ''),
    paths: normalizedEntries.map((entry) => entry.path || ''),
    mimes: normalizedEntries.map((entry) => entry.mime || 'application/pdf'),
    names: normalizedEntries.map((entry) => entry.name || extractFileName(entry.path) || 'PDF')
  };
}

function mergePdfData(existingData, additionalData) {
  return {
    urls: [...existingData.urls, ...additionalData.urls],
    paths: [...existingData.paths, ...additionalData.paths],
    mimes: [...existingData.mimes, ...additionalData.mimes],
    names: [...existingData.names, ...additionalData.names]
  };
}

function removePdfPathsFromData(pdfData, pathsToRemove) {
  const filteredEntries = pdfData.paths.map((path, index) => ({
    path,
    url: pdfData.urls[index] || '',
    mime: pdfData.mimes[index] || 'application/pdf',
    name: pdfData.names[index] || extractFileName(path) || 'PDF'
  })).filter((entry) => !pathsToRemove.includes(entry.path));

  return normalizePdfEntries(filteredEntries);
}

function uploadsToCleanupForLegacyFallback(retainedPath, existingPaths, uploadedPdfPaths) {
  const existingSet = new Set(existingPaths);
  return uploadedPdfPaths.filter((path) => path && path !== retainedPath && !existingSet.has(path));
}

function isMissingMultiPdfSchemaError(error) {
  return Boolean(
    error?.code === 'PGRST204'
    && /pdf_urls|pdf_paths|pdf_mimes|pdf_names/i.test(String(error?.message || ''))
  );
}

function mergeUniqueFiles(existingFiles, incomingFiles) {
  const merged = [...existingFiles];
  const seen = new Set(existingFiles.map(getFileIdentity));

  incomingFiles.forEach((file) => {
    const identity = getFileIdentity(file);
    if (seen.has(identity)) {
      return;
    }

    seen.add(identity);
    merged.push(file);
  });

  return merged;
}

function getFileIdentity(file) {
  return [file?.name || '', file?.size || 0, file?.lastModified || 0].join('::');
}

function setInputFiles(input, files) {
  if (!input) {
    return;
  }

  const transfer = new DataTransfer();
  files.forEach((file) => transfer.items.add(file));
  input.files = transfer.files;
}

function uniqueNonEmpty(values) {
  return values.filter(Boolean).filter((value, index, array) => array.indexOf(value) === index);
}

function extractFileName(path) {
  if (!path || typeof path !== 'string') {
    return '';
  }

  const rawName = path.split('/').pop() || '';
  return rawName.replace(/^[a-f0-9-]+-/i, '');
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
  elements.saveButton.textContent = isSaving
    ? (state.editingRecordId !== null ? 'Updating...' : 'Saving...')
    : (state.editingRecordId !== null ? 'Update Organization' : 'Save Organization');

  if (elements.cancelEditButton) {
    elements.cancelEditButton.disabled = isSaving;
  }
}

function isValidImage(file) {
  return Boolean(file && file.type.startsWith('image/') && file.size <= MAX_FILE_SIZE);
}

function isValidPdf(file) {
  return Boolean(file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) && file.size <= MAX_FILE_SIZE);
}

function getUploadContentType(file) {
  if (!file) {
    return '';
  }

  const providedType = typeof file.type === 'string' ? file.type.trim().toLowerCase() : '';
  if (providedType === 'application/pdf') {
    return 'application/pdf';
  }
  if (providedType === 'image/jpeg' || providedType === 'image/png' || providedType === 'image/webp' || providedType === 'image/gif') {
    return providedType;
  }
  if (providedType === 'image/jpg') {
    return 'image/jpeg';
  }

  const fileName = String(file.name || '').toLowerCase();
  if (fileName.endsWith('.pdf')) {
    return 'application/pdf';
  }
  if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) {
    return 'image/jpeg';
  }
  if (fileName.endsWith('.png')) {
    return 'image/png';
  }
  if (fileName.endsWith('.webp')) {
    return 'image/webp';
  }
  if (fileName.endsWith('.gif')) {
    return 'image/gif';
  }

  return providedType;
}

function formatFileSize(size) {
  if (!Number.isFinite(size) || size <= 0) {
    return '0 B';
  }

  if (size < 1024) {
    return `${size} B`;
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function normalizeEstablishedYear(value) {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return null;
  }

  if (/^\d{4}$/.test(trimmedValue)) {
    return Number(trimmedValue);
  }

  return null;
}

function resolveImageUrl(...values) {
  for (const value of values) {
    if (typeof value !== 'string') {
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      continue;
    }

    if (/^(https?:|data:|blob:)/i.test(trimmed)) {
      return trimmed;
    }

    const publicUrl = buildStoragePublicUrl(trimmed);
    if (publicUrl) {
      return publicUrl;
    }
  }

  return 'data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 300 220%22%3E%3Crect width=%22300%22 height=%22220%22 rx=%2224%22 fill=%22%23f8fafc%22/%3E%3Cpath d=%22M95 150l32-39 25 31 37-48 51 56H60l35-44z%22 fill=%22%23cbd5e1%22/%3E%3Ccircle cx=%22110%22 cy=%2276%22 r=%2218%22 fill=%22%23cbd5e1%22/%3E%3Ctext x=%2250%25%22 y=%22192%22 text-anchor=%22middle%22 font-family=%22Arial, sans-serif%22 font-size=%2218%22 fill=%22%2364758b%22%3ENo image uploaded%3C/text%3E%3C/svg%3E';
}

function buildStoragePublicUrl(path) {
  if (!path || !window.supabaseClient?.storage) {
    return '';
  }

  try {
    const { data } = window.supabaseClient.storage
      .from(RECOGNIZED_BUCKET)
      .getPublicUrl(path);

    return data?.publicUrl || '';
  } catch (error) {
    console.warn('Failed to build storage public URL:', error);
    return '';
  }
}

function formatEstablishedYear(value) {
  if (value === null || value === undefined || value === '') {
    return 'N/A';
  }

  const normalized = String(value).slice(0, 4);
  return /^\d{4}$/.test(normalized) ? normalized : String(value);
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
