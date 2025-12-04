import { Coordinates, ElementType, TowerConfig } from './types';

export const GRID_SIZE = 12; // 12x12 grid
export const CELL_SIZE = 50; // Visual size mainly

// A simple winding path coordinates (x, y) on the 12x12 grid
export const PATH_COORDINATES: Coordinates[] = [
  { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
  { x: 3, y: 2 }, { x: 3, y: 3 }, { x: 2, y: 3 }, { x: 1, y: 3 },
  { x: 1, y: 4 }, { x: 1, y: 5 }, { x: 1, y: 6 }, { x: 2, y: 6 },
  { x: 3, y: 6 }, { x: 4, y: 6 }, { x: 5, y: 6 }, { x: 6, y: 6 },
  { x: 6, y: 5 }, { x: 6, y: 4 }, { x: 7, y: 4 }, { x: 8, y: 4 },
  { x: 9, y: 4 }, { x: 9, y: 5 }, { x: 9, y: 6 }, { x: 9, y: 7 },
  { x: 9, y: 8 }, { x: 8, y: 8 }, { x: 7, y: 8 }, { x: 6, y: 8 },
  { x: 5, y: 8 }, { x: 4, y: 8 }, { x: 4, y: 9 }, { x: 4, y: 10 },
  { x: 5, y: 10 }, { x: 6, y: 10 }, { x: 7, y: 10 }, { x: 8, y: 10 },
  { x: 9, y: 10 }, { x: 10, y: 10 }, { x: 11, y: 10 }
];

export const TOWER_TYPES: Record<string, TowerConfig> = {
  // --- STARTERS & BASICS ---
  CHARMANDER: {
    name: 'Charmander',
    type: ElementType.FIRE,
    cost: 50,
    damage: 20,
    range: 2.5,
    attackSpeed: 800,
    color: 'bg-red-500',
    description: 'High damage, effective against Grass.'
  },
  SQUIRTLE: {
    name: 'Squirtle',
    type: ElementType.WATER,
    cost: 60,
    damage: 10,
    range: 3,
    attackSpeed: 1000,
    color: 'bg-blue-500',
    description: 'Slows enemies, effective against Fire.'
  },
  BULBASAUR: {
    name: 'Bulbasaur',
    type: ElementType.GRASS,
    cost: 45,
    damage: 15,
    range: 3.5,
    attackSpeed: 1200,
    color: 'bg-green-500',
    description: 'Long range, effective against Water.'
  },
  PIKACHU: {
    name: 'Pikachu',
    type: ElementType.ELECTRIC,
    cost: 100,
    damage: 12,
    range: 2.5,
    attackSpeed: 400,
    color: 'bg-yellow-400',
    description: 'Very fast attack speed.'
  },
  
  // --- NORMAL ---
  PIDGEY: {
    name: 'Pidgey',
    type: ElementType.NORMAL,
    cost: 30,
    damage: 8,
    range: 4,
    attackSpeed: 900,
    color: 'bg-stone-400',
    description: 'Cheap, long range scout.'
  },
  RATTATA: {
    name: 'Rattata',
    type: ElementType.NORMAL,
    cost: 25,
    damage: 10,
    range: 2,
    attackSpeed: 700,
    color: 'bg-purple-300',
    description: 'Very cheap, short range.'
  },
  MEOWTH: {
    name: 'Meowth',
    type: ElementType.NORMAL,
    cost: 120,
    damage: 15,
    range: 2.5,
    attackSpeed: 600,
    color: 'bg-amber-200',
    description: 'Pay Day: Decent speed and damage.'
  },
  SNORLAX: {
    name: 'Snorlax',
    type: ElementType.NORMAL,
    cost: 400,
    damage: 100,
    range: 2,
    attackSpeed: 2000,
    color: 'bg-blue-900',
    description: 'Massive damage, very slow attack.'
  },
  EEVEE: {
    name: 'Eevee',
    type: ElementType.NORMAL,
    cost: 80,
    damage: 18,
    range: 3,
    attackSpeed: 800,
    color: 'bg-orange-300',
    description: 'Balanced adaptability.'
  },

  // --- FIRE ---
  VULPIX: {
    name: 'Vulpix',
    type: ElementType.FIRE,
    cost: 90,
    damage: 25,
    range: 3,
    attackSpeed: 900,
    color: 'bg-red-400',
    description: 'Burns targets effectively.'
  },
  ARCANINE: {
    name: 'Arcanine',
    type: ElementType.FIRE,
    cost: 350,
    damage: 60,
    range: 2.5,
    attackSpeed: 500,
    color: 'bg-orange-500',
    description: 'Legendary speed and power.'
  },
  MAGMAR: {
    name: 'Magmar',
    type: ElementType.FIRE,
    cost: 200,
    damage: 45,
    range: 3,
    attackSpeed: 1100,
    color: 'bg-red-600',
    description: 'Heavy fire damage.'
  },
  CHARIZARD: {
    name: 'Charizard',
    type: ElementType.FIRE,
    cost: 600,
    damage: 150,
    range: 4,
    attackSpeed: 1500,
    color: 'bg-orange-600',
    description: 'Ultimate Fire power.'
  },

  // --- WATER ---
  PSYDUCK: {
    name: 'Psyduck',
    type: ElementType.WATER,
    cost: 70,
    damage: 15,
    range: 3,
    attackSpeed: 900,
    color: 'bg-cyan-400',
    description: 'Confusingly effective.'
  },
  GYARADOS: {
    name: 'Gyarados',
    type: ElementType.WATER,
    cost: 500,
    damage: 90,
    range: 4.5,
    attackSpeed: 1200,
    color: 'bg-blue-700',
    description: 'Rampaging destruction.'
  },
  STARMIE: {
    name: 'Starmie',
    type: ElementType.WATER,
    cost: 220,
    damage: 30,
    range: 3.5,
    attackSpeed: 400,
    color: 'bg-violet-600',
    description: 'Rapid spin attacks.'
  },
  LAPRAS: {
    name: 'Lapras',
    type: ElementType.ICE, // Changed to Ice for variety
    cost: 300,
    damage: 40,
    range: 4,
    attackSpeed: 1300,
    color: 'bg-cyan-500',
    description: 'Ice beam freezes enemies.'
  },

  // --- GRASS ---
  ODDISH: {
    name: 'Oddish',
    type: ElementType.GRASS,
    cost: 40,
    damage: 12,
    range: 3,
    attackSpeed: 1000,
    color: 'bg-green-700',
    description: 'Basic grass support.'
  },
  EXEGGUTOR: {
    name: 'Exeggutor',
    type: ElementType.GRASS,
    cost: 250,
    damage: 55,
    range: 3.5,
    attackSpeed: 1400,
    color: 'bg-yellow-700',
    description: 'Psychic grass power.'
  },
  SCYTHER: {
    name: 'Scyther',
    type: ElementType.GRASS,
    cost: 180,
    damage: 35,
    range: 1.5,
    attackSpeed: 300,
    color: 'bg-green-400',
    description: 'Extremely fast melee cuts.'
  },

  // --- ELECTRIC ---
  MAGNEMITE: {
    name: 'Magnemite',
    type: ElementType.ELECTRIC,
    cost: 110,
    damage: 20,
    range: 3.5,
    attackSpeed: 800,
    color: 'bg-gray-400',
    description: 'Consistent electric shocks.'
  },
  ELECTABUZZ: {
    name: 'Electabuzz',
    type: ElementType.ELECTRIC,
    cost: 230,
    damage: 40,
    range: 3,
    attackSpeed: 600,
    color: 'bg-yellow-500',
    description: 'Thunder puncher.'
  },
  JOLTEON: {
    name: 'Jolteon',
    type: ElementType.ELECTRIC,
    cost: 280,
    damage: 25,
    range: 3,
    attackSpeed: 200,
    color: 'bg-yellow-300',
    description: 'Lightning fast attacks.'
  },

  // --- PSYCHIC ---
  ABRA: {
    name: 'Abra',
    type: ElementType.PSYCHIC,
    cost: 150,
    damage: 35,
    range: 5,
    attackSpeed: 1500,
    color: 'bg-pink-400',
    description: 'Long range psychic blasts.'
  },
  ALAKAZAM: {
    name: 'Alakazam',
    type: ElementType.PSYCHIC,
    cost: 450,
    damage: 120,
    range: 4,
    attackSpeed: 1000,
    color: 'bg-pink-600',
    description: 'Master of psychic power.'
  },
  MEWTWO: {
    name: 'Mewtwo',
    type: ElementType.PSYCHIC,
    cost: 1000,
    damage: 300,
    range: 5,
    attackSpeed: 1200,
    color: 'bg-purple-200',
    description: 'The ultimate genetic Pokemon.'
  },

  // --- FIGHTING ---
  MACHOP: {
    name: 'Machop',
    type: ElementType.FIGHTING,
    cost: 60,
    damage: 18,
    range: 1.5,
    attackSpeed: 700,
    color: 'bg-orange-700',
    description: 'Strong melee punches.'
  },
  HITMONLEE: {
    name: 'Hitmonlee',
    type: ElementType.FIGHTING,
    cost: 190,
    damage: 45,
    range: 2,
    attackSpeed: 800,
    color: 'bg-amber-800',
    description: 'The Kicking Demon.'
  },

  // --- ROCK ---
  GEODUDE: {
    name: 'Geodude',
    type: ElementType.ROCK,
    cost: 50,
    damage: 25,
    range: 2,
    attackSpeed: 1500,
    color: 'bg-stone-500',
    description: 'Slow but hits hard.'
  },
  ONIX: {
    name: 'Onix',
    type: ElementType.ROCK,
    cost: 160,
    damage: 30,
    range: 4,
    attackSpeed: 1800,
    color: 'bg-stone-600',
    description: 'Large range rock throws.'
  },

  // --- GHOST ---
  GASTLY: {
    name: 'Gastly',
    type: ElementType.GHOST,
    cost: 130,
    damage: 20,
    range: 3.5,
    attackSpeed: 900,
    color: 'bg-indigo-900',
    description: 'Spooky spectral attacks.'
  },
  GENGAR: {
    name: 'Gengar',
    type: ElementType.GHOST,
    cost: 380,
    damage: 85,
    range: 3,
    attackSpeed: 700,
    color: 'bg-purple-800',
    description: 'Shadow ball barrage.'
  },

  // --- ICE ---
  JYNX: {
    name: 'Jynx',
    type: ElementType.ICE,
    cost: 210,
    damage: 50,
    range: 3,
    attackSpeed: 1100,
    color: 'bg-fuchsia-700',
    description: 'Freezing kisses.'
  },
  ARTICUNO: {
    name: 'Articuno',
    type: ElementType.ICE,
    cost: 700,
    damage: 180,
    range: 5,
    attackSpeed: 1500,
    color: 'bg-sky-300',
    description: 'Legendary Ice Bird.'
  },

  // --- DRAGON ---
  DRATINI: {
    name: 'Dratini',
    type: ElementType.DRAGON,
    cost: 200,
    damage: 30,
    range: 3,
    attackSpeed: 800,
    color: 'bg-indigo-400',
    description: 'Small dragon rage.'
  },
  DRAGONITE: {
    name: 'Dragonite',
    type: ElementType.DRAGON,
    cost: 800,
    damage: 200,
    range: 4,
    attackSpeed: 1000,
    color: 'bg-orange-200',
    description: 'Hyper Beam destruction.'
  }
};

export const INITIAL_MONEY = 150;
export const INITIAL_LIVES = 20;
export const FPS = 60;

export const TYPE_CHART: Record<ElementType, ElementType[]> = {
  [ElementType.NORMAL]: [],
  [ElementType.FIRE]: [ElementType.GRASS, ElementType.ICE],
  [ElementType.WATER]: [ElementType.FIRE, ElementType.ROCK],
  [ElementType.GRASS]: [ElementType.WATER, ElementType.ROCK],
  [ElementType.ELECTRIC]: [ElementType.WATER], 
  [ElementType.ICE]: [ElementType.GRASS, ElementType.DRAGON],
  [ElementType.FIGHTING]: [ElementType.NORMAL, ElementType.ICE, ElementType.ROCK],
  [ElementType.PSYCHIC]: [ElementType.FIGHTING],
  [ElementType.ROCK]: [ElementType.FIRE, ElementType.ICE],
  [ElementType.GHOST]: [ElementType.PSYCHIC, ElementType.GHOST],
  [ElementType.DRAGON]: [ElementType.DRAGON]
};