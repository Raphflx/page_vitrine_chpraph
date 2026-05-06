const GAME_BASE = 'socket-jump-files/index';

const canvas        = document.getElementById('canvas');
const loader        = document.getElementById('loader');
const loaderRing    = document.getElementById('loaderRing');
const progressTrack = document.getElementById('progressTrack');
const progressFill  = document.getElementById('progressFill');
const loaderStatus  = document.getElementById('loaderStatus');
const errorState    = document.getElementById('error-state');
const errorMsg      = document.getElementById('errorMsg');
const fsBtn         = document.getElementById('fsBtn');
const fsIcon        = document.getElementById('fsIcon');
const canvasArea    = document.getElementById('canvasArea');

// ── Fullscreen ──────────────────────────────────────────────────────────────
const FS_ICON_EXPAND = `<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>`;
const FS_ICON_EXIT   = `<polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="10" y1="14" x2="3" y2="21"/><line x1="21" y1="3" x2="14" y2="10"/>`;

fsBtn.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    canvasArea.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen();
  }
});

document.addEventListener('fullscreenchange', () => {
  const isFs = !!document.fullscreenElement;
  fsIcon.innerHTML = isFs ? FS_ICON_EXIT : FS_ICON_EXPAND;
  fsBtn.setAttribute('aria-label', isFs ? 'Quitter le plein écran' : 'Plein écran');
});

// ── Helpers loader ──────────────────────────────────────────────────────────
function setStatus(text) {
  loaderStatus.textContent = text;
}

function setProgress(pct) {
  pct = Math.min(100, pct);
  loaderRing.classList.remove('indeterminate');
  progressTrack.style.opacity = '1';
  progressFill.style.width = pct + '%';
  loaderRing.querySelector('.fill').style.strokeDashoffset = 163 - (163 * pct / 100);
  setStatus(Math.round(pct) + '% — Chargement des ressources…');
}

function hideLoader() {
  loader.classList.add('fade-out');
  setTimeout(() => { loader.style.display = 'none'; }, 520);
  canvas.focus();
}

function showError(message) {
  loader.style.display = 'none';
  errorMsg.textContent = message;
  errorState.classList.add('visible');
}

// ── Chargement du moteur Godot ──────────────────────────────────────────────
setStatus('Chargement du moteur…');

const engineScript = document.createElement('script');
engineScript.src = GAME_BASE + '.js';

engineScript.addEventListener('error', () => {
  showError('Fichier introuvable : "' + GAME_BASE + '.js"\nVérifie que les fichiers de l\'export sont dans games/socket-jump-files/.');
});

engineScript.addEventListener('load', () => {
  setStatus('Moteur chargé — initialisation…');

  if (typeof Engine === 'undefined') {
    showError('La classe Engine est introuvable.\nVérifie que index.js provient bien d\'un export Godot Web.');
    return;
  }

  const missing = Engine.getMissingFeatures({ threads: false });
  if (missing.length > 0) {
    showError('Fonctionnalités manquantes dans ce navigateur :\n' + missing.join('\n'));
    return;
  }

  const engine = new Engine({
    args:                              [],
    canvas:                            canvas,
    canvasResizePolicy:                2,
    emscriptenPoolSize:                8,
    ensureCrossOriginIsolationHeaders: false,
    executable:                        GAME_BASE,
    experimentalVK:                    false,
    fileSizes: {
      'socket-jump-files/index.pck':  10206804,
      'socket-jump-files/index.wasm': 35739700,
    },
    focusCanvas:                       true,
    gdextensionLibs:                   [],
    godotPoolSize:                     4,
  });

  engine.startGame({
    onProgress(current, total) {
      if (current > 0 && total > 0) {
        setProgress((current / total) * 100);
      }
    },
  })
  .then(() => {
    setProgress(100);
    setTimeout(hideLoader, 350);
  })
  .catch(() => {
    showError('Une erreur est survenue lors du démarrage du jeu. Essaie de recharger la page.');
  });
});

document.head.appendChild(engineScript);
