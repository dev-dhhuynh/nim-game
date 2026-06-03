// =============================================
// THEMES — Định nghĩa toàn bộ chủ đề game
// =============================================

// Import ảnh nền
import bgChristmas from '../assets/images/christmas.jpg';
import bgHalloween from '../assets/images/halloween.jpg';
import bgSummer    from '../assets/images/summer.jpg';

export const THEMES = {

  // ── Mặc định ─────────────────────────────
  default: {
    key:       'default',
    label:     '🎮 Mặc định',
    emoji:     null,
    bgMusic:   'default',
    bgImage:   null,        // không có ảnh nền

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
    bgImage: bgChristmas,

    colors: {
      '--bg-primary':    '#eaf4f0',
      '--bg-secondary':  '#f5fbf8',
      '--bg-card':       '#ffffff',
      '--accent-primary':'#c95a5a',
      '--accent-gold':   '#d8b24c',
      '--accent-red':    '#d96c6c',
      '--border':        '#d7e7df',
      '--text-primary':  '#24352e',
      '--text-secondary':'#4b6258',
      '--text-muted':    '#7a8f86',
    },
  },

  // ── Halloween ─────────────────────────────
  halloween: {
    key:     'halloween',
    label:   '🎃 Halloween',
    emoji:   '🎃',
    bgMusic: 'halloween',
    bgImage: bgHalloween,

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
    bgImage: bgSummer,

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
// Áp dụng theme vào CSS variables
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