const LEARNING_MATERIALS_TABLE = 'learning_materials';
const LEARNING_MATERIALS_BUCKET = 'learning-materials-files';
const MAX_FILE_SIZE = 10 * 1024 * 1024;

const learningMaterialsState = {
  records: [],
  filteredRecords: [],
  editingRecord: null,
  deletingRecord: null,
  lastFocusedTrigger: null
};

const elements = {};

document.addEventListener('DOMContentLoaded', () => {
  ensureDeleteSuccessModal();
  cacheElements();
  initializeModals();
  bindEvents();
  loadLearningMaterials();
});

function cacheElements() {
  elements.status = document.getElementById('statusMessage');
  elements.uploadForm = document.getElementById('uploadForm');
  elements.subjectName = document.getElementById('subjectName');
  elements.gradeLevel = document.getElementById('gradeLevel');
  elements.materialFile = document.getElementById('materialFile');
  elements.uploadButton = document.getElementById('uploadButton');
  elements.filterGrade = document.getElementById('filterGrade');
  elements.applyFilter = document.getElementById('applyFilter');
  elements.clearFilter = document.getElementById('clearFilter');
  elements.tableBody = document.getElementById('materialsTableBody');
  elements.editModal = document.getElementById('editModal');
  elements.editForm = document.getElementById('editForm');
  elements.editGradeLevel = document.getElementById('editGradeLevel');
  elements.editSubjectName = document.getElementById('editSubjectName');
  elements.editMaterialFile = document.getElementById('editMaterialFile');
  elements.editSubmit = document.getElementById('editSubmit');
  elements.deleteModal = document.getElementById('deleteModal');
  elements.deleteFileName = document.getElementById('deleteFileName');
  elements.deleteConfirm = document.getElementById('deleteConfirm');
  elements.deleteSuccessModal = document.getElementById('deleteSuccessModal');
  elements.deleteSuccessMessage = document.getElementById('deleteSuccessMessage');
}

function initializeModals() {
  [elements.editModal, elements.deleteModal, elements.deleteSuccessModal].forEach((modal) => {
    if (!modal) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.inert = true;
  });
}

function bindEvents() {
  elements.uploadForm?.addEventListener('submit', handleUpload);
  elements.applyFilter?.addEventListener('click', applyFilter);
  elements.clearFilter?.addEventListener('click', clearFilter);
  elements.editSubmit?.addEventListener('click', handleEditSave);
  elements.deleteConfirm?.addEventListener('click', handleDeleteConfirm);

  document.querySelectorAll('.modal-close').forEach((button) => {
    button.addEventListener('click', () => hideModal(button.dataset.target));
  });

  elements.tableBody?.addEventListener('click', (event) => {
    const editButton = event.target.closest('[data-action="edit"]');
    const deleteButton = event.target.closest('[data-action="delete"]');

    if (editButton) {
      const recordId = Number(editButton.dataset.id);
      const record = learningMaterialsState.records.find((item) => Number(item.id) === recordId);
      if (record) openEditModal(record);
      return;
    }

    if (deleteButton) {
      const recordId = Number(deleteButton.dataset.id);
      const record = learningMaterialsState.records.find((item) => Number(item.id) === recordId);
      if (record) openDeleteModal(record);
    }
  });
}

