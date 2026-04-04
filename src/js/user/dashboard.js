  // Carousel Functions
  let currentCarouselIndex = 1;
  
  function changeSlide(n) {
    showSlide(currentCarouselIndex += n);
  }
  
  function currentSlide(n) {
    showSlide(currentCarouselIndex = n);
  }
  
  function showSlide(n) {
    const slides = document.querySelectorAll(".carousel-item");
    const indicators = document.querySelectorAll(".indicator");
    
    // Add safety checks - return if no slides or indicators exist
    if (slides.length === 0 || indicators.length === 0) {
      return;
    }
    
    if (n > slides.length) {
      currentCarouselIndex = 1;
    }
    if (n < 1) {
      currentCarouselIndex = slides.length;
    }
    
    // Safety check - ensure index is within bounds
    if (currentCarouselIndex < 1 || currentCarouselIndex > slides.length) {
      return;
    }
    
    slides.forEach(slide => slide.classList.remove("active"));
    indicators.forEach(indicator => indicator.classList.remove("active"));
    
    slides[currentCarouselIndex - 1].classList.add("active");
    indicators[currentCarouselIndex - 1].classList.add("active");
  }
  
  // Auto-advance carousel every 5 seconds  
  setInterval(() => {
    changeSlide(1);
  }, 5000);


