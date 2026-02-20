
export interface VectorPoint {
  word: string;
  x: number;
  y: number;
  type: 'base' | 'subtract' | 'add' | 'result';
}

export interface AnalogyResult {
  word: string;
  score: number;
}

export interface CalculationResult {
  formula: {
    a: string;
    b: string;
    c: string;
  };
  results: AnalogyResult[];
  visualizationPoints: VectorPoint[];
  explanation: string;
}

export interface PresetAnalogy {
  a: string;
  b: string;
  c: string;
  label: string;
  icon: string;
}
