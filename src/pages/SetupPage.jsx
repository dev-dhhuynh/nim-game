// =============================================
// SETUP PAGE — Màn hình cấu hình trước khi chơi
// =============================================
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { PRESETS, generateRandomPiles } from '../utils/nimLogic';
import styles from './SetupPage.module.css';

const SetupPage = () => {
  const { settings, updateSettings, startGame, goToMenu } = useGameStore();

  const [localPiles,  setLocalPiles]  = useState([3, 5, 7]);
  const [playerNames, setPlayerNames] = useState([...settings.playerNames]);
  const [aiName,      setAiName]      = useState(settings.aiName);
  const [ai1Name,     setAi1Name]     = useState(settings.ai1Name);
  const [ai2Name,     setAi2Name]     = useState(settings.ai2Name);
  const [mode,        setMode]        = useState(settings.gameMode);
  const [difficulty,  setDifficulty]  = useState(settings.aiDifficulty);
  const [ai1Diff,     setAi1Diff]     = useState(settings.ai1Difficulty);
  const [ai2Diff,     setAi2Diff]     = useState(settings.ai2Difficulty);
  const [misere,      setMisere]      = useState(settings.misereVariant);

  const handleRandomize = () => {
    setLocalPiles(generateRandomPiles(3, 5, 10));
  };

  const handlePreset = (key) => {
    setLocalPiles([...PRESETS[key].piles]);
  };

  const addPile = () => {
    if (localPiles.length < 6) setLocalPiles([...localPiles, 3]);
  };

  const removePile = (i) => {
    if (localPiles.length > 2) {
      setLocalPiles(localPiles.filter((_, idx) => idx !== i));
    }
  };

  const changePile = (i, val) => {
    const v    = Math.max(1, Math.min(15, Number(val)));
    const next = [...localPiles];
    next[i]    = v;
    setLocalPiles(next);
  };

  const handleStart = () => {
    updateSettings({
      gameMode:      mode,
      aiDifficulty:  difficulty,
      playerNames,
      aiName,
      ai1Name,
      ai2Name,
      ai1Difficulty: ai1Diff,
      ai2Difficulty: ai2Diff,
      misereVariant: misere,
    });
    startGame(localPiles);
  };

  // Component chọn độ khó dùng lại được
  const DifficultyPicker = ({ value, onChange }) => (
    <div className={styles.diffBtns}>
      {[
        { key: 'easy',   label: 'Dễ',  color: '#00f5c4' },
        { key: 'medium', label: 'Vừa', color: '#f5c400' },
        { key: 'hard',   label: 'Khó', color: '#ff4571' },
      ].map((d) => (
        <button
          key={d.key}
          className={`
            ${styles.diffBtn}
            ${value === d.key ? styles.diffActive : ''}
          `}
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
            ← Quay lại
          </button>
          <h2 className={styles.title}>THIẾT LẬP GAME</h2>
          <div />
        </div>

        <div className={styles.grid}>

          {/* ── CỘT TRÁI ── */}
          <div className={styles.section}>

            {/* Chế độ chơi */}
            <p className={styles.sectionTitle}>⚔ CHẾ ĐỘ CHƠI</p>
            <div className={styles.modeButtons}>
              <button
                className={`${styles.modeBtn} ${mode === 'pvp' ? styles.modeActive : ''}`}
                onClick={() => setMode('pvp')}
              >
                <span>👥</span>
                <span>Người vs Người</span>
              </button>
              <button
                className={`${styles.modeBtn} ${mode === 'pvc' ? styles.modeActive : ''}`}
                onClick={() => setMode('pvc')}
              >
                <span>🤖</span>
                <span>Người vs Máy</span>
              </button>
              <button
                className={`${styles.modeBtn} ${mode === 'aivai' ? styles.modeActive : ''}`}
                onClick={() => setMode('aivai')}
              >
                <span>🤖🤖</span>
                <span>Máy vs Máy</span>
              </button>
            </div>

            {/* Cấu hình theo chế độ */}
            <motion.div
              key={mode}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1,  y:  0 }}
              transition={{ duration: 0.2 }}
            >

              {/* PvP */}
              {mode === 'pvp' && (
                <>
                  <p className={styles.sectionTitle} style={{ marginTop: 16 }}>
                    👤 TÊN NGƯỜI CHƠI
                  </p>
                  <div className={styles.nameInputs}>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-primary)' }}>P1</span>
                      <input
                        className={styles.input}
                        value={playerNames[0]}
                        maxLength={16}
                        onChange={(e) =>
                          setPlayerNames([e.target.value, playerNames[1]])
                        }
                      />
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-gold)' }}>P2</span>
                      <input
                        className={styles.input}
                        value={playerNames[1]}
                        maxLength={16}
                        onChange={(e) =>
                          setPlayerNames([playerNames[0], e.target.value])
                        }
                      />
                    </div>
                  </div>
                </>
              )}

              {/* PvC */}
              {mode === 'pvc' && (
                <>
                  <p className={styles.sectionTitle} style={{ marginTop: 16 }}>
                    👤 TÊN NGƯỜI CHƠI
                  </p>
                  <div className={styles.nameInputs}>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-primary)' }}>Bạn</span>
                      <input
                        className={styles.input}
                        value={playerNames[0]}
                        maxLength={16}
                        onChange={(e) =>
                          setPlayerNames([e.target.value, playerNames[1]])
                        }
                      />
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-red)' }}>AI</span>
                      <input
                        className={styles.input}
                        value={aiName}
                        maxLength={16}
                        onChange={(e) => setAiName(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className={styles.sectionTitle} style={{ marginTop: 14 }}>
                    🧠 ĐỘ KHÓ AI
                  </p>
                  <DifficultyPicker
                    value={difficulty}
                    onChange={setDifficulty}
                  />
                </>
              )}

              {/* AI vs AI */}
              {mode === 'aivai' && (
                <>
                  <p className={styles.sectionTitle} style={{ marginTop: 16 }}>
                    🤖 CẤU HÌNH HAI BOT
                  </p>

                  {/* Bot 1 */}
                  <div className={styles.botCard}>
                    <div className={styles.botHeader}>
                      <span style={{ color: 'var(--accent-primary)' }}>
                        ◆ Bot 1
                      </span>
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-primary)' }}>Tên</span>
                      <input
                        className={styles.input}
                        value={ai1Name}
                        maxLength={16}
                        onChange={(e) => setAi1Name(e.target.value)}
                      />
                    </div>
                    <p className={styles.sectionTitle} style={{ marginTop: 8 }}>
                      Độ khó
                    </p>
                    <DifficultyPicker
                      value={ai1Diff}
                      onChange={setAi1Diff}
                    />
                  </div>

                  {/* Bot 2 */}
                  <div className={styles.botCard} style={{ marginTop: 10 }}>
                    <div className={styles.botHeader}>
                      <span style={{ color: 'var(--accent-gold)' }}>
                        ◆ Bot 2
                      </span>
                    </div>
                    <div className={styles.nameRow}>
                      <span className={styles.nameLabel}
                        style={{ color: 'var(--accent-gold)' }}>Tên</span>
                      <input
                        className={styles.input}
                        value={ai2Name}
                        maxLength={16}
                        onChange={(e) => setAi2Name(e.target.value)}
                      />
                    </div>
                    <p className={styles.sectionTitle} style={{ marginTop: 8 }}>
                      Độ khó
                    </p>
                    <DifficultyPicker
                      value={ai2Diff}
                      onChange={setAi2Diff}
                    />
                  </div>
                </>
              )}

            </motion.div>

            {/* Biến thể Misère */}
            <p className={styles.sectionTitle} style={{ marginTop: 16 }}>
              🔀 BIẾN THỂ
            </p>
            <label className={styles.toggle}>
              <input
                type='checkbox'
                checked={misere}
                onChange={(e) => setMisere(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
              <span>Misère — người lấy que cuối <strong>thua</strong></span>
            </label>

          </div>

          {/* ── CỘT PHẢI: Cấu hình hàng que ── */}
          <div className={styles.section}>

            <p className={styles.sectionTitle}>🪵 CẤU HÌNH HÀNG QUE</p>

            {/* Preset */}
            <div className={styles.presets}>
              {Object.entries(PRESETS).map(([key, preset]) => (
                <button
                  key={key}
                  className={`btn btn-ghost ${styles.presetBtn}`}
                  onClick={() => handlePreset(key)}
                >
                  {preset.label}
                </button>
              ))}
              <button
                className={`btn btn-secondary ${styles.presetBtn}`}
                onClick={handleRandomize}
              >
                🎲 Ngẫu nhiên
              </button>
            </div>

            {/* Danh sách hàng */}
            <div className={styles.piles}>
              {localPiles.map((count, i) => (
                <motion.div
                  key={i}
                  className={styles.pileRow}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x:   0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className={styles.pileLabel}>Hàng {i + 1}</span>

                  <div className={styles.pileControl}>
                    <button
                      className={styles.pileBtn}
                      onClick={() => changePile(i, count - 1)}
                    >−</button>
                    <input
                      type='number'
                      className={styles.pileInput}
                      value={count}
                      min={1} max={15}
                      onChange={(e) => changePile(i, e.target.value)}
                    />
                    <button
                      className={styles.pileBtn}
                      onClick={() => changePile(i, count + 1)}
                    >+</button>
                  </div>

                  <div className={styles.stonePreview}>
                    {[...Array(Math.min(count, 10))].map((_, j) => (
                      <span key={j} className={styles.stoneDot}>◆</span>
                    ))}
                    {count > 10 && (
                      <span className={styles.moreStones}>+{count - 10}</span>
                    )}
                  </div>

                  <button
                    className={styles.removeBtn}
                    onClick={() => removePile(i)}
                    disabled={localPiles.length <= 2}
                  >✕</button>
                </motion.div>
              ))}
            </div>

            {localPiles.length < 6 && (
              <button
                className={`btn btn-ghost ${styles.addBtn}`}
                onClick={addPile}
              >
                + Thêm hàng
              </button>
            )}

          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button
            className={`btn btn-primary ${styles.startBtn}`}
            onClick={handleStart}
          >
            ▶ BẮT ĐẦU GAME
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default SetupPage;