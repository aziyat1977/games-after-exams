export enum ViewState {
  HOME = 'HOME',
  NEON_RECALL = 'NEON_RECALL',
  EMOJI_CIPHER = 'EMOJI_CIPHER',
  SPEED_MATCH = 'SPEED_MATCH',
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