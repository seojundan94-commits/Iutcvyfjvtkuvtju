import { GoogleGenAI } from "@google/genai";
import { GameState, Tower } from '../types';

let ai: GoogleGenAI | null = null;

if (process.env.API_KEY) {
  ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
}

export const getProfessorOakAdvice = async (
  gameState: GameState,
  towers: Tower[]
): Promise<string> => {
  if (!ai) return "Professor Oak is currently offline (Check API Key).";

  const towerSummary = towers.map(t => t.name).join(', ');
  
  const prompt = `
    You are Professor Oak from Pokemon. The player is playing a Tower Defense game.
    
    Current Game State:
    - Wave: ${gameState.wave}
    - Money: ${gameState.money}
    - Lives Left: ${gameState.lives}
    - Player's Pokemon (Towers): ${towerSummary || "None yet"}
    
    Give a short, helpful, and encouraging piece of tactical advice (max 2 sentences) in Korean (Hangul). 
    Focus on type matchups (Fire > Grass, Water > Fire, Grass > Water, Electric is fast) or resource management.
    Be characteristically enthusiastic like Professor Oak.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Keep going, trainer!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Study your type matchups closely!";
  }
};
