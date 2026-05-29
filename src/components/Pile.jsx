// =============================================
// PILE — Hàng que với animation nâng cấp
// =============================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './Pile.module.css';

// ---------------------------------------------
// Component một viên que
// ---------------------------------------------
const Stone = ({ id, isNew, isRemoving, emoji }) => (
  <AnimatePresence mode='popLayout'>
    {!isRemoving && (
      <motion.div
        key={id}
        className={styles.stone}
        initial={isNew
          ? { scale: 0, rotate: -30, opacity: 0 }
          : { scale: 1, rotate: 0,   opacity: 1 }
        }
        animate={{ scale: 1, rotate: 0, opacity: 1, y: 0 }}
        exit={{
          scale:   0,
          y:      -60,
          x:      (Math.random() - 0.5) * 80,
          rotate:  Math.random() * 60 - 30,
          opacity: 0,
        }}
        transition={{
          type:      'spring',
          stiffness: 300,
          damping:   20,
        }}
        whileHover={{ scale: 1.2, rotate: 5 }}
      >
        {emoji || '◆'}
      </motion.div>
    )}
  </AnimatePresence>
);

// ---------------------------------------------
// Component hàng que
// ---------------------------------------------
const Pile = ({
  pileIndex,
  count,
  isDisabled,
  onClick,
  lastMove,   // { pileIndex, removeCount } — nước đi vừa rồi
  theme,      // theme hiện tại để chọn emoji
}) => {
  const [prevCount,    setPrevCount]    = useState(count);
  const [highlighted,  setHighlighted]  = useState(false);
  const [stones,       setStones]       = useState(
    Array.from({ length: count }, (_, i) => ({ id: i, isNew: false }))
  );

  // Chọn emoji theo theme
  const getEmoji = () => {
    switch (theme) {
      case 'christmas': return '⛄';
      case 'halloween': return '🎃';
      case 'summer':    return '💧';
      default:          return null; // dùng ◆
    }
  };

  // Khi count thay đổi — cập nhật danh sách stones
  useEffect(() => {
    if (count < prevCount) {
      // Que bị lấy đi — highlight hàng
      setHighlighted(true);
      setTimeout(() => setHighlighted(false), 800);

      // Cập nhật stones — giữ lại đúng số lượng
      setStones((prev) => prev.slice(0, count));
    } else if (count > prevCount) {
      // Que được thêm vào (reset game)
      setStones(
        Array.from({ length: count }, (_, i) => ({
          id:    i,
          isNew: i >= prevCount,
        }))
      );
    }
    setPrevCount(count);
  }, [count]);

  // Khi reset game — tạo lại stones
  useEffect(() => {
    setStones(
      Array.from({ length: count }, (_, i) => ({
        id:    i,
        isNew: false,
      }))
    );
    setPrevCount(count);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pileIndex]);

  const emoji = getEmoji();

  return (
    <motion.div
      className={`
        ${styles.pile}
        ${isDisabled   ? styles.pileDisabled   : ''}
        ${highlighted  ? styles.pileHighlighted : ''}
      `}
      whileHover={!isDisabled ? { scale: 1.02 } : {}}
      layout
    >
      {/* Tiêu đề */}
      <div className={styles.pileHeader}>
        <span className={styles.pileLabel}>Hàng {pileIndex + 1}</span>
        <motion.span
          className={styles.pileCount}
          key={count}
          initial={{ scale: 1.5, color: 'var(--accent-gold)' }}
          animate={{ scale: 1,   color: 'var(--accent-primary)' }}
          transition={{ duration: 0.3 }}
        >
          {count}
        </motion.span>
      </div>

      {/* Các viên que */}
      <div className={styles.stones}>
        <AnimatePresence mode='popLayout'>
          {stones.map((stone) => (
            <Stone
              key={stone.id}
              id={stone.id}
              isNew={stone.isNew}
              emoji={emoji}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Nút chọn số que */}
      {!isDisabled && count > 0 && (
        <motion.div
          className={styles.selector}
          initial={{ opacity: 0, y: 6  }}
          animate={{ opacity: 1, y: 0  }}
          exit={{    opacity: 0, y: -6 }}
        >
          <span className={styles.selectorLabel}>Lấy bao nhiêu?</span>
          <div className={styles.selectorBtns}>
            {[...Array(Math.min(count, 8))].map((_, i) => {
              const n = i + 1;
              return (
                <motion.button
                  key={n}
                  className={styles.numBtn}
                  onClick={() => onClick(pileIndex, n)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{   scale: 0.9  }}
                >
                  {n}
                </motion.button>
              );
            })}
            {count > 8 && (
              <motion.button
                className={styles.numBtn}
                onClick={() => onClick(pileIndex, count)}
                whileHover={{ scale: 1.15 }}
                whileTap={{   scale: 0.9  }}
              >
                All
              </motion.button>
            )}
          </div>
        </motion.div>
      )}

      {/* Hàng trống */}
      {count === 0 && (
        <motion.div
          className={styles.emptyPile}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          — Trống —
        </motion.div>
      )}

    </motion.div>
  );
};

export default Pile;