// Config
// Config - Static Images from public folder
const SPLASH_IMAGES = [
  '/assets/images/public/eng.jpeg',
  '/assets/images/public/1.jpeg',
  '/assets/images/public/raj.jpeg',
  '/assets/images/public/2.jpeg',
  '/assets/images/public/mr1.jpeg',
  '/assets/images/public/raj2.jpeg',
  '/assets/images/public/mr2.jpeg',
  '/assets/images/public/raj8.jpeg'
];



const COUNTDOWN_TO = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0); // Jan 1 next year

// Helpers
const qs = (sel, root = document) => root.querySelector(sel);
const qsa = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Splash orbit setup (clock-like rotation with highlight)
function buildSplashSquares(count = 8) {
  const wrap = qs('#splashSquares');
  if (!wrap) return;
  wrap.innerHTML = '';
  const max = Math.max(4, Math.min(8, count));
  const items = [];
  for (let i = 0; i < 8; i++) {
    const cell = document.createElement('div');
    cell.className = 'splash-sq';
    const img = document.createElement('img');
    img.src = SPLASH_IMAGES[i % SPLASH_IMAGES.length];
    img.alt = 'Memory';
    cell.appendChild(img);
    wrap.appendChild(cell);
    items.push(cell);
  }
  // sequential highlight one-by-one, replacing image occasionally
  let hi = 0;
  let idx = 0;
  setInterval(() => {
    items.forEach(it => it.classList.remove('highlight'));
    items[hi].classList.add('highlight');
    // occasionally rotate image
    if (Math.random() < 0.6) {
      idx = (idx + 1) % SPLASH_IMAGES.length;
      const im = items[hi].querySelector('img');
      im.style.transition = 'opacity .35s ease, transform .35s ease';
      im.style.opacity = '0.0';
      im.style.transform = 'scale(1.02)';
      setTimeout(() => {
        im.src = SPLASH_IMAGES[idx];
        im.style.opacity = '1';
        im.style.transform = 'scale(1.04)';
      }, 350);
    }
    hi = (hi + 1) % max;
  }, 900);
}

// Floating accents
function spawnFloating() {
  const layer = qs('#floatingLayer');
  if (!layer) return;
  for (let i = 0; i < 20; i++) {
    const el = document.createElement('div');
    el.className = 'float-heart';
    el.textContent = '❤';
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (12 + Math.random() * 16) + 'px';
    el.style.animationDuration = (12 + Math.random() * 8) + 's';
    el.style.animationDelay = (Math.random() * 8) + 's';
    layer.appendChild(el);
  }
}

// Navigation
function setupNavigation() {
  const buttons = qsa('.nav-btn');
  const pages = qsa('.page');
  const activate = (id) => {
    buttons.forEach(b => b.classList.toggle('active', b.getAttribute('data-page') === id));
    pages.forEach(p => {
      const isTarget = p.id === id;
      p.classList.toggle('active', isTarget);
    });
    // Hide hero when not on home
    const hero = qs('.hero');
    if (hero) hero.style.display = id === 'home' ? '' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-page');
      location.hash = id;
      activate(id);
    });
  });
  // hash routing
  window.addEventListener('hashchange', () => {
    const id = (location.hash || '#home').replace('#', '');
    activate(id);
  });
  // initial
  const initial = (location.hash || '#home').replace('#', '');
  activate(initial);
}

// Countdown
function tick() {
  const now = new Date();
  const diff = Math.max(0, COUNTDOWN_TO - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor(diff % 86400000 / 3600000);
  const m = Math.floor(diff % 3600000 / 60000);
  const s = Math.floor(diff % 60000 / 1000);
  const set = (id, val) => { const el = qs('#' + id); if (el) el.textContent = String(val); };
  set('days', d); set('hours', h); set('minutes', m); set('seconds', s);
}

// Private gate + tabs
// Private gate + tabs
function setupPrivate() {
  const gate = qs('#gate');
  const area = qs('#privateArea');
  const input = qs('#pwd');
  const unlock = qs('#unlockBtn');

  const open = () => {
    gate.classList.add('hidden');
    area.classList.remove('hidden');
  };

  const close = () => {
    gate.classList.remove('hidden');
    area.classList.add('hidden');
    if (input) input.value = ""; // clear input for security
  };

  // Always lock on load
  close();

  unlock?.addEventListener('click', async () => {
    const hash = await sha256(input.value.trim());
    if (hash === PASSWORD_HASH) {
      open();
    } else {
      alert('Incorrect password');
      input.value = "";
    }
  });

  input?.addEventListener('keydown', e => {
    if (e.key === 'Enter') { unlock.click(); }
  });

  // Tab buttons
  const tabBtns = qsa('.tab-btn');
  tabBtns.forEach(b => {
    b.addEventListener('click', () => {
      tabBtns.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const tabId = b.getAttribute('data-tab');
      qsa('.tab-content').forEach(c => c.classList.remove('active'));
      qs('#' + tabId)?.classList.add('active');

      // 🔐 Every time user switches to "privateArea", lock it again
      if (tabId === "privateArea") {
        close();
      }
    });
  });

  // 🔐 Also check if page loads directly with #privateArea in URL
  window.addEventListener("hashchange", () => {
    if (location.hash === "#privateArea") {
      close();
    }
  });

  // Force lock if already on #privateArea at first load
  if (location.hash === "#privateArea") {
    close();
  }
}

// ✅ SHA-256 hash of "forever"
const PASSWORD_HASH = "2070f725ff1c765b73c498de52bc419377979691f6100de3ed99794aeb40d988";

// Hashing function
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}


// Remove the old plain-text password
// const PASSWORD = ''; // no longer needed



// Timeline
function setupTimeline() {
  const btn = qs('#timelineBtn');
  const tl = qs('#timeline');
  btn?.addEventListener('click', () => {
    const isHidden = tl.hasAttribute('hidden');
    if (isHidden) tl.removeAttribute('hidden'); else tl.setAttribute('hidden', '');
  });
}

// Splash interactions
function setupSplash() {
  const splash = qs('#splash');
  const enterBtn = qs('#enterBtn');
  const rotateBtn = qs('#rotateBtn');
  // Square one-by-one highlight with blur
  buildSplashSquares(8);
  rotateBtn?.addEventListener('click', () => buildSplashSquares(Math.random() > 0.5 ? 4 : 8));
  enterBtn?.addEventListener('click', () => {
    splash.style.transition = 'opacity .5s ease, transform .6s ease';
    splash.style.opacity = '0';
    splash.style.transform = 'scale(.99)';
    setTimeout(() => splash.style.display = 'none', 600);
  });
}

// Footer year
function setYear() { const y = qs('#year'); if (y) y.textContent = String(new Date().getFullYear()); }

// Boot
window.addEventListener('DOMContentLoaded', () => {
  setupSplash();
  setupNavigation();
  setupPrivate();
  setupTimeline();
  spawnFloating();
  setYear();
  tick();
  setInterval(tick, 1000);
});



