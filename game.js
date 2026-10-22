/**
 * DigestBeach - Snakes & Ladders Edition
 * Full Board Game Engine:
 * - 36-Tile Serpentine Grid (Snakes & Ladders style)
 * - Question Challenge on EVERY dice roll (+1 Point per correct answer)
 * - Bot rolls require player answer input
 * - Lucky 6 Rewards: Double Question Challenge (+2 Points max) + Bonus Extra Turn!
 * - Complete Board Progress Visualization (Start, Visited Path, Current Position, & Milestones)
 * - 🪜 Bamboo Ladders & 🐍 Beach Water-Slides
 * - 1-Player vs Crabby CPU, 2-Player Pass & Play, or Solo Explorer
 */

class SnakesAndLaddersGame {
  constructor() {
    this.config = SNAKES_AND_LADDERS_CONFIG;
    this.allCards = ALL_ORGAN_CARDS;
    
    // Players state
    this.gameMode = 'vs-cpu'; // 'vs-cpu', 'pass-and-play', or 'solo'
    this.currentPlayer = 1; // 1 or 2
    this.player1 = {
      id: 'p1',
      name: 'Player 1',
      emoji: '🏄‍♂️',
      position: 1,
      score: 0, // Points earned from correct answers
      isCPU: false
    };
    this.player2 = {
      id: 'p2',
      name: 'Barnaby Crab',
      emoji: '🦀',
      position: 1,
      score: 0,
      isCPU: true
    };

    this.isRolling = false;
    this.isMoving = false;
    this.isGameOver = false;
    this.totalQuestionsSolved = 0;

    // Active dice roll challenge state
    this.pendingChallenge = null;

    this.confetti = typeof ConfettiEngine !== 'undefined' ? new ConfettiEngine('confettiCanvas') : null;
  }

  init() {
    this.initAudioSync();
    this.setupEventListeners();
    this.renderBoardGrid();
    this.drawLaddersAndSnakesOverlay();
    window.addEventListener('resize', () => this.drawLaddersAndSnakesOverlay());
    
    // Initial UI
    this.updateTokensUI();
    this.updateBoardProgressUI();
    this.updateTurnBanner();
    this.updateScoreboard();

    // Hide loader
    setTimeout(() => {
      const loader = document.getElementById('loadingScreen');
      if (loader) loader.classList.add('loaded');
    }, 400);
  }

  initAudioSync() {
    const btn = document.getElementById('soundToggleBtn');
    if (btn) {
      btn.innerHTML = audio.isMuted ? '<span>🔇 Sound Off</span>' : '<span>🔊 Sound On</span>';
      btn.addEventListener('click', () => {
        audio.toggleMute();
        btn.innerHTML = audio.isMuted ? '<span>🔇 Sound Off</span>' : '<span>🔊 Sound On</span>';
      });
    }
  }

  /* ==========================================================================
     Board Generation (6x6 Serpentine Grid)
     ========================================================================== */
  renderBoardGrid() {
    const grid = document.getElementById('snakesBoardGrid');
    if (!grid) return;

    let html = '';

    // Rows 5 down to 0 on screen
    for (let r = 5; r >= 0; r--) {
      const isEvenRow = (r % 2 === 0);
      for (let c = 0; c < 6; c++) {
        const colInRow = isEvenRow ? c : (5 - c);
        const tileNum = r * 6 + colInRow + 1;
        const tileData = this.config.tiles[tileNum];

        // Is this a ladder start or snake start?
        const ladder = this.config.ladders.find(l => l.from === tileNum);
        const snake = this.config.snakes.find(s => s.from === tileNum);

        let icon = '';
        let badge = '';
        let tileTypeClass = 'normal';

        if (tileNum === 1) {
          icon = '🏖️';
          badge = 'START: Mouth 👄';
          tileTypeClass = 'start';
        } else if (tileNum === 36) {
          icon = '🏆';
          badge = 'FINISH: Champion';
          tileTypeClass = 'finish';
        } else if (ladder) {
          icon = '🪜';
          badge = `Up to ${ladder.to}!`;
          tileTypeClass = 'ladder-start';
        } else if (snake) {
          icon = '🐍';
          badge = `Slide to ${snake.to}!`;
          tileTypeClass = 'snake-start';
        } else if (tileData) {
          if (tileData.type === 'organ') {
            const card = this.allCards.find(k => k.id === tileData.cardId);
            icon = card ? card.emoji : '🔬';
            badge = card ? card.name : tileData.name;
            tileTypeClass = 'organ';
          } else if (tileData.type === 'bonus') {
            icon = tileData.bonusType === 'coconut' ? '🥥' : (tileData.bonusType === 'starfish' ? '⭐' : (tileData.bonusType === 'shell' ? '🐚' : '🏐'));
            badge = tileData.name;
            tileTypeClass = 'bonus';
          }
        }

        // Color pattern for tiles
        const colorClasses = ['tile-yellow', 'tile-blue', 'tile-sand', 'tile-green', 'tile-pink', 'tile-peach'];
        const colorClass = colorClasses[(tileNum + r) % colorClasses.length];

        html += `
          <div class="board-square ${colorClass} ${tileTypeClass}" 
               id="square-${tileNum}" 
               data-tile="${tileNum}"
               onclick="game.onSquareClick(${tileNum})">
            
            <div class="square-number">${tileNum}</div>
            
            <div class="square-center">
              <div class="square-icon">${icon}</div>
              ${badge ? `<div class="square-badge">${badge}</div>` : ''}
            </div>

            <!-- Token slots for Player 1 and Player 2 -->
            <div class="tokens-container" id="tokens-${tileNum}"></div>
          </div>
        `;
      }
    }

    grid.innerHTML = html;
  }

