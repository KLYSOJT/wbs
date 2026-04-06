const USER_LEARNING_MATERIALS_TABLE = 'learning_materials';

const USER_SUBJECT_ICON_MAP = {
  ENGLISH: 'fas fa-book',
  ESP: 'fas fa-heart',
  FILIPINO: 'fas fa-language',
  MATH: 'fas fa-square-root-alt',
  SCIENCE: 'fas fa-flask',
  'MUSIC & ARTS': 'fas fa-music',
  'PE & HEALTH': 'fas fa-heart-pulse',
  SPJ: 'fas fa-microphone-lines',
  TLE: 'fas fa-tools',
  SPSTEM: 'fas fa-atom',
  SPA: 'fas fa-palette',
  AP: 'fas fa-landmark',
  'VALUES EDUCATION': 'fas fa-heart'
};

document.addEventListener('DOMContentLoaded', () => {
  initializeLearningMaterialsPage();
});

async function initializeLearningMaterialsPage() {
  const grade = detectCurrentGrade();
  const folderList = document.getElementById('subjectFolders');
  const filesGrid = document.getElementById('filesGrid');
  const filesLabel = document.getElementById('filesLabel');
  const filesCount = document.getElementById('filesCount');

  if (!grade || !folderList || !filesGrid || !filesLabel || !filesCount) {
    return;
  }

  renderLoadingState(folderList, filesGrid, filesLabel, filesCount);

  if (!window.supabaseClient) {
    renderEmptyState(folderList, filesGrid, filesLabel, filesCount, 'Learning materials are unavailable right now.');
    return;
  }

  try {
    const { data, error } = await window.supabaseClient
      .from(USER_LEARNING_MATERIALS_TABLE)
      .select('id, grade_level, subject_name, file_name, file_url, storage_path, created_at')
      .eq('grade_level', grade)
      .order('subject_name', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) throw error;

    const groupedSubjects = groupBySubject(data || []);
    const subjectKeys = Object.keys(groupedSubjects);

    if (!subjectKeys.length) {
      renderEmptyState(folderList, filesGrid, filesLabel, filesCount, `No learning materials found for ${grade}.`);
      return;
    }

    renderFolders(folderList, groupedSubjects, subjectKeys[0]);
    renderSubjectFiles(groupedSubjects, subjectKeys[0], filesGrid, filesLabel, filesCount);

    folderList.addEventListener('click', (event) => {
      const button = event.target.closest('.folder-button');
      if (!button) return;

      const subjectKey = button.dataset.subject;
      setActiveFolder(folderList, subjectKey);
      renderSubjectFiles(groupedSubjects, subjectKey, filesGrid, filesLabel, filesCount);
    });
  } catch (error) {
    console.error('Failed to load user learning materials:', error);
    renderEmptyState(folderList, filesGrid, filesLabel, filesCount, 'Failed to load learning materials.');
  }
}

function detectCurrentGrade() {
  const explicitGrade = document.querySelector('[data-grade]')?.getAttribute('data-grade');
  if (explicitGrade) return explicitGrade;

  const titleMatch = document.title.match(/Grade\s+\d+/i);
  if (titleMatch) return titleMatch[0].replace(/\s+/, ' ');

  const headingMatch = document.querySelector('.hero-panel-badge, .grade-hero-panel')?.textContent?.match(/Grade\s+\d+/i);
  if (headingMatch) return headingMatch[0].replace(/\s+/, ' ');

  return '';
}

function groupBySubject(records) {
  return records.reduce((accumulator, record) => {
    const subjectLabel = normalizeSubjectLabel(record.subject_name);
    const subjectKey = slugify(subjectLabel);
    const publicUrl = record.file_url || getPublicUrl(record.storage_path);

    if (!accumulator[subjectKey]) {
      accumulator[subjectKey] = {
        label: `${subjectLabel} Folder`,
        subject: subjectLabel,
        files: []
      };
    }

    accumulator[subjectKey].files.push({
      id: record.id,
      href: publicUrl,
      name: record.file_name || extractFileName(record.file_url || record.storage_path),
      label: 'PDF Document',
      type: 'pdf'
    });

    return accumulator;
  }, {});
}

