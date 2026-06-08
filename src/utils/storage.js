// =============================================
// LOCAL STORAGE — Lưu & Tải trạng thái game
// =============================================

const AUTO_SAVE_KEY  = 'nim_auto_save';    // ván dang dở
const HISTORY_KEY    = 'nim_game_history'; // lịch sử ván đã chơi
const SETTINGS_KEY   = 'nim_settings';

// ---------------------------------------------
// AUTO SAVE — Ván dang dở (tự động)
// ---------------------------------------------

// Lưu tự động ván đang chơi
export const autoSaveGame = (gameState) => {
  try {
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify({
      ...gameState,
      savedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.error('Auto save thất bại:', e);
  }
};

// Tải ván dang dở
export const loadAutoSave = () => {
  try {
    const raw = localStorage.getItem(AUTO_SAVE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Xóa ván dang dở (khi game kết thúc)
export const clearAutoSave = () => {
  localStorage.removeItem(AUTO_SAVE_KEY);
};

// Kiểm tra có ván dang dở không
export const hasAutoSave = () => {
  return localStorage.getItem(AUTO_SAVE_KEY) !== null;
};

// ---------------------------------------------
// HISTORY — Lịch sử ván đã hoàn thành
// ---------------------------------------------

// Lưu ván vừa kết thúc vào lịch sử
export const saveToHistory = (result) => {
  try {
    const history = getHistory();
    history.unshift({
      ...result,
      id:   Date.now(),
      date: new Date().toISOString(),
    });
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, 20))
    );
  } catch (e) {
    console.error('Lưu lịch sử thất bại:', e);
  }
};

// Lấy toàn bộ lịch sử
export const getHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Xóa toàn bộ lịch sử
export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// Xóa một ván trong lịch sử theo id
export const deleteHistoryById = (id) => {
  try {
    const history = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {}
};

// ---------------------------------------------
// CÀI ĐẶT
// ---------------------------------------------
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
};

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// Giữ lại để tương thích
export const hasSavedGame  = hasAutoSave;
export const saveGame      = autoSaveGame;
export const loadGame      = loadAutoSave;
export const deleteSavedGame = clearAutoSave;