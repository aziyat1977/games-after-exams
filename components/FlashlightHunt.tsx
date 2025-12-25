import React, { useState, useEffect, useRef } from 'react';
import { generateFlashlightLevel } from '../services/geminiService';
import { GameStatus, HiddenObject } from '../types';
import { motion } from 'framer-motion';
import { Search, Lightbulb, CheckCircle2 } from 'lucide-react';

export const FlashlightHunt: React.FC = () => {
    const [objects, setObjects] = useState<HiddenObject[]>([]);
    const [topic, setTopic] = useState("");
    const [mousePos, setMousePos] = useState({ x: 50, y: 50 }); // Percentages
    const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
    const containerRef = useRef<HTMLDivElement>(null);

    const init = async () => {
        setStatus(GameStatus.LOADING);
        const data = await generateFlashlightLevel();
        setTopic(data.topic);
        setObjects(data.objects);
        setStatus(GameStatus.PLAYING);
    };

    useEffect(() => { init(); }, []);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if(!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        let clientX, clientY;
        
        if('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = ((clientX - rect.left) / rect.width) * 100;
        const y = ((clientY - rect.top) / rect.height) * 100;
        setMousePos({ x, y });
    };

    const handleClick = () => {
        // Check collision with any hidden object
        // 10% tolerance
        const foundId = objects.find(obj => 
            !obj.isFound && 
            Math.abs(obj.x - mousePos.x) < 8 && 
            Math.abs(obj.y - mousePos.y) < 8
        )?.id;

        if (foundId) {
            setObjects(prev => prev.map(o => o.id === foundId ? { ...o, isFound: true } : o));
            // Feedback sound or animation could go here
        }
    };

    return (
        <div className="h-full w-full flex flex-col p-4">
             {/* Header */}
             <div className="flex justify-between items-center bg-dark-card border border-white/10 p-4 rounded-xl mb-4">
                 <div className="flex items-center gap-3">
                     <Lightbulb className="text-yellow-400" />
                     <span className="font-orbitron text-xl">ANOMALIES: {objects.filter(o => o.isFound).length}/{objects.length}</span>
                 </div>
                 <div className="font-rajdhani text-gray-400">FIND: {objects.filter(o => !o.isFound).map(o => o.label).join(', ')}</div>
             </div>

             {/* Game Area */}
             <div 
                ref={containerRef}
                className="flex-1 relative bg-black rounded-3xl overflow-hidden cursor-none touch-none border-4 border-gray-800 shadow-2xl"
                onMouseMove={handleMove}
                onTouchMove={handleMove}
                onClick={handleClick}
                onTouchStart={handleClick}
             >
                 {/* Layer 1: The Hidden Content (Revealed by Mask) */}
                 {/* We use a clever trick: The background is the content. The foreground is black. The mask punches a hole. */}
                 
                 {/* This is the "Light" layer - fully visible content, but masked */}
                 <div 
                    className="absolute inset-0 bg-zinc-900"
                    style={{
                        maskImage: `radial-gradient(circle 150px at ${mousePos.x}% ${mousePos.y}%, black 100%, transparent 100%)`,
                        WebkitMaskImage: `radial-gradient(circle 150px at ${mousePos.x}% ${mousePos.y}%, black 100%, transparent 100%)`,
                    }}
                 >
                     {/* Decor Pattern */}
                     <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')]" />
                     
                     {/* The Hidden Objects */}
                     {objects.map(obj => (
                         <div 
                            key={obj.id}
                            className={`absolute transition-all duration-300 ${obj.isFound ? 'scale-150 text-green-500' : 'text-white'}`}
                            style={{ left: `${obj.x}%`, top: `${obj.y}%`, transform: 'translate(-50%, -50%)' }}
                         >
                            {obj.isFound ? <CheckCircle2 size={48} /> : (
                                <span className="font-rajdhani font-bold text-xl select-none">{obj.label}</span>
                            )}
                         </div>
                     ))}
                     
                     {/* Distractors / Decor Text */}
                     {Array.from({length: 15}).map((_, i) => (
                         <div 
                            key={`d-${i}`} 
                            className="absolute text-gray-700 font-mono text-xs opacity-50 select-none pointer-events-none"
                            style={{ 
                                left: `${Math.random() * 100}%`, 
                                top: `${Math.random() * 100}%` 
                            }}
                         >
                            ANOMALY_DETECT_{i}
                         </div>
                     ))}
                 </div>

                 {/* Layer 2: The Flashlight Ring (Visual only) */}
                 <div 
                    className="absolute pointer-events-none border-2 border-white/50 rounded-full shadow-[0_0_50px_rgba(255,255,255,0.2)]"
                    style={{
                        width: '300px',
                        height: '300px',
                        left: `${mousePos.x}%`,
                        top: `${mousePos.y}%`,
                        transform: 'translate(-50%, -50%)'
                    }}
                 />
                 
                 {status === GameStatus.LOADING && (
                     <div className="absolute inset-0 flex items-center justify-center bg-black text-white">
                         LOADING DARKNESS...
                     </div>
                 )}
                 
                 {objects.every(o => o.isFound) && status === GameStatus.PLAYING && (
                     <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center backdrop-blur-sm">
                         <h1 className="text-6xl font-orbitron text-white drop-shadow-lg">LIGHTS ON!</h1>
                         <button onClick={init} className="absolute bottom-20 bg-white text-black px-8 py-4 rounded-xl font-bold">NEXT ROOM</button>
                     </div>
                 )}
             </div>
        </div>
    );
};