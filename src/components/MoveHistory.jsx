// Lịch sử các nước đi

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getMoveHistoryUI } from '../utils/translations';
import styles from './MoveHistory.module.css';

const MoveHistory = ({
  history,      // mảng các nước đi
  playerNames,  // tên 2 người chơi
  settings,     // cài đặt game (để biết mode PvP hay PvC)
}) => {

  const { settings: globalSettings } = useGameStore();
  const lang = globalSettings.language || 'vi';
  const t    = getMoveHistoryUI(lang);

  // Dùng để tự động cuộn xuống cuối danh sách
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Lấy tên người chơi theo index
  const getName = (playerIndex) => {
    if (settings.gameMode === 'pvc' && playerIndex === 1) {
      return settings.aiName;
    }
    return playerNames[playerIndex];
  };

  return (
    <div className={styles.container}>

      {/* Tiêu đề */}
      <div className={styles.header}>
        <span className={styles.title}>{t.title}</span>
        <span className={styles.count}>{history.length}</span>
      </div>

      {/* Danh sách */}
      <div className={styles.list}>
        <AnimatePresence initial={false}>
          {history.length === 0 ? (
            <p className={styles.empty}>{t.empty}</p>
          ) : (
            history.map((move, i) => (
              <motion.div
                key={i}
                className={`${styles.item} ${styles['player' + move.player]}`}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
              >
                {/* Số thứ tự */}
                <span className={styles.turnNum}>#{i + 1}</span>

                {/* Tên người chơi */}
                <span className={styles.playerName}>
                  {getName(move.player)}
                </span>

                {/* Mô tả nước đi */}
                <span className={styles.moveDesc}>
                  {t.took} <strong>{move.removeCount}</strong> {t.fromRow}{' '}
                  <strong>{move.pileIndex + 1}</strong>
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>

        {/* Điểm neo để auto-scroll */}
        <div ref={bottomRef} />
      </div>

    </div>
  );
};

export default MoveHistory;