// Hiệu ứng theo chủ đề

import React from 'react';
import styles from './ThemeEffects.module.css';

// Số lượng phần tử
const COUNTS = {
  default:   30,  // hạt tinh tú
  halloween: 8,   // con quạ
  summer:    20,  // bong bóng
};

// Tạo dữ liệu ngẫu nhiên
const createParticles = (theme) => {
  const count = COUNTS[theme] || 0;

  return Array.from({ length: count }, (_, i) => ({
    id:       i,
    left:     Math.random() * 100,
    size:     Math.random() * 10 + 6,
    duration: Math.random() * 8 + 6,
    delay:    Math.random() * 10,
    opacity:  Math.random() * 0.5 + 0.3,
    drift:    (Math.random() - 0.5) * 100,
    speed:    Math.random() * 4 + 3,
  }));
};

// Default
const StarParticles = () => {
  const particles = createParticles('default');

  return (
    <div className={styles.container}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.star}
          style={{
            left:              `${p.left}%`,
            width:             `${p.size * 0.4}px`,
            height:            `${p.size * 0.4}px`,
            opacity:           p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
            '--drift':         `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

// Halloween
const CrowParticles = () => {
  const particles = createParticles('halloween');

  return (
    <div className={styles.container}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.crow}
          style={{
            top:               `${Math.random() * 60 + 5}%`,
            animationDuration: `${p.duration + 4}s`,
            animationDelay:    `${p.delay}s`,
            fontSize:          `${p.size * 1.5}px`,
            opacity:           p.opacity + 0.3,
            '--dir':           Math.random() > 0.5 ? '1' : '-1',
          }}
        />
      ))}
    </div>
  );
};

// Summer
const BubbleParticles = () => {
  const particles = createParticles('summer');

  return (
    <div className={styles.container}>
      {particles.map((p) => (
        <div
          key={p.id}
          className={styles.bubble}
          style={{
            left:              `${p.left}%`,
            width:             `${p.size * 2}px`,
            height:            `${p.size * 2}px`,
            opacity:           p.opacity,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
            '--drift':         `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

// Component chính
const ThemeEffects = ({ theme }) => {
  if (theme === 'default')   return <StarParticles />;
  if (theme === 'halloween') return <CrowParticles />;
  if (theme === 'summer')    return <BubbleParticles />;
  return null;
};

export default ThemeEffects;