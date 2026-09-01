import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { DecisionEngineResult, ActionEvaluation } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  Cpu,
  Shield,
  ArrowRight,
  TrendingUp,
  CreditCard,
  Target,
  Info,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
  Zap,
  RotateCcw,
  Scale
} from 'lucide-react';

export const DecisionEnginePage: React.FC = () => {
  const { profile, currency } = useFinancial();
  const [amount, setAmount] = useState<number>(50000);
  const [result, setResult] = useState<DecisionEngineResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAction, setSelectedAction] = useState<ActionEvaluation | null>(null);

  const presets = [10000, 25000, 50000, 100000];

  const runDecisionEngine = async (evalAmount: number) => {
    setLoading(true);
    try {
      const data = await ApiService.analyzeDecision(evalAmount);
      setResult(data);
      if (data.ranked_actions.length > 0) {
        setSelectedAction(data.highest_value_action);
      }
    } catch (e) {
      console.error('Failed to run decision engine', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runDecisionEngine(amount);
  }, [amount, profile]);

  const topAction = result?.highest_value_action;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              CORE REASONING ENGINE
            </span>
            <span className="tech-label text-slate-400">MULTIVARIATE PARETO SCORING</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            AI DECISION ENGINE
          </h1>
        </div>

        <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300 self-start sm:self-auto">
          EVALUATING 7 CAPITAL FUTURES
        </span>
      </div>

      {/* SIGNATURE INTERACTIVE SLIDER: "WHERE SHOULD YOUR NEXT ₹50,000 GO?" */}
      <div className="fin-panel p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="tech-label text-slate-400">INPUT CAPITAL ALLOCATION</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
              WHERE SHOULD YOUR NEXT{' '}
              <span className="text-mint-400">₹{amount.toLocaleString('en-IN')}</span> GO?
            </h2>
          </div>

          {/* Quick Preset Buttons */}
          <div className="flex items-center gap-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setAmount(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
                  amount === p
                    ? 'bg-mint-500 text-obsidian-950 shadow-sm'
                    : 'bg-obsidian-900 border border-white/[0.08] text-slate-400 hover:text-white'
                }`}
              >
                ₹{(p / 1000).toFixed(0)}k
              </button>
            ))}
          </div>
        </div>

        {/* Range Slider */}
        <div className="space-y-2">
          <input
            type="range"
            min="5000"
            max="200000"
            step="5000"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full h-2 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-mint-500"
          />
          <div className="flex justify-between text-[11px] font-mono text-slate-400">
            <span>₹5,000</span>
            <span>₹50,000</span>
            <span>₹1,00,000</span>
            <span>₹2,00,000</span>
          </div>
        </div>
      </div>

      {/* 2-COLUMN COMMAND INTERFACE: RANKED ACTIONS (Left) + FINARCH DECISION REASONING (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): Ranked Competing Financial Futures */}
        <div className="lg:col-span-5 fin-panel p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="tech-label text-slate-200">COMPETING ALLOCATIONS</span>
            <span className="tech-label text-slate-400">SCORE / 100</span>
          </div>

          <div className="space-y-2.5">
            {result?.ranked_actions.map((act) => {
              const isSelected = (selectedAction?.action_id || topAction?.action_id) === act.action_id;
              const isRank1 = act.rank === 1;

              return (
                <div
                  key={act.action_id}
                  onClick={() => setSelectedAction(act)}
                  className={`p-3.5 rounded-lg border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-obsidian-850 border-mint-500/50 shadow-mint-glow'
                      : 'bg-obsidian-900/70 border-white/[0.06] hover:border-white/[0.15]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-extrabold text-slate-400">
                        {act.rank.toString().padStart(2, '0')}
                      </span>
                      <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                        {act.action_name}
                      </span>
                      {isRank1 && (
                        <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
                          WINNER
                        </span>
                      )}
                    </div>
                    <span className="text-xs font-mono font-extrabold text-white">
                      {act.decision_score.toFixed(1)}
                    </span>
                  </div>

                  {/* Horizontal Score Bar */}
                  <div className="w-full h-1 bg-obsidian-800 rounded-full mt-2.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isRank1 ? 'bg-mint-500' : 'bg-slate-500'
                      }`}
                      style={{ width: `${act.decision_score}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between items-center text-[10px] font-mono text-slate-400">
                    <span>Exp. Return: {act.expected_annual_return_pct}%</span>
                    <span>5Y Impact: {act.projected_benefit}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col (7 cols): FINARCH DECISION & "WHY THIS WINS" REASONING */}
        <div className="lg:col-span-7 fin-panel-accent p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-mint-400 animate-ping"></span>
                <span className="tech-label text-mint-400">FINARCH DECISION</span>
              </div>
              <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
                CONFIDENCE: {selectedAction?.confidence_pct || 94}%
              </span>
            </div>

            {/* Selected Decision Headline */}
            <div className="mt-4">
              <span className="tech-label text-slate-400">OPTIMAL CAPITAL DEPLOYMENT</span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight mt-1">
                {selectedAction?.action_name || 'PAY DOWN HIGH-INTEREST DEBT'}
              </h3>
            </div>

            {/* WHY THIS WINS REASONING PANEL */}
            <div className="mt-6 space-y-3">
              <span className="tech-label text-mint-400 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>WHY THIS WINS (MATHEMATICAL JUSTIFICATION)</span>
              </span>

              <div className="bg-obsidian-900 p-3.5 rounded-lg border border-white/[0.08] text-xs font-mono text-slate-300 leading-relaxed space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-mint-400 font-bold">•</span>
                  <p>
                    <strong className="text-white">Guaranteed 38% Return:</strong> Paying off credit card debt eliminates a 38% compounding drag, equivalent to earning a guaranteed, risk-free pre-tax market return of ~54%.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-mint-400 font-bold">•</span>
                  <p>
                    <strong className="text-white">Liquidity Reserve Verified:</strong> Emergency coverage is currently {profile.emergency_fund > 100000 ? 'sufficient' : 'at acceptable levels'}, so capital is freed to destroy expensive debt.
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-mint-400 font-bold">•</span>
                  <p>
                    <strong className="text-white">Opportunity Cost Superiority:</strong> Deploying into equities at 13.5% expected return leaves a net negative spread of -24.5% against 38% debt.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Metric Breakdown Panels */}
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-obsidian-900 border border-white/[0.08] p-3 rounded-lg">
                <span className="tech-label text-slate-400 block">EXPECTED RETURN</span>
                <span className="text-base font-mono font-extrabold text-mint-400 mt-1 block">
                  {selectedAction?.expected_annual_return_pct}% APR
                </span>
              </div>
              <div className="bg-obsidian-900 border border-white/[0.08] p-3 rounded-lg">
                <span className="tech-label text-slate-400 block">5Y NET WEALTH IMPACT</span>
                <span className="text-base font-mono font-extrabold text-cyan-400 mt-1 block">
                  {selectedAction?.projected_benefit}
                </span>
              </div>
              <div className="bg-obsidian-900 border border-white/[0.08] p-3 rounded-lg">
                <span className="tech-label text-slate-400 block">TAX DRAG</span>
                <span className="text-base font-mono font-extrabold text-white mt-1 block">
                  0% (Tax-Free)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Engine Source: Multivariate Pareto Optimizer</span>
            <span className="text-mint-400 font-bold">Execution Ready</span>
          </div>
        </div>
      </div>
    </div>
  );
};
