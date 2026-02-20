
import { GoogleGenAI, Type } from "@google/genai";
import { CalculationResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const calculateAnalogy = async (a: string, b: string, c: string): Promise<CalculationResult> => {
  const prompt = `
    Simulate word vector arithmetic for the following analogy: "${a}" - "${b}" + "${c}" = ?
    
    In a high-dimensional vector space like Word2Vec or GloVe, this arithmetic identifies semantic relationships.
    Provide the most likely resulting words (top 5) with similarity scores between 0 and 1.
    
    Also, generate 2D coordinates (X, Y between -100 and 100) for "${a}", "${b}", "${c}", and the top result.
    Crucially, ensure the coordinates roughly illustrate the parallelogram of vector addition:
    Vector(Result) should be approximately Vector(${a}) - Vector(${b}) + Vector(${c}).
    
    Finally, provide a brief linguistic explanation of why this analogy works.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          results: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                score: { type: Type.NUMBER }
              },
              required: ["word", "score"]
            }
          },
          visualizationPoints: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                word: { type: Type.STRING },
                x: { type: Type.NUMBER },
                y: { type: Type.NUMBER },
                type: { type: Type.STRING, description: "one of 'base', 'subtract', 'add', 'result'" }
              },
              required: ["word", "x", "y", "type"]
            }
          },
          explanation: { type: Type.STRING }
        },
        required: ["results", "visualizationPoints", "explanation"]
      }
    }
  });

  const rawData = JSON.parse(response.text);
  return {
    formula: { a, b, c },
    ...rawData
  };
};
