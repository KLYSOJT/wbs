document.addEventListener('DOMContentLoaded', initUserSearchPage);

const USER_SEARCH_STATIC_GROUPS = {
  Pages: [
    {
      title: 'Home',
      description: 'School home page and announcements',
      link: '/index.html',
      meta: 'Page',
      searchText: ['home', 'dashboard', 'school home page']
    },
    {
      title: 'Organizational Structure',
      description: 'Department structure and leadership information',
      link: 'organizational-structure.html',
      meta: 'About',
      searchText: ['organizational structure', 'department']
    },
    {
      title: 'Recognized Organization',
      description: 'Student organizations, advisers, and accomplishment reports',
      link: 'recognized-structure.html',
      meta: 'About',
      searchText: ['recognized organization', 'student organization', 'club']
    },
    {
      title: 'History Profile',
      description: 'School history and background information',
      link: 'history.html',
      meta: 'About',
      searchText: ['history', 'profile', 'background']
    },
    {
      title: 'VMC',
      description: 'Vision, mission, and core values',
      link: 'mvc.html',
      meta: 'About',
      searchText: ['vmc', 'vision', 'mission', 'core values']
    },
    {
      title: 'Transparency Information',
      description: 'Transparency seal and public information details',
      link: 'transparency-info.html',
      meta: 'Transparency',
      searchText: ['transparency', 'seal']
    },
    {
      title: 'Research Bulletin',
      description: 'Published student and school research entries',
      link: 'research.html',
      meta: 'Research',
      searchText: ['research', 'bulletin']
    },
    {
      title: 'Location',
      description: 'School location, map, and campus facilities',
      link: 'location.html',
      meta: 'Page',
      searchText: ['location', 'map', 'campus']
    }
  ]
};

const USER_SEARCH_DYNAMIC_SOURCES = [
  createDocumentSource('School Memorandum', 'school_memorandum', 'school-memo.html'),
  createDocumentSource('Division Memorandum', 'division_memorandum', 'division-memo.html'),
  createDocumentSource('DepEd Memorandum', 'deped_memorandum', 'deped-memo.html'),
  createDocumentSource('DepEd Order', 'deped_order', 'deped-order.html'),
  createDocumentSource('APP', 'app', 'app.html'),
  createDocumentSource('Award of Contracts', 'award_contracts', 'award-contracts.html'),
  createDocumentSource('Bid and Awards Committee', 'bac', 'bac.html'),
  createDocumentSource('Bid Bulletin', 'bid_bulletin', 'bid-bulletin.html'),
  createDocumentSource('Invitation to Bid', 'invitation_bid', 'invitation-bid.html'),
  createDocumentSource('PhilGEPS', 'philgeps', 'philgeps.html'),
  createDocumentSource('Procurement Reports', 'procurement_report', 'procurement-reports.html'),
  createDocumentSource('SPTA', 'spta', 'spta.html'),
  createDocumentSource('SSLG', 'sslg', 'sslg.html'),
  createDocumentSource('BSP', 'bsp', 'bsp.html'),
  createDocumentSource('GSP', 'gsp', 'gsp.html'),
  createDocumentSource('TR', 'tr', 'tr.html'),
  createDocumentSource('MOOE', 'mooe', 'mooe.html'),
  createDocumentSource('Red Cross', 'redcross', 'redcross.html'),
  {
    group: 'Research',
    table: 'research',
    link: 'research.html',
    select: 'id, title, grade, department, year, category',
    mapRecord: (record) => ({
      title: safeText(record.title, 'Untitled Research'),
      description: [record.category, record.department, record.grade].filter(Boolean).join(' • ') || 'Research entry',
      meta: record.year ? String(record.year) : 'Research',
      searchText: [record.title, record.grade, record.department, record.year, record.category]
    })
  },
  {
    group: 'Recognized Organization',
    table: 'recognized-structure',
    link: 'recognized-structure.html',
    select: 'id, org_name, adviser_name, date_established',
    mapRecord: (record) => ({
      title: safeText(record.org_name, 'Recognized Organization'),
      description: record.adviser_name ? `Adviser: ${record.adviser_name}` : 'Recognized student organization',
      meta: formatDateValue(record.date_established) || 'Organization',
      searchText: [record.org_name, record.adviser_name, record.date_established]
    })
  }
];

