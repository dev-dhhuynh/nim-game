// =============================================
// AI VS AI CONTROLS — Điều khiển chế độ máy tự chơi
// =============================================
import React from 'react';
import { motion } from 'framer-motion';
import styles from './AIvsAIControls.module.css';

const AIvsAIControls = ({
  isRunning,    // đang chạy tự động không
  speed,        // tốc độ: 'slow' | 'normal' | 'fast'
  onStart,      // bắt đầu tự chơi
  onPause,      // tạm dừng
  onStep,       // đi từng bước một
  onReset,      // reset lại
  onSpeedChange,// đổi tốc độ
  moveCount,    // số nước đã đi
}) => {

  const speeds = [
    { key: 'slow',   label: '🐢 Chậm',  ms: 1500 },
    { key: 'normal', label: '▶ Bình thường', ms: 800 },
    { key: 'fast',   label: '⚡ Nhanh', ms: 300  },
  ];

  return (
    <motion.div
      className={styles.controls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0  }}
    >
      {/* Tiêu đề */}
      <div className={styles.header}>
        <span className={styles.title}>🤖 AI vs AI</span>
        <span className={styles.moveCount}>
          {moveCount} nước đã đi
        </span>
      </div>

      {/* Chọn tốc độ */}
      <div className={styles.speedRow}>
        <span className={styles.label}>Tốc độ:</span>
        <div className={styles.speedBtns}>
          {speeds.map((s) => (
            <button
              key={s.key}
              className={`
                ${styles.speedBtn}
                ${speed === s.key ? styles.speedActive : ''}
              `}
              onClick={() => onSpeedChange(s.key)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Nút điều khiển */}
      <div className={styles.actionRow}>

        {/* Nút chạy/tạm dừng */}
        <motion.button
          className={`${styles.actionBtn} ${styles.btnPlay}`}
          onClick={isRunning ? onPause : onStart}
          whileHover={{ scale: 1.05 }}
          whileTap={{   scale: 0.95 }}
        >
          {isRunning ? '⏸ Tạm dừng' : '▶ Tự chơi'}
        </motion.button>

        {/* Nút đi từng bước */}
        <motion.button
          className={`${styles.actionBtn} ${styles.btnStep}`}
          onClick={onStep}
          disabled={isRunning}
          whileHover={{ scale: 1.05 }}
          whileTap={{   scale: 0.95 }}
        >
          ⏭ Từng bước
        </motion.button>

        {/* Nút reset */}
        <motion.button
          className={`${styles.actionBtn} ${styles.btnReset}`}
          onClick={onReset}
          whileHover={{ scale: 1.05 }}
          whileTap={{   scale: 0.95 }}
        >
          ↺ Reset
        </motion.button>

      </div>

      {/* Chú thích */}
      <p className={styles.note}>
        Quan sát AI áp dụng thuật toán Sprague-Grundy để học chiến thuật tối ưu
      </p>

    </motion.div>
  );
};

export default AIvsAIControls;