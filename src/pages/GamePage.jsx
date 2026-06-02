// =============================================
// GAME PAGE — Màn hình chơi game chính
// =============================================
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getHint } from '../utils/nimLogic';
import Pile from '../components/Pile';
import PlayerPanel from '../components/PlayerPanel';
import MoveHistory from '../components/MoveHistory';
import GameOverModal from '../components/GameOverModal';
import ThemeSelector from '../components/ThemeSelector';
import AIvsAIControls from '../components/AIvsAIControls';
import { sounds } from '../utils/soundManager';
import styles from './GamePage.module.css';
import toast from 'react-hot-toast';

const GamePage = () => {
  const {
    piles, currentPlayer, gamePhase, winner,
    moveHistory, isAIThinking, nimSum, settings,
    turnCount, gameStartTime, isAIvsAI,
    aivsaiRunning, aivsaiSpeed,
    makeMove, undoMove, saveCurrentGame,
    goToMenu, startGame, updateSettings,
    startAIvsAI, pauseAIvsAI, stepAIvsAI,
    stopAIvsAI, setAIvsAISpeed,
  } = useGameStore();

  const [hint,        setHint]        = useState(null);
  const [showHint,    setShowHint]    = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Đếm thời gian
  useEffect(() => {
    if (gamePhase !== 'playing') return;
    const interval = setInterval(() => {
      setElapsedTime(
        Math.floor((Date.now() - gameStartTime) / 1000)
      );
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

  // Click lấy que
  const handlePileClick = (pileIndex, removeCount) => {
    if (!isPlayerTurn || isAIThinking || gamePhase !== 'playing') return;
    if (isAIvsAI) return; // AI vs AI không cho người click
    if (settings.soundEnabled) sounds.pick();
    makeMove(pileIndex, removeCount);
  };

  // Gợi ý
  const handleHint = () => {
    const h = getHint(piles);
    setHint(h);
    setShowHint(true);
    setTimeout(() => setShowHint(false), 4000);
  };

  // Lưu
  const handleSave = () => {
    const ok = saveCurrentGame();
    if (ok) {
      if (settings.soundEnabled) sounds.save();
      toast.success('Game đã được lưu!');
    } else {
      toast.error('Lưu thất bại!');
    }
  };

  // Undo
  const handleUndo = () => {
    if (moveHistory.length === 0) return;
    if (settings.soundEnabled) sounds.undo();
    undoMove();
    toast('Đã hoàn tác nước đi', { icon: '↩' });
  };

  // Đổi theme
  const handleThemeChange = (themeKey) => {
    updateSettings({ theme: themeKey });
    toast(`Đã đổi chủ đề!`, { icon: '🎨' });
  };

  // Bật/tắt âm thanh
  const handleToggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  // Reset AI vs AI
  const handleAIvsAIReset = () => {
    stopAIvsAI();
    startGame(piles);
  };

  // Format mm:ss
  const formatTime = (s) => {
    const m   = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Lấy tên người chơi
  const getName = (idx) => {
    if (settings.gameMode === 'aivai') {
      return idx === 0 ? settings.ai1Name : settings.ai2Name;
    }
    if (settings.gameMode === 'pvc' && idx === 1) return settings.aiName;
    return settings.playerNames[idx];
  };

  const p0Moves = moveHistory.filter((m) => m.player === 0).length;
  const p1Moves = moveHistory.filter((m) => m.player === 1).length;

  // Pile có bị disabled không
  const isPileDisabled =
    isAIvsAI                    || // AI vs AI không cho click
    !isPlayerTurn               ||
    isAIThinking                ||
    gamePhase !== 'playing';

  return (
    <div className={styles.gamePage}>

      {/* ── THANH TRÊN ── */}
      <div className={styles.topBar}>
        <button
          className='btn btn-ghost'
          style={{ padding: '6px 12px', fontSize: '0.65rem' }}
          onClick={goToMenu}
        >
          ← Menu
        </button>

        <div className={styles.gameInfo}>
          {/* Badge chế độ */}
          <span className='badge badge-primary'>
            {settings.gameMode === 'pvp'   && 'Người vs Người'}
            {settings.gameMode === 'pvc'   && `vs AI · ${settings.aiDifficulty}`}
            {settings.gameMode === 'aivai' && '🤖 Máy vs Máy'}
          </span>

          {settings.misereVariant && (
            <span className='badge badge-red'>Misère</span>
          )}
          <span className={styles.timer}>
            ⏱ {formatTime(elapsedTime)}
          </span>
          <span className={styles.turnLabel}>
            Lượt #{turnCount + 1}
          </span>
        </div>

        <div className={styles.topActions}>
          <ThemeSelector
            currentTheme={settings.theme}
            onChange={handleThemeChange}
          />
          <button
            className='btn btn-ghost'
            style={{ padding: '5px 10px', fontSize: '0.75rem' }}
            onClick={handleToggleSound}
          >
            {settings.soundEnabled ? '🔊' : '🔇'}
          </button>
          <button
            className='btn btn-ghost'
            style={{ padding: '5px 10px', fontSize: '0.65rem' }}
            onClick={handleSave}
          >
            💾 Lưu
          </button>

          {/* Chỉ hiện Undo khi không phải AI vs AI */}
          {!isAIvsAI && (
            <button
              className='btn btn-ghost'
              style={{ padding: '5px 10px', fontSize: '0.65rem' }}
              onClick={handleUndo}
              disabled={moveHistory.length === 0}
            >
              ↩ Undo
            </button>
          )}
        </div>
      </div>

      {/* ── NỘI DUNG CHÍNH ── */}
      <div className={styles.content}>

        {/* ── SIDEBAR TRÁI ── */}
        <div className={styles.sidebar}>

          {/* Thông tin người chơi */}
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

          {/* Controls AI vs AI */}
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
              <span className={styles.nimLabel}>Nim-Sum (XOR)</span>
              <span className={`
                ${styles.nimVal}
                ${nimSum === 0
                  ? styles.nimZero
                  : styles.nimNonzero}
              `}>
                {nimSum}
              </span>
            </div>
            <p className={styles.nimHint}>
              {nimSum === 0
                ? '⚠️ Thế thua — không có nước thắng'
                : '✅ Có nước đi thắng tồn tại'}
            </p>
          </div>

          {/* Lịch sử */}
          <div className={styles.historyWrap}>
            <MoveHistory
              history={moveHistory}
              playerNames={settings.playerNames}
              settings={settings}
            />
          </div>

        </div>

        {/* ── BÀN CHƠI ── */}
        <div className={styles.board}>

          {/* Banner lượt chơi */}
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
                  transition={{
                    duration: 0.8,
                    repeat:   Infinity,
                    ease:     'linear',
                  }}
                  style={{ display: 'inline-block' }}
                >
                  ⟳
                </motion.span>
                &nbsp;{getName(currentPlayer)} đang suy nghĩ...
              </span>
            ) : (
              <span>
                Lượt của{' '}
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

          {/* Các hàng que */}
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

          {/* Gợi ý */}
          <AnimatePresence>
            {showHint && hint && (
              <motion.div
                className={`
                  ${styles.hintBox}
                  ${hint.type === 'winning'
                    ? styles.hintWin
                    : styles.hintLose}
                `}
                initial={{ opacity: 0, y:  8 }}
                animate={{ opacity: 1, y:  0 }}
                exit={{    opacity: 0, y: -8 }}
              >
                {hint.message}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nút dưới — ẩn khi AI vs AI */}
          {!isAIvsAI && (
            <div className={styles.boardActions}>
              <button
                className='btn btn-ghost'
                style={{ fontSize: '0.72rem' }}
                onClick={handleHint}
              >
                💡 Gợi ý
              </button>
              <button
                className='btn btn-ghost'
                style={{ fontSize: '0.72rem' }}
                onClick={() => startGame(piles)}
              >
                ↺ Chơi lại
              </button>
            </div>
          )}

          {/* Nút chơi lại khi AI vs AI */}
          {isAIvsAI && (
            <div className={styles.boardActions}>
              <button
                className='btn btn-ghost'
                style={{ fontSize: '0.72rem' }}
                onClick={handleAIvsAIReset}
              >
                ↺ Ván mới
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
            onRestart={() => startGame(piles)}
            onMenu={goToMenu}
          />
        )}
      </AnimatePresence>

    </div>
  );
};

export default GamePage;