const USER_NAVBAR_STATIC_RESULTS = [
  {
    title: 'Home',
    description: 'School home page and announcements',
    href: '/index.html',
    section: 'Page',
    keywords: ['dashboard', 'home']
  },
  {
    title: 'Organizational Structure',
    description: 'Department structure and leadership information',
    href: 'organizational-structure.html',
    section: 'About',
    keywords: ['organization', 'department', 'structure']
  },
  {
    title: 'Recognized Organization',
    description: 'Student organizations, advisers, and accomplishment reports',
    href: 'recognized-structure.html',
    section: 'About',
    keywords: ['recognized', 'organization', 'club', 'student organization']
  },
  {
    title: 'History Profile',
    description: 'School history and background information',
    href: 'history.html',
    section: 'About',
    keywords: ['history', 'profile', 'background']
  },
  {
    title: 'VMC',
    description: 'Vision, mission, and core values',
    href: 'mvc.html',
    section: 'About',
    keywords: ['vmc', 'vision', 'mission', 'core values']
  },
  {
    title: 'Transparency Information',
    description: 'Transparency seal and public information details',
    href: 'transparency-info.html',
    section: 'Transparency',
    keywords: ['transparency', 'seal', 'public information']
  },
  {
    title: 'Research Bulletin',
    description: 'Published student and school research entries',
    href: 'research.html',
    section: 'Research',
    keywords: ['research', 'bulletin', 'study']
  },
  {
    title: 'Location',
    description: 'School location, map, and campus facilities',
    href: 'location.html',
    section: 'Page',
    keywords: ['location', 'map', 'campus']
  }
];

const USER_NAVBAR_DYNAMIC_SOURCES = [
  {
    table: 'school_memorandum',
    href: 'school-memo.html',
    section: 'Resources',
    sourceLabel: 'School Memorandum',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'division_memorandum',
    href: 'division-memo.html',
    section: 'Resources',
    sourceLabel: 'Division Memorandum',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'deped_memorandum',
    href: 'deped-memo.html',
    section: 'Resources',
    sourceLabel: 'DepEd Memorandum',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'deped_order',
    href: 'deped-order.html',
    section: 'Resources',
    sourceLabel: 'DepEd Order',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'app',
    href: 'app.html',
    section: 'Transparency',
    sourceLabel: 'APP',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'award_contracts',
    href: 'award-contracts.html',
    section: 'Transparency',
    sourceLabel: 'Award of Contracts',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'bac',
    href: 'bac.html',
    section: 'Transparency',
    sourceLabel: 'Bid and Awards Committee',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'bid_bulletin',
    href: 'bid-bulletin.html',
    section: 'Transparency',
    sourceLabel: 'Bid Bulletin',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'invitation_bid',
    href: 'invitation-bid.html',
    section: 'Transparency',
    sourceLabel: 'Invitation to Bid',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'philgeps',
    href: 'philgeps.html',
    section: 'Transparency',
    sourceLabel: 'PhilGEPS',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'procurement_report',
    href: 'procurement-reports.html',
    section: 'Transparency',
    sourceLabel: 'Procurement Reports',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'spta',
    href: 'spta.html',
    section: 'Transparency',
    sourceLabel: 'SPTA',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'sslg',
    href: 'sslg.html',
    section: 'Transparency',
    sourceLabel: 'SSLG',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'bsp',
    href: 'bsp.html',
    section: 'Transparency',
    sourceLabel: 'BSP',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'gsp',
    href: 'gsp.html',
    section: 'Transparency',
    sourceLabel: 'GSP',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'tr',
    href: 'tr.html',
    section: 'Transparency',
    sourceLabel: 'TR',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'mooe',
    href: 'mooe.html',
    section: 'Transparency',
    sourceLabel: 'MOOE',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'redcross',
    href: 'redcross.html',
    section: 'Transparency',
    sourceLabel: 'Red Cross',
    select: 'id, title, description, date, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: record.description,
      meta: formatDateValue(record.date),
      searchText: [record.title, record.description, record.date]
    })
  },
  {
    table: 'research',
    href: 'research.html',
    section: 'Research',
    sourceLabel: 'Research Bulletin',
    select: 'id, title, grade, department, year, category, created_at',
    mapRecord: (record) => ({
      title: record.title,
      description: [record.category, record.department, record.grade].filter(Boolean).join(' • '),
      meta: record.year ? String(record.year) : '',
      searchText: [record.title, record.grade, record.department, record.year, record.category]
    })
  },
  {
    table: 'recognized-structure',
    href: 'recognized-structure.html',
    section: 'About',
    sourceLabel: 'Recognized Organization',
    select: 'id, org_name, adviser_name, date_established, created_at',
    mapRecord: (record) => ({
      title: record.org_name,
      description: record.adviser_name ? `Adviser: ${record.adviser_name}` : 'Recognized student organization',
      meta: formatDateValue(record.date_established),
      searchText: [record.org_name, record.adviser_name, record.date_established]
    })
  }
];

