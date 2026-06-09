// Quản lý âm thanh game

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

// ── AudioContext ──
let audioCtx = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

// ── Cài đặt âm thanh ──
let soundConfig = {
  masterEnabled: true,   // bật/tắt tất cả
  musicEnabled:  true,   // nhạc nền
  sfxEnabled:    true,   // hiệu ứng âm thanh
  musicVolume:   0.35,   // âm lượng nhạc 0-1
  sfxVolume:     0.5,    // âm lượng hiệu ứng 0-1
};

export const getSoundConfig  = () => ({ ...soundConfig });

export const updateSoundConfig = (partial) => {
  soundConfig = { ...soundConfig, ...partial };
  // Cập nhật âm lượng nhạc nền ngay lập tức
  if (bgAudio) {
    bgAudio.volume = soundConfig.masterEnabled && soundConfig.musicEnabled
      ? soundConfig.musicVolume
      : 0;
  }
};

// ── Tạo âm thanh ──
const playTone = (frequency, type, duration, volume = 0.3, delay = 0) => {
  if (!soundConfig.masterEnabled || !soundConfig.sfxEnabled) return;
  try {
    const ctx        = getCtx();
    const oscillator = ctx.createOscillator();
    const gainNode   = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type            = type;
    oscillator.frequency.value = frequency;

    const v         = volume * soundConfig.sfxVolume;
    const startTime = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(v, startTime);
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

// ── Nhạc nền ──
let bgAudio = null;

export const playBgMusic = (theme = 'default') => {
  stopBgMusic();
  if (!soundConfig.masterEnabled || !soundConfig.musicEnabled) return;

  const src = MUSIC_MAP[theme];
  if (!src) return;

  try {
    bgAudio        = new Audio(src);
    bgAudio.loop   = true;
    bgAudio.volume = soundConfig.musicVolume;
    bgAudio.play().catch((e) => console.warn('Nhạc nền lỗi:', e));
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

// ── Tương thích cũ ──
export const setSoundEnabled = (val) => {
  updateSoundConfig({ masterEnabled: val });
  if (!val) stopBgMusic();
};

export const isSoundEnabled = () => soundConfig.masterEnabled;

const wrap = (fn) => (...args) => {
  if (soundConfig.masterEnabled && soundConfig.sfxEnabled) fn(...args);
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