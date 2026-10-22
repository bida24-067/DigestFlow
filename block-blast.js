/**
 * DigestBeach - Block Blast Mini-Game Edition
 * Authentic 8x8 Grid Puzzle Game matching digestive words to their meanings!
 * Features:
 * - Fluid Drag-and-Drop with touch & pointer tracking (iOS/Android/Desktop)
 * - Tap-to-Select + Tap-to-Place accessible fallback
 * - 8x8 Block Blast Grid with row & column explosions
 * - Digestive Word + Meaning Matching (Adjacent Match & Line Blast Match)
 * - Combo streaks with celebratory audio & floating banners
 * - High score & target checklist persistence
 */

const DIGESTIVE_MATCH_PAIRS = [
  { id: 'mouth', word: 'Mouth 👄', meaning: 'Chews food', color: '#F97316' },
  { id: 'stomach', word: 'Stomach 🧪', meaning: 'Acid blender', color: '#F59E0B' },
  { id: 'esophagus', word: 'Food Pipe 🎢', meaning: 'Swallow slide', color: '#0EA5E9' },
  { id: 'intestine', word: 'Intestine 🌿', meaning: 'Soaks vitamins', color: '#22C55E' },
  { id: 'liver', word: 'Liver 🏭', meaning: 'Cleans blood', color: '#EF4444' },
  { id: 'saliva', word: 'Saliva 💧', meaning: 'Wets food', color: '#38BDF8' },
  { id: 'teeth', word: 'Teeth 🦷', meaning: 'Bites & grinds', color: '#A855F7' },
  { id: 'microbiome', word: 'Gut Bugs 🦠', meaning: 'Helpful bacteria', color: '#EC4899' },
  { id: 'gallbladder', word: 'Gallbladder 🥑', meaning: 'Stores bile', color: '#84CC16' }
];

// Block Blast Shapes (relative coordinates [row, col])
const BLOCK_BLAST_SHAPES = [
  { name: 'dot', coords: [[0, 0]], color: '#F59E0B' },
  { name: 'h2', coords: [[0, 0], [0, 1]], color: '#0EA5E9' },
  { name: 'v2', coords: [[0, 0], [1, 0]], color: '#0EA5E9' },
  { name: 'h3', coords: [[0, 0], [0, 1], [0, 2]], color: '#22C55E' },
  { name: 'v3', coords: [[0, 0], [1, 0], [2, 0]], color: '#22C55E' },
  { name: 'square2', coords: [[0, 0], [0, 1], [1, 0], [1, 1]], color: '#F97316' },
  { name: 'corner-br', coords: [[0, 0], [1, 0], [1, 1]], color: '#EC4899' },
  { name: 'corner-bl', coords: [[0, 1], [1, 1], [1, 0]], color: '#EC4899' },
  { name: 'corner-tr', coords: [[0, 0], [0, 1], [1, 1]], color: '#A855F7' },
  { name: 'corner-tl', coords: [[0, 0], [0, 1], [1, 0]], color: '#A855F7' },
  { name: 't-up', coords: [[0, 1], [1, 0], [1, 1], [1, 2]], color: '#14B8A6' }
];

class BlockBlastMiniGame {
  constructor() {
    this.gridSize = 8;
    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.pieces = []; // 3 current shapes
    this.selectedPieceIndex = null;
    this.score = 0;
    this.highScore = parseInt(localStorage.getItem('digestbeach_bb_highscore') || '0', 10);
    this.comboStreak = 0;
    this.matchesFound = new Set();
    this.isBlasting = false;

    // Drag-and-drop state
    this.activeDrag = null; // { pieceIndex, piece, avatarElem, touchStartY, etc. }
    this.currentHoverPlacement = null; // { startR, startC, valid }

    this.confetti = typeof ConfettiEngine !== 'undefined' ? new ConfettiEngine('confettiCanvas') : null;
  }

  init() {
    this.renderBoard();
    this.spawnPieces();
    this.updateScoreUI();
    this.renderTargetPairs();
    this.setupEventListeners();
  }