const userNavbarSearchState = {
  loaded: false,
  loading: false,
  items: USER_NAVBAR_STATIC_RESULTS.map(createStaticResult),
  results: [],
  activeQuery: '',
  loadPromise: null,
  elements: {}
};

document.addEventListener('DOMContentLoaded', () => {
  initUserNavbarNavigation();
  initUserNavbarSearch();
  applyPageSearchFromUrl();
});

function resolveUserPageHref(relativePath) {
  if (!relativePath) return relativePath;
  if (/^(https?:|\/)/i.test(relativePath)) return relativePath;

  const pathname = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  return pathname.includes('/src/pages/user/') ? relativePath : `src/pages/user/${relativePath}`;
}

function initUserNavbarNavigation() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const menuToggle = navbar.querySelector('.menu-toggle');
  const navLinks = navbar.querySelector('.nav-links');
  const searchContainer = navbar.querySelector('.search-container');
  const adminIconContainer = navbar.querySelector('.admin-icon-container');
  const dropdowns = navbar.querySelectorAll('.dropdown, .dropdown-submenu');

  menuToggle?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('mobile-open');
    searchContainer?.classList.toggle('mobile-open', Boolean(isOpen));
    adminIconContainer?.classList.toggle('mobile-open', Boolean(isOpen));
    menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  });

  dropdowns.forEach((dropdown) => {
    const trigger = dropdown.querySelector(':scope > a');
    trigger?.addEventListener('click', (event) => {
      if (window.innerWidth > 1024) return;

      event.preventDefault();
      dropdown.classList.toggle('mobile-open');
    });
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Node) || navbar.contains(event.target)) {
      return;
    }

    navLinks?.classList.remove('mobile-open');
    searchContainer?.classList.remove('mobile-open');
    adminIconContainer?.classList.remove('mobile-open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    dropdowns.forEach((dropdown) => dropdown.classList.remove('mobile-open'));
  });
}

function initUserNavbarSearch() {
  const searchContainer = document.querySelector('.navbar .search-container');
  const searchInput = searchContainer?.querySelector('input');
  const searchButton = searchContainer?.querySelector('button');

  if (!searchContainer || !searchInput) {
    return;
  }

  searchContainer.setAttribute('role', 'search');
  searchInput.setAttribute('autocomplete', 'off');
  searchInput.setAttribute('aria-label', 'Search site content');
  searchInput.placeholder = 'Search pages, memos, research...';

  const panel = document.createElement('div');
  panel.className = 'navbar-search-panel';
  panel.hidden = true;

  const status = document.createElement('div');
  status.className = 'navbar-search-status';
  status.setAttribute('aria-live', 'polite');
  status.hidden = true;

  searchContainer.appendChild(panel);
  searchContainer.appendChild(status);

  userNavbarSearchState.elements = {
    container: searchContainer,
    input: searchInput,
    button: searchButton,
    panel,
    status
  };

  const debouncedSearch = debounce(async () => {
    await runNavbarSearch(searchInput.value);
  }, 120);

  searchContainer.addEventListener('submit', async (event) => {
    event.preventDefault();
    await runNavbarSearch(searchInput.value, true);
  });

  searchInput.addEventListener('focus', async () => {
    if (searchInput.value.trim()) {
      await runNavbarSearch(searchInput.value);
      return;
    }

    await ensureNavbarSearchIndex();
    renderNavbarResults([], '');
  });

  searchInput.addEventListener('input', () => {
    debouncedSearch();
  });

  searchInput.addEventListener('keydown', async (event) => {
    if (event.key === 'Escape') {
      hideNavbarResults();
      searchInput.blur();
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      await runNavbarSearch(searchInput.value, true);
    }
  });

  searchButton?.addEventListener('click', async (event) => {
    event.preventDefault();
    searchInput.focus();
    await runNavbarSearch(searchInput.value, true);
  });

  document.addEventListener('click', (event) => {
    if (!(event.target instanceof Node) || searchContainer.contains(event.target)) {
      return;
    }

    hideNavbarResults();
  });
}

