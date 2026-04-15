document.addEventListener('DOMContentLoaded', initResearchPage);

const RESEARCH_BUCKET = 'research-files';

const researchState = {
  records: [],
  filteredRecords: [],
  currentPage: 1,
  pageSize: 10
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
  researchElements.pagination = document.getElementById('paginationControls');
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

  researchState.currentPage = 1;
  renderRecords();
  renderPagination();
}

function renderRecords() {
  if (!researchElements.items) return;

  if (researchState.filteredRecords.length === 0) {
    renderEmptyState('No research matched your filters.');
    return;
  }

  const startIndex = (researchState.currentPage - 1) * researchState.pageSize;
  const visibleRecords = researchState.filteredRecords.slice(
    startIndex,
    startIndex + researchState.pageSize
  );

  researchElements.items.innerHTML = visibleRecords.map((record, index) => {
    const absoluteIndex = startIndex + index;
    const themeClass = absoluteIndex % 2 === 0 ? 'light-bg' : 'dark-bg';
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

  if (researchElements.pagination) {
    researchElements.pagination.innerHTML = '';
  }
}

function renderPagination() {
  const pagination = researchElements.pagination;
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
