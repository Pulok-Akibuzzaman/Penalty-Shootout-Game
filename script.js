// ── DOM References ──
const screens = {
  welcome:  document.getElementById('welcome-screen'),
  setup:    document.getElementById('setup-screen'),
  game:     document.getElementById('game-screen'),
  gameover: document.getElementById('gameover-screen'),
  about:    document.getElementById('about-screen')
};

const els = {
  btnStart:      document.getElementById('btn-start'),
  btnAbout:      document.getElementById('btn-about'),
  btnPlay:       document.getElementById('btn-play'),
  btnBackSetup:  document.getElementById('btn-back-setup'),
  btnBackAbout:  document.getElementById('btn-back-about'),
  btnRestart:    document.getElementById('btn-restart'),
  btnHome:       document.getElementById('btn-home'),
  playerName:    document.getElementById('player-name'),
  countrySelect: document.getElementById('country-select'),
  currentScore:  document.getElementById('current-score'),
  highScore:     document.getElementById('high-score'),
  livesDisplay:  document.getElementById('lives-display'),
  playerDisplay: document.getElementById('player-display'),
  goalkeeper:    document.getElementById('goalkeeper'),
  ball:          document.getElementById('ball'),
  resultText:    document.getElementById('result-text'),
  finalScore:    document.getElementById('final-score-text'),
  finalHigh:     document.getElementById('final-highscore-text'),
  newRecord:     document.getElementById('new-record'),
  dirButtons:    document.querySelectorAll('.btn-dir')
};

// ── Game State ──
let score = 0;
let lives = 3;
let highScore = parseInt(localStorage.getItem('penaltyHighScore')) || 0;
let isAnimating = false;

const DIRECTIONS = ['left', 'center', 'right'];

// ── Audio helpers (Web Audio API – no external files needed) ──
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, duration, type) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type || 'sine';
  osc.frequency.value = freq;
  gain.gain.value = 0.12;
  osc.connect(gain).connect(audioCtx.destination);
  osc.start();
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.stop(audioCtx.currentTime + duration);
}

function soundKick()  { playTone(180, 0.15, 'triangle'); }
function soundGoal()  { playTone(523, 0.12, 'square'); setTimeout(() => playTone(659, 0.12, 'square'), 120); setTimeout(() => playTone(784, 0.25, 'square'), 240); }
function soundMiss()  { playTone(200, 0.3, 'sawtooth'); setTimeout(() => playTone(140, 0.4, 'sawtooth'), 150); }

// ── Screen Navigation ──
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
}

// ── UI Updates ──
function updateHUD() {
  els.currentScore.textContent = score;
  els.highScore.textContent = highScore;
  const hearts = '❤️'.repeat(lives) + '🖤'.repeat(3 - lives);
  els.livesDisplay.textContent = hearts;
}

function resetField() {
  els.ball.className = 'ball';
  els.goalkeeper.className = 'goalkeeper';
  els.resultText.textContent = '';
  els.resultText.className = 'result-text';
}

// ── Core Gameplay ──
function shoot(playerDir) {
  if (isAnimating) return;
  isAnimating = true;
  setDirectionButtons(false);

  const keeperDir = DIRECTIONS[Math.floor(Math.random() * 3)];

  soundKick();

  // Animate ball
  els.ball.classList.add('shoot-' + playerDir);

  // Animate goalkeeper
  if (keeperDir !== 'center') {
    els.goalkeeper.classList.add('dive-' + keeperDir);
  }

  setTimeout(() => {
    const scored = playerDir !== keeperDir;

    if (scored) {
      score++;
      soundGoal();
      els.resultText.textContent = '⚽ GOAL! 🎉';
      els.resultText.className = 'result-text goal';
    } else {
      lives--;
      soundMiss();
      els.resultText.textContent = '🧤 SAVED! ❌';
      els.resultText.className = 'result-text miss';
    }

    updateHUD();

    if (lives <= 0) {
      setTimeout(() => endGame(), 1000);
      return;
    }

    setTimeout(() => {
      resetField();
      isAnimating = false;
      setDirectionButtons(true);
    }, 900);
  }, 500);
}

function setDirectionButtons(enabled) {
  els.dirButtons.forEach(b => b.disabled = !enabled);
}

function startGame() {
  score = 0;
  lives = 3;
  resetField();
  updateHUD();
  setDirectionButtons(true);
  showScreen('game');
}

function endGame() {
  let isNewRecord = false;
  if (score > highScore) {
    highScore = score;
    localStorage.setItem('penaltyHighScore', highScore);
    isNewRecord = true;
  }

  els.finalScore.textContent = 'Your Score: ' + score;
  els.finalHigh.textContent = 'High Score: ' + highScore;
  els.newRecord.style.display = isNewRecord ? 'block' : 'none';
  showScreen('gameover');
}

// ── Event Listeners ──
els.btnStart.addEventListener('click', () => showScreen('setup'));
els.btnAbout.addEventListener('click', () => showScreen('about'));
els.btnBackSetup.addEventListener('click', () => showScreen('welcome'));
els.btnBackAbout.addEventListener('click', () => showScreen('welcome'));
els.btnRestart.addEventListener('click', startGame);
els.btnHome.addEventListener('click', () => { resetField(); showScreen('welcome'); });

els.btnPlay.addEventListener('click', () => {
  const name = els.playerName.value.trim();
  const country = els.countrySelect.value;
  if (!name) { alert('Please enter your name.'); return; }
  if (!country) { alert('Please select a country.'); return; }
  els.playerDisplay.textContent = name + ' ' + country.split(' ')[0];
  startGame();
});

els.dirButtons.forEach(btn => {
  btn.addEventListener('click', () => shoot(btn.dataset.dir));
});

// ── Init ──
updateHUD();
