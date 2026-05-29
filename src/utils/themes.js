// =============================================
// THEMES — Định nghĩa toàn bộ chủ đề game
// =============================================

export const THEMES = {

  // ── Mặc định ─────────────────────────────
  default: {
    key:       'default',
    label:     '🎮 Mặc định',
    emoji:     null,        // dùng ◆
    bgMusic:   'default',   // không có nhạc nền

    colors: {
      '--bg-primary':    '#0d0d14',
      '--bg-secondary':  '#1a1a26',
      '--bg-card':       '#21212f',
      '--accent-primary':'#00f5c4',
      '--accent-gold':   '#ffd000',
      '--accent-red':    '#ff4571',
      '--border':        '#35354a',
      '--text-primary':  '#f0f0ff',
      '--text-secondary':'#a8a8c8',
      '--text-muted':    '#606080',
    },
  },

  // ── Giáng Sinh ────────────────────────────
  christmas: {
    key:     'christmas',
    label:   '🎄 Giáng Sinh',
    emoji:   '⛄',
    bgMusic: 'christmas',

    colors: {
      '--bg-primary':    '#0a1a0a',
      '--bg-secondary':  '#0f2a0f',
      '--bg-card':       '#142814',
      '--accent-primary':'#ff4444',
      '--accent-gold':   '#ffd700',
      '--accent-red':    '#ff6b6b',
      '--border':        '#1e4a1e',
      '--text-primary':  '#fff5f5',
      '--text-secondary':'#c8a8a8',
      '--text-muted':    '#806060',
    },
  },

  // ── Halloween ─────────────────────────────
  halloween: {
    key:     'halloween',
    label:   '🎃 Halloween',
    emoji:   '🎃',
    bgMusic: 'halloween',

    colors: {
      '--bg-primary':    '#0f0a00',
      '--bg-secondary':  '#1a1000',
      '--bg-card':       '#221500',
      '--accent-primary':'#ff6a00',
      '--accent-gold':   '#cc44ff',
      '--accent-red':    '#ff3333',
      '--border':        '#3a2800',
      '--text-primary':  '#fff0e0',
      '--text-secondary':'#c8a870',
      '--text-muted':    '#806040',
    },
  },

  // ── Mùa Hè ───────────────────────────────
  summer: {
    key:     'summer',
    label:   '☀️ Mùa Hè',
    emoji:   '💧',
    bgMusic: 'summer',

    colors: {
      '--bg-primary':    '#000d1a',
      '--bg-secondary':  '#001a2e',
      '--bg-card':       '#00203a',
      '--accent-primary':'#00cfff',
      '--accent-gold':   '#ffdd00',
      '--accent-red':    '#ff6644',
      '--border':        '#004060',
      '--text-primary':  '#f0faff',
      '--text-secondary':'#80c8e0',
      '--text-muted':    '#406070',
    },
  },
};

// ---------------------------------------------
// Áp dụng theme vào CSS variables của trang
// ---------------------------------------------
export const applyTheme = (themeKey) => {
  const theme = THEMES[themeKey] || THEMES.default;
  const root  = document.documentElement;

  Object.entries(theme.colors).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });
};

// ---------------------------------------------
// Lấy thông tin một theme
// ---------------------------------------------
export const getTheme = (themeKey) => {
  return THEMES[themeKey] || THEMES.default;
};