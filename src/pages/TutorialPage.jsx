// Màn hình hướng dẫn

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import styles from './TutorialPage.module.css';


// Dữ liệu các bước hướng dẫn

const STEPS = [
  {
    id:    1,
    icon:  '🎯',
    title: 'NIM là gì?',
    content: `NIM là một trò chơi chiến thuật cổ xưa có từ hàng nghìn năm trước.
      Hai người chơi thay nhau lấy que từ các hàng. Người lấy que cuối cùng sẽ thắng.
      Nghe đơn giản — nhưng ẩn chứa một lý thuyết toán học cực kỳ thú vị!`,
    demo: null,
  },
  {
    id:    2,
    icon:  '📜',
    title: 'Luật chơi cơ bản',
    content: null,
    rules: [
      { icon: '1️⃣', text: 'Mỗi lượt, người chơi chọn MỘT hàng bất kỳ' },
      { icon: '2️⃣', text: 'Lấy ít nhất 1 que, có thể lấy tất cả que trong hàng đó' },
      { icon: '3️⃣', text: 'Không được bỏ lượt và không được lấy từ 2 hàng cùng lúc' },
      { icon: '🏆', text: 'Người lấy que CUỐI CÙNG là người THẮNG' },
      { icon: '🔀', text: 'Biến thể Misère: người lấy que cuối THUA' },
    ],
  },
  {
    id:    3,
    icon:  '🧮',
    title: 'Lý thuyết Nim-Sum',
    content: `Chìa khóa để luôn thắng là tính NIM-SUM — phép XOR (hoặc loại trừ) 
      của tất cả các hàng. Nếu Nim-Sum ≠ 0 sau lượt đi của bạn, bạn đang ở thế THẮNG.
      Nếu Nim-Sum = 0, bạn đang ở thế THUA.`,
    example: {
      piles:   [3, 5, 7],
      binary: [
        { val: 3, bin: '011' },
        { val: 5, bin: '101' },
        { val: 7, bin: '111' },
      ],
      xorResult: { val: 1, bin: '001' },
    },
  },
  {
    id:    4,
    icon:  '♟️',
    title: 'Chiến thuật thắng',
    content: `Khi Nim-Sum ≠ 0, luôn tồn tại một nước đi giúp bạn đưa Nim-Sum về 0.
      Đối thủ dù đi thế nào cũng sẽ làm Nim-Sum ≠ 0 trở lại — và bạn lại
      có thể đưa về 0. Cứ thế cho đến khi tất cả hàng trống.`,
    strategy: [
      { step: 'Tính Nim-Sum của tất cả hàng bằng XOR',        good: true  },
      { step: 'Nếu Nim-Sum = 0: đi bất kỳ, chờ đối thủ sai', good: false },
      { step: 'Nếu Nim-Sum ≠ 0: tìm hàng để đưa Nim-Sum = 0', good: true  },
      { step: 'Sau nước đi của bạn, Nim-Sum luôn = 0',         good: true  },
    ],
  },
  {
    id:    5,
    icon:  '💡',
    title: 'Ví dụ thực tế',
    content: `Giả sử có 3 hàng: [1, 3, 5]. Nim-Sum = 1 XOR 3 XOR 5 = 7 ≠ 0.
      Bạn cần lấy từ hàng nào đó để Nim-Sum = 0. 
      Thử hàng 3 (có 5 que): 5 XOR 7 = 2 — cần giữ lại 2 que, lấy đi 3 que.
      Kiểm tra: 1 XOR 3 XOR 2 = 0 ✅`,
    tip: 'Dùng nút 💡 Gợi ý trong game để xem nước đi tối ưu bất cứ lúc nào!',
  },
];

// Component demo hàng que nhỏ

const MiniPile = ({ count, label }) => (
  <div className={styles.miniPile}>
    <span className={styles.miniLabel}>{label}</span>
    <div className={styles.miniStones}>
      {[...Array(count)].map((_, i) => (
        <span key={i} className={styles.miniStone}>◆</span>
      ))}
    </div>
    <span className={styles.miniCount}>{count}</span>
  </div>
);


// Trang hướng dẫn chính