  /* ==========================================================================
     SVG Overlay for Ladders and Snakes (Normalized 600x600 ViewBox)
     ========================================================================== */
  drawLaddersAndSnakesOverlay() {
    const svg = document.getElementById('snakesSvgOverlay');
    if (!svg) return;

    svg.setAttribute('viewBox', '0 0 600 600');

    let svgContent = '';

    const getSquareCenter = (tileNum) => {
      const rowFromBottom = Math.floor((tileNum - 1) / 6);
      const isEvenRow = (rowFromBottom % 2 === 0);
      const colInRow = (tileNum - 1) % 6;
      const c = isEvenRow ? colInRow : (5 - colInRow);
      const r = 5 - rowFromBottom;
      return {
        x: c * 100 + 50,
        y: r * 100 + 50
      };
    };

    // 1. Draw 🪜 Ladders (Bamboo / Beach Wood style)
    this.config.ladders.forEach(l => {
      const p1 = getSquareCenter(l.from); // bottom
      const p2 = getSquareCenter(l.to);   // top

      const dx = p2.x - p1.x;
      const dy = p2.y - p1.y;
      const angle = Math.atan2(dy, dx);
      const ladderWidth = 18;

      const perpX = Math.cos(angle + Math.PI / 2) * (ladderWidth / 2);
      const perpY = Math.sin(angle + Math.PI / 2) * (ladderWidth / 2);

      const r1x1 = p1.x - perpX, r1y1 = p1.y - perpY;
      const r1x2 = p2.x - perpX, r1y2 = p2.y - perpY;
      const r2x1 = p1.x + perpX, r2y1 = p1.y + perpY;
      const r2x2 = p2.x + perpX, r2y2 = p2.y + perpY;

      svgContent += `
        <!-- Ladder Rails -->
        <line x1="${r1x1}" y1="${r1y1}" x2="${r1x2}" y2="${r1y2}" stroke="#92400E" stroke-width="7" stroke-linecap="round"/>
        <line x1="${r1x1}" y1="${r1y1}" x2="${r1x2}" y2="${r1y2}" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
        <line x1="${r2x1}" y1="${r2y1}" x2="${r2x2}" y2="${r2y2}" stroke="#92400E" stroke-width="7" stroke-linecap="round"/>
        <line x1="${r2x1}" y1="${r2y1}" x2="${r2x2}" y2="${r2y2}" stroke="#FCD34D" stroke-width="3" stroke-linecap="round"/>
      `;

      const dist = Math.hypot(dx, dy);
      const rungsCount = Math.max(3, Math.floor(dist / 32));
      for (let i = 1; i < rungsCount; i++) {
        const t = i / rungsCount;
        const rx1 = r1x1 + (r1x2 - r1x1) * t;
        const ry1 = r1y1 + (r1y2 - r1y1) * t;
        const rx2 = r2x1 + (r2x2 - r2x1) * t;
        const ry2 = r2y1 + (r2y2 - r2y1) * t;

        svgContent += `
          <line x1="${rx1}" y1="${ry1}" x2="${rx2}" y2="${ry2}" stroke="#78350F" stroke-width="5" stroke-linecap="round"/>
          <line x1="${rx1}" y1="${ry1}" x2="${rx2}" y2="${ry2}" stroke="#FEF3C7" stroke-width="2" stroke-linecap="round"/>
        `;
      }
    });

    // 2. Draw 🐍 Beach Waterslides / Sea Snakes
    this.config.snakes.forEach((s, sIdx) => {
      const pHead = getSquareCenter(s.from); // top
      const pTail = getSquareCenter(s.to);   // bottom

      const midX = (pHead.x + pTail.x) / 2;
      const midY = (pHead.y + pTail.y) / 2;
      const waveOffset = (sIdx % 2 === 0 ? 45 : -45);
      const ctrlX = midX + waveOffset;
      const ctrlY = midY;

      const snakeColors = ['#10B981', '#EC4899', '#8B5CF6', '#F43F5E'];
      const color = snakeColors[sIdx % snakeColors.length];

      svgContent += `
        <!-- Snake Shadow -->
        <path d="M ${pHead.x} ${pHead.y} Q ${ctrlX} ${ctrlY} ${pTail.x} ${pTail.y}" 
              stroke="#000000" stroke-width="20" fill="none" opacity="0.16" stroke-linecap="round"/>
        <!-- Snake Outer Body -->
        <path d="M ${pHead.x} ${pHead.y} Q ${ctrlX} ${ctrlY} ${pTail.x} ${pTail.y}" 
              stroke="#064E3B" stroke-width="16" fill="none" stroke-linecap="round"/>
        <!-- Snake Inner Color -->
        <path d="M ${pHead.x} ${pHead.y} Q ${ctrlX} ${ctrlY} ${pTail.x} ${pTail.y}" 
              stroke="${color}" stroke-width="13" fill="none" stroke-linecap="round"/>
        <!-- Snake Highlight Dots / Stripes -->
        <path d="M ${pHead.x} ${pHead.y} Q ${ctrlX} ${ctrlY} ${pTail.x} ${pTail.y}" 
              stroke="#FFFFFF" stroke-width="3.5" stroke-dasharray="8 14" fill="none" stroke-linecap="round" opacity="0.8"/>
        
        <!-- Snake Head -->
        <circle cx="${pHead.x}" cy="${pHead.y}" r="14" fill="${color}" stroke="#FFFFFF" stroke-width="2.5"/>
        <circle cx="${pHead.x - 4}" cy="${pHead.y - 4}" r="3" fill="#FFFFFF"/>
        <circle cx="${pHead.x - 4}" cy="${pHead.y - 4}" r="1.5" fill="#000000"/>
        <circle cx="${pHead.x + 4}" cy="${pHead.y - 4}" r="3" fill="#FFFFFF"/>
        <circle cx="${pHead.x + 4}" cy="${pHead.y - 4}" r="1.5" fill="#000000"/>
        
        <!-- Tongue -->
        <path d="M ${pHead.x} ${pHead.y + 12} L ${pHead.x} ${pHead.y + 20} L ${pHead.x - 3} ${pHead.y + 24} M ${pHead.x} ${pHead.y + 20} L ${pHead.x + 3} ${pHead.y + 24}" 
              stroke="#EF4444" stroke-width="2" stroke-linecap="round"/>

        <!-- Snake Tail -->
        <circle cx="${pTail.x}" cy="${pTail.y}" r="5" fill="${color}"/>
      `;
    });

    svg.innerHTML = svgContent;
  }

