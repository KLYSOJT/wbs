document.addEventListener('DOMContentLoaded', initProcurementReports);

const PROCUREMENT_REPORTS_BUCKET = 'procurement-reports-files';

const procurementReportsState = {
  records: [],
  filteredRecords: [],
  currentPage: 1,
  pageSize: 10
};

const procurementReportsElements = {};

async function initProcurementReports() {
  cacheElements();
  bindEvents();

  if (!window.supabaseClient) {
    showTableMessage('Supabase is not available right now.', true);
    return;
  }

  try {
    showTableMessage('Loading procurement reports...');
    await fetchProcurementReports();
    populateYearFilter();
    applyFilters();
  } catch (error) {
    console.error('Failed to initialize Procurement Reports page:', error);
    showTableMessage('Failed to load procurement reports.', true);
  }
}

function cacheElements() {
  procurementReportsElements.tableBody = document.getElementById('memoTableBody');
  procurementReportsElements.yearFilter = document.getElementById('yearFilter');
  procurementReportsElements.monthFilter = document.getElementById('monthFilter');
  procurementReportsElements.searchInput = document.getElementById('searchInput');
  procurementReportsElements.searchButton = document.querySelector('.search-btn');
  procurementReportsElements.pagination = document.getElementById('paginationControls');
}

function bindEvents() {
  procurementReportsElements.yearFilter?.addEventListener('change', applyFilters);
  procurementReportsElements.monthFilter?.addEventListener('change', applyFilters);
  procurementReportsElements.searchButton?.addEventListener('click', applyFilters);

  procurementReportsElements.searchInput?.addEventListener('input', debounce(applyFilters, 250));
  procurementReportsElements.searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyFilters();
    }
  });

  procurementReportsElements.tableBody?.addEventListener('click', async (event) => {
    const viewButton = event.target.closest('[data-action="view-pdf"]');
    if (!viewButton) return;

    await openPdf(viewButton.dataset.url || '');
  });
}

async function fetchProcurementReports() {
  const { data, error } = await window.supabaseClient
    .from('procurement_report')
    .select('id, title, date, description, file, created_at')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  procurementReportsState.records = (data || []).map(normalizeRecord);
  procurementReportsState.filteredRecords = [...procurementReportsState.records];
}

function normalizeRecord(record) {
  const normalizedDate = normalizeDate(record.date);
  const title = typeof record.title === 'string' ? record.title.trim() : '';
  const description = typeof record.description === 'string' ? record.description.trim() : '';
  const rawFile = typeof record.file === 'string' ? record.file.trim() : '';
  const resolvedFileUrl = resolveFileUrl(rawFile);

  return {
    id: record.id,
    title: title || 'Untitled',
    description,
    file: rawFile,
    fileUrl: resolvedFileUrl,
    date: normalizedDate,
    dateDisplay: normalizedDate ? formatDate(normalizedDate) : 'N/A',
    year: normalizedDate ? normalizedDate.slice(0, 4) : '',
    month: normalizedDate ? normalizedDate.slice(5, 7) : '',
    canViewPdf: Boolean(resolvedFileUrl),
    fileUnavailableReason: getFileUnavailableReason(rawFile, resolvedFileUrl)
  };
}

function resolveFileUrl(fileValue) {
  if (!fileValue) {
    return '';
  }

  if (/^https?:\/\//i.test(fileValue)) {
    return fileValue;
  }

  if (/^idb:\/\//i.test(fileValue)) {
    return '';
  }

  const cleanedPath = fileValue
    .replace(/^\/+/, '')
    .replace(new RegExp(`^${PROCUREMENT_REPORTS_BUCKET}/`, 'i'), '');

  if (!cleanedPath) {
    return '';
  }

  const { data } = window.supabaseClient.storage
    .from(PROCUREMENT_REPORTS_BUCKET)
    .getPublicUrl(cleanedPath);

  return data?.publicUrl || '';
}

function populateYearFilter() {
  if (!procurementReportsElements.yearFilter) return;

  const years = [...new Set(
    procurementReportsState.records
      .map((record) => record.year)
      .filter(Boolean)
  )].sort((a, b) => Number(b) - Number(a));

  procurementReportsElements.yearFilter.innerHTML = '<option value="">Year</option>';

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    procurementReportsElements.yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const year = procurementReportsElements.yearFilter?.value || '';
  const month = procurementReportsElements.monthFilter?.value || '';
  const searchTerm = (procurementReportsElements.searchInput?.value || '').trim().toLowerCase();

  procurementReportsState.filteredRecords = procurementReportsState.records.filter((record) => {
    const matchesYear = !year || record.year === year;
    const matchesMonth = !month || record.month === month;
    const matchesSearch = !searchTerm
      || record.title.toLowerCase().includes(searchTerm)
      || record.description.toLowerCase().includes(searchTerm)
      || record.dateDisplay.toLowerCase().includes(searchTerm);

    return matchesYear && matchesMonth && matchesSearch;
  });

  procurementReportsState.currentPage = 1;
  renderTable();
  renderPagination();
}

function renderTable() {
  const tableBody = procurementReportsElements.tableBody;
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (procurementReportsState.filteredRecords.length === 0) {
    showTableMessage('No procurement reports found for the current filters.');
    return;
  }

  const startIndex = (procurementReportsState.currentPage - 1) * procurementReportsState.pageSize;
  const visibleRecords = procurementReportsState.filteredRecords.slice(
    startIndex,
    startIndex + procurementReportsState.pageSize
  );

  visibleRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.appendChild(createCell(record.dateDisplay));
    row.appendChild(createCell(record.title));
    row.appendChild(createCell(record.description || 'No description provided.'));
    row.appendChild(createFileCell(record));
    procurementReportsElements.tableBody.appendChild(row);
  });
}

function createCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

function createFileCell(record) {
  const cell = document.createElement('td');

  if (!record.canViewPdf) {
    const status = document.createElement('span');
    status.className = 'file-status';
    status.textContent = record.fileUnavailableReason;
    cell.appendChild(status);
    return cell;
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'download-link file-view-btn';
  button.dataset.action = 'view-pdf';
  button.dataset.url = record.fileUrl;
  button.textContent = 'View PDF';
  cell.appendChild(button);

  return cell;
}

function renderPagination() {
  const pagination = procurementReportsElements.pagination;
  if (!pagination) return;

  pagination.innerHTML = '';

  const totalPages = Math.ceil(procurementReportsState.filteredRecords.length / procurementReportsState.pageSize);
  if (totalPages <= 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  if (procurementReportsState.currentPage > 1) {
    fragment.appendChild(createPaginationButton('Previous', procurementReportsState.currentPage - 1));
  }

  const startPage = Math.max(1, procurementReportsState.currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let page = startPage; page <= endPage; page += 1) {
    fragment.appendChild(createPaginationButton(String(page), page, page === procurementReportsState.currentPage));
  }

  if (procurementReportsState.currentPage < totalPages) {
    fragment.appendChild(createPaginationButton('Next', procurementReportsState.currentPage + 1));
  }

  pagination.appendChild(fragment);
}

function createPaginationButton(label, page, isActive = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `pagination-btn${isActive ? ' pagination-active' : ''}`;
  button.textContent = label;
  button.addEventListener('click', () => {
    procurementReportsState.currentPage = page;
    renderTable();
    renderPagination();
  });
  return button;
}

async function openPdf(url) {
  if (!url) {
    window.alert('This PDF file is not available yet.');
    return;
  }

  window.open(appendPdfViewerHints(url), '_blank', 'noopener,noreferrer');
}

function appendPdfViewerHints(url) {
  return url.includes('#') ? url : `${url}#toolbar=1&navpanes=0`;
}

function showTableMessage(message, isError = false) {
  const tableBody = procurementReportsElements.tableBody;
  if (!tableBody) return;

  tableBody.innerHTML = '';

  const row = document.createElement('tr');
  const cell = document.createElement('td');
  cell.colSpan = 4;
  cell.className = isError ? 'table-message error' : 'table-message';
  cell.textContent = message;
  row.appendChild(cell);
  tableBody.appendChild(row);
}

function normalizeDate(value) {
  if (!value) return '';

  const stringValue = String(value);
  const matchedDate = stringValue.match(/^\d{4}-\d{2}-\d{2}/);
  return matchedDate ? matchedDate[0] : '';
}

function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return dateString;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function getFileUnavailableReason(rawFile, resolvedFileUrl) {
  if (!rawFile) {
    return 'No file';
  }

  if (/^idb:\/\//i.test(rawFile)) {
    return 'File must be re-uploaded to Supabase Storage';
  }

  if (!resolvedFileUrl) {
    return 'Invalid file link';
  }

  return 'No file';
}

function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => callback(...args), delay);
  };
}