  /* ==========================================================================
     Board Rendering
     ========================================================================== */
  renderBoard() {
    const gridElem = document.getElementById('bbGrid');
    if (!gridElem) return;

    gridElem.innerHTML = '';

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cellData = this.board[r][c];
        const cell = document.createElement('div');
        cell.className = 'bb-cell';
        cell.id = `bb-cell-${r}-${c}`;
        cell.setAttribute('data-row', r);
        cell.setAttribute('data-col', c);

        if (cellData) {
          cell.classList.add('filled');
          cell.style.backgroundColor = cellData.color || '#FCD34D';
          if (cellData.text) {
            cell.innerHTML = `<span class="bb-cell-text ${cellData.type}">${cellData.text}</span>`;
            cell.classList.add('has-text');
          }
        }

        // Click / Touch listener to place selected piece
        cell.addEventListener('click', (e) => {
          e.stopPropagation();
          this.onCellClick(r, c);
        });

        cell.addEventListener('mouseenter', () => {
          if (this.selectedPieceIndex !== null && !this.activeDrag) {
            this.previewTapPlacement(r, c);
          }
        });

        gridElem.appendChild(cell);
      }
    }
  }

  /* ==========================================================================
     Pieces Generation & Rendering
     ========================================================================== */
  spawnPieces() {
    this.pieces = [];
    const availablePairs = DIGESTIVE_MATCH_PAIRS;

    for (let i = 0; i < 3; i++) {
      const template = BLOCK_BLAST_SHAPES[Math.floor(Math.random() * BLOCK_BLAST_SHAPES.length)];
      
      // Compute bounding box and center offset for perfect dragging
      const maxR = Math.max(...template.coords.map(c => c[0]));
      const minR = Math.min(...template.coords.map(c => c[0]));
      const maxC = Math.max(...template.coords.map(c => c[1]));
      const minC = Math.min(...template.coords.map(c => c[1]));
      const centerR = Math.floor((maxR + minR) / 2);
      const centerC = Math.floor((maxC + minC) / 2);

      // Decide if this piece carries a digestive Word or Meaning (~55% chance)
      let wordPayload = null;
      if (Math.random() < 0.6) {
        const pair = availablePairs[Math.floor(Math.random() * availablePairs.length)];
        const isWord = Math.random() < 0.5;
        wordPayload = {
          pairId: pair.id,
          type: isWord ? 'word' : 'meaning',
          text: isWord ? pair.word : pair.meaning,
          color: pair.color,
          blockIndex: Math.floor(Math.random() * template.coords.length)
        };
      }

      this.pieces.push({
        id: `piece-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 4)}`,
        name: template.name,
        coords: template.coords,
        rows: maxR - minR + 1,
        cols: maxC - minC + 1,
        centerR: centerR,
        centerC: centerC,
        color: wordPayload ? wordPayload.color : template.color,
        payload: wordPayload
      });
    }

    this.selectedPieceIndex = null;
    this.renderPiecesTray();
    this.checkGameOver();
  }

  renderPiecesTray() {
    const tray = document.getElementById('bbPiecesTray');
    if (!tray) return;

    tray.innerHTML = '';

    this.pieces.forEach((piece, idx) => {
      if (!piece) {
        const placeholder = document.createElement('div');
        placeholder.className = 'bb-piece-slot empty';
        tray.appendChild(placeholder);
        return;
      }

      const slot = document.createElement('div');
      slot.className = `bb-piece-slot ${this.selectedPieceIndex === idx ? 'selected' : ''}`;
      slot.id = `bb-piece-${idx}`;
      slot.setAttribute('data-piece-idx', idx);

      // Render mini grid for piece
      const maxR = Math.max(...piece.coords.map(c => c[0])) + 1;
      const maxC = Math.max(...piece.coords.map(c => c[1])) + 1;

      const miniGrid = document.createElement('div');
      miniGrid.className = 'bb-piece-grid';
      miniGrid.style.gridTemplateRows = `repeat(${maxR}, 28px)`;
      miniGrid.style.gridTemplateColumns = `repeat(${maxC}, 28px)`;

      // Map cells
      for (let r = 0; r < maxR; r++) {
        for (let c = 0; c < maxC; c++) {
          const isBlock = piece.coords.some(([br, bc]) => br === r && bc === c);
          const blockIdx = piece.coords.findIndex(([br, bc]) => br === r && bc === c);
          const block = document.createElement('div');

          if (isBlock) {
            block.className = 'bb-mini-block';
            block.style.backgroundColor = piece.color;

            if (piece.payload && piece.payload.blockIndex === blockIdx) {
              block.innerHTML = `<span class="bb-mini-text">${piece.payload.text}</span>`;
              block.classList.add('has-label');
            }
          } else {
            block.className = 'bb-mini-block empty';
          }
          miniGrid.appendChild(block);
        }
      }

      slot.appendChild(miniGrid);

      // Add badge when selected
      if (this.selectedPieceIndex === idx) {
        const badge = document.createElement('div');
        badge.className = 'bb-selected-badge';
        badge.textContent = 'Selected! Tap board to drop';
        slot.appendChild(badge);
      }

      // Modern Pointer Events for Drag & Drop
      slot.addEventListener('pointerdown', (e) => this.onPiecePointerDown(e, idx));

      tray.appendChild(slot);
    });
  }

  /* ==========================================================================
     Drag & Drop Engine (Pointer API: works for touch, stylus, & mouse)
     ========================================================================== */
  onPiecePointerDown(e, pieceIdx) {
    if (this.isBlasting) return;
    const piece = this.pieces[pieceIdx];
    if (!piece) return;

    // Check primary button for mouse
    if (e.pointerType === 'mouse' && e.button !== 0) return;

    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startTime = Date.now();
    let isDragging = false;
    let avatarElem = null;

    const slotElem = document.getElementById(`bb-piece-${pieceIdx}`);

    const createAvatar = () => {
      avatarElem = document.createElement('div');
      avatarElem.className = 'bb-drag-avatar';
      
      // Render full-sized blocks matching the board grid cell size (~42px to 50px)
      const maxR = Math.max(...piece.coords.map(c => c[0])) + 1;
      const maxC = Math.max(...piece.coords.map(c => c[1])) + 1;
      
      const cellSize = Math.min(48, Math.max(34, Math.floor(window.innerWidth / 12)));
      avatarElem.style.gridTemplateRows = `repeat(${maxR}, ${cellSize}px)`;
      avatarElem.style.gridTemplateColumns = `repeat(${maxC}, ${cellSize}px)`;

      for (let r = 0; r < maxR; r++) {
        for (let c = 0; c < maxC; c++) {
          const isBlock = piece.coords.some(([br, bc]) => br === r && bc === c);
          const blockIdx = piece.coords.findIndex(([br, bc]) => br === r && bc === c);
          const block = document.createElement('div');

          if (isBlock) {
            block.className = 'bb-avatar-block';
            block.style.backgroundColor = piece.color;
            if (piece.payload && piece.payload.blockIndex === blockIdx) {
              block.innerHTML = `<span class="bb-cell-text ${piece.payload.type}">${piece.payload.text}</span>`;
            }
          } else {
            block.className = 'bb-avatar-block empty';
          }
          avatarElem.appendChild(block);
        }
      }

      document.body.appendChild(avatarElem);
      if (slotElem) slotElem.style.opacity = '0.3';
    };

    const updateAvatarPos = (cx, cy) => {
      if (!avatarElem) return;
      const rect = avatarElem.getBoundingClientRect();
      // On touch screens, offset avatar slightly above finger so player sees underneath!
      const yOffset = (e.pointerType === 'touch') ? 60 : (rect.height / 2);
      avatarElem.style.left = `${cx - (rect.width / 2)}px`;
      avatarElem.style.top = `${cy - yOffset}px`;
    };

    const onPointerMove = (moveEvt) => {
      const dist = Math.hypot(moveEvt.clientX - startX, moveEvt.clientY - startY);
      
      if (!isDragging && dist > 8) {
        isDragging = true;
        this.selectedPieceIndex = null;
        this.renderPiecesTray();
        createAvatar();
      }

      if (isDragging) {
        updateAvatarPos(moveEvt.clientX, moveEvt.clientY);
        this.updateDragPreview(piece, moveEvt.clientX, moveEvt.clientY, (e.pointerType === 'touch'));
      }
    };

    const onPointerUp = (upEvt) => {
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerUp);

      if (avatarElem) {
        avatarElem.remove();
        avatarElem = null;
      }
      if (slotElem) slotElem.style.opacity = '1';

      if (isDragging) {
        // Player dragged and released
        if (this.currentHoverPlacement && this.currentHoverPlacement.valid) {
          const { startR, startC } = this.currentHoverPlacement;
          this.executePlacement(pieceIdx, startR, startC);
        } else {
          audio.playTap();
        }
        this.clearHoverPreview();
        this.currentHoverPlacement = null;
      } else {
        // Player tapped/clicked piece in tray
        const duration = Date.now() - startTime;
        if (duration < 600) {
          this.selectPiece(pieceIdx);
        }
      }
    };

    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);
  }

  updateDragPreview(piece, pointerX, pointerY, isTouch = false) {
    // If touch, look at board coordinate slightly above finger
    const testY = isTouch ? (pointerY - 60) : pointerY;
    const elemBelow = document.elementFromPoint(pointerX, testY);

    if (!elemBelow) {
      this.clearHoverPreview();
      this.currentHoverPlacement = null;
      return;
    }

    const cell = elemBelow.closest('.bb-cell');
    if (!cell) {
      this.clearHoverPreview();
      this.currentHoverPlacement = null;
      return;
    }

    const hoverR = parseInt(cell.getAttribute('data-row'), 10);
    const hoverC = parseInt(cell.getAttribute('data-col'), 10);

    const startR = hoverR - piece.centerR;
    const startC = hoverC - piece.centerC;

    const canPlace = this.canPlacePiece(piece, startR, startC);
    this.currentHoverPlacement = { startR, startC, valid: canPlace };

    this.showPlacementPreview(piece, startR, startC, canPlace);
  }

  /* ==========================================================================
     Tap-to-Select + Tap-to-Place Logic
     ========================================================================== */
  selectPiece(index) {
    if (this.isBlasting) return;
    if (!this.pieces[index]) return;

    audio.playTap();
    this.selectedPieceIndex = (this.selectedPieceIndex === index) ? null : index;
    this.clearHoverPreview();
    this.renderPiecesTray();

    if (this.selectedPieceIndex !== null) {
      this.showComboToast("🧩 Piece Selected!", "Now tap any square on the 8×8 board to place it!");
    }
  }

  previewTapPlacement(r, c) {
    if (this.selectedPieceIndex === null) return;
    const piece = this.pieces[this.selectedPieceIndex];
    if (!piece) return;

    const startR = r - piece.centerR;
    const startC = c - piece.centerC;
    const canPlace = this.canPlacePiece(piece, startR, startC);

    this.showPlacementPreview(piece, startR, startC, canPlace);
  }

  onCellClick(clickedR, clickedC) {
    if (this.selectedPieceIndex === null || this.isBlasting) return;
    const piece = this.pieces[this.selectedPieceIndex];
    if (!piece) return;

    // Try centered placement first
    let startR = clickedR - piece.centerR;
    let startC = clickedC - piece.centerC;

    if (this.canPlacePiece(piece, startR, startC)) {
      this.executePlacement(this.selectedPieceIndex, startR, startC);
      return;
    }

    // If center didn't fit (e.g. clicked near corner/edge), test candidate offsets covering (clickedR, clickedC)
    let bestStart = null;
    for (const [pr, pc] of piece.coords) {
      const candidateStartR = clickedR - pr;
      const candidateStartC = clickedC - pc;
      if (this.canPlacePiece(piece, candidateStartR, candidateStartC)) {
        bestStart = { r: candidateStartR, c: candidateStartC };
        break;
      }
    }

    if (bestStart) {
      this.executePlacement(this.selectedPieceIndex, bestStart.r, bestStart.c);
    } else {
      audio.playError();
      const cell = document.getElementById(`bb-cell-${clickedR}-${clickedC}`);
      if (cell) {
        cell.classList.add('preview-invalid');
        setTimeout(() => cell.classList.remove('preview-invalid'), 350);
      }
      this.showComboToast("⚠️ Doesn't fit here!", "Try another open space on the board!");
    }
  }

  /* ==========================================================================
     Placement Logic
     ========================================================================== */
  canPlacePiece(piece, startR, startC) {
    for (const [r, c] of piece.coords) {
      const targetR = startR + r;
      const targetC = startC + c;

      if (targetR < 0 || targetR >= 8 || targetC < 0 || targetC >= 8) return false;
      if (this.board[targetR][targetC] !== null) return false;
    }
    return true;
  }

  showPlacementPreview(piece, startR, startC, canPlace) {
    this.clearHoverPreview();

    piece.coords.forEach(([r, c]) => {
      const tr = startR + r;
      const tc = startC + c;
      if (tr >= 0 && tr < 8 && tc >= 0 && tc < 8) {
        const cell = document.getElementById(`bb-cell-${tr}-${tc}`);
        if (cell) {
          cell.classList.add(canPlace ? 'preview-valid' : 'preview-invalid');
          if (canPlace) cell.style.setProperty('--preview-color', piece.color);
        }
      }
    });
  }

  clearHoverPreview() {
    document.querySelectorAll('.bb-cell').forEach(cell => {
      cell.classList.remove('preview-valid', 'preview-invalid');
      cell.style.removeProperty('--preview-color');
    });
  }

  executePlacement(pieceIndex, startR, startC) {
    const piece = this.pieces[pieceIndex];
    if (!piece || !this.canPlacePiece(piece, startR, startC)) return;

    audio.playBlockPlace();
    this.clearHoverPreview();

    piece.coords.forEach(([r, c], blockIdx) => {
      const tr = startR + r;
      const tc = startC + c;

      let cellData = { color: piece.color };
      if (piece.payload && piece.payload.blockIndex === blockIdx) {
        cellData = {
          color: piece.color,
          pairId: piece.payload.pairId,
          type: piece.payload.type,
          text: piece.payload.text
        };
      }
      this.board[tr][tc] = cellData;
    });

    // Score for placing blocks: 10 pts per block
    this.score += piece.coords.length * 10;
    this.updateScoreUI();

    // Consume piece from tray
    this.pieces[pieceIndex] = null;
    this.selectedPieceIndex = null;
    this.renderBoard();
    this.renderPiecesTray();

    // Check for adjacent Word + Meaning matches on board!
    this.checkAdjacentMatches();

    // Check for Row / Column full line blasts!
    this.checkLineBlasts(() => {
      // If all 3 pieces used, spawn 3 new pieces
      if (this.pieces.every(p => p === null)) {
        setTimeout(() => this.spawnPieces(), 350);
      } else {
        this.checkGameOver();
      }
    });
  }

  /* ==========================================================================
     Adjacent Word + Meaning Matching
     ========================================================================== */
  checkAdjacentMatches() {
    const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
    const matchesToClear = [];

    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = this.board[r][c];
        if (!cell || !cell.pairId || cell.type !== 'word') continue;

        // Check 4 neighbors for matching meaning
        for (const [dr, dc] of directions) {
          const nr = r + dr;
          const nc = c + dc;
          if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
            const neighbor = this.board[nr][nc];
            if (neighbor && neighbor.pairId === cell.pairId && neighbor.type === 'meaning') {
              matchesToClear.push({
                pairId: cell.pairId,
                r1: r, c1: c, wordText: cell.text,
                r2: nr, c2: nc, meaningText: neighbor.text
              });
            }
          }
        }
      }
    }

    if (matchesToClear.length > 0) {
      matchesToClear.forEach(match => {
        this.triggerMatchSuccess(match);
      });
    }
  }

  triggerMatchSuccess(match) {
    audio.playWordMatch();
    this.matchesFound.add(match.pairId);
    this.score += 250;
    this.updateScoreUI();
    this.renderTargetPairs();

    if (this.confetti) {
      this.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.45, 35);
    }

    // Highlight and blast matched cells
    const cell1 = document.getElementById(`bb-cell-${match.r1}-${match.c1}`);
    const cell2 = document.getElementById(`bb-cell-${match.r2}-${match.c2}`);

    if (cell1) cell1.classList.add('match-burst');
    if (cell2) cell2.classList.add('match-burst');

    this.showComboToast("🌟 WORD MATCH BLAST! 🌟", `${match.wordText} = ${match.meaningText} (+250 Stars!)`);

    setTimeout(() => {
      this.board[match.r1][match.c1] = null;
      this.board[match.r2][match.c2] = null;
      this.renderBoard();
    }, 550);
  }

  /* ==========================================================================
     Line Blast Clears (Classic Block Blast Row / Column Explosions)
     ========================================================================== */
  checkLineBlasts(onComplete) {
    const fullRows = [];
    const fullCols = [];

    // Check rows
    for (let r = 0; r < 8; r++) {
      if (this.board[r].every(c => c !== null)) {
        fullRows.push(r);
      }
    }

    // Check cols
    for (let c = 0; c < 8; c++) {
      let full = true;
      for (let r = 0; r < 8; r++) {
        if (this.board[r][c] === null) {
          full = false;
          break;
        }
      }
      if (full) fullCols.push(c);
    }

    const totalLines = fullRows.length + fullCols.length;

    if (totalLines === 0) {
      this.comboStreak = 0;
      this.updateScoreUI();
      if (onComplete) onComplete();
      return;
    }

    // BLAST OCCURRED!
    this.isBlasting = true;
    this.comboStreak++;
    audio.playBlast(totalLines);

    // Calculate blast score: 100 per line * combo multiplier
    const blastPoints = totalLines * 100 * this.comboStreak;
    this.score += blastPoints;
    this.updateScoreUI();

    // Check if any word + meaning was cleared on these lines
    fullRows.forEach(r => {
      for (let c = 0; c < 8; c++) {
        const item = this.board[r][c];
        if (item && item.pairId) this.matchesFound.add(item.pairId);
      }
    });
    fullCols.forEach(c => {
      for (let r = 0; r < 8; r++) {
        const item = this.board[r][c];
        if (item && item.pairId) this.matchesFound.add(item.pairId);
      }
    });
    this.renderTargetPairs();

    // Visual explosion animation
    fullRows.forEach(r => {
      for (let c = 0; c < 8; c++) {
        const cell = document.getElementById(`bb-cell-${r}-${c}`);
        if (cell) cell.classList.add('blast-exploding');
      }
    });
    fullCols.forEach(c => {
      for (let r = 0; r < 8; r++) {
        const cell = document.getElementById(`bb-cell-${r}-${c}`);
        if (cell) cell.classList.add('blast-exploding');
      }
    });

    const comboLabel = this.comboStreak > 1 ? ` COMBO x${this.comboStreak}!` : '';
    this.showComboToast(`💥 ${totalLines} LINE BLAST!${comboLabel}`, `+${blastPoints} Stars! ⭐`);

    if (this.confetti) {
      this.confetti.burst(window.innerWidth / 2, window.innerHeight * 0.4, 25 * totalLines);
    }

    setTimeout(() => {
      // Clear cells
      fullRows.forEach(r => {
        for (let c = 0; c < 8; c++) this.board[r][c] = null;
      });
      fullCols.forEach(c => {
        for (let r = 0; r < 8; r++) this.board[r][c] = null;
      });

      this.isBlasting = false;
      this.renderBoard();
      if (onComplete) onComplete();
    }, 450);
  }

  /* ==========================================================================
     Game Over Check
     ========================================================================== */
  checkGameOver() {
    const activePieces = this.pieces.filter(p => p !== null);
    if (activePieces.length === 0) return;

    let hasAnyValidMove = false;

    for (const piece of activePieces) {
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          if (this.canPlacePiece(piece, r, c)) {
            hasAnyValidMove = true;
            break;
          }
        }
        if (hasAnyValidMove) break;
      }
      if (hasAnyValidMove) break;
    }

    if (!hasAnyValidMove) {
      // GAME OVER
      setTimeout(() => {
        audio.playLevelComplete();
        const modal = document.getElementById('bbGameOverModal');
        const finalScoreElem = document.getElementById('bbFinalScore');
        const matchesCountElem = document.getElementById('bbMatchesCount');

        if (this.score > this.highScore) {
          this.highScore = this.score;
          localStorage.setItem('digestbeach_bb_highscore', this.highScore);
        }

        if (finalScoreElem) finalScoreElem.textContent = `${this.score} ⭐`;
        if (matchesCountElem) matchesCountElem.textContent = `${this.matchesFound.size} / ${DIGESTIVE_MATCH_PAIRS.length}`;
        if (modal) modal.classList.add('visible');
      }, 600);
    }
  }

  restartGame() {
    audio.playTap();
    const modal = document.getElementById('bbGameOverModal');
    if (modal) modal.classList.remove('visible');

    this.board = Array(8).fill(null).map(() => Array(8).fill(null));
    this.score = 0;
    this.comboStreak = 0;
    this.matchesFound.clear();
    this.selectedPieceIndex = null;
    this.isBlasting = false;

    this.renderBoard();
    this.spawnPieces();
    this.updateScoreUI();
    this.renderTargetPairs();
  }

  /* ==========================================================================
     UI Updates
     ========================================================================== */
  updateScoreUI() {
    const scoreElem = document.getElementById('bbScoreDisplay');
    const highScoreElem = document.getElementById('bbHighScoreDisplay');
    const comboElem = document.getElementById('bbComboDisplay');

    if (scoreElem) scoreElem.textContent = this.score;
    if (highScoreElem) highScoreElem.textContent = Math.max(this.score, this.highScore);
    if (comboElem) {
      comboElem.textContent = this.comboStreak > 1 ? `x${this.comboStreak} 🔥` : 'x1';
      comboElem.style.color = this.comboStreak > 1 ? '#EF4444' : '#0284C7';
    }
  }

  renderTargetPairs() {
    const listElem = document.getElementById('bbPairsList');
    if (!listElem) return;

    listElem.innerHTML = DIGESTIVE_MATCH_PAIRS.map(pair => {
      const isMatched = this.matchesFound.has(pair.id);
      return `
        <div class="bb-pair-chip ${isMatched ? 'matched' : ''}">
          <span class="bb-chip-word">${pair.word}</span>
          <span class="bb-chip-eq">=</span>
          <span class="bb-chip-mean">${pair.meaning}</span>
          ${isMatched ? '<span class="bb-chip-check">✅</span>' : ''}
        </div>
      `;
    }).join('');
  }

  showComboToast(title, text) {
    const toast = document.getElementById('eventToast');
    if (!toast) return;
    toast.innerHTML = `<div class="toast-title">${title}</div><div class="toast-text">${text}</div>`;
    toast.classList.add('visible');
    setTimeout(() => toast.classList.remove('visible'), 2400);
  }

  setupEventListeners() {
    const gridElem = document.getElementById('bbGrid');
    if (gridElem) {
      gridElem.addEventListener('mouseleave', () => {
        if (!this.activeDrag && this.selectedPieceIndex === null) {
          this.clearHoverPreview();
        }
      });
    }
  }
}

