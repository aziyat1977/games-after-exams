
export enum ViewState {
  HOME = 'HOME',
  NEON_RECALL = 'NEON_RECALL',
  EMOJI_CIPHER = 'EMOJI_CIPHER',
  SPEED_MATCH = 'SPEED_MATCH',
  SYNTAX_SEEKER = 'SYNTAX_SEEKER',
  MEME_GLITCH = 'MEME_GLITCH',
  CRYPTO_CROSS = 'CRYPTO_CROSS',
  DOODLE_CHAOS = 'DOODLE_CHAOS',
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
