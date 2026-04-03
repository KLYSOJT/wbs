// Memo data loader for school-memo.html
// Fetches from Supabase 'school_memorandum' table, supports filter/search/pagination

document.addEventListener('DOMContentLoaded', initMemos);

let memos = [];
let filteredMemos = [];
let currentPage = 1;
const pageSize = 10;

async function initMemos() {
  if (!window.supabaseClient) {
    console.error('Supabase client not found. Add supabase-config.js');
    showError('Supabase not loaded');
    return;
  }

  try {
    await fetchMemos();
    setupEventListeners();
    renderTable(1);
    updatePagination();
  } catch (error) {
    console.error('Init error:', error);
    showError('Failed to load memos');
  }
}

async function fetchMemos() {
const { data, error } = await window.supabaseClient
    .from('school_memorandum')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Supabase fetch error:', error);
    throw error;
  }

  console.log('Raw data:', data);
  memos = (data || []).map(row => ({
    ...row,
    dateDisplay: row.date ? new Date(row.date).toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }) : 'N/A'
  }));

  filteredMemos = [...memos];
  console.log(`${memos.length} memos loaded`);
}

function setupEventListeners() {
  const yearFilter = document.getElementById('yearFilter');
  const monthFilter = document.getElementById('monthFilter');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');

  if (yearFilter) yearFilter.addEventListener('change', applyFilters);
  if (monthFilter) monthFilter.addEventListener('change', applyFilters);
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyFilters, 300));
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') applyFilters();
    });
  }
  if (searchBtn) searchBtn.addEventListener('click', applyFilters);
}

function applyFilters() {
  const yearFilter = document.getElementById('yearFilter')?.value || '';
  const monthFilter = document.getElementById('monthFilter')?.value || '';
  const searchTerm = document.getElementById('searchInput')?.value.toLowerCase() || '';

  filteredMemos = memos.filter(memo => {
    const date = memo.date ? new Date(memo.date) : null;
    const year = date ? date.getFullYear().toString() : '';
    const month = date ? String(date.getMonth() + 1).padStart(2, '0') : '';

    const matchesYear = !yearFilter || year === yearFilter;
    const matchesMonth = !monthFilter || month === monthFilter;
    const matchesSearch = !searchTerm || 
      memo.title.toLowerCase().includes(searchTerm) || 
      memo.description.toLowerCase().includes(searchTerm);

    return matchesYear && matchesMonth && matchesSearch;
  });

  currentPage = 1;
  renderTable(currentPage);
  updatePagination();
}

function renderTable(page) {
  const tbody = document.getElementById('memoTableBody');
  if (!tbody) return;

  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const pageMemos = filteredMemos.slice(start, end);

  tbody.innerHTML = '';

  if (pageMemos.length === 0) {
    tbody.innerHTML = `
      <tr class="no-data-row">
        <td colspan="4" style="text-align: center; padding: 40px; color: #999;">
          ${filteredMemos.length === 0 ? 'No memos match the filters.' : 'No memos found.'}
        </td>
      </tr>
    `;
    return;
  }

  pageMemos.forEach(memo => {
    const row = document.createElement('tr');
    const date = memo.dateDisplay || 'N/A';
    const title = memo.title || 'Untitled';
    const desc = memo.description ? memo.description.slice(0, 100) + '...' : 'No description';
    const fileCell = memo.file ? 
      `<a href="${memo.file}" target="_blank" class="download-link">View</a>` : 
      '<span style="color:#999;">No file</span>';

    row.innerHTML = `
      <td>${date}</td>
      <td>${title}</td>
      <td>${desc}</td>
      <td>${fileCell}</td>
    `;
    tbody.appendChild(row);
  });
}

function updatePagination() {
  const totalPages = Math.ceil(filteredMemos.length / pageSize);
  const pagination = document.getElementById('paginationControls');
  if (!pagination) return;

  if (totalPages <= 1) {
    pagination.innerHTML = '';
    return;
  }

  let html = '';
  // Previous
  if (currentPage > 1) {
    html += `<button class="page-btn" data-page="${currentPage - 1}">« Previous</button>`;
  }

  // Page numbers
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);
  for (let i = startPage; i <= endPage; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }

  // Next
  if (currentPage < totalPages) {
    html += `<button class="page-btn" data-page="${currentPage + 1}">Next »</button>`;
  }

  pagination.innerHTML = html;

  // Event listeners for page buttons
  pagination.querySelectorAll('.page-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const page = parseInt(e.target.dataset.page);
      if (page && page !== currentPage) {
        currentPage = page;
        renderTable(page);
        updatePagination();
      }
    });
  });
}

// Helpers
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showError(message) {
  const tbody = document.getElementById('memoTableBody');
  if (tbody) {
    tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:red;">${message}</td></tr>`;
  }
}

console.log('Memo.js loaded');

