// User Dashboard - Load Announcements + News from Supabase
document.addEventListener('DOMContentLoaded', async function() {
  // Announcements
  const announcementsGrid = document.getElementById('announcementsGrid');
  if (announcementsGrid) {
    announcementsGrid.innerHTML = '<div class="loading">Loading announcements...</div>';
    try {
      const announcements = await loadAnnouncementsFromSupabase();
      announcementsGrid.innerHTML = '';

      announcements.forEach(announcement => {
        const data = {
          id: announcement.id,
          text: announcement.announcement_posts,
          image: announcement.image,
          timestamp: announcement.timestamp
        };

        const card = document.createElement('div');
        card.className = 'announcement-card-user';
        card.innerHTML = `
          ${data.image ? `<img src="${data.image}" alt="Announcement" class="announcement-img">` : ''}
          <div class="announcement-content">
            <p>${data.text}</p>
            <small>${new Date(data.timestamp).toLocaleDateString()}</small>
          </div>
        `;
        announcementsGrid.appendChild(card);
      });

      if (announcements.length === 0) {
        announcementsGrid.innerHTML = '<p>No announcements available.</p>';
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      announcementsGrid.innerHTML = '<p>Failed to load announcements.</p>';
    }
  }

  // News
  const newsGrid = document.getElementById('newsGrid');
  if (newsGrid) {
    newsGrid.innerHTML = '<div class="loading">Loading news...</div>';
    try {
      const news = await loadNewsFromSupabase();
      newsGrid.innerHTML = '';

      news.forEach(item => {
        const data = {
          id: item.id,
          text: item.news_posts,
          image: item.image,
          timestamp: item.timestamp
        };

        const card = document.createElement('div');
        card.className = 'news-card-user';
        card.innerHTML = `
          ${data.image ? `<img src="${data.image}" alt="News" class="news-img">` : ''}
          <div class="news-content">
            <p>${data.text}</p>
            <small>${new Date(data.timestamp).toLocaleDateString()}</small>
          </div>
        `;
        newsGrid.appendChild(card);
      });

      if (news.length === 0) {
        newsGrid.innerHTML = '<p>No news available.</p>';
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
          mainVideo.src = embedUrl;
          mainVideo.setAttribute('allow', 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture');
        } else {
          // File video - use video tag instead of iframe
          console.log('Playing as file video:', firstVideo.url);
          videoWrapper.innerHTML = `
            <video width="100%" height="500" controls>
              <source src="${firstVideo.url}" type="video/mp4">
              Your browser does not support the video tag.
            </video>
          `;
        }

        // Display other videos as thumbnails
        videos.forEach((video, index) => {
          const videoCard = document.createElement('div');
          videoCard.className = 'video-card-user';
          videoCard.style.cursor = 'pointer';
          
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

          videoCard.innerHTML = `
            <img src="${thumbnailSrc}" alt="${video.title}" style="width: 100%; height: auto;">
            <p style="margin-top: 5px; font-size: 14px;">${video.title}</p>
          `;

          videoCard.onclick = function() {
            mainTitle.textContent = video.title || 'Untitled Video';
            const videoWrapper = document.querySelector('.video-wrapper');
            const isUrlVideo = video.type === 'url' || (video.url && video.url.includes('youtube'));
            
            if (isUrlVideo) {
              console.log('Switching to YouTube video:', video.url);
              const embedUrl = embedYouTubeUrl(video.url);
              videoWrapper.innerHTML = `
                <iframe id="mainVideo" width="100%" height="500"
                  src="${embedUrl}"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowfullscreen></iframe>
              `;
            } else {
              console.log('Switching to file video:', video.url);
              videoWrapper.innerHTML = `
                <video width="100%" height="500" controls>
                  <source src="${video.url}" type="video/mp4">
                  Your browser does not support the video tag.
                </video>
              `;
            }
          };

          videoList.appendChild(videoCard);
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


