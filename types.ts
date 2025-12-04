export enum ElementType {
  NORMAL = 'Normal',
  FIRE = 'Fire',
  WATER = 'Water',
  GRASS = 'Grass',
  ELECTRIC = 'Electric',
  ICE = 'Ice',
  FIGHTING = 'Fighting',
  PSYCHIC = 'Psychic',
  ROCK = 'Rock',
  GHOST = 'Ghost',
  DRAGON = 'Dragon'
}

export interface Coordinates {
  x: number;
  y: number;
}

export interface Enemy {
  id: string;
  type: ElementType;
  hp: number;
  maxHp: number;
  speed: number;
  position: Coordinates; // Percentage along the path (0 to 100) or grid index
  pathIndex: number; // Current target path node index
  frozen: number; // Duration of slow effect
  name: string;
  reward: number;
}

export interface Tower {
  id: string;
  type: ElementType;
  name: string;
  x: number;
  y: number;
  damage: number;
  range: number;
  attackSpeed: number; // Cooldown in ms
  lastAttackTime: number;
  level: number;
  cost: number;
}

export interface Projectile {
  id: string;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  element: ElementType;
  progress: number; // 0 to 1
}

export interface GameState {
  money: number;
  lives: number;
  wave: number;
  isPlaying: boolean;
  isGameOver: boolean;
  gameSpeed: number;
}

export interface TowerConfig {
  name: string;
  type: ElementType;
  cost: number;
  damage: number;
  range: number;
  attackSpeed: number;
  color: string;
  description: string;
}