import React from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DisneyButtonProps {
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'md' | 'lg';
  disabled?: boolean;
}

export function DisneyButton({ onClick, children, className, variant = 'primary', size = 'md', disabled }: DisneyButtonProps) {
  const variants = {
    primary: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white border-4 border-white shadow-[0_8px_0_#9D174D,0_15px_30px_rgba(0,0,0,0.4)] hover:shadow-[0_6px_0_#9D174D,0_10px_20px_rgba(0,0,0,0.4)] active:shadow-[0_2px_0_#9D174D] active:translate-y-1',
    secondary: 'bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20 active:scale-95',
    danger: 'bg-gradient-to-r from-red-500 to-orange-600 text-white border-4 border-white shadow-[0_8px_0_#991B1B]',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "rounded-full font-black uppercase tracking-widest transition-all transform flex items-center justify-center min-h-[44px]",
        size === 'lg' ? "px-6 sm:px-12 py-4 sm:py-5 text-xl sm:text-2xl" : "px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-lg",
        variants[variant],
        disabled && "opacity-50 grayscale cursor-not-allowed",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function FloatingWordsBackground() {
  const words = ['Truth', 'Lie', 'Love', 'Hate', 'Life', 'Death', 'Never', 'Always', 'Unsay'];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden artistic-bg">
      <div className="absolute inset-0 opacity-20 dot-pattern" />
      
      {/* Ambient Blobs */}
      <div className="absolute top-[-100px] right-[-100px] w-[800px] h-[800px] bg-pink-500/20 blur-[150px] rounded-full" />
      <div className="absolute bottom-[-100px] left-[-100px] w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full" />
      
      {/* Floating Words */}
      {words.map((word, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: Math.random() * 100 + '%', y: '110%' }}
          animate={{ opacity: [0, 0.15, 0], y: '-10%', x: (Math.random() * 20 - 10) + '%' }}
          transition={{ duration: 25 + Math.random() * 20, repeat: Infinity, delay: i * 3 }}
          className="absolute text-pink-200/20 text-4xl sm:text-6xl font-black italic select-none"
        >
          {word}
        </motion.div>
      ))}
    </div>
  );
}