// Global instance for Block Blast
let blockBlastGame = null;

function openBlockBlastMiniGame() {
  audio.playTap();
  const mainBoardView = document.getElementById('snakesGameView');
  const bbView = document.getElementById('blockBlastGameView');
  const modeBtn = document.getElementById('gameModeToggleBtn');

  if (mainBoardView && bbView) {
    mainBoardView.style.display = 'none';
    bbView.style.display = 'block';
  }

  if (modeBtn) {
    modeBtn.innerHTML = `<span>🎲 Back to Snakes & Ladders</span>`;
    modeBtn.setAttribute('onclick', 'closeBlockBlastMiniGame()');
  }

  if (!blockBlastGame) {
    blockBlastGame = new BlockBlastMiniGame();
    blockBlastGame.init();
  }
}

function closeBlockBlastMiniGame() {
  audio.playTap();
  const mainBoardView = document.getElementById('snakesGameView');
  const bbView = document.getElementById('blockBlastGameView');
  const modeBtn = document.getElementById('gameModeToggleBtn');

  if (mainBoardView && bbView) {
    bbView.style.display = 'none';
    mainBoardView.style.display = 'block';
  }

  if (modeBtn) {
    modeBtn.innerHTML = `<span>🧩 Block Blast Mini-Game</span>`;
    modeBtn.setAttribute('onclick', 'openBlockBlastMiniGame()');
  }
}
