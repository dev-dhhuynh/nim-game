// =============================================
// LƯU & TẢI TRẠNG THÁI GAME (LocalStorage)
// =============================================

// Tên các "chìa khóa" lưu trong LocalStorage
const SAVE_KEY     = 'nim_saved_game';
const HISTORY_KEY  = 'nim_game_history';
const SETTINGS_KEY = 'nim_settings';

// ---------------------------------------------
// LƯU game đang chơi
// ---------------------------------------------
export const saveGame = (gameState) => {
  try {
    const saveData = {
      ...gameState,
      savedAt: new Date().toISOString(), // ghi thời điểm lưu
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
    return true;
  } catch (e) {
    console.error('Lưu game thất bại:', e);
    return false;
  }
};

// ---------------------------------------------
// TẢI game đã lưu
// ---------------------------------------------
export const loadGame = () => {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;       // chưa có gì được lưu
    return JSON.parse(raw);
  } catch (e) {
    console.error('Tải game thất bại:', e);
    return null;
  }
};

// ---------------------------------------------
// XÓA game đã lưu
// ---------------------------------------------
export const deleteSavedGame = () => {
  localStorage.removeItem(SAVE_KEY);
};

// ---------------------------------------------
// KIỂM TRA có game đã lưu không
// ---------------------------------------------
export const hasSavedGame = () => {
  return localStorage.getItem(SAVE_KEY) !== null;
};

// ---------------------------------------------
// LƯU VÀO LỊCH SỬ sau mỗi ván
// ---------------------------------------------
export const saveToHistory = (result) => {
  try {
    const history = getHistory();

    // Thêm ván mới vào đầu danh sách
    history.unshift({
      ...result,
      id:   Date.now(),
      date: new Date().toISOString(),
    });

    // Chỉ giữ tối đa 50 ván gần nhất
    localStorage.setItem(
      HISTORY_KEY,
      JSON.stringify(history.slice(0, 50))
    );
  } catch (e) {
    console.error('Lưu lịch sử thất bại:', e);
  }
};

// ---------------------------------------------
// LẤY LỊCH SỬ các ván đã chơi
// ---------------------------------------------
export const getHistory = () => {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

// ---------------------------------------------
// XÓA toàn bộ lịch sử
// ---------------------------------------------
export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
};

// ---------------------------------------------
// LƯU cài đặt người dùng
// ---------------------------------------------
export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (e) {
    console.error('Lưu settings thất bại:', e);
  }
};

// ---------------------------------------------
// TẢI cài đặt người dùng
// ---------------------------------------------
export const loadSettings = () => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};