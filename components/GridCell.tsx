import React from 'react';
import { ElementType, Tower } from '../types';

interface GridCellProps {
  x: number;
  y: number;
  isPath: boolean;
  tower?: Tower;
  isValidPlacement: boolean;
  onPlace: (x: number, y: number) => void;
}

export const GridCell: React.FC<GridCellProps> = ({ 
  x, 
  y, 
  isPath, 
  tower, 
  isValidPlacement,
  onPlace 
}) => {
  const handleClick = () => {
    if (!tower && !isPath) {
      onPlace(x, y);
    }
  };

  let bgColor = 'bg-gray-100';
  let borderColor = 'border-gray-200';
  
  if (isPath) {
    bgColor = 'bg-amber-100';
    borderColor = 'border-amber-200';
  } else if (tower) {
    // Background based on type
    switch (tower.type) {
        case ElementType.FIRE: bgColor = 'bg-red-100'; break;
        case ElementType.WATER: bgColor = 'bg-blue-100'; break;
        case ElementType.GRASS: bgColor = 'bg-green-100'; break;
        case ElementType.ELECTRIC: bgColor = 'bg-yellow-100'; break;
        case ElementType.ICE: bgColor = 'bg-cyan-100'; break;
        case ElementType.FIGHTING: bgColor = 'bg-orange-100'; break;
        case ElementType.PSYCHIC: bgColor = 'bg-pink-100'; break;
        case ElementType.ROCK: bgColor = 'bg-stone-300'; break;
        case ElementType.GHOST: bgColor = 'bg-purple-200'; break;
        case ElementType.DRAGON: bgColor = 'bg-indigo-100'; break;
        default: bgColor = 'bg-gray-200';
    }
  }

  const getTowerColor = (type: ElementType) => {
    switch(type) {
      case ElementType.FIRE: return 'bg-red-500';
      case ElementType.WATER: return 'bg-blue-500';
      case ElementType.GRASS: return 'bg-green-500';
      case ElementType.ELECTRIC: return 'bg-yellow-400';
      case ElementType.ICE: return 'bg-cyan-400';
      case ElementType.FIGHTING: return 'bg-orange-600';
      case ElementType.PSYCHIC: return 'bg-pink-500';
      case ElementType.ROCK: return 'bg-stone-600';
      case ElementType.GHOST: return 'bg-indigo-800';
      case ElementType.DRAGON: return 'bg-violet-600';
      case ElementType.NORMAL: return 'bg-stone-400';
      default: return 'bg-gray-500';
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        w-full h-full border ${borderColor} ${bgColor} 
        relative flex items-center justify-center
        ${!isPath && !tower ? 'hover:bg-gray-200 cursor-pointer' : ''}
        transition-colors duration-200
      `}
    >
      {tower && (
        <div className={`w-3/4 h-3/4 rounded-full shadow-md flex items-center justify-center font-bold text-xs text-white ${getTowerColor(tower.type)}`}>
          {tower.name.substring(0, 1)}
        </div>
      )}
      
      {/* Visual indicator for placement validity on hover could go here */}
    </div>
  );
};