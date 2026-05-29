// =============================================
// PLAYER PANEL — Thông tin người chơi
// =============================================
import React from 'react';
import { motion } from 'framer-motion';
import styles from './PlayerPanel.module.css';

const PlayerPanel = ({
  name,          // tên người chơi
  playerIndex,   // 0 hoặc 1
  isActive,      // có đang đến lượt không
  isAI,          // có phải AI không
  moveCount,     // số nước đã đi
  isThinking,    // AI đang suy nghĩ
}) => {

  // Màu riêng cho từng người chơi
  const colors = [
    {
      main:   'var(--accent-primary)',
      bg:     'rgba(0, 245, 196, 0.08)',
      border: 'rgba(0, 245, 196, 0.4)',
    },
    {
      main:   'var(--accent-gold)',
      bg:     'rgba(245, 196, 0, 0.08)',
      border: 'rgba(245, 196, 0, 0.4)',
    },
  ];

  const color = colors[playerIndex] || colors[0];

  return (
    <motion.div
      className={`${styles.panel} ${isActive ? styles.active : ''}`}
      style={{
        '--player-color':  color.main,
        '--player-bg':     color.bg,
        '--player-border': color.border,
      }}
      animate={isActive ? { scale: [1, 1.02, 1] } : { scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Avatar */}
      <div className={styles.avatar}>
        {isAI ? '🤖' : playerIndex === 0 ? '👤' : '🧑'}
      </div>

      {/* Thông tin */}
      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={styles.meta}>
          {isAI && (
            <span className='badge badge-red'>AI</span>
          )}
          <span className={styles.moves}>{moveCount} nước</span>
        </div>
      </div>

      {/* Chấm sáng khi đến lượt */}
      {isActive && (
        <div className={styles.indicator}>
          {isThinking ? (
            // Vòng xoay khi AI đang nghĩ
            <motion.span
              className={styles.thinking}
              animate={{ rotate: 360 }}
              transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
            >
              ⟳
            </motion.span>
          ) : (
            // Chấm nhấp nháy khi đến lượt người
            <motion.div
              className={styles.dot}
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
        </div>
      )}

    </motion.div>
  );
};

export default PlayerPanel;