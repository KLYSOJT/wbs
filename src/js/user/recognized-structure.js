const RECOGNIZED_TABLE = 'recognized-structure';
const RECOGNIZED_BUCKET = 'recognized-structure-files';

const recognizedState = {
  records: []
};

const recognizedElements = {};
let lastFocusedCard = null;

document.addEventListener('DOMContentLoaded', initRecognizedOrganizations);

async function initRecognizedOrganizations() {
  cacheElements();
  bindEvents();

  const grid = document.getElementById('recognizedOrganizationsGrid');
  if (!grid) return;

  if (!window.supabaseClient) {
    grid.innerHTML = '<div class="recognized-empty-state">Supabase is not available right now.</div>';
    return;
  }

  try {
    let result = await window.supabaseClient
      .from(RECOGNIZED_TABLE)
      .select('id, org_name, adviser_name, date_established, logo_url, logo_path, chart_url, chart_path, image_url, image_path, pdf_url, pdf_path, pdf_mime, pdf_urls, pdf_paths, pdf_mimes, pdf_names, created_at, updated_at')
      .order('created_at', { ascending: false });

    if (result.error && isMissingMultiPdfSchemaError(result.error)) {
      result = await window.supabaseClient
        .from(RECOGNIZED_TABLE)
        .select('id, org_name, adviser_name, date_established, logo_url, logo_path, chart_url, chart_path, image_url, image_path, pdf_url, pdf_path, pdf_mime, created_at, updated_at')
        .order('created_at', { ascending: false });
    }

    const { data, error } = result;

    if (error) {
      throw error;
    }

    recognizedState.records = data || [];
    renderRecognizedOrganizations();
  } catch (error) {
    console.error('Failed to load recognized organizations:', error);
    grid.innerHTML = '<div class="recognized-empty-state">Failed to load recognized organizations.</div>';
  }
}

function renderRecognizedOrganizations() {
  const grid = recognizedElements.grid;
  if (!grid) return;

  if (recognizedState.records.length === 0) {
    grid.innerHTML = '<div class="recognized-empty-state">No recognized organizations published yet.</div>';
    return;
  }

  grid.innerHTML = recognizedState.records.map((record) => {
    const logoUrl = resolveImageUrl(record.logo_url, record.logo_path, record.chart_url, record.chart_path, record.image_url, record.image_path);
    return `
      <article class="department-card recognized-card" data-id="${record.id}" tabindex="0" role="button" aria-label="Open ${escapeHtml(record.org_name)} details">
        <div class="recognized-logo-shell">
          <img class="recognized-logo" src="${escapeHtml(logoUrl)}" alt="${escapeHtml(record.org_name)} logo">
        </div>
        <div class="dept-name">${escapeHtml(record.org_name)}</div>
      </article>
    `;
  }).join('');

  grid.querySelectorAll('[data-id]').forEach((card) => {
    card.addEventListener('click', () => openRecognizedModal(card.dataset.id));
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openRecognizedModal(card.dataset.id);
      }
    });
  });
}

function cacheElements() {
  recognizedElements.grid = document.getElementById('recognizedOrganizationsGrid');
  recognizedElements.modal = document.getElementById('recognizedModal');
  recognizedElements.modalBody = document.getElementById('recognizedModalBody');
  recognizedElements.modalClose = document.getElementById('recognizedModalClose');
}

function bindEvents() {
  recognizedElements.modalClose?.addEventListener('click', closeRecognizedModal);
  recognizedElements.modal?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === 'true') {
      closeRecognizedModal();
    }
  });

  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeRecognizedModal();
    }
  });
}

