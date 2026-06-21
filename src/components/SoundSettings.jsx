// =============================================
// SOUND SETTINGS — Cài đặt âm thanh
// =============================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getSoundConfig, updateSoundConfig, playPickSound } from '../utils/soundManager';
import { useGameStore } from '../store/gameStore';
import { getSoundUI } from '../utils/translations';
import styles from './SoundSettings.module.css';

const SoundSettings = ({ mode = 'panel' }) => {
  const { settings: globalSettings } = useGameStore();
  const lang = globalSettings.language || 'vi';
  const t    = getSoundUI(lang);

  const [isOpen, setIsOpen] = useState(mode === 'panel');
  const [config, setConfig] = useState(getSoundConfig());

  useEffect(() => {
    if (isOpen) setConfig(getSoundConfig());
  }, [isOpen]);

  const handleChange = (key, value) => {
    const newConfig = { ...config, [key]: value };
    setConfig(newConfig);
    updateSoundConfig({ [key]: value });
  };

  const handleSfxVolume = (val) => {
    handleChange('sfxVolume', val);
    playPickSound();
  };

  // ── Nội dung dạng PANEL (ngang, gọn) ──
  const panelContent = (
    <div className={styles.content}>

      {/* Bật/tắt tất cả */}
      <div className={styles.row}>
        <span className={styles.rowIcon}>🔊</span>
        <span className={styles.rowLabel}>{t.soundLabel}</span>
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
          <span className={styles.rowIcon}>🎵</span>
          <span className={styles.rowLabel}>{t.musicLabel}</span>
          <label className={styles.toggle}>
            <input
              type='checkbox'
              checked={config.musicEnabled}
              onChange={(e) => handleChange('musicEnabled', e.target.checked)}
              disabled={!config.masterEnabled}
            />
            <span className={styles.toggleSlider} />
          </label>
          {config.musicEnabled && (
            <div className={styles.volumeRow}>
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
            </div>
          )}
        </div>

        {/* Hiệu ứng âm thanh */}
        <div className={styles.row}>
          <span className={styles.rowIcon}>🖱️</span>
          <span className={styles.rowLabel}>{t.sfxLabel}</span>
          <label className={styles.toggle}>
            <input
              type='checkbox'
              checked={config.sfxEnabled}
              onChange={(e) => handleChange('sfxEnabled', e.target.checked)}
              disabled={!config.masterEnabled}
            />
            <span className={styles.toggleSlider} />
          </label>
          {config.sfxEnabled && (
            <div className={styles.volumeRow}>
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
            </div>
          )}
        </div>

      </div>
    </div>
  );

  // ── Nội dung dạng POPUP (dọc, đầy đủ) ──
  const popupContent = (
    <div className={styles.popupContentWrap}>

      <div className={styles.popupRow}>
        <div className={styles.rowLeft}>
          <span className={styles.rowIcon}>🔊</span>
          <div>
            <p className={styles.rowLabelFull}>{t.masterTitle}</p>
            <p className={styles.rowDesc}>{t.masterDesc}</p>
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

      <div className={`${styles.popupSubSection} ${!config.masterEnabled ? styles.disabled : ''}`}>

        <div className={styles.popupRow}>
          <div className={styles.rowLeft}>
            <span className={styles.rowIcon}>🎵</span>
            <div>
              <p className={styles.rowLabelFull}>{t.musicTitle}</p>
              <p className={styles.rowDesc}>{t.musicDesc}</p>
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

        {config.musicEnabled && (
          <motion.div
            className={styles.popupVolumeRow}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className={styles.volLabel}>🔈</span>
            <input
              type='range'
              className={styles.sliderFull}
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

        <div className={styles.popupRow}>
          <div className={styles.rowLeft}>
            <span className={styles.rowIcon}>🖱️</span>
            <div>
              <p className={styles.rowLabelFull}>{t.sfxTitle}</p>
              <p className={styles.rowDesc}>{t.sfxDesc}</p>
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

        {config.sfxEnabled && (
          <motion.div
            className={styles.popupVolumeRow}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <span className={styles.volLabel}>🔈</span>
            <input
              type='range'
              className={styles.sliderFull}
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

  // Mode panel — dùng trong Setup (ngang, gọn)
  if (mode === 'panel') {
    return (
      <div className={styles.panel}>
        <div className={styles.panelRow}>
          <span className={styles.panelTitleInline}>{t.panelTitle}</span>
          {panelContent}
        </div>
      </div>
    );
  }

  // Mode popup — dùng trong Game
  return (
    <div className={styles.popupWrapper}>
      <button
        className={`btn btn-ghost ${styles.popupTrigger}`}
        onClick={() => setIsOpen(!isOpen)}
        title={t.triggerTooltip}
      >
        {config.masterEnabled ? '🎵' : '🔇'}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
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
                <span className={styles.popupTitle}>{t.popupTitle}</span>
                <button
                  className={styles.closeBtn}
                  onClick={() => setIsOpen(false)}
                >✕</button>
              </div>
              {popupContent}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SoundSettings;