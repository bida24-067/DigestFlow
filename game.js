/**
 * DigestFlow - Core Game Engine & Controller
 * Built with Apple Design System principles (Response, Feedback, Springs, Delights)
 */

class DigestFlowGame {
  constructor() {
    this.currentLevelIndex = 0; // 0 = Level 1, 1 = Level 2, 2 = Level 3
    this.solvedCards = this.loadSavedProgress(); // { 'level-1': Set(...), ... }
    this.revealedHints = {}; // cardId -> count (1 or 2)
    this.score = 0;
    this.streak = 0;
    this.activeFlippedCardId = null;

    // Elements
    this.loadingScreen = document.getElementById('loadingScreen');
    this.loaderBarFill = document.getElementById('loaderBarFill');
    this.loaderStatus = document.getElementById('loaderStatus');
    this.cardsGrid = document.getElementById('cardsGrid');
    this.levelBadge = document.getElementById('levelBadge');
    this.levelHeadline = document.getElementById('levelHeadline');
    this.levelDescription = document.getElementById('levelDescription');
    this.levelProgressText = document.getElementById('levelProgressText');
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.streakDisplay = document.getElementById('streakDisplay');
    this.soundToggleBtn = document.getElementById('soundToggleBtn');
    this.levelTabs = document.querySelectorAll('.level-tab-btn');

    // Modals
    this.levelModal = document.getElementById('levelCompleteModal');
    this.victoryModal = document.getElementById('gameVictoryModal');

    this.confetti = new ConfettiEngine('confettiCanvas');
  }

  init() {
    this.initAudioSync();
    this.setupEventListeners();
    this.simulateAppleBoot(() => {
      this.renderLevel(this.currentLevelIndex);
      this.updateScoreboard();
    });
  }

