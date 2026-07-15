/* ===== INTRO LOADER ===== */
(function() {
  const loader = document.createElement('div');
  loader.id = 'pageLoader';
  loader.innerHTML = '<div class="loader-flymark" aria-label="André Sadaune">AS<span>.</span></div>';
  document.body.appendChild(loader);

  const minimumDuration = 1850;
  const startedAt = performance.now();
  const previousOverflow = document.documentElement.style.overflow;
  document.documentElement.style.overflow = 'hidden';
  document.body.style.overflow = 'hidden';

  window.addEventListener('load', () => {
    const elapsed = performance.now() - startedAt;
    const remaining = Math.max(0, minimumDuration - elapsed);
    window.setTimeout(() => {
      loader.classList.add('loaded');
      document.documentElement.style.overflow = previousOverflow;
      document.body.style.overflow = '';
      window.setTimeout(() => loader.remove(), 850);
    }, remaining);
  });
})();

/* ===== PARALLAX MOTORCYCLE =====
   Replaced by the refined requestAnimationFrame motion pass below. */

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

const metrics = document.querySelector('.metrics');
let counted = false;
const countObserver = new IntersectionObserver(([entry]) => {
  if (!entry.isIntersecting || counted) return;
  counted = true;
  document.querySelectorAll('[data-count]').forEach((el) => {
    const target = Number(el.dataset.count);
    const decimals = (el.dataset.count.split('.')[1] || '').length;
    const start = performance.now(); const duration = 1300;
    const tick = (now) => {
      const p = Math.min((now-start)/duration,1);
      const val = target*(1-Math.pow(1-p,3));
      el.textContent = decimals > 0 ? val.toFixed(decimals) : Math.round(val);
      if(p<1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}, {threshold:.25});
if(metrics) countObserver.observe(metrics);


/* ===== WAVE SECTION JS ===== */
document.documentElement.classList.add('js');

function scrollToWave(num) {
    const wave = document.getElementById('wave-' + num);
    if (wave) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = wave.getBoundingClientRect().top;
        window.scrollTo({ top: (elementRect - bodyRect) - offset, behavior: 'smooth' });
    }
}

const waveCards = document.querySelectorAll('.wave-card');
const waveNumbers = document.querySelectorAll('.wave-number');
const progressBar = document.getElementById('connectorProgress');
const wavesContainer = document.getElementById('wavesContainer');

const waveObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const waveNum = parseInt(entry.target.dataset.wave);
            waveNumbers.forEach((num, idx) => {
                const numVal = idx + 1;
                if (numVal < waveNum) { num.classList.add('passed'); num.classList.remove('active'); }
                else if (numVal === waveNum) { num.classList.add('active'); num.classList.remove('passed'); }
                else { num.classList.remove('active', 'passed'); }
            });
        }
    });
}, { threshold: 0.3, rootMargin: '-10% 0px' });

waveCards.forEach(card => waveObserver.observe(card));

window.addEventListener('scroll', () => {
    if (progressBar && wavesContainer) {
        const rect = wavesContainer.getBoundingClientRect();
        let progress = 0;
        if (rect.top <= 0) progress = Math.min(1, Math.abs(rect.top) / (rect.height - window.innerHeight));
        progressBar.style.height = (progress * 100) + '%';
    }
});

/* Flip cards */
document.querySelectorAll('.flip-card').forEach(card => {
    let isFlipped = false;
    const companyName = ({ sap: 'SAP', datarobot: 'DataRobot', uipath: 'UiPath', quantpi: 'QuantPi' })[card.dataset.company] || 'career';

    const syncFlipState = () => {
        card.classList.toggle('flipped', isFlipped);
        card.setAttribute('aria-pressed', String(isFlipped));
        card.setAttribute('aria-label', `${isFlipped ? 'Hide' : 'Show'} ${companyName} details`);
    };

    card.addEventListener('click', (e) => {
        if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' || e.target.closest('a') || e.target.classList.contains('section-number')) return;
        isFlipped = !isFlipped;
        syncFlipState();
    });

    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            card.click();
        }
    });

    syncFlipState();
});

/* Bento card mousemove on flip card backs */
document.querySelectorAll('.flip-card').forEach(card => {
    const backFace = card.querySelector('.flip-card-back');
    const backBento = card.querySelector('.flip-card-back .bento-card');
    if (backFace && backBento) {
        backFace.addEventListener('mousemove', (e) => {
            const rect = backBento.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            backBento.style.setProperty('--mouse-x', x + 'px');
            backBento.style.setProperty('--mouse-y', y + 'px');
        });
        backFace.addEventListener('mouseleave', () => {
            backBento.style.setProperty('--mouse-x', '50%');
            backBento.style.setProperty('--mouse-y', '50%');
        });
    }
});

/* Wave number keyboard nav */
waveNumbers.forEach(num => {
    num.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const waveNum = parseInt(num.dataset.wave);
            scrollToWave(waveNum);
        }
    });
});

/* Company logo cursor */
const logoCursor = document.createElement('div');
logoCursor.className = 'logo-cursor';
logoCursor.id = 'logoCursor';
const logoCursorImg = document.createElement('img');
logoCursorImg.alt = '';
logoCursor.appendChild(logoCursorImg);
document.body.appendChild(logoCursor);

