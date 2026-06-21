// =============================================
// GAME PAGE — Màn hình chơi game chính
// =============================================
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getHint } from '../utils/nimLogic';
import { getTheme } from '../utils/themes';
import { getGameUI } from '../utils/translations';
import Pile from '../components/Pile';
import PlayerPanel from '../components/PlayerPanel';
import MoveHistory from '../components/MoveHistory';
import GameOverModal from '../components/GameOverModal';
import ThemeSelector from '../components/ThemeSelector';
import AIvsAIControls from '../components/AIvsAIControls';
import HistoryModal from '../components/HistoryModal';
import SoundSettings from '../components/SoundSettings';
import { sounds } from '../utils/soundManager';
import styles from './GamePage.module.css';
import toast from 'react-hot-toast';

const btnOnBg = {
  background: 'rgba(0, 0, 0, 0.65)',
  border:     '1px solid rgba(255, 255, 255, 0.5)',
  color:      '#ffffff',
};

const GamePage = () => {
  const {
    piles, currentPlayer, gamePhase, winner,
    moveHistory, isAIThinking, nimSum, settings,
    turnCount, gameStartTime, isAIvsAI,
    aivsaiRunning, aivsaiSpeed, initialPiles,
    countdownLeft,
    makeMove, undoMove, saveCurrentGame,
    goToSetup, goToMenu, startGame, updateSettings,
    startAIvsAI, pauseAIvsAI, stepAIvsAI,
    stopAIvsAI, setAIvsAISpeed,
    continueFromSave,
  } = useGameStore();

  const lang = settings.language || 'vi';
  const t    = getGameUI(lang);

  const [hint,          setHint]          = useState(null);
  const [showHint,      setShowHint]      = useState(false);
  const [elapsedTime,   setElapsedTime]   = useState(0);
  const [showHistory,   setShowHistory]   = useState(false);
  const [showSaveName,  setShowSaveName]  = useState(false);
  const [saveName,      setSaveName]      = useState('');

  const currentTheme = getTheme(settings.theme || 'default');
  const hasBgImage   = !!currentTheme.bgImage;

  // Đếm thời gian
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - gameStartTime) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [gamePhase, gameStartTime]);

  // Dừng AI vs AI khi unmount
  useEffect(() => {
    return () => stopAIvsAI();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPlayerTurn =
    settings.gameMode === 'pvp' ||
    (settings.gameMode === 'pvc' && currentPlayer === 0);

  const handlePileClick = (pileIndex, removeCount) => {
    if (!isPlayerTurn || isAIThinking || gamePhase !== 'playing') return;
    if (isAIvsAI) return;
    if (settings.soundEnabled) sounds.pick();
    makeMove(pileIndex, removeCount);
  };

  const handleHint = () => {
    const h = getHint(piles);
    setHint(h);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 4000);
  };

  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    if (settings.soundEnabled) sounds.undo();
    undoMove();
    toast(t.undoToast, { icon: '↩' });
  };

  const handleThemeChange = (themeKey) => {
    updateSettings({ theme: themeKey });
    toast(t.themeToast, { icon: '🎨' });
  };

  const handleRestart = () => {
    stopAIvsAI();
    startGame(initialPiles);
  };

  const handleAIvsAIReset = () => {
    stopAIvsAI();
    startGame(initialPiles);
  };

  // Lưu ván đang dở
  const handleSave = () => {
    setSaveName(`${lang === 'vi' ? 'Ván dở' : 'Saved game'} — ${new Date().toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US')}`);
    setShowSaveName(true);
  };

  const handleConfirmSave = () => {
    const ok = saveCurrentGame(saveName);
    if (ok) {
      if (settings.soundEnabled) sounds.save();
      toast.success(t.savedToast);
    } else {
      toast.error(t.saveFailToast);
    }
    setShowSaveName(false);
  };

  // Chơi lại từ lịch sử
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

  // Tiếp tục ván dở
  const handleContinue = (saved) => {
    continueFromSave(saved);
    toast.success(t.continueToast);
  };

  const formatTime = (s) => {
    const m   = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const getName = (idx) => {
    if (settings.gameMode === 'aivai') {
      return idx === 0 ? settings.ai1Name : settings.ai2Name;
    }
    if (settings.gameMode === 'pvc' && idx === 1) return settings.aiName;
    return settings.playerNames[idx];
  };

  const getCountdownColor = () => {
    if (countdownLeft <= 5)  return 'var(--accent-red)';
    if (countdownLeft <= 10) return 'var(--accent-gold)';
    return 'var(--accent-primary)';
  };

  const p0Moves = moveHistory.filter((m) => m.player === 0).length;
  const p1Moves = moveHistory.filter((m) => m.player === 1).length;

  const isPileDisabled =
    isAIvsAI             ||
    !isPlayerTurn        ||
    isAIThinking         ||
    gamePhase !== 'playing';

  return (
    <div className={styles.gamePage}>

      {/* ── THANH TRÊN ── */}
      <div className={styles.topBar}>
        <div style={{ display: 'flex', gap: 6 }}>
          <button
            className='btn btn-ghost'
            style={{ padding: '6px 12px', fontSize: '0.65rem' }}
            onClick={goToMenu}
          >
            {t.menu}
          </button>
          <button
            className='btn btn-ghost'
            style={{ padding: '6px 12px', fontSize: '0.65rem' }}
            onClick={goToSetup}
          >
            {t.setup}
          </button>
        </div>

        <div className={styles.gameInfo}>
          <span className='badge badge-primary'>
            {settings.gameMode === 'pvp'   && t.modePvp}
            {settings.gameMode === 'pvc'   && `${t.modePvcPrefix}${settings.aiDifficulty}`}
            {settings.gameMode === 'aivai' && t.modeAivai}
          </span>
          {settings.misereVariant && (
            <span className='badge badge-red'>{t.misereBadge}</span>
          )}
          <span className={styles.timer}>
            ⏱ {formatTime(elapsedTime)}
          </span>
          <span className={styles.turnLabel}>
            {t.turnLabel}{turnCount + 1}
          </span>
          {settings.countdownEnabled && !isAIvsAI && gamePhase === 'playing' && (
            <motion.span
              className={styles.countdown}
              style={{ color: getCountdownColor() }}
              key={countdownLeft}
              animate={countdownLeft <= 5 ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              ⏳ {countdownLeft}s
            </motion.span>
          )}
        </div>

        <div className={styles.topActions}>
          <ThemeSelector
            currentTheme={settings.theme}
            onChange={handleThemeChange}
          />
          <SoundSettings mode='popup' />

          {/* Nút lưu ván — ẩn khi AI vs AI */}
          {!isAIvsAI && gamePhase === 'playing' && (
            <button
              className='btn btn-ghost'
              style={{ padding: '5px 10px', fontSize: '0.65rem' }}
              onClick={handleSave}
            >
              {t.save}
            </button>
          )}

          <button
            className='btn btn-ghost'
            style={{ padding: '5px 10px', fontSize: '0.65rem' }}
            onClick={() => setShowHistory(true)}
          >
            {t.historyBtn}
          </button>

          {!isAIvsAI && (
            <button
              className='btn btn-ghost'
              style={{ padding: '5px 10px', fontSize: '0.65rem' }}
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
            >
              {t.undo}
            </button>
          )}
        </div>
      </div>

      {/* ── POPUP NHẬP TÊN KHI LƯU ── */}
      <AnimatePresence>
        {showSaveName && (
          <motion.div
            className={styles.saveOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveName(false)}
          >
            <motion.div
              className={styles.savePopup}
              initial={{ scale: 0.9, y: -20 }}
              animate={{ scale: 1,   y:   0 }}
              exit={{ scale: 0.9,    y: -20 }}
              onClick={(e) => e.stopPropagation()}
            >
              <p className={styles.savePopupTitle}>{t.saveTitle}</p>
              <input
                className={styles.saveInput}
                value={saveName}
                maxLength={30}
                autoFocus
                onChange={(e) => setSaveName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleConfirmSave();
                  if (e.key === 'Escape') setShowSaveName(false);
                }}
              />
              <div className={styles.savePopupActions}>
                <button
                  className='btn btn-ghost'
                  style={{ fontSize: '0.72rem' }}
                  onClick={() => setShowSaveName(false)}
                >
                  {t.saveCancel}
                </button>
                <button
                  className='btn btn-primary'
                  style={{ fontSize: '0.72rem' }}
                  onClick={handleConfirmSave}
                >
                  {t.saveConfirm}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── NỘI DUNG CHÍNH ── */}
      <div className={styles.content}>

        {/* ── SIDEBAR TRÁI ── */}
        <div className={styles.sidebar}>
          <PlayerPanel
            name={getName(0)}
            playerIndex={0}
            isActive={currentPlayer === 0 && gamePhase === 'playing'}
            isAI={isAIvsAI || false}
            moveCount={p0Moves}
          />
          <div className={styles.vsLabel}>VS</div>
          <PlayerPanel
            name={getName(1)}
            playerIndex={1}
            isActive={currentPlayer === 1 && gamePhase === 'playing'}
            isAI={settings.gameMode === 'pvc' || isAIvsAI}
            moveCount={p1Moves}
            isThinking={isAIThinking}
          />

          {isAIvsAI && (
            <AIvsAIControls
              isRunning={aivsaiRunning}
              speed={aivsaiSpeed}
              moveCount={turnCount}
              onStart={startAIvsAI}
              onPause={pauseAIvsAI}
              onStep={stepAIvsAI}
              onReset={handleAIvsAIReset}
              onSpeedChange={setAIvsAISpeed}
            />
          )}

          {/* Nim-Sum */}
          <div className={styles.nimBox}>
            <div className={styles.nimRow}>
              <span className={styles.nimLabel}>{t.nimSumTitle}</span>
              <span className={`
                ${styles.nimVal}
                ${nimSum === 0 ? styles.nimZero : styles.nimNonzero}
              `}>
                {nimSum}
              </span>
            </div>
            <p className={styles.nimHint}>
              {nimSum === 0 ? t.nimSumLose : t.nimSumWin}
            </p>
          </div>

          <div className={styles.historyWrap}>
            <MoveHistory
              history={moveHistory}
              playerNames={settings.playerNames}
              settings={settings}
            />
          </div>
        </div>

        {/* ── BÀN CHƠI ── */}
        <div
          className={styles.board}
          style={hasBgImage ? {
            backgroundImage:    `url(${currentTheme.bgImage})`,
            backgroundSize:     'cover',
            backgroundPosition: 'center',
            backgroundRepeat:   'no-repeat',
          } : {}}
        >
          <motion.div
            className={styles.turnBanner}
            key={currentPlayer}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1,  y:  0 }}
          >
            {isAIThinking ? (
              <span className={styles.aiThinking}>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                  style={{ display: 'inline-block' }}
                >⟳</motion.span>
                &nbsp;{getName(currentPlayer)}{t.thinking}
              </span>
            ) : (
              <span>
                {t.turnOf}{' '}
                <strong style={{
                  color: currentPlayer === 0
                    ? 'var(--accent-primary)'
                    : 'var(--accent-gold)',
                }}>
                  {getName(currentPlayer)}
                </strong>
              </span>
            )}
          </motion.div>

          <div
            className={styles.piles}
            style={{
              gridTemplateColumns: `repeat(${Math.min(piles.length, 3)}, 1fr)`,
            }}
          >
            {piles.map((count, i) => (
              <Pile
                key={i}
                pileIndex={i}
                count={count}
                isDisabled={isPileDisabled || count === 0}
                onClick={handlePileClick}
                theme={settings.theme}
              />
            ))}
          </div>

          <AnimatePresence>
            {showHint && hint && (
              <motion.div
                className={`
                  ${styles.hintBox}
                  ${hint.type === 'winning' ? styles.hintWin : styles.hintLose}
                `}
                initial={{ opacity: 0, y:  8 }}
                animate={{ opacity: 1, y:  0 }}
                exit={{    opacity: 0, y: -8 }}
              >
                {hint.type === 'winning'
                  ? `${t.hintWinPrefix} ${hint.move.removeCount} ${t.hintWinMid} ${hint.move.pileIndex + 1}`
                  : t.hintLose}
              </motion.div>
            )}
          </AnimatePresence>

          {!isAIvsAI && (
            <div className={styles.boardActions}>
              <button
                className='btn btn-ghost'
                style={{ fontSize: '0.72rem', ...(hasBgImage ? btnOnBg : {}) }}
                onClick={handleHint}
              >
                {t.hint}
              </button>
              <button
                className='btn btn-ghost'
                style={{ fontSize: '0.72rem', ...(hasBgImage ? btnOnBg : {}) }}
                onClick={handleRestart}
              >
                {t.restart}
              </button>
            </div>
          )}

          {isAIvsAI && (
            <div className={styles.boardActions}>
              <button
                className='btn btn-ghost'
                style={{ fontSize: '0.72rem', ...(hasBgImage ? btnOnBg : {}) }}
                onClick={handleAIvsAIReset}
              >
                {t.newMatch}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── MODAL KẾT THÚC ── */}
      <AnimatePresence>
        {gamePhase === 'gameover' && winner !== null && (
          <GameOverModal
            winner={winner}
            playerNames={settings.playerNames}
            settings={settings}
            onRestart={handleRestart}
            onMenu={goToMenu}
          />
        )}
      </AnimatePresence>

      {/* ── HISTORY MODAL ── */}
      <AnimatePresence>
        {showHistory && (
          <HistoryModal
            isOpen={showHistory}
            onReplay={handleReplay}
            onContinue={handleContinue}
            onClose={() => setShowHistory(false)}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default GamePage;