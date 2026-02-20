
import React, { useState, useEffect, useCallback } from 'react';
import { calculateAnalogy } from './services/geminiService';
import { CalculationResult, PresetAnalogy } from './types';
import { PRESETS, COLORS } from './constants';
import VectorSpace from './components/VectorSpace';

const App: React.FC = () => {
  const [wordA, setWordA] = useState('king');
  const [wordB, setWordB] = useState('man');
  const [wordC, setWordC] = useState('woman');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CalculationResult | null>(null);

  const handleCalculate = useCallback(async () => {
    if (!wordA || !wordB || !wordC) return;
    setLoading(true);
    setError(null);
    try {
      const data = await calculateAnalogy(wordA, wordB, wordC);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to compute vectors. Ensure words are standard nouns or concepts.");
    } finally {
      setLoading(false);
    }
  }, [wordA, wordB, wordC]);

  const applyPreset = (preset: PresetAnalogy) => {
    setWordA(preset.a);
    setWordB(preset.b);
    setWordC(preset.c);
  };

  useEffect(() => {
    // Initial calculation
    handleCalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <header className="w-full text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
          LEXI<span className="gradient-text">VECTOR</span>
        </h1>
        <p className="text-slate-400 max-w-2xl mx-auto text-lg">
          Exploring the geometry of meaning. Perform vector arithmetic on words using 
          simulated high-dimensional embeddings.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full">
        {/* Left Column: Input & Controls */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800 shadow-2xl backdrop-blur-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <i className="fa-solid fa-flask text-blue-400"></i>
              Analogy Builder
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Base Concept</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={wordA}
                    onChange={(e) => setWordA(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-blue-500/50 transition-all font-semibold"
                    placeholder="e.g., King"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.a }}></div>
                </div>
              </div>

              <div className="flex items-center justify-center py-1">
                <div className="h-px bg-slate-800 flex-grow"></div>
                <div className="mx-4 text-slate-600 font-black">-</div>
                <div className="h-px bg-slate-800 flex-grow"></div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Subtract Quality</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={wordB}
                    onChange={(e) => setWordB(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-red-500/50 transition-all font-semibold"
                    placeholder="e.g., Man"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.b }}></div>
                </div>
              </div>

              <div className="flex items-center justify-center py-1">
                <div className="h-px bg-slate-800 flex-grow"></div>
                <div className="mx-4 text-slate-600 font-black">+</div>
                <div className="h-px bg-slate-800 flex-grow"></div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">Add Quality</label>
                <div className="relative group">
                  <input
                    type="text"
                    value={wordC}
                    onChange={(e) => setWordC(e.target.value)}
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-xl px-4 py-3 outline-none focus:border-green-500/50 transition-all font-semibold"
                    placeholder="e.g., Woman"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.c }}></div>
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={loading}
                className={`w-full py-4 mt-4 rounded-xl font-bold text-white transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                  loading 
                    ? 'bg-slate-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/20'
                }`}
              >
                {loading ? (
                  <><i className="fa-solid fa-spinner animate-spin"></i> Computing...</>
                ) : (
                  <><i className="fa-solid fa-bolt"></i> Solve Analogy</>
                )}
              </button>
            </div>
          </div>

          {/* Presets */}
          <div className="bg-slate-900/40 p-6 rounded-3xl border border-slate-800">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Popular Examples</h3>
            <div className="grid grid-cols-1 gap-2">
              {PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => applyPreset(p)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 hover:border-slate-600 transition-all text-left text-sm group"
                >
                  <i className={`fa-solid ${p.icon} w-5 text-slate-500 group-hover:text-blue-400`}></i>
                  <span className="font-medium">{p.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Visualization & Results */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Main Visualization */}
          <div className="flex-grow">
            {result ? (
              <VectorSpace points={result.visualizationPoints} />
            ) : (
              <div className="w-full h-full min-h-[400px] flex items-center justify-center bg-slate-900/20 rounded-2xl border border-dashed border-slate-800">
                <div className="text-center text-slate-500">
                  <i className="fa-solid fa-chart-line text-4xl mb-4"></i>
                  <p>Calculate to see vector visualization</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Details */}
          {result && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <i className="fa-solid fa-list-ol text-purple-400"></i>
                  Closest Vectors
                </h3>
                <div className="space-y-3">
                  {result.results.map((r, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-slate-700/30">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${idx === 0 ? 'bg-purple-600' : 'bg-slate-700'}`}>
                          {idx + 1}
                        </span>
                        <span className="font-mono text-lg font-bold">{r.word}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500" style={{ width: `${r.score * 100}%` }}></div>
                        </div>
                        <span className="text-xs font-mono text-slate-500">{(r.score * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-900/80 p-6 rounded-3xl border border-slate-800">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-100">
                  <i className="fa-solid fa-brain text-blue-400"></i>
                  AI Insights
                </h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {result.explanation}
                </p>
                <div className="mt-6 pt-6 border-t border-slate-800 text-[10px] text-slate-600 uppercase tracking-widest font-bold">
                  Derived from Semantic Distributional Hypothesis
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-4 bg-red-900/20 border border-red-900/50 rounded-xl text-red-400 flex items-center gap-3">
              <i className="fa-solid fa-circle-exclamation"></i>
              {error}
            </div>
          )}
        </div>
      </div>

      <footer className="mt-20 py-8 w-full border-t border-slate-800 text-center text-slate-600 text-sm">
        <p>&copy; 2024 LexiVector. Powered by Google Gemini. Visualizing the semantic space of human language.</p>
      </footer>
    </div>
  );
};

export default App;
