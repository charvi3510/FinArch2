import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { DecisionEngineResult, ActionEvaluation } from '../types';
import { formatCurrency, formatFullCurrency } from '../utils/formatters';
import {
  Cpu,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronRight,
  X,
  Layers,
  HelpCircle
} from 'lucide-react';

export const DecisionEnginePage: React.FC = () => {
  const { profile, currency } = useFinancial();
  const [amount, setAmount] = useState<number>(10000);
  const [result, setResult] = useState<DecisionEngineResult | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAction, setSelectedAction] = useState<ActionEvaluation | null>(null);

  const presetAmounts = [5000, 10000, 25000, 50000, 100000];

  const runEvaluation = async (evalAmt: number) => {
    setLoading(true);
    try {
      const res = await ApiService.analyzeDecision(evalAmt);
      setResult(res);
    } catch (e) {
      console.error('Decision engine evaluation failed:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runEvaluation(amount);
  }, [amount, profile]);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 font-mono tracking-tight">
              AI DECISION <span className="text-cyan-400">ENGINE</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Core Intelligence
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Answers the fundamental question: <strong className="text-slate-200">"What should I do with my money?"</strong> by evaluating competing actions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-300">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>Multi-Objective Evaluator</span>
        </div>
      </div>

      {/* Interactive Capital Amount Selector */}
      <div className="glass-panel p-6 rounded-3xl border border-cyan-500/30 shadow-card-elevated">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              Capital Under Evaluation
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-100 mt-1">
              "Where should your next {formatFullCurrency(amount, currency)} go?"
            </h3>
          </div>

          {/* Quick preset amount chips */}
          <div className="flex flex-wrap gap-2">
            {presetAmounts.map((preset) => (
              <button
                key={preset}
                onClick={() => setAmount(preset)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all ${
                  amount === preset
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan font-bold'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {formatCurrency(preset, currency)}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full flex-1">
            <input
              type="range"
              min="1000"
              max="200000"
              step="1000"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-400 mt-1">
              <span>{formatCurrency(1000, currency)}</span>
              <span>{formatCurrency(50000, currency)}</span>
              <span>{formatCurrency(100000, currency)}</span>
              <span>{formatCurrency(200000, currency)}</span>
            </div>
          </div>

          <div className="w-full sm:w-48">
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Math.max(Number(e.target.value), 0))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-slate-100 font-mono text-sm text-right focus:border-cyan-400 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Safety Warnings if any */}
      {result?.safety_warnings && result.safety_warnings.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-400 uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>Suitability & Safety Alert</span>
          </div>
          {result.safety_warnings.map((w, idx) => (
            <p key={idx} className="leading-relaxed">
              • {w}
            </p>
          ))}
        </div>
      )}

      {/* Ranked Actions Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Ranked Competing Actions ({result?.ranked_actions.length || 0} Evaluated)
          </span>
          <span className="text-[11px] text-slate-400">Sorted by Multi-Objective Score</span>
        </div>

        {loading ? (
          <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center text-slate-400">
            <Cpu className="w-8 h-8 animate-spin text-cyan-400 mx-auto mb-3" />
            <span>Evaluating portfolio trade-offs & mathematical optimization...</span>
          </div>
        ) : (
          result?.ranked_actions.map((act, index) => {
            const isWinner = index === 0;
            return (
              <div
                key={act.action_id}
                className={`glass-panel p-5 sm:p-6 rounded-3xl border transition-all duration-200 ${
                  isWinner
                    ? 'border-cyan-500/40 bg-slate-950/80 shadow-glow-cyan'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left info */}
                  <div className="flex items-start gap-4">
                    {/* Rank Badge */}
                    <div
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-mono font-bold text-base shrink-0 ${
                        isWinner
                          ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-slate-950 shadow-glow-cyan'
                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                      }`}
                    >
                      #{act.rank}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-100">{act.action_name}</h3>
                        {isWinner && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            ★ OPTIMAL CHOICE
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-400 mt-1 leading-relaxed max-w-2xl">
                        {act.recommendation_summary}
                      </p>
                    </div>
                  </div>

                  {/* Right Metrics Badges */}
                  <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                    {/* Expected Return */}
                    <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-center min-w-[90px]">
                      <span className="text-[10px] text-slate-400 uppercase block">Return</span>
                      <span className="text-sm font-mono font-bold text-emerald-400">
                        {act.expected_annual_return_pct}% APR
                      </span>
                    </div>

                    {/* Risk Badge */}
                    <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-center min-w-[85px]">
                      <span className="text-[10px] text-slate-400 uppercase block">Risk</span>
                      <span
                        className={`text-xs font-mono font-bold ${
                          act.risk_level === 'LOW'
                            ? 'text-emerald-400'
                            : act.risk_level === 'MODERATE'
                            ? 'text-amber-400'
                            : 'text-rose-400'
                        }`}
                      >
                        {act.risk_level}
                      </span>
                    </div>

                    {/* Decision Score */}
                    <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-center min-w-[80px]">
                      <span className="text-[10px] text-slate-400 uppercase block">Score</span>
                      <span className="text-sm font-mono font-bold text-cyan-400">
                        {act.decision_score}/100
                      </span>
                    </div>

                    {/* 5Y Wealth */}
                    <div className="bg-slate-900/90 px-3 py-2 rounded-xl border border-slate-800 text-center min-w-[100px]">
                      <span className="text-[10px] text-slate-400 uppercase block">5Y Wealth</span>
                      <span className="text-xs font-mono font-bold text-slate-200">
                        {formatCurrency(act.five_year_projected_wealth, currency)}
                      </span>
                    </div>

                    {/* Explain Button */}
                    <button
                      onClick={() => setSelectedAction(act)}
                      className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-semibold transition-colors flex items-center gap-1 shrink-0"
                    >
                      <span>Why?</span>
                      <ChevronRight className="w-3.5 h-3.5 text-cyan-400" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Explainability Drilldown Modal */}
      {selectedAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-150">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-cyan-500/40 shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => setSelectedAction(null)}
              className="absolute top-6 right-6 p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 text-cyan-400 text-xs font-mono font-bold uppercase">
              <Sparkles className="w-4 h-4" />
              <span>Deep Financial Reasoning Drilldown</span>
            </div>

            <h3 className="text-2xl font-bold text-slate-100 mt-2">
              {selectedAction.action_name}
            </h3>

            <div className="mt-4 p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs sm:text-sm text-cyan-200 leading-relaxed">
              <strong>Engine Rationale: </strong>
              {selectedAction.recommendation_summary}
            </div>

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block mb-2">
                  Advantages
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedAction.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
                <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block mb-2">
                  Risks & Constraints
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {selectedAction.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400">
              <span className="font-semibold text-slate-300 block mb-1">Key Assumptions:</span>
              <ul className="list-disc list-inside space-y-1">
                {selectedAction.key_assumptions.map((a, idx) => (
                  <li key={idx}>{a}</li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedAction(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
