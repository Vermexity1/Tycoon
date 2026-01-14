export interface Upgrade {
  id: string;
  name: string;
  baseCost: number;
  baseIncome: number; // Income per second
  count: number;
  costMultiplier: number;
  description: string;
  icon: string;
  requiredRebirths?: number;
}

export interface GameState {
  money: number;
  totalLifetimeMoney: number;
  rebirths: number;
  prestigeMultiplier: number; // 1.0 is base (no boost)
  upgrades: Record<string, number>; // id -> count
  startTime: number;
  companyName: string;
  manualClicks: number;
  blackjackWins: number;
}

export interface User {
  username: string;
  password: string; // Stored in plain text for this demo simulation
  gameState: GameState;
  isAdmin?: boolean;
}

export interface FloatingText {
  id: number;
  x: number;
  y: number;
  text: string;
}

export interface MarketEvent {
  message: string;
  effect: 'NONE' | 'BOOST' | 'CRASH';
  multiplier: number;
  duration: number; // seconds
}

export type View = 'GAME' | 'LEADERBOARD' | 'STATS' | 'REBIRTH' | 'CASINO';