// Giao diện kết thúc ván

import React from 'react';
// Dòng mới — bỏ AnimatePresence đi
import { motion } from 'framer-motion';
import styles from './GameOverModal.module.css';

const GameOverModal = ({
  winner,       // index người thắng (0 hoặc 1)
  playerNames,  // tên 2 người chơi
  settings,     // cài đặt game
  onRestart,    // hàm chơi lại
  onMenu,       // hàm về menu
}) => {

  // Lấy tên người thắng
  const getName = (idx) => {
    if (settings.gameMode === 'pvc' && idx === 1) return settings.aiName;
    return playerNames[idx];
  };

  const winnerName = getName(winner);
  const isAIWon   = settings.gameMode === 'pvc' && winner === 1;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.7, y: 60 }}
        animate={{ scale: 1,   y: 0  }}
        exit={{ scale: 0.7,    y: 60 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      >

        {/* Icon */}
        <motion.div
          className={styles.icon}
          animate={{ rotate: [0, -10, 10, -5, 5, 0] }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {isAIWon ? '🤖' : '🏆'}
        </motion.div>

        {/* Kết quả */}
        <div className={styles.result}>
          <p className={styles.label}>
            {isAIWon ? 'MÁY THẮNG' : 'NGƯỜI THẮNG'}
          </p>
          <p className={`${styles.winnerName} ${isAIWon ? styles.aiWin : styles.humanWin}`}>
            {winnerName}
          </p>
        </div>

        {/* Lời nhắn */}
        <p className={styles.message}>
          {isAIWon
            ? 'AI đã tính toán hoàn hảo! Thử lại nhé.'
            : `Chúc mừng ${winnerName}! Chiến lược xuất sắc!`}
        </p>

        {/* Nút hành động */}
        <div className={styles.actions}>
          <button className='btn btn-primary' onClick={onRestart}>
            ↺ Chơi Lại
          </button>
          <button className='btn btn-ghost' onClick={onMenu}>
            ⌂ Menu
          </button>
        </div>

        {/* Confetti chỉ hiện khi người thắng */}
        {!isAIWon && (
          <div className={styles.confetti}>
            {[...Array(20)].map((_, i) => (
              <motion.span
                key={i}
                className={styles.particle}
                style={{
                  '--color': ['#00f5c4','#f5c400','#7b2ff7','#ff3864'][i % 4],
                  left: `${Math.random() * 100}%`,
                }}
                initial={{ y: 0,    opacity: 1, scale: 1   }}
                animate={{ y: -220, opacity: 0, scale: 0.5 }}
                transition={{
                  duration: 1.2 + Math.random() * 0.8,
                  delay:    Math.random() * 0.4,
                }}
              />
            ))}
          </div>
        )}

      </motion.div>
    </motion.div>
  );
};

export default GameOverModal;