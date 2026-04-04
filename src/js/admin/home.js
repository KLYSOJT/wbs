const ANV_BUCKET = 'anv-files';
const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 20 * 1024 * 1024;
const ADMIN_FEED_LIMIT = 24;

document.addEventListener('DOMContentLoaded', () => {
  initAdminHome().catch((error) => {
    console.error('Admin home initialization failed:', error);
  });
});

async function initAdminHome() {
  if (!window.supabaseClient) {
    window.alert('Supabase is not available right now.');
    return;
  }

  cacheInputDetails();
  bindAnnouncementHandlers();
  bindNewsHandlers();
  bindVideoHandlers();

  await Promise.all([
    loadAnnouncements(),
    loadNews(),
    loadVideos()
  ]);
}

function cacheInputDetails() {
  const announcementInput = document.getElementById('announcementImage');
  const newsInput = document.getElementById('newsImage');
  const videoInput = document.getElementById('videoFile');

  announcementInput?.addEventListener('change', () => {
    updateFileDetails('announcementImage', 'announcementImageDetails');
  });

  newsInput?.addEventListener('change', () => {
    updateFileDetails('newsImage', 'newsImageDetails');
  });

  videoInput?.addEventListener('change', () => {
    updateFileDetails('videoFile', 'videoFileDetails');
  });
}

function updateFileDetails(inputId, targetId) {
  const input = document.getElementById(inputId);
  const target = document.getElementById(targetId);
  if (!input || !target) return;

  const file = input.files?.[0];
  if (!file) {
    target.textContent = 'No file chosen';
    return;
  }

  const sizeMb = (file.size / 1024 / 1024).toFixed(2);
  target.textContent = `${file.name} (${sizeMb} MB)`;
}

function bindAnnouncementHandlers() {
  const form = document.getElementById('announcementForm');
  const fileInput = document.getElementById('announcementImage');
  const textInput = document.getElementById('announcementText');
  const list = document.getElementById('announcementList');

  if (!form || !fileInput || !textInput || !list) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const text = textInput.value.trim();
    const file = fileInput.files?.[0] || null;

    if (!text) {
      window.alert('Please enter announcement text.');
      return;
    }

    if (file && !isValidImage(file)) {
      window.alert('Please upload a valid image file under 10 MB.');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    setSubmitState(submitButton, true, 'Publishing...');

    let uploadResult = null;

    try {
      if (file) {
        uploadResult = await uploadBucketFile(file, 'announcements');
      }

      await saveAnnouncementToSupabase({
        id: Date.now(),
        text,
        image: uploadResult?.publicUrl || null,
        timestamp: new Date().toISOString()
      });

      form.reset();
      updateFileDetails('announcementImage', 'announcementImageDetails');
      await loadAnnouncements();
    } catch (error) {
      if (uploadResult?.path) {
        await deleteStorageObject(uploadResult.path).catch(() => {});
      }
      console.error('Error saving announcement:', error);
      window.alert(`Failed to save announcement: ${error.message}`);
    } finally {
      setSubmitState(submitButton, false);
    }
  });
}

function bindNewsHandlers() {
  const form = document.getElementById('newsForm');
  const fileInput = document.getElementById('newsImage');
  const textInput = document.getElementById('newsText');
  const list = document.getElementById('newsList');

  if (!form || !fileInput || !textInput || !list) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const text = textInput.value.trim();
    const file = fileInput.files?.[0] || null;

    if (!text) {
      window.alert('Please enter news text.');
      return;
    }

    if (file && !isValidImage(file)) {
      window.alert('Please upload a valid image file under 10 MB.');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    setSubmitState(submitButton, true, 'Publishing...');

    let uploadResult = null;

    try {
      if (file) {
        uploadResult = await uploadBucketFile(file, 'news');
      }

      await saveNewsToSupabase({
        id: Date.now(),
        text,
        image: uploadResult?.publicUrl || null,
        timestamp: new Date().toISOString()
      });

      form.reset();
      updateFileDetails('newsImage', 'newsImageDetails');
      await loadNews();
    } catch (error) {
      if (uploadResult?.path) {
        await deleteStorageObject(uploadResult.path).catch(() => {});
      }
      console.error('Error saving news:', error);
      window.alert(`Failed to save news: ${error.message}`);
    } finally {
      setSubmitState(submitButton, false);
    }
  });
}

