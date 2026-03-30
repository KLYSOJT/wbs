const ROWS_PER_PAGE = 10;
let currentPage = 1;
let allRows = [];
let filteredRows = [];

document.addEventListener('DOMContentLoaded', function() {
  const yearFilter = document.getElementById('yearFilter');
  const monthFilter = document.getElementById('monthFilter');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.querySelector('.search-btn');
  const tableBody = document.getElementById('memoTableBody');

  function createNoDataRow() {
    const tr = document.createElement('tr');
    tr.className = 'no-data';
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.textAlign = 'center';
    td.style.padding = '20px';
    td.textContent = 'No memorandums found';
    tr.appendChild(td);
    return tr;
  }

  allRows = Array.from(tableBody.querySelectorAll('tr')).filter(row => row.cells.length === 4);
  filteredRows = [...allRows];
  updatePagination();

  function filterMemos() {
    const year = yearFilter.value;
    const month = monthFilter.value;
    const searchTerm = searchInput.value.toLowerCase();

    filteredRows = allRows.filter(row => {
      const dateCell = row.cells[0].textContent.trim();
      const titleCell = row.cells[1].textContent.toLowerCase();
      const descCell = row.cells[2].textContent.toLowerCase();

      if (year && !dateCell.endsWith(year)) return false;
      if (month && !dateCell.startsWith(month)) return false;
      if (searchTerm && !titleCell.includes(searchTerm) && !descCell.includes(searchTerm)) return false;

      return true;
    });

    currentPage = 1;
    updatePagination();
  }

  function updatePagination() {
    displayPage();
    generatePaginationButtons();
  }

  function displayPage() {
    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    allRows.forEach(row => row.style.display = 'none');

    const existingNo = tableBody.querySelector('.no-data');
    if (existingNo) existingNo.remove();

    if (filteredRows.length === 0) {
      tableBody.appendChild(createNoDataRow());
    } else {
      filteredRows.slice(start, end).forEach(row => row.style.display = '');
    }
  }

  function generatePaginationButtons() {
    const paginationControls = document.getElementById('paginationControls');
    paginationControls.innerHTML = '';

    const totalPages = Math.ceil(filteredRows.length / ROWS_PER_PAGE);

    if (totalPages <= 1) {
      paginationControls.style.display = 'none';
      return;
    }

    paginationControls.style.display = 'flex';

    const makeBtn = (text, onClick, disabled) => {
      const a = document.createElement('a');
      a.href = '#';
      a.className = 'pagination-btn';
      a.textContent = text;
      if (disabled) {
        a.style.opacity = '0.5';
        a.style.pointerEvents = 'none';
      }
      a.onclick = (e) => { e.preventDefault(); if (!disabled) onClick(); };
      return a;
    };

    paginationControls.appendChild(makeBtn('First', () => { currentPage = 1; updatePagination(); }, currentPage === 1));
    paginationControls.appendChild(makeBtn('Prev', () => { currentPage--; updatePagination(); }, currentPage === 1));

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement('a');
      btn.href = '#';
      btn.className = 'pagination-btn' + (i === currentPage ? ' pagination-active' : '');
      btn.textContent = i;
      btn.onclick = (e) => {
        e.preventDefault();
        currentPage = i;
        updatePagination();
      };
      paginationControls.appendChild(btn);
    }

    paginationControls.appendChild(makeBtn('Last', () => { currentPage = totalPages; updatePagination(); }, currentPage === totalPages));
  }

  yearFilter.addEventListener('change', filterMemos);
  monthFilter.addEventListener('change', filterMemos);
  searchInput.addEventListener('input', filterMemos);
  searchBtn.addEventListener('click', (e) => {
    e.preventDefault();
    filterMemos();
  });
});