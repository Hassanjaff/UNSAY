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
    <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
      {/* MAGICAL LOGO */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative mb-12 sm:mb-20"
      >
        {/* Glow behind */}
        <div className="absolute inset-0 bg-pink-500/30 blur-3xl animate-pulse rounded-full" />
        
        {/* New Image Logo */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 flex items-center justify-center relative">
          <motion.img 
            src="/logo.png"
            alt="UNSAY Logo"
            className="w-full h-full object-contain drop-shadow-[0_0_50px_rgba(236,72,153,0.5)]"
            initial={{ scale: 0.8, rotate: -5 }}
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 2, -2, 0],
              y: [0, -10, 0]
            }}
            transition={{ 
              duration: 4, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            whileHover={{ scale: 1.1, rotate: 5 }}
          />
          
          {/* Sparkles on logo */}
          <motion.div
             animate={{ opacity: [0, 1, 0], scale: [1, 2, 1], rotate: 360 }}
             transition={{ duration: 3, repeat: Infinity }}
             className="absolute top-4 right-8 text-yellow-300 text-2xl pointer-events-none"
          >✨</motion.div>
          <motion.div
             animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], rotate: -360 }}
             transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
             className="absolute bottom-10 left-4 text-blue-300 text-xl pointer-events-none"
          >✨</motion.div>
        </div>
      </motion.div>

      <DisneyButton onClick={handlePlay} size="lg">
        UNSAY IT!
      </DisneyButton>

      <p className="mt-12 text-pink-300 font-black italic uppercase tracking-widest text-sm">
        "FLIP THE MEANING"
      </p>

      {/* Developer Credit - Only on Main Menu */}
      <div className="mt-8 opacity-40">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-200">
          Developed by Hassan Raza
        </span>
      </div>
    </div>
  );
}
