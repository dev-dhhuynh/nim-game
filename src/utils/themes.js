// =============================================
// THEMES — Định nghĩa toàn bộ chủ đề game
// =============================================

// Import ảnh nền — đuôi .gif
import bgDefault   from '../assets/images/default.gif';
import bgChristmas from '../assets/images/christmas.jpg';
import bgHalloween from '../assets/images/halloween.gif';
import bgSummer    from '../assets/images/summer.gif';

export const THEMES = {

  // ── Mặc định ─────────────────────────────
  default: {
    key:     'default',
    label:   '🎮 Mặc định',
    emoji:   null,
    bgMusic: 'default',
    bgImage: bgDefault,

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
      '--bg-overlay':    'transparent',
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
      '--bg-primary':    '#0a1628',
      '--bg-secondary':  '#0d1f35',
      '--bg-card':       '#102440',
      '--accent-primary':'#a8d8f0',
      '--accent-gold':   '#ffd700',
      '--accent-red':    '#ff4444',
      '--border':        '#1e3a5a',
      '--text-primary':  '#e8f4ff',
      '--text-secondary':'#90b8d8',
      '--text-muted':    '#506070',
      '--bg-overlay':    'transparent',
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
    '--bg-primary':    '#0d0d14',   /* giữ tối trung tính như default */
    '--bg-secondary':  '#1a1a26',   /* giữ tối trung tính như default */
    '--bg-card':       '#21212f',   /* giữ tối trung tính như default */
    '--accent-primary':'#ff6a00',   /* cam bí ngô — chỉ dùng cho accent */
    '--accent-gold':   '#ffaa00',
    '--accent-red':    '#ff3300',
    '--border':        '#35354a',   /* giữ viền như default */
    '--text-primary':  '#fff0e0',   /* vàng ấm nhẹ */
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
      '--bg-overlay':    'transparent',
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