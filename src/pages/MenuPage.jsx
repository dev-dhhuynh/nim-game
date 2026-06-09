// Màn hình chính

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { hasAutoSave } from '../utils/storage';
import HistoryModal from '../components/HistoryModal';
import styles from './MenuPage.module.css';

const MenuPage = () => {
  const {
    goToSetup,
    goToTutorial,
    goToStats,
    continueGame,
    startGame,
    updateSettings,
  } = useGameStore();

  const [showHistory,  setShowHistory]  = useState(false);
  const [hasContinue,  setHasContinue]  = useState(false);

  useEffect(() => {
    setHasContinue(hasAutoSave());
  }, []);

  // Chơi lại với cùng cấu hình ván cũ
  const handleReplay = (historyItem) => {
    if (historyItem.initialPiles) {
      updateSettings({
        gameMode:      historyItem.mode      || 'pvp',
        aiDifficulty:  historyItem.difficulty || 'hard',
        misereVariant: historyItem.misere     || false,
        playerNames:   historyItem.playerNames || ['Người Chơi 1', 'Người Chơi 2'],
        aiName:        historyItem.aiName      || 'NIM-Bot',
      });
      startGame(historyItem.initialPiles);
    }
  };

  return (
    <div className={styles.menu}>

      {/* Các vòng sáng nền */}
      <div className={styles.bgDeco}>
        {[...Array(4)].map((_, i) => (
          <div key={i} className={styles.bgOrb} style={{ '--i': i }} />
        ))}
      </div>

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
        <p className={styles.subtitle}>THE ANCIENT STRATEGY GAME</p>
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
          ▶ Chơi Mới
        </button>

        {/* Chỉ hiện khi có ván dang dở */}
        {hasContinue && (
          <button
            className={`btn btn-secondary ${styles.btnMain}`}
            onClick={continueGame}
          >
            ↩ Tiếp Tục
          </button>
        )}

        <button
          className={`btn btn-ghost ${styles.btnMain}`}
          onClick={() => setShowHistory(true)}
        >
          📁 Lịch Sử Đấu
        </button>

        <button
          className={`btn btn-ghost ${styles.btnMain}`}
          onClick={goToTutorial}
        >
          📖 Hướng Dẫn
        </button>

        <button
          className={`btn btn-ghost ${styles.btnMain}`}
          onClick={goToStats}
        >
          📊 Thống Kê
        </button>
      </motion.div>

      {/* Hướng dẫn nhanh */}
      <motion.div
        className={styles.howto}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className={styles.howtoTitle}>CÁCH CHƠI</p>
        <p>
          Lấy bất kỳ số que từ <em>một hàng</em>.
          Người lấy que <strong>cuối cùng thắng</strong>.
        </p>
      </motion.div>

      {/* Phiên bản */}
      <div className={styles.version}>NIM v1.0 · Niên Luận Cơ Sở</div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal
            isOpen={showHistory}
            onReplay={handleReplay}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default MenuPage;