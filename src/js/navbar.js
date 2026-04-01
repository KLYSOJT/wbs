// Navbar dropdown functionality
document.addEventListener('DOMContentLoaded', () => {
  const dropdowns = document.querySelectorAll('.dropdown');

  dropdowns.forEach(dropdown => {
    const link = dropdown.querySelector('a');
    
    link.addEventListener('click', (e) => {
      e.preventDefault();
      dropdown.classList.toggle('open');
      
      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dropdown && !dropdown.querySelector(other)) {
          other.classList.remove('open');
        }
      });
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('open');
      }
    });
  });
});
