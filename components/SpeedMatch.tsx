
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GameStatus, CardItem } from '../types';
import { Zap, Ghost, Gamepad2, Rocket, Star, Heart, Music, Sun, Cpu, Globe, Anchor, Aperture } from 'lucide-react';

const ICONS = [Zap, Ghost, Gamepad2, Rocket, Star, Heart, Music, Sun, Cpu, Globe, Anchor, Aperture];
const PAIRS_COUNT = 8; // 16 cards total

export const SpeedMatch: React.FC = () => {
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIds, setFlippedIds] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.IDLE);
  const [timeLeft, setTimeLeft] = useState(60);
  const [matches, setMatches] = useState(0);

  useEffect(() => {
    let interval: number;
    if (status === GameStatus.PLAYING) {
      interval = window.setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setStatus(GameStatus.FAILURE);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  const initGame = () => {
    const selectedIcons = ICONS.sort(() => 0.5 - Math.random()).slice(0, PAIRS_COUNT);
    const deck = [...selectedIcons, ...selectedIcons]
      .sort(() => 0.5 - Math.random())
      .map((icon, idx) => ({
        id: `card-${idx}`,
        iconName: icon.displayName || icon.name || `Icon${idx}`, // Just need a unique identifier for the icon type
        component: icon,
        isFlipped: false,
        isMatched: false
      }));
    
    // @ts-ignore - attaching component dynamically to state object for rendering
    setCards(deck);
    setFlippedIds([]);
    setMatches(0);
    setTimeLeft(45); // 45 seconds for 16 cards
    setStatus(GameStatus.PLAYING);
  };

  const handleCardClick = (id: string) => {
    if (status !== GameStatus.PLAYING || flippedIds.length >= 2 || flippedIds.includes(id)) return;
    
    const card = cards.find(c => c.id === id);
    if (card?.isMatched) return;

    // Flip the card
    setCards(prev => prev.map(c => c.id === id ? { ...c, isFlipped: true } : c));
    const newFlipped = [...flippedIds, id];
    setFlippedIds(newFlipped);

    if (newFlipped.length === 2) {
      const card1 = cards.find(c => c.id === newFlipped[0]);
      const card2 = cards.find(c => c.id === id);

      // @ts-ignore
      if (card1.component === card2.component) {
        // Match
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, isMatched: true, isFlipped: true } : c));
          setFlippedIds([]);
          setMatches(m => {
            const newM = m + 1;
            if (newM === PAIRS_COUNT) setStatus(GameStatus.SUCCESS);
            return newM;
          });
        }, 300);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => newFlipped.includes(c.id) ? { ...c, isFlipped: false } : c));
          setFlippedIds([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-4">
      {status === GameStatus.IDLE || status === GameStatus.SUCCESS || status === GameStatus.FAILURE ? (
        <div className="text-center">
           <h2 className="text-6xl font-rajdhani font-bold mb-6 text-white">TEZLIK (SPEED MATCH)</h2>
           {status !== GameStatus.IDLE && (
             <p className={`text-2xl mb-8 font-orbitron ${status === GameStatus.SUCCESS ? 'text-neon-green' : 'text-neon-pink'}`}>
               {status === GameStatus.SUCCESS ? `DAXSHAT! ${45 - timeLeft}s` : 'VAQT TUGADI (TIME UP)'}
             </p>
           )}
           <button onClick={initGame} className="bg-neon-blue text-black font-orbitron font-bold text-2xl px-12 py-6 rounded-full hover:scale-105 transition-transform">
             {status === GameStatus.IDLE ? 'BOSHLASH (START)' : 'YANA O\'YNAYMIZ (PLAY AGAIN)'}
           </button>
        </div>
      ) : (
        <>
          <div className="w-full max-w-4xl flex justify-between items-center mb-6">
            <div className="flex flex-col">
              <span className="text-gray-400 font-rajdhani text-sm uppercase">VAQT (TIME)</span>
              <span className={`text-4xl font-orbitron ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                {timeLeft}s
              </span>
            </div>
            <div className="h-4 flex-1 mx-8 bg-gray-800 rounded-full overflow-hidden">
               <motion.div 
                 initial={{ width: '100%' }} 
                 animate={{ width: `${(timeLeft / 45) * 100}%` }} 
                 className="h-full bg-neon-blue"
               />
            </div>
            <div className="flex flex-col items-end">
              <span className="text-gray-400 font-rajdhani text-sm uppercase">JUFTLIKLAR (PAIRS)</span>
              <span className="text-4xl font-orbitron text-neon-green">{matches}/{PAIRS_COUNT}</span>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 w-full max-w-4xl aspect-square md:aspect-[4/3]">
            {cards.map((card) => {
              // @ts-ignore
              const Icon = card.component;
              return (
                <div key={card.id} className="relative w-full h-full perspective-1000" onClick={() => handleCardClick(card.id)}>
                   <motion.div
                     initial={false}
                     animate={{ rotateY: card.isFlipped ? 180 : 0 }}
                     transition={{ duration: 0.3 }}
                     className="w-full h-full relative preserve-3d cursor-pointer"
                     style={{ transformStyle: 'preserve-3d' }}
                   >
                     {/* Front (Hidden) */}
                     <div className="absolute inset-0 bg-dark-card border-2 border-neon-blue/30 rounded-xl flex items-center justify-center backface-hidden" style={{ backfaceVisibility: 'hidden' }}>
                        <div className="w-8 h-8 rounded-full bg-white/10" />
                     </div>
                     
                     {/* Back (Revealed) */}
                     <div 
                       className={`absolute inset-0 rounded-xl flex items-center justify-center backface-hidden ${card.isMatched ? 'bg-neon-green/20 border-2 border-neon-green' : 'bg-white border-2 border-white'}`} 
                       style={{ transform: 'rotateY(180deg)', backfaceVisibility: 'hidden' }}
                     >
                        <Icon className={`w-1/2 h-1/2 ${card.isMatched ? 'text-neon-green' : 'text-black'}`} />
                     </div>
                   </motion.div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