  /* ==========================================================================
     Player Pawns UI
     ========================================================================== */
  updateTokensUI() {
    // Clear all token containers
    document.querySelectorAll('.tokens-container').forEach(c => c.innerHTML = '');

    const renderToken = (player, pNum) => {
      const container = document.getElementById(`tokens-${player.position}`);
      if (container) {
        const token = document.createElement('div');
        token.className = `board-token token-p${pNum}`;
        token.title = `${player.name} (Tile ${player.position})`;
        token.innerHTML = `<span class="token-emoji">${player.emoji}</span>`;
        container.appendChild(token);
      }
    };

    renderToken(this.player1, 1);
    if (this.gameMode !== 'solo') {
      renderToken(this.player2, 2);
    }

    // Update sidebar badges
    const p1Badge = document.getElementById('p1PosBadge');
    const p2Badge = document.getElementById('p2PosBadge');
    const p2PillBox = document.getElementById('p2PillBox');
    const p2Name = document.getElementById('p2NameBadge');
    const p1Points = document.getElementById('p1PointsBadge');
    const p2Points = document.getElementById('p2PointsBadge');

    if (p1Badge) p1Badge.textContent = `Tile ${this.player1.position}`;
    if (p2Badge) p2Badge.textContent = `Tile ${this.player2.position}`;
    if (p2Name) p2Name.textContent = this.player2.name;
    if (p1Points) p1Points.textContent = `${this.player1.score} pts`;
    if (p2Points) p2Points.textContent = `${this.player2.score} pts`;
    if (p2PillBox) p2PillBox.style.display = this.gameMode === 'solo' ? 'none' : 'flex';
  }

