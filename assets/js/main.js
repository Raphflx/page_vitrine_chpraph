// main.js — Logique principale de la page

// --- Header scroll ---
const header = document.querySelector('.site-header');
if (header) {
  const onScroll = () => {
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// --- Nav active au scroll ---
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

if (sections.length && navLinks.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { threshold: 0.4, rootMargin: '-64px 0px 0px 0px' });

  sections.forEach(s => sectionObserver.observe(s));
}

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// --- Canvas réseau (hero) ---
const canvas = document.getElementById('heroCanvas');

if (canvas) {
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let animId;

  const resize = () => {
    canvas.width  = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  };

  const createNodes = () => {
    nodes = [];
    const count = Math.max(20, Math.floor((canvas.width * canvas.height) / 16000));
    for (let i = 0; i < count; i++) {
      nodes.push({
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r:  Math.random() * 1.5 + 1,
      });
    }
  };

  const draw = () => {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    const nodeAlpha = dark ? 0.55 : 0.2;
    const lineBase  = dark ? '77,148,255' : '0,85,255';

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          const alpha = (1 - dist / 130) * (dark ? 0.35 : 0.2);
          ctx.strokeStyle = `rgba(${lineBase},${alpha})`;
          ctx.lineWidth   = 0.6;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.fillStyle = `rgba(${lineBase},${nodeAlpha})`;
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    animId = requestAnimationFrame(draw);
  };

  const init = () => {
    cancelAnimationFrame(animId);
    resize();
    createNodes();
    draw();
  };

  window.addEventListener('resize', init, { passive: true });

  // Relance l'animation quand le thème change (couleurs différentes)
  const html = document.documentElement;
  new MutationObserver(() => {}).observe(html, { attributes: true, attributeFilter: ['data-theme'] });

  init();
}
