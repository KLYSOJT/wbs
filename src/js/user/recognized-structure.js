const RECOGNIZED_TABLE = 'recognized-structure';

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
    const { data, error } = await window.supabaseClient
      .from(RECOGNIZED_TABLE)
      .select('id, org_name, adviser_name, date_established, logo_url, chart_url, image_url, pdf_url, created_at, updated_at')
      .order('created_at', { ascending: false });

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
    const chartUrl = record.chart_url || record.image_url || '';
    return `
      <article class="department-card recognized-card" data-id="${record.id}" tabindex="0" role="button" aria-label="Open ${escapeHtml(record.org_name)} details">
        <div class="recognized-logo-shell">
          <img class="recognized-logo" src="${escapeHtml(record.logo_url || '')}" alt="${escapeHtml(record.org_name)} logo">
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

  const chartUrl = record.chart_url || record.image_url || '';
  const established = record.date_established ? formatDate(record.date_established) : 'Date not provided';
  const adviser = record.adviser_name ? escapeHtml(record.adviser_name) : 'Adviser not provided';
  const pdfMarkup = record.pdf_url
    ? `<a class="recognized-link" href="${escapeHtml(record.pdf_url)}" target="_blank" rel="noopener noreferrer">View Accomplishment Report</a>`
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
        <span class="recognized-detail-label">Date Established</span>
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

function formatDate(value) {
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
