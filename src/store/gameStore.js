// =============================================
// ZUSTAND STORE — Quản lý state toàn bộ game
// =============================================
import { create } from 'zustand';
import {
  generateRandomPiles,
  applyMove,
  isGameOver,
  calcAIMove,
  calcNimSum,
  PRESETS,
} from '../utils/nimLogic';
import {
  saveGame,
  loadGame,
  deleteSavedGame,
  saveToHistory,
  saveSettings,
  loadSettings,
} from '../utils/storage';
import {
  sounds,
  playWinSound,
  playLoseSound,
  playBgMusic,
  stopBgMusic,
  setSoundEnabled,
} from '../utils/soundManager';
import { applyTheme } from '../utils/themes';

// ---------------------------------------------
// Cài đặt mặc định
// ---------------------------------------------
const DEFAULT_SETTINGS = {
  gameMode:      'pvp',
  aiDifficulty:  'hard',
  playerNames:   ['Người Chơi 1', 'Người Chơi 2'],
  aiName:        'NIM-Bot',
  misereVariant: false,
  soundEnabled:  true,
  theme:         'default',

  // AI vs AI
  ai1Difficulty: 'hard',
  ai2Difficulty: 'hard',
  ai1Name:       'Bot Alpha',
  ai2Name:       'Bot Beta',
};

const savedSettings = loadSettings();

if (savedSettings?.theme) {
  applyTheme(savedSettings.theme);
}

