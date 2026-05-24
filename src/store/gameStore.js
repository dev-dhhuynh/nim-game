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

// ---------------------------------------------
// Cài đặt mặc định
// ---------------------------------------------
const DEFAULT_SETTINGS = {
  gameMode:      'pvp',                        // 'pvp' | 'pvc'
  aiDifficulty:  'hard',                       // 'easy' | 'medium' | 'hard'
  playerNames:   ['Người Chơi 1', 'Người Chơi 2'],
  aiName:        'NIM-Bot',
  misereVariant: false, // true = người lấy cuối THUA
};

// Tải settings đã lưu (nếu có)
const savedSettings = loadSettings();

// ---------------------------------------------
// Tạo store bằng Zustand
// ---------------------------------------------
export const useGameStore = create((set, get) => ({

  // ── Cài đặt ────────────────────────────────
  settings: { ...DEFAULT_SETTINGS, ...(savedSettings || {}) },

  updateSettings: (partial) => {
    const newSettings = { ...get().settings, ...partial };
    set({ settings: newSettings });
    saveSettings(newSettings);
  },

  // ── Trạng thái game ────────────────────────
  piles:         [3, 5, 7],   // số que mỗi hàng
  currentPlayer: 0,           // 0 = người 1, 1 = người 2 / AI
  gamePhase:     'menu',      // 'menu' | 'setup' | 'playing' | 'gameover'
  winner:        null,        // index người thắng
  moveHistory:   [],          // lịch sử nước đi
  isAIThinking:  false,       // AI đang "suy nghĩ"
  nimSum:        0,           // Nim-Sum hiện tại
  turnCount:     0,           // đếm số lượt
  gameStartTime: null,        // thời điểm bắt đầu

  // ── Bắt đầu game mới ───────────────────────
  startGame: (piles) => {
    const initPiles = piles || get().piles;
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
    });
    deleteSavedGame(); // xóa game cũ khi bắt đầu mới
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

    // Kiểm tra hợp lệ
    if (piles[pileIndex] < removeCount || removeCount < 1) return false;

    // Tính piles mới sau nước đi
    const newPiles  = applyMove(piles, pileIndex, removeCount);

    // Ghi vào lịch sử
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

    // Kiểm tra game kết thúc chưa
    if (isGameOver(newPiles)) {
      let winner;
      if (settings.misereVariant) {
        // Misère: lấy cuối THUA
        winner = currentPlayer === 0 ? 1 : 0;
      } else {
        // Normal: lấy cuối THẮNG
        winner = currentPlayer;
      }

      // Lưu vào lịch sử ván
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

    // Nếu PvC và đến lượt AI thì tự động đi
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

  // ── Hoàn tác nước đi ───────────────────────
  undoMove: () => {
    const { moveHistory, settings } = get();

    // PvP undo 1 bước, PvC undo 2 bước (hủy cả lượt AI)
    const stepsBack  = settings.gameMode === 'pvc' ? 2 : 1;
    if (moveHistory.length < stepsBack) return;

    const newHistory = moveHistory.slice(0, -stepsBack);
    const prevMove   = newHistory[newHistory.length - 1];

    // Lấy lại piles trước đó
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

  // ── Lưu game hiện tại ──────────────────────
  saveCurrentGame: () => {
    const { piles, currentPlayer, moveHistory, settings, turnCount, gameStartTime } = get();
    return saveGame({ piles, currentPlayer, moveHistory, settings, turnCount, gameStartTime });
  },

  // ── Tải game đã lưu ────────────────────────
  loadSavedGame: () => {
    const saved = loadGame();
    if (!saved) return false;

    set({
      piles:         saved.piles,
      currentPlayer: saved.currentPlayer,
      moveHistory:   saved.moveHistory || [],
      settings:      { ...get().settings, ...saved.settings },
      gamePhase:     'playing',
      winner:        null,
      nimSum:        calcNimSum(saved.piles),
      turnCount:     saved.turnCount || 0,
      gameStartTime: saved.gameStartTime || Date.now(),
    });
    return true;
  },

  // ── Điều hướng màn hình ────────────────────
  goToMenu:  () => set({ gamePhase: 'menu'  }),
  goToSetup: () => set({ gamePhase: 'setup' }),
}));