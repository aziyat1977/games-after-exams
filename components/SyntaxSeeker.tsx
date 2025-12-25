
import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { generateWordSearchWords } from '../services/geminiService';
import { GameStatus } from '../types';
import { Scan, RefreshCw, CheckCircle } from 'lucide-react';

const GRID_SIZE = 10;

export const SyntaxSeeker: React.FC = () => {
  const [words, setWords] = useState<string[]>([]);
  const [topic, setTopic] = useState("");
  const [grid, setGrid] = useState<string[][]>([]);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [status, setStatus] = useState<GameStatus>(GameStatus.LOADING);
  const [selection, setSelection] = useState<{r: number, c: number}[]>([]);
  const [isSelecting, setIsSelecting] = useState(false);

  // Initialize Game
  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = async () => {
    setStatus(GameStatus.LOADING);
    setFoundWords([]);
    setSelection([]);
    
    // 1. Get words from AI
    const data = await generateWordSearchWords();
    setTopic(data.topic);
    setWords(data.words);

    // 2. Generate Grid locally
    const newGrid = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(''));
    const placedWords: string[] = [];

    // Helper to check if word fits
    const canPlace = (word: string, r: number, c: number, dr: number, dc: number) => {
      if (r + dr * (word.length - 1) < 0 || r + dr * (word.length - 1) >= GRID_SIZE) return false;
      if (c + dc * (word.length - 1) < 0 || c + dc * (word.length - 1) >= GRID_SIZE) return false;
      
      for (let i = 0; i < word.length; i++) {
        const char = newGrid[r + dr * i][c + dc * i];
        if (char !== '' && char !== word[i]) return false;
      }
      return true;
    };

    // Place words
    for (const word of data.words) {
      let placed = false;
      let attempts = 0;
      while (!placed && attempts < 100) {
        const r = Math.floor(Math.random() * GRID_SIZE);
        const c = Math.floor(Math.random() * GRID_SIZE);
        const dirs = [[0, 1], [1, 0], [1, 1], [-1, 1]]; // Horizontal, Vertical, Diagonal
        const dir = dirs[Math.floor(Math.random() * dirs.length)];
        
        if (canPlace(word, r, c, dir[0], dir[1])) {
          for (let i = 0; i < word.length; i++) {
            newGrid[r + dir[0] * i][c + dir[1] * i] = word[i];
          }
          placed = true;
          placedWords.push(word);
        }
        attempts++;
      }
    }

    // Fill empty spots
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        if (newGrid[r][c] === '') {
          newGrid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
        }
      }
    }

    setGrid(newGrid);
    setStatus(GameStatus.PLAYING);
  };

  // Selection Logic
  const handleStart = (r: number, c: number) => {
    if (status !== GameStatus.PLAYING) return;
    setIsSelecting(true);
    setSelection([{r, c}]);
  };

  const handleEnter = (r: number, c: number) => {
    if (!isSelecting) return;
    const start = selection[0];
    
    // Calculate direction
    const dr = r - start.r;
    const dc = c - start.c;
    
    // Determine if it's a straight line
    const steps = Math.max(Math.abs(dr), Math.abs(dc));
    if (steps === 0) return;

    // Check if valid 45 or 90 degree angle
    if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return; 

    const newSelection = [];
    const stepR = dr === 0 ? 0 : dr / steps;
    const stepC = dc === 0 ? 0 : dc / steps;

    for(let i=0; i<=steps; i++) {
      newSelection.push({
        r: start.r + stepR * i,
        c: start.c + stepC * i
      });
    }
    setSelection(newSelection);
  };

  const handleEnd = () => {
    setIsSelecting(false);
    // Check if word exists
    const selectedWord = selection.map(cell => grid[cell.r][cell.c]).join('');
    const reversedWord = selectedWord.split('').reverse().join('');
    
    if (words.includes(selectedWord) && !foundWords.includes(selectedWord)) {
      setFoundWords([...foundWords, selectedWord]);
    } else if (words.includes(reversedWord) && !foundWords.includes(reversedWord)) {
      setFoundWords([...foundWords, reversedWord]);
    }
    setSelection([]);
  };

  // Helper to check if a cell is selected or found
  const getCellStyle = (r: number, c: number) => {
    const isSelected = selection.some(s => s.r === r && s.c === c);
    
    if (isSelected) return "bg-neon-blue text-black shadow-[0_0_15px_#00f3ff]";
    return "bg-white/5 hover:bg-white/10 text-gray-300";
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4" onMouseUp={handleEnd} onTouchEnd={handleEnd}>
      
      {status === GameStatus.LOADING ? (
        <div className="flex flex-col items-center">
          <RefreshCw className="w-16 h-16 text-neon-green animate-spin mb-4" />
          <h2 className="text-2xl font-orbitron">SO'ZLAR YARATILMOQDA...</h2>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-8 items-start max-w-6xl w-full">
          
          {/* Info Panel */}
          <div className="w-full md:w-1/3 bg-dark-card border border-neon-green/30 p-6 rounded-2xl">
            <h2 className="text-neon-green font-orbitron text-xl mb-2 flex items-center gap-2">
              <Scan /> MAVZU: {topic}
            </h2>
            <div className="h-px w-full bg-white/10 my-4" />
            <div className="grid grid-cols-2 gap-3">
              {words.map(word => (
                <div key={word} className={`p-2 rounded font-rajdhani font-bold text-lg transition-all ${foundWords.includes(word) ? 'text-neon-green line-through opacity-50' : 'text-white'}`}>
                  {word}
                </div>
              ))}
            </div>
            {foundWords.length === words.length && (
              <motion.div 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="mt-6 bg-neon-green text-black p-4 rounded-xl font-orbitron font-bold text-center"
              >
                TUGADI! (DONE)
                <button onClick={startNewGame} className="block w-full mt-2 bg-black text-white py-2 rounded-lg text-sm">KEYINGI MAVZU (NEXT)</button>
              </motion.div>
            )}
          </div>

          {/* The Grid */}
          <div className="w-full md:w-2/3 aspect-square max-w-[600px] mx-auto bg-black/40 p-4 rounded-2xl border-2 border-white/10 touch-none select-none">
            <div 
              className="grid gap-1 w-full h-full"
              style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}
            >
              {grid.map((row, r) => (
                row.map((char, c) => (
                  <div
                    key={`${r}-${c}`}
                    onMouseDown={() => handleStart(r, c)}
                    onMouseEnter={() => handleEnter(r, c)}
                    onTouchStart={() => handleStart(r, c)}
                    onTouchMove={(e) => {
                       // Handled by generic touch end logic in parent
                    }}
                    className={`flex items-center justify-center text-xl md:text-2xl font-bold rounded cursor-pointer select-none transition-colors duration-150 ${getCellStyle(r, c)}`}
                  >
                    {char}
                  </div>
                ))
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