async function runNavbarSearch(rawQuery, shouldNavigateToFirstResult = false) {
  const query = normalizeSearchText(rawQuery);

  userNavbarSearchState.activeQuery = query;

  if (!query) {
    renderNavbarResults([], '');
    return;
  }

  setNavbarSearchStatus('Searching...');
  await ensureNavbarSearchIndex();

  const results = findNavbarMatches(query);
  userNavbarSearchState.results = results;

  renderNavbarResults(results, query);

  if (shouldNavigateToFirstResult) {
    window.location.href = withSearchParam(resolveUserPageHref('search.html'), rawQuery);
  }
}

async function ensureNavbarSearchIndex() {
  if (userNavbarSearchState.loaded) {
    return userNavbarSearchState.items;
  }

  if (userNavbarSearchState.loadPromise) {
    return userNavbarSearchState.loadPromise;
  }

  userNavbarSearchState.loading = true;
  userNavbarSearchState.loadPromise = loadNavbarDynamicResults()
    .then((items) => {
      userNavbarSearchState.items = [
        ...USER_NAVBAR_STATIC_RESULTS.map(createStaticResult),
        ...items
      ];
      userNavbarSearchState.loaded = true;
      return userNavbarSearchState.items;
    })
    .catch((error) => {
      console.error('Navbar search index could not be fully loaded:', error);
      return userNavbarSearchState.items;
    })
    .finally(() => {
      userNavbarSearchState.loading = false;
      userNavbarSearchState.loadPromise = null;
    });

  return userNavbarSearchState.loadPromise;
}

async function loadNavbarDynamicResults() {
  if (!window.supabaseClient) {
    return [];
  }

  const responses = await Promise.all(
    USER_NAVBAR_DYNAMIC_SOURCES.map(async (source) => {
      try {
        const { data, error } = await window.supabaseClient
          .from(source.table)
          .select(source.select);

        if (error) {
          throw error;
        }

        return (data || [])
          .map((record) => createDynamicResult(source, source.mapRecord(record), record.id))
          .filter(Boolean);
      } catch (error) {
        console.warn(`Navbar search skipped ${source.table}:`, error);
        return [];
      }
    })
  );

  return responses.flat();
}

function createStaticResult(item) {
  return {
    title: item.title,
    description: item.description,
    href: resolveUserPageHref(item.href),
    section: item.section,
    sourceLabel: 'Page',
    meta: '',
    haystack: normalizeSearchText([item.title, item.description, ...(item.keywords || [])].join(' ')),
    type: 'static'
  };
}

function createDynamicResult(source, mappedRecord, id) {
  if (!mappedRecord?.title) {
    return null;
  }

  return {
    id,
    title: safeText(mappedRecord.title, 'Untitled'),
    description: safeText(mappedRecord.description),
    href: resolveUserPageHref(source.href),
    section: source.section,
    sourceLabel: source.sourceLabel,
    meta: safeText(mappedRecord.meta),
    haystack: normalizeSearchText([
      mappedRecord.title,
      mappedRecord.description,
      mappedRecord.meta,
      source.sourceLabel,
      ...(mappedRecord.searchText || [])
    ].join(' ')),
    type: 'dynamic'
  };
}

