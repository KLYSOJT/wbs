// User Dashboard - Load Announcements + News from Supabase
document.addEventListener('DOMContentLoaded', async function() {
  // Announcements with Pagination
  const announcementsGrid = document.getElementById('announcementsGrid');
  const paginationContainer = document.getElementById('paginationContainer');
  
  if (announcementsGrid) {
    announcementsGrid.innerHTML = '<div class="loading">Loading announcements...</div>';
    try {
      const announcements = await loadAnnouncementsFromSupabase();
      announcementsGrid.innerHTML = '';
      paginationContainer.innerHTML = '';

      const itemsPerPage = 3;
      let currentPage = 1;
      const totalPages = Math.ceil(announcements.length / itemsPerPage);

      // Function to display announcements for current page
      function displayPage(page) {
        announcementsGrid.innerHTML = '';
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const pageAnnouncements = announcements.slice(startIndex, endIndex);

        pageAnnouncements.forEach(announcement => {
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
          imgElement.src = announcement.image || 'https://via.placeholder.com/400x250?text=Announcement';
          
          // Set content
          card.querySelector('.announcement-date').textContent = date;
          card.querySelector('.announcement-title').textContent = title;
          card.querySelector('.announcement-description').textContent = description;
          card.querySelector('.read-more-btn').onclick = (e) => {
            e.stopPropagation();
            openAnnouncementModal(announcement);
          };
          
          // Get the card element (first child of template result)
          const cardElement = card.querySelector('.announcement-card');
          cardElement.style.cursor = 'pointer';
          cardElement.onclick = () => openAnnouncementModal(announcement);
          
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
        prevBtn.onclick = () => {
          if (currentPage > 1) {
            currentPage--;
            displayPage(currentPage);
            updatePagination();
          }
        };
        paginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= totalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'pagination-btn' + (i === currentPage ? ' active' : '');
          pageBtn.textContent = i;
          pageBtn.onclick = () => {
            currentPage = i;
            displayPage(currentPage);
            updatePagination();
          };
          paginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn next-btn';
        nextBtn.innerHTML = '&gt;&gt;';
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.onclick = () => {
          if (currentPage < totalPages) {
            currentPage++;
            displayPage(currentPage);
            updatePagination();
          }
        };
        paginationContainer.appendChild(nextBtn);
      }

      if (announcements.length === 0) {
        announcementsGrid.innerHTML = '<p class="no-announcements">No announcements available.</p>';
      } else {
        displayPage(currentPage);
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
      const news = await loadNewsFromSupabase();
      newsGrid.innerHTML = '';
      newsPaginationContainer.innerHTML = '';

      const newsItemsPerPage = 3;
      let newsCurrentPage = 1;
      const newsTotalPages = Math.ceil(news.length / newsItemsPerPage);

      // Function to display news for current page
      function displayNewsPage(page) {
        newsGrid.innerHTML = '';
        const startIndex = (page - 1) * newsItemsPerPage;
        const endIndex = startIndex + newsItemsPerPage;
        const pageNews = news.slice(startIndex, endIndex);

        pageNews.forEach(item => {
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
          imgElement.src = item.image || 'https://via.placeholder.com/400x250?text=News';
          
          // Set content
          card.querySelector('.news-date').textContent = date;
          card.querySelector('.news-title').textContent = title;
          card.querySelector('.news-description').textContent = description;
          card.querySelector('.read-more-btn').onclick = (e) => {
            e.stopPropagation();
            openNewsModal(item);
          };
          
          // Get the card element
          const cardElement = card.querySelector('.news-card');
          cardElement.style.cursor = 'pointer';
          cardElement.onclick = () => openNewsModal(item);
          
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
        prevBtn.onclick = () => {
          if (newsCurrentPage > 1) {
            newsCurrentPage--;
            displayNewsPage(newsCurrentPage);
            updateNewsPagination();
          }
        };
        newsPaginationContainer.appendChild(prevBtn);

        // Page numbers
        for (let i = 1; i <= newsTotalPages; i++) {
          const pageBtn = document.createElement('button');
          pageBtn.className = 'pagination-btn' + (i === newsCurrentPage ? ' active' : '');
          pageBtn.textContent = i;
          pageBtn.onclick = () => {
            newsCurrentPage = i;
            displayNewsPage(newsCurrentPage);
            updateNewsPagination();
          };
          newsPaginationContainer.appendChild(pageBtn);
        }

        // Next button
        const nextBtn = document.createElement('button');
        nextBtn.className = 'pagination-btn next-btn';
        nextBtn.innerHTML = '&gt;&gt;';
        nextBtn.disabled = newsCurrentPage === newsTotalPages;
        nextBtn.onclick = () => {
          if (newsCurrentPage < newsTotalPages) {
            newsCurrentPage++;
            displayNewsPage(newsCurrentPage);
            updateNewsPagination();
          }
        };
        newsPaginationContainer.appendChild(nextBtn);
      }

      if (news.length === 0) {
        newsGrid.innerHTML = '<p class="no-news">No news available.</p>';
      } else {
        displayNewsPage(newsCurrentPage);
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

  if (videoList && mainVideo) {
    try {
      const videos = await loadVideosFromSupabase();
      console.log('Loaded videos:', videos); // Debug log
      videoList.innerHTML = '';

      if (videos.length > 0) {
        // Set first video as main
        const firstVideo = videos[0];
        console.log('First video:', firstVideo); // Debug log
        mainTitle.textContent = firstVideo.title || 'Untitled Video';
        const videoWrapper = document.querySelector('.video-wrapper');
        
        // Determine if it's a URL (YouTube) or file video
        const isUrlVideo = firstVideo.type === 'url' || (firstVideo.url && firstVideo.url.includes('youtube'));
        
        if (isUrlVideo) {
          // YouTube URL
          console.log('Playing as YouTube video:', firstVideo.url);
          const embedUrl = embedYouTubeUrl(firstVideo.url);
          videoWrapper.innerHTML = `
            <iframe id="mainVideo"
              src="${embedUrl}"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen></iframe>
          `;
        } else {
          // File video - use video tag instead of iframe
          console.log('Playing as file video:', firstVideo.url);
          videoWrapper.innerHTML = `
            <video controls>
              <source src="${firstVideo.url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        }

        // Display other videos as thumbnails
        videos.forEach((video, index) => {
          let thumbnailSrc = '';
          if (video.type === 'url') {
            // Generate YouTube thumbnail
            const videoId = video.url.includes('youtube.com/watch?v=') 
              ? video.url.split('v=')[1].split('&')[0]
              : video.url.includes('youtu.be/') 
              ? video.url.split('youtu.be/')[1].split('?')[0]
              : '';
            thumbnailSrc = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          } else {
            // For file videos, show a placeholder or first frame
            thumbnailSrc = 'https://via.placeholder.com/150x85?text=Video';
          }

          // Clone template
          const template = document.getElementById('videoCardTemplate');
          const cardNode = template.content.cloneNode(true);
          
          // Set thumbnail and title
          const imgElement = cardNode.querySelector('img');
          imgElement.src = thumbnailSrc;
          imgElement.alt = video.title;
          cardNode.querySelector('p').textContent = video.title;
          
          // Get the card element
          const cardElement = cardNode.querySelector('.video-card-user');
          cardElement.style.cursor = 'pointer';
          cardElement.onclick = function() {
            mainTitle.textContent = video.title || 'Untitled Video';
            const videoWrapper = document.querySelector('.video-wrapper');
            const isUrlVideo = video.type === 'url' || (video.url && video.url.includes('youtube'));
            
            if (isUrlVideo) {
              console.log('Switching to YouTube video:', video.url);
              const embedUrl = embedYouTubeUrl(video.url);
              videoWrapper.innerHTML = `
                <iframe id="mainVideo"
                  src="${embedUrl}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
              `;
            } else {
              console.log('Switching to file video:', video.url);
              videoWrapper.innerHTML = `
                <video controls>
                  <source src="${video.url}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              `;
            }
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

  // Helper function to convert YouTube URL to embed URL
  function embedYouTubeUrl(url) {
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    console.log('Converted to embed URL:', embedUrl); // Debug
    return embedUrl;
  }
});

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
  imgElement.src = announcement.image || 'https://via.placeholder.com/800x400?text=Announcement';
  
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
  imgElement.src = newsItem.image || 'https://via.placeholder.com/800x400?text=News';
  
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


