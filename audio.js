/**
 * DigestBeach - Snakes & Ladders Edition
 * Web Audio API Engine with Board Game sounds:
 * - 🎲 Dice rolling
 * - 🦘 Tile-by-tile bouncy hop
 * - 🪜 Ascending ladder climb chime
 * - 🐍 Descending waterslide / snake slide
 * - ⭐ Star collect and fanfare
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('digestbeach_muted') === 'true';
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.initialized = true;
      }
    } catch (e) {
      console.warn('Web Audio not supported:', e);
    }
  }

  resumeIfNeeded() {
    if (!this.initialized) this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('digestbeach_muted', this.isMuted);
    if (!this.isMuted) {
      this.resumeIfNeeded();
      this.playTap();
    }
    return this.isMuted;
  }

  /**
   * 🧱 Block placed on grid snap sound
   */
  playBlockPlace() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate(10);
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  /**
   * 💥 Block Blast line clear sound (punchy bass impact + sparkle)
   */
  playBlast(linesCount = 1) {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate([20, 30, 20]);
    const now = this.ctx.currentTime;

    // Bass boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(45, now + 0.25);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);

    // Sparkle pops
    for (let i = 0; i < Math.min(linesCount * 3, 8); i++) {
      const delay = 0.04 + i * 0.03;
      const popOsc = this.ctx.createOscillator();
      const popGain = this.ctx.createGain();

      popOsc.type = 'sine';
      popOsc.frequency.setValueAtTime(600 + i * 150, now + delay);
      popOsc.frequency.exponentialRampToValueAtTime(1200 + i * 200, now + delay + 0.04);

      popGain.gain.setValueAtTime(0.08, now + delay);
      popGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

      popOsc.connect(popGain);
      popGain.connect(this.ctx.destination);
      popOsc.start(now + delay);
      popOsc.stop(now + delay + 0.045);
    }
  }

  /**
   * ⭐ Word + Meaning Match celebratory chime
   */
  playWordMatch() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate([15, 30, 20]);
    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const start = now + idx * 0.06;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, start);

      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(0.14, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(start);
      osc.stop(start + 0.36);
    });
  }

  playTap() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.04);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.04);
  }

  playDiceRoll() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const delay = i * 0.04 + (Math.random() * 0.015);
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(380 + Math.random() * 300, now + delay);
      osc.frequency.exponentialRampToValueAtTime(140, now + delay + 0.03);

      gain.gain.setValueAtTime(0.12, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.03);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + delay);
      osc.stop(now + delay + 0.035);
    }
  }

  playHop(stepIndex = 0) {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    const baseFreq = 340 + (stepIndex % 8) * 40;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.4, now + 0.07);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.13, now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.11);
  }

  /**
   * 🪜 Climbing up a Ladder: joyous rising marimba arpeggio!
   */
  playLadder() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const notes = [440, 554.37, 659.25, 880, 1108.73]; // A4, C#5, E5, A5, C#6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.07;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.36);
    });
  }

  /**
   * 🐍 Sliding down a Snake / Waterslide: funny slide whistle down!
   */
  playSnakeSlide() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.55);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + 0.55);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.56);
  }

  playSuccess() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.001, startTime);
      gain.gain.linearRampToValueAtTime(0.15, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(startTime);
      osc.stop(startTime + 0.42);
    });
  }

  playError() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(300, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.16);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.17);
  }

  playLevelComplete() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    const melody = [
      { f: 523.25, d: 0.12 },
      { f: 659.25, d: 0.12 },
      { f: 783.99, d: 0.12 },
      { f: 880.00, d: 0.14 },
      { f: 1046.50, d: 0.4 }
    ];

    let current = this.ctx.currentTime;
    melody.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, current);

      gain.gain.setValueAtTime(0.001, current);
      gain.gain.linearRampToValueAtTime(0.18, current + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, current + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(current);
      osc.stop(current + note.d + 0.05);

      current += note.d * 0.85;
    });
  }
}

const audio = new AudioManager();
