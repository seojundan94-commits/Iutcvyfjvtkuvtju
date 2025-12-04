import React, { useState, useEffect } from 'react';
import { getProfessorOakAdvice } from '../services/geminiService';
import { GameState, Tower } from '../types';

interface Props {
  gameState: GameState;
  towers: Tower[];
}

export const ProfessorOak: React.FC<Props> = ({ gameState, towers }) => {
  const [advice, setAdvice] = useState<string>("Welcome to the world of Pokemon Defense! Prepare your defenses!");
  const [loading, setLoading] = useState(false);

  // Get advice when wave changes or game starts
  useEffect(() => {
    if (gameState.wave > 0) {
      fetchAdvice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.wave]);

  const fetchAdvice = async () => {
    setLoading(true);
    const newAdvice = await getProfessorOakAdvice(gameState, towers);
    setAdvice(newAdvice);
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-lg border-2 border-slate-200 flex flex-col gap-2">
      <div className="flex items-center gap-3 border-b pb-2 mb-1">
        <div className="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center overflow-hidden border-2 border-slate-400">
             {/* Simple Avatar Placeholder */}
            <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-slate-600" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        </div>
        <div>
            <h3 className="font-bold text-slate-800">Professor Oak (AI)</h3>
            <span className="text-xs text-slate-500">Gemini 2.5 Flash</span>
        </div>
      </div>
      
      <div className="min-h-[60px] text-sm text-slate-700 italic relative">
        {loading ? (
            <div className="flex items-center gap-2 text-slate-400 animate-pulse">
                <span>Thinking...</span>
            </div>
        ) : (
            `"${advice}"`
        )}
      </div>

      <button 
        onClick={fetchAdvice}
        disabled={loading}
        className="self-end text-xs text-blue-600 hover:text-blue-800 underline disabled:opacity-50"
      >
        Ask again
      </button>
    </div>
  );
};
