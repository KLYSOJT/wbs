const RECOGNIZED_TABLE = 'recognized-structure';

const recognizedState = {
  records: []
};

document.addEventListener('DOMContentLoaded', initRecognizedOrganizations);

async function initRecognizedOrganizations() {
  const grid = document.getElementById('recognizedOrganizationsGrid');
  if (!grid) return;

  if (!window.supabaseClient) {
    grid.innerHTML = '<div class="recognized-empty-state">Supabase is not available right now.</div>';
    return;
  }

  try {
    const { data, error } = await window.supabaseClient
      .from(RECOGNIZED_TABLE)
      .select('id, org_name, adviser_name, date_established, image_url, pdf_url, created_at, updated_at')
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
  const grid = document.getElementById('recognizedOrganizationsGrid');
  if (!grid) return;

  if (recognizedState.records.length === 0) {
    grid.innerHTML = '<div class="recognized-empty-state">No recognized organizations published yet.</div>';
    return;
  }

  grid.innerHTML = recognizedState.records.map((record) => {
    const established = record.date_established ? formatDate(record.date_established) : 'Date not provided';
    const adviser = record.adviser_name ? escapeHtml(record.adviser_name) : 'Adviser not provided';
    const pdfMarkup = record.pdf_url
      ? `<a class="recognized-link" href="${escapeHtml(record.pdf_url)}" target="_blank" rel="noopener noreferrer">View PDF</a>`
      : '<span class="recognized-link recognized-link-disabled">No PDF</span>';

    return `
      <article class="department-card recognized-card">
        <img src="${escapeHtml(record.image_url || '')}" alt="${escapeHtml(record.org_name)}">
        <div class="dept-name">${escapeHtml(record.org_name)}</div>
        <div class="recognized-meta">
          <p><strong>Established:</strong> ${escapeHtml(established)}</p>
          <p><strong>Adviser:</strong> ${adviser}</p>
          <div class="recognized-actions">${pdfMarkup}</div>
        </div>
      </article>
    `;
  }).join('');
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