  /* ==========================================================================
     Board Progress Visualization (Start, Visited Path, Milestones & Progress Bar)
     ========================================================================== */
  updateBoardProgressUI() {
    const p1Pos = this.player1.position;
    const p2Pos = this.player2.position;
    const maxReached = Math.max(p1Pos, this.gameMode === 'solo' ? p1Pos : p2Pos);

    // 1. Highlight tiles on the 6x6 board
    for (let t = 1; t <= 36; t++) {
      const square = document.getElementById(`square-${t}`);
      if (!square) continue;

      // Remove previous dynamic classes
      square.classList.remove('tile-visited', 'tile-current-p1', 'tile-current-p2');

      // If tile is in the path traveled from start
      if (t <= maxReached && t > 1 && t < 36) {
        square.classList.add('tile-visited');
      }

      // Active current positions
      if (t === p1Pos) square.classList.add('tile-current-p1');
      if (this.gameMode !== 'solo' && t === p2Pos) square.classList.add('tile-current-p2');
    }

    // 2. Update Digestive Journey Progress Tracker Bar
    const progressPct = Math.min(100, Math.round((p1Pos / 36) * 100));
    const p2ProgressPct = Math.min(100, Math.round((p2Pos / 36) * 100));

    const fillElem = document.getElementById('journeyBarFill');
    const pctBadge = document.getElementById('journeyPctBadge');
    const statusText = document.getElementById('journeyStatusText');
    const avatarP1 = document.getElementById('journeyAvatarP1');
    const avatarP2 = document.getElementById('journeyAvatarP2');

    if (fillElem) fillElem.style.width = `${progressPct}%`;
    if (pctBadge) pctBadge.textContent = `${progressPct}% Complete`;
    if (avatarP1) {
      avatarP1.style.left = `${progressPct}%`;
      avatarP1.textContent = this.player1.emoji;
    }
    if (avatarP2) {
      avatarP2.style.left = `${p2ProgressPct}%`;
      avatarP2.textContent = this.player2.emoji;
      avatarP2.style.display = this.gameMode === 'solo' ? 'none' : 'flex';
    }

    // Contextual status text based on digestive tract location
    let stageDescription = '';
    if (p1Pos === 1) {
      stageDescription = 'Tile 1 of 36 • Mouth & Chewing Station (Start of Journey!)';
    } else if (p1Pos < 5) {
      stageDescription = `Tile ${p1Pos} of 36 • Chewed food softened with saliva, heading downward`;
    } else if (p1Pos < 9) {
      stageDescription = `Tile ${p1Pos} of 36 • Food Pipe (Esophagus) wave squeezes toward stomach`;
    } else if (p1Pos < 13) {
      stageDescription = `Tile ${p1Pos} of 36 • Stomach Acid Blender churning food into smooth liquid`;
    } else if (p1Pos < 19) {
      stageDescription = `Tile ${p1Pos} of 36 • Liver & Bile Factory breaking down fats`;
    } else if (p1Pos < 27) {
      stageDescription = `Tile ${p1Pos} of 36 • Gallbladder & Pancreas enzyme juice balancing`;
    } else if (p1Pos < 31) {
      stageDescription = `Tile ${p1Pos} of 36 • Small Intestine soaking up vitamins into blood`;
    } else if (p1Pos < 34) {
      stageDescription = `Tile ${p1Pos} of 36 • Large Intestine drinking back water to keep body hydrated`;
    } else if (p1Pos < 36) {
      stageDescription = `Tile ${p1Pos} of 36 • Gut Microbiome friendly bugs making vitamins!`;
    } else {
      stageDescription = 'Tile 36 of 36 • Grand Finish! Complete Digestive Mastery Champion! 🏆';
    }

    if (statusText) statusText.textContent = stageDescription;

    // 3. Update milestone chips along the tract
    const milestones = [
      { id: 'ms-mouth', tile: 1 },
      { id: 'ms-esophagus', tile: 5 },
      { id: 'ms-stomach', tile: 9 },
      { id: 'ms-liver', tile: 13 },
      { id: 'ms-small', tile: 27 },
      { id: 'ms-large', tile: 31 },
      { id: 'ms-finish', tile: 36 }
    ];

    milestones.forEach(m => {
      const chip = document.getElementById(m.id);
      if (chip) {
        if (p1Pos >= m.tile) {
          chip.classList.add('completed');
          chip.classList.remove('active');
        } else {
          chip.classList.remove('completed', 'active');
        }
      }
    });
  }

  /* ==========================================================================
     Dice Rolling & Turn System
     ========================================================================== */
  rollDice() {
    if (this.isRolling || this.isMoving || this.isGameOver) return;

    audio.playDiceRoll();
    this.isRolling = true;

    const dieElem = document.getElementById('beachDie');
    const rollBtn = document.getElementById('rollDiceBtn');
    if (rollBtn) rollBtn.disabled = true;

    if (dieElem) dieElem.classList.add('rolling');

    // Standard 6-sided die
    const rollValue = Math.floor(Math.random() * 6) + 1;

    setTimeout(() => {
      if (dieElem) {
        dieElem.classList.remove('rolling');
        this.renderDieFace(dieElem, rollValue);
      }
      this.isRolling = false;

      const activePlayer = this.currentPlayer === 1 ? this.player1 : this.player2;

      // Check if rolling a 6: LUCKY 6 REWARDS!
      const isLucky6 = (rollValue === 6);

      if (isLucky6) {
        audio.playSuccess();
        this.showToast("🌟 LUCKY 6 ROLLED!", "Double Question Challenge! Earn up to 2 points + an Extra Turn!");
      } else {
        this.showToast(`🎲 Rolled a ${rollValue}!`, `Solve the digestive question to advance!`);
      }

      // Open question challenge (Single question for 1-5, Double question for 6)
      // Bot rolls also require input from the student!
      setTimeout(() => {
        this.startRollQuestionChallenge(rollValue, isLucky6, activePlayer);
      }, 450);

    }, 650);
  }

