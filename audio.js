/**
 * DigestFlow - Audio & Haptic Feedback Engine
 * Built with Web Audio API for zero-latency, tactile Apple-style audio synthesis
 */

class AudioManager {
  constructor() {
    this.ctx = null;
    this.isMuted = localStorage.getItem('digestflow_muted') === 'true';
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
    if (!this.initialized) {
      this.init();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    localStorage.setItem('digestflow_muted', this.isMuted);
    if (!this.isMuted) {
      this.resumeIfNeeded();
      this.playTap();
    }
    return this.isMuted;
  }

  vibrate(pattern = [10]) {
    if (navigator.vibrate && !this.isMuted) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {}
    }
  }

  /**
   * Tactile micro-click (button press / card select)
   */
  playTap() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate(8);

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    const now = this.ctx.currentTime;
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(320, now + 0.035);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.035);
  }

  /**
   * Smooth aerodynamic card flip whoosh
   */
  playCardFlip() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate(12);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(260, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);
    osc.frequency.exponentialRampToValueAtTime(380, now + 0.22);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1200, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.06);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.23);
  }

  /**
   * Harmonious Apple chime for correct card answer (E5 -> G5 -> C6)
   */
  playSuccess() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate([15, 40, 25]);

    const notes = [659.25, 783.99, 1046.50]; // E5, G5, C6
    const startTime = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + idx * 0.07);

      const noteStart = startTime + idx * 0.07;
      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.14, noteStart + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.55);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.58);
    });
  }

  /**
   * Soft, non-punitive gentle double-bump for incorrect answer
   */
  playError() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate([30, 40, 30]);

    const now = this.ctx.currentTime;
    [0, 0.09].forEach(offset => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now + offset);
      osc.frequency.exponentialRampToValueAtTime(110, now + offset + 0.06);

      gain.gain.setValueAtTime(0.12, now + offset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + offset);
      osc.stop(now + offset + 0.07);
    });
  }

  /**
   * Hint unlock shimmer
   */
  playHint() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate(10);

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.18);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.26);
  }

  /**
   * Grand Level Complete Fanfare (Major arpeggio flourish + sparkle)
   */
  playLevelComplete() {
    if (this.isMuted) return;
    this.resumeIfNeeded();
    if (!this.ctx) return;

    this.vibrate([20, 50, 30, 50, 40]);

    const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C5, E5, G5, C6, E6
    const startTime = this.ctx.currentTime;

    chord.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const noteStart = startTime + idx * 0.09;
      osc.frequency.setValueAtTime(freq, noteStart);

      gain.gain.setValueAtTime(0.001, noteStart);
      gain.gain.linearRampToValueAtTime(0.16, noteStart + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.85);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteStart);
      osc.stop(noteStart + 0.9);
    });
  }
}

const audio = new AudioManager();