function bindVideoHandlers() {
  const form = document.getElementById('videoForm');
  const titleInput = document.getElementById('videoTitle');
  const typeRadios = document.querySelectorAll('input[name="videoType"]');
  const fileInput = document.getElementById('videoFile');
  const fileDetails = document.getElementById('videoFileDetails');
  const urlInput = document.getElementById('videoUrl');
  const list = document.getElementById('videoList');

  if (!form || !titleInput || !fileInput || !fileDetails || !urlInput || !list) return;

  const syncVideoSourceFields = () => {
    const selectedType = document.querySelector('input[name="videoType"]:checked')?.value || 'file';
    const isFile = selectedType === 'file';
    fileInput.style.display = isFile ? 'block' : 'none';
    fileDetails.style.display = isFile ? 'block' : 'none';
    urlInput.style.display = isFile ? 'none' : 'block';
    fileInput.required = isFile;
    urlInput.required = !isFile;
  };

  typeRadios.forEach((radio) => {
    radio.addEventListener('change', syncVideoSourceFields);
  });

  syncVideoSourceFields();

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const selectedType = document.querySelector('input[name="videoType"]:checked')?.value || 'file';

    if (!title) {
      window.alert('Please enter a video title.');
      return;
    }

    const submitButton = form.querySelector('button[type="submit"]');
    setSubmitState(submitButton, true, 'Uploading...');

    let uploadResult = null;

    try {
      const payload = {
        id: Date.now(),
        title,
        type: selectedType,
        timestamp: new Date().toISOString(),
        url: '',
        fileName: null
      };

      if (selectedType === 'file') {
        const file = fileInput.files?.[0];
        if (!file) {
          throw new Error('Please select a video file.');
        }

        if (!isValidVideo(file)) {
          throw new Error('Please upload a valid video file under 20 MB. For larger videos, use the Video URL option instead.');
        }

        uploadResult = await uploadBucketFile(file, 'videos');
        payload.url = uploadResult.publicUrl;
        payload.fileName = file.name;
      } else {
        const url = urlInput.value.trim();
        if (!url) {
          throw new Error('Please enter a video URL.');
        }
        payload.url = url;
      }

      await saveVideoToSupabase(payload);

      form.reset();
      document.querySelector('input[name="videoType"][value="file"]').checked = true;
      syncVideoSourceFields();
      updateFileDetails('videoFile', 'videoFileDetails');
      await loadVideos();
    } catch (error) {
      if (uploadResult?.path) {
        await deleteStorageObject(uploadResult.path).catch(() => {});
      }
      console.error('Error saving video:', error);
      window.alert(`Failed to save video: ${error.message}`);
    } finally {
      setSubmitState(submitButton, false);
    }
  });
}

async function loadAnnouncements() {
  const list = document.getElementById('announcementList');
  if (!list) return;

  list.innerHTML = '<div class="loading">Loading announcements...</div>';

  try {
    const records = await loadAnnouncementsFromSupabase({
      limit: ADMIN_FEED_LIMIT,
      includeImage: false
    });
    if (records.length === 0) {
      list.innerHTML = '<div class="empty-state">No announcements uploaded yet.</div>';
      return;
    }

    list.innerHTML = '';
    records.forEach((record) => {
      displayAnnouncement({
        id: record.id,
        text: record.announcement_posts,
        image: null,
        timestamp: record.timestamp
      }, list);
    });
  } catch (error) {
    console.error('Error loading announcements:', error);
    list.innerHTML = '<div class="error">Failed to load announcements. Please refresh.</div>';
  }
}

async function loadNews() {
  const list = document.getElementById('newsList');
  if (!list) return;

  list.innerHTML = '<div class="loading">Loading news...</div>';

  try {
    const records = await loadNewsFromSupabase({
      limit: ADMIN_FEED_LIMIT,
      includeImage: false
    });
    if (records.length === 0) {
      list.innerHTML = '<div class="empty-state">No news uploaded yet.</div>';
      return;
    }

    list.innerHTML = '';
    records.forEach((record) => {
      displayNews({
        id: record.id,
        text: record.news_posts,
        image: null,
        timestamp: record.timestamp
      }, list);
    });
  } catch (error) {
    console.error('Error loading news:', error);
    list.innerHTML = '<div class="error">Failed to load news. Please refresh.</div>';
  }
}

async function loadVideos() {
  const list = document.getElementById('videoList');
  if (!list) return;

  list.innerHTML = '<div class="loading">Loading videos...</div>';

  try {
    const records = await loadVideosFromSupabase();
    if (records.length === 0) {
      list.innerHTML = '<div class="empty-state">No videos uploaded yet.</div>';
      return;
    }

    list.innerHTML = '';
    records.forEach((record) => {
      displayVideo(record, list);
    });
  } catch (error) {
    console.error('Error loading videos:', error);
    list.innerHTML = '<div class="error">Failed to load videos. Please refresh.</div>';
  }
}

