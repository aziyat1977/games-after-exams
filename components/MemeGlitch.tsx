
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateMemeTrivia } from '../services/geminiService';
import { MemeTrivia, GameStatus } from '../types';
import { Skull, Check, X, RefreshCw } from 'lucide-react';

export const MemeGlitch: React.FC = () => {
  const [data, setData] = useState<MemeTrivia | null>(null);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  const [selected, setSelected] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);

  const loadQuestion = async () => {
    setStatus(GameStatus.LOADING);
    setSelected(null);
    const newData = await generateMemeTrivia();
    setData(newData);
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    loadQuestion();
  }, []);

  const handleGuess = (opt: string) => {
    if (status !== GameStatus.PLAYING) return;
    setSelected(opt);
    if (opt === data?.answer) {
      setStatus(GameStatus.SUCCESS);
      setStreak(s => s + 1);
    } else {
      setStatus(GameStatus.FAILURE);
      setStreak(0);
    }
  };

  if (status === GameStatus.LOADING) {
    return (
      <div className="h-full flex flex-col items-center justify-center">
        <Skull className="w-20 h-20 text-neon-pink animate-pulse mb-4" />
        <p className="font-orbitron text-xl">MEMLAR YUKLANMOQDA...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className="absolute top-6 right-6 font-orbitron text-neon-pink text-xl">
        SERIYA (STREAK): {streak}
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-dark-card border border-neon-pink/50 p-10 rounded-3xl mb-10 text-center relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-neon-pink animate-pulse" />
        <h2 className="text-gray-400 font-orbitron text-sm mb-4 tracking-[0.3em]">QAYSI MEM HAQIDA GAP KETYAPTI?</h2>
        <p className="text-2xl md:text-4xl font-rajdhani font-bold text-white leading-relaxed">
          "{data?.description}"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {data?.options.map((opt, i) => {
          let styles = "bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-neon-pink text-white";
          if (status !== GameStatus.PLAYING) {
             if (opt === data?.answer) styles = "bg-neon-green/20 border-neon-green text-neon-green";
             else if (opt === selected) styles = "bg-red-500/20 border-red-500 text-red-500";
             else styles = "opacity-30 border-transparent";
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleGuess(opt)}
              className={`p-6 rounded-2xl font-orbitron text-lg md:text-xl transition-all ${styles}`}
            >
              {opt}
              {status !== GameStatus.PLAYING && opt === data?.answer && <Check className="inline ml-2" />}
              {status !== GameStatus.PLAYING && opt === selected && opt !== data?.answer && <X className="inline ml-2" />}
            </motion.button>
          );
        })}
      </div>

      {status !== GameStatus.PLAYING && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={loadQuestion}
          className="mt-10 bg-white text-black font-orbitron font-bold px-10 py-4 rounded-full hover:scale-105 transition-transform flex items-center gap-2"
        >
          <RefreshCw className="w-5 h-5" /> KEYINGISI (NEXT)
        </motion.button>
      )}
    </div>
  );
};
