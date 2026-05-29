// =============================================
// MENU PAGE — Màn hình chính
// =============================================
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { hasSavedGame } from '../utils/storage';
import styles from './MenuPage.module.css';

const MenuPage = () => {
  const { goToSetup, loadSavedGame } = useGameStore();
  const [savedExists, setSavedExists] = useState(false);

  // Kiểm tra có game đã lưu không
  useEffect(() => {
    setSavedExists(hasSavedGame());
  }, []);

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
        {/* 3 hình thoi nhỏ trên logo */}
        <div className={styles.logoIcons}>
          <span>◆</span>
          <span>◆</span>
          <span>◆</span>
        </div>

        {/* Tên game */}
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

        {/* Chỉ hiện nút này nếu có game đã lưu */}
        {savedExists && (
          <button
            className={`btn btn-secondary ${styles.btnMain}`}
            onClick={loadSavedGame}
          >
            ↩ Tiếp Tục
          </button>
        )}
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

    </div>
  );
};

export default MenuPage;