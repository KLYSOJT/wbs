document.addEventListener('DOMContentLoaded', initBidBulletins);

const BID_BULLETIN_BUCKET = 'bid-bulletin-files';

const bidBulletinState = {
  records: [],
  filteredRecords: [],
  currentPage: 1,
  pageSize: 10
};

const bidBulletinElements = {};

async function initBidBulletins() {
  cacheElements();
  bindEvents();

  if (!window.supabaseClient) {
    showTableMessage('Supabase is not available right now.', true);
    return;
  }

  try {
    showTableMessage('Loading bid bulletins...');
    await fetchBidBulletins();
    populateYearFilter();
    applyFilters();
  } catch (error) {
    console.error('Failed to initialize Bid Bulletin page:', error);
    showTableMessage('Failed to load bid bulletins.', true);
  }
}

function cacheElements() {
  bidBulletinElements.tableBody = document.getElementById('memoTableBody');
  bidBulletinElements.yearFilter = document.getElementById('yearFilter');
  bidBulletinElements.monthFilter = document.getElementById('monthFilter');
  bidBulletinElements.searchInput = document.getElementById('searchInput');
  bidBulletinElements.searchButton = document.querySelector('.search-btn');
  bidBulletinElements.pagination = document.getElementById('paginationControls');
}

function bindEvents() {
  bidBulletinElements.yearFilter?.addEventListener('change', applyFilters);
  bidBulletinElements.monthFilter?.addEventListener('change', applyFilters);
  bidBulletinElements.searchButton?.addEventListener('click', applyFilters);

  bidBulletinElements.searchInput?.addEventListener('input', debounce(applyFilters, 250));
  bidBulletinElements.searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyFilters();
    }
  });

  bidBulletinElements.tableBody?.addEventListener('click', async (event) => {
    const viewButton = event.target.closest('[data-action="view-pdf"]');
    if (!viewButton) return;

    await openPdf(viewButton.dataset.url || '');
  });
}

async function fetchBidBulletins() {
  const { data, error } = await window.supabaseClient
    .from('bid_bulletin')
    .select('id, title, date, description, file, created_at')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  bidBulletinState.records = (data || []).map(normalizeRecord);
  bidBulletinState.filteredRecords = [...bidBulletinState.records];
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
    .replace(new RegExp(`^${BID_BULLETIN_BUCKET}/`, 'i'), '');

  if (!cleanedPath) {
    return '';
  }

  const { data } = window.supabaseClient.storage
    .from(BID_BULLETIN_BUCKET)
    .getPublicUrl(cleanedPath);

  return data?.publicUrl || '';
}

function populateYearFilter() {
  if (!bidBulletinElements.yearFilter) return;

  const years = [...new Set(
    bidBulletinState.records
      .map((record) => record.year)
      .filter(Boolean)
  )].sort((a, b) => Number(b) - Number(a));

  bidBulletinElements.yearFilter.innerHTML = '<option value="">Year</option>';

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    bidBulletinElements.yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const year = bidBulletinElements.yearFilter?.value || '';
  const month = bidBulletinElements.monthFilter?.value || '';
  const searchTerm = (bidBulletinElements.searchInput?.value || '').trim().toLowerCase();

  bidBulletinState.filteredRecords = bidBulletinState.records.filter((record) => {
    const matchesYear = !year || record.year === year;
    const matchesMonth = !month || record.month === month;
    const matchesSearch = !searchTerm
      || record.title.toLowerCase().includes(searchTerm)
      || record.description.toLowerCase().includes(searchTerm)
      || record.dateDisplay.toLowerCase().includes(searchTerm);

    return matchesYear && matchesMonth && matchesSearch;
  });

  bidBulletinState.currentPage = 1;
  renderTable();
  renderPagination();
}

function renderTable() {
  const tableBody = bidBulletinElements.tableBody;
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (bidBulletinState.filteredRecords.length === 0) {
    showTableMessage('No bid bulletins found for the current filters.');
    return;
  }

  const startIndex = (bidBulletinState.currentPage - 1) * bidBulletinState.pageSize;
  const visibleRecords = bidBulletinState.filteredRecords.slice(
    startIndex,
    startIndex + bidBulletinState.pageSize
  );

  visibleRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.appendChild(createCell(record.dateDisplay));
    row.appendChild(createCell(record.title));
    row.appendChild(createCell(record.description || 'No description provided.'));
    row.appendChild(createFileCell(record));
    bidBulletinElements.tableBody.appendChild(row);
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
  const pagination = bidBulletinElements.pagination;
  if (!pagination) return;

  pagination.innerHTML = '';

  const totalPages = Math.ceil(bidBulletinState.filteredRecords.length / bidBulletinState.pageSize);
  if (totalPages <= 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  if (bidBulletinState.currentPage > 1) {
    fragment.appendChild(createPaginationButton('Previous', bidBulletinState.currentPage - 1));
  }

  const startPage = Math.max(1, bidBulletinState.currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  for (let page = startPage; page <= endPage; page += 1) {
    fragment.appendChild(createPaginationButton(String(page), page, page === bidBulletinState.currentPage));
  }

  if (bidBulletinState.currentPage < totalPages) {
    fragment.appendChild(createPaginationButton('Next', bidBulletinState.currentPage + 1));
  }

  pagination.appendChild(fragment);
}

function createPaginationButton(label, page, isActive = false) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = `pagination-btn${isActive ? ' pagination-active' : ''}`;
  button.textContent = label;
  button.addEventListener('click', () => {
    bidBulletinState.currentPage = page;
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
  const tableBody = bidBulletinElements.tableBody;
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

