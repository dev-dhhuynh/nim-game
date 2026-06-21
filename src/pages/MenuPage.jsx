// Màn hình chính

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import HistoryModal from '../components/HistoryModal';
import { getText } from '../utils/translations';
import styles from './MenuPage.module.css';

const MenuPage = () => {
  const {
    goToSetup,
    goToTutorial,
    goToStats,
    startGame,
    updateSettings,
    continueFromSave,
    settings,
  } = useGameStore();

  const [showHistory, setShowHistory] = useState(false);

  const lang = settings.language || 'vi';
  const t    = getText(lang);

  const toggleLanguage = () => {
    updateSettings({ language: lang === 'vi' ? 'en' : 'vi' });
  };

  // Chơi lại với cùng cấu hình ván đã hoàn thành
  const handleReplay = (historyItem) => {
    if (historyItem.initialPiles) {
      updateSettings({
        gameMode:      historyItem.mode       || 'pvp',
        aiDifficulty:  historyItem.difficulty || 'hard',
        misereVariant: historyItem.misere     || false,
        playerNames:   historyItem.playerNames || ['Người Chơi 1', 'Người Chơi 2'],
        aiName:        historyItem.aiName      || 'NIM-Bot',
      });
      startGame(historyItem.initialPiles);
    }
  };

  // Tiếp tục ván đang dở
  const handleContinue = (saved) => {
    continueFromSave(saved);
  };

  return (
    <div className={styles.menu}>

      {/* Các vòng sáng nền */}
      <div className={styles.bgDeco}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.bgOrb} style={{ '--i': i }} />
        ))}
      </div>

      {/* Nút đổi ngôn ngữ */}
      <button
        className={`btn btn-ghost ${styles.langBtn}`}
        onClick={toggleLanguage}
        title={lang === 'vi' ? 'Switch to English' : 'Chuyển sang Tiếng Việt'}
      >
        {lang === 'vi' ? '🇻🇳 VI' : '🇬🇧 EN'}
      </button>

      {/* Logo */}
      <motion.div
        className={styles.logo}
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <div className={styles.logoIcons}>
          <span>◆</span>
          <span>◆</span>
          <span>◆</span>
        </div>
        <h1 className={styles.title}>
          <span className={styles.letterN}>N</span>
          <span className={styles.letterI}>I</span>
          <span className={styles.letterM}>M</span>
        </h1>
        <p className={styles.subtitle}>{t.subtitle}</p>
      </motion.div>

      {/* Các nút */}
      <motion.div
        className={styles.actions}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <button
          className={`btn btn-primary ${styles.btnMain}`}
          onClick={goToSetup}
        >
          {t.playNew}
        </button>

        <button
          className={`btn btn-ghost ${styles.btnMain}`}
          onClick={() => setShowHistory(true)}
        >
          {t.history}
        </button>

        <button
          className={`btn btn-ghost ${styles.btnMain}`}
          onClick={goToTutorial}
        >
          {t.tutorial}
        </button>

        <button
          className={`btn btn-ghost ${styles.btnMain}`}
          onClick={goToStats}
        >
          {t.stats}
        </button>
      </motion.div>

      {/* Hướng dẫn nhanh */}
      <motion.div
        className={styles.howto}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className={styles.howtoTitle}>{t.howtoTitle}</p>
        <p>
          {t.howtoLine1}<em>{t.howtoEm}</em>{t.howtoLine2}
          <strong>{t.howtoStrong}</strong>{t.howtoEnd}
        </p>
      </motion.div>

      {/* Phiên bản */}
      <div className={styles.version}>{t.version}</div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal
            isOpen={showHistory}
            onReplay={handleReplay}
            onContinue={handleContinue}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default MenuPage;