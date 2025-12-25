
import React, { useState, useEffect, useRef } from 'react';
import { motion, PanInfo, AnimatePresence } from 'framer-motion';
import { generateGravitySortLevel } from '../services/geminiService';
import { GameStatus, SortLevel, SortItem } from '../types';
import { RefreshCw, Zap, CheckCircle2, XCircle } from 'lucide-react';

export const GravitySort: React.FC = () => {
    const [level, setLevel] = useState<SortLevel | null>(null);
    const [items, setItems] = useState<SortItem[]>([]);
    const [score, setScore] = useState(0);
    const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
    const [timeLeft, setTimeLeft] = useState(60);
    
    // Refs for drop zones to calculate collision
    const leftZoneRef = useRef<HTMLDivElement>(null);
    const rightZoneRef = useRef<HTMLDivElement>(null);

    const init = async () => {
        setStatus(GameStatus.LOADING);
        const data = await generateGravitySortLevel();
        setLevel(data);
        setItems(data.items); // Put all items in the "cloud"
        setScore(0);
        setTimeLeft(60);
        setStatus(GameStatus.PLAYING);
    };

    useEffect(() => { init(); }, []);

    useEffect(() => {
        if(status === GameStatus.PLAYING && timeLeft > 0) {
            const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
            return () => clearInterval(timer);
        } else if (timeLeft === 0) {
            setStatus(GameStatus.SUCCESS);
        }
    }, [status, timeLeft]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo, item: SortItem) => {
        const itemRect = (event.target as HTMLElement).getBoundingClientRect();
        const leftRect = leftZoneRef.current?.getBoundingClientRect();
        const rightRect = rightZoneRef.current?.getBoundingClientRect();

        // Simple Collision Detection
        const inLeft = leftRect && (info.point.x < leftRect.right);
        const inRight = rightRect && (info.point.x > rightRect.left);
        const inBottom = (info.point.y > window.innerHeight * 0.6); // Must be in bottom half

        if (inBottom && inLeft && item.category === 'LEFT') {
            handleCorrect(item.id);
        } else if (inBottom && inRight && item.category === 'RIGHT') {
            handleCorrect(item.id);
        } else {
            // Incorrect or dropped nowhere - Snap back happens via Framer Motion layoutId or key
        }
    };

    const handleCorrect = (id: string) => {
        setItems(prev => prev.filter(i => i.id !== id));
        setScore(s => s + 100);
        // Add time bonus?
    };

    return (
        <div className="h-full w-full flex flex-col p-6 relative overflow-hidden">
            {/* HUD */}
            <div className="flex justify-between items-center mb-4 z-20">
                 <div className="flex flex-col">
                     <span className="text-neon-blue font-orbitron text-sm">GRAVITY BLITZ</span>
                     <span className="text-4xl font-black font-rajdhani">{score}</span>
                 </div>
                 <div className="flex flex-col items-end">
                     <span className="text-red-500 font-orbitron text-sm">TIME</span>
                     <span className="text-4xl font-black font-rajdhani">{timeLeft}s</span>
                 </div>
            </div>

            {/* The Cloud (Source) */}
            <div className="flex-1 relative z-10">
                <div className="flex flex-wrap justify-center gap-4 p-8">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                drag
                                dragConstraints={{ top: 0, left: 0, right: 0, bottom: 0 }}
                                dragElastic={0.8} // Bouncy feel
                                onDragEnd={(e, info) => handleDragEnd(e, info, item)}
                                whileDrag={{ scale: 1.2, zIndex: 100, cursor: 'grabbing' }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="bg-white text-black px-6 py-3 rounded-full font-bold font-rajdhani text-xl shadow-[0_0_15px_white] cursor-grab select-none touch-none"
                            >
                                {item.text}
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
                {items.length === 0 && status === GameStatus.PLAYING && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <h2 className="text-6xl font-orbitron text-neon-green animate-pulse">CLEARED!</h2>
                    </div>
                )}
            </div>

            {/* Drop Zones */}
            <div className="h-1/3 flex gap-4 mt-4 relative z-0">
                <div 
                    ref={leftZoneRef} 
                    className="flex-1 bg-gradient-to-tr from-neon-blue/20 to-transparent border-2 border-neon-blue rounded-3xl flex items-center justify-center relative group"
                >
                    <div className="absolute bottom-4 left-4">
                        <CheckCircle2 className="w-12 h-12 text-neon-blue opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-3xl font-orbitron font-bold text-neon-blue tracking-widest uppercase">{level?.leftCategory || "LEFT"}</h3>
                </div>
                
                {/* Divider Line */}
                <div className="w-1 bg-white/20 h-full rounded-full" />

                <div 
                    ref={rightZoneRef}
                    className="flex-1 bg-gradient-to-tl from-neon-pink/20 to-transparent border-2 border-neon-pink rounded-3xl flex items-center justify-center relative group"
                >
                     <div className="absolute bottom-4 right-4">
                        <CheckCircle2 className="w-12 h-12 text-neon-pink opacity-50 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <h3 className="text-3xl font-orbitron font-bold text-neon-pink tracking-widest uppercase">{level?.rightCategory || "RIGHT"}</h3>
                </div>
            </div>

            {status !== GameStatus.PLAYING && status !== GameStatus.LOADING && (
                <div className="absolute inset-0 bg-black/80 z-50 flex items-center justify-center">
                    <div className="text-center">
                         <h2 className="text-5xl font-orbitron text-white mb-4">ROUND OVER</h2>
                         <p className="text-2xl text-neon-green mb-8">FINAL SCORE: {score}</p>
                         <button onClick={init} className="bg-white text-black font-bold px-10 py-4 rounded-full text-xl hover:scale-105 transition">
                             PLAY AGAIN
                         </button>
                    </div>
                </div>
            )}
        </div>
    );
};
