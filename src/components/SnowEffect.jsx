import React from 'react';
import styles from './SnowEffect.module.css';

const SNOWFLAKE_COUNT = 40;

const createSnowflakes = () =>
  Array.from({ length: SNOWFLAKE_COUNT }, (_, i) => ({
    id:       i,
    left:     Math.random() * 100,
    size:     Math.random() * 6 + 4,
    duration: Math.random() * 6 + 6,
    delay:    Math.random() * 8,
    opacity:  Math.random() * 0.5 + 0.3,
    drift:    (Math.random() - 0.5) * 60,
  }));

const snowflakes = createSnowflakes();

const SnowEffect = ({ active }) => {
  if (!active) return null;

  return (
    <div className={styles.snowContainer}>
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className={styles.snowflake}
          style={{
            left:              `${flake.left}%`,
            width:             `${flake.size}px`,
            height:            `${flake.size}px`,
            opacity:           flake.opacity,
            animationDuration: `${flake.duration}s`,
            animationDelay:    `${flake.delay}s`,
            '--drift':         `${flake.drift}px`,
          }}
        />
      ))}
    </div>
  );
};

export default SnowEffect;