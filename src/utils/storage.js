// =============================================
// LOCAL STORAGE — Lưu & Tải trạng thái game
// =============================================

const HISTORY_KEY  = 'nim_game_history';
const SETTINGS_KEY = 'nim_settings';

// ---------------------------------------------
// HISTORY — Lưu tất cả ván (dở + xong)
// ---------------------------------------------

export const getHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// Lưu ván đang dở (thủ công)
export const saveInProgress = (gameState, saveName = '') => {
  try {
    const history = getHistory();
    const newSave = {
      ...gameState,
      id:        Date.now(),
      type:      'inprogress',  // phân biệt ván dở
      saveName:  saveName || `Ván dở — ${new Date().toLocaleString('vi-VN')}`,
      savedAt:   new Date().toISOString(),
    };
    history.unshift(newSave);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
    return true;
  } catch (e) {
    console.error('Lưu thất bại:', e);
    return false;
  }
};

// Lưu ván đã hoàn thành (tự động)
export const saveToHistory = (result) => {
  try {
    const history = getHistory();
    history.unshift({
      ...result,
      id:      Date.now(),
      type:    'finished',   // ván đã xong
      savedAt: new Date().toISOString(),
      date:    new Date().toISOString(),
    });
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 30)));
  } catch (e) {
    console.error('Lưu lịch sử thất bại:', e);
  }
};

// Xóa một ván theo id
export const deleteHistoryById = (id) => {
  try {
    const history = getHistory().filter((h) => h.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    return true;
  } catch {
    return false;
  }
};

// Xóa toàn bộ lịch sử
export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
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

// Giữ tương thích
export const hasSavedGame    = () => false;
export const saveGame        = () => {};
export const loadGame        = () => null;
export const deleteSavedGame = () => {};
export const hasAutoSave     = () => false;
export const autoSaveGame    = () => {};
export const loadAutoSave    = () => null;
export const clearAutoSave   = () => {};