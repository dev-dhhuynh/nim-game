// =============================================
// LOCAL STORAGE — Lưu & Tải trạng thái game
// =============================================

const SAVE_SLOTS_KEY = 'nim_save_slots';   // nhiều slot
const HISTORY_KEY    = 'nim_game_history';
const SETTINGS_KEY   = 'nim_settings';

// ---------------------------------------------
// SAVE SLOTS — Lưu nhiều ván
// ---------------------------------------------

// Lấy toàn bộ slots (mảng 3 phần tử)
export const getSaveSlots = () => {
  try {
    const raw = localStorage.getItem(SAVE_SLOTS_KEY);
    if (!raw) return [null, null, null];
    const slots = JSON.parse(raw);
    // Đảm bảo luôn có đúng 3 slot
    while (slots.length < 3) slots.push(null);
    return slots.slice(0, 3);
  } catch {
    return [null, null, null];
  }
};

// Lưu vào một slot cụ thể (0, 1, 2)
export const saveToSlot = (slotIndex, gameState, slotName = '') => {
  try {
    const slots = getSaveSlots();
    slots[slotIndex] = {
      ...gameState,
      slotName: slotName || `Ván ${slotIndex + 1}`,
      savedAt:  new Date().toISOString(),
    };
    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
    return true;
  } catch (e) {
    console.error('Lưu slot thất bại:', e);
    return false;
  }
};

// Tải từ một slot
export const loadFromSlot = (slotIndex) => {
  try {
    const slots = getSaveSlots();
    return slots[slotIndex] || null;
  } catch {
    return null;
  }
};

// Xóa một slot
export const deleteSlot = (slotIndex) => {
  try {
    const slots = getSaveSlots();
    slots[slotIndex] = null;
    localStorage.setItem(SAVE_SLOTS_KEY, JSON.stringify(slots));
    return true;
  } catch {
    return false;
  }
};

// Kiểm tra có slot nào đã lưu không
export const hasSavedGame = () => {
  const slots = getSaveSlots();
  return slots.some((s) => s !== null);
};

// Giữ lại các hàm cũ để tương thích
export const saveGame = (gameState) => saveToSlot(0, gameState);
export const loadGame = () => loadFromSlot(0);
export const deleteSavedGame = () => deleteSlot(0);

// ---------------------------------------------
// LỊCH SỬ VÁN ĐÃ CHƠI
// ---------------------------------------------
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
      JSON.stringify(history.slice(0, 50))
    );
  } catch (e) {
    console.error('Lưu lịch sử thất bại:', e);
  }
};

export const getHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// ---------------------------------------------
// CÀI ĐẶT
// ---------------------------------------------
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {}
};

export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};