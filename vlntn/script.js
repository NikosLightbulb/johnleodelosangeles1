document.addEventListener('DOMContentLoaded', () => {
  // Generate stars
  const starfield = document.getElementById('starfield');
  const starCount = 100;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const delay = Math.random() * 3;
    const duration = 2 + Math.random() * 1;

    star.style.left = x + '%';
    star.style.top = y + '%';
    star.style.animationDelay = delay + 's';
    star.style.animationDuration = duration + 's';

    starfield.appendChild(star);
  }

  // State variables
  let currentSlide = 0;
  let envelopeOpened = false;
  let activeFlow = null; // 'yes' or 'no'

  // Get slide elements
  const commonSlides = document.querySelectorAll('.common-slide');
  const yesFlowContainer = document.getElementById('yesFlow');
  const noFlowContainer = document.getElementById('noFlow');
  const yesSlides = Array.from(yesFlowContainer.querySelectorAll('.slide'));
  const noSlides = Array.from(noFlowContainer.querySelectorAll('.slide'));

  let yesSlideIndex = 0;
  let noSlideIndex = 0;

  // Show/hide slides
  // Get sky element
  const sky = document.querySelector('.sky');

  function showCommonSlide(n) {
    commonSlides.forEach(slide => slide.classList.remove('active'));
    if (n < commonSlides.length) {
      commonSlides[n].classList.add('active');
    }
    // Hide sky from closed letter slide (slide 5) onwards with opacity
    if (n >= 5) {
      sky.style.opacity = '0';
      sky.style.pointerEvents = 'none';
    } else {
      sky.style.opacity = '1';
      sky.style.pointerEvents = 'auto';
    }
  }

  function showYesSlide(n) {
    yesSlides.forEach(slide => slide.classList.remove('active'));
    if (n < yesSlides.length) {
      yesSlides[n].classList.add('active');
    }
  }

  function showNoSlide(n) {
    noSlides.forEach(slide => slide.classList.remove('active'));
    if (n < noSlides.length) {
      noSlides[n].classList.add('active');
    }
  }

  // Navigation functions
  function nextCommonSlide() {
    if (currentSlide < commonSlides.length - 1) {
      // Special handling for envelope slides
      if (currentSlide === 5 && !envelopeOpened) {
        // Don't advance from closed envelope slide
        return;
      }
      currentSlide++;
      showCommonSlide(currentSlide);
    }
  }

  function nextYesSlide() {
    if (yesSlideIndex < yesSlides.length - 1) {
      yesSlideIndex++;
      showYesSlide(yesSlideIndex);
    }
  }

  function nextNoSlide() {
    if (noSlideIndex < noSlides.length - 1) {
      noSlideIndex++;
      showNoSlide(noSlideIndex);
    }
  }

  // Initialize
  showCommonSlide(0);

  // Envelope functionality
  const envelope = document.getElementById('envelope');
  const envelopeContainer = document.getElementById('envelopeContainer');
  const closedEnvelopeSlide = document.getElementById('closedEnvelopeSlide');
  const openEnvelopeSlide = document.getElementById('openEnvelopeSlide');

  envelopeContainer.addEventListener('click', (e) => {
    if (currentSlide === 5) {
      if (!envelopeOpened) {
        // First click: open the envelope
        envelope.classList.add('open');
        envelopeOpened = true;
        // Wait for animation to complete before switching slides
        setTimeout(() => {
          closedEnvelopeSlide.style.display = 'none';
          openEnvelopeSlide.style.display = 'flex';
          // Small delay to let the display change register before adding active class
          setTimeout(() => {
            openEnvelopeSlide.classList.add('active');
          }, 10);
        }, 1800);
      }
      e.stopPropagation();
    }
  });

  // Yes/No buttons
  const yesBtn = document.getElementById('yesBtn');
  const noBtn = document.getElementById('noBtn');
  let noClickCount = 0;

  yesBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    // Hide sky before switching
    sky.style.opacity = '0';
    sky.style.pointerEvents = 'none';
    // Hide common slides, show yes flow
    document.querySelector('.container').style.display = 'none';
    yesFlowContainer.style.display = 'block';
    activeFlow = 'yes';
    showYesSlide(0);
  });

  noBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    noClickCount++;

    if (noClickCount === 1) {
      // First click: increase Yes button
      yesBtn.style.transform = 'scale(1.3)';
    } else if (noClickCount === 2) {
      // Second click: increase Yes button more
      yesBtn.style.transform = 'scale(1.6)';
    } else if (noClickCount === 3) {
      // Third click: show no flow
      sky.style.opacity = '0';
      sky.style.pointerEvents = 'none';
      document.querySelector('.container').style.display = 'none';
      noFlowContainer.style.display = 'block';
      activeFlow = 'no';
      showNoSlide(0);
    }
  });

  // Open envelope click to advance to slide 7
  openEnvelopeSlide.addEventListener('click', (e) => {
    if (currentSlide === 5 && envelopeOpened && !yesBtn.closest('.slide.active')) {
      // Advance to choice slide
      currentSlide = 7;
      openEnvelopeSlide.style.display = 'none';
      closedEnvelopeSlide.style.display = 'none';
      showCommonSlide(7);
    }
  });

  // Main click to advance
  document.addEventListener('click', (e) => {
    // If in yes or no flow, navigate within that flow
    if (activeFlow === 'yes') {
      nextYesSlide();
      return;
    }
    if (activeFlow === 'no') {
      nextNoSlide();
      return;
    }

    // Don't advance if clicking buttons
    if (e.target === yesBtn || e.target === noBtn) {
      return;
    }

    // Don't advance if clicking envelope container
    if (e.target === envelopeContainer || envelopeContainer.contains(e.target)) {
      return;
    }

    // Slide 8 (choice buttons) - don't auto-advance
    if (currentSlide === 7) {
      return;
    }

    // All other common slides - advance
    nextCommonSlide();
  });

  // Keyboard support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      if (activeFlow === 'yes') {
        nextYesSlide();
      } else if (activeFlow === 'no') {
        nextNoSlide();
      } else {
        nextCommonSlide();
      }
    }
  });
});