async function handleUpload(event) {
  event.preventDefault();

  if (!window.supabaseClient) {
    showStatus('Supabase is not available right now.', true);
    return;
  }

  const gradeLevel = elements.gradeLevel.value;
  const subjectName = elements.subjectName.value;
  const file = elements.materialFile.files[0];

  if (!gradeLevel || !subjectName || !file) {
    showStatus('Please complete the subject, grade, and PDF file.', true);
    return;
  }

  const validationError = validatePdf(file);
  if (validationError) {
    showStatus(validationError, true);
    return;
  }

  setUploadBusy(true);
  showStatus('Uploading learning material...');

  let uploadedPath = '';

  try {
    const uploadResult = await uploadFile(file, gradeLevel, subjectName);
    uploadedPath = uploadResult.path;

    const payload = {
      grade_level: gradeLevel,
      subject_name: subjectName,
      file_name: file.name,
      file_url: uploadResult.publicUrl,
      storage_path: uploadResult.path
    };

    const { error } = await window.supabaseClient
      .from(LEARNING_MATERIALS_TABLE)
      .insert(payload);

    if (error) throw error;

    elements.uploadForm.reset();
    await loadLearningMaterials();
    showStatus('Learning material uploaded successfully.');
  } catch (error) {
    console.error('Failed to upload learning material:', error);
    if (uploadedPath) {
      await removeStorageFiles([uploadedPath]);
    }
    showStatus(error.message || 'Failed to upload learning material.', true);
  } finally {
    setUploadBusy(false);
  }
}

