// Thống kê các ván đã chơi

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getHistory, clearHistory } from '../utils/storage';
import { getStatsUI } from '../utils/translations';
import styles from './StatsPage.module.css';

const StatsPage = () => {
  const { goToMenu, settings } = useGameStore();
  const lang = settings.language || 'vi';
  const t    = getStatsUI(lang);

  const [history,    setHistory]    = useState([]);
  const [filter,     setFilter]     = useState('all'); // 'all' | 'pvp' | 'pvc' | 'aivai'
  const [confirmClear, setConfirmClear] = useState(false);

  // Tải lịch sử khi vào trang
  useEffect(() => {
    setHistory(getHistory());
  }, []);

  // Xóa lịch sử
  const handleClear = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  // Lọc theo chế độ
  const filtered = filter === 'all'
    ? history
    : history.filter((h) => h.mode === filter);

  // Tính thống kê tổng
  const totalGames  = filtered.length;
  const totalTurns  = filtered.reduce((s, h) => s + (h.turns    || 0), 0);
  const totalTime   = filtered.reduce((s, h) => s + (h.duration || 0), 0);
  const avgTurns    = totalGames > 0
    ? (totalTurns / totalGames).toFixed(1)
    : 0;
  const avgTime     = totalGames > 0
    ? Math.round(totalTime / totalGames)
    : 0;

  // Đếm thắng theo người chơi 0 (người chơi chính)
  const p0Wins = filtered.filter(
    (h) => h.winner === 0 && h.mode !== 'aivai'
  ).length;
  const winRate = totalGames > 0 && filter !== 'aivai'
    ? Math.round((p0Wins / filtered.filter((h) => h.mode !== 'aivai').length) * 100)
    : null;

  // Format thời gian
  const formatTime = (s) => {
    if (s < 60)  return `${s}s`;
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}${lang === 'vi' ? 'p' : 'm'}${r > 0 ? ` ${r}s` : ''}`;
  };

  // Format ngày
  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Tên chế độ
  const getModeName = (mode) => {
    if (mode === 'pvp')   return t.modePvp;
    if (mode === 'pvc')   return t.modePvc;
    if (mode === 'aivai') return t.modeAivai;
    return mode;
  };

  // Tên người thắng
  const getWinnerName = (h) => {
    if (h.mode === 'aivai') return h.winner === 0 ? t.bot1 : t.bot2;
    if (h.mode === 'pvc')   return h.winner === 0 ? t.you : t.ai;
    return h.winner === 0 ? t.p1 : t.p2;
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>

        {/* Header */}
        <div className={styles.header}>
          <button
            className='btn btn-ghost'
            style={{ padding: '6px 12px', fontSize: '0.7rem' }}
            onClick={goToMenu}
          >
            {t.back}
          </button>
          <h2 className={styles.title}>{t.title}</h2>
          <button
            className={`btn ${confirmClear ? 'btn-danger' : 'btn-ghost'}`}
            style={{ padding: '6px 12px', fontSize: '0.7rem' }}
            onClick={handleClear}
            disabled={history.length === 0}
          >
            {confirmClear ? t.confirmClear : t.clearHistory}
          </button>
        </div>

        {/* Bộ lọc */}
        <div className={styles.filters}>
          {[
            { key: 'all',   label: t.filterAll   },
            { key: 'pvp',   label: t.filterPvp   },
            { key: 'pvc',   label: t.filterPvc   },
            { key: 'aivai', label: t.filterAivai },
          ].map((f) => (
            <button
              key={f.key}
              className={`
                ${styles.filterBtn}
                ${filter === f.key ? styles.filterActive : ''}
              `}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Thống kê tổng */}
        <div className={styles.statsGrid}>
          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.05 }}
          >
            <span className={styles.statValue}>{totalGames}</span>
            <span className={styles.statLabel}>{t.gamesPlayed}</span>
          </motion.div>

          {winRate !== null && (
            <motion.div
              className={styles.statCard}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0  }}
              transition={{ delay: 0.1 }}
            >
              <span className={`${styles.statValue} ${styles.statGreen}`}>
                {winRate}%
              </span>
              <span className={styles.statLabel}>{t.winRate}</span>
            </motion.div>
          )}

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.15 }}
          >
            <span className={styles.statValue}>{avgTurns}</span>
            <span className={styles.statLabel}>{t.avgTurns}</span>
          </motion.div>

          <motion.div
            className={styles.statCard}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0  }}
            transition={{ delay: 0.2 }}
          >
            <span className={styles.statValue}>{formatTime(avgTime)}</span>
            <span className={styles.statLabel}>{t.avgTime}</span>
          </motion.div>
        </div>

        {/* Danh sách ván */}
        <div className={styles.listHeader}>
          <span>{t.listHeader}</span>
          <span>{filtered.length} {t.matchesSuffix}</span>
        </div>

        <div className={styles.list}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className={styles.emptyIcon}>📭</span>
                <p>{t.emptyTitle}</p>
                <p className={styles.emptyNote}>
                  {t.emptyNote}
                </p>
              </motion.div>
            ) : (
              filtered.map((h, i) => (
                <motion.div
                  key={h.id || i}
                  className={styles.histItem}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x:   0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Người thắng */}
                  <div className={styles.itemWinner}>
                    <span className={`
                      ${styles.winnerBadge}
                      ${h.winner === 0
                        ? styles.winnerP0
                        : styles.winnerP1}
                    `}>
                      {getWinnerName(h)}
                    </span>
                    <span className={styles.winnerLabel}>{t.won}</span>
                  </div>

                  {/* Thông tin ván */}
                  <div className={styles.itemInfo}>
                    <span className={styles.itemMode}>
                      {getModeName(h.mode)}
                    </span>
                    {h.mode === 'pvc' && (
                      <span className={`badge badge-red`}
                        style={{ fontSize: '0.55rem' }}>
                        {h.difficulty}
                      </span>
                    )}
                  </div>

                  {/* Số liệu */}
                  <div className={styles.itemStats}>
                    <span>{h.turns || '—'} {t.turnsSuffix}</span>
                    <span className={styles.dot}>·</span>
                    <span>{formatTime(h.duration || 0)}</span>
                  </div>

                  {/* Ngày giờ */}
                  <div className={styles.itemDate}>
                    {formatDate(h.date)}
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default StatsPage;