  renderDieFace(dieElem, val) {
    const pips = {
      1: '<div class="pip center"></div>',
      2: '<div class="pip top-left"></div><div class="pip bottom-right"></div>',
      3: '<div class="pip top-left"></div><div class="pip center"></div><div class="pip bottom-right"></div>',
      4: '<div class="pip top-left"></div><div class="pip top-right"></div><div class="pip bottom-left"></div><div class="pip bottom-right"></div>',
      5: '<div class="pip top-left"></div><div class="pip top-right"></div><div class="pip center"></div><div class="pip bottom-left"></div><div class="pip bottom-right"></div>',
      6: '<div class="pip top-left"></div><div class="pip top-right"></div><div class="pip mid-left"></div><div class="pip mid-right"></div><div class="pip bottom-left"></div><div class="pip bottom-right"></div>'
    };
    dieElem.innerHTML = pips[val] || pips[1];
  }

  /* ==========================================================================
     Roll Question Challenge (Triggered on EVERY dice roll)
     - Roll 1-5: 1 Question (+1 Point)
     - Roll 6: 2 Questions (+2 Points max) + Bonus Extra Turn
     - Bot rolls require player answer input
     ========================================================================== */
  startRollQuestionChallenge(rollValue, isLucky6, activePlayer) {
    this.pendingChallenge = {
      rollValue: rollValue,
      isLucky6: isLucky6,
      questionStep: 1,
      totalQuestions: isLucky6 ? 2 : 1,
      pointsEarned: 0,
      activePlayer: activePlayer,
      currentQuestion: getRandomDigestiveQuestion()
    };

    this.renderChallengeModal();
  }

  renderChallengeModal() {
    const modal = document.getElementById('organQuestionModal');
    if (!modal || !this.pendingChallenge) return;

    const { rollValue, isLucky6, questionStep, totalQuestions, activePlayer, currentQuestion } = this.pendingChallenge;

    const header = document.getElementById('modalChallengeHeader');
    const iconBadge = document.getElementById('modalOrganIcon');
    const organTag = document.getElementById('modalOrganTag');
    const qLabel = document.getElementById('modalQuestionLabel');
    const qText = document.getElementById('modalOrganRiddle');
    const optionsContainer = document.getElementById('modalOptionsContainer');
    const hintBox = document.getElementById('modalHintBox');
    const funFactBox = document.getElementById('modalFunFactBox');
    const actionContainer = document.getElementById('modalActionContainer');

    if (hintBox) hintBox.style.display = 'none';
    if (funFactBox) funFactBox.style.display = 'none';

    // Header styling
    if (header) {
      if (isLucky6) {
        header.className = 'modal-challenge-header lucky6';
        header.innerHTML = `🌟 LUCKY 6 CHALLENGE! (Question ${questionStep} of ${totalQuestions}) • +1 Pt each`;
      } else if (activePlayer.isCPU) {
        header.className = 'modal-challenge-header';
        header.innerHTML = `🦀 Help Barnaby Crab! (Rolled a ${rollValue}) • Solve to advance Barnaby!`;
      } else {
        header.className = 'modal-challenge-header';
        header.innerHTML = `🎲 ${activePlayer.name} rolled a ${rollValue}! Solve to advance!`;
      }
    }

    if (iconBadge) iconBadge.innerHTML = `<span style="font-size: 3rem;">${currentQuestion.emoji}</span>`;
    if (organTag) organTag.textContent = `${currentQuestion.topic} • Earn 1 Point ⭐`;
    if (qLabel) qLabel.textContent = `🗣️ Question ${questionStep} of ${totalQuestions}:`;
    if (qText) qText.textContent = currentQuestion.question;

    if (optionsContainer) {
      optionsContainer.innerHTML = currentQuestion.options.map((optText, optIdx) => `
        <button class="kid-option-btn" 
                id="opt-btn-${optIdx}"
                onclick="game.answerRollQuestion(${optIdx})">
          <span class="opt-label">${optText}</span>
          <span class="opt-status"></span>
        </button>
      `).join('');
    }

    if (actionContainer) {
      actionContainer.innerHTML = `
        <div class="modal-action-row">
          <button class="beach-hint-btn" onclick="game.showCurrentHint()">
            <span>💡 Need a Hint?</span>
          </button>
        </div>
      `;
    }

    modal.classList.add('visible');
  }