// ---------------------------------------------
// Tạo store
// ---------------------------------------------
export const useGameStore = create((set, get) => ({

  // ── Cài đặt ────────────────────────────────
  settings: { ...DEFAULT_SETTINGS, ...(savedSettings || {}) },

  updateSettings: (partial) => {
    const newSettings = { ...get().settings, ...partial };
    set({ settings: newSettings });
    saveSettings(newSettings);

    if (partial.theme) {
      applyTheme(partial.theme);
      if (newSettings.soundEnabled) {
        playBgMusic(partial.theme);
      }
    }

    if (partial.soundEnabled !== undefined) {
      setSoundEnabled(partial.soundEnabled);
      if (partial.soundEnabled) {
        playBgMusic(newSettings.theme);
      } else {
        stopBgMusic();
      }
    }
  },

  // ── Trạng thái game ────────────────────────
  piles:         [3, 5, 7],
  currentPlayer: 0,
  gamePhase:     'menu',
  winner:        null,
  moveHistory:   [],
  isAIThinking:  false,
  nimSum:        0,
  turnCount:     0,
  gameStartTime: null,

  // ── AI vs AI state ─────────────────────────
  isAIvsAI:       false,
  aivsaiRunning:  false,
  aivsaiSpeed:    'normal',
  aivsaiInterval: null,

  // ── Bắt đầu game mới ───────────────────────
  startGame: (piles) => {
    const initPiles    = piles || get().piles;
    const { settings } = get();

    // Dừng AI vs AI nếu đang chạy
    get().stopAIvsAI();

    if (settings.soundEnabled) {
      playBgMusic(settings.theme);
    }

    set({
      piles:         initPiles,
      currentPlayer: 0,
      gamePhase:     'playing',
      winner:        null,
      moveHistory:   [],
      isAIThinking:  false,
      nimSum:        calcNimSum(initPiles),
      turnCount:     0,
      gameStartTime: Date.now(),
      isAIvsAI:      settings.gameMode === 'aivai',
      aivsaiRunning: false,
    });
    deleteSavedGame();
  },

  // ── Sinh piles ngẫu nhiên ──────────────────
  randomizeGame: () => {
    const piles = generateRandomPiles(3, 5, 10);
    set({ piles });
    return piles;
  },

  // ── Chọn preset ────────────────────────────
  applyPreset: (presetKey) => {
    const preset = PRESETS[presetKey];
    if (preset) set({ piles: [...preset.piles] });
  },

  // ── Thực hiện nước đi ──────────────────────
  makeMove: (pileIndex, removeCount) => {
    const {
      piles, currentPlayer, moveHistory,
      settings, turnCount,
    } = get();

    if (piles[pileIndex] < removeCount || removeCount < 1) return false;

    const newPiles   = applyMove(piles, pileIndex, removeCount);
    const newHistory = [
      ...moveHistory,
      {
        player:      currentPlayer,
        pileIndex,
        removeCount,
        pilesAfter:  newPiles,
        timestamp:   Date.now(),
      },
    ];

    // Kiểm tra kết thúc
    if (isGameOver(newPiles)) {
      let winner;
      if (settings.misereVariant) {
        winner = currentPlayer === 0 ? 1 : 0;
      } else {
        winner = currentPlayer;
      }

      // Dừng AI vs AI
      get().stopAIvsAI();
      stopBgMusic();

      if (settings.soundEnabled) {
        if (settings.gameMode === 'pvc') {
          if (winner === 0) playWinSound();
          else              playLoseSound();
        } else {
          playWinSound();
        }
      }

      saveToHistory({
        winner,
        mode:       settings.gameMode,
        difficulty: settings.aiDifficulty,
        turns:      turnCount + 1,
        duration:   Math.round((Date.now() - get().gameStartTime) / 1000),
      });

      set({
        piles:       newPiles,
        moveHistory: newHistory,
        gamePhase:   'gameover',
        winner,
        nimSum:      0,
        turnCount:   turnCount + 1,
      });
      return true;
    }

    // Chuyển lượt
    const nextPlayer = currentPlayer === 0 ? 1 : 0;
    set({
      piles:         newPiles,
      currentPlayer: nextPlayer,
      moveHistory:   newHistory,
      nimSum:        calcNimSum(newPiles),
      turnCount:     turnCount + 1,
    });

    // Nếu PvC và đến lượt AI
    if (settings.gameMode === 'pvc' && nextPlayer === 1) {
      setTimeout(() => get().triggerAIMove(), 800);
    }

    return true;
  },

  // ── AI tự động đi (PvC) ────────────────────
  triggerAIMove: () => {
    const { piles, settings, gamePhase } = get();
    if (gamePhase !== 'playing') return;

    set({ isAIThinking: true });

    if (settings.soundEnabled) sounds.aiThink();

    setTimeout(() => {
      const move = calcAIMove(piles, settings.aiDifficulty);
      if (move) {
        set({ isAIThinking: false });
        get().makeMove(move.pileIndex, move.removeCount);
      } else {
        set({ isAIThinking: false });
      }
    }, 600);
  },

  // ── AI vs AI: đi một bước ──────────────────
  stepAIvsAI: () => {
    const { piles, currentPlayer, settings, gamePhase } = get();
    if (gamePhase !== 'playing') return;

    // Chọn độ khó theo AI nào đang đi
    const difficulty = currentPlayer === 0
      ? settings.ai1Difficulty
      : settings.ai2Difficulty;

    set({ isAIThinking: true });

    const move = calcAIMove(piles, difficulty);
    if (move) {
      if (settings.soundEnabled) sounds.pick();
      set({ isAIThinking: false });
      get().makeMove(move.pileIndex, move.removeCount);
    } else {
      set({ isAIThinking: false });
    }
  },

  // ── AI vs AI: bắt đầu tự chạy ─────────────
  startAIvsAI: () => {
    const { aivsaiSpeed, gamePhase } = get();
    if (gamePhase !== 'playing') return;

    // Delay theo tốc độ
    const delayMap = { slow: 1500, normal: 800, fast: 300 };
    const delay    = delayMap[aivsaiSpeed] || 800;

    const interval = setInterval(() => {
      const { gamePhase: phase } = get();
      if (phase !== 'playing') {
        get().stopAIvsAI();
        return;
      }
      get().stepAIvsAI();
    }, delay);

    set({ aivsaiRunning: true, aivsaiInterval: interval });
  },

  // ── AI vs AI: tạm dừng ─────────────────────
  pauseAIvsAI: () => {
    const { aivsaiInterval } = get();
    if (aivsaiInterval) {
      clearInterval(aivsaiInterval);
    }
    set({ aivsaiRunning: false, aivsaiInterval: null });
  },

  // ── AI vs AI: dừng hẳn ─────────────────────
  stopAIvsAI: () => {
    const { aivsaiInterval } = get();
    if (aivsaiInterval) {
      clearInterval(aivsaiInterval);
    }
    set({
      aivsaiRunning:  false,
      aivsaiInterval: null,
    });
  },

  // ── AI vs AI: đổi tốc độ ──────────────────
  setAIvsAISpeed: (speed) => {
    const { aivsaiRunning } = get();
    set({ aivsaiSpeed: speed });

    // Nếu đang chạy thì restart với tốc độ mới
    if (aivsaiRunning) {
      get().pauseAIvsAI();
      setTimeout(() => get().startAIvsAI(), 100);
    }
  },

  // ── Hoàn tác ───────────────────────────────
  undoMove: () => {
    const { moveHistory, settings } = get();
    const stepsBack  = settings.gameMode === 'pvc' ? 2 : 1;
    if (moveHistory.length < stepsBack) return;

    const newHistory     = moveHistory.slice(0, -stepsBack);
    const prevMove       = newHistory[newHistory.length - 1];
    const restoredPiles  = prevMove ? prevMove.pilesAfter : [3, 5, 7];
    const restoredPlayer = prevMove
      ? (prevMove.player === 0 ? 1 : 0)
      : 0;

    set({
      piles:         restoredPiles,
      currentPlayer: restoredPlayer,
      moveHistory:   newHistory,
      gamePhase:     'playing',
      winner:        null,
      nimSum:        calcNimSum(restoredPiles),
    });
  },

  // ── Lưu game ───────────────────────────────
  saveCurrentGame: () => {
    const {
      piles, currentPlayer, moveHistory,
      settings, turnCount, gameStartTime,
    } = get();
    return saveGame({
      piles, currentPlayer, moveHistory,
      settings, turnCount, gameStartTime,
    });
  },

  // ── Tải game đã lưu ────────────────────────
  loadSavedGame: () => {
    const saved = loadGame();
    if (!saved) return false;

    if (saved.settings?.theme) {
      applyTheme(saved.settings.theme);
    }

    set({
      piles:         saved.piles,
      currentPlayer: saved.currentPlayer,
      moveHistory:   saved.moveHistory || [],
      settings:      { ...get().settings, ...saved.settings },
      gamePhase:     'playing',
      winner:        null,
      nimSum:        calcNimSum(saved.piles),
      turnCount:     saved.turnCount     || 0,
      gameStartTime: saved.gameStartTime || Date.now(),
    });
    return true;
  },

  // ── Điều hướng ─────────────────────────────
  goToMenu: () => {
    get().stopAIvsAI();
    stopBgMusic();
    set({ gamePhase: 'menu' });
  },

  goToSetup:    () => set({ gamePhase: 'setup'    }),
  goToTutorial: () => set({ gamePhase: 'tutorial' }),
  goToStats:    () => set({ gamePhase: 'stats'    }),
}));