const userSearchState = {
  groups: cloneStaticSearchGroups(),
  loaded: false,
  elements: {}
};

async function initUserSearchPage() {
  cacheSearchElements();
  bindSearchEvents();

  const initialQuery = new URLSearchParams(window.location.search).get('search') || '';
  if (userSearchState.elements.input) {
    userSearchState.elements.input.value = initialQuery;
  }

  renderInitialState();

  try {
    await loadDynamicSearchGroups();
    applySearch(initialQuery);
  } catch (error) {
    console.error('Failed to load search page data:', error);
    userSearchState.elements.summary.textContent = 'Some search sources could not be loaded.';
    applySearch(initialQuery);
  }
}

function resolveUserSearchHref(relativePath) {
  if (!relativePath) return relativePath;
  if (/^(https?:|\/)/i.test(relativePath)) return relativePath;

  const pathname = window.location.pathname.replace(/\\/g, '/').toLowerCase();
  return pathname.includes('/src/pages/user/') ? relativePath : `src/pages/user/${relativePath}`;
}

function cacheSearchElements() {
  userSearchState.elements.input = document.getElementById('searchInput');
  userSearchState.elements.form = document.getElementById('searchPageForm');
  userSearchState.elements.title = document.getElementById('searchTitle');
  userSearchState.elements.summary = document.getElementById('searchSummary');
  userSearchState.elements.results = document.getElementById('resultsContainer');
  userSearchState.elements.resultsSection = userSearchState.elements.results?.closest('.search-results') || null;
  userSearchState.elements.page = userSearchState.elements.form?.closest('.search-page') || null;
}

function bindSearchEvents() {
  userSearchState.elements.form?.addEventListener('submit', (event) => {
    event.preventDefault();
    applySearch(userSearchState.elements.input?.value || '');
  });

  userSearchState.elements.input?.addEventListener('input', debounce((event) => {
    applySearch(event.target.value);
  }, 120));
}

function renderInitialState() {
  if (!userSearchState.elements.results) return;

  userSearchState.elements.results.innerHTML = '';
  setSearchResultsVisibility(false);
  setSearchPageVisibility(false);
}

async function loadDynamicSearchGroups() {
  if (userSearchState.loaded || !window.supabaseClient) {
    userSearchState.loaded = true;
    return;
  }

  const entries = await Promise.all(
    USER_SEARCH_DYNAMIC_SOURCES.map(async (source) => {
      try {
        const { data, error } = await window.supabaseClient
          .from(source.table)
          .select(source.select);

        if (error) {
          throw error;
        }

        return {
          group: source.group,
          items: (data || []).map((record) => {
            const mapped = source.mapRecord(record);
            return {
              title: mapped.title,
              description: mapped.description,
              link: `${resolveUserSearchHref(source.link)}?search=${encodeURIComponent(mapped.title)}`,
              meta: mapped.meta,
              haystack: normalizeSearchText([
                mapped.title,
                mapped.description,
                mapped.meta,
                ...(mapped.searchText || [])
              ].join(' '))
            };
          })
        };
      } catch (error) {
        console.warn(`Search page skipped ${source.table}:`, error);
        return {
          group: source.group,
          items: []
        };
      }
    })
  );

  entries.forEach((entry) => {
    if (!userSearchState.groups[entry.group]) {
      userSearchState.groups[entry.group] = [];
    }

    userSearchState.groups[entry.group].push(...entry.items);
  });

  Object.keys(userSearchState.groups).forEach((groupName) => {
    userSearchState.groups[groupName] = userSearchState.groups[groupName].map((item) => ({
      ...item,
      haystack: item.haystack || normalizeSearchText([
        item.title,
        item.description,
        item.meta,
        ...(item.searchText || [])
      ].join(' '))
    }));
  });

  userSearchState.loaded = true;
}

function applySearch(rawQuery) {
  const query = normalizeSearchText(rawQuery);
  const groups = filterSearchGroups(query);
  const totalMatches = Object.values(groups).reduce((count, items) => count + items.length, 0);

  updateSearchUrl(rawQuery);
  renderSearchHeader(rawQuery, totalMatches);
  renderSearchResults(groups, rawQuery, totalMatches);
}

