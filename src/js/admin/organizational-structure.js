document.addEventListener('DOMContentLoaded', () => {
  createHiddenFileInput();
  loadSavedData();

  const buttons = document.querySelectorAll('.change-image-btn');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      handleChangeImage(button);
    });
  });
});

/* Load saved images + timestamps */
function loadSavedData() {
  const cards = document.querySelectorAll('.card');

  cards.forEach(card => {
    const title = card.dataset.title;
    const img = card.querySelector('img');
    const updatedText = card.querySelector('.updated');

    const savedImage = localStorage.getItem(`img_${title}`);
    const savedTime = localStorage.getItem(`time_${title}`);

    if (savedImage) {
      img.src = savedImage;
    }

    if (savedTime) {
      updatedText.textContent = "Updated: " + savedTime;
    }
  });
}

/* Hidden file input */
function createHiddenFileInput() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.id = 'fileInput';
  input.style.display = 'none';
  document.body.appendChild(input);
}

/* Handle button click */
function handleChangeImage(button) {
  const card = button.closest('.card');
  const title = card.dataset.title;
  const img = card.querySelector('img');
  const updatedText = card.querySelector('.updated');

  const fileInput = document.getElementById('fileInput');

  fileInput.value = '';

  fileInput.onchange = (e) => {
    const file = e.target.files[0];

    if (!file || !file.type.startsWith('image/')) {
      alert('Please select a valid image');
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const imageData = event.target.result;

      // Update image
      img.src = imageData;

      // Save image
      localStorage.setItem(`img_${title}`, imageData);

      // Get real-time date
      const now = new Date();
      const formatted = now.toLocaleString();

      // Update UI
      updatedText.textContent = "Updated: " + formatted;

      // Save time
      localStorage.setItem(`time_${title}`, formatted);
    };

    reader.readAsDataURL(file);
  };

  fileInput.click();
}