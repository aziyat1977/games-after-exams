
import React, { useRef, useState, useEffect } from 'react';
import { generateMemeTribunalTemplate } from '../services/geminiService';
import { GameStatus, MemeTemplate } from '../types';
import { PenTool, Eraser, ThumbsUp, Skull, Flame, RefreshCw, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';

const CanvasColumn: React.FC<{ 
    id: number, 
    color: string, 
    isActive: boolean,
    template: MemeTemplate | null
}> = ({ id, color, isActive, template }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [votes, setVotes] = useState({ fire: 0, skull: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if(canvas) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
    }, []);

    const draw = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !isActive || !canvasRef.current) return;
        const ctx = canvasRef.current.getContext('2d');
        if (!ctx) return;
        const rect = canvasRef.current.getBoundingClientRect();
        
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const x = clientX - rect.left;
        const y = clientY - rect.top;

        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.strokeStyle = color;

        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    };

    const start = (e: any) => { setIsDrawing(true); draw(e); };
    const stop = () => { 
        setIsDrawing(false); 
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.beginPath();
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-dark-card border-x border-white/10 relative group">
            {/* Header / Template Area */}
            <div className="h-1/3 p-4 border-b border-white/10 flex items-center justify-center bg-black/40">
                <div className="text-center">
                    <div className="w-full h-32 bg-gray-800 rounded-lg flex items-center justify-center mb-2 overflow-hidden relative">
                         {/* Placeholder visual for template */}
                         <div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-900 opacity-50" />
                         <span className="relative z-10 font-orbitron text-gray-400 text-xs">MEME ZONE {id}</span>
                    </div>
                    <p className="text-xs text-neon-blue font-rajdhani uppercase">{template?.topic}</p>
                </div>
            </div>

            {/* Drawing Area */}
            <div className="flex-1 relative bg-white touch-none">
                <canvas 
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    onMouseDown={start} onMouseMove={draw} onMouseUp={stop} onMouseOut={stop}
                    onTouchStart={start} onTouchMove={draw} onTouchEnd={stop}
                />
                {!isActive && <div className="absolute inset-0 bg-black/10 z-10 pointer-events-none" />}
            </div>

            {/* Voting Area */}
            <div className="h-24 bg-black/60 border-t border-white/10 flex flex-col items-center justify-center gap-2">
                 <div className="flex gap-4">
                     <button onClick={() => setVotes(v => ({...v, fire: v.fire + 1}))} className="flex flex-col items-center group/btn">
                         <div className="p-3 bg-orange-500/20 rounded-full group-hover/btn:bg-orange-500 transition-colors">
                             <Flame className="w-6 h-6 text-orange-500 group-hover/btn:text-white" />
                         </div>
                         <span className="text-xs font-orbitron mt-1 text-orange-500">{votes.fire}</span>
                     </button>
                     <button onClick={() => setVotes(v => ({...v, skull: v.skull + 1}))} className="flex flex-col items-center group/btn">
                         <div className="p-3 bg-gray-500/20 rounded-full group-hover/btn:bg-gray-500 transition-colors">
                             <Skull className="w-6 h-6 text-gray-400 group-hover/btn:text-white" />
                         </div>
                         <span className="text-xs font-orbitron mt-1 text-gray-400">{votes.skull}</span>
                     </button>
                 </div>
            </div>
        </div>
    );
}

export const MemeTribunal: React.FC = () => {
    const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
    const [template, setTemplate] = useState<MemeTemplate | null>(null);
    const [timeLeft, setTimeLeft] = useState(60);

    const init = async () => {
        setStatus(GameStatus.LOADING);
        const t = await generateMemeTribunalTemplate();
        setTemplate(t);
        setTimeLeft(60);
        setStatus(GameStatus.PLAYING);
    };

    useEffect(() => { init(); }, []);

    useEffect(() => {
        if(status === GameStatus.PLAYING && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && status === GameStatus.PLAYING) {
            setStatus(GameStatus.IDLE); // Voting phase
        }
    }, [status, timeLeft]);

    return (
        <div className="h-full w-full flex flex-col">
            {/* Top Bar */}
            <div className="h-20 border-b border-white/10 bg-black/40 backdrop-blur-md flex justify-between items-center px-8 z-20">
                <h2 className="text-3xl font-orbitron text-neon-pink drop-shadow-[0_0_10px_rgba(255,0,85,0.5)]">
                    MEME TRIBUNAL
                </h2>
                <div className="flex items-center gap-6">
                    <div className="text-right">
                        <p className="text-xs text-gray-400 font-rajdhani uppercase tracking-widest">TOPIC</p>
                        <p className="text-white font-bold text-lg">"{template?.topic}"</p>
                    </div>
                    <div className={`text-4xl font-black font-orbitron w-20 text-center ${timeLeft < 10 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {timeLeft}s
                    </div>
                    {status !== GameStatus.PLAYING && (
                        <button onClick={init} className="bg-neon-blue text-black p-3 rounded-full hover:scale-110 transition">
                            <RefreshCw />
                        </button>
                    )}
                </div>
            </div>

            {/* Columns Container */}
            <div className="flex-1 flex w-full max-w-7xl mx-auto border-x border-white/10 relative">
                <CanvasColumn id={1} color="#000000" isActive={timeLeft > 0} template={template} />
                <CanvasColumn id={2} color="#000000" isActive={timeLeft > 0} template={template} />
                <CanvasColumn id={3} color="#000000" isActive={timeLeft > 0} template={template} />
                
                {status === GameStatus.IDLE && (
                    <motion.div 
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        className="absolute inset-0 pointer-events-none flex items-center justify-center"
                    >
                        <div className="bg-black/90 p-8 rounded-3xl border-2 border-neon-green text-center pointer-events-auto">
                            <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                            <h3 className="text-4xl font-orbitron text-white mb-2">TIME'S UP!</h3>
                            <p className="text-xl text-gray-400 mb-6">Judges, Cast Your Votes!</p>
                            <p className="text-sm text-neon-blue">Use the icons below each drawing</p>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};
