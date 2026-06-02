// =============================================
// APP.JS — Điều hướng chính
// =============================================
import React, { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useGameStore } from './store/gameStore';
import { applyTheme } from './utils/themes';
import MenuPage    from './pages/MenuPage';
import SetupPage   from './pages/SetupPage';
import GamePage    from './pages/GamePage';
import './styles/globals.css';
import TutorialPage from './pages/TutorialPage';
import StatsPage from './pages/StatsPage';

const pageVariants = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1    },
  exit:    { opacity: 0, scale: 1.02 },
};

const App = () => {
  const { gamePhase, settings } = useGameStore();

  // Áp dụng theme khi app khởi động
  useEffect(() => {
    applyTheme(settings.theme || 'default');
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.theme]);

  const renderPage = () => {
    switch (gamePhase) {
      case 'menu':    return <MenuPage  key='menu'  />;
      case 'setup':   return <SetupPage key='setup' />;
      case 'tutorial': return <TutorialPage  key='tutorial' />;
      case 'stats':    return <StatsPage    key='stats'    />;
      case 'playing':
      case 'gameover':return <GamePage  key='game'  />;
      default:        return <MenuPage  key='menu'  />;
    }
  };

  return (
    <div
      className='bg-grid'
      style={{ width: '100%', height: '100%' }}
    >
      <AnimatePresence mode='wait'>
        <motion.div
          key={
            gamePhase === 'playing' || gamePhase === 'gameover'
              ? 'game'
              : gamePhase
          }
          variants={pageVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={{ duration: 0.25 }}
          style={{ width: '100%', height: '100%' }}
        >
          {renderPage()}
        </motion.div>
      </AnimatePresence>

      <Toaster
        position='bottom-right'
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color:      'var(--text-primary)',
            border:     '1px solid var(--border)',
            fontFamily: 'var(--font-body)',
            fontSize:   '0.85rem',
          },
          success: {
            iconTheme: {
              primary:   'var(--accent-primary)',
              secondary: 'var(--bg-primary)',
            },
          },
        }}
      />
    </div>
  );
};

export default App;