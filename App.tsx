import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Coordinates, Enemy, Tower, GameState, ElementType, Projectile } from './types';
import { GRID_SIZE, CELL_SIZE, PATH_COORDINATES, TOWER_TYPES, INITIAL_MONEY, INITIAL_LIVES, FPS, TYPE_CHART } from './constants';
import { GridCell } from './components/GridCell';
import { ProfessorOak } from './components/ProfessorOak';

const App: React.FC = () => {
  // Game State
  const [gameState, setGameState] = useState<GameState>({
    money: INITIAL_MONEY,
    lives: INITIAL_LIVES,
    wave: 0,
    isPlaying: false,
    isGameOver: false,
    gameSpeed: 1,
  });

  const [towers, setTowers] = useState<Tower[]>([]);
  const [enemies, setEnemies] = useState<Enemy[]>([]);
  const [projectiles, setProjectiles] = useState<Projectile[]>([]);
  const [selectedTowerKey, setSelectedTowerKey] = useState<string | null>(null);

  // Refs for loop logic to avoid closure staleness
  const gameStateRef = useRef(gameState);
  const towersRef = useRef(towers);
  const enemiesRef = useRef(enemies);
  const projectilesRef = useRef(projectiles);
  
  // Wave Management
  const waveActiveRef = useRef(false);
  const enemiesToSpawnRef = useRef<Enemy[]>([]);
  const spawnTimerRef = useRef(0);

  // Sync refs
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { towersRef.current = towers; }, [towers]);
  useEffect(() => { enemiesRef.current = enemies; }, [enemies]);
  useEffect(() => { projectilesRef.current = projectiles; }, [projectiles]);

  // --- Game Logic Helpers ---

  const calculateDamage = useCallback((towerType: ElementType, enemyType: ElementType, baseDamage: number) => {
    const strongAgainst = TYPE_CHART[towerType];
    if (strongAgainst.includes(enemyType)) return baseDamage * 2;
    // Simple weakness check (reverse lookup)
    const weakAgainst = TYPE_CHART[enemyType];
    if (weakAgainst && weakAgainst.includes(towerType)) return baseDamage * 0.5;
    return baseDamage;
  }, []);

  const spawnWave = (waveNumber: number) => {
    const enemyCount = 5 + Math.floor(waveNumber * 1.5);
    const newEnemies: Enemy[] = [];
    
    // Determine wave type based on number
    let waveType = ElementType.NORMAL;
    const types = Object.values(ElementType);
    if (waveNumber > 1) {
       waveType = types[(waveNumber) % types.length];
    }

    const hpMultiplier = 1 + (waveNumber * 0.4);

    for (let i = 0; i < enemyCount; i++) {
        newEnemies.push({
            id: `e-${waveNumber}-${i}`,
            type: waveType,
            hp: 20 * hpMultiplier,
            maxHp: 20 * hpMultiplier,
            speed: 1.5 + (waveNumber * 0.05),
            position: { ...PATH_COORDINATES[0] },
            pathIndex: 0,
            frozen: 0,
            name: `Shadow ${waveType}`,
            reward: 10 + waveNumber
        });
    }
    enemiesToSpawnRef.current = newEnemies;
    waveActiveRef.current = true;
    setGameState(prev => ({ ...prev, wave: waveNumber, isPlaying: true }));
  };

  const handleStartNextWave = () => {
    if (waveActiveRef.current || enemies.length > 0) return;
    spawnWave(gameState.wave + 1);
  };

  const handlePlaceTower = (x: number, y: number) => {
    if (!selectedTowerKey || gameState.isGameOver) return;
    
    const config = TOWER_TYPES[selectedTowerKey];
    if (gameState.money < config.cost) return;

    // Check collision with path
    const isPath = PATH_COORDINATES.some(c => c.x === x && c.y === y);
    if (isPath) return;

    // Check collision with existing towers
    const hasTower = towers.some(t => t.x === x && t.y === y);
    if (hasTower) return;

    const newTower: Tower = {
        id: `t-${Date.now()}`,
        ...config,
        x,
        y,
        lastAttackTime: 0,
        level: 1
    };

    setTowers(prev => [...prev, newTower]);
    setGameState(prev => ({ ...prev, money: prev.money - config.cost }));
    setSelectedTowerKey(null); // Deselect after placement
  };

  // --- Main Game Loop ---
  useEffect(() => {
    if (gameState.isGameOver) return;

    let lastTime = performance.now();
    let frameId: number;

    const loop = (time: number) => {
        const deltaTime = time - lastTime;
        lastTime = time;

        // Start with current enemies state
        let activeEnemies = [...enemiesRef.current];

        // 1. Spawning Logic
        if (waveActiveRef.current && enemiesToSpawnRef.current.length > 0) {
            spawnTimerRef.current += deltaTime;
            if (spawnTimerRef.current > 1000) { // Spawn every second
                const nextEnemy = enemiesToSpawnRef.current.shift();
                if (nextEnemy) {
                    activeEnemies.push(nextEnemy);
                }
                spawnTimerRef.current = 0;
            }
        } else if (waveActiveRef.current && enemiesToSpawnRef.current.length === 0) {
             waveActiveRef.current = false;
        }

        // 2. Update Enemies (Movement)
        let livesLost = 0;
        let moneyGained = 0;

        const movedEnemies = activeEnemies.map(e => {
            // Movement logic
            const currentSpeed = e.frozen > 0 ? e.speed * 0.5 : e.speed;
            const moveAmt = (currentSpeed * deltaTime) / 1000; // units per second
            
            // Move towards next path node
            if (e.pathIndex < PATH_COORDINATES.length - 1) {
                const target = PATH_COORDINATES[e.pathIndex + 1];
                const dx = target.x - e.position.x;
                const dy = target.y - e.position.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist <= moveAmt) {
                    // Reached node
                    return {
                        ...e,
                        position: { ...target },
                        pathIndex: e.pathIndex + 1,
                        frozen: Math.max(0, e.frozen - deltaTime)
                    };
                } else {
                    // Move partial
                    const angle = Math.atan2(dy, dx);
                    return {
                        ...e,
                        position: {
                            x: e.position.x + Math.cos(angle) * moveAmt,
                            y: e.position.y + Math.sin(angle) * moveAmt
                        },
                        frozen: Math.max(0, e.frozen - deltaTime)
                    };
                }
            }
            return e;
        });

        // Check if reached end or died
        const survivingEnemies: Enemy[] = [];
        movedEnemies.forEach(e => {
            if (e.pathIndex >= PATH_COORDINATES.length - 1) {
                livesLost++;
            } else if (e.hp > 0) {
                survivingEnemies.push(e);
            } else {
                moneyGained += e.reward;
            }
        });

        if (livesLost > 0 || moneyGained > 0) {
            setGameState(prev => {
                const newLives = prev.lives - livesLost;
                return {
                    ...prev,
                    lives: newLives,
                    money: prev.money + moneyGained,
                    isGameOver: newLives <= 0
                };
            });
            // Stop loop if dead
            if (gameStateRef.current.lives - livesLost <= 0) return; 
        }

        // 3. Towers Attack
        const currentTowers = towersRef.current;
        const newProjectiles: Projectile[] = [...projectilesRef.current];
        const now = Date.now();

        currentTowers.forEach(tower => {
            if (now - tower.lastAttackTime >= tower.attackSpeed) {
                // Find target in survivingEnemies
                const target = survivingEnemies.find(e => {
                    const dist = Math.sqrt(Math.pow(e.position.x - tower.x, 2) + Math.pow(e.position.y - tower.y, 2));
                    return dist <= tower.range;
                });

                if (target) {
                    tower.lastAttackTime = now;
                    // Apply damage directly to the object we are about to set
                    target.hp -= calculateDamage(tower.type, target.type, tower.damage);
                    
                    if (tower.type === ElementType.WATER || tower.type === ElementType.ICE) {
                        target.frozen = 2000; // 2s slow
                    }

                    // Visual Projectile
                    newProjectiles.push({
                        id: `p-${now}-${Math.random()}`,
                        startX: tower.x,
                        startY: tower.y,
                        targetX: target.position.x,
                        targetY: target.position.y,
                        element: tower.type,
                        progress: 0
                    });
                }
            }
        });

        // 4. Update Projectiles (Purely visual cleanup)
        const activeProjectiles = newProjectiles
            .map(p => ({ ...p, progress: p.progress + (deltaTime * 0.005) })) // fast animation
            .filter(p => p.progress < 1);

        setEnemies(survivingEnemies);
        setProjectiles(activeProjectiles);
        
        frameId = requestAnimationFrame(loop);
    };

    frameId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameId);
  }, [gameState.isGameOver, calculateDamage]); // Run effect when game over state changes to stop/start

  // --- Render Helpers ---

  const renderGrid = () => {
    const grid = [];
    for (let y = 0; y < GRID_SIZE; y++) {
      const row = [];
      for (let x = 0; x < GRID_SIZE; x++) {
        const isPath = PATH_COORDINATES.some(c => c.x === x && c.y === y);
        const tower = towers.find(t => t.x === x && t.y === y);
        row.push(
          <div key={`${x}-${y}`} style={{ width: CELL_SIZE, height: CELL_SIZE }}>
            <GridCell
              x={x} y={y}
              isPath={isPath}
              tower={tower}
              isValidPlacement={!!selectedTowerKey}
              onPlace={handlePlaceTower}
            />
          </div>
        );
      }
      grid.push(<div key={y} className="flex">{row}</div>);
    }
    return grid;
  };

  const getProjectileColor = (type: ElementType) => {
    switch(type) {
        case ElementType.FIRE: return 'bg-red-500';
        case ElementType.WATER: return 'bg-blue-500';
        case ElementType.GRASS: return 'bg-green-500';
        case ElementType.ELECTRIC: return 'bg-yellow-400';
        case ElementType.ICE: return 'bg-cyan-300';
        case ElementType.FIGHTING: return 'bg-orange-600';
        case ElementType.PSYCHIC: return 'bg-pink-400';
        case ElementType.ROCK: return 'bg-stone-500';
        case ElementType.GHOST: return 'bg-indigo-700';
        case ElementType.DRAGON: return 'bg-violet-600';
        default: return 'bg-gray-400';
    }
  };

  const getEnemyColor = (type: ElementType) => {
    switch(type) {
        case ElementType.FIRE: return '#ef4444';
        case ElementType.WATER: return '#3b82f6';
        case ElementType.GRASS: return '#22c55e';
        case ElementType.ELECTRIC: return '#facc15';
        case ElementType.ICE: return '#67e8f9';
        case ElementType.FIGHTING: return '#ea580c';
        case ElementType.PSYCHIC: return '#ec4899';
        case ElementType.ROCK: return '#78716c';
        case ElementType.GHOST: return '#4338ca';
        case ElementType.DRAGON: return '#7c3aed';
        default: return '#a3a3a3';
    }
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col font-sans text-slate-800 overflow-hidden">
      
      {/* Header */}
      <header className="bg-red-600 text-white p-3 shadow-md flex justify-between items-center shrink-0 z-10">
        <h1 className="text-xl font-bold tracking-tight">PokeDefense AI</h1>
        <div className="flex gap-4 text-sm font-semibold">
           <div className="bg-red-700 px-3 py-1 rounded">Wave: {gameState.wave}</div>
           <div className="bg-red-700 px-3 py-1 rounded">Lives: {gameState.lives}</div>
           <div className="bg-yellow-500 text-red-900 px-3 py-1 rounded">Money: ${gameState.money}</div>
        </div>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row h-full overflow-hidden">
        
        {/* Left: Game Board (Scrollable if screen too small, otherwise centered) */}
        <div className="flex-grow relative bg-slate-200 overflow-auto flex items-center justify-center p-4">
            <div className="relative bg-white p-2 rounded-xl shadow-xl border-4 border-slate-300 select-none">
                
                {gameState.isGameOver && (
                    <div className="absolute inset-0 z-50 bg-black/70 flex flex-col items-center justify-center text-white rounded-lg">
                        <h2 className="text-4xl font-bold mb-4">Game Over</h2>
                        <p className="mb-6 text-xl">You survived {gameState.wave - 1} waves</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition"
                        >
                            Try Again
                        </button>
                    </div>
                )}

                {/* Grid */}
                <div className="relative">
                    {renderGrid()}
                    
                    {/* Enemies Layer */}
                    {enemies.map(e => (
                        <div
                            key={e.id}
                            className="absolute w-6 h-6 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-[10px] font-bold text-white transition-transform z-10"
                            style={{
                                left: e.position.x * CELL_SIZE + 13, // center offset
                                top: e.position.y * CELL_SIZE + 13,
                                backgroundColor: getEnemyColor(e.type)
                            }}
                        >
                            <div className="absolute -top-3 w-8 h-1 bg-gray-300 rounded overflow-hidden">
                                <div 
                                    className="h-full bg-green-500" 
                                    style={{ width: `${(e.hp / e.maxHp) * 100}%` }}
                                />
                            </div>
                            {e.name[0]}
                        </div>
                    ))}

                    {/* Projectiles Layer */}
                    {projectiles.map(p => (
                        <div
                            key={p.id}
                            className={`absolute w-3 h-3 rounded-full z-20 ${getProjectileColor(p.element)}`}
                            style={{
                                left: (p.startX + (p.targetX - p.startX) * p.progress) * CELL_SIZE + 20,
                                top: (p.startY + (p.targetY - p.startY) * p.progress) * CELL_SIZE + 20,
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>

        {/* Right: Controls & AI */}
        <div className="w-full lg:w-[450px] bg-white shadow-xl flex flex-col border-l border-slate-200 h-1/2 lg:h-full shrink-0">
            
            {/* AI Advisor - Fixed at top of panel */}
            <div className="p-4 bg-slate-50 border-b border-slate-200">
                <ProfessorOak gameState={gameState} towers={towers} />
            </div>

            {/* Controls - Scrollable */}
            <div className="flex-grow overflow-y-auto p-4 custom-scrollbar">
                
                <button
                    onClick={handleStartNextWave}
                    disabled={waveActiveRef.current || enemies.length > 0 || gameState.isGameOver}
                    className="w-full mb-4 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-3 rounded-lg shadow transition sticky top-0 z-10"
                >
                    {gameState.wave === 0 ? "Start Game" : "Next Wave"}
                </button>

                {selectedTowerKey && (
                    <div className="mb-4 text-xs bg-blue-50 border border-blue-200 p-3 rounded text-blue-800 sticky top-[60px] z-10 shadow-sm">
                        <div className="flex justify-between font-bold mb-1">
                            <span>{TOWER_TYPES[selectedTowerKey].name}</span>
                            <span>${TOWER_TYPES[selectedTowerKey].cost}</span>
                        </div>
                        <div>{TOWER_TYPES[selectedTowerKey].description}</div>
                        <div className="mt-1 text-[10px] uppercase font-semibold text-blue-400">
                            Type: {TOWER_TYPES[selectedTowerKey].type}
                        </div>
                    </div>
                )}

                <h3 className="font-bold text-lg mb-3 pb-2 border-b">Recruit Pokemon</h3>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    {Object.entries(TOWER_TYPES).map(([key, config]) => (
                        <button
                            key={key}
                            onClick={() => setSelectedTowerKey(selectedTowerKey === key ? null : key)}
                            disabled={gameState.money < config.cost}
                            className={`
                                flex flex-col items-center justify-center p-2 rounded-lg border transition aspect-square
                                ${selectedTowerKey === key ? 'border-red-500 bg-red-50 ring-2 ring-red-200' : 'border-slate-200 hover:border-slate-400'}
                                ${gameState.money < config.cost ? 'opacity-40 grayscale cursor-not-allowed' : ''}
                            `}
                            title={`${config.name} - $${config.cost}`}
                        >
                            <div className={`w-8 h-8 rounded-full mb-1 ${config.color} text-white flex items-center justify-center font-bold text-xs shadow-sm`}>
                                {config.name[0]}
                            </div>
                            <span className="font-bold text-[10px] truncate w-full text-center">{config.name}</span>
                            <span className="text-[10px] text-slate-500 font-mono">${config.cost}</span>
                        </button>
                    ))}
                </div>

                {/* Legend */}
                <div className="bg-slate-100 rounded-lg p-3 text-xs text-slate-500 mt-4">
                    <h4 className="font-bold mb-2 text-slate-700">Type Tips</h4>
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                        <div>🔥 Fire {'>'} 🌿 Grass</div>
                        <div>💧 Water {'>'} 🔥 Fire</div>
                        <div>🌿 Grass {'>'} 💧 Water</div>
                        <div>⚡ Elec {'>'} 💧 Water</div>
                        <div>❄️ Ice {'>'} 🐲 Dragon</div>
                        <div>👊 Fight {'>'} 🪨 Rock</div>
                        <div>🔮 Psych {'>'} 👊 Fight</div>
                        <div>👻 Ghost {'>'} 🔮 Psych</div>
                    </div>
                </div>
            </div>
        </div>

      </main>
    </div>
  );
};

export default App;