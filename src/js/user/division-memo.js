document.addEventListener('DOMContentLoaded', initDivisionMemos);

const DIVISION_MEMO_BUCKET = 'divsion-memo-files';

const divisionMemoState = {
  records: [],
  filteredRecords: [],
  currentPage: 1,
  pageSize: 10
};

const divisionMemoElements = {};

async function initDivisionMemos() {
  cacheElements();
  bindEvents();

  if (!window.supabaseClient) {
    showTableMessage('Supabase is not available right now.', true);
    return;
  }

  try {
    showTableMessage('Loading division memoranda...');
    await fetchDivisionMemos();
    populateYearFilter();
    applyFilters();
  } catch (error) {
    console.error('Failed to initialize Division Memorandum page:', error);
    showTableMessage('Failed to load division memoranda.', true);
  }
}

function cacheElements() {
  divisionMemoElements.tableBody = document.getElementById('memoTableBody');
  divisionMemoElements.yearFilter = document.getElementById('yearFilter');
  divisionMemoElements.monthFilter = document.getElementById('monthFilter');
  divisionMemoElements.searchInput = document.getElementById('searchInput');
  divisionMemoElements.searchButton = document.querySelector('.search-btn');
  divisionMemoElements.pagination = document.getElementById('paginationControls');
}

function bindEvents() {
  divisionMemoElements.yearFilter?.addEventListener('change', applyFilters);
  divisionMemoElements.monthFilter?.addEventListener('change', applyFilters);
  divisionMemoElements.searchButton?.addEventListener('click', applyFilters);

  divisionMemoElements.searchInput?.addEventListener('input', debounce(applyFilters, 250));
  divisionMemoElements.searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      applyFilters();
    }
  });

  divisionMemoElements.tableBody?.addEventListener('click', async (event) => {
    const viewButton = event.target.closest('[data-action="view-pdf"]');
    if (!viewButton) return;

    await openPdf(viewButton.dataset.url || '');
  });
}

async function fetchDivisionMemos() {
  const { data, error } = await window.supabaseClient
    .from('division_memorandum')
    .select('id, title, date, description, file, created_at')
    .order('date', { ascending: false });

  if (error) {
    throw error;
  }

  divisionMemoState.records = (data || []).map(normalizeRecord);
  divisionMemoState.filteredRecords = [...divisionMemoState.records];
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
    .replace(new RegExp(`^${DIVISION_MEMO_BUCKET}/`, 'i'), '');

  if (!cleanedPath) {
    return '';
  }

  const { data } = window.supabaseClient.storage
    .from(DIVISION_MEMO_BUCKET)
    .getPublicUrl(cleanedPath);

  return data?.publicUrl || '';
}

function populateYearFilter() {
  if (!divisionMemoElements.yearFilter) return;

  const years = [...new Set(
    divisionMemoState.records
      .map((record) => record.year)
      .filter(Boolean)
  )].sort((a, b) => Number(b) - Number(a));

  divisionMemoElements.yearFilter.innerHTML = '<option value="">Year</option>';

  years.forEach((year) => {
    const option = document.createElement('option');
    option.value = year;
    option.textContent = year;
    divisionMemoElements.yearFilter.appendChild(option);
  });
}

function applyFilters() {
  const year = divisionMemoElements.yearFilter?.value || '';
  const month = divisionMemoElements.monthFilter?.value || '';
  const searchTerm = (divisionMemoElements.searchInput?.value || '').trim().toLowerCase();

  divisionMemoState.filteredRecords = divisionMemoState.records.filter((record) => {
    const matchesYear = !year || record.year === year;
    const matchesMonth = !month || record.month === month;
    const matchesSearch = !searchTerm
      || record.title.toLowerCase().includes(searchTerm)
      || record.description.toLowerCase().includes(searchTerm)
      || record.dateDisplay.toLowerCase().includes(searchTerm);

    return matchesYear && matchesMonth && matchesSearch;
  });

  divisionMemoState.currentPage = 1;
  renderTable();
  renderPagination();
}

function renderTable() {
  const tableBody = divisionMemoElements.tableBody;
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (divisionMemoState.filteredRecords.length === 0) {
    showTableMessage('No division memoranda found for the current filters.');
    return;
  }

  const startIndex = (divisionMemoState.currentPage - 1) * divisionMemoState.pageSize;
  const visibleRecords = divisionMemoState.filteredRecords.slice(
    startIndex,
    startIndex + divisionMemoState.pageSize
  );

  visibleRecords.forEach((record) => {
    const row = document.createElement('tr');
    row.appendChild(createCell(record.dateDisplay));
    row.appendChild(createCell(record.title));
    row.appendChild(createCell(record.description || 'No description provided.'));
    row.appendChild(createFileCell(record));
    divisionMemoElements.tableBody.appendChild(row);
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
  const pagination = divisionMemoElements.pagination;
  if (!pagination) return;

  pagination.innerHTML = '';

  const totalPages = Math.ceil(divisionMemoState.filteredRecords.length / divisionMemoState.pageSize);
  if (totalPages <= 1) {
    return;
  }

  const fragment = document.createDocumentFragment();

  fragment.appendChild(
    createPaginationButton('Previous', divisionMemoState.currentPage - 1, {
      isDisabled: divisionMemoState.currentPage === 1,
      extraClass: 'pagination-btn--nav',
      ariaLabel: 'Previous page'
    })
  );

  buildPaginationItems(totalPages, divisionMemoState.currentPage).forEach((item) => {
    if (item === 'ellipsis') {
      fragment.appendChild(createPaginationEllipsis());
      return;
    }

    fragment.appendChild(
      createPaginationButton(String(item), item, {
        isActive: item === divisionMemoState.currentPage,
        ariaLabel: 'Page ' + item
      })
    );
  });

  fragment.appendChild(
    createPaginationButton('Next', divisionMemoState.currentPage + 1, {
      isDisabled: divisionMemoState.currentPage === totalPages,
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
  button.className = 'pagination-btn' + (isActive ? ' active pagination-active' : '') + (extraClass ? ' ' + extraClass : '');
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
    divisionMemoState.currentPage = page;
    renderTable();
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
  const tableBody = divisionMemoElements.tableBody;
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


