import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { useGame } from '../../context/GameContext';
import { playSound } from '../../lib/audio';

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);
  const { setState } = useGame();

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 2;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleEnter = () => {
    playSound('bgm');
    playSound('transition');
    setState(s => ({ ...s, screen: 'menu' }));
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center text-white">
      <motion.div
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="text-9xl font-black italic mb-12 text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]"
      >
        UNSAY
      </motion.div>
      
      <div className="w-96 h-6 bg-blue-950 rounded-full border-4 border-white overflow-hidden shadow-2xl relative mb-8">
        <motion.div 
          className="h-full bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400 shadow-[0_0_20px_#facc15]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>
      
      <div className="h-20 flex items-center justify-center">
        {progress >= 100 ? (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            onClick={handleEnter}
            className="px-12 py-4 bg-white text-blue-950 rounded-full font-black text-2xl shadow-[0_5px_0_#ccc] active:translate-y-1 active:shadow-none transition-all uppercase tracking-widest"
          >
            Enter the Shadows
          </motion.button>
        ) : (
          <p className="font-black italic uppercase tracking-[0.4em] text-pink-300 animate-pulse">
            Aligning the Stars... {progress}%
          </p>
        )}
      </div>
    </div>
  );
}