// User Dashboard - Load Announcements + News from Supabase
document.addEventListener('DOMContentLoaded', async function() {
  // Announcements with Pagination
  const announcementsGrid = document.getElementById('announcementsGrid');
  const paginationContainer = document.getElementById('paginationContainer');
  
  if (announcementsGrid) {
    announcementsGrid.innerHTML = '<div class="loading">Loading announcements...</div>';
    try {
      const announcements = await loadAnnouncementsFromSupabase({ limit: 24, includeImage: false });
      announcementsGrid.innerHTML = '';
      paginationContainer.innerHTML = '';

      const itemsPerPage = 3;
      let currentPage = 1;
      const totalPages = Math.ceil(announcements.length / itemsPerPage);

      // Function to display announcements for current page
      async function displayPage(page) {
        announcementsGrid.innerHTML = '';
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageAnnouncements = announcements.slice(startIndex, endIndex);
        const imageRows = await loadAnnouncementImagesFromSupabase(pageAnnouncements.map((item) => item.id));
        const imageMap = new Map(imageRows.map((item) => [item.id, item.image]));

        pageAnnouncements.forEach(announcement => {
          const resolvedImage = normalizeDashboardImage(imageMap.get(announcement.id));
          const announcementWithImage = {
            ...announcement,
            image: resolvedImage
          };

          // Extract title (first line or first 50 chars)
          const fullText = announcement.announcement_posts || '';
          const lines = fullText.split('\n');
          const title = lines[0].substring(0, 60) + (lines[0].length > 60 ? '...' : '');
          
          // Extract description (first 150 characters)
          const description = fullText.substring(0, 150) + (fullText.length > 150 ? '...' : '');
          
          // Format date
          const date = new Date(announcement.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          // Clone template
          const template = document.getElementById('announcementCardTemplate');
          const card = template.content.cloneNode(true);
          
          // Set image
          const imgElement = card.querySelector('.announcement-image img');
          imgElement.src = resolvedImage || buildContentPlaceholder('Announcement', 400, 250);
          
          // Set content
          card.querySelector('.announcement-date').textContent = date;
          card.querySelector('.announcement-title').textContent = title;
          card.querySelector('.announcement-description').textContent = description;
          card.querySelector('.read-more-btn').onclick = (e) => {
            e.stopPropagation();
            openAnnouncementModal(announcementWithImage);
          };
          
          // Get the card element (first child of template result)
          const cardElement = card.querySelector('.announcement-card');
          cardElement.style.cursor = 'pointer';
          cardElement.onclick = () => openAnnouncementModal(announcementWithImage);
          
          announcementsGrid.appendChild(card);
        });
      }

      // Function to update pagination
      function updatePagination() {
        paginationContainer.innerHTML = '';
        
        if (totalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn prev-btn';
        prevBtn.innerHTML = '&lt;&lt;';
        prevBtn.disabled = currentPage === 1;
        prevBtn.onclick = async () => {
          if (currentPage > 1) {
            currentPage--;
            await displayPage(currentPage);
            updatePagination();
          }
        };
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
          pageBtn.textContent = i;
          pageBtn.onclick = async () => {
            currentPage = i;
            await displayPage(currentPage);
            updatePagination();
          };
          paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn next-btn';
        nextBtn.innerHTML = '&gt;&gt;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = async () => {
          if (currentPage < totalPages) {
            currentPage++;
            await displayPage(currentPage);
            updatePagination();
          }
        };
        paginationContainer.appendChild(nextBtn);
      }

      if (announcements.length === 0) {
        announcementsGrid.innerHTML = '<p class="no-announcements">No announcements available.</p>';
      } else {
        await displayPage(currentPage);
        updatePagination();
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      announcementsGrid.innerHTML = '<p>Failed to load announcements.</p>';
    }
  }

  // News with Pagination
  const newsGrid = document.getElementById('newsGrid');
  const newsPaginationContainer = document.getElementById('newsPaginationContainer');
  
  if (newsGrid) {
    newsGrid.innerHTML = '<div class="loading">Loading news...</div>';
    try {
      const news = await loadNewsFromSupabase({ limit: 24, includeImage: false });
      newsGrid.innerHTML = '';
      newsPaginationContainer.innerHTML = '';

      const newsItemsPerPage = 3;
      let newsCurrentPage = 1;
      const newsTotalPages = Math.ceil(news.length / newsItemsPerPage);

      // Function to display news for current page
      async function displayNewsPage(page) {
        newsGrid.innerHTML = '';
        const startIndex = (page - 1) * newsItemsPerPage;
        const endIndex = startIndex + newsItemsPerPage;
        const pageNews = news.slice(startIndex, endIndex);
        const imageRows = await loadNewsImagesFromSupabase(pageNews.map((item) => item.id));
        const imageMap = new Map(imageRows.map((item) => [item.id, item.image]));

        pageNews.forEach(item => {
          const resolvedImage = normalizeDashboardImage(imageMap.get(item.id));
          const newsItemWithImage = {
            ...item,
            image: resolvedImage
          };

          // Extract title (first line or first 50 chars)
          const fullText = item.news_posts || '';
          const lines = fullText.split('\n');
          const title = lines[0].substring(0, 60) + (lines[0].length > 60 ? '...' : '');
          
          // Extract description (first 150 characters)
          const description = fullText.substring(0, 150) + (fullText.length > 150 ? '...' : '');
          
          // Format date
          const date = new Date(item.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          // Clone template
          const template = document.getElementById('newsCardTemplate');
          const card = template.content.cloneNode(true);
          
          // Set image
          const imgElement = card.querySelector('.news-image img');
          imgElement.src = resolvedImage || buildContentPlaceholder('News', 400, 250);
          
          // Set content
          card.querySelector('.news-date').textContent = date;
          card.querySelector('.news-title').textContent = title;
          card.querySelector('.news-description').textContent = description;
          card.querySelector('.read-more-btn').onclick = (e) => {
            e.stopPropagation();
            openNewsModal(newsItemWithImage);
          };
          
          // Get the card element
          const cardElement = card.querySelector('.news-card');
          cardElement.style.cursor = 'pointer';
          cardElement.onclick = () => openNewsModal(newsItemWithImage);
          
          newsGrid.appendChild(card);
        });
      }

      // Function to update news pagination
      function updateNewsPagination() {
        newsPaginationContainer.innerHTML = '';
        
        if (newsTotalPages <= 1) return;

        // Previous button
        const prevBtn = document.createElement('button');
        prevBtn.className = 'pagination-btn prev-btn';
        prevBtn.innerHTML = '&lt;&lt;';
        prevBtn.disabled = newsCurrentPage === 1;
        prevBtn.onclick = async () => {
          if (newsCurrentPage > 1) {
            newsCurrentPage--;
            await displayNewsPage(newsCurrentPage);
            updateNewsPagination();
          }
        };
        newsPaginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= newsTotalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'pagination-btn' + (i === newsCurrentPage ? ' active' : '');
          pageBtn.textContent = i;
          pageBtn.onclick = async () => {
            newsCurrentPage = i;
            await displayNewsPage(newsCurrentPage);
            updateNewsPagination();
          };
          newsPaginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn next-btn';
        nextBtn.innerHTML = '&gt;&gt;';
        nextBtn.disabled = newsCurrentPage === newsTotalPages;
        nextBtn.onclick = async () => {
          if (newsCurrentPage < newsTotalPages) {
            newsCurrentPage++;
            await displayNewsPage(newsCurrentPage);
            updateNewsPagination();
          }
        };
        newsPaginationContainer.appendChild(nextBtn);
      }

      if (news.length === 0) {
        newsGrid.innerHTML = '<p class="no-news">No news available.</p>';
      } else {
        await displayNewsPage(newsCurrentPage);
        updateNewsPagination();
      }
    } catch (error) {
      console.error('Error loading news:', error);
      newsGrid.innerHTML = '<p>Failed to load news.</p>';
    }
  }

  // Featured Videos
  const videoList = document.getElementById('videoList');
  const mainVideo = document.getElementById('mainVideo');
  const mainTitle = document.getElementById('mainTitle');
  const mainDesc = document.getElementById('mainDesc');
  const mainDate = document.getElementById('mainDate');

  if (videoList && mainVideo) {
    try {
      const videos = await loadVideosFromSupabase();
      videoList.innerHTML = '';

      if (videos.length > 0) {
        const firstVideo = videos[0];
        renderMainVideo(firstVideo, { mainTitle, mainDesc, mainDate });

        videos.forEach((video, index) => {
          const template = document.getElementById('videoCardTemplate');
          const cardNode = template.content.cloneNode(true);
          const thumbnailSrc = getVideoThumbnailUrl(video);
          
          const imgElement = cardNode.querySelector('img');
          imgElement.src = thumbnailSrc;
          imgElement.alt = video.title || 'Video thumbnail';
          cardNode.querySelector('p').textContent = video.title;
          
          const cardElement = cardNode.querySelector('.video-card-user');
          if (index === 0) {
            cardElement.classList.add('is-active');
          }
          cardElement.onclick = function() {
            renderMainVideo(video, { mainTitle, mainDesc, mainDate });
            videoList.querySelectorAll('.video-card-user').forEach((item) => {
              item.classList.remove('is-active');
            });
            cardElement.classList.add('is-active');
          };

          videoList.appendChild(cardNode);
        });
      } else {
        videoList.innerHTML = '<p>No videos available.</p>';
      }
    } catch (error) {
      console.error('Error loading videos:', error);
      videoList.innerHTML = '<p>Failed to load videos: ' + error.message + '</p>';
    }
  }
});

function renderMainVideo(video, elements) {
  const videoWrapper = document.querySelector('.video-wrapper');
  if (!videoWrapper) return;

  const source = resolveVideoSource(video);

  if (elements?.mainTitle) {
    elements.mainTitle.textContent = video.title || 'Untitled Video';
  }

  if (elements?.mainDesc) {
    elements.mainDesc.textContent = getVideoDescription(video, source);
  }

  if (elements?.mainDate) {
    elements.mainDate.textContent = formatVideoDate(video.timestamp);
  }

  if (source.kind === 'embed') {
    videoWrapper.innerHTML = `
      <iframe id="mainVideo"
        src="${source.url}"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen></iframe>
    `;
    return;
  }

  videoWrapper.innerHTML = `
    <video controls>
      <source src="${source.url}" type="${source.mimeType}">
      Your browser does not support the video tag.
    </video>
  `;
}

function resolveVideoSource(video) {
  const rawUrl = (video?.url || '').trim();

  if (!rawUrl) {
    return {
      kind: 'embed',
      url: 'about:blank',
      label: 'Unavailable'
    };
  }

  const youtubeId = extractYouTubeVideoId(rawUrl);
  if (youtubeId) {
    return {
      kind: 'embed',
      url: `https://www.youtube.com/embed/${youtubeId}`,
      label: 'YouTube'
    };
  }

  const driveId = extractGoogleDriveFileId(rawUrl);
  if (driveId) {
    return {
      kind: 'embed',
      url: `https://drive.google.com/file/d/${driveId}/preview`,
      label: 'Google Drive'
    };
  }

  if (video?.type === 'file' || isDirectVideoUrl(rawUrl) || rawUrl.startsWith('data:video/')) {
    return {
      kind: 'video',
      url: rawUrl,
      mimeType: guessVideoMimeType(rawUrl),
      label: 'Video File'
    };
  }

  return {
    kind: 'embed',
    url: rawUrl,
    label: 'External Video'
  };
}

function getVideoThumbnailUrl(video) {
  const rawUrl = (video?.url || '').trim();
  const youtubeId = extractYouTubeVideoId(rawUrl);

  if (youtubeId) {
    return `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`;
  }

  const driveId = extractGoogleDriveFileId(rawUrl);
  if (driveId) {
    return buildVideoPlaceholder('Google Drive');
  }

  if (video?.type === 'file' || isDirectVideoUrl(rawUrl) || rawUrl.startsWith('data:video/')) {
    return buildVideoPlaceholder('Video File');
  }

  return buildVideoPlaceholder('Featured Video');
}

function getVideoDescription(video, source) {
  if (source.label === 'Google Drive') {
    return 'Playing from Google Drive preview.';
  }

  if (source.label === 'YouTube') {
    return 'Playing from YouTube.';
  }

  if (source.label === 'Video File') {
    return video.fileName ? `Uploaded file: ${video.fileName}` : 'Playing uploaded video file.';
  }

  return 'Playing external video source.';
}

function formatVideoDate(timestamp) {
  if (!timestamp) {
    return 'Date unavailable';
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return String(timestamp);
  }

  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function extractYouTubeVideoId(url) {
  if (!url) return '';

  const watchMatch = url.match(/[?&]v=([^&#]+)/i);
  if (watchMatch?.[1]) {
    return watchMatch[1];
  }

  const shortMatch = url.match(/youtu\.be\/([^?&#/]+)/i);
  if (shortMatch?.[1]) {
    return shortMatch[1];
  }

  const embedMatch = url.match(/youtube\.com\/embed\/([^?&#/]+)/i);
  if (embedMatch?.[1]) {
    return embedMatch[1];
  }

  return '';
}

function extractGoogleDriveFileId(url) {
  if (!url || !/drive\.google\.com/i.test(url)) {
    return '';
  }

  const fileMatch = url.match(/\/file\/d\/([^/]+)/i);
  if (fileMatch?.[1]) {
    return fileMatch[1];
  }

  const ucMatch = url.match(/[?&]id=([^&#]+)/i);
  if (ucMatch?.[1]) {
    return ucMatch[1];
  }

  return '';
}

function isDirectVideoUrl(url) {
  return /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url || '');
}

function guessVideoMimeType(url) {
  const normalizedUrl = (url || '').toLowerCase();

  if (normalizedUrl.includes('.webm')) return 'video/webm';
  if (normalizedUrl.includes('.ogg')) return 'video/ogg';
  if (normalizedUrl.includes('.mov')) return 'video/quicktime';
  return 'video/mp4';
}

function buildVideoPlaceholder(label) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#5d0000"/>
          <stop offset="100%" stop-color="#b45309"/>
        </linearGradient>
      </defs>
      <rect width="480" height="270" rx="24" fill="url(#g)"/>
      <circle cx="240" cy="110" r="42" fill="rgba(255,255,255,0.18)"/>
      <polygon points="228,88 228,132 266,110" fill="#ffffff"/>
      <text x="240" y="188" text-anchor="middle" fill="#ffffff" font-size="24" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function buildContentPlaceholder(label, width = 800, height = 400) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <defs>
        <linearGradient id="content-gradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#f6ede4"/>
          <stop offset="100%" stop-color="#ead7c6"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" rx="28" fill="url(#content-gradient)"/>
      <circle cx="${width / 2}" cy="${height / 2 - 26}" r="42" fill="rgba(133, 77, 14, 0.12)"/>
      <path d="M ${width / 2 - 22} ${height / 2 + 8} L ${width / 2 - 4} ${height / 2 - 14} L ${width / 2 + 18} ${height / 2 + 12}" fill="none" stroke="#8a4b14" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="${width / 2}" y="${height - 56}" text-anchor="middle" fill="#7c2d12" font-size="28" font-family="Arial, sans-serif" font-weight="700">${label}</text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function normalizeDashboardImage(imageValue) {
  if (!imageValue || typeof imageValue !== 'string') {
    return '';
  }

  const trimmedValue = imageValue.trim();
  if (!trimmedValue || trimmedValue.startsWith('data:text/html')) {
    return '';
  }

  return trimmedValue;
}

// Global function to open announcement modal
function openAnnouncementModal(announcement) {
  // Remove old modal if exists
  const oldModal = document.getElementById('announcementModal');
  if (oldModal) {
    oldModal.remove();
  }

  // Format date
  const date = new Date(announcement.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract title (first line)
  const fullText = announcement.announcement_posts || '';
  const lines = fullText.split('\n');
  const title = lines[0];

  // Clone template
  const template = document.getElementById('announcementModalTemplate');
  const modal = template.content.cloneNode(true);
  
  // Set modal ID and image
  const modalDiv = modal.querySelector('.modal-announcement');
  modalDiv.id = 'announcementModal';
  
  const imgElement = modal.querySelector('.modal-announcement-image img');
  imgElement.src = normalizeDashboardImage(announcement.image) || buildContentPlaceholder('Announcement');
  
  // Set modal content
  modal.querySelector('.modal-announcement-date').textContent = date;
  modal.querySelector('.modal-announcement-title').textContent = title;
  modal.querySelector('.modal-announcement-text').innerHTML = fullText.replace(/\n/g, '<br>');
  
  // Set close button and overlay handlers
  const closeBtn = modal.querySelector('.modal-close-btn');
  closeBtn.onclick = closeAnnouncementModal;
  
  const overlay = modal.querySelector('.modal-overlay');
  overlay.onclick = closeAnnouncementModal;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close modal on escape key
  document.addEventListener('keydown', handleEscapeKey);
}

function closeAnnouncementModal() {
  const modal = document.getElementById('announcementModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

function handleEscapeKey(event) {
  if (event.key === 'Escape') {
    closeAnnouncementModal();
    document.removeEventListener('keydown', handleEscapeKey);
  }
}

// Global function to open news modal
function openNewsModal(newsItem) {
  // Remove old modal if exists
  const oldModal = document.getElementById('newsModal');
  if (oldModal) {
    oldModal.remove();
  }

  // Format date
  const date = new Date(newsItem.timestamp).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Extract title (first line)
  const fullText = newsItem.news_posts || '';
  const lines = fullText.split('\n');
  const title = lines[0];

  // Clone template
  const template = document.getElementById('newsModalTemplate');
  const modal = template.content.cloneNode(true);
  
  // Set modal ID and image
  const modalDiv = modal.querySelector('.modal-announcement');
  modalDiv.id = 'newsModal';
  
  const imgElement = modal.querySelector('.modal-announcement-image img');
  imgElement.src = normalizeDashboardImage(newsItem.image) || buildContentPlaceholder('News');
  
  // Set modal content
  modal.querySelector('.modal-announcement-label').textContent = 'NEWS';
  modal.querySelector('.modal-announcement-date').textContent = date;
  modal.querySelector('.modal-announcement-title').textContent = title;
  modal.querySelector('.modal-announcement-section-label').textContent = 'NEWS';
  modal.querySelector('.modal-announcement-text').innerHTML = fullText.replace(/\n/g, '<br>');
  
  // Set close button and overlay handlers
  const closeBtn = modal.querySelector('.modal-close-btn');
  closeBtn.onclick = closeNewsModal;
  
  const overlay = modal.querySelector('.modal-overlay');
  overlay.onclick = closeNewsModal;
  
  document.body.appendChild(modal);
  document.body.style.overflow = 'hidden';
  
  // Close modal on escape key
  document.addEventListener('keydown', handleNewsEscapeKey);
}

function closeNewsModal() {
  const modal = document.getElementById('newsModal');
  if (modal) {
    modal.remove();
    document.body.style.overflow = '';
  }
}

function handleNewsEscapeKey(event) {
  if (event.key === 'Escape') {
    closeNewsModal();
    document.removeEventListener('keydown', handleNewsEscapeKey);
  }
}
