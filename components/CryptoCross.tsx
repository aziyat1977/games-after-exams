
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { generateCrosswordData } from '../services/geminiService';
import { CrosswordData, GameStatus } from '../types';
import { Hash, Check, RefreshCw } from 'lucide-react';

export const CryptoCross: React.FC = () => {
  const [data, setData] = useState<CrosswordData | null>(null);
  const [inputs, setInputs] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);

  const initGame = async () => {
    setStatus(GameStatus.LOADING);
    const newData = await generateCrosswordData();
    setData(newData);
    setInputs(new Array(newData.items.length).fill(''));
    setStatus(GameStatus.PLAYING);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleChange = (index: number, val: string) => {
    if (status !== GameStatus.PLAYING) return;
    const newInputs = [...inputs];
    newInputs[index] = val.toUpperCase();
    setInputs(newInputs);

    // Check win condition
    if (data && newInputs.every((inp, i) => inp === data.items[i].answer)) {
        setStatus(GameStatus.SUCCESS);
    }
  };

  if (status === GameStatus.LOADING) {
    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Hash className="w-16 h-16 text-neon-blue animate-spin mb-4" />
            <p className="font-orbitron text-xl">GENERATING CROSSWORD...</p>
        </div>
    );
  }

  return (
    <div className="h-full flex flex-col items-center justify-center p-6 overflow-y-auto">
       <div className="mb-8 text-center">
          <span className="text-neon-purple font-orbitron text-sm tracking-widest">HIDDEN THEME</span>
          <h2 className="text-4xl text-white font-rajdhani font-bold">{data?.theme}</h2>
       </div>

       <div className="w-full max-w-3xl space-y-4">
          {data?.items.map((item, i) => {
            const isCorrect = inputs[i] === item.answer;
            return (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col md:flex-row gap-4 items-center bg-dark-card border border-white/10 p-4 rounded-xl"
              >
                 <div className="flex-1 text-center md:text-left">
                    <span className="text-neon-blue font-bold mr-2">0{i+1}.</span>
                    <span className="text-gray-300 font-rajdhani text-xl">{item.clue}</span>
                 </div>
                 <div className="relative">
                    <input 
                      type="text"
                      maxLength={item.answer.length}
                      value={inputs[i]}
                      onChange={(e) => handleChange(i, e.target.value)}
                      className={`bg-black/50 border-2 rounded-lg py-2 px-4 font-mono text-xl tracking-[0.5em] w-48 text-center uppercase focus:outline-none transition-all ${isCorrect ? 'border-neon-green text-neon-green' : 'border-white/20 text-white focus:border-neon-blue'}`}
                    />
                    {isCorrect && <Check className="absolute right-[-30px] top-3 text-neon-green" />}
                 </div>
              </motion.div>
            );
          })}
       </div>

       {status === GameStatus.SUCCESS && (
           <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="mt-8 text-center">
               <div className="text-neon-green font-orbitron text-2xl mb-4">AWESOME! ALL CORRECT</div>
               <button onClick={initGame} className="bg-white text-black font-bold px-8 py-3 rounded-full flex items-center gap-2 mx-auto hover:scale-105 transition">
                   <RefreshCw className="w-5 h-5" /> NEW GAME
               </button>
           </motion.div>
       )}
    </div>
  );
};
