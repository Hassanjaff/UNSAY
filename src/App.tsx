/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { FloatingWordsBackground } from './components/UI';
import { LoadingScreen } from './components/screens/LoadingScreen';
import { MainMenu } from './components/screens/MainMenu';
import { DifficultySelect } from './components/screens/DifficultySelect';
import { GameScreen } from './components/screens/GameScreen';
import { FinalResultScreen } from './components/screens/ResultScreen';
import { sounds, playSound } from './lib/audio';

function GameContent() {
  const { state } = useGame();

  useEffect(() => {
    // Start background music on first interaction
    const startMusic = () => {
      playSound('bgm');
      window.removeEventListener('click', startMusic);
    };
    window.addEventListener('click', startMusic);
    return () => window.removeEventListener('click', startMusic);
  }, []);

  return (
    <div className="game-container relative flex flex-col items-center justify-center font-sans">
      <FloatingWordsBackground />
      
      {/* Developer Credit */}
      <div className="absolute top-4 right-6 z-50 pointer-events-none">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-300/40">
          Developed by Hassan Raza
        </span>
      </div>
      
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {state.screen === 'loading' && <LoadingScreen />}
        {state.screen === 'menu' && <MainMenu />}
        {state.screen === 'difficulty' && <DifficultySelect />}
        {state.screen === 'game' && <GameScreen />}
        {state.screen === 'result' && <FinalResultScreen type="win" />}
        {state.screen === 'fail' && <FinalResultScreen type="fail" />}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <GameProvider>
      <GameContent />
    </GameProvider>
  );
}
