
import React, { useRef, useState, useEffect } from 'react';
import { generateDoodlePrompt } from '../services/geminiService';
import { Trash2, Shuffle, PenTool, Download } from 'lucide-react';
import { DoodlePrompt } from '../types';

export const DoodleChaos: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [prompt, setPrompt] = useState<DoodlePrompt | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00f3ff');
  const [lineWidth, setLineWidth] = useState(5);

  const getNewPrompt = async () => {
    const p = await generateDoodlePrompt();
    setPrompt(p);
    clearCanvas();
  };

  useEffect(() => {
    getNewPrompt();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResize = () => {
    if (canvasRef.current && containerRef.current) {
      canvasRef.current.width = containerRef.current.clientWidth;
      canvasRef.current.height = containerRef.current.clientHeight;
    }
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.beginPath();
    }
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const rect = canvasRef.current.getBoundingClientRect();
    let x, y;

    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = (e as React.MouseEvent).clientX - rect.left;
      y = (e as React.MouseEvent).clientY - rect.top;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-6 gap-6 max-w-7xl mx-auto">
      {/* Header / Prompt Bar */}
      <div className="flex justify-between items-center bg-dark-card border border-neon-purple/30 p-6 rounded-2xl shadow-lg backdrop-blur">
        <div className="flex flex-col">
          <span className="text-neon-purple font-orbitron text-sm tracking-widest uppercase">DRAWING TOPIC</span>
          <h2 className="text-3xl font-rajdhani font-bold text-white leading-tight">
            {prompt ? `"${prompt.text}"` : "Loading..."}
          </h2>
        </div>
        <button 
          onClick={getNewPrompt}
          className="flex items-center gap-2 bg-neon-purple hover:bg-purple-500 text-white font-orbitron font-bold px-6 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(188,19,254,0.3)] hover:scale-105"
        >
          <Shuffle className="w-5 h-5" />
          NEW TOPIC
        </button>
      </div>

      {/* Main Workspace */}
      <div className="flex-1 flex gap-6 min-h-0">
        {/* Tools Palette */}
        <div className="w-24 bg-dark-card border border-white/10 rounded-2xl flex flex-col items-center py-6 gap-6 shadow-xl">
          <div className="flex flex-col gap-3 w-full px-2">
            {['#ffffff', '#00f3ff', '#bc13fe', '#0aff00', '#ff0055', '#ffe600'].map(c => (
              <button
                key={c}
                onClick={() => setColor(c)}
                style={{ backgroundColor: c }}
                className={`w-full aspect-square rounded-full transition-transform ${color === c ? 'scale-110 ring-2 ring-white shadow-[0_0_10px_white]' : 'hover:scale-105 opacity-80 hover:opacity-100'}`}
              />
            ))}
          </div>
          
          <div className="h-px w-12 bg-white/20 my-2" />
          
          <div className="flex flex-col gap-4">
             <button onClick={() => setLineWidth(5)} className={`p-2 rounded-lg transition-all ${lineWidth === 5 ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}`}><div className="w-2 h-2 bg-white rounded-full" /></button>
             <button onClick={() => setLineWidth(15)} className={`p-2 rounded-lg transition-all ${lineWidth === 15 ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}`}><div className="w-4 h-4 bg-white rounded-full" /></button>
             <button onClick={() => setLineWidth(30)} className={`p-2 rounded-lg transition-all ${lineWidth === 30 ? 'bg-white/20 scale-110' : 'hover:bg-white/10'}`}><div className="w-6 h-6 bg-white rounded-full" /></button>
          </div>

          <div className="mt-auto flex flex-col gap-4">
             <button onClick={clearCanvas} className="p-3 text-red-500 hover:bg-red-500/20 rounded-xl transition"><Trash2 /></button>
          </div>
        </div>

        {/* Canvas Area */}
        <div ref={containerRef} className="flex-1 bg-white rounded-2xl overflow-hidden cursor-crosshair relative shadow-[0_0_30px_rgba(255,255,255,0.1)] border-4 border-white/10">
           <canvas
             ref={canvasRef}
             onMouseDown={startDrawing}
             onMouseUp={stopDrawing}
             onMouseOut={stopDrawing}
             onMouseMove={draw}
             onTouchStart={startDrawing}
             onTouchEnd={stopDrawing}
             onTouchMove={draw}
             className="touch-none"
           />
           <div className="absolute top-4 right-4 text-black/20 font-orbitron font-bold pointer-events-none select-none text-2xl tracking-widest">
             VORTEX ARTIST
           </div>
        </div>
      </div>
    </div>
  );
};
