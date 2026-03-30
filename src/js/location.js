    // Modal functionality
    const modal = document.getElementById('facilityModal');
    const closeBtn = document.querySelector('.close');
    const letterBtns = document.querySelectorAll('.letter-btn');

  // Modal image element
  const modalImage = document.getElementById('modalImage');

  letterBtns.forEach((btn) => {
    btn.addEventListener('click', function() {
      const letter = this.dataset.letter;

      if (letter === 'R1') {
        modalImage.src = '../imgs/1.png';
        modalImage.alt = 'Rise';
        modalImage.style.display = 'block';
      } else if (letter === 'E') {
        modalImage.src = '../imgs/2.png';
        modalImage.alt = 'Excellence';
        modalImage.style.display = 'block';
      } else if (letter === 'C') {
        modalImage.src = '../imgs/3.png';
        modalImage.alt = 'Creativity';
        modalImage.style.display = 'block';
      } else if (letter === 'T') {
        modalImage.src = '../imgs/4.png';
        modalImage.alt = 'Talent';
        modalImage.style.display = 'block';
      } else if (letter === 'O') {
        modalImage.src = '../imgs/5.png';
        modalImage.alt = 'Optimism';
        modalImage.style.display = 'block';
      } else if (letter === 'R2') {
        modalImage.src = '../imgs/6.png';
        modalImage.alt = 'Resilience';
        modalImage.style.display = 'block';
      } else if (letter === 'I') {
        modalImage.src = '../imgs/7.png';
        modalImage.alt = 'Innovation';
        modalImage.style.display = 'block';
      } else if (letter === 'A') {
        modalImage.src = '../imgs/8.png';
        modalImage.alt = 'Aspiration';
        modalImage.style.display = 'block';
      } else if (letter === 'N') {
        modalImage.src = '../imgs/9.png';
        modalImage.alt = 'Nobility';
        modalImage.style.display = 'block';
      } else if (letter === 'S') {
        modalImage.src = '../imgs/10.png';
        modalImage.alt = 'Service';
        modalImage.style.display = 'block';
      } else {
        modalImage.style.display = 'none';
        modalImage.src = '';
        modalImage.alt = '';
      }

      modal.style.display = 'flex';
    });
  });

    closeBtn.addEventListener('click', function() {
      modal.style.display = 'none';
      modalImage.style.display = 'none';
      modalImage.src = '';
      modalImage.alt = '';
    });

    window.addEventListener('click', function(event) {
      if (event.target == modal) {
        modal.style.display = 'none';
        modalImage.style.display = 'none';
        modalImage.src = '';
        modalImage.alt = '';
      }
    });