// =============================================
// SOUND MANAGER — Quản lý âm thanh game
// Dùng Web Audio API, không cần file mp3
// =============================================

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

// ---------------------------------------------
// Các âm thanh cụ thể
// ---------------------------------------------

export const playPickSound = () => {
  playTone(440, 'sine', 0.08, 0.2);
  playTone(550, 'sine', 0.08, 0.15, 0.05);
};

export const playTurnSound = () => {
  playTone(300, 'triangle', 0.1, 0.15);
};

// Dùng index i để tính delay — giữ nguyên
export const playWinSound = () => {
  const notes = [523, 659, 784, 1047];
  notes.forEach((freq, i) => {
    playTone(freq, 'sine', 0.3, 0.25, i * 0.12);
  });
};

// Dùng index i để tính delay — giữ nguyên
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

// ---------------------------------------------
// Nhạc nền theo theme
// ---------------------------------------------
let bgMusicInterval = null;

// Hàm phát một đoạn melody — dùng chung
const playMelody = (melody, waveType) => {
  let time = 0;
  melody.forEach(([freq, dur]) => {
    setTimeout(
      () => playTone(freq, waveType, dur * 0.9, 0.1),
      time * 1000
    );
    time += dur;
  });
};

export const playBgMusic = (theme = 'default') => {
  stopBgMusic();

  if (theme === 'christmas') {
    const melody = [
      [659, 0.2], [659, 0.2], [659, 0.4],
      [659, 0.2], [659, 0.2], [659, 0.4],
      [659, 0.2], [784, 0.2], [523, 0.2], [587, 0.2],
      [659, 0.8],
    ];
    playMelody(melody, 'sine');
    bgMusicInterval = setInterval(
      () => playMelody(melody, 'sine'),
      5000
    );

  } else if (theme === 'halloween') {
    const melody = [
      [220, 0.3], [233, 0.3], [220, 0.3], [207, 0.6],
      [220, 0.3], [233, 0.3], [220, 0.6],
    ];
    playMelody(melody, 'sawtooth');
    bgMusicInterval = setInterval(
      () => playMelody(melody, 'sawtooth'),
      4000
    );

  } else if (theme === 'summer') {
    const melody = [
      [523, 0.2], [587, 0.2], [659, 0.2], [698, 0.2],
      [784, 0.4], [698, 0.2], [659, 0.4],
      [587, 0.2], [523, 0.4],
    ];
    playMelody(melody, 'triangle');
    bgMusicInterval = setInterval(
      () => playMelody(melody, 'triangle'),
      4000
    );
  }
  // theme 'default' không có nhạc nền
};

export const stopBgMusic = () => {
  if (bgMusicInterval) {
    clearInterval(bgMusicInterval);
    bgMusicInterval = null;
  }
};

// ---------------------------------------------
// Bật/tắt âm thanh
// ---------------------------------------------
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