// Giao diện chọn chủ đề

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '../utils/themes';
import { useGameStore } from '../store/gameStore';
import { getThemeLabel, getThemeSelectorUI } from '../utils/translations';
import styles from './ThemeSelector.module.css';

const ThemeSelector = ({ currentTheme, onChange }) => {
  const { settings } = useGameStore();
  const lang = settings.language || 'vi';
  const t    = getThemeSelectorUI(lang);

  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (themeKey) => {
    onChange(themeKey);
    setIsOpen(false);
  };

  const current = THEMES[currentTheme] || THEMES.default;

  return (
    <div className={styles.wrapper}>

      {/* Nút mở/đóng */}
      <button
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.triggerLabel}>{t.themeLabel}</span>
        <span className={styles.triggerCurrent}>{getThemeLabel(current.key, lang)}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className={styles.arrow}
        >
          ▼
        </motion.span>
      </button>

      {/* Dropdown danh sách theme */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={styles.dropdown}
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y:  0, scale: 1    }}
            exit={{    opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18 }}
          >
            {Object.values(THEMES).map((theme) => (
              <motion.button
                key={theme.key}
                className={`
                  ${styles.themeItem}
                  ${currentTheme === theme.key ? styles.themeActive : ''}
                `}
                onClick={() => handleSelect(theme.key)}
                whileHover={{ x: 4 }}
                transition={{ duration: 0.1 }}
              >
                {/* Preview màu */}
                <div
                  className={styles.colorDot}
                  style={{
                    background: theme.colors['--accent-primary'],
                    boxShadow:  `0 0 8px ${theme.colors['--accent-primary']}`,
                  }}
                />

                {/* Tên theme */}
                <span className={styles.themeName}>{getThemeLabel(theme.key, lang)}</span>

                {/* Emoji vật phẩm */}
                <span className={styles.themeEmoji}>
                  {theme.emoji || '◆'}
                </span>

                {/* Dấu check nếu đang chọn */}
                {currentTheme === theme.key && (
                  <span className={styles.checkMark}>✓</span>
                )}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ThemeSelector;