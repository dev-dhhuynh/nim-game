// Màn hình hướng dẫn

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { getTutorialSteps, getTutorialUI } from '../utils/translations';
import styles from './TutorialPage.module.css';


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
  const { goToMenu, goToSetup, settings } = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);

  const lang  = settings.language || 'vi';
  const STEPS = getTutorialSteps(lang);
  const ui    = getTutorialUI(lang);

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
            {ui.back}
          </button>
          <h2 className={styles.title}>{ui.title}</h2>
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
                      label={`${step.example.rowLabel} ${i + 1}`}
                    />
                  ))}
                </div>

                {/* Bảng XOR */}
                <div className={styles.xorTable}>
                  <div className={styles.xorHeader}>
                    <span>{step.example.rowLabel}</span>
                    <span>{ui.valueCol}</span>
                    <span>{ui.binCol}</span>
                  </div>
                  {step.example.binary.map((row, i) => (
                    <div key={i} className={styles.xorRow}>
                      <span>{step.example.rowLabel} {i + 1}</span>
                      <span className={styles.xorVal}>{row.val}</span>
                      <span className={styles.xorBin}>{row.bin}</span>
                    </div>
                  ))}
                  <div className={`${styles.xorRow} ${styles.xorResult}`}>
                    <span>{ui.xorLabel}</span>
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
                    ? ui.nimSumWin
                    : ui.nimSumLose}
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
            {ui.prev}
          </button>

          {isLast ? (
            <button
              className='btn btn-primary'
              onClick={goToSetup}
            >
              {ui.start}
            </button>
          ) : (
            <button
              className='btn btn-primary'
              onClick={goNext}
            >
              {ui.next}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

export default TutorialPage;