function displayAnnouncement(announcementData, announcementList) {
  const announcementCard = document.createElement('div');
  announcementCard.className = 'announcement-card';
  announcementCard.id = `announcement-${announcementData.id}`;

  const fileDetails = announcementData.image
    ? `<small>Image: ${escapeHtml(extractFileNameFromUrl(announcementData.image))}</small>`
    : '<small>Image preview unavailable in feed</small>';

  announcementCard.innerHTML = `
    <div class="announcement-card-header">
      <button type="button" class="delete-btn" onclick="deleteAnnouncement(${announcementData.id}, '${escapeHtmlJs(announcementData.image || '')}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    ${announcementData.image ? `<img src="${announcementData.image}" alt="Announcement" class="announcement-card-image">` : ''}
    <div class="announcement-card-body">
      <p>${escapeHtml(announcementData.text)}</p>
    </div>
    <div class="announcement-card-footer">
      <small>Published: ${escapeHtml(formatAdminDate(announcementData.timestamp))}</small>
      ${fileDetails}
    </div>
  `;

  announcementList.appendChild(announcementCard);
}

function displayNews(newsData, newsList) {
  const newsCard = document.createElement('div');
  newsCard.className = 'news-card';
  newsCard.id = `news-${newsData.id}`;

  const fileDetails = newsData.image
    ? `<small>Image: ${escapeHtml(extractFileNameFromUrl(newsData.image))}</small>`
    : '<small>Image preview unavailable in feed</small>';

  newsCard.innerHTML = `
    <div class="news-card-header">
      <button type="button" class="delete-btn" onclick="deleteNews(${newsData.id}, '${escapeHtmlJs(newsData.image || '')}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    ${newsData.image ? `<img src="${newsData.image}" alt="News" class="news-card-image">` : ''}
    <div class="news-card-body">
      <p>${escapeHtml(newsData.text)}</p>
    </div>
    <div class="news-card-footer">
      <small>Published: ${escapeHtml(formatAdminDate(newsData.timestamp))}</small>
      ${fileDetails}
    </div>
  `;

  newsList.appendChild(newsCard);
}

function displayVideo(videoData, videoList) {
  const videoCard = document.createElement('div');
  videoCard.className = 'video-card';
  videoCard.id = `video-${videoData.id}`;

  const previewMarkup = buildAdminVideoPreview(videoData);
  const fileDetail = videoData.type === 'file'
    ? `<small>File: ${escapeHtml(videoData.fileName || extractFileNameFromUrl(videoData.url || ''))}</small>`
    : `<small>URL: ${escapeHtml(videoData.url || 'N/A')}</small>`;

  videoCard.innerHTML = `
    <div class="video-card-header">
      <h3>${escapeHtml(videoData.title || 'Untitled Video')}</h3>
      <button type="button" class="delete-btn" onclick="deleteVideo(${videoData.id}, '${escapeHtmlJs(videoData.url || '')}', '${escapeHtmlJs(videoData.type || '')}')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
    <div class="video-card-body">${previewMarkup}</div>
    <div class="video-card-footer">
      <small>Uploaded: ${escapeHtml(formatAdminDate(videoData.timestamp))}</small>
      ${fileDetail}
      <small>Source: ${escapeHtml(videoData.type || 'file')}</small>
    </div>
  `;

  videoList.appendChild(videoCard);
}

function buildAdminVideoPreview(videoData) {
  const source = resolveAdminVideoSource(videoData);

  if (source.kind === 'embed') {
    return `
      <iframe width="100%" height="250" src="${source.url}"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    `;
  }

  return `
    <video width="100%" height="auto" controls>
      <source src="${source.url}" type="${source.mimeType}">
      Your browser does not support the video tag.
    </video>
  `;
}

function resolveAdminVideoSource(videoData) {
  const url = (videoData?.url || '').trim();
  const youtubeId = extractYouTubeVideoId(url);

  if (youtubeId) {
    return {
      kind: 'embed',
      url: `https://www.youtube.com/embed/${youtubeId}`
    };
  }

  const driveId = extractGoogleDriveFileId(url);
  if (driveId) {
    return {
      kind: 'embed',
      url: `https://drive.google.com/file/d/${driveId}/preview`
    };
  }

  return {
    kind: 'video',
    url,
    mimeType: guessVideoMimeType(url)
  };
}

