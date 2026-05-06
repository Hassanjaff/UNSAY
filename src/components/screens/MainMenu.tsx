import React from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { DisneyButton } from '../UI';
import { playSound } from '../../lib/audio';

export function MainMenu() {
  const { setState } = useGame();

  const handlePlay = () => {
    playSound('transition');
    setState(s => ({ ...s, screen: 'difficulty' }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center">
      {/* MAGICAL LOGO */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mb-20"
      >
        {/* Glow behind */}
        <div className="absolute inset-0 bg-pink-500/30 blur-3xl animate-pulse" />
        
        {/* CSS Magic Logo */}
        <div className="w-56 h-56 rounded-full bg-gradient-to-tr from-pink-600 to-purple-800 border-8 border-white flex items-center justify-center shadow-[0_0_50px_rgba(236,72,153,0.5)] overflow-hidden relative">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 opacity-20"
          >
             <div className="w-full h-full border-4 border-dashed border-white rounded-full scale-150" />
          </motion.div>
          
          <div className="relative text-center -rotate-6">
            <span className="block text-6xl font-black italic text-yellow-400 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] leading-tight tracking-tighter">UN</span>
            <span className="block text-6xl font-black italic text-white drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] leading-tight tracking-tighter ml-4">SAY</span>
          </div>
          
          {/* Sparkles on logo */}
          <motion.div
             animate={{ opacity: [0, 1, 0], scale: [1, 2, 1] }}
             transition={{ duration: 2, repeat: Infinity }}
             className="absolute top-4 right-8 text-yellow-300 text-2xl"
          >✨</motion.div>
        </div>
      </motion.div>

      <DisneyButton onClick={handlePlay} size="lg">
        UNSAY IT!
      </DisneyButton>

      <p className="mt-12 text-pink-300 font-black italic uppercase tracking-widest text-sm">
        "FLIP THE MEANING"
      </p>
    </div>
  );
}
