// research.js

// Sample function for "View Details" button
function viewResearch(id, title) {
  alert("Viewing details for Research ID: " + id + "\nTitle: " + title);
}

// Optional: Handle search form locally (static page)
document.getElementById('researchSearchForm').addEventListener('submit', function(e) {
  e.preventDefault();
  alert('Search submitted! This is a static HTML demo.');
});

document.getElementById('researchSearchForm').addEventListener('reset', function(e) {
  alert('Form reset!');
});