// =============================================
// SOUND MANAGER — Quản lý âm thanh game
// =============================================

// Import file nhạc nền
import bgDefault   from '../assets/sounds/default.mp3';
import bgChristmas from '../assets/sounds/christmas.mp3';
import bgHalloween from '../assets/sounds/halloween.mp3';
import bgSummer    from '../assets/sounds/summer.mp3';

const MUSIC_MAP = {
  default:   bgDefault,
  christmas: bgChristmas,
  halloween: bgHalloween,
  summer:    bgSummer,
};

// ── AudioContext cho sound effects ──
let audioCtx = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

const playTone = (frequency, type, duration, volume = 0.3, delay = 0) => {
  try {
    const ctx        = getCtx();
    const oscillator = ctx.createOscillator();
    const gainNode   = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type            = type;
    oscillator.frequency.value = frequency;

    const startTime = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  } catch (e) {
    console.warn('Sound error:', e);
  }
};

// ── Sound effects ──
export const playPickSound = () => {
  playTone(440, 'sine', 0.08, 0.2);
  playTone(550, 'sine', 0.08, 0.15, 0.05);
};

export const playTurnSound = () => {
  playTone(300, 'triangle', 0.1, 0.15);
};

export const playWinSound = () => {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    playTone(freq, 'sine', 0.3, 0.25, i * 0.12);
  });
};

export const playLoseSound = () => {
  const notes = [400, 350, 300, 250];
  notes.forEach((freq, i) => {
    playTone(freq, 'triangle', 0.3, 0.2, i * 0.15);
  });
};

export const playAIThinkSound = () => {
  playTone(200, 'square', 0.05, 0.1);
};

export const playSaveSound = () => {
  playTone(600, 'sine', 0.1, 0.15);
  playTone(800, 'sine', 0.1, 0.15, 0.1);
};

export const playUndoSound = () => {
  playTone(400, 'triangle', 0.1, 0.15);
  playTone(300, 'triangle', 0.1, 0.15, 0.08);
};

// ── Nhạc nền dùng file MP3 thật ──
let bgAudio = null;

export const playBgMusic = (theme = 'default') => {
  stopBgMusic();

  const src = MUSIC_MAP[theme];
  if (!src) return;

  try {
    bgAudio = new Audio(src);
    bgAudio.loop   = true;     // lặp vô tận
    bgAudio.volume = 0.35;     // âm lượng 35%
    bgAudio.play().catch((e) => {
      console.warn('Nhạc nền không phát được:', e);
    });
  } catch (e) {
    console.warn('Lỗi nhạc nền:', e);
  }
};

export const stopBgMusic = () => {
  if (bgAudio) {
    bgAudio.pause();
    bgAudio.currentTime = 0;
    bgAudio = null;
  }
};

export const setBgMusicVolume = (volume) => {
  if (bgAudio) bgAudio.volume = volume;
};

// ── Bật/tắt âm thanh ──
let soundEnabled = true;

export const setSoundEnabled = (val) => {
  soundEnabled = val;
  if (!val) stopBgMusic();
};

export const isSoundEnabled = () => soundEnabled;

const wrap = (fn) => (...args) => {
  if (soundEnabled) fn(...args);
};

export const sounds = {
  pick:    wrap(playPickSound),
  turn:    wrap(playTurnSound),
  win:     wrap(playWinSound),
  lose:    wrap(playLoseSound),
  aiThink: wrap(playAIThinkSound),
  save:    wrap(playSaveSound),
  undo:    wrap(playUndoSound),
};