const TutorialPage = () => {
  const { goToMenu, goToSetup } = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);

  const step     = STEPS[currentStep];
  const isFirst  = currentStep === 0;
  const isLast   = currentStep === STEPS.length - 1;

  const goNext = () => {
    if (!isLast) setCurrentStep((s) => s + 1);
  };

  const goPrev = () => {
    if (!isFirst) setCurrentStep((s) => s - 1);
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
            ← Quay lại
          </button>
          <h2 className={styles.title}>HƯỚNG DẪN CHƠI</h2>
          <div />
        </div>

        {/* Thanh tiến trình */}
        <div className={styles.progressBar}>
          {STEPS.map((s, i) => (
            <button
              key={s.id}
              className={`
                ${styles.progressDot}
                ${i === currentStep  ? styles.dotActive   : ''}
                ${i <  currentStep   ? styles.dotDone     : ''}
              `}
              onClick={() => setCurrentStep(i)}
            />
          ))}
        </div>

        {/* Nội dung bước hiện tại */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentStep}
            className={styles.stepContent}
            initial={{ opacity: 0, x: 30  }}
            animate={{ opacity: 1, x: 0   }}
            exit={{    opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* Icon + Tiêu đề */}
            <div className={styles.stepHeader}>
              <span className={styles.stepIcon}>{step.icon}</span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <span className={styles.stepNum}>
                {currentStep + 1} / {STEPS.length}
              </span>
            </div>

            {/* Nội dung text */}
            {step.content && (
              <p className={styles.stepText}>{step.content}</p>
            )}

            {/* Danh sách luật */}
            {step.rules && (
              <div className={styles.ruleList}>
                {step.rules.map((rule, i) => (
                  <motion.div
                    key={i}
                    className={styles.ruleItem}
                    initial={{ opacity: 0, x: -16 }}
                    animate={{ opacity: 1, x:   0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <span className={styles.ruleIcon}>{rule.icon}</span>
                    <span className={styles.ruleText}>{rule.text}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Ví dụ XOR */}
            {step.example && (
              <div className={styles.xorDemo}>

                {/* Hàng que demo */}
                <div className={styles.demoPiles}>
                  {step.example.piles.map((count, i) => (
                    <MiniPile
                      key={i}
                      count={count}
                      label={`Hàng ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Bảng XOR */}
                <div className={styles.xorTable}>
                  <div className={styles.xorHeader}>
                    <span>Hàng</span>
                    <span>Giá trị</span>
                    <span>Nhị phân</span>
                  </div>
                  {step.example.binary.map((row, i) => (
                    <div key={i} className={styles.xorRow}>
                      <span>Hàng {i + 1}</span>
                      <span className={styles.xorVal}>{row.val}</span>
                      <span className={styles.xorBin}>{row.bin}</span>
                    </div>
                  ))}
                  <div className={`${styles.xorRow} ${styles.xorResult}`}>
                    <span>XOR</span>
                    <span className={styles.xorVal}>
                      {step.example.xorResult.val}
                    </span>
                    <span className={styles.xorBin}>
                      {step.example.xorResult.bin}
                    </span>
                  </div>
                </div>

                <p className={styles.xorNote}>
                  Nim-Sum = <strong>{step.example.xorResult.val}</strong>
                  {step.example.xorResult.val !== 0
                    ? ' ≠ 0 → Có nước đi thắng! ✅'
                    : ' = 0 → Đang ở thế thua ⚠️'}
                </p>
              </div>
            )}

            {/* Chiến thuật */}
            {step.strategy && (
              <div className={styles.strategyList}>
                {step.strategy.map((s, i) => (
                  <motion.div
                    key={i}
                    className={`
                      ${styles.strategyItem}
                      ${s.good ? styles.strategyGood : styles.strategyBad}
                    `}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y:  0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className={styles.strategyIcon}>
                      {s.good ? '✅' : '⚠️'}
                    </span>
                    <span>{s.step}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Tip cuối */}
            {step.tip && (
              <div className={styles.tipBox}>
                <span className={styles.tipIcon}>💡</span>
                <span>{step.tip}</span>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

        {/* Điều hướng */}
        <div className={styles.navigation}>
          <button
            className='btn btn-ghost'
            onClick={goPrev}
            disabled={isFirst}
          >
            ← Trước
          </button>

          {isLast ? (
            <button
              className='btn btn-primary'
              onClick={goToSetup}
            >
              ▶ Bắt đầu chơi!
            </button>
          ) : (
            <button
              className='btn btn-primary'
              onClick={goNext}
            >
              Tiếp →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TutorialPage;