function filterSearchGroups(query) {
  if (!query) {
    return {};
  }

  const terms = query.split(' ').filter(Boolean);
  const groupedResults = {};

  Object.entries(userSearchState.groups).forEach(([groupName, items]) => {
    const matches = items.filter((item) => terms.every((term) => item.haystack.includes(term)));
    if (matches.length > 0) {
      groupedResults[groupName] = matches;
    }
  });

  return groupedResults;
}

function renderSearchHeader(rawQuery, totalMatches) {
  const query = rawQuery.trim();
  const title = userSearchState.elements.title;
  const summary = userSearchState.elements.summary;

  if (!title || !summary) return;

  if (!query) {
    title.textContent = 'Search Results';
    summary.textContent = 'Enter a search term above to begin.';
    setSearchPageVisibility(false);
    return;
  }

  setSearchPageVisibility(true);
  title.textContent = `Search Results for "${query}"`;
  summary.textContent = totalMatches > 0
    ? `${totalMatches} matching result${totalMatches === 1 ? '' : 's'} found across the user site.`
    : `No matches found for "${query}".`;
}

function renderSearchResults(groups, rawQuery, totalMatches) {
  const resultsContainer = userSearchState.elements.results;
  const query = rawQuery.trim();

  if (!resultsContainer) return;

  if (!query) {
    resultsContainer.innerHTML = '';
    setSearchResultsVisibility(false);
    return;
  }

  setSearchResultsVisibility(true);

  if (totalMatches === 0) {
    resultsContainer.innerHTML = `
      <p class="no-results">No results found. Try a different keyword or a shorter phrase.</p>
    `;
    return;
  }

  resultsContainer.innerHTML = Object.entries(groups).map(([groupName, items]) => `
    <div class="group">
      <div class="group-header">
        <h2>${escapeHtml(groupName)}</h2>
        <span class="group-count">${items.length} result${items.length === 1 ? '' : 's'}</span>
      </div>
      <ul>
        ${items.map((item) => `
          <li>
            <a class="search-result-link" href="${escapeHtml(item.link)}">
              <strong class="result-title">${escapeHtml(item.title)}</strong>
              <span class="result-description">${escapeHtml(item.description || 'Open this result')}</span>
              <span class="result-meta">${escapeHtml(item.meta || groupName)}</span>
            </a>
          </li>
        `).join('')}
      </ul>
    </div>
  `).join('');
}

function setSearchResultsVisibility(isVisible) {
  const { resultsSection } = userSearchState.elements;
  if (!resultsSection) return;

  resultsSection.hidden = !isVisible;
}

function setSearchPageVisibility(isVisible) {
  const { page } = userSearchState.elements;
  if (!page || page.dataset.hideUntilSearch !== 'true') return;

  page.hidden = !isVisible;
}

function createDocumentSource(group, table, link) {
  return {
    group,
    table,
    link,
    select: 'id, title, description, date',
    mapRecord: (record) => ({
      title: safeText(record.title, 'Untitled'),
      description: safeText(record.description, 'No description provided.'),
      meta: formatDateValue(record.date) || group,
      searchText: [record.title, record.description, record.date]
    })
  };
}

function cloneStaticSearchGroups() {
  return Object.fromEntries(
    Object.entries(USER_SEARCH_STATIC_GROUPS).map(([groupName, items]) => [
      groupName,
      items.map((item) => ({
        ...item,
        link: resolveUserSearchHref(item.link),
        haystack: normalizeSearchText([
          item.title,
          item.description,
          item.meta,
          ...(item.searchText || [])
        ].join(' '))
      }))
    ])
  );
}

function updateSearchUrl(query) {
  const url = new URL(window.location.href);

  if (query.trim()) {
    url.searchParams.set('search', query.trim());
  } else {
    url.searchParams.delete('search');
  }

  window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`);
}

function formatDateValue(value) {
  if (!value) return '';

  const normalized = String(value).match(/^\d{4}-\d{2}-\d{2}/)?.[0] || String(value);
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

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function safeText(value, fallback = '') {
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