function findNavbarMatches(query) {
  const terms = query.split(' ').filter(Boolean);

  return userNavbarSearchState.items
    .filter((item) => terms.every((term) => item.haystack.includes(term)))
    .map((item) => ({
      ...item,
      score: scoreNavbarResult(item, query, terms)
    }))
    .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
    .slice(0, 8);
}

function scoreNavbarResult(item, query, terms) {
  const title = normalizeSearchText(item.title);
  const description = normalizeSearchText(item.description);
  let score = 0;

  if (title === query) score += 200;
  if (title.startsWith(query)) score += 120;
  if (title.includes(query)) score += 80;
  if (description.includes(query)) score += 25;
  if (item.type === 'dynamic') score += 10;

  terms.forEach((term) => {
    if (title.startsWith(term)) score += 18;
    if (title.includes(term)) score += 10;
    if (description.includes(term)) score += 4;
  });

  return score;
}

function renderNavbarResults(results, query) {
  const { panel } = userNavbarSearchState.elements;
  if (!panel) return;

  if (!query) {
    hideNavbarResults();
    setNavbarSearchStatus('');
    return;
  }

  if (results.length === 0) {
    panel.innerHTML = `
      <div class="navbar-search-empty">
        <strong>No matches found.</strong>
        <span>Try another keyword.</span>
      </div>
    `;
    panel.hidden = false;
    setNavbarSearchStatus('No matching results.');
    return;
  }

  panel.innerHTML = results.map((result) => {
    const description = result.description || 'Open this page';
    const meta = result.meta ? `<span class="navbar-search-meta">${escapeHtml(result.meta)}</span>` : '';

    return `
      <a class="navbar-search-result" href="${escapeHtml(withSearchParam(result.href, query))}">
        <span class="navbar-search-result-top">
          <span class="navbar-search-badge">${escapeHtml(result.sourceLabel)}</span>
          ${meta}
        </span>
        <strong class="navbar-search-title">${escapeHtml(result.title)}</strong>
        <span class="navbar-search-description">${escapeHtml(description)}</span>
        <span class="navbar-search-section">${escapeHtml(result.section)}</span>
      </a>
    `;
  }).join('');

  panel.hidden = false;
  setNavbarSearchStatus(`${results.length} result${results.length === 1 ? '' : 's'} found.`);
}

function hideNavbarResults() {
  const { panel } = userNavbarSearchState.elements;
  if (!panel) return;

  panel.hidden = true;
}

function setNavbarSearchStatus(message) {
  const { status } = userNavbarSearchState.elements;
  if (!status) return;

  status.hidden = !message;
  status.textContent = message;
}

function withSearchParam(href, query) {
  const url = new URL(href, window.location.href);

  if (query) {
    url.searchParams.set('search', query);
  }

  if (url.origin === window.location.origin) {
    return `${url.pathname}${url.search}${url.hash}`;
  }

  return url.toString();
}

function applyPageSearchFromUrl() {
  const searchParam = new URLSearchParams(window.location.search).get('search');
  if (!searchParam) {
    return;
  }

  const navbarInput = document.querySelector('.navbar .search-container input');
  if (navbarInput && !navbarInput.value.trim()) {
    navbarInput.value = searchParam;
  }

  const pageSearchInput = document.getElementById('searchInput');
  if (pageSearchInput && !pageSearchInput.value.trim()) {
    pageSearchInput.value = searchParam;
    pageSearchInput.dispatchEvent(new Event('input', { bubbles: true }));
    pageSearchInput.dispatchEvent(new Event('change', { bubbles: true }));
  }

  const researchTitleInput = document.getElementById('research-title');
  if (researchTitleInput && !researchTitleInput.value.trim()) {
    researchTitleInput.value = searchParam;
    researchTitleInput.dispatchEvent(new Event('input', { bubbles: true }));
    researchTitleInput.dispatchEvent(new Event('change', { bubbles: true }));
  }
}

function formatDateValue(value) {
  if (!value) return '';

  const rawValue = String(value).trim();
  if (/^\d{4}$/.test(rawValue)) {
    return rawValue;
  }

  const normalized = rawValue.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || rawValue;
  const parsed = new Date(`${normalized}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return normalized;
  }

  return parsed.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function safeText(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
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