async function loadLearningMaterials() {
  if (!elements.tableBody) return;

  if (!window.supabaseClient) {
    renderMessageRow('Supabase is not available right now.');
    return;
  }

  renderMessageRow('Loading learning materials...');

  try {
    const { data, error } = await window.supabaseClient
      .from(LEARNING_MATERIALS_TABLE)
      .select('id, grade_level, subject_name, file_name, file_url, storage_path, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    learningMaterialsState.records = (data || []).map(normalizeRecord);
    applyFilter();
  } catch (error) {
    console.error('Failed to load learning materials:', error);
    renderMessageRow('Failed to load learning materials.');
    showStatus(error.message || 'Failed to load learning materials.', true);
  }
}

function applyFilter() {
  const selectedGrade = elements.filterGrade?.value || '';

  learningMaterialsState.filteredRecords = learningMaterialsState.records.filter((record) => {
    if (!selectedGrade) return true;
    return record.grade_level === selectedGrade;
  });

  renderTable();
}

function clearFilter() {
  if (elements.filterGrade) {
    elements.filterGrade.value = '';
  }
  applyFilter();
}

function renderTable() {
  if (!elements.tableBody) return;

  if (!learningMaterialsState.filteredRecords.length) {
    renderMessageRow('No learning materials found.');
    return;
  }

  elements.tableBody.innerHTML = learningMaterialsState.filteredRecords.map((record) => `
    <tr>
      <td>${escapeHtml(record.grade_level)}</td>
      <td>${escapeHtml(record.subject_name)}</td>
      <td><a href="${escapeAttribute(record.file_url)}" target="_blank" rel="noopener">${escapeHtml(record.file_name)}</a></td>
      <td>${escapeHtml(formatDateTime(record.created_at))}</td>
      <td>
        <div class="uploads-actions">
          <button class="action-btn edit" type="button" data-action="edit" data-id="${record.id}">Edit</button>
          <button class="action-btn delete" type="button" data-action="delete" data-id="${record.id}">Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function openEditModal(record) {
  learningMaterialsState.editingRecord = record;
  elements.editGradeLevel.value = record.grade_level;
  elements.editSubjectName.value = record.subject_name;
  elements.editMaterialFile.value = '';
  showModal('editModal');
}

function openDeleteModal(record) {
  learningMaterialsState.deletingRecord = record;
  elements.deleteFileName.textContent = record.file_name;
  showModal('deleteModal');
}

async function handleEditSave() {
  const record = learningMaterialsState.editingRecord;
  if (!record || !window.supabaseClient) return;

  const newGrade = elements.editGradeLevel.value;
  const newSubject = elements.editSubjectName.value;
  const newFile = elements.editMaterialFile.files[0] || null;

  if (!newGrade || !newSubject) {
    showStatus('Please choose a grade and subject.', true);
    return;
  }

  const validationError = newFile ? validatePdf(newFile) : '';
  if (validationError) {
    showStatus(validationError, true);
    return;
  }

  showStatus('Updating learning material...');
  setEditBusy(true);

  let uploadedPath = '';
  let nextFileName = record.file_name;
  let nextFileUrl = record.file_url;
  let nextStoragePath = record.storage_path;

  try {
    if (newFile) {
      const uploadResult = await uploadFile(newFile, newGrade, newSubject);
      uploadedPath = uploadResult.path;
      nextFileName = newFile.name;
      nextFileUrl = uploadResult.publicUrl;
      nextStoragePath = uploadResult.path;
    }

    const { error } = await window.supabaseClient
      .from(LEARNING_MATERIALS_TABLE)
      .update({
        grade_level: newGrade,
        subject_name: newSubject,
        file_name: nextFileName,
        file_url: nextFileUrl,
        storage_path: nextStoragePath,
        updated_at: new Date().toISOString()
      })
      .eq('id', record.id);

    if (error) throw error;

    if (newFile && record.storage_path) {
      await removeStorageFiles([record.storage_path]);
    }

    hideModal('editModal');
    learningMaterialsState.editingRecord = null;
    await loadLearningMaterials();
    showStatus('Learning material updated successfully.');
  } catch (error) {
    console.error('Failed to update learning material:', error);
    if (uploadedPath) {
      await removeStorageFiles([uploadedPath]);
    }
    showStatus(error.message || 'Failed to update learning material.', true);
  } finally {
    setEditBusy(false);
  }
}

async function handleDeleteConfirm() {
  const record = learningMaterialsState.deletingRecord;
  if (!record || !window.supabaseClient) return;

  setDeleteBusy(true);
  showStatus('Deleting learning material...');

  try {
    const { error } = await window.supabaseClient
      .from(LEARNING_MATERIALS_TABLE)
      .delete()
      .eq('id', record.id);

    if (error) throw error;

    if (record.storage_path) {
      await removeStorageFiles([record.storage_path]);
    }

    hideModal('deleteModal');
    learningMaterialsState.deletingRecord = null;
    await loadLearningMaterials();
    showDeleteSuccessModal('Learning material deleted successfully.');
    showStatus('Learning material deleted successfully.');
  } catch (error) {
    console.error('Failed to delete learning material:', error);
    showStatus(error.message || 'Failed to delete learning material.', true);
  } finally {
    setDeleteBusy(false);
  }
}

async function uploadFile(file, gradeLevel, subjectName) {
  const safeGrade = slugify(gradeLevel);
  const safeSubject = slugify(subjectName);
  const safeFileName = slugify(file.name.replace(/\.pdf$/i, ''));
  const filePath = `${safeGrade}/${safeSubject}/${Date.now()}-${safeFileName}.pdf`;

  const { error } = await window.supabaseClient.storage
    .from(LEARNING_MATERIALS_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: 'application/pdf'
    });

  if (error) throw error;

  const { data } = window.supabaseClient.storage
    .from(LEARNING_MATERIALS_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data.publicUrl
  };
}

async function removeStorageFiles(paths) {
  const validPaths = paths.filter(Boolean);
  if (!validPaths.length || !window.supabaseClient?.storage) return;

  try {
    await window.supabaseClient.storage
      .from(LEARNING_MATERIALS_BUCKET)
      .remove(validPaths);
  } catch (error) {
    console.warn('Failed to remove storage file(s):', error);
  }
}

function normalizeRecord(record) {
  return {
    id: Number(record.id),
    grade_level: record.grade_level || '',
    subject_name: record.subject_name || '',
    file_name: record.file_name || extractFileName(record.file_url || record.storage_path),
    file_url: record.file_url || getPublicUrl(record.storage_path || ''),
    storage_path: record.storage_path || '',
    created_at: record.created_at || '',
    updated_at: record.updated_at || ''
  };
}

function validatePdf(file) {
  if (!file) return 'Please choose a PDF file.';
  if (file.size > MAX_FILE_SIZE) return 'PDF must be 10MB or smaller.';
  if (file.type && file.type !== 'application/pdf') return 'Only PDF files are allowed.';
  if (!/\.pdf$/i.test(file.name)) return 'Only PDF files are allowed.';
  return '';
}

function renderMessageRow(message) {
  if (!elements.tableBody) return;

  elements.tableBody.innerHTML = `
    <tr>
      <td colspan="5" class="table-message">${escapeHtml(message)}</td>
    </tr>
  `;
}

function showModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  learningMaterialsState.lastFocusedTrigger = document.activeElement instanceof HTMLElement
    ? document.activeElement
    : null;

  modal.inert = false;
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('show');

  const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (firstFocusable instanceof HTMLElement) {
    firstFocusable.focus();
  }
}

function hideModal(id) {
  const modal = document.getElementById(id);
  if (!modal) return;

  if (modal.contains(document.activeElement)) {
    if (learningMaterialsState.lastFocusedTrigger instanceof HTMLElement) {
      learningMaterialsState.lastFocusedTrigger.focus();
    } else if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }

  modal.classList.remove('show');
  modal.setAttribute('aria-hidden', 'true');
  modal.inert = true;
}

function ensureDeleteSuccessModal() {
  if (document.getElementById('deleteSuccessModal')) return;

  const modal = document.createElement('div');
  modal.id = 'deleteSuccessModal';
  modal.className = 'modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = [
    '<div class="modal-content modal-success">',
      '<div class="modal-header">',
        '<div class="modal-title">Deleted Successfully</div>',
        '<button class="modal-close" data-target="deleteSuccessModal" type="button">&times;</button>',
      '</div>',
      '<div class="modal-body">',
        '<div class="success-icon" aria-hidden="true">',
          '<i class="fas fa-circle-check"></i>',
        '</div>',
        '<p id="deleteSuccessMessage">Learning material deleted successfully.</p>',
      '</div>',
      '<div class="modal-footer">',
        '<button class="btn-confirm modal-close" data-target="deleteSuccessModal" type="button">OK</button>',
      '</div>',
    '</div>'
  ].join('');

  document.body.appendChild(modal);
}

function showDeleteSuccessModal(message) {
  if (elements.deleteSuccessMessage) {
    elements.deleteSuccessMessage.textContent = message;
  }

  showModal('deleteSuccessModal');
}

function showStatus(message, isError = false) {
  if (!elements.status) return;
  elements.status.textContent = message;
  elements.status.classList.toggle('error', Boolean(isError));
  elements.status.classList.toggle('show', Boolean(message));
}

function setUploadBusy(isBusy) {
  if (!elements.uploadButton) return;
  elements.uploadButton.disabled = isBusy;
  elements.uploadButton.textContent = isBusy ? 'Uploading...' : 'Upload';
}

function setEditBusy(isBusy) {
  if (!elements.editSubmit) return;
  elements.editSubmit.disabled = isBusy;
  elements.editSubmit.textContent = isBusy ? 'Saving...' : 'Save';
}

function setDeleteBusy(isBusy) {
  if (!elements.deleteConfirm) return;
  elements.deleteConfirm.disabled = isBusy;
  elements.deleteConfirm.textContent = isBusy ? 'Deleting...' : 'Delete';
}

function formatDateTime(value) {
  if (!value) return 'N/A';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'N/A';

  return date.toLocaleString('en-PH', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

function extractFileName(path) {
  if (!path) return 'View file';

  try {
    if (/^https?:\/\//i.test(path)) {
      const pathname = new URL(path).pathname;
      return decodeURIComponent(pathname.split('/').pop() || 'View file');
    }

    return decodeURIComponent(String(path).split('/').pop() || 'View file');
  } catch (error) {
    return 'View file';
  }
}

function getPublicUrl(path) {
  if (!path || !window.supabaseClient?.storage) return '#';

  const { data } = window.supabaseClient.storage
    .from(LEARNING_MATERIALS_BUCKET)
    .getPublicUrl(path);

  return data?.publicUrl || '#';
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