function openRecognizedModal(recordId) {
  const record = recognizedState.records.find((item) => String(item.id) === String(recordId));
  if (!record || !recognizedElements.modal || !recognizedElements.modalBody) {
    return;
  }

  lastFocusedCard = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const chartUrl = resolveImageUrl(record.chart_url, record.chart_path, record.image_url, record.image_path, record.logo_url, record.logo_path);
  const established = formatEstablishedYear(record.date_established);
  const adviser = record.adviser_name ? escapeHtml(record.adviser_name) : 'Adviser not provided';
  const pdfEntries = getPdfEntries(record);
  const pdfMarkup = pdfEntries.length > 0
    ? pdfEntries.map((pdf, index) => `
        <a class="recognized-link" href="${escapeHtml(pdf.url)}" target="_blank" rel="noopener noreferrer">
          View Accomplishment Report${pdfEntries.length > 1 ? ` ${index + 1}` : ''}
        </a>
      `).join('')
    : '<span class="recognized-link recognized-link-disabled">No accomplishment report uploaded</span>';

  recognizedElements.modalBody.innerHTML = `
    <div class="recognized-modal-header">
      <div>
        <h2 class="recognized-modal-title" id="recognizedModalTitle">${escapeHtml(record.org_name)}</h2>
        <p class="recognized-modal-subtitle">Recognized student organization</p>
      </div>
    </div>
    <div class="recognized-modal-chart-wrap">
      <img class="recognized-modal-chart" src="${escapeHtml(chartUrl)}" alt="${escapeHtml(record.org_name)} organization chart">
    </div>
    <div class="recognized-modal-details">
      <div class="recognized-detail-card">
        <span class="recognized-detail-label">Year Established</span>
        <span class="recognized-detail-value">${escapeHtml(established)}</span>
      </div>
      <div class="recognized-detail-card">
        <span class="recognized-detail-label">Adviser</span>
        <span class="recognized-detail-value">${adviser}</span>
      </div>
    </div>
    <div class="recognized-modal-actions">
      <span class="recognized-detail-label">Accomplishment Report</span>
      <div>${pdfMarkup}</div>
    </div>
  `;

  recognizedElements.modal.hidden = false;
  recognizedElements.modal.inert = false;
  recognizedElements.modal.classList.add('is-open');
  document.body.classList.add('recognized-modal-open');
  recognizedElements.modalClose?.focus();
}

function getPdfEntries(record) {
  if (!record) {
    return [];
  }

  const urls = Array.isArray(record.pdf_urls) ? record.pdf_urls : [];
  const paths = Array.isArray(record.pdf_paths) ? record.pdf_paths : [];
  const mimes = Array.isArray(record.pdf_mimes) ? record.pdf_mimes : [];
  const names = Array.isArray(record.pdf_names) ? record.pdf_names : [];
  const entries = [];
  const maxLength = Math.max(urls.length, paths.length, mimes.length, names.length);

  for (let index = 0; index < maxLength; index += 1) {
    const path = paths[index] || '';
    const url = urls[index] || buildStoragePublicUrl(path) || '';
    if (!url && !path) {
      continue;
    }

    entries.push({
      url,
      path,
      mime: mimes[index] || 'application/pdf',
      name: names[index] || `PDF ${index + 1}`
    });
  }

  if (entries.length > 0) {
    return entries;
  }

  if (record.pdf_url || record.pdf_path) {
    return [{
      url: record.pdf_url || buildStoragePublicUrl(record.pdf_path) || '',
      path: record.pdf_path || '',
      mime: record.pdf_mime || 'application/pdf',
      name: 'PDF 1'
    }];
  }

  return [];
}

function isMissingMultiPdfSchemaError(error) {
  return Boolean(
    error?.code === 'PGRST204'
    && /pdf_urls|pdf_paths|pdf_mimes|pdf_names/i.test(String(error?.message || ''))
  );
}

function closeRecognizedModal() {
  if (!recognizedElements.modal) {
    return;
  }

  const focusTarget = lastFocusedCard;

  recognizedElements.modal.classList.remove('is-open');
  recognizedElements.modal.inert = true;
  recognizedElements.modal.hidden = true;
  document.body.classList.remove('recognized-modal-open');

  if (focusTarget && typeof focusTarget.focus === 'function') {
    focusTarget.focus();
  }
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
    return 'Year not provided';
  }

  const normalized = String(value).slice(0, 4);
  return /^\d{4}$/.test(normalized) ? normalized : String(value);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
