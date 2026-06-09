//Cài đặt âm thanh

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSoundConfig, updateSoundConfig, playPickSound } from '../utils/soundManager';
import styles from './SoundSettings.module.css';

const SoundSettings = ({ mode = 'panel' }) => {
  // mode: 'panel' (trong setup) | 'popup' (trong game)

  const [isOpen,  setIsOpen]  = useState(mode === 'panel');
  const [config,  setConfig]  = useState(getSoundConfig());

  // Đồng bộ config khi mở
  useEffect(() => {
    if (isOpen) setConfig(getSoundConfig());
  }, [isOpen]);

  const handleChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateSoundConfig({ [key]: value });
  };

  // Preview tiếng click khi kéo thanh sfx
  const handleSfxVolume = (val) => {
    handleChange('sfxVolume', val);
    playPickSound();
  };

  const content = (
    <div className={styles.content}>

      {/* Bật/tắt tất cả */}
      <div className={styles.row}>
        <div className={styles.rowLeft}>
          <span className={styles.rowIcon}>🔊</span>
          <div>
            <p className={styles.rowLabel}>Toàn bộ âm thanh</p>
            <p className={styles.rowDesc}>Bật/tắt tất cả âm thanh</p>
          </div>
        </div>
        <label className={styles.toggle}>
          <input
            type='checkbox'
            checked={config.masterEnabled}
            onChange={(e) => handleChange('masterEnabled', e.target.checked)}
          />
          <span className={styles.toggleSlider} />
        </label>
      </div>

      <div className={`${styles.subSection} ${!config.masterEnabled ? styles.disabled : ''}`}>

        {/* Nhạc nền */}
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowIcon}>🎵</span>
            <div>
              <p className={styles.rowLabel}>Nhạc nền</p>
              <p className={styles.rowDesc}>Nhạc theo từng chủ đề</p>
            </div>
          </div>
          <label className={styles.toggle}>
            <input
              type='checkbox'
              checked={config.musicEnabled}
              onChange={(e) => handleChange('musicEnabled', e.target.checked)}
              disabled={!config.masterEnabled}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        {/* Âm lượng nhạc */}
        {config.musicEnabled && (
          <motion.div
            className={styles.volumeRow}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className={styles.volLabel}>🔈</span>
            <input
              type='range'
              className={styles.slider}
              min={0} max={1} step={0.05}
              value={config.musicVolume}
              disabled={!config.masterEnabled}
              onChange={(e) => handleChange('musicVolume', Number(e.target.value))}
            />
            <span className={styles.volValue}>
              {Math.round(config.musicVolume * 100)}%
            </span>
          </motion.div>
        )}

        {/* Hiệu ứng âm thanh */}
        <div className={styles.row}>
          <div className={styles.rowLeft}>
            <span className={styles.rowIcon}>🖱️</span>
            <div>
              <p className={styles.rowLabel}>Hiệu ứng âm thanh</p>
              <p className={styles.rowDesc}>Tiếng click, thắng, thua</p>
            </div>
          </div>
          <label className={styles.toggle}>
            <input
              type='checkbox'
              checked={config.sfxEnabled}
              onChange={(e) => handleChange('sfxEnabled', e.target.checked)}
              disabled={!config.masterEnabled}
            />
            <span className={styles.toggleSlider} />
          </label>
        </div>

        {/* Âm lượng hiệu ứng */}
        {config.sfxEnabled && (
          <motion.div
            className={styles.volumeRow}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className={styles.volLabel}>🔈</span>
            <input
              type='range'
              className={styles.slider}
              min={0} max={1} step={0.05}
              value={config.sfxVolume}
              disabled={!config.masterEnabled}
              onChange={(e) => handleSfxVolume(Number(e.target.value))}
            />
            <span className={styles.volValue}>
              {Math.round(config.sfxVolume * 100)}%
            </span>
          </motion.div>
        )}

      </div>
    </div>
  );

  // Mode panel — dùng trong Setup
  if (mode === 'panel') {
    return (
      <div className={styles.panel}>
        <p className={styles.panelTitle}>🎵 CÀI ĐẶT ÂM THANH</p>
        {content}
      </div>
    );
  }

  // Mode popup — dùng trong Game
  return (
    <div className={styles.popupWrapper}>
      <button
        className={`btn btn-ghost ${styles.popupTrigger}`}
        onClick={() => setIsOpen(!isOpen)}
        title='Cài đặt âm thanh'
      >
        {config.masterEnabled ? '🎵' : '🔇'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Click ngoài để đóng */}
            <div
              className={styles.backdrop}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className={styles.popup}
              initial={{ opacity: 0, scale: 0.95, y: -8 }}
              animate={{ opacity: 1, scale: 1,    y:  0 }}
              exit={{    opacity: 0, scale: 0.95, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <div className={styles.popupHeader}>
                <span className={styles.popupTitle}>🎵 Âm Thanh</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                >✕</button>
              </div>
              {content}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoundSettings;