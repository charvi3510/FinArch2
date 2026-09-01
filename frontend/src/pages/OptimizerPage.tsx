import React, { useState, useEffect } from 'react';
import { useFinancial } from '../context/FinancialContext';
import { ApiService } from '../services/api';
import { OptimizationResult } from '../types';
import { formatCurrency, formatPercentage } from '../utils/formatters';
import {
  Sliders,
  TrendingUp,
  Shield,
  Clock,
  ArrowRight,
  Scale,
  Sparkles,
  Zap,
  RotateCcw
} from 'lucide-react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export const OptimizerPage: React.FC = () => {
  const { profile, currency } = useFinancial();
  const [weights, setWeights] = useState({
    expected_return: 0.35,
    risk_reduction: 0.20,
    liquidity: 0.15,
    debt_payoff: 0.20,
    goal_alignment: 0.10,
  });

  const [amount, setAmount] = useState<number>(50000);
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchOptimization = async () => {
    setLoading(true);
    try {
      const data = await ApiService.optimizeOpportunity(amount, weights);
      setResult(data);
    } catch (e) {
      console.error('Optimization error:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOptimization();
  }, [weights, amount, profile]);

  const handleWeightChange = (key: string, val: number) => {
    setWeights((prev) => ({ ...prev, [key]: val }));
  };

  const handleResetWeights = () => {
    setWeights({
      expected_return: 0.35,
      risk_reduction: 0.20,
      liquidity: 0.15,
      debt_payoff: 0.20,
      goal_alignment: 0.10,
    });
  };

  const paretoScatterData =
    result?.comparison_table.map((item) => ({
      name: item.action,
      returnVal: item.expected_return_num,
      riskVal: item.risk === 'LOW' ? 20 : item.risk === 'MEDIUM' ? 50 : 80,
      utilityScore: item.score,
      isBest: item.action === result.best_action.action,
    })) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2">
            <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
              PARETO UTILITY OPTIMIZER
            </span>
            <span className="tech-label text-slate-400">DYNAMIC MULTI-OBJECTIVE WEIGHTING</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-mono tracking-tight mt-1">
            OPPORTUNITY OPTIMIZER
          </h1>
        </div>

        <button
          onClick={handleResetWeights}
          className="px-3.5 py-1.5 rounded-md bg-obsidian-900 hover:bg-obsidian-850 border border-white/[0.12] text-xs font-mono text-slate-300 hover:text-white transition-all flex items-center gap-1.5 self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Weights</span>
        </button>
      </div>

      {/* 2-COLUMN SPLIT: WEIGHT SLIDERS (Left) + PARETO TRADEOFF VISUALIZATION (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col (5 cols): 5 Objective Weight Controls */}
        <div className="lg:col-span-5 fin-panel p-6 sm:p-7 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
            <span className="tech-label text-slate-200">OBJECTIVE PREFERENCE WEIGHTS</span>
            <span className="tech-label text-mint-400">LIVE CALCULATING</span>
          </div>

          {/* Weight 1: Return */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">1. Expected Return Maximization</span>
              <span className="text-mint-400 font-bold">{Math.round(weights.expected_return * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weights.expected_return}
              onChange={(e) => handleWeightChange('expected_return', Number(e.target.value))}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-mint-500"
            />
          </div>

          {/* Weight 2: Risk Reduction */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">2. Downside Risk Minimization</span>
              <span className="text-cyan-400 font-bold">{Math.round(weights.risk_reduction * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weights.risk_reduction}
              onChange={(e) => handleWeightChange('risk_reduction', Number(e.target.value))}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          {/* Weight 3: Liquidity */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">3. Immediate Liquidity Access</span>
              <span className="text-white font-bold">{Math.round(weights.liquidity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weights.liquidity}
              onChange={(e) => handleWeightChange('liquidity', Number(e.target.value))}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-white"
            />
          </div>

          {/* Weight 4: Debt Payoff */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">4. High-Cost Debt Elimination</span>
              <span className="text-crimson-400 font-bold">{Math.round(weights.debt_payoff * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weights.debt_payoff}
              onChange={(e) => handleWeightChange('debt_payoff', Number(e.target.value))}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-crimson-500"
            />
          </div>

          {/* Weight 5: Goal Alignment */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-semibold">5. Milestone Goal Velocity</span>
              <span className="text-amber-400 font-bold">{Math.round(weights.goal_alignment * 100)}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={weights.goal_alignment}
              onChange={(e) => handleWeightChange('goal_alignment', Number(e.target.value))}
              className="w-full h-1.5 bg-obsidian-800 rounded-lg appearance-none cursor-pointer accent-amber-400"
            />
          </div>
        </div>

        {/* Right Col (7 cols): Pareto Trade-off Scatter & Best Winner Banner */}
        <div className="lg:col-span-7 space-y-6">
          {/* Winner Banner */}
          <div className="fin-panel-accent p-5 flex items-center justify-between">
            <div>
              <span className="tech-label text-mint-400">CURRENT PARETO OPTIMAL ACTION</span>
              <h3 className="text-xl font-extrabold font-mono text-white mt-0.5">
                {result?.best_action.action || 'PAY DOWN HIGH-INTEREST DEBT'}
              </h3>
            </div>
            <div className="text-right">
              <span className="tech-label text-slate-400">UTILITY SCORE</span>
              <span className="text-2xl font-mono font-extrabold text-mint-400 block">
                {result?.best_action.score.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Visual Pareto Trade-Off Scatter Chart */}
          <div className="fin-panel p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div>
                <span className="tech-label text-slate-400">PARETO EFFICIENT FRONTIER</span>
                <h3 className="text-base font-bold text-white font-mono">RISK VS. RETURN TRADEOFF</h3>
              </div>
              <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
                Bubble Size = Utility Score
              </span>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
                  <XAxis
                    type="number"
                    dataKey="returnVal"
                    name="Expected Return"
                    unit="%"
                    stroke="#4A5B68"
                    fontSize={11}
                    label={{ value: 'Expected Annual Return (%)', position: 'bottom', offset: -5, fill: '#64748b', fontSize: 10 }}
                  />
                  <YAxis
                    type="number"
                    dataKey="riskVal"
                    name="Risk Exposure"
                    stroke="#4A5B68"
                    fontSize={11}
                    label={{ value: 'Risk Rating', angle: -90, position: 'left', fill: '#64748b', fontSize: 10 }}
                  />
                  <ZAxis type="number" dataKey="utilityScore" range={[100, 500]} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0A0D0F', borderColor: '#222B32', borderRadius: '8px' }}
                    formatter={(val: any, name: any) => [name === 'utilityScore' ? Number(val).toFixed(1) : val, name]}
                  />
                  <Scatter data={paretoScatterData}>
                    {paretoScatterData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.isBest ? '#00f59b' : '#323E48'} />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* FULL-WIDTH COMPARISON TABLE */}
      <div className="fin-panel p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
          <div>
            <span className="tech-label text-slate-400">DETAILED ALLOCATION SCENARIOS</span>
            <h3 className="text-base font-bold text-white font-mono">OPPORTUNITY RANKING MATRIX</h3>
          </div>
          <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
            ₹{amount.toLocaleString('en-IN')} ALLOCATION
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono text-slate-300">
            <thead className="bg-obsidian-900 text-slate-400 uppercase text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Financial Action</th>
                <th className="p-3">Expected Return</th>
                <th className="p-3">5Y Projected Wealth</th>
                <th className="p-3">Risk Exposure</th>
                <th className="p-3">Liquidity Rating</th>
                <th className="p-3 text-right">Utility Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.05]">
              {result?.comparison_table.map((item, idx) => {
                const isWinner = item.action === result.best_action.action;
                return (
                  <tr key={item.action} className={isWinner ? 'bg-obsidian-900/80' : 'hover:bg-obsidian-900/40'}>
                    <td className="p-3 font-extrabold text-slate-400">{(idx + 1).toString().padStart(2, '0')}</td>
                    <td className="p-3 font-sans font-bold text-white flex items-center gap-2">
                      <span>{item.action}</span>
                      {isWinner && (
                        <span className="tech-badge bg-mint-500/10 text-mint-400 border border-mint-500/30">
                          OPTIMAL
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-mint-400 font-bold">{item.expected_return}</td>
                    <td className="p-3 text-white font-bold">{formatCurrency(item.five_year_wealth, currency)}</td>
                    <td className="p-3">
                      <span className="tech-badge bg-obsidian-900 border border-white/[0.08] text-slate-300">
                        {item.risk}
                      </span>
                    </td>
                    <td className="p-3 text-slate-300">{item.liquidity}</td>
                    <td className="p-3 text-right font-extrabold text-white">{item.score.toFixed(1)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
