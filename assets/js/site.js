// Tokenwala site: mobile menu + footer year. No dependencies.
(function () {
  var btn = document.querySelector('.menu-btn');
  var links = document.getElementById('nav-links');
  if (btn && links) {
    var set = function (open) {
      btn.setAttribute('aria-expanded', String(open));
      links.classList.toggle('open', open);
    };
    btn.addEventListener('click', function () { set(btn.getAttribute('aria-expanded') !== 'true'); });
    links.addEventListener('click', function (e) { if (e.target.closest('a')) set(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { set(false); } });
  }
  // Hero background loop: still for reduced motion; paused when off screen.
  var v = document.querySelector('.hero__video');
  if (v) {
    var still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var saver = navigator.connection && navigator.connection.saveData;
    if (still || saver) { v.removeAttribute('autoplay'); v.pause(); v.preload = 'none'; }
    else if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); } else { v.pause(); } });
      }, { threshold: 0.05 }).observe(v);
    }
  }
  // Section loops further down: load and play only when near the screen.
  var loops = document.querySelectorAll('.loop-bg__video');
  if (loops.length && 'IntersectionObserver' in window) {
    var calm = (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) || (navigator.connection && navigator.connection.saveData);
    if (!calm) {
      var io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          var el = e.target;
          if (e.isIntersecting) { if (el.preload === 'none') { el.preload = 'auto'; el.load(); } var p = el.play(); if (p && p.catch) p.catch(function () {}); }
          else { el.pause(); }
        });
      }, { rootMargin: '200px 0px', threshold: 0.01 });
      for (var k = 0; k < loops.length; k++) io.observe(loops[k]);
    }
  }
  var y = document.querySelectorAll('[data-year]');
  for (var i = 0; i < y.length; i++) y[i].textContent = new Date().getFullYear();
})();
