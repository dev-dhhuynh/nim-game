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
  autoSaveGame,
  loadAutoSave,
  clearAutoSave,
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

const DEFAULT_SETTINGS = {
  gameMode:         'pvp',
  aiDifficulty:     'hard',
  playerNames:      ['Người Chơi 1', 'Người Chơi 2'],
  aiName:           'NIM-Bot',
  misereVariant:    false,
  soundEnabled:     true,
  theme:            'default',
  ai1Difficulty:    'hard',
  ai2Difficulty:    'hard',
  ai1Name:          'Bot Alpha',
  ai2Name:          'Bot Beta',
  countdownEnabled: false,
  countdownSeconds: 15,
};

const savedSettings = loadSettings();
if (savedSettings?.theme) applyTheme(savedSettings.theme);

export const useGameStore = create((set, get) => ({

  // ── Cài đặt ────────────────────────────────
  settings: { ...DEFAULT_SETTINGS, ...(savedSettings || {}) },

  updateSettings: (partial) => {
    const newSettings = { ...get().settings, ...partial };
    set({ settings: newSettings });
    saveSettings(newSettings);
    if (partial.theme) {
      applyTheme(partial.theme);
      if (newSettings.soundEnabled) playBgMusic(partial.theme);
    }
    if (partial.soundEnabled !== undefined) {
      setSoundEnabled(partial.soundEnabled);
      if (partial.soundEnabled) playBgMusic(newSettings.theme);
      else stopBgMusic();
    }
  },

  // ── Trạng thái game ────────────────────────
  piles:          [3, 5, 7],
  initialPiles:   [3, 5, 7],
  currentPlayer:  0,
  gamePhase:      'menu',
  winner:         null,
  moveHistory:    [],
  isAIThinking:   false,
  nimSum:         0,
  turnCount:      0,
  gameStartTime:  null,

  // AI vs AI
  isAIvsAI:       false,
  aivsaiRunning:  false,
  aivsaiSpeed:    'normal',
  aivsaiInterval: null,

  // Countdown
  countdownLeft:  15,
  countdownTimer: null,

  // ── Countdown ──────────────────────────────
  startCountdown: () => {
    get().clearCountdown();
    const timer = setInterval(() => {
      const { countdownLeft, gamePhase, settings: s } = get();
      if (gamePhase !== 'playing') {
        get().clearCountdown();
        return;
      }
      if (countdownLeft <= 1) {
        get().clearCountdown();
        const { currentPlayer } = get();
        const winner = currentPlayer === 0 ? 1 : 0;
        if (s.soundEnabled) playLoseSound();
        clearAutoSave();
        saveToHistory({
          winner,
          mode:       s.gameMode,
          difficulty: s.aiDifficulty,
          turns:      get().turnCount,
          duration:   Math.round((Date.now() - get().gameStartTime) / 1000),
          initialPiles: get().initialPiles,
          endReason:  'timeout',
        });
        stopBgMusic();
        set({ gamePhase: 'gameover', winner, nimSum: 0 });
      } else {
        set({ countdownLeft: countdownLeft - 1 });
      }
    }, 1000);
    set({ countdownTimer: timer });
  },

  resetCountdown: () => {
    get().clearCountdown();
    const { settings, gamePhase } = get();
    if (gamePhase !== 'playing') return;
    set({ countdownLeft: settings.countdownSeconds });
    if (settings.countdownEnabled) get().startCountdown();
  },

  clearCountdown: () => {
    const { countdownTimer } = get();
    if (countdownTimer) {
      clearInterval(countdownTimer);
      set({ countdownTimer: null });
    }
  },

  // ── Bắt đầu game mới ───────────────────────
  startGame: (piles) => {
    const initPiles    = piles || get().initialPiles;
    const { settings } = get();

    get().stopAIvsAI();
    get().clearCountdown();
    clearAutoSave();

    if (settings.soundEnabled) playBgMusic(settings.theme);

    set({
      piles:         initPiles,
      initialPiles:  initPiles,
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
      countdownLeft: settings.countdownSeconds,
    });

    if (settings.countdownEnabled && settings.gameMode !== 'aivai') {
      setTimeout(() => get().startCountdown(), 100);
    }
  },

  // ── Tiếp tục ván dang dở ───────────────────
  continueGame: () => {
    const saved = loadAutoSave();
    if (!saved) return false;

    if (saved.settings?.theme) applyTheme(saved.settings.theme);

    get().clearCountdown();
    get().stopAIvsAI();

    if (saved.settings?.soundEnabled) {
      playBgMusic(saved.settings?.theme || 'default');
    }

    set({
      piles:         saved.piles,
      initialPiles:  saved.initialPiles || saved.piles,
      currentPlayer: saved.currentPlayer,
      moveHistory:   saved.moveHistory  || [],
      settings:      { ...get().settings, ...saved.settings },
      gamePhase:     'playing',
      winner:        null,
      nimSum:        calcNimSum(saved.piles),
      turnCount:     saved.turnCount     || 0,
      gameStartTime: saved.gameStartTime || Date.now(),
      countdownLeft: saved.settings?.countdownSeconds || 15,
      isAIvsAI:      saved.settings?.gameMode === 'aivai',
    });

    // Bắt đầu countdown nếu có
    if (saved.settings?.countdownEnabled && saved.settings?.gameMode !== 'aivai') {
      setTimeout(() => get().startCountdown(), 100);
    }

    return true;
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

    if (isGameOver(newPiles)) {
      let winner;
      if (settings.misereVariant) {
        winner = currentPlayer === 0 ? 1 : 0;
      } else {
        winner = currentPlayer;
      }

      get().stopAIvsAI();
      get().clearCountdown();
      clearAutoSave();
      stopBgMusic();

      if (settings.soundEnabled) {
        if (settings.gameMode === 'pvc') {
          if (winner === 0) playWinSound();
          else              playLoseSound();
        } else {
          playWinSound();
        }
      }

      // Lưu vào lịch sử ván đã hoàn thành
      saveToHistory({
        winner,
        mode:         settings.gameMode,
        difficulty:   settings.aiDifficulty,
        turns:        turnCount + 1,
        duration:     Math.round((Date.now() - get().gameStartTime) / 1000),
        initialPiles: get().initialPiles,
        playerNames:  settings.playerNames,
        aiName:       settings.aiName,
        misere:       settings.misereVariant,
        endReason:    'normal',
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

    const nextPlayer = currentPlayer === 0 ? 1 : 0;

    set({
      piles:         newPiles,
      currentPlayer: nextPlayer,
      moveHistory:   newHistory,
      nimSum:        calcNimSum(newPiles),
      turnCount:     turnCount + 1,
      countdownLeft: settings.countdownSeconds,
    });

    // Tự động lưu sau mỗi nước đi
    const newState = get();
    autoSaveGame({
      piles:         newPiles,
      initialPiles:  newState.initialPiles,
      currentPlayer: nextPlayer,
      moveHistory:   newHistory,
      settings,
      turnCount:     turnCount + 1,
      gameStartTime: newState.gameStartTime,
    });

    if (settings.countdownEnabled && settings.gameMode !== 'aivai') {
      get().resetCountdown();
    }

    if (settings.gameMode === 'pvc' && nextPlayer === 1) {
      setTimeout(() => get().triggerAIMove(), 800);
    }

    return true;
  },

  // ── AI tự động đi ──────────────────────────
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

  // ── AI vs AI ───────────────────────────────
  stepAIvsAI: () => {
    const { piles, currentPlayer, settings, gamePhase } = get();
    if (gamePhase !== 'playing') return;

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

  startAIvsAI: () => {
    const { aivsaiSpeed, gamePhase } = get();
    if (gamePhase !== 'playing') return;

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

  pauseAIvsAI: () => {
    const { aivsaiInterval } = get();
    if (aivsaiInterval) clearInterval(aivsaiInterval);
    set({ aivsaiRunning: false, aivsaiInterval: null });
  },

  stopAIvsAI: () => {
    const { aivsaiInterval } = get();
    if (aivsaiInterval) clearInterval(aivsaiInterval);
    set({ aivsaiRunning: false, aivsaiInterval: null });
  },

  setAIvsAISpeed: (speed) => {
    const { aivsaiRunning } = get();
    set({ aivsaiSpeed: speed });
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
    const restoredPiles  = prevMove ? prevMove.pilesAfter : get().initialPiles;
    const restoredPlayer = prevMove ? (prevMove.player === 0 ? 1 : 0) : 0;

    get().resetCountdown();

    set({
      piles:         restoredPiles,
      currentPlayer: restoredPlayer,
      moveHistory:   newHistory,
      gamePhase:     'playing',
      winner:        null,
      nimSum:        calcNimSum(restoredPiles),
    });
  },

  // ── Điều hướng ─────────────────────────────
  goToMenu: () => {
    get().stopAIvsAI();
    get().clearCountdown();
    stopBgMusic();
    set({ gamePhase: 'menu' });
  },

  goToSetup:    () => set({ gamePhase: 'setup'    }),
  goToTutorial: () => set({ gamePhase: 'tutorial' }),
  goToStats:    () => set({ gamePhase: 'stats'    }),
}));