function renderFolders(folderList, groupedSubjects, activeKey) {
  folderList.innerHTML = Object.entries(groupedSubjects).map(([subjectKey, subjectGroup]) => {
    const isActive = subjectKey === activeKey;
    const iconClass = USER_SUBJECT_ICON_MAP[subjectGroup.subject] || 'fas fa-folder-open';

    return `
      <li class="folder${isActive ? ' active' : ''}">
        <button type="button" class="folder-button" data-subject="${escapeAttribute(subjectKey)}" aria-pressed="${isActive}">
          <span class="folder-ic"><i class="${escapeAttribute(iconClass)}"></i></span>
          <span>${escapeHtml(subjectGroup.subject)}</span>
        </button>
      </li>
    `;
  }).join('');
}

function setActiveFolder(folderList, activeKey) {
  folderList.querySelectorAll('.folder').forEach((folder) => {
    const button = folder.querySelector('.folder-button');
    const isActive = button?.dataset.subject === activeKey;
    folder.classList.toggle('active', isActive);
    button?.setAttribute('aria-pressed', String(isActive));
  });
}

function renderSubjectFiles(groupedSubjects, subjectKey, filesGrid, filesLabel, filesCount) {
  const subjectGroup = groupedSubjects[subjectKey];
  if (!subjectGroup) return;

  filesLabel.textContent = subjectGroup.label;
  filesCount.textContent = `${subjectGroup.files.length} file${subjectGroup.files.length === 1 ? '' : 's'}`;

  filesGrid.innerHTML = subjectGroup.files.map((file) => `
    <article class="file-card">
      <a class="file-link" href="${escapeAttribute(file.href)}" target="_blank" rel="noopener noreferrer">
        <div class="file-doc">
          <i class="fas fa-file-pdf pdf-file-icon"></i>
        </div>
        <div class="file-copy">
          <span class="file-type">${escapeHtml(file.label)}</span>
          <div class="file-name">${escapeHtml(file.name)}</div>
        </div>
      </a>
    </article>
  `).join('');
}

function renderLoadingState(folderList, filesGrid, filesLabel, filesCount) {
  folderList.innerHTML = `
    <li class="folder active">
      <button type="button" class="folder-button" aria-pressed="true">
        <span class="folder-ic"><i class="fas fa-spinner fa-spin"></i></span>
        <span>Loading...</span>
      </button>
    </li>
  `;

  filesLabel.textContent = 'Loading Folder';
  filesCount.textContent = '0 files';
  filesGrid.innerHTML = `
    <article class="file-card empty-state-card">
      <div class="file-link empty-state-link">
        <div class="file-copy">
          <span class="file-type">Please wait</span>
          <div class="file-name">Loading learning materials...</div>
        </div>
      </div>
    </article>
  `;
}

function renderEmptyState(folderList, filesGrid, filesLabel, filesCount, message) {
  folderList.innerHTML = `
    <li class="folder active">
      <button type="button" class="folder-button" aria-pressed="true">
        <span class="folder-ic"><i class="fas fa-folder-open"></i></span>
        <span>No folders yet</span>
      </button>
    </li>
  `;

  filesLabel.textContent = 'Learning Materials';
  filesCount.textContent = '0 files';
  filesGrid.innerHTML = `
    <article class="file-card empty-state-card">
      <div class="file-link empty-state-link">
        <div class="file-copy">
          <span class="file-type">No files available</span>
          <div class="file-name">${escapeHtml(message)}</div>
        </div>
      </div>
    </article>
  `;
}

function normalizeSubjectLabel(subject) {
  return String(subject || '')
    .trim()
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function getPublicUrl(path) {
  if (!path || !window.supabaseClient?.storage) return '#';

  const { data } = window.supabaseClient.storage
    .from('learning-materials-files')
    .getPublicUrl(path);

  return data?.publicUrl || '#';
}

function extractFileName(path) {
  if (!path) return 'View file';

  try {
    return decodeURIComponent(String(path).split('/').pop() || 'View file');
  } catch (error) {
    return 'View file';
  }
}

function slugify(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
  return escapeHtml(value);
}
