// =============================================
// SETUP PAGE — Màn hình cấu hình trước khi chơi
// =============================================
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PRESETS, generateRandomPiles } from '../utils/nimLogic';
import { getSetupUI } from '../utils/translations';
import ThemeSelector from '../components/ThemeSelector';
import HistoryModal from '../components/HistoryModal';
import SoundSettings from '../components/SoundSettings';
import styles from './SetupPage.module.css';

const SetupPage = () => {
  const {
    settings, updateSettings,
    startGame, goToMenu, resumeGame,
    piles, turnCount, moveHistory,
  } = useGameStore();

  const lang = settings.language || 'vi';
  const t    = getSetupUI(lang);

  const [localPiles,       setLocalPiles]       = useState([3, 5, 7]);
  const [activePreset,     setActivePreset]     = useState('classic');
  const [playerNames,      setPlayerNames]      = useState([...settings.playerNames]);
  const [aiName,           setAiName]           = useState(settings.aiName);
  const [ai1Name,          setAi1Name]          = useState(settings.ai1Name);
  const [ai2Name,          setAi2Name]          = useState(settings.ai2Name);
  const [mode,             setMode]             = useState(settings.gameMode);
  const [difficulty,       setDifficulty]       = useState(settings.aiDifficulty);
  const [ai1Diff,          setAi1Diff]          = useState(settings.ai1Difficulty);
  const [ai2Diff,          setAi2Diff]          = useState(settings.ai2Difficulty);
  const [misere,           setMisere]           = useState(settings.misereVariant);
  const [countdown,        setCountdown]        = useState(settings.countdownEnabled);
  const [countdownSecs,    setCountdownSecs]    = useState(settings.countdownSeconds);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showConfirmNew,   setShowConfirmNew]   = useState(false);

  // Có trận đang chơi dở không?
  const hasActiveGame =
    turnCount > 0 &&
    piles.some((p) => p > 0) &&
    moveHistory.length > 0;

  const handleRandomize = () => {
    setLocalPiles(generateRandomPiles(3, 5, 10));
    setActivePreset('random');
  };

  const handlePreset = (key) => {
    setLocalPiles([...PRESETS[key].piles]);
    setActivePreset(key);
  };

  const addPile = () => {
    if (localPiles.length < 6) {
      setLocalPiles([...localPiles, 3]);
      setActivePreset(null);
    }
  };

  const removePile = (i) => {
    if (localPiles.length > 2) {
      setLocalPiles(localPiles.filter((_, idx) => idx !== i));
      setActivePreset(null);
    }
  };

  const changePile = (i, val) => {
    const v    = Math.max(1, Math.min(15, Number(val)));
    const next = [...localPiles];
    next[i]    = v;
    setLocalPiles(next);
    setActivePreset(null);
  };

  const doStartGame = () => {
    updateSettings({
      gameMode:         mode,
      aiDifficulty:     difficulty,
      playerNames,
      aiName,
      ai1Name,
      ai2Name,
      ai1Difficulty:    ai1Diff,
      ai2Difficulty:    ai2Diff,
      misereVariant:    misere,
      countdownEnabled: countdown,
      countdownSeconds: countdownSecs,
    });
    startGame(localPiles);
  };

  // Bấm "Bắt đầu game"
  const handleStart = () => {
    if (hasActiveGame) {
      setShowConfirmNew(true);
    } else {
      doStartGame();
    }
  };

  const handleReplay = (historyItem) => {
    if (historyItem.initialPiles) {
      updateSettings({
        gameMode:      historyItem.mode       || 'pvp',
        aiDifficulty:  historyItem.difficulty  || 'hard',
        misereVariant: historyItem.misere      || false,
        playerNames:   historyItem.playerNames || ['Người Chơi 1', 'Người Chơi 2'],
        aiName:        historyItem.aiName      || 'NIM-Bot',
      });
      startGame(historyItem.initialPiles);
    }
  };

  const DifficultyPicker = ({ value, onChange }) => (
    <div className={styles.diffBtns}>
      {[
        { key: 'easy',   label: t.diffEasy,   color: '#00f5c4' },
        { key: 'medium', label: t.diffMedium, color: '#f5c400' },
        { key: 'hard',   label: t.diffHard,   color: '#ff4571' },
      ].map((d) => (
        <button
          key={d.key}
          className={`${styles.diffBtn} ${value === d.key ? styles.diffActive : ''}`}
          style={{ '--diff-color': d.color }}
          onClick={() => onChange(d.key)}
        >
          {d.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={styles.setup}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1    }}
        transition={{ duration: 0.35 }}
      >

        {/* Header */}
        <div className={styles.header}>
          <button
            className='btn btn-ghost'
            style={{ padding: '6px 12px', fontSize: '0.7rem' }}
            onClick={goToMenu}
          >
            {t.menu}
          </button>
          <h2 className={styles.title}>{t.title}</h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              className='btn btn-ghost'
              style={{ padding: '6px 12px', fontSize: '0.7rem' }}
              onClick={() => setShowHistoryModal(true)}
            >
              {t.historyBtn}
            </button>
            <ThemeSelector
              currentTheme={settings.theme}
              onChange={(themeKey) => updateSettings({ theme: themeKey })}
            />
          </div>
        </div>

        <div className={styles.grid}>

          {/* ── CỘT TRÁI ── */}
          <div className={styles.section}>

            <p className={styles.sectionTitle}>{t.gameMode}</p>
            <div className={styles.modeButtons}>
              <button
                className={`${styles.modeBtn} ${mode === 'pvp' ? styles.modeActive : ''}`}
                onClick={() => setMode('pvp')}
              >
                <span>👥</span><span>{t.modePvp}</span>
              </button>
              <button
                className={`${styles.modeBtn} ${mode === 'pvc' ? styles.modeActive : ''}`}
                onClick={() => setMode('pvc')}
              >
                <span>🤖</span><span>{t.modePvc}</span>
              </button>
              <button
                className={`${styles.modeBtn} ${mode === 'aivai' ? styles.modeActive : ''}`}
                onClick={() => setMode('aivai')}
              >
                <span>🤖🤖</span><span>{t.modeAivai}</span>
              </button>
            </div>

            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1,  y:  0 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'pvp' && (
                <>
                  <p className={styles.sectionTitle} style={{ marginTop: 10 }}>
                    {t.playerNames}
                  </p>
                  <div className={styles.nameInputs}>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-primary)' }}>P1</span>
                      <input className={styles.input} value={playerNames[0]}
                        maxLength={16}
                        onChange={(e) => setPlayerNames([e.target.value, playerNames[1]])} />
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-gold)' }}>P2</span>
                      <input className={styles.input} value={playerNames[1]}
                        maxLength={16}
                        onChange={(e) => setPlayerNames([playerNames[0], e.target.value])} />
                    </div>
                  </div>
                </>
              )}

              {mode === 'pvc' && (
                <>
                  <p className={styles.sectionTitle} style={{ marginTop: 10 }}>
                    {t.playerNames}
                  </p>
                  <div className={styles.nameInputs}>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-primary)' }}>{t.you}</span>
                      <input className={styles.input} value={playerNames[0]}
                        maxLength={16}
                        onChange={(e) => setPlayerNames([e.target.value, playerNames[1]])} />
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-red)' }}>{t.ai}</span>
                      <input className={styles.input} value={aiName}
                        maxLength={16}
                        onChange={(e) => setAiName(e.target.value)} />
                    </div>
                  </div>
                  <p className={styles.sectionTitle} style={{ marginTop: 10 }}>
                    {t.aiDifficulty}
                  </p>
                  <DifficultyPicker value={difficulty} onChange={setDifficulty} />
                </>
              )}

              {mode === 'aivai' && (
                <>
                  <p className={styles.sectionTitle} style={{ marginTop: 10 }}>
                    {t.botConfig}
                  </p>
                  <div className={styles.botCard}>
                    <div className={styles.botHeader}>
                      <span style={{ color: 'var(--accent-primary)' }}>{t.bot1}</span>
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-primary)' }}>{t.nameLabel}</span>
                      <input className={styles.input} value={ai1Name}
                        maxLength={16} onChange={(e) => setAi1Name(e.target.value)} />
                    </div>
                    <p className={styles.sectionTitle} style={{ marginTop: 6 }}>{t.difficultyLabel}</p>
                    <DifficultyPicker value={ai1Diff} onChange={setAi1Diff} />
                  </div>
                  <div className={styles.botCard} style={{ marginTop: 8 }}>
                    <div className={styles.botHeader}>
                      <span style={{ color: 'var(--accent-gold)' }}>{t.bot2}</span>
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-gold)' }}>{t.nameLabel}</span>
                      <input className={styles.input} value={ai2Name}
                        maxLength={16} onChange={(e) => setAi2Name(e.target.value)} />
                    </div>
                    <p className={styles.sectionTitle} style={{ marginTop: 6 }}>{t.difficultyLabel}</p>
                    <DifficultyPicker value={ai2Diff} onChange={setAi2Diff} />
                  </div>
                </>
              )}
            </motion.div>

            {/* Misère + Đếm ngược — đặt cạnh nhau */}
            <div className={styles.variantRow}>
              <div>
                <p className={styles.sectionTitle} style={{ marginTop: 10 }}>
                  {t.variant}
                </p>
                <label className={styles.toggle}>
                  <input type='checkbox' checked={misere}
                    onChange={(e) => setMisere(e.target.checked)} />
                  <span className={styles.toggleSlider} />
                  <span>{t.misereLabel1}<strong>{t.misereStrong}</strong></span>
                </label>
              </div>

              <div>
                <p className={styles.sectionTitle} style={{ marginTop: 10 }}>
                  {t.countdownTitle}
                </p>
                <label className={styles.toggle}>
                  <input type='checkbox' checked={countdown}
                    onChange={(e) => setCountdown(e.target.checked)}
                    disabled={mode === 'aivai'} />
                  <span className={styles.toggleSlider} />
                  <span>{t.countdownLabel}</span>
                </label>
              </div>
            </div>

            {countdown && mode !== 'aivai' && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1,  y:  0 }}
                style={{ marginTop: 8 }}
              >
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {[10, 15, 20, 30, 60].map((sec) => (
                    <button
                      key={sec}
                      className={`btn ${countdownSecs === sec ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ padding: '4px 12px', fontSize: '0.7rem' }}
                      onClick={() => setCountdownSecs(sec)}
                    >
                      {sec}s
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

          </div>

          {/* ── CỘT PHẢI ── */}
          <div className={styles.section}>

            <p className={styles.sectionTitle}>{t.pilesConfig}</p>

            <div className={styles.presets}>
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  className={`btn btn-ghost ${styles.presetBtn} ${activePreset === key ? styles.presetActive : ''}`}
                  onClick={() => handlePreset(key)}
                >
                  {t.presets[key] || preset.label}
                </button>
              ))}
              <button
                className={`btn btn-ghost ${styles.presetBtn} ${activePreset === 'random' ? styles.presetActive : ''}`}
                onClick={handleRandomize}
              >
                {t.randomBtn}
              </button>
            </div>

            <div className={styles.piles}>
              {localPiles.map((count, i) => (
                <motion.div
                  key={i}
                  className={styles.pileRow}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x:   0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className={styles.pileLabel}>{t.rowLabel} {i + 1}</span>
                  <div className={styles.pileControl}>
                    <button className={styles.pileBtn}
                      onClick={() => changePile(i, count - 1)}>−</button>
                    <input type='number' className={styles.pileInput}
                      value={count} min={1} max={15}
                      onChange={(e) => changePile(i, e.target.value)} />
                    <button className={styles.pileBtn}
                      onClick={() => changePile(i, count + 1)}>+</button>
                  </div>
                  <div className={styles.stonePreview}>
                    {[...Array(Math.min(count, 10))].map((_, j) => (
                      <span key={j} className={styles.stoneDot}>◆</span>
                    ))}
                    {count > 10 && (
                      <span className={styles.moreStones}>+{count - 10}</span>
                    )}
                  </div>
                  <button className={styles.removeBtn}
                    onClick={() => removePile(i)}
                    disabled={localPiles.length <= 2}>✕</button>
                </motion.div>
              ))}
            </div>

            {localPiles.length < 6 && (
              <button
                className={`btn btn-ghost ${styles.addBtn}`}
                onClick={addPile}
              >
                {t.addRow}
              </button>
            )}

          </div>
        </div>

        {/* Cài đặt âm thanh — full width, gọn ngang */}
        <SoundSettings mode='panel' />

        {/* Footer */}
        <div className={styles.footer}>
          {hasActiveGame && (
            <button
              className='btn btn-secondary'
              style={{ padding: '10px 24px', fontSize: '0.8rem' }}
              onClick={resumeGame}
            >
              {t.resumeBtn}{turnCount + 1})
            </button>
          )}
          <button
            className={`btn btn-primary ${styles.startBtn}`}
            onClick={handleStart}
          >
            {t.startBtn}
          </button>
        </div>

      </motion.div>

      {/* History Modal */}
      <AnimatePresence>
        {showHistoryModal && (
          <HistoryModal
            isOpen={showHistoryModal}
            onReplay={handleReplay}
            onClose={() => setShowHistoryModal(false)}
          />
        )}
      </AnimatePresence>

      {/* Confirm bắt đầu ván mới khi đang có trận dở */}
      <AnimatePresence>
        {showConfirmNew && (
          <motion.div
            className={styles.confirmOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowConfirmNew(false)}
          >
            <motion.div
              className={styles.confirmBox}
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1,   y:   0 }}
              exit={{ scale: 0.9,    y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.confirmTitle}>{t.confirmTitle}</p>
              <p className={styles.confirmDesc}>
                {t.confirmDesc1}{turnCount + 1}{t.confirmDesc2}
                <strong>{t.confirmDescStrong}</strong>{t.confirmDescEnd}
              </p>
              <div className={styles.confirmActions}>
                <button
                  className='btn btn-ghost'
                  style={{ fontSize: '0.75rem' }}
                  onClick={() => setShowConfirmNew(false)}
                >
                  {t.cancel}
                </button>
                <button
                  className='btn btn-danger'
                  style={{ fontSize: '0.75rem', padding: '8px 16px' }}
                  onClick={() => {
                    setShowConfirmNew(false);
                    doStartGame();
                  }}
                >
                  {t.confirmNewGame}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default SetupPage;