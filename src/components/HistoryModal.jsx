// =============================================
// HISTORY MODAL — Lịch sử các ván đã chơi
// =============================================
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getHistory, clearHistory, deleteHistoryById } from '../utils/storage';
import styles from './HistoryModal.module.css';

const HistoryModal = ({ isOpen, onReplay, onContinue, onClose }) => {
  const [history,       setHistory]       = useState([]);
  const [filter,        setFilter]        = useState('all'); // all | inprogress | finished
  const [confirmClear,  setConfirmClear]  = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    if (isOpen) setHistory(getHistory());
  }, [isOpen]);

  // Lọc theo loại
  const filtered = filter === 'all'
    ? history
    : history.filter((h) => h.type === filter);

  // Format ngày giờ
  const formatDate = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  // Format thời gian chơi
  const formatDuration = (s) => {
    if (!s) return '0s';
    const m = Math.floor(s / 60);
    const r = s % 60;
    return m > 0 ? `${m}p${r > 0 ? ` ${r}s` : ''}` : `${r}s`;
  };

  // Tên chế độ
  const getModeName = (mode) => {
    if (mode === 'pvp')   return '👥 PvP';
    if (mode === 'pvc')   return '🤖 vs AI';
    if (mode === 'aivai') return '🤖🤖 AI vs AI';
    return mode || '—';
  };

  // Tên người thắng
  const getWinnerName = (h) => {
    if (h.mode === 'aivai') return h.winner === 0 ? 'Bot 1' : 'Bot 2';
    if (h.mode === 'pvc')   return h.winner === 0 ? '👤 Bạn' : '🤖 Máy';
    const names = h.playerNames || ['P1', 'P2'];
    return h.winner === 0 ? names[0] : names[1];
  };

  // Xóa toàn bộ
  const handleClearAll = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
      return;
    }
    clearHistory();
    setHistory([]);
    setConfirmClear(false);
  };

  // Xóa một ván
  const handleDelete = (id) => {
    if (confirmDelete === id) {
      deleteHistoryById(id);
      setHistory(getHistory());
      setConfirmDelete(null);
    } else {
      setConfirmDelete(id);
      setTimeout(() => setConfirmDelete(null), 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className={styles.modal}
        initial={{ scale: 0.9, y: 30 }}
        animate={{ scale: 1,   y: 0  }}
        exit={{ scale: 0.9,    y: 30 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className={styles.header}>
          <h3 className={styles.title}>📁 Lịch Sử Đấu</h3>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className={`btn ${confirmClear ? 'btn-danger' : 'btn-ghost'}`}
              style={{ padding: '5px 10px', fontSize: '0.65rem' }}
              onClick={handleClearAll}
              disabled={history.length === 0}
            >
              {confirmClear ? '⚠ Xác nhận?' : '🗑 Xóa tất cả'}
            </button>
            <button className={styles.closeBtn} onClick={onClose}>✕</button>
          </div>
        </div>

        {/* Bộ lọc */}
        <div className={styles.filters}>
          {[
            { key: 'all',        label: `Tất cả (${history.length})`                                    },
            { key: 'inprogress', label: `🔄 Đang dở (${history.filter(h => h.type === 'inprogress').length})` },
            { key: 'finished',   label: `✅ Đã xong (${history.filter(h => h.type === 'finished').length})`   },
          ].map((f) => (
            <button
              key={f.key}
              className={`${styles.filterBtn} ${filter === f.key ? styles.filterActive : ''}`}
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Danh sách */}
        <div className={styles.list}>
          <AnimatePresence>
            {filtered.length === 0 ? (
              <motion.div
                className={styles.empty}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <span className={styles.emptyIcon}>📭</span>
                <p>Chưa có ván nào</p>
                <p className={styles.emptyNote}>
                  {filter === 'inprogress'
                    ? 'Ấn 💾 trong game để lưu ván đang dở'
                    : 'Chơi xong một ván sẽ tự động lưu vào đây'}
                </p>
              </motion.div>
            ) : (
              filtered.map((h, i) => (
                <motion.div
                  key={h.id}
                  className={`${styles.item} ${h.type === 'inprogress' ? styles.itemInProgress : styles.itemFinished}`}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1,  x:   0 }}
                  exit={{    opacity: 0,  x:  16 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {/* Badge loại ván */}
                  <div className={styles.typeBadge}>
                    {h.type === 'inprogress' ? (
                      <span className={styles.badgeInProgress}>🔄 Đang dở</span>
                    ) : (
                      <span className={styles.badgeFinished}>✅ Đã xong</span>
                    )}
                  </div>

                  {/* Tên ván (dở) hoặc kết quả (xong) */}
                  {h.type === 'inprogress' ? (
                    <div className={styles.saveInfo}>
                      <span className={styles.saveName}>{h.saveName}</span>
                      <div className={styles.saveMeta}>
                        <span>{getModeName(h.settings?.gameMode)}</span>
                        <span className={styles.dot}>·</span>
                        <span>Lượt {h.turnCount || 0}</span>
                        <span className={styles.dot}>·</span>
                        <span>{formatDate(h.savedAt)}</span>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.saveInfo}>
                      <div className={styles.result}>
                        <span className={`
                          ${styles.winnerName}
                          ${h.winner === 0 ? styles.p0Win : styles.p1Win}
                        `}>
                          {getWinnerName(h)}
                        </span>
                        <span className={styles.winLabel}>thắng</span>
                        {h.endReason === 'timeout' && (
                          <span className={styles.timeoutBadge}>⏱ Hết giờ</span>
                        )}
                      </div>
                      <div className={styles.saveMeta}>
                        <span>{getModeName(h.mode)}</span>
                        {h.mode === 'pvc' && (
                          <span className={styles.diff}>{h.difficulty}</span>
                        )}
                        <span className={styles.dot}>·</span>
                        <span>{h.turns || 0} lượt</span>
                        <span className={styles.dot}>·</span>
                        <span>{formatDuration(h.duration)}</span>
                        <span className={styles.dot}>·</span>
                        <span>{formatDate(h.date || h.savedAt)}</span>
                      </div>
                    </div>
                  )}

                  {/* Preview piles */}
                  {(h.initialPiles || h.piles) && (
                    <div className={styles.pilesPreview}>
                      {(h.initialPiles || h.piles).map((count, j) => (
                        <span key={j} className={styles.pileChip}>{count}</span>
                      ))}
                    </div>
                  )}

                  {/* Nút hành động */}
                  <div className={styles.actions}>
                    {h.type === 'inprogress' ? (
                      <button
                        className='btn btn-primary'
                        style={{ padding: '4px 12px', fontSize: '0.65rem' }}
                        onClick={() => {
                          onContinue && onContinue(h);
                          onClose();
                        }}
                      >
                        ▶ Tiếp tục
                      </button>
                    ) : (
                      h.initialPiles && (
                        <button
                          className='btn btn-primary'
                          style={{ padding: '4px 12px', fontSize: '0.65rem' }}
                          onClick={() => {
                            onReplay && onReplay(h);
                            onClose();
                          }}
                        >
                          ↺ Chơi lại
                        </button>
                      )
                    )}
                    <button
                      className={`btn ${confirmDelete === h.id ? 'btn-danger' : 'btn-ghost'}`}
                      style={{ padding: '4px 8px', fontSize: '0.65rem' }}
                      onClick={() => handleDelete(h.id)}
                    >
                      {confirmDelete === h.id ? '⚠?' : '🗑'}
                    </button>
                  </div>

                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

      </motion.div>
    </motion.div>
  );
};

export default HistoryModal;