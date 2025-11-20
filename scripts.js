// Minimal contact form handling
// This file replaces the previous reference to an 'index.js' file (which was a directory).

document.addEventListener('DOMContentLoaded', function(){
  var form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    var name = document.getElementById('name').value || 'Friend';
    // A production site would send this to a server. For now show a friendly confirmation.
    alert('Thanks, ' + name + '! Your message has been received. We will get back to you soon.');
    form.reset();
  });
});

// Adjust the ARBORPRO brand width to match the subtitle width on the home page
(function(){
  function adjustBrandWidth(){
    var brand = document.getElementById('brandName');
    var subtitle = document.getElementById('brandSubtitle');
    // Reset any inline width first so measurements are accurate
    if (brand) brand.style.width = '';
    if(!brand || !subtitle) return;
    // If the subtitle is placed to the right of the brand (side-by-side),
    // skip setting an explicit width — we only sync when subtitle sits under the brand.
    var bRect = brand.getBoundingClientRect();
    var sRect = subtitle.getBoundingClientRect();
    // If subtitle's left edge is to the right of brand's right edge (i.e. beside), do nothing
    if (sRect.left >= bRect.right - 0.5) return;

    // Otherwise measure subtitle width and apply to brand
    var w = sRect.width;
    // Add a tiny epsilon to avoid wrapping due to sub-pixel rounding
    brand.style.width = Math.ceil(w) + 'px';
  }

  // Debounce helper
  function debounce(fn, wait){
    var t;
    return function(){
      clearTimeout(t);
      t = setTimeout(fn, wait);
    };
  }

  // Run on load and resize
  document.addEventListener('DOMContentLoaded', adjustBrandWidth);
  window.addEventListener('resize', debounce(adjustBrandWidth, 100));
  // Also run shortly after load in case fonts/images change layout
  window.addEventListener('load', function(){ setTimeout(adjustBrandWidth, 50); });
})();

// Hero carousel logic
(function(){
  var carousel = document.querySelector('.hero-carousel');
  if(!carousel) return;
  var track = carousel.querySelector('.carousel-track');
  var slides = carousel.querySelectorAll('.carousel-slide');
  var indicators = carousel.querySelectorAll('.indicator');
  var left = carousel.querySelector('.carousel-arrow.left');
  var right = carousel.querySelector('.carousel-arrow.right');
  var current = 0;
  var timer;

  function showSlide(idx) {
    track.style.transform = 'translateX(' + (-idx * 100) + '%)';
    indicators.forEach(function(btn,i){
      btn.setAttribute('aria-selected', i===idx?'true':'false');
      btn.classList.toggle('active', i===idx);
    });
    current = idx;
    resetTimer();
  }

  function next(){ showSlide((current+1)%slides.length); }
  function prev(){ showSlide((current-1+slides.length)%slides.length); }
  function resetTimer(){
    clearTimeout(timer);
    timer = setTimeout(next, 5000);
  }

  left.addEventListener('click', prev);
  right.addEventListener('click', next);
  indicators.forEach(function(btn,i){
    btn.addEventListener('click', function(){ showSlide(i); });
  });
  showSlide(0);
})();

// Mobile menu toggle (used in header)
document.addEventListener('click', function (e) {
  var btn = document.getElementById('mobileMenuBtn');
  var menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;
  if (e.target === btn || btn.contains(e.target)) {
    var isHidden = menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', (!isHidden).toString());
  }
});