let cursorVisible = false;
const companyLogos = {
    'sap': 'https://kimi-web-img.moonshot.cn/img/www.mac-group.com/22fac7259f512633a265536fd6dbaf8e8d4164d9.png',
    'datarobot': 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iOCIgeT0iMTIiIHdpZHRoPSIzMiIgaGVpZ2h0PSI0IiBmaWxsPSJ3aGl0ZSIvPgo8cmVjdCB4PSI4IiB5PSIyMiIgd2lkdGg9IjI0IiBoZWlnaHQ9IjQiIGZpbGw9IndoaXRlIi8+CjxyZWN0IHg9IjgiIHk9IjMyIiB3aWR0aD0iMjgiIGhlaWdodD0iNCIgZmlsbD0id2hpdGUiLz4KPC9zdmc+',
    'uipath': 'https://kimi-web-img.moonshot.cn/img/techtammina.com/c284f37c1c7671a92ef129114412f52a532453a5.png',
    'quantpi': 'https://kimi-web-img.moonshot.cn/img/static.wixstatic.com/46d438a1d41350eaefc1b1870718b4b30f660080.png'
};

document.querySelectorAll('.flip-card').forEach(card => {
    const company = card.dataset.company;
    card.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768 && companyLogos[company]) {
            logoCursorImg.src = companyLogos[company];
            logoCursor.classList.add('visible');
            cursorVisible = true;
            card.style.cursor = 'none';
        }
    });
    card.addEventListener('mouseleave', () => {
        logoCursor.classList.remove('visible');
        cursorVisible = false;
        card.style.cursor = 'pointer';
    });
    card.addEventListener('mousemove', (e) => {
        if (cursorVisible) {
            logoCursor.style.left = e.clientX + 'px';
            logoCursor.style.top = e.clientY + 'px';
        }
    });
});

const waveToCompany = { '1': 'sap', '2': 'datarobot', '3': 'uipath', '4': 'quantpi' };
document.querySelectorAll('.wave-number').forEach(num => {
    const company = waveToCompany[num.dataset.wave];
    if (!company) return;
    num.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768 && companyLogos[company]) {
            logoCursorImg.src = companyLogos[company];
            logoCursor.classList.add('visible');
            cursorVisible = true;
        }
    });
    num.addEventListener('mouseleave', () => {
        logoCursor.classList.remove('visible');
        cursorVisible = false;
    });
    num.addEventListener('mousemove', (e) => {
        if (cursorVisible) {
            logoCursor.style.left = e.clientX + 'px';
            logoCursor.style.top = e.clientY + 'px';
        }
    });
});


/* Animate in-card proof counters when they enter the viewport */
(function(){
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;
  const seen = new WeakSet();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting || seen.has(entry.target)) return;
      seen.add(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '';
      const start = performance.now();
      const duration = 1500;
      const frame = (now) => {
        const p = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
      observer.unobserve(el);
    });
  }, { threshold: 0.45 });
  counters.forEach((el) => observer.observe(el));
})();

/* ===== REFINED JOURNEY + SYSTEM + MOTORCYCLE MOTION ===== */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const systemSection = document.querySelector('.system');
  const framework = document.querySelector('.system-framework');
  if (systemSection) {
    const systemObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) systemSection.classList.add('geometry-active');
    }, { threshold: 0.18 });
    systemObserver.observe(systemSection);
  }

  let ticking = false;
  const updateScrollMotion = () => {
    ticking = false;

    if (systemSection && framework) {
      const r = systemSection.getBoundingClientRect();
      if (r.top < innerHeight && r.bottom > 0) {
        const p = Math.max(0, Math.min(1, (innerHeight - r.top) / (innerHeight + r.height)));
        framework.style.transform = `translate3d(${p * 16}px, ${p * -34}px, 0)`;
      }
    }

  };

  const requestScrollMotion = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(updateScrollMotion);
    }
  };
  addEventListener('scroll', requestScrollMotion, { passive: true });
  addEventListener('resize', requestScrollMotion);
  requestScrollMotion();
})();


/* ===== AUTOMATIC POST-JOURNEY ACTIVATION =====
   On touch devices and narrow screens, hover states are unavailable or sticky.
   Activate the visual state of later-section cards when they move through the
   reading zone, and remove it as the next item takes focus. */
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const targets = [
    ...document.querySelectorAll('.belief-card'),
    ...document.querySelectorAll('.system-card'),
    ...document.querySelectorAll('.route-grid > a'),
    ...document.querySelectorAll('.mindset')
  ];
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const group = entry.target.matches('.belief-card') ? '.belief-card' :
          entry.target.matches('.system-card') ? '.system-card' :
          entry.target.matches('.route-grid > a') ? '.route-grid > a' : '.mindset';
        document.querySelectorAll(group).forEach((el) => el.classList.remove('is-scroll-active'));
        entry.target.classList.add('is-scroll-active');
      } else if (entry.boundingClientRect.top < 0 || entry.boundingClientRect.top > innerHeight) {
        entry.target.classList.remove('is-scroll-active');
      }
    });
  }, {
    threshold: reduceMotion ? 0.15 : 0.42,
    rootMargin: '-22% 0px -38% 0px'
  });

  targets.forEach((el) => observer.observe(el));
})();
