document.addEventListener("DOMContentLoaded", () => {
  const testimonialCards = document.querySelectorAll(".testimonial-card");

  if (testimonialCards.length > 0) {
    let currentIndex = 0;
    function highlightCard(index) {
      testimonialCards.forEach((card, i) => {
        card.style.opacity = i === index ? "1" : "0.75";
        card.style.transform = i === index ? "scale(1.05)" : "scale(1)";
      });
    }
    highlightCard(currentIndex);
    setInterval(() => {
      currentIndex = (currentIndex + 1) % testimonialCards.length;
      highlightCard(currentIndex);
    }, 2500);
  }

  const brandTrack = document.querySelector('.brand-slider-track');
  if (brandTrack && !brandTrack.dataset.loopReady) {
    brandTrack.dataset.loopReady = 'true';
    brandTrack.innerHTML += brandTrack.innerHTML;
  }

  const track = document.getElementById("featuredTrack");
  const prevBtn = document.getElementById("featuredPrev");
  const nextBtn = document.getElementById("featuredNext");

  if (track && prevBtn && nextBtn) {
    let currentSlide = 0;
    let autoAdvance;

    function slidesPerView() {
      if (window.innerWidth <= 700) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }

    function getSlides() {
      return Array.from(track.querySelectorAll('.featured-slide'));
    }

    function updateCarousel() {
      const slides = getSlides();
      if (!slides.length) return;
      const slideWidth = slides[0].getBoundingClientRect().width;
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || 20) || 20;
      const perView = slidesPerView();
      const maxIndex = Math.max(0, slides.length - perView);
      if (currentSlide > maxIndex) currentSlide = 0;
      if (currentSlide < 0) currentSlide = maxIndex;
      const moveAmount = currentSlide * (slideWidth + gap);
      track.style.transform = `translateX(-${moveAmount}px)`;
    }

    function goNext() {
      const slides = getSlides();
      const perView = slidesPerView();
      const maxIndex = Math.max(0, slides.length - perView);
      currentSlide = currentSlide >= maxIndex ? 0 : currentSlide + 1;
      updateCarousel();
    }

    function goPrev() {
      const slides = getSlides();
      const perView = slidesPerView();
      const maxIndex = Math.max(0, slides.length - perView);
      currentSlide = currentSlide <= 0 ? maxIndex : currentSlide - 1;
      updateCarousel();
    }

    function restartAuto() {
      clearInterval(autoAdvance);
      autoAdvance = setInterval(goNext, 3200);
    }

    prevBtn.addEventListener("click", () => { goPrev(); restartAuto(); });
    nextBtn.addEventListener("click", () => { goNext(); restartAuto(); });
    window.addEventListener("resize", updateCarousel);
    track.addEventListener('mouseenter', () => clearInterval(autoAdvance));
    track.addEventListener('mouseleave', restartAuto);
    updateCarousel();
    restartAuto();
  }
});
