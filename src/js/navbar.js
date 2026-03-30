// ================= ANNOUNCEMENTS =================
let announcements = [
  {
    title: "Sample Announcement",
    description: "Short preview...",
    fullDescription: "Full announcement content here.",
    image: "userimages/welcome.png",
    date: "March 30, 2026"
  }
];

const announcementsPerPage = 3;
let currentPage = 1;

function renderAnnouncements() {
  const grid = document.getElementById("announcementsGrid");
  grid.innerHTML = "";

  announcements.forEach((a) => {
    grid.innerHTML += `
      <div class="announcement-card">
        <img src="${a.image}">
        <p>${a.date}</p>
        <p>${a.description}</p>
      </div>
    `;
  });
}

renderAnnouncements();

// ================= NEWS =================
let news = [
  {
    title: "Sample News",
    description: "News preview",
    image: "userimages/making.png"
  }
];

function renderNews() {
  const grid = document.getElementById("newsGrid");
  grid.innerHTML = "";

  news.forEach((n) => {
    grid.innerHTML += `
      <div class="news-card">
        <img src="${n.image}">
        <h3>${n.title}</h3>
        <p>${n.description}</p>
      </div>
    `;
  });
}

renderNews();

// ================= CAROUSEL =================
let currentCarouselIndex = 1;

function currentSlide(n) {
  showSlide(currentCarouselIndex = n);
}

function showSlide(n) {
  const slides = document.querySelectorAll(".carousel-item");
  const indicators = document.querySelectorAll(".indicator");

  if (n > slides.length) currentCarouselIndex = 1;
  if (n < 1) currentCarouselIndex = slides.length;

  slides.forEach(s => s.classList.remove("active"));
  indicators.forEach(i => i.classList.remove("active"));

  slides[currentCarouselIndex - 1].classList.add("active");
  indicators[currentCarouselIndex - 1].classList.add("active");
}

setInterval(() => {
  currentCarouselIndex++;
  showSlide(currentCarouselIndex);
}, 5000);