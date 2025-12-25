
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
        <p className="font-orbitron text-xl animate-pulse">LOADING MEMES...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      {/* Glitch Style Keyframes (injected via style for simplicity in this component scope) */}
      <style>{`
        @keyframes glitch {
          0% { transform: translate(0); text-shadow: 2px 2px #bc13fe; }
          20% { transform: translate(-2px, 2px); text-shadow: -2px -2px #00f3ff; }
          40% { transform: translate(2px, -2px); text-shadow: 2px 2px #bc13fe; }
          60% { transform: translate(-2px, 0); text-shadow: -2px 0 #ff0055; }
          80% { transform: translate(0, 2px); text-shadow: 0 -2px #00f3ff; }
          100% { transform: translate(0); text-shadow: 2px 2px #bc13fe; }
        }
        .glitch-text {
          animation: glitch 3s infinite alternate;
        }
      `}</style>

      <div className="absolute top-6 right-6 font-orbitron text-neon-pink text-xl border border-neon-pink px-4 py-2 rounded-lg">
        STREAK: {streak}
      </div>

      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-dark-card border-2 border-neon-pink/50 p-10 rounded-3xl mb-10 text-center relative overflow-hidden shadow-[0_0_50px_rgba(255,0,85,0.2)]"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-neon-pink via-purple-500 to-neon-pink animate-pulse" />
        <h2 className="text-gray-400 font-orbitron text-sm mb-4 tracking-[0.3em] uppercase">Meme Description Decoder</h2>
        <p className="text-2xl md:text-4xl font-rajdhani font-bold text-white leading-relaxed glitch-text">
          "{data?.description}"
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {data?.options.map((opt, i) => {
          let styles = "bg-white/5 border-2 border-white/10 hover:bg-white/10 hover:border-neon-pink text-white hover:scale-105";
          let icon = null;

          if (status !== GameStatus.PLAYING) {
             if (opt === data?.answer) {
                 styles = "bg-neon-green/20 border-neon-green text-neon-green scale-105 shadow-[0_0_20px_rgba(10,255,0,0.4)]";
                 icon = <Check className="ml-2 w-6 h-6" />;
             } else if (opt === selected) {
                 styles = "bg-red-500/20 border-red-500 text-red-500 opacity-80";
                 icon = <X className="ml-2 w-6 h-6" />;
             } else {
                 styles = "opacity-30 border-transparent grayscale";
             }
          }

          return (
            <motion.button
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => handleGuess(opt)}
              disabled={status !== GameStatus.PLAYING}
              className={`p-6 rounded-2xl font-orbitron text-lg md:text-xl transition-all duration-300 flex items-center justify-center ${styles}`}
            >
              {opt}
              {icon}
            </motion.button>
          );
        })}
      </div>

      {status !== GameStatus.PLAYING && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={loadQuestion}
          className="mt-10 bg-white text-black font-orbitron font-bold px-10 py-4 rounded-full hover:scale-105 hover:bg-neon-pink hover:text-white transition-all flex items-center gap-2 shadow-xl"
        >
          <RefreshCw className="w-5 h-5" /> NEXT MEME
        </motion.button>
      )}
    </div>
  );
};
