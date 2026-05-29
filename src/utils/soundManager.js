// =============================================
// SOUND MANAGER — Quản lý âm thanh game
// Dùng Web Audio API, không cần file mp3
// =============================================

// Tạo AudioContext dùng chung toàn app
let audioCtx = null;

const getCtx = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
};

// ---------------------------------------------
// Hàm nền — tạo một âm thanh cơ bản
// frequency : tần số (Hz) — cao/thấp
// type      : dạng sóng — 'sine' | 'square' | 'triangle' | 'sawtooth'
// duration  : thời gian phát (giây)
// volume    : âm lượng 0.0 -> 1.0
// ---------------------------------------------
const playTone = (frequency, type, duration, volume = 0.3, delay = 0) => {
  try {
    const ctx        = getCtx();
    const oscillator = ctx.createOscillator();
    const gainNode   = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.type            = type;
    oscillator.frequency.value = frequency;

    // Fade out ở cuối để tránh tiếng "click" đột ngột
    const startTime = ctx.currentTime + delay;
    gainNode.gain.setValueAtTime(volume, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  } catch (e) {
    // Bỏ qua nếu trình duyệt không hỗ trợ
    console.warn('Sound error:', e);
  }
};

// ---------------------------------------------
// Các âm thanh cụ thể
// ---------------------------------------------

// Tiếng click khi lấy que
export const playPickSound = () => {
  playTone(440, 'sine', 0.08, 0.2);
  playTone(550, 'sine', 0.08, 0.15, 0.05);
};

// Tiếng chuyển lượt
export const playTurnSound = () => {
  playTone(300, 'triangle', 0.1, 0.15);
};

// Tiếng thắng — giai điệu vui
export const playWinSound = () => {
  const notes = [523, 659, 784, 1047]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    playTone(freq, 'sine', 0.3, 0.25, i * 0.12);
  });
};

// Tiếng thua — giai điệu buồn
export const playLoseSound = () => {
  const notes = [400, 350, 300, 250];
  notes.forEach((freq, i) => {
    playTone(freq, 'triangle', 0.3, 0.2, i * 0.15);
  });
};

// Tiếng AI đang suy nghĩ — tick tick
export const playAIThinkSound = () => {
  playTone(200, 'square', 0.05, 0.1);
};

// Tiếng lưu game thành công
export const playSaveSound = () => {
  playTone(600, 'sine', 0.1, 0.15);
  playTone(800, 'sine', 0.1, 0.15, 0.1);
};

// Tiếng undo
export const playUndoSound = () => {
  playTone(400, 'triangle', 0.1, 0.15);
  playTone(300, 'triangle', 0.1, 0.15, 0.08);
};

// ---------------------------------------------
// Nhạc nền theo theme — dùng setInterval tạo
// vòng lặp đơn giản
// ---------------------------------------------
let bgMusicInterval = null;

export const playBgMusic = (theme = 'default') => {
  stopBgMusic();

  if (theme === 'christmas') {
    // Jingle Bells đơn giản
    const melody = [
      [659, 0.2], [659, 0.2], [659, 0.4],
      [659, 0.2], [659, 0.2], [659, 0.4],
      [659, 0.2], [784, 0.2], [523, 0.2], [587, 0.2],
      [659, 0.8],
    ];
    let i = 0;
    let time = 0;
    melody.forEach(([freq, dur]) => {
      setTimeout(() => playTone(freq, 'sine', dur * 0.9, 0.1), time * 1000);
      time += dur;
    });
    // Lặp lại mỗi 5 giây
    bgMusicInterval = setInterval(() => {
      let t = 0;
      melody.forEach(([freq, dur]) => {
        setTimeout(() => playTone(freq, 'sine', dur * 0.9, 0.1), t * 1000);
        t += dur;
      });
    }, 5000);

  } else if (theme === 'halloween') {
    // Giai điệu ma mị
    const melody = [
      [220, 0.3], [233, 0.3], [220, 0.3], [207, 0.6],
      [220, 0.3], [233, 0.3], [220, 0.6],
    ];
    let time = 0;
    melody.forEach(([freq, dur]) => {
      setTimeout(() => playTone(freq, 'sawtooth', dur * 0.9, 0.08), time * 1000);
      time += dur;
    });
    bgMusicInterval = setInterval(() => {
      let t = 0;
      melody.forEach(([freq, dur]) => {
        setTimeout(() => playTone(freq, 'sawtooth', dur * 0.9, 0.08), t * 1000);
        t += dur;
      });
    }, 4000);

  } else if (theme === 'summer') {
    // Nhạc mùa hè vui tươi
    const melody = [
      [523, 0.2], [587, 0.2], [659, 0.2], [698, 0.2],
      [784, 0.4], [698, 0.2], [659, 0.4],
      [587, 0.2], [523, 0.4],
    ];
    let time = 0;
    melody.forEach(([freq, dur]) => {
      setTimeout(() => playTone(freq, 'triangle', dur * 0.9, 0.1), time * 1000);
      time += dur;
    });
    bgMusicInterval = setInterval(() => {
      let t = 0;
      melody.forEach(([freq, dur]) => {
        setTimeout(() => playTone(freq, 'triangle', dur * 0.9, 0.1), t * 1000);
        t += dur;
      });
    }, 4000);
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
// Bật/tắt toàn bộ âm thanh
// ---------------------------------------------
let soundEnabled = true;

export const setSoundEnabled = (val) => {
  soundEnabled = val;
  if (!val) stopBgMusic();
};

export const isSoundEnabled = () => soundEnabled;

// Bọc lại các hàm để kiểm tra soundEnabled
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