window.deleteAnnouncement = async function deleteAnnouncement(id, imageUrl) {
  if (!window.confirm('Are you sure you want to delete this announcement?')) return;

  try {
    if (imageUrl) {
      await deleteStorageUrl(imageUrl);
    }
    await deleteAnnouncementFromSupabase(id);
    await loadAnnouncements();
  } catch (error) {
    console.error('Error deleting announcement:', error);
    window.alert(`Failed to delete announcement: ${error.message}`);
  }
};

window.deleteNews = async function deleteNews(id, imageUrl) {
  if (!window.confirm('Are you sure you want to delete this news?')) return;

  try {
    if (imageUrl) {
      await deleteStorageUrl(imageUrl);
    }
    await deleteNewsFromSupabase(id);
    await loadNews();
  } catch (error) {
    console.error('Error deleting news:', error);
    window.alert(`Failed to delete news: ${error.message}`);
  }
};

window.deleteVideo = async function deleteVideo(id, url, type) {
  if (!window.confirm('Are you sure you want to delete this video?')) return;

  try {
    if (type === 'file' && url) {
      await deleteStorageUrl(url);
    }
    await deleteVideoFromSupabase(id);
    await loadVideos();
  } catch (error) {
    console.error('Error deleting video:', error);
    window.alert(`Failed to delete video: ${error.message}`);
  }
};

async function uploadBucketFile(file, folder) {
  const safeName = (file.name || 'file').replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${folder}/${Date.now()}-${safeName}`;

  const { error } = await window.supabaseClient.storage
    .from(ANV_BUCKET)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
      contentType: file.type || undefined
    });

  if (error) {
    throw error;
  }

  const { data } = window.supabaseClient.storage
    .from(ANV_BUCKET)
    .getPublicUrl(filePath);

  return {
    path: filePath,
    publicUrl: data?.publicUrl || ''
  };
}

async function deleteStorageUrl(publicUrl) {
  const path = extractBucketPath(publicUrl);
  if (!path) return;
  await deleteStorageObject(path);
}

async function deleteStorageObject(path) {
  const { error } = await window.supabaseClient.storage
    .from(ANV_BUCKET)
    .remove([path]);

  if (error) {
    throw error;
  }
}

function extractBucketPath(publicUrl) {
  if (!publicUrl || !publicUrl.includes(`/${ANV_BUCKET}/`)) {
    return '';
  }

  return publicUrl.split(`/${ANV_BUCKET}/`)[1]?.split('?')[0] || '';
}

function isValidImage(file) {
  return Boolean(file && file.type.startsWith('image/') && file.size <= MAX_IMAGE_SIZE);
}

function isValidVideo(file) {
  return Boolean(file && file.type.startsWith('video/') && file.size <= MAX_VIDEO_SIZE);
}

function setSubmitState(button, isBusy, busyText = '') {
  if (!button) return;
  if (!button.dataset.defaultText) {
    button.dataset.defaultText = button.textContent;
  }
  button.disabled = isBusy;
  button.textContent = isBusy ? busyText : button.dataset.defaultText;
}

function formatAdminDate(value) {
  if (!value) return 'Date unavailable';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return String(value);
  }

  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
}

function extractFileNameFromUrl(url) {
  if (!url) return 'Unknown file';

  try {
    const cleanUrl = url.split('?')[0];
    const lastSegment = cleanUrl.split('/').pop() || 'Unknown file';
    return decodeURIComponent(lastSegment);
  } catch (error) {
    return 'Unknown file';
  }
}

function extractYouTubeVideoId(url) {
  if (!url) return '';

  const watchMatch = url.match(/[?&]v=([^&#]+)/i);
  if (watchMatch?.[1]) return watchMatch[1];

  const shortMatch = url.match(/youtu\.be\/([^?&#/]+)/i);
  if (shortMatch?.[1]) return shortMatch[1];

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#/]+)/i);
  if (embedMatch?.[1]) return embedMatch[1];

  return '';
}

function extractGoogleDriveFileId(url) {
  if (!url || !/drive\.google\.com/i.test(url)) return '';

  const fileMatch = url.match(/\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) return fileMatch[1];

  const idMatch = url.match(/[?&]id=([^&#]+)/i);
  if (idMatch?.[1]) return idMatch[1];

  return '';
}

function guessVideoMimeType(url) {
  const normalized = (url || '').toLowerCase();
  if (normalized.includes('.webm')) return 'video/webm';
  if (normalized.includes('.ogg')) return 'video/ogg';
  if (normalized.includes('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function escapeHtmlJs(value) {
  return String(value || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'");
}
