(function () {
  const root = document.documentElement;

  // Year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Theme toggle
  const KEY = 'pref-theme';
  const toggle = document.getElementById('themeToggle');
  const saved = localStorage.getItem(KEY);
  if (saved === 'light') root.classList.add('light');
  toggle?.addEventListener('click', () => {
    root.classList.toggle('light');
    localStorage.setItem(KEY, root.classList.contains('light') ? 'light' : 'dark');
  });

  // Mobile nav
  const navToggle = document.querySelector('.nav__toggle');
  const navList = document.getElementById('nav-list');
  navToggle?.addEventListener('click', () => {
    const isOpen = navList.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
  navList?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navList.classList.remove('is-open');
    navToggle?.setAttribute('aria-expanded', 'false');
  }));

  // Reveal on scroll
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // Tilt effect
  const maxTilt = 8; // degrees
  const tiltCards = document.querySelectorAll('.tilt');
  tiltCards.forEach(card => {
    const bound = () => card.getBoundingClientRect();
    const onMove = (ev) => {
      const r = bound();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const rx = (py - 0.5) * (maxTilt * 2);
      const ry = (0.5 - px) * (maxTilt * 2);
      card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const onLeave = () => { card.style.transform = 'rotateX(0) rotateY(0)'; };
    card.addEventListener('pointermove', onMove);
    card.addEventListener('pointerleave', onLeave);
  });

  // Skill bars animate when visible
  const bars = document.querySelectorAll('.skill__bar');
  const animateBars = () => bars.forEach(bar => {
    const lvl = Number(bar.dataset.level || 0);
    bar.querySelector('span').style.width = `${lvl}%`;
  });
  if (!prefersReduced && 'IntersectionObserver' in window) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          animateBars();
          io2.disconnect();
        }
      });
    }, { threshold: 0.2 });
    bars.forEach(b => io2.observe(b));
  } else {
    animateBars();
  }

  // Contact form -> open email client with mailto
  const emailBtn = document.getElementById('emailBtn');
  emailBtn?.addEventListener('click', () => {
    const form = emailBtn.closest('form');
    const name = form.querySelector('input[name="name"]').value.trim();
    const subject = form.querySelector('input[name="subject"]').value.trim();
    const message = form.querySelector('textarea[name="message"]').value.trim();

    const finalSubject = subject || 'Hello from your portfolio';
    const bodyLines = [];
    if (name) bodyLines.push(`Hi Mohamed, I'm ${name}.`);
    if (message) bodyLines.push('', message);
    const body = encodeURIComponent(bodyLines.join('\n'));

    window.location.href = `mailto:mohamed.amaidi.dev@gmail.com?subject=${encodeURIComponent(finalSubject)}&body=${body}`;
  });
})();
