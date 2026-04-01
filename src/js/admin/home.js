// ==================== INDEXEDDB SETUP ====================
const DB_NAME = 'WBSSDatabase';
const DB_VERSION = 1;
const STORES = {
  announcements: 'announcements',
  newsItems: 'newsItems',
  videos: 'videos'
};

let db = null;

function initIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };
    
    request.onupgradeneeded = (event) => {
      const database = event.target.result;
      
      // Create object stores for announcements, news, and videos
      if (!database.objectStoreNames.contains(STORES.announcements)) {
        database.createObjectStore(STORES.announcements, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.newsItems)) {
        database.createObjectStore(STORES.newsItems, { keyPath: 'id' });
      }
      if (!database.objectStoreNames.contains(STORES.videos)) {
        database.createObjectStore(STORES.videos, { keyPath: 'id' });
      }
    };
  });
}

// Get all items from a store
async function getAllFromStore(storeName) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readonly');
    const store = transaction.objectStore(storeName);
    const request = store.getAll();
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      // Sort by id descending (newest first)
      const items = request.result.sort((a, b) => b.id - a.id);
      resolve(items);
    };
  });
}

// Add item to store
async function addToStore(storeName, item) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.add(item);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Update item in store
async function updateInStore(storeName, item) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.put(item);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
  });
}

// Delete item from store
async function deleteFromStore(storeName, id) {
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([storeName], 'readwrite');
    const store = transaction.objectStore(storeName);
    const request = store.delete(id);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve();
  });
}

// ==================== SHARED UTILITY FUNCTIONS ====================

// Escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', async function() {
  // Initialize IndexedDB
  try {
    await initIndexedDB();
  } catch (error) {
    console.error('Failed to initialize IndexedDB:', error);
    alert('Storage initialization failed. Some features may not work properly.');
  }

  // Display announcement card
  function displayAnnouncement(announcementData, announcementList) {
    const announcementCard = document.createElement('div');
    announcementCard.className = 'announcement-card';
    announcementCard.id = `announcement-${announcementData.id}`;

    const announcementContent = `
      <div class="announcement-card-header">
        <button type="button" class="delete-btn" onclick="deleteAnnouncement(${announcementData.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      ${announcementData.image ? `<img src="${announcementData.image}" alt="Announcement" class="announcement-card-image">` : ''}
      <div class="announcement-card-body">
        <p>${escapeHtml(announcementData.text)}</p>
      </div>
      <div class="announcement-card-footer">
        <small>${announcementData.timestamp}</small>
      </div>
    `;

    announcementCard.innerHTML = announcementContent;
    announcementList.insertBefore(announcementCard, announcementList.firstChild);
  }

  // Display news card
  function displayNews(newsData, newsList) {
    const newsCard = document.createElement('div');
    newsCard.className = 'news-card';
    newsCard.id = `news-${newsData.id}`;

    const newsContent = `
      <div class="news-card-header">
        <button type="button" class="delete-btn" onclick="deleteNews(${newsData.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      ${newsData.image ? `<img src="${newsData.image}" alt="News" class="news-card-image">` : ''}
      <div class="news-card-body">
        <p>${escapeHtml(newsData.text)}</p>
      </div>
      <div class="news-card-footer">
        <small>${newsData.timestamp}</small>
      </div>
    `;

    newsCard.innerHTML = newsContent;
    newsList.insertBefore(newsCard, newsList.firstChild);
  }

  // Display video card
  function displayVideo(videoData, videoList) {
    const videoCard = document.createElement('div');
    videoCard.className = 'video-card';
    videoCard.id = `video-${videoData.id}`;

    const videoContent = `
      <div class="video-card-header">
        <h3>${escapeHtml(videoData.title)}</h3>
        <button type="button" class="delete-btn" onclick="deleteVideo(${videoData.id})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
      <div class="video-card-body">
        ${videoData.type === 'file' 
          ? `<video width="100%" height="auto" controls>
               <source src="${videoData.url}" type="video/mp4">
               Your browser does not support the video tag.
             </video>`
          : `<iframe width="100%" height="250" src="${embedYouTubeUrl(videoData.url)}" 
              frameborder="0" allowfullscreen></iframe>`
        }
      </div>
      <div class="video-card-footer">
        <small>Uploaded: ${videoData.timestamp}</small>
        ${videoData.fileName ? `<small>File: ${videoData.fileName}</small>` : ''}
      </div>
    `;

    videoCard.innerHTML = videoContent;
    videoList.insertBefore(videoCard, videoList.firstChild);
  }

  // Convert YouTube URL to embed URL
  function embedYouTubeUrl(url) {
    let videoId = '';
    
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  }

  // ==================== ANNOUNCEMENTS ====================
  const announcementForm = document.getElementById('announcementForm');
  const announcementImageInput = document.getElementById('announcementImage');
  const announcementTextInput = document.getElementById('announcementText');
  const announcementList = document.getElementById('announcementList');

  if (announcementForm && announcementImageInput && announcementTextInput && announcementList) {
    let announcements = [];

    // Load announcements from IndexedDB
    async function loadAnnouncements() {
      try {
        announcements = await getAllFromStore(STORES.announcements);
        announcements.forEach(announcementData => {
          displayAnnouncement(announcementData, announcementList);
        });
      } catch (error) {
        console.error('Error loading announcements:', error);
      }
    }

    announcementForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const image = announcementImageInput.files[0];
      const text = announcementTextInput.value.trim();

      if (!text) {
        alert('Please enter announcement text');
        return;
      }

      const announcementData = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleString(),
        image: null
      };

      if (image) {
        // Check file size (max 50MB for images)
        if (image.size > 50 * 1024 * 1024) {
          alert('Image is too large. Please use an image smaller than 50MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = async function(event) {
          announcementData.image = event.target.result;
          
          try {
            await addToStore(STORES.announcements, announcementData);
            displayAnnouncement(announcementData, announcementList);
            announcementForm.reset();
          } catch (error) {
            console.error('Error saving announcement:', error);
            alert('Failed to save announcement.');
          }
        };
        reader.onerror = function() {
          alert('Error reading image file');
        };
        reader.readAsDataURL(image);
      } else {
        (async () => {
          try {
            await addToStore(STORES.announcements, announcementData);
            displayAnnouncement(announcementData, announcementList);
            announcementForm.reset();
          } catch (error) {
            console.error('Error saving announcement:', error);
            alert('Failed to save announcement.');
          }
        })();
      }
    });

    window.deleteAnnouncement = async function(announcementId) {
      if (confirm('Are you sure you want to delete this announcement?')) {
        try {
          await deleteFromStore(STORES.announcements, announcementId);
          const announcementCard = document.getElementById(`announcement-${announcementId}`);
          if (announcementCard) {
            announcementCard.remove();
          }
        } catch (error) {
          console.error('Error deleting announcement:', error);
          alert('Failed to delete announcement.');
        }
      }
    };

    loadAnnouncements();
  }

  // ==================== NEWS ====================
  const newsForm = document.getElementById('newsForm');
  const newsImageInput = document.getElementById('newsImage');
  const newsTextInput = document.getElementById('newsText');
  const newsList = document.getElementById('newsList');

  if (newsForm && newsImageInput && newsTextInput && newsList) {
    let newsItems = [];

    // Load news from IndexedDB
    async function loadNews() {
      try {
        newsItems = await getAllFromStore(STORES.newsItems);
        newsItems.forEach(newsData => {
          displayNews(newsData, newsList);
        });
      } catch (error) {
        console.error('Error loading news:', error);
      }
    }

    newsForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const image = newsImageInput.files[0];
      const text = newsTextInput.value.trim();

      if (!text) {
        alert('Please enter news text');
        return;
      }

      const newsData = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toLocaleString(),
        image: null
      };

      if (image) {
        // Check file size (max 50MB for images)
        if (image.size > 50 * 1024 * 1024) {
          alert('Image is too large. Please use an image smaller than 50MB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = async function(event) {
          newsData.image = event.target.result;
          
          try {
            await addToStore(STORES.newsItems, newsData);
            displayNews(newsData, newsList);
            newsForm.reset();
          } catch (error) {
            console.error('Error saving news:', error);
            alert('Failed to save news.');
          }
        };
        reader.onerror = function() {
          alert('Error reading image file');
        };
        reader.readAsDataURL(image);
      } else {
        (async () => {
          try {
            await addToStore(STORES.newsItems, newsData);
            displayNews(newsData, newsList);
            newsForm.reset();
          } catch (error) {
            console.error('Error saving news:', error);
            alert('Failed to save news.');
          }
        })();
      }
    });

    window.deleteNews = async function(newsId) {
      if (confirm('Are you sure you want to delete this news?')) {
        try {
          await deleteFromStore(STORES.newsItems, newsId);
          const newsCard = document.getElementById(`news-${newsId}`);
          if (newsCard) {
            newsCard.remove();
          }
        } catch (error) {
          console.error('Error deleting news:', error);
          alert('Failed to delete news.');
        }
      }
    };

    loadNews();
  }

  // ==================== VIDEO UPLOAD ====================
  const videoForm = document.getElementById('videoForm');
  const videoTitleInput = document.getElementById('videoTitle');
  const videoTypeRadios = document.querySelectorAll('input[name="videoType"]');
  const videoFileInput = document.getElementById('videoFile');
  const videoUrlInput = document.getElementById('videoUrl');
  const videoList = document.getElementById('videoList');

  if (videoForm && videoTitleInput && videoFileInput && videoUrlInput && videoList) {
    let videos = [];

    // Load videos from IndexedDB
    async function loadVideos() {
      try {
        videos = await getAllFromStore(STORES.videos);
        videos.forEach(videoData => {
          displayVideo(videoData, videoList);
        });
      } catch (error) {
        console.error('Error loading videos:', error);
      }
    }

    videoTypeRadios.forEach(radio => {
      radio.addEventListener('change', function() {
        if (this.value === 'file') {
          videoFileInput.style.display = 'block';
          videoUrlInput.style.display = 'none';
          videoFileInput.required = true;
          videoUrlInput.required = false;
        } else {
          videoFileInput.style.display = 'none';
          videoUrlInput.style.display = 'block';
          videoFileInput.required = false;
          videoUrlInput.required = true;
        }
      });
    });

    videoForm.addEventListener('submit', function(e) {
      e.preventDefault();

      const title = videoTitleInput.value.trim();
      const type = document.querySelector('input[name="videoType"]:checked').value;
      
      if (!title) {
        alert('Please enter a video title');
        return;
      }

      let videoData = {
        id: Date.now(),
        title: title,
        type: type,
        timestamp: new Date().toLocaleString(),
        url: null,
        fileName: null
      };

      if (type === 'file') {
        const file = videoFileInput.files[0];
        if (!file) {
          alert('Please select a video file');
          return;
        }

        // Check file size (max 2GB for videos)
        if (file.size > 2 * 1024 * 1024 * 1024) {
          alert('Video file is too large. Please use a video smaller than 2GB.');
          return;
        }

        const reader = new FileReader();
        reader.onload = async function(event) {
          videoData.url = event.target.result;
          videoData.fileName = file.name;
          
          try {
            await addToStore(STORES.videos, videoData);
            displayVideo(videoData, videoList);
            videoForm.reset();
            videoFileInput.style.display = 'block';
            videoUrlInput.style.display = 'none';
          } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video.');
          }
        };
        reader.onerror = function() {
          alert('Error reading video file');
        };
        reader.readAsDataURL(file);
      } else {
        const url = videoUrlInput.value.trim();
        if (!url) {
          alert('Please enter a video URL');
          return;
        }

        videoData.url = url;
        (async () => {
          try {
            await addToStore(STORES.videos, videoData);
            displayVideo(videoData, videoList);
            videoForm.reset();
            videoFileInput.style.display = 'block';
            videoUrlInput.style.display = 'none';
          } catch (error) {
            console.error('Error saving video:', error);
            alert('Failed to save video.');
          }
        })();
      }
    });

    window.deleteVideo = async function(videoId) {
      if (confirm('Are you sure you want to delete this video?')) {
        try {
          await deleteFromStore(STORES.videos, videoId);
          const videoCard = document.getElementById(`video-${videoId}`);
          if (videoCard) {
            videoCard.remove();
          }
        } catch (error) {
          console.error('Error deleting video:', error);
          alert('Failed to delete video.');
        }
      }
    };

    loadVideos();
  }
});