  /* ==========================================================================
     Initial Loading Screen Sequence (Apple Boot Simulation)
     ========================================================================== */
  simulateAppleBoot(onComplete) {
    const steps = [
      { progress: 25, text: "Calibrating gastrointestinal pathways..." },
      { progress: 55, text: "Synthesizing digestive catalysts & enzymes..." },
      { progress: 85, text: "Configuring tactile card interfaces..." },
      { progress: 100, text: "DigestFlow is ready." }
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        const step = steps[stepIdx];
        if (this.loaderBarFill) this.loaderBarFill.style.width = `${step.progress}%`;
        if (this.loaderStatus) this.loaderStatus.textContent = step.text;
        stepIdx++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          if (this.loadingScreen) {
            this.loadingScreen.classList.add('loaded');
          }
          if (onComplete) onComplete();
        }, 350);
      }
    }, 280);
  }

  /* ==========================================================================
     Persistent Storage
     ========================================================================== */
  loadSavedProgress() {
    try {
      const saved = localStorage.getItem('digestflow_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          1: new Set(parsed['1'] || []),
          2: new Set(parsed['2'] || []),
          3: new Set(parsed['3'] || [])
        };
      }
    } catch (e) {
      console.warn('Could not parse saved progress', e);
    }
    return { 1: new Set(), 2: new Set(), 3: new Set() };
  }

  saveProgress() {
    try {
      const serialized = {
        1: Array.from(this.solvedCards[1]),
        2: Array.from(this.solvedCards[2]),
        3: Array.from(this.solvedCards[3]),
        score: this.score
      };
      localStorage.setItem('digestflow_progress', JSON.stringify(serialized));
    } catch (e) {}
  }

  resetProgress() {
    if (confirm("Reset all game progress back to Level 1?")) {
      audio.playTap();
      localStorage.removeItem('digestflow_progress');
      this.solvedCards = { 1: new Set(), 2: new Set(), 3: new Set() };
      this.revealedHints = {};
      this.score = 0;
      this.streak = 0;
      this.currentLevelIndex = 0;
      this.renderLevel(0);
      this.updateScoreboard();
    }
  }

  initAudioSync() {
    if (this.soundToggleBtn) {
      this.updateSoundBtnUI();
    }
  }

  updateSoundBtnUI() {
    const isMuted = audio.isMuted;
    this.soundToggleBtn.innerHTML = isMuted 
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/></svg><span>Sound Off</span>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5L6 9H2v6h4l5 4V5z"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/></svg><span>Sound On</span>`;
  }

  /* ==========================================================================
     Level & Card Rendering
     ========================================================================== */
  renderLevel(levelIdx) {
    this.currentLevelIndex = levelIdx;
    const levelData = DIGEST_LEVELS[levelIdx];
    const levelNum = levelData.level;

    // Header info
    this.levelBadge.textContent = levelData.badge;
    this.levelHeadline.textContent = levelData.title;
    this.levelDescription.textContent = levelData.subtitle;

    const heroBadge = document.querySelector('.level-pill-badge');
    if (heroBadge && levelData.themeColor) {
      heroBadge.style.setProperty('--hero-badge-border', levelData.themeColor);
      heroBadge.style.setProperty('--hero-badge-text', levelData.themeColor);
    }

    // Level tabs
    this.levelTabs.forEach((tab, idx) => {
      tab.classList.toggle('active', idx === levelIdx);
      tab.setAttribute('aria-selected', idx === levelIdx ? 'true' : 'false');
      const badge = tab.querySelector('.level-tab-badge');
      if (badge) {
        const solvedCount = this.solvedCards[idx + 1].size;
        const totalCount = DIGEST_LEVELS[idx].cards.length;
        const tag = idx === 0 ? 'Core' : idx === 1 ? 'Accessory' : 'Molecular';
        badge.textContent = `${tag} (${solvedCount}/${totalCount})`;
      }
    });

    // Render Cards Grid
    this.renderCards(levelData);

    this.updateProgressSummary();
  }

  renderCards(levelData) {
    const levelNum = levelData.level;
    const solvedSet = this.solvedCards[levelNum];

    this.cardsGrid.innerHTML = levelData.cards.map(card => {
      const isSolved = solvedSet.has(card.id);
      const svgIcon = ORGAN_SVGS[card.icon] || ORGAN_SVGS['mouth'];
      const hintCount = this.revealedHints[card.id] || 0;

      return `
        <div class="card-wrapper ${isSolved ? 'solved' : ''}" 
             id="card-wrap-${card.id}" 
             data-card-id="${card.id}"
             style="--card-color: ${card.color};">
          <div class="card-inner">
            
            <!-- Card Front -->
            <div class="card-face card-front" onclick="game.flipCard('${card.id}')">
              <div class="card-front-top">
                <span class="card-number-chip">STAGE ${card.number}</span>
                <span class="card-status-pill">
                  ${isSolved ? `
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    SOLVED
                  ` : `
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="12" r="8"/>
                    </svg>
                    MYSTERY
                  `}
                </span>
              </div>

              <div class="card-front-visual">
                <div class="card-icon-halo">
                  <div class="card-organ-svg">${svgIcon}</div>
                  <div class="card-emoji-badge">${card.emoji || '🔬'}</div>
                </div>
                <div class="card-mystery-tag">${card.tag}</div>
                <div class="card-mystery-title">${isSolved ? card.name : `Organ #${card.number}`}</div>
              </div>

              <div class="card-front-bottom">
                <span class="flip-prompt">${isSolved ? 'Review Physiological Insights' : 'Tap to inspect & solve'}</span>
                <div class="flip-arrow-circle">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </div>
              </div>
            </div>

            <!-- Card Back (Interactive Hint & Input) -->
            <div class="card-face card-back">
              <div class="card-back-header">
                <span class="card-back-tag">${card.tag}</span>
                <button class="card-flip-back-btn" onclick="game.flipCardBack('${card.id}')" title="Return to grid">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                  <span>Flip Back</span>
                </button>
              </div>

              <div class="card-clue-scroll">
                <div>
                  <div class="clue-label">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                    </svg>
                    Diagnostic Clue
                  </div>
                  <p class="clue-text">${card.clue}</p>
                </div>

                ${isSolved ? `
                  <div class="card-solved-view">
                    <div class="solved-view-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      Correctly Identified: ${card.name}
                    </div>
                    <p class="solved-funfact"><strong>Did you know?</strong> ${card.funFact}</p>
                  </div>
                ` : `
                  <div class="hints-cluster" id="hints-cluster-${card.id}">
                    ${hintCount >= 1 ? `<div class="revealed-hint"><strong>Hint 1:</strong> ${card.hint1}</div>` : ''}
                    ${hintCount >= 2 ? `<div class="revealed-hint"><strong>Hint 2:</strong> ${card.hint2}</div>` : ''}
                    ${hintCount < 2 ? `
                      <button class="hint-chip-btn" onclick="game.revealNextHint('${card.id}')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                        </svg>
                        <span>Need a hint? (${hintCount}/2)</span>
                      </button>
                    ` : ''}
                  </div>
                `}
              </div>

              <!-- Answer Input Container (or Solved Next Button) -->
              <div class="card-input-container">
                ${isSolved ? `
                  <button class="submit-btn" style="width: 100%;" onclick="game.flipCardBack('${card.id}')">
                    Back to All Cards
                  </button>
                ` : `
                  <div class="input-row">
                    <input 
                      type="text" 
                      id="input-${card.id}" 
                      class="answer-input" 
                      placeholder="Identify this organ or term..." 
                      autocomplete="off" 
                      autocorrect="off"
                      spellcheck="false"
                      onkeydown="if(event.key === 'Enter') game.submitAnswer('${card.id}')"
                    />
                    <button class="submit-btn" onclick="game.submitAnswer('${card.id}')" title="Submit Answer">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </button>
                  </div>
                  <div class="input-feedback" id="feedback-${card.id}"></div>
                `}
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');
  }

  /* ==========================================================================
     Card Interaction & Flipping
     ========================================================================== */
  flipCard(cardId) {
    audio.playCardFlip();
    const wrapper = document.getElementById(`card-wrap-${cardId}`);
    if (!wrapper) return;

    // If another card is flipped open, close it first
    if (this.activeFlippedCardId && this.activeFlippedCardId !== cardId) {
      const prevWrapper = document.getElementById(`card-wrap-${this.activeFlippedCardId}`);
      if (prevWrapper) prevWrapper.classList.remove('flipped');
    }

    wrapper.classList.add('flipped');
    this.activeFlippedCardId = cardId;

    // Focus input smoothly after flip start
    setTimeout(() => {
      const input = document.getElementById(`input-${cardId}`);
      if (input) input.focus();
    }, 280);
  }

  flipCardBack(cardId) {
    audio.playTap();
    const wrapper = document.getElementById(`card-wrap-${cardId}`);
    if (wrapper) {
      wrapper.classList.remove('flipped');
    }
    if (this.activeFlippedCardId === cardId) {
      this.activeFlippedCardId = null;
    }
  }

  revealNextHint(cardId) {
    audio.playHint();
    const current = this.revealedHints[cardId] || 0;
    this.revealedHints[cardId] = current + 1;
    
    // Re-render this card back to show newly unlocked hint
    const levelData = DIGEST_LEVELS[this.currentLevelIndex];
    const card = levelData.cards.find(c => c.id === cardId);
    if (!card) return;

    const cluster = document.getElementById(`hints-cluster-${cardId}`);
    if (cluster) {
      const hintCount = this.revealedHints[cardId];
      let html = '';
      if (hintCount >= 1) html += `<div class="revealed-hint"><strong>Hint 1:</strong> ${card.hint1}</div>`;
      if (hintCount >= 2) html += `<div class="revealed-hint"><strong>Hint 2:</strong> ${card.hint2}</div>`;
      if (hintCount < 2) {
        html += `
          <button class="hint-chip-btn" onclick="game.revealNextHint('${card.id}')">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Need a hint? (${hintCount}/2)</span>
          </button>
        `;
      }
      cluster.innerHTML = html;
    }
  }

  /* ==========================================================================
     Answer Validation & Celebration
     ========================================================================== */
  submitAnswer(cardId) {
    const input = document.getElementById(`input-${cardId}`);
    const feedback = document.getElementById(`feedback-${cardId}`);
    const wrapper = document.getElementById(`card-wrap-${cardId}`);
    if (!input || !wrapper) return;

    const rawVal = input.value.trim();
    if (!rawVal) {
      input.focus();
      return;
    }

    const levelData = DIGEST_LEVELS[this.currentLevelIndex];
    const card = levelData.cards.find(c => c.id === cardId);
    if (!card) return;

    const isMatch = this.checkMatch(rawVal, card);

    if (isMatch) {
      // SUCCESS!
      audio.playSuccess();
      this.confetti.burst(window.innerWidth / 2, window.innerHeight / 2);

      // Score calc: 100 base - 15 per hint
      const hintsUsed = this.revealedHints[cardId] || 0;
      const points = Math.max(40, 100 - hintsUsed * 25);
      this.score += points;
      this.streak += 1;
      this.updateScoreboard();

      // Record solved
      this.solvedCards[levelData.level].add(cardId);
      this.saveProgress();

      feedback.className = 'input-feedback success';
      feedback.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        <span>Brilliant! That's correct (+${points} pts)</span>
      `;

      // Re-render whole level to refresh card state and tract journey
      setTimeout(() => {
        this.renderLevel(this.currentLevelIndex);
        // keep this card flipped open to show the celebration fun fact
        this.flipCard(cardId);

        // Check if level is now complete
        this.checkLevelCompletion();
      }, 700);

    } else {
      // INCORRECT
      audio.playError();
      this.streak = 0;
      this.updateScoreboard();

      wrapper.classList.remove('shake');
      void wrapper.offsetWidth; // trigger reflow
      wrapper.classList.add('shake');

      feedback.className = 'input-feedback error';
      feedback.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
        <span>Not quite. Re-read the clues or reveal a hint!</span>
      `;

      input.select();
    }
  }

  normalizeString(str) {
    return str
      .toLowerCase()
      .trim()
      .replace(/^(the|a|an)\s+/i, '') // strip leading articles
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') // remove punctuation
      .replace(/\s+/g, ' ');
  }

  checkMatch(userInput, card) {
    const cleanInput = this.normalizeString(userInput);
    
    // Check primary name and all aliases
    const targets = [card.name, ...card.aliases].map(a => this.normalizeString(a));

    if (targets.includes(cleanInput)) return true;

    // Fuzzy Levenshtein match for small typos (1 char typo tolerance for words >= 5 letters)
    for (const target of targets) {
      if (Math.abs(cleanInput.length - target.length) <= 1 && cleanInput.length >= 5) {
        if (this.levenshtein(cleanInput, target) <= 1) {
          return true;
        }
      }
    }

    return false;
  }

  levenshtein(a, b) {
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  /* ==========================================================================
     Level Completion & Victory Modals
     ========================================================================== */
  checkLevelCompletion() {
    const levelData = DIGEST_LEVELS[this.currentLevelIndex];
    const solvedSet = this.solvedCards[levelData.level];

    if (solvedSet.size === levelData.cards.length) {
      setTimeout(() => {
        audio.playLevelComplete();
        this.confetti.fireShower(3000);

        if (this.currentLevelIndex === 2) {
          // Grand Game Victory!
          this.showVictoryModal();
        } else {
          // Level Completed
          this.showLevelCompleteModal();
        }
      }, 600);
    }
  }

  showLevelCompleteModal() {
    const levelNum = this.currentLevelIndex + 1;
    const modalTitle = document.getElementById('modalTitle');
    const modalSubtitle = document.getElementById('modalSubtitle');
    const modalAccuracy = document.getElementById('modalAccuracy');
    const modalScore = document.getElementById('modalScore');

    if (modalTitle) modalTitle.textContent = `Level ${levelNum} Mastered!`;
    if (modalSubtitle) modalSubtitle.textContent = `You have successfully traced and identified all 6 stages of ${DIGEST_LEVELS[this.currentLevelIndex].title}.`;
    if (modalScore) modalScore.textContent = `${this.score}`;
    if (modalAccuracy) modalAccuracy.textContent = `100%`;

    if (this.levelModal) {
      this.levelModal.classList.add('visible');
    }
  }

  closeLevelModal() {
    audio.playTap();
    if (this.levelModal) this.levelModal.classList.remove('visible');
  }

  proceedToNextLevel() {
    audio.playTap();
    this.closeLevelModal();
    if (this.currentLevelIndex < 2) {
      this.renderLevel(this.currentLevelIndex + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  showVictoryModal() {
    const finalScore = document.getElementById('victoryFinalScore');
    if (finalScore) finalScore.textContent = `${this.score}`;
    if (this.victoryModal) this.victoryModal.classList.add('visible');
  }

  closeVictoryModal() {
    audio.playTap();
    if (this.victoryModal) this.victoryModal.classList.remove('visible');
  }

  /* ==========================================================================
     Scoreboard & UI Updates
     ========================================================================== */
  updateProgressSummary() {
    const levelData = DIGEST_LEVELS[this.currentLevelIndex];
    const solved = this.solvedCards[levelData.level].size;
    const total = levelData.cards.length;
    if (this.levelProgressText) {
      this.levelProgressText.textContent = `${solved} of ${total} Solved`;
    }
  }

  updateScoreboard() {
    if (this.scoreDisplay) this.scoreDisplay.textContent = this.score;
    if (this.streakDisplay) this.streakDisplay.textContent = this.streak;
    this.updateProgressSummary();
  }

  setupEventListeners() {
    // Sound Toggle
    if (this.soundToggleBtn) {
      this.soundToggleBtn.addEventListener('click', () => {
        audio.toggleMute();
        this.updateSoundBtnUI();
      });
    }

    // Level Tab Buttons
    this.levelTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => {
        if (!tab.disabled) {
          audio.playTap();
          this.renderLevel(idx);
        }
      });
    });

    // Global Keydown (Escape to flip back active card or dismiss modal)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.levelModal && this.levelModal.classList.contains('visible')) {
          this.closeLevelModal();
          return;
        }
        if (this.victoryModal && this.victoryModal.classList.contains('visible')) {
          this.closeVictoryModal();
          return;
        }
        if (this.activeFlippedCardId) {
          this.flipCardBack(this.activeFlippedCardId);
        }
      }
    });
  }
}

/* ==========================================================================
   Lightweight High-Performance Confetti Engine (Canvas-based)
   ========================================================================== */
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;

    if (this.canvas) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 55) {
    if (!this.ctx) return;
    const colors = ['#FF5E7E', '#FFAE34', '#00C6FF', '#10B981', '#8B5CF6', '#EC4899', '#FFD60A', '#FF375F', '#00E5FF', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3,
        size: 5 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        alpha: 1,
        gravity: 0.22,
        drag: 0.96
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.render();
    }
  }

  fireShower(durationMs = 2500) {
    const end = Date.now() + durationMs;
    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }
      this.burst(Math.random() * window.innerWidth, window.innerHeight * 0.3, 20);
    }, 220);
  }

  render() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.012;

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.4);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Global instance initialized on DOMContentLoaded
let game = null;
window.addEventListener('DOMContentLoaded', () => {
  game = new DigestFlowGame();
  game.init();
});
