
export enum ViewState {
  HOME = 'HOME',
  NEON_RECALL = 'NEON_RECALL',
  EMOJI_CIPHER = 'EMOJI_CIPHER',
  SPEED_MATCH = 'SPEED_MATCH',
  SYNTAX_SEEKER = 'SYNTAX_SEEKER',
  MEME_GLITCH = 'MEME_GLITCH',
  CRYPTO_CROSS = 'CRYPTO_CROSS',
  DOODLE_CHAOS = 'DOODLE_CHAOS',
  MEME_TRIBUNAL = 'MEME_TRIBUNAL',
  GRAVITY_SORT = 'GRAVITY_SORT',
  FLASHLIGHT_HUNT = 'FLASHLIGHT_HUNT',
}

export interface EmojiPuzzle {
  emojis: string;
  answer: string;
  options: string[]; // Includes the answer + 3 distractors
  category: string;
}

export interface CardItem {
  id: string;
  iconName: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export enum GameStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  PLAYING = 'PLAYING',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
}

export interface TrendItem {
  name: string;
  volume: number;
}

export interface WorldClue {
  description: string;
  clues: string[];
  city: string;
  country: string;
}

export interface DoodlePrompt {
  text: string;
}

export interface WordSearchData {
  topic: string;
  words: string[];
  grid: string[][];
}

export interface MemeTrivia {
  description: string; // "A woman yelling at a white cat at a dinner table"
  answer: string; // "Woman Yelling at Cat"
  options: string[];
}

export interface CrosswordItem {
  clue: string;
  answer: string;
}

export interface CrosswordData {
  theme: string;
  items: CrosswordItem[];
}

// New Games Types

export interface SortItem {
  id: string;
  text: string;
  category: 'LEFT' | 'RIGHT';
}

export interface SortLevel {
  leftCategory: string;
  rightCategory: string;
  items: SortItem[];
}

export interface HiddenObject {
  id: string;
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100
  label: string;
  isFound: boolean;
}

export interface FlashlightLevel {
  topic: string;
  objects: HiddenObject[];
}

export interface MemeTemplate {
  url: string; // URL or placeholder style
  topic: string;
}