  showCurrentHint() {
    audio.playTap();
    if (!this.pendingChallenge) return;
    const hintBox = document.getElementById('modalHintBox');
    if (hintBox) {
      hintBox.style.display = 'block';
      hintBox.innerHTML = `💡 <strong>Helpful Hint:</strong> ${this.pendingChallenge.currentQuestion.hint}`;
    }
  }

  answerRollQuestion(optIdx) {
    if (!this.pendingChallenge) return;
    const { rollValue, isLucky6, questionStep, totalQuestions, activePlayer, currentQuestion } = this.pendingChallenge;

    const btn = document.getElementById(`opt-btn-${optIdx}`);
    const funFactBox = document.getElementById('modalFunFactBox');
    const actionContainer = document.getElementById('modalActionContainer');

    const isCorrect = (optIdx === currentQuestion.correctIndex);

    if (isCorrect) {
      // CORRECT ANSWER! Each correctly answered question gets 1 point!
      audio.playSuccess();
      if (this.confetti) {
        this.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 35);
      }

      if (btn) {
        btn.classList.add('correct');
        const status = btn.querySelector('.opt-status');
        if (status) status.innerHTML = "✅ +1 Point!";
      }

      // Award point: in vs-CPU, student gets the point; in 2-player, active human player gets it
      if (activePlayer.isCPU) {
        this.player1.score += 1;
      } else {
        activePlayer.score += 1;
      }
      this.pendingChallenge.pointsEarned += 1;
      this.totalQuestionsSolved += 1;
      this.updateScoreboard();

      if (funFactBox) {
        funFactBox.style.display = 'block';
        funFactBox.innerHTML = `
          <div class="funfact-title">🎉 Correct! You earned 1 Point! ⭐</div>
          <div class="funfact-text"><strong>Fun Body Fact:</strong> ${currentQuestion.funFact}</div>
        `;
      }

      // Check if this was Question 1 of Lucky 6
      if (isLucky6 && questionStep === 1) {
        if (actionContainer) {
          actionContainer.innerHTML = `
            <button class="btn-primary" style="width: 100%;" onclick="game.advanceToLuckyQuestion2()">
              <span>Answer Lucky Question 2 of 2! 🌟➡️</span>
            </button>
          `;
        }
      } else {
        // All questions for this roll completed!
        const bonusText = isLucky6 ? "🌟 Lucky 6 Complete! +FREE EXTRA ROLL!" : "";
        if (actionContainer) {
          actionContainer.innerHTML = `
            <button class="btn-primary" style="width: 100%;" onclick="game.closeChallengeAndMove()">
              <span>Leap ${rollValue} Steps Forward! 🎲 ${bonusText}</span>
            </button>
          `;
        }
      }

    } else {
      // INCORRECT ANSWER: Friendly guidance, primary kids still learn and advance
      audio.playError();
      if (btn) {
        btn.classList.add('wrong');
        const status = btn.querySelector('.opt-status');
        if (status) status.innerHTML = "Almost! 🤔";
      }

      if (funFactBox) {
        funFactBox.style.display = 'block';
        funFactBox.innerHTML = `
          <div class="funfact-title" style="color: #0284C7;">💡 Good effort! The right answer is: ${currentQuestion.options[currentQuestion.correctIndex]}</div>
          <div class="funfact-text"><strong>Did You Know?</strong> ${currentQuestion.funFact}</div>
        `;
      }

      if (isLucky6 && questionStep === 1) {
        if (actionContainer) {
          actionContainer.innerHTML = `
            <button class="btn-primary" style="width: 100%;" onclick="game.advanceToLuckyQuestion2()">
              <span>Try Lucky Question 2 of 2 🌟➡️</span>
            </button>
          `;
        }
      } else {
        if (actionContainer) {
          actionContainer.innerHTML = `
            <button class="btn-primary" style="width: 100%;" onclick="game.closeChallengeAndMove()">
              <span>Continue Move (${rollValue} Steps) 🎲</span>
            </button>
          `;
        }
      }
    }
  }

  advanceToLuckyQuestion2() {
    audio.playTap();
    if (!this.pendingChallenge) return;
    this.pendingChallenge.questionStep = 2;
    this.pendingChallenge.currentQuestion = getRandomDigestiveQuestion();
    this.renderChallengeModal();
  }

  closeChallengeAndMove() {
    audio.playTap();
    const modal = document.getElementById('organQuestionModal');
    if (modal) modal.classList.remove('visible');

    if (!this.pendingChallenge) return;
    const { rollValue, isLucky6, activePlayer } = this.pendingChallenge;
    this.pendingChallenge = null;

    // Hop pawn step-by-step
    this.hopPlayer(activePlayer, rollValue, () => {
      this.handleTileArrival(activePlayer, isLucky6);
    });
  }

  /* ==========================================================================
     Pawn Movement
     ========================================================================== */
  hopPlayer(player, steps, onDone) {
    this.isMoving = true;
    let remaining = steps;

    const interval = setInterval(() => {
      if (remaining > 0 && player.position < this.config.totalTiles) {
        player.position++;
        remaining--;
        audio.playHop(player.position);
        this.updateTokensUI();
        this.updateBoardProgressUI();
      } else {
        clearInterval(interval);
        this.isMoving = false;
        if (onDone) onDone();
      }
    }, 280);
  }

  /* ==========================================================================
     Tile Arrival Handler (Ladders, Snakes, Bonus & Finish)
     ========================================================================== */
  handleTileArrival(player, wasLucky6 = false) {
    const pos = player.position;

    // 1. Did player land on WINNING Tile 36?
    if (pos >= 36) {
      player.position = 36;
      this.updateTokensUI();
      this.updateBoardProgressUI();
      this.handleGameVictory(player);
      return;
    }

    // 2. Did player land on a 🪜 LADDER?
    const ladder = this.config.ladders.find(l => l.from === pos);
    if (ladder) {
      setTimeout(() => {
        audio.playLadder();
        this.showToast(ladder.title, ladder.text);
        player.position = ladder.to;
        this.updateTokensUI();
        this.updateBoardProgressUI();

        if (player.position >= 36) {
          this.handleGameVictory(player);
          return;
        }

        this.checkTileFeatures(player, wasLucky6);
      }, 500);
      return;
    }

    // 3. Did player land on a 🐍 SNAKE / WATERSLIDE?
    const snake = this.config.snakes.find(s => s.from === pos);
    if (snake) {
      setTimeout(() => {
        audio.playSnakeSlide();
        this.showToast(snake.title, snake.text);
        player.position = snake.to;
        this.updateTokensUI();
        this.updateBoardProgressUI();

        this.checkTileFeatures(player, wasLucky6);
      }, 500);
      return;
    }

    // 4. Regular tile check
    this.checkTileFeatures(player, wasLucky6);
  }

  checkTileFeatures(player, wasLucky6) {
    const tileData = this.config.tiles[player.position];

    if (!tileData) {
      // Normal tile, pass turn (or grant extra roll if Lucky 6!)
      this.endTurn(wasLucky6);
      return;
    }

    if (tileData.type === 'bonus') {
      if (tileData.bonusType === 'roll') {
        audio.playSuccess();
        this.showToast("🏐 Extra Roll!", "Beach ball bonus! Roll again!");
        this.endTurn(true);
      } else {
        audio.playSuccess();
        player.score += 2; // bonus points
        this.updateScoreboard();
        this.showToast(`⭐ Bonus: ${tileData.name}`, `${tileData.text} (+2 Points!)`);
        this.endTurn(wasLucky6);
      }
      return;
    }

    if (tileData.type === 'organ') {
      const card = this.allCards.find(c => c.id === tileData.cardId);
      if (card) {
        audio.playSuccess();
        this.showToast(`🎉 Station: ${card.name}!`, card.funFact);
      }
    }

    this.endTurn(wasLucky6);
  }

  /* ==========================================================================
     Turn Switching
     ========================================================================== */
  endTurn(extraTurn = false) {
    const rollBtn = document.getElementById('rollDiceBtn');
    if (rollBtn) rollBtn.disabled = false;

    if (extraTurn) {
      this.showToast("🌟 EXTRA TURN!", `${(this.currentPlayer === 1 ? this.player1.name : this.player2.name)} gets to roll again!`);
      this.updateTurnBanner();
      if (this.currentPlayer === 2 && this.player2.isCPU && !this.isGameOver) {
        setTimeout(() => this.rollDice(), 1200);
      }
      return;
    }

    if (this.gameMode === 'solo') {
      this.currentPlayer = 1;
    } else {
      this.currentPlayer = (this.currentPlayer === 1) ? 2 : 1;
    }

    this.updateTurnBanner();

    // If it's CPU's turn, roll automatically!
    // When CPU rolls, player will answer for Crab to advance!
    if (this.currentPlayer === 2 && this.player2.isCPU && !this.isGameOver) {
      if (rollBtn) rollBtn.disabled = true;
      setTimeout(() => {
        this.rollDice();
      }, 1300);
    }
  }

  updateTurnBanner() {
    const banner = document.getElementById('diceBannerText');
    const rollBtn = document.getElementById('rollDiceBtn');
    if (!banner) return;

    if (this.currentPlayer === 1) {
      banner.innerHTML = `<span style="color: #0284C7;">🏄 ${this.player1.name}'s Turn!</span> Tap Roll Dice or press Spacebar!`;
      if (rollBtn) rollBtn.disabled = false;
    } else {
      if (this.player2.isCPU) {
        banner.innerHTML = `<span style="color: #EA580C;">🦀 Barnaby Crab's Turn!</span> Rolling now... help Crab solve the question!`;
        if (rollBtn) rollBtn.disabled = true;
      } else {
        banner.innerHTML = `<span style="color: #EA580C;">🦀 ${this.player2.name}'s Turn!</span> Tap Roll Dice!`;
        if (rollBtn) rollBtn.disabled = false;
      }
    }
  }

  /* ==========================================================================
     Victory & Reset
     ========================================================================== */
  handleGameVictory(winner) {
    this.isGameOver = true;
    audio.playLevelComplete();
    if (this.confetti) {
      this.confetti.fireShower(4000);
    }

    const modal = document.getElementById('gameVictoryModal');
    const title = document.getElementById('victoryTitle');
    const scoreVal = document.getElementById('victoryFinalScore');

    if (title) title.innerHTML = `🏆 ${winner.name} Wins!`;
    if (scoreVal) scoreVal.textContent = `${this.player1.score} Points (${this.totalQuestionsSolved} Questions Solved!)`;
    if (modal) modal.classList.add('visible');
  }

  closeVictoryModal() {
    audio.playTap();
    const modal = document.getElementById('gameVictoryModal');
    if (modal) modal.classList.remove('visible');
  }

  restartGame() {
    audio.playTap();
    this.closeVictoryModal();
    this.player1.position = 1;
    this.player2.position = 1;
    this.player1.score = 0;
    this.player2.score = 0;
    this.totalQuestionsSolved = 0;
    this.currentPlayer = 1;
    this.isGameOver = false;
    this.isRolling = false;
    this.isMoving = false;
    this.pendingChallenge = null;

    this.updateTokensUI();
    this.updateBoardProgressUI();
    this.updateTurnBanner();
    this.updateScoreboard();
  }

  /* ==========================================================================
     Game Mode & Avatar Selection
     ========================================================================== */
  setGameMode(mode) {
    audio.playTap();
    this.gameMode = mode;

    document.querySelectorAll('.mode-tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-mode') === mode);
    });

    if (mode === 'vs-cpu') {
      this.player2.name = 'Barnaby Crab';
      this.player2.emoji = '🦀';
      this.player2.isCPU = true;
    } else if (mode === 'pass-and-play') {
      this.player2.name = 'Player 2';
      this.player2.emoji = '🐢';
      this.player2.isCPU = false;
    } else if (mode === 'solo') {
      this.player2.position = 1;
    }

    this.restartGame();
  }

  selectBuddy(buddyKey) {
    const emojis = {
      surfer: '🏄‍♂️',
      turtle: '🐢',
      dolphin: '🐬',
      pizza: '🍕'
    };
    if (emojis[buddyKey]) {
      audio.playTap();
      this.player1.emoji = emojis[buddyKey];
      document.querySelectorAll('.buddy-pick-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-buddy') === buddyKey);
      });
      this.updateTokensUI();
      this.updateBoardProgressUI();
    }
  }

  onSquareClick(tileNum) {
    const tileData = this.config.tiles[tileNum];
    if (tileData && tileData.type === 'organ') {
      const card = this.allCards.find(c => c.id === tileData.cardId);
      if (card) {
        this.showToast(`🔬 Station: ${card.name}`, `${card.funFact}`);
      }
    }
  }

  showToast(title, text) {
    const toast = document.getElementById('eventToast');
    if (!toast) return;
    toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-text">${text}</div>`;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2800);
  }

  updateScoreboard() {
    const p1Score = document.getElementById('scoreDisplay');
    const cardsUnlocked = document.getElementById('cardsUnlockedDisplay');
    if (p1Score) p1Score.textContent = this.player1.score;
    if (cardsUnlocked) cardsUnlocked.textContent = `${this.totalQuestionsSolved}`;

    const p1Points = document.getElementById('p1PointsBadge');
    const p2Points = document.getElementById('p2PointsBadge');
    if (p1Points) p1Points.textContent = `${this.player1.score} pts`;
    if (p2Points) p2Points.textContent = `${this.player2.score} pts`;
  }

  setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        const modal = document.getElementById('organQuestionModal');
        if (!modal || !modal.classList.contains('visible')) {
          e.preventDefault();
          this.rollDice();
        }
      }
    });
  }
}

/* ==========================================================================
   Lightweight Confetti Engine
   ========================================================================== */
class ConfettiEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas && typeof this.canvas.getContext === 'function' ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;

    if (this.canvas && typeof window !== 'undefined' && window.addEventListener) {
      this.resize();
      window.addEventListener('resize', () => this.resize());
    }
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(x, y, count = 40) {
    if (!this.ctx) return;
    const colors = ['#F97316', '#0EA5E9', '#22C55E', '#EC4899', '#FBBF24', '#A855F7', '#FFFFFF'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 7;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2.5,
        size: 7 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        gravity: 0.18,
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
      this.burst(Math.random() * window.innerWidth, window.innerHeight * 0.35, 20);
    }, 200);
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
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
      this.ctx.restore();
    }

    if (this.particles.length > 0 && typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => this.render());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Global instance
let game = null;
window.addEventListener('DOMContentLoaded', () => {
  game = new SnakesAndLaddersGame();
  